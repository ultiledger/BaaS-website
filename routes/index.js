var data = require('./data');
var auth = require('./auth');
var user = require('./user');
var notice = require('./notice');
var pubfile = require('./pubfile');
var bodyParser = require('body-parser');
var express = require('express');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var app = express();


app.use(cookieParser());
// Use the session middleware
app.use(session({
    //这里的name值得是cookie的name，默认cookie的name是：connect.sid
    //name: 'hhw',
    secret: 'keyboard cat',
    cookie: ('name', 'value', {path: '/', httpOnly: true, secure: false, maxAge: 1800000}),
    //重新保存：强制会话保存即使是未修改的。默认为true但是得写上
    resave: true,
    //强制“未初始化”的会话保存到存储。
    saveUninitialized: true,

}));

//使用了gbk编码，会报错，在这里拦截处理一下
app.use(function (req, res, next) {
    console.debug("http request=" + req.url);
    if (req.headers['content-type'] && req.headers['content-type'].indexOf('GBK') > -1) {
        req.headers['content-type'] = req.headers['content-type'].replace('GBK', 'UTF-8');
    }
    next();
});
app.use(bodyParser.json({limit: '50mb'})); // for parsing application/json
app.use(bodyParser.urlencoded({limit: 'limit', extended: true}));


app.use('/portal/data', data); // 测试
app.use('/portal/user', user); // 用户管理
app.use('/portal/auth', auth); // 验证操作
app.use('/portal/pub-notice', notice); // 公告管理
app.use('/portal/file', pubfile); //附件操作

module.exports = app;
