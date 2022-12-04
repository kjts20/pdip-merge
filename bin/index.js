#!/usr/bin/env node
const fs = require('fs');
const {resolve, dirname} = require('path');
const {unzip, deleteFileOrFolder} = require('../utils');

// 增量包组成
const increamentFilePart = {
    // 清单文件
    MANIFEST: '.MANIFEST',
    // 根目录
    ROOT: 'root'
};

// 日志方面
const logger = {
    log: console.log,
    warn: console.warn,
    error: console.error
};

// 合并增量文件
const mergePdip = async function(sourceDir, increamentFileName){
    // ==========  第一步： 解压赠量包 =======
    // 解压目录
    const workDir = `/tmp/copyto-${Math.floor(Math.random() * 100000)}`;
    // 解压
    await unzip(increamentFileName,workDir);
    logger.log("生成的临时目录：" + workDir);
    // =========  检测增量包格式 ===============
    // 清单文件名
    const manifestFileName = resolve(workDir, increamentFilePart.MANIFEST);
    // 增量包根目录
    const increamentRoot = resolve(workDir, increamentFilePart.ROOT);
    // =========== 第二步： 文件处理  ==============
    if(fs.existsSync(manifestFileName) && fs.existsSync(increamentRoot)){
        logger.log("开始合并增量包...")
         // 获取清单文件
        const manifest =  fs.readFileSync(manifestFileName);
        const manifestJson = JSON.parse(manifest.toString());
        // 删除文件
        const deleteFiles = manifestJson.DELETE || [];
        logger.log("删除文件开始...");
        for (const file of deleteFiles) {
            deleteFileOrFolder(resolve(sourceDir, file));
        }
        logger.log("删除文件结束...");
        // 添加/修改
        const copyFiles = [...(manifestJson.ADD || []), ...(manifestJson.UPDATE || [])];
        logger.log("添加/修改开始...");
        for (const file of copyFiles) {
            const iFileName = resolve(increamentRoot, file);
            if(fs.existsSync(iFileName)){
                // 目录不存在就先创建目录
                const gFileName = resolve(sourceDir, file);
                const gFileFolder = dirname(gFileName);
                if(!fs.existsSync(gFileFolder)){
                    fs.mkdirSync(gFileFolder, {recursive: true});
                }
                // 复制文件
                fs.copyFileSync(iFileName, gFileName);
            }
        }
        logger.log("添加/修改结束...");
        logger.log("合并完成！！！")
    }else{
        logger.error("增量包格式错误！！！");
    }
    // =========== 第四步： 删除临时文件  ==============
    deleteFileOrFolder(workDir);
    logger.log("删除生成的临时目录");
};

// 初始化函数
const  init = function(pdipFile, workDir){
    if(fs.existsSync(pdipFile)){
        mergePdip(workDir, pdipFile);
    }else{
        if(pdipFile){
            logger.error(`增量包文件：「${pdipFile}」不存在！！！`);
        }else{
            logger.error(`没有指定增量包！！！`);
        }
    }
};

// 初始化
init(process.argv[2], process.cwd());