let mysql = require('../public/mysql');
let userSQL = require('../db/usersql');
let express = require('express');
let router = express.Router();
let debug = require('debug')('dev:getData');
let contextData = require('../db/menu');
let encryptor = require('../public/utils/encryptor');
const MsgType = require('../public/utils/constants');

// 登录接口
router.post('/login', function (req, res, next) {
    //用户名、密码、验证码
    let userName = req.body.userName;
    let password = encryptor(req.body.password);
    console.debug("验证码="+req.session.verifyCode);
    if (req.session.verifyCode == undefined
    || String(req.session.verifyCode).toLocaleLowerCase() != String(req.body.kaptchaReceived).toLocaleLowerCase()) {
        res.json({msg: '验证码不正确！', type: MsgType.WARING, show: true});
        return;
    }
    debug('用户名：' + userName + ', 密码：' + password);
    mysql.query(userSQL.selectForLogin,[userName,password],function (err, rows, fields) {
        if (err) {
           res.json ({type: MsgType.ERROR, msg: '登录失败',show: true});
           return;
        };
        debug('获取到用户信息：' + rows);
        if (rows.length===1) {
            res.json({user: rows, type: MsgType.SUCCESS, show: true, msg: '登录成功'});
        } else {
            res.json({msg: '用户或密码不正确！', type: MsgType.WARING, show: true});
        }
    });
});

//获取菜单之类的信息
router.post('/get-contextData', function (req, res, next) {
    res.json(contextData);
});

// 登出
router.post('/logout', function (req, res, next) {
    res.json({type: 'success'});
});
//注册
router.get('/register',function (req, res, next) {

})
module.exports = router;