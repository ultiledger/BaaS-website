var express = require('express');
var router = express.Router();
var debug = require('debug')('dev:getData');

/**
 * 测试接口
 */
router.get('/test', (req, res, next) => {
    var str = req.query.str;
    debug('test1：' + str);
    return res.send(req.query);
});

/**
 * 登录接口
 */
router.post('/login', (req, res, next) => {
    //用户名、密码、验证码
    var username = req.body.username;
    var password = req.body.password;

    debug('用户名：' + username + ', 密码：' + password);

    //TODO ：对用户名、密码进行校验
    //xss处理、判空

    //密码加密 md5(md5(password + '随机字符串'))
    //密码需要加密－> 可以写入JSON文件
    if(username === 'admin' && password === '123456'){
        res.cookie('user',username);
        return res.send({
            status: 1
        });
    }

    return res.send({
        status: 0,
        info: '登录失败'
    });
});


module.exports = router;
