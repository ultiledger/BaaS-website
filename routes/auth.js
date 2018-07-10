let express = require('express');
let router = express.Router();
const MsgType = require('../public/utils/constants');
var svgCaptcha = require('svg-captcha');

//验证吗
router.get('/getVerifyCode?',function (req, res, next) {
    var codeConfig = {
        size: 4,// 验证码长度
        ignoreChars: '0o1i', // 验证码字符中排除 0o1i
        noise: 1, // 干扰线条的数量
        fontSize: 42, //字体大小
        color:false,
        background: '#00FFFF',
        height: 36,
        width: 80
    };
    var captcha = svgCaptcha.create(codeConfig);
    res.type('image/jpeg'); // 使用ejs等模板时如果报错 res.type('html')
    // 保存到session,忽略大小写
    req.session.verifyCode = captcha.text.toLowerCase();
    console.debug("req.session.verifyCode="+req.session.verifyCode);
    res.status(200).send(captcha.data);
});
router.get('/checkVerifyCode?',function (req, res, next) {
    console.debug('req.query.verifyCode='+req.query.verifyCode);
    console.debug('req.session.verifyCode='+req.session.verifyCode);
    if (String(req.query.verifyCode).toLowerCase() !== String(req.session.verifyCode).toLowerCase()){
        res.json ({type: MsgType.ERROR, msg: '验证码已经失效或校验不通过',show: false});
    }else {
        res.json ({type: MsgType.SUCCESS, show: true, msg: '验证码校验通过'});
    }

});
module.exports = router;