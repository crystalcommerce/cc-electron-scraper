const crypto = require("crypto");
const path = require("path");
const { deleteFile, toUrl, toNormalString, enumerate, moderator } = require("../../../utilities");

module.exports = function(model) {
    
    class Database  {

        constructor(model)  {
            this.model = model;
            this.recordName;
            this.removeUnlistedProps = false;
            Object.defineProperties(this, {
                hashedProps : {
                    value : [],
                    enumerable : true,
                },
                immutableProps : {
                    value : ["_id"],
                    enumerable : true,
                },
                hashedProps : {
                    value : [],
                    enumerable : true,
                },
                uniqueProps : {
                    value : [],
                    enumerable : true,
                },
                friendlyUrlProps : {
                    value : [],
                    enumerable : true,
                },
                defaultValuedProps : {
                    value : [],
                    enumerable : true,
                },
                uniqueUrlConstraints : {
                    value : [],
                    enumerable : true,
                },
                maxMultipleCreateLimit : {
                    value : 50,
                    enumerable : true,
                }
            });
            
        }

        setRecordName(recordName) {
            this.recordName = recordName;
        }

        // db helper functions
        addProps(classProp, ...propNames)  {
            for(let propName of propNames)  {
                if(this[classProp] && !this[classProp].includes(propName))  this[classProp].push(propName);
            }
        }

        stringHash(str, separator = ".") {
            let salt = crypto.randomBytes(8).toString("hex"),
                buffer = crypto.scryptSync(str, salt, 64).toString("hex");

            return `${buffer}${separator}${salt}`;
        }

        hashCompare(str, savedHash, separator = ".")    {
            let salt = savedHash.split(separator).pop(),
                buffer = crypto.scryptSync(str, salt, 64).toString("hex");
            
            return `${buffer}${separator}${salt}` === savedHash;
        }
        
        hashListedProps(data)   {
            for(let prop of this.hashedProps)   {
                if(data[prop])  {
                    data[prop] = this.stringHash(data[prop]);
                }
            }
        }

        removeImmutableProps(data)  {
            let unsavedDataProps = [];
            for(let key in data)    {
                if(this.immutableProps.includes(key))    {
                    unsavedDataProps.push({[key] : data[key]});
                    delete(data[key]);
                }
            }

            return {data, unsavedDataProps};
        }

        async removeNonUniqueProps(data, foundRecord)  {
            let unsavedDataProps = [];

            for(let prop of this.uniqueProps)   {
                if(data[prop])  {
                    let result = await this.getAllFilteredData({_id : {$ne : foundRecord._id}, [prop] : data[prop]});
                    if(result.length)   {
                        unsavedDataProps.push({[prop] : data[prop]});
                        delete(data[prop]);
                    }
                } 
            }

            return {data, unsavedDataProps};
            
        }

        removeSamePropertyValues(data, foundRecord) {
            let unsavedDataProps = [];
            for(let key in data)    {
                if(
                    (JSON.stringify(data[key]) === JSON.stringify(foundRecord[key])) || 
                    this.hashedProps.includes(key) && this.hashCompare(data[key], foundRecord[key])
                )  {
                    unsavedDataProps.push({[key] : data[key]});
                    delete(data[key]);
                }
            }

            return {data, unsavedDataProps};
        }

        setDefaultValuedProps(data) {
            for(let prop of this.defaultValuedProps)    {
                for(let key in prop)    {
                    data[key] = typeof data[key] !== "undefined" ? data[key] : prop[key];
                }
            }
        }

        async checkUniqueProps(data)    {
            let results = [];
            for(let prop of this.uniqueProps)   {
                let result = await this.getAllFilteredData({[prop] : data[prop]});
                results.push({key : prop, isUnique : Boolean(!result.length)});
            }
            let isUnique = results.every(res => res.isUnique),
                noneUniqueProps = results.filter(res => !res.isUnique)
            return { statusOk : isUnique, noneUniqueProps }; // the value of statusOk is boolean;
        }   

        createFilterFromProps(data, ...propNames) {
            let filter = {};
            for(let prop  of propNames)    {
                if(data[prop])  {
                    filter[prop] = data[prop];
                }
            }
            return filter;
        }

        removeInvalidProps(data)    {
            if(this.removeUnlistedProps)    {
                let schemaKeys = Object.keys(this.model.schema.obj);
                for(let key in data)    {
                    if(!schemaKeys.includes(key))   {
                        delete(data[key]);
                    }
                }
            }
        }

        // db methods that require checking the collection for results;

        async filterRecordsByUrlConstraints(data) {
            if(this.uniqueUrlConstraints.length)   {
                let filter = this.createFilterFromProps(data, ...this.uniqueUrlConstraints);
                return await this.getAllFilteredData({ friendlyUrl : { $regex : data.friendlyUrl, $options : "i" }, ...filter});
            } else  {
                return await this.getAll();;
            }
        }

        async isUniqueFriendlyUrl(data)  {
            let filter = this.createFilterFromProps(data, ...this.uniqueUrlConstraints),
                result = await this.getOneByFilter({ friendlyUrl : { $regex : data.friendlyUrl, $options : "i" }, ...filter});
            return result ? false : true;      
        }

        findUnusedArrIndex(arr) {
            arr.sort((a, b) => a - b);
            
            let unusedNum,
                maxNum = Math.max(...arr, arr.length + 1);
            
            for(let i = 1; i <= maxNum; i++) {
                if(!arr.includes(i))  {
                    unusedNum = i;
                    break;
                }
            }

            return unusedNum;
        }

        getIndexFromFriendlyUrl(url)    {
            let possibleIndex = Number(url.trim().split("-").pop());
            return !isNaN(possibleIndex) ? possibleIndex : 1;
        }

        getUnusedFriendlyUrlIndex(url, records)    {
            let foundMatches = records.filter(record => {
                    return record.friendlyUrl.includes(`${url}`) && !isNaN(Number(record.friendlyUrl.slice(`${url}`.length)));
                }),
                indexes = foundMatches.length ? foundMatches.map(item => this.getIndexFromFriendlyUrl(item.friendlyUrl) || 1) : [1];
            return this.findUnusedArrIndex(indexes);    
        }

        async createFriendlyUrlFromListedProps(data)   {

            if(!this.friendlyUrlProps.length)   {
                return;
            }


            let output = "";
            for(let prop of this.friendlyUrlProps)  {
                output += data[prop].trim() + " ";
            }
            let url = toUrl(output);
            
            // do the checking...
            data.friendlyUrl = url;
            let isUniqueFriendlyUrl = await this.isUniqueFriendlyUrl(data);

            if(isUniqueFriendlyUrl)  {
                data.friendlyUrl = url;
            } else  {
                let filteredRecords = await this.filterRecordsByUrlConstraints(data),
                    unusedIndex = this.getUnusedFriendlyUrlIndex(url, filteredRecords);

                if(unusedIndex === 1)   {
                    data.friendlyUrl = url;
                } else  {
                    data.friendlyUrl = `${url}-${unusedIndex}`;
                }
            }
        }

        async updateFriendlyUrl(data, records) {
            let uniqueResult = await this.isUniqueFriendlyUrl(data);

            if(!uniqueResult)  {
                let unusedIndex = this.getUnusedFriendlyUrlIndex(data.friendlyUrl, records);
                data.friendlyUrl = `${data.friendlyUrl}${unusedIndex === 1 ? "" : `-${unusedIndex}`}`;
            }
        }

        // read
        async getAll()    {
            let data = await this.model.find();

            return data.map(item => item.toObject());
        }

        async getById(id)    {
            return await this.model.findById(id).lean().exec();
        }

        async getOneByFilter(filter)    {
            return await this.model.findOne(filter).lean().exec();
        }

        async getAllFilteredData(filter)  {
            let data = await this.model.find(filter);
            return data.map(item => item.toObject());
        }

        async getPaginatedResults(filter, fields = null, pageObject = { skip: 0, limit: 10 }) {
            let { skip, limit } = pageObject,
                totalCount = await this.model.countDocuments(filter),
                pageTotal = Math.ceil(totalCount / limit),
                data = await this.model.find(filter, fields, pageObject);

            data = data.map(item => item.toObject());

            return {
                totalCount, 
                pageTotal,
                data,
            }
        }

        // create
        async create(data)  {
            // let uniqueCheckResult = await this.checkUniqueProps(data);

            // if(!uniqueCheckResult.statusOk) {
            //     throw Error
            // }

            // remove invalid data properties;
            this.removeInvalidProps(data);


            // if unique test passed;
            this.hashListedProps(data);
            this.setDefaultValuedProps(data);
            await this.createFriendlyUrlFromListedProps(data);
            
            try{
                let resultData = await this.model.create(data);

                return {
                    statusOk : true,
                    message : `We have successfully created a new ${this.recordName}.`,
                    data : resultData,
                }
            }
            catch(err)  {

                if(err.code === 11000)  {
                    return {
                        statusOk : false,
                        message : `The ${this.recordName}'s ${enumerate(this.uniqueProps)} may have been already used by another ${this.recordName}.`,
                    }
                } else  {
                    return {
                        statusOk : false,
                        message : err.message,
                    }
                }

            }
        }

        async createMultiple(multipleData)  {
            try {

                let createResults = [];

                await moderator(multipleData, async (slicedArr) => {

                    let promises = slicedArr.map(item => { 
                        return async () => {
                            let createResult = await this.create(item);

                            createResults.push(createResult);
                        }
                    });

                    await Promise.all(promises.map(item => item()));

                }, this.maxMultipleCreateLimit);

                return createResults;

            } catch(err)    {
                return {
                    statusOk : false, 
                    message : `We have encountered some problems while saving rows of data to db.`,
                    error : err.message,
                    data : multipleData
                };
            }

            // try {
                
            //     let resultsArr = [];
        
            //     await moderator(multipleData, async (slicedArr) => {

            //         let batch = [],
            //             promises = slicedArr.map(data => {
            //                 return async () => {
            //                     this.removeInvalidProps(data);


            //                     // if unique test passed;
            //                     this.hashListedProps(data);
            //                     this.setDefaultValuedProps(data);
            //                     await this.createFriendlyUrlFromListedProps(data);

            //                     batch.push(data);
            //                 }
            //             });

            //         await Promise.all(promises.map(item => item()));

            //         let results = await this.model.insertMany(batch);

            //         resultsArr.push(results);
                    
            //     }, 5);

            //     return {
            //         statusOk : true, 
            //         message : `We have successfully created multiple rows of data for ${this.recordName}.`,
            //         data : resultsArr,
            //     };

            // } catch(err)    {

            //     if(err.code)

            //     return {
            //         statusOk : false, 
            //         message : `We have encountered some problems while saving rows of data to db.`,
            //         data : multipleData
            //     };
            // }

            
        }
    
        // update
        async update(id, data)  {
            let foundRecord = await this.getById(id),
                filteredRecords;  

            // no found record
            if(!foundRecord)    {
                return {
                    statusOk : false,
                    message : `We were unable to find a ${this.recordName} with an id of ${id}. No ${this.recordName} was updated.`,
                }
            }


            // remove invalid data properties;
            this.removeInvalidProps(data);

            // removeImmutableProps
            let resultObject = this.removeImmutableProps(data),
                unsavedData = [];
            // we add the unsaved data properties
            resultObject.unsavedDataProps.length ? unsavedData.push({
                fields : [...resultObject.unsavedDataProps],
                reason : "Data cannot be modified",
            }) : null;   
            // check if there are still properties to be updated
            if(!Object.keys(data).length)   {
                return {
                    statusOk : false,
                    unsavedData,
                }
            }

            // removeNonUniqueProps
            resultObject = await this.removeNonUniqueProps(data, foundRecord);
            // we add the unsaved data properties
            resultObject.unsavedDataProps.length ? unsavedData.push({
                fields : [...resultObject.unsavedDataProps],
                reason : `Data is already being used by another ${this.recordName}`,
            }) : null;
            // check if there are still properties to be updated
            if(!Object.keys(data).length)   {
                return {
                    statusOk : false,
                    unsavedData
                }
            }


            // removeSamePropertyValues
            resultObject = this.removeSamePropertyValues(data, foundRecord);
            // we add the unsaved data properties
            resultObject.unsavedDataProps.length ? unsavedData.push({
                fields : [...resultObject.unsavedDataProps],
                reason : `Data we have in our ${this.recordName}s' database is the same.`,
            }) : null;
            // check if there are still properties to be updated
            if(!Object.keys(data).length)   {
                return {
                    statusOk : false,
                    unsavedData
                }
            }

            // update friendly url
            if(data.friendlyUrl)    {
                filteredRecords = await this.filterRecordsByUrlConstraints(data);
                await this.updateFriendlyUrl(data, filteredRecords);
            }

            // hash properties that are supposed to be hashed string.
            this.hashListedProps(data);

            // update the data in the database...
            await this.model.updateOne({_id : foundRecord._id}, data);
            
            return {
                statusOk : true,
                message : `We have successfully updated the ${this.recordName}'s ${enumerate(Object.keys(data).map(item => toNormalString(item)), true)} in our ${this.recordName}s' database.`,
                data : await this.getById(id),
                unsavedData
            }
            
        }
    
        // delete
        async delete(id)  {
            let foundMatch = await this.getById(id);

            if(!foundMatch)  {
                return {
                    statusOk : false,
                    message : `We were unable to find a ${this.recordName} with the id ${id}`,
                }
            }

            try {
                await this.model.findByIdAndDelete(id);
                
                // delete file here;
;               // kind of clunky way of deleting image files related to the data;
                if(foundMatch.imagePaths)  {
                    for(let imagePath of foundMatch.imagePaths) {
                        await deleteFile(path.join(process.cwd(), imagePath));
                    }
                }

                return {
                    statusOk : true,
                    message : `We have successfully deleted the ${this.recordName} with an id of ${id}`,
                }
            } catch(err)    {
                return {
                    statusOk : false,
                    message : err.message,
                }
            }
            
        }

        async deleteMultiple(filter)  {
            let foundMatches = await this.getAllFilteredData(filter);
            
            if(!foundMatches)   {
                return {
                    statusOk : false,
                    message : `We were unable to find ${this.recordName}s that matches the filter. No ${this.recordName}s were deleted.`
                }
            }

            let {deletedCount} = await this.model.deleteMany(filter);

            return {
                statusOk : true,
                message : `We have successfully deleted the ${deletedCount} ${this.recordName}s.`,
            }
        }
    
    }

    return new Database(model);
    
}