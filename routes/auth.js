let express = require('express');
let router = express.Router();
let debug = require('debug')('dev:getData');
let contextData = require('../db/menu');
const MsgType = require('../public/utils/constants');
var svgCaptcha = require('svg-captcha');

//验证吗
router.get('/getVerifycode?',function (req, res, next) {
    var codeConfig = {
        size: 4,// 验证码长度
        ignoreChars: '0o1i', // 验证码字符中排除 0o1i
        noise: 2, // 干扰线条的数量
        height: 36,
        width: 80
    };
    var captcha = svgCaptcha.create(codeConfig);
    console.debug("captcha="+captcha.text);
    console.debug(captcha.data);
    res.type('image/jpeg'); // 使用ejs等模板时如果报错 res.type('html')
    // 保存到session,忽略大小写
    req.session.verifyCode = captcha.text.toLowerCase();
    console.debug("req.session.verifyCode="+req.session.verifyCode);
    res.status(200).send(captcha.data);
});
router.get('/checkVerifycode?',function (req, res, next) {
    console.debug("req.session="+req.session
        +"req.session.verifyCode="+req.session.verifyCode
        +"req.query.verifyCode="+req.query.verifyCode);
    if (req.query.verifyCode == String(req.session.verifyCode)){
        res.json({type: 'success'});
    }else {
        res.json({type: 'fail'});
    }

});
module.exports = router;