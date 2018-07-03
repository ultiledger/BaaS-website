let multer = require('multer');
let uuid = require('node-uuid'); //v1 是基于时间戳生成uuid,v4是随机生成uuid
const fs = require('fs'); // node自带的文件系统
let fileConfig = require('../config/sfpConfig');

let storage = multer.diskStorage({
    //设置上传后文件路径，uploads文件夹会自动创建。
    destination: function (req, file, cb) {
        let filePath = fileConfig.fileUpload.path;
        /*if (!fs.existsSync('./upload')) {
            fs.mkdirSync('./upload');
        }*/
        if (!fs.existsSync(filePath)) {
            fs.mkdirSync(filePath);
        }
        cb(null, filePath);
    },
    //给上传文件重命名，获取添加后缀名
    filename: function (req, file, cb) {
        let fileFormat = (file.originalname).split(".");
        let fileName = uuid.v1().replace(/-/g, '');
        cb(null,  fileName+ "." + fileFormat[fileFormat.length - 1]);
    }
});

let upload = multer({
    storage
});

module.exports = upload;