let mysql = require('../public/mysql');
let express = require('express');
let router = express.Router();
let uuid = require('node-uuid'); //v1 是基于时间戳生成uuid,v4是随机生成uuid
let debug = require('debug')('dev:getData');
let pubfileSQL = require('../db/pubfilesql');
// let sfpClient = require('ssh2-sftp-client');
// let fileConfig = require('../public/config/sfpConfig');
let upload = require('../public/utils/multerUtil');
let moment =  require('moment');
let MsgType = require('../public/utils/constants');

// 上传
// 通过设置maxCount来限制上传最大数量，也可以不设置，这些文件的信息保存在 req.files
router.post('/pub-file/upload',upload.single('file'), function (req, res) {
   /* let sftp = new sfpClient();
    sftp.connect({
        host: fileConfig.sftConfig.ip,
        port: fileConfig.sftConfig.port,
        username: fileConfig.sftConfig.user,
        password: fileConfig.sftConfig.password
    }).then(() => {
        return sftp.put(req.file.path, fileConfig.sftConfig.path+req.file.filename);
    }).then(() => {
      let fileId = uuid.v1().replace(/-/g,'');
      mysql.query(pubfileSQL.uploadFile,[fileId, req.file.originalname, req.file.path, req.body.fileType,moment().format('YYYY-MM-DD HH:ss:mm')],function (err, rows, fields) {
        if (err) {
          res.json({type: MsgType.ERROR, msg: '上传失败', show: true});
        } else if (rows.affectedRows === 1) {
          res.json({type: MsgType.SUCCESS, msg: '成功',bean: {fileId, fileName: req.file.originalname}, show: false});
        }
      });
    }).catch((err) => {
        console.info(err);
        sftp.end();
    });*/
  let fileId = uuid.v1().replace(/-/g,'');
  mysql.query(pubfileSQL.uploadFile,[fileId, req.file.originalname, req.file.path, req.body.fileType,moment().format('YYYY-MM-DD HH:ss:mm')],function (err, rows, fields) {
    if (err) {
      res.json({type: MsgType.ERROR, msg: '上传失败', show: true});
    } else if (rows.affectedRows === 1) {
      res.json({type: MsgType.SUCCESS, msg: '成功',bean: {fileId, fileName: req.file.originalname}, show: false});
    }
  });
});
router.post('/pub-file/delete-file', function (req, res) {
    mysql.query(pubfileSQL.deleteFile, [req.body.id], function (err, rows) {
        if (err) {
           res.json({type: MsgType.ERROR, msg: '文件删除失败', show: true});
        } else if (rows.affectedRows === 1) {
            res.json({type: MsgType.SUCCESS, msg: '成功删除文件', show: false});
        }
    });
});
router.get('/pub-file/download', function (req, res) { // 回显用的
    mysql.query(pubfileSQL.selectFileById, [req.query.id], function (err, rows) {
        if (err) {
            res.json({type: MsgType.ERROR, msg: '下载失败', show: true});
        } else {
            res.sendFile(rows[0].filePath);
        }
    });
});
router.post('/pub-file/download', function (req, res) {  // 下载用的
    mysql.query(pubfileSQL.selectFileById, [req.query.id], function (err, rows) {
        if (err) {
            res.json({type: MsgType.ERROR, msg: '下载失败', show: true});
        } else {
            res.download(rows[0].filePath, rows[0].fileName);
        }
    });
});
router.get('/pub-file/echoPic', function (req, res) { // 首页回显图片
    mysql.query(pubfileSQL.selectFilesByRelateId, [req.query.fileType, req.query.relateId], function (err, rows) {
        if(rows && rows.length > 0) {
            res.sendFile(rows[0].filePath);
        }
    });
});
router.post('/pub-file/select-files-by-relate-id', function (req, res) {
    mysql.query(pubfileSQL.selectFilesByRelateId, [req.body.fileType, req.body.relateId], function (err, rows) {
        if (err) {
            res.json({type: MsgType.ERROR, msg: '查询失败', show: true});
        } else {
            res.json(rows);
        }
    });
});
module.exports = router;