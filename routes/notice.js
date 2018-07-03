let mysql = require('../public/mysql');
let noticeSQL = require('../db/noticesql');
let pubfileSQL = require('../db/pubfilesql');
let express = require('express');
let router = express.Router();
let uuid = require('node-uuid'); //v1 是基于时间戳生成uuid,v4是随机生成uuid
let debug = require('debug')('dev:getData');
let moment =  require('moment');
let MsgType = require('../public/utils/constants');

// 列表查询
router.post('/get-notices', function (req, res, next) {
    let pageNo = 0; // 默认条数
    let pageSize = 10; // 一页条数
    if (req.body.pageSize) {
        pageSize = req.body.pageSize;
    }
    if (req.body.pageNo) {
        pageNo = (req.body.pageNo-1)*pageSize;//计算页码
    }
    // let title = req.body.title;
    mysql.query(noticeSQL.selectNoticesByPage(req.body.title),[Number(pageNo), Number(pageSize)],function (outErr, outRows, outFields) {
        if (outErr) throw outErr;
        debug('获取到信息：' + outRows);
        mysql.query(noticeSQL.countNoticesForPage(req.body.title),[], function (outErr, inserRows, outFields) {
            let pageCount = 1;
            let total = inserRows[0].total; // 总条数
            // 计算总页数
            if (total <= pageSize) {
                pageCount = 1;
            } else if (total%pageSize === 0) {
                pageCount = Number(total/pageSize);
            } else {
                pageCount = Math.ceil(total/pageSize);
            }
            let result = {data: outRows, page: pageNo+1,rows: outRows.length || 0,total: total || 0, pageCount: pageCount};
            res.json(result);
        });
    });
});
// 首页查询
router.post('/get-home-notices', function (req, res, next) {
    let topNum = 3; // 查询多少条，默认三条
    if (req.body.topNum) {
        topNum = req.body.topNum;
    }
    mysql.query(noticeSQL.selectNoticesByPage(),[0, Number(topNum)],function (outErr, outRows, outFields) {
        if (outErr) throw outErr;
        debug('获取到信息：' + outRows);
        res.json({data: outRows});
    });
});

//新增编辑
router.post('/save-or-update-notice', function (req, res, next) {
    req.body.isEdit = true;
    if(!req.body.noticeId) {
        req.body.noticeId = uuid.v1().replace(/-/g, '');
        req.body.isEdit = false;
    }
    if (req.body.fileIds) { // 保存附件
        let fileIds = req.body.fileIds.split(',');
        fileIds.forEach((item,index) => {
            mysql.query(pubfileSQL.setRelateId, [null, item, '2'], function (err, rows) {
                if (rows.affectedRows === 1) {
                    mysql.query(pubfileSQL.setRelateId, [req.body.noticeId, item, '2'], function (err, rows) {})
                }
            });
        });
    }
    next();
}, function (req, res, next) {
    // 保存公告
    let SQL = noticeSQL.insertNotice;
    if (req.body.isEdit) {
        SQL = noticeSQL.updateNotice;
    }
    mysql.query(SQL,[req.body.title,req.body.front,req.body.noticeState,'admin',moment().format('YYYY-MM-DD HH:ss:mm'),req.body.content,req.body.noticeId], function (err, row, fields) {
        if (err) {
            if (err.errno == '1406' && err.sqlMessage.indexOf('content') >= 0) {
                res.json({type: MsgType.ERROR, msg: '内容太长，请编辑后再提交', show: true});
            } else {
                res.json({type: MsgType.ERROR, msg: '公告保存失败', show: true});
            }
        } else {
            res.json({type: MsgType.SUCCESS, msg: '成功', show: false});
        }
    });
});

// 获取详情
router.post('/get-notice-detail', function (req, res, next) {
    mysql.query(noticeSQL.selectOneNoticeById, [req.body.noticeId], function (err, rows, fields) {
       if (err) {
           res.json({type: MsgType.ERROR, msg: err});
       } else {
           let result = rows[0];
           console.info('我是结果：', result);
           if(result && result.noticeId) {
               mysql.query(noticeSQL.selectPreNoticeId, [result.createTime], function (err, rows, fields) {
                   if (err) {
                       res.json({type: MsgType.ERROR, msg: '查询结果失败，请稍候再试！'});
                   } else {
                       let preResult = rows[0];
                       if (preResult) {
                         result.preNoticeId = preResult.noticeId;
                         result.preTitle = preResult.title;
                       }else {
                         result.preNoticeId = null;
                       }
                       mysql.query(noticeSQL.selectNextNoticeId, [result.createTime], function (err, rows, fields) {
                          if(err) {
                              res.json({type: MsgType.ERROR, msg: '查询结果失败，请稍候再试！'});
                          } else {
                              let nextResult = rows[0];
                              if(nextResult) {
                                result.nextNoticeId = nextResult.noticeId;
                                result.nextTitle = nextResult.title;
                              }else {
                                result.nextNoticeId = null;
                              }
                              res.json(result);
                          }
                       });
                   }
               });
           }
       }
    });
});

// 删除
router.post('/delete-notice', function (req, res, next) {
    mysql.query(noticeSQL.deleteNotice, [req.body.noticeId], function (err, row) { /// 删除操作
        if (err) {
            res.json({type: MsgType.ERROR, msg: '删除失败', show: true});
        } else if (row.affectedRows === 1) { // insert, update or delete statement,changedRows :update statement.it does not count updated rows whose values were not change
            next();
        }
    });
}, function (req, res) {  // 更新附件表把关联的去掉
    mysql.query(pubfileSQL.setRelateId, [null, req.body.noticeId, '2'], function (err, row) {
    });
    res.json({type: MsgType.SUCCESS, msg: '成功', show: false});
});
// 更新状态
router.post('/update-notice-state', function (req, res, next) {
    let noticeState = '';
    if (req.body.noticeState === '1') {
        noticeState = '0';
    } else if (req.body.noticeState === '0') {
        noticeState = '1';
    }
    mysql.query(noticeSQL.updateNoticeState, [noticeState, req.body.noticeId], function (err, row) {
        if (err) {
            res.json({type: MsgType.ERROR, msg: '更新失败', show: true});
        } else if (row.changedRows === 1) { // insert, update or delete statement,changedRows :update statement.it does not count updated rows whose values were not change
            res.json({type: MsgType.SUCCESS, msg: '成功', show:false});
        }
    });
});
// 查询所有公告
router.post('get-all-notices', function (req, res, next) {
    mysql.query(noticeSQL.selectAllNotices, function (err, rows) {
        res.json({data: rows});
    });
});
module.exports = router;