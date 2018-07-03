var express = require('express');
var app = require('./routes');


var staticOptions = {
  dotfiles: 'ignore',
  etag: false,
  extensions: ['htm', 'html'],
  index: false,
  maxAge: '1d',
  redirect: false,
  setHeaders: function (res, path, stat) {
    res.set('x-timestamp', Date.now());
  }
}
app.use('/static', express.static('public', staticOptions)); // 静态资源
const env = app.get('env');
console.info(env);
app.use('/',express.static('public/dist', {
    extensions: ['htm', 'html'],
    maxAge: '1d',
    setHeaders: function (res, path, stat) {
        res.set('x-timestamp', Date.now());
    }
}));
staticOptions.setHeaders['Content-Disposition'] = 'attachment';
app.use('/static/file', express.static('public/file', staticOptions)); // 文件下载

/**
 * 404处理
 */
app.use(function(req, res, next) {
  res.status(404).send('页面找不到!');
});

/**
 * 错误处理
 */
app.use((err, req, res, next) => { // 打印错误并把错误信息传递到下一个错误处理句柄
  console.error(err.stack);
  next(err);
});

app.use((err, req, res, next) => { // 向页面输出错误提示
  // res.send('服务器错误，请重试');
    res.json({type: 'error', msg: '服务器异常', show: true})
});

module.exports = app;
