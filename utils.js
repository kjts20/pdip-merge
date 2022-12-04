const compressing = require("compressing");
const fs = require("fs");
const { resolve } = require("path");

// 解压
const unzip = function (zipFile, workDir) {
    return new Promise((resolve, reject) => {
        compressing.zip
            .uncompress(zipFile, workDir)
            .then(() => {
                resolve();
            })
            .catch((err) => {
                reject(err);
            });
    });
};

// 删除目录/文件
function deleteFileOrFolder(fileOrFolder) {
    if (fs.existsSync(fileOrFolder)) {
        const stat = fs.statSync(fileOrFolder);
        if(stat.isFile()){
            fs.unlinkSync(fileOrFolder);
        }else if(stat.isDirectory()){
            fs.readdirSync(fileOrFolder).forEach((file) => {
                deleteFileOrFolder(resolve(fileOrFolder,file));
            });
            fs.rmdirSync(fileOrFolder);
        }
    }
};

module.exports = {
    test: 1,
    unzip,
    deleteFileOrFolder
};
