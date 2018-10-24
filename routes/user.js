let mysql = require('../public/mysql');
let userSQL = require('../db/usersql');
let express = require('express');
let router = express.Router();
let debug = require('debug')('dev:getData');
let contextData = require('../db/menu');
let PubUser = require('../db/pubuser.entity');
let encryptor = require('../public/utils/encryptor');
const MsgType = require('../public/utils/constants');
const normalCookieOpt = {
    maxAge: 1000 * 60 * 60 * 24 * 30, httpOnly: false
};
const deleteCookieOpt = {
    maxAge: 0, httpOnly: false
};

// 登录接口
router.post('/login', function (req, res, next) {
    //用户名、密码、验证码
    console.log(JSON.stringify(req.body));
    let userName = req.body.username;
    let password = req.body.password;
    console.debug("验证码=" + req.session.verifyCode);
    if (req.session.verifyCode === undefined
        || String(req.session.verifyCode).toLocaleLowerCase() !== String(req.body.verifyCode).toLocaleLowerCase()) {
        res.json({msg: '验证码不正确！', type: MsgType.WARING, show: true});
        return;
    }
    console.info('用户名：' + userName + ', 密码：' + password);
    mysql.query(userSQL.selectForLogin, [userName, password], function (err, rows, fields) {
        if (err) {
            res.json({type: MsgType.ERROR, msg: '登录失败', show: true});
            return;
        }
        ;
        console.info('获取到用户信息：' + rows);
        if (rows.length === 1) {
            req.session.isLogin = true;
            req.session.user = rows[0];
            res.cookie("isLogin", true, normalCookieOpt);
            res.cookie("userName", req.session.user.user_name, normalCookieOpt);
            res.json({userName: req.session.user.user_name, type: MsgType.SUCCESS, show: true, msg: '登录成功'});
        } else {
            res.json({msg: '用户或密码不正确！', type: MsgType.WARING, show: true});
        }
    });
});

router.get('/baseInfo', function (req, res, next) {
    let userName = req.query.userName;
    mysql.query(userSQL.selectUserByLoginName, [userName], function (err, rows, fields) {
        if (err) {
            res.json({type: MsgType.ERROR, msg: '账户基本信息查询失败', show: true});
            return;
        }
        if (rows.length === 1) {
            req.session.user = rows[0];
            res.json({user: req.session.user, type: MsgType.SUCCESS, show: true, msg: '查询成功'});
        } else {
            res.json({msg: '无法查询该用户的账户基本信息', type: MsgType.WARING, show: true});
        }
    });
});

//获取菜单之类的信息
router.post('/get-contextData', function (req, res, next) {
    let isLogin = false;
    let userName = null;
    if (req.session.isLogin) {
        isLogin = req.session.isLogin;
    }
    if (req.session.user) {
        userName = req.session.user.user_name;
    }
    let cData = {
        isLogin: isLogin,
        userName: userName
    };
    res.json(cData);
    console.log(cData);
});

// 登出
router.post('/logout', function (req, res, next) {
    req.session.isLogin = false;
    res.cookie("isLogin", false, deleteCookieOpt);
    res.cookie("userName", '', deleteCookieOpt);
    res.json({type: MsgType.SUCCESS});
});
//注册
router.post('/register', function (req, res, next) {
    console.debug("http post /register");
    let user = {
        loginName: (req.body.loginName) ? req.body.loginName : '',
        email: (req.body.email) ? req.body.email : '',
        phoneNo: (req.body.phoneNo) ? req.body.phoneNo : '',
        password: (req.body.password) ? encryptor(req.body.password) : '',
    };
    mysql.query(userSQL.insertUser, [null, user.loginName, null, user.loginName,
        user.password, null, null, user.phoneNo, user.email, 'E', null, null, null, null, null], function (err, rows, fields) {
        if (err) {
            console.log(err + "  sql=" + userSQL.insertUser);
        }
        res.json({type: MsgType.SUCCESS});
        console.debug("insertUser rows=" + rows[0]);
        console.debug("insertUser fields=" + fields);
    });

});

router.post('/register/check-user-exist', function (req, res, next) {
    debug('http post /register/check-user-exist');
    let loginName = req.body.loginName;
    let phoneNo = req.body.phoneNo;
    let email = req.body.email;
    let reqType = req.body.reqType;
    console.debug("reqType=" + reqType);
    if (reqType === undefined) {
        res.json({type: MsgType.ERROR, msg: '必须上送reqType', show: true});
        return;
    }
    if (reqType === 'loginName' && (loginName === undefined || loginName === '')) {
        res.json({type: MsgType.ERROR, msg: '用户名称不能为空', show: true});
        return;
    }
    if (reqType === 'phoneNo' && (phoneNo === undefined || phoneNo === '')) {
        res.json({type: MsgType.ERROR, msg: '手机号码不能为空', show: true});
        return;
    }
    if (reqType === 'loginName' && loginName !== undefined) {
        mysql.query(userSQL.isLoginNameExit, [loginName], function (err, rows, fields) {
            if (err) {
                res.json({type: MsgType.ERROR, msg: '用户名称校验失败', show: true});
                return;
            }
            const count = rows[0].count;
            if (count === 0) {
                res.json({user: rows, type: MsgType.SUCCESS, show: true, msg: '用户名称校验通过'});
            } else {
                res.json({msg: '用户' + loginName + '已经存在', type: MsgType.WARING, show: true});
            }
        });
    }
    if (reqType === 'phoneNo' && phoneNo !== undefined) {
        mysql.query(userSQL.isPhoneNoExit, [phoneNo], function (err, rows, fields) {
            if (err) {
                res.json({type: MsgType.ERROR, msg: '手机号码校验失败', show: true});
                return;
            }
            const count = rows[0].count;
            if (count === 0) {
                res.json({user: rows, type: MsgType.SUCCESS, show: true, msg: '手机号码校验通过'});
            } else {
                res.json({msg: '手机号码' + phoneNo + '已经被注册', type: MsgType.WARING, show: true});
            }
        });
    }
    if (reqType === 'email' && email !== undefined) {
        mysql.query(userSQL.isEmailExit, [email], function (err, rows, fields) {
            if (err) {
                res.json({type: MsgType.ERROR, msg: '登录失败：注册邮箱校验失败', show: true});
                return;
            }
            const count = rows[0].count;
            if (count === 0) {
                res.json({user: rows, type: MsgType.SUCCESS, show: true, msg: '注册邮箱校验通过'});
            } else {
                res.json({msg: '邮箱' + email + '已经被注册', type: MsgType.WARING, show: true});
            }
        });
    }

});
module.exports = router;