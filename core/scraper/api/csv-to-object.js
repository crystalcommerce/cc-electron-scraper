const fs = require("fs");
const { readFile, toCamelCase } = require("../../../utilities");


module.exports = async function(filePath)    {
    if(!fs.existsSync(filePath))    {
        return [];
    }
    let { data } = await readFile(filePath);
    if(data.trim() === "")  {
        return [];
    }
    let splitter = "====mnm7747splitter7747mnm====",
        lines = data.toString().replace(/(\n)(?=(?:[^"]|"[^"]*")*$)/g, splitter).split(splitter).filter(item => item.length);
        objectKeys = lines.shift().split(',').map(item => toCamelCase(item.trim()));

    return lines.map(line => {
        let values = line.replace(/(,)(?=(?:[^"]|"[^"]*")*$)/g, splitter).split(splitter),
            object = {};

        for(let i = 0; i < objectKeys.length; i++)  {
            object[objectKeys[i]] = values[i].trim();
        }
        return object;
    });
}