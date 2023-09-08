const { deleteAllFilesInDirPath } = require("../../../utilities")


module.exports = async function(dirPath)   {

    return await deleteAllFilesInDirPath(dirPath, true);

}