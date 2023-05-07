const path = require("path");
const { writeFileSync, fileExists, writeFile, readFile, mkdirSync } = require("../../../utilities");

module.exports = function(targetPath, fileName) {

    class JsonFile {

        constructor(targetPath, fileName) {
            this.targetPath = targetPath;
            this.fileName = fileName;
            this.filePath = path.join(this.targetPath, this.fileName);
            if(!fileExists(this.targetPath))    {
                mkdirSync(this.targetPath);
            }
            if(!fileExists(this.filePath))    {
                console.log("it doesn't")
                let result = writeFileSync(this.filePath, `[]`);
                console.log(result);
            }
        }

        async getSavedData() {
            let readResult = await readFile(this.filePath);
            return JSON.parse(readResult.data);
        }

        async addData(data)  {
            let savedData = await getSavedData();

            return await writeFile(this.filePath, JSON.stringify([...savedData, ...data], null, 4))
        }

        async addNewData(data)  {
            return await writeFile(this.filePath, JSON.stringify(data, null, 4))
        }

        async clearData() {
            return await addNewData([]);
        }

    }

    return new JsonFile(targetPath, fileName);

}