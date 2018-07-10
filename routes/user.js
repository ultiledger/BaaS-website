let mysql = require('../public/mysql');
let userSQL = require('../db/usersql');
let express = require('express');
let router = express.Router();
let debug = require('debug')('dev:getData');
let contextData = require('../db/menu');
let PubUser = require('../db/pubuser.entity');
let encryptor = require('../public/utils/encryptor');
const MsgType = require('../public/utils/constants');

// 登录接口
router.post('/login', function (req, res, next) {
    //用户名、密码、验证码
    let userName = req.body.userName;
    let password = encryptor(req.body.password);
    console.debug("验证码="+req.session.verifyCode);
    if (req.session.verifyCode === undefined
    || String(req.session.verifyCode).toLocaleLowerCase() !== String(req.body.kaptchaReceived).toLocaleLowerCase()) {
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
    res.json({type: MsgType.SUCCESS});
});
//注册
router.post('/register',function (req, res, next) {
    console.debug("http post /register");
    let user = {
        loginName: (req.body.loginName) ? req.body.loginName : '',
        email: (req.body.email) ? req.body.email : '',
        phoneNo: (req.body.phoneNo) ? req.body.phoneNo : '',
        password: (req.body.password) ? encryptor(req.body.password) : '',
    }
    mysql.query(userSQL.insertUser,[null, user.loginName, null, user.loginName,
        user.password, null, null, user.phoneNo, null, 'E', null, null, null, null, null] ,function (err,rows,fields) {
        console.debug("err="+err);
        console.debug("rows="+rows);
    });
    res.json({type: MsgType.SUCCESS});
});

router.post('/register/check-user-exist',function (req, res, next) {
    debug('http post /register/check-user-exist');
    let loginName = req.body.loginName;
    let phoneNo = req.body.phoneNo;
    let email = req.body.email;
    let reqType = req.body.reqType;
    console.debug("reqType="+reqType);
    if (reqType === undefined){
        res.json ({type: MsgType.ERROR, msg: '必须上送reqType',show: true});
        return;
    }
    if (reqType === 'loginName' && (loginName === undefined || loginName === '')){
        res.json ({type: MsgType.ERROR, msg: '用户名称不能为空',show: true});
        return;
    }
    if (reqType === 'phoneNo' && (phoneNo === undefined || phoneNo === '')){
        res.json ({type: MsgType.ERROR, msg: '手机号码不能为空',show: true});
        return;
    }
    if (reqType === 'loginName' && loginName !== undefined) {
        mysql.query(userSQL.isLoginNameExit,[loginName],function (err, rows, fields) {
            if (err) {
                res.json ({type: MsgType.ERROR, msg: '用户名称校验失败',show: true});
                return;
            }
            const count = rows[0].count;
            if (count === 0) {
                res.json({user: rows, type: MsgType.SUCCESS, show: true, msg: '用户名称校验通过'});
            } else {
                res.json({msg: '用户'+loginName+'已经存在', type: MsgType.WARING, show: true});
            }
        });
    }
    if (reqType === 'phoneNo' && phoneNo !== undefined) {
        mysql.query(userSQL.isPhoneNoExit,[phoneNo],function (err, rows, fields) {
            if (err) {
                res.json ({type: MsgType.ERROR, msg: '手机号码校验失败',show: true});
                return;
            }
            const count = rows[0].count;
            if (count === 0) {
                res.json({user: rows, type: MsgType.SUCCESS, show: true, msg: '手机号码校验通过'});
            } else {
                res.json({msg: '手机号码'+phoneNo+'已经被注册', type: MsgType.WARING, show: true});
            }
        });
    }
    if (reqType === 'email' && email !== undefined) {
        mysql.query(userSQL.isEmailExit,[email],function (err, rows, fields) {
            if (err) {
                res.json ({type: MsgType.ERROR, msg: '登录失败：注册邮箱校验失败',show: true});
                return;
            }
            const count = rows[0].count;
            if (count === 0) {
                res.json({user: rows, type: MsgType.SUCCESS, show: true, msg: '注册邮箱校验通过'});
            } else {
                res.json({msg: '邮箱'+email+'已经被注册', type: MsgType.WARING, show: true});
            }
        });
    }

});
module.exports = router;