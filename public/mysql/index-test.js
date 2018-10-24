var  mysql = require("./index");
let userSQL = require('../../db/usersql');
/*
mysql.query('select * from pub_user pu where pu.login_name = ?',['admin'],function (err, rows, fields) {
   console.debug("err="+err);
   console.debug("rows="+rows);
});
mysql.query(userSQL.insertUser,['2', '超级管理员', '90888', 'admin', 'E10ADC3949BA59ABBE56E057F20F883E', null, null, '150089989882', null, 'S', null, null, null, null, null] ,function (err,rows,fields) {
    console.debug("err="+err);
    console.debug("rows="+rows);
});
*/
/*
mysql.query(userSQL.isPhoneNoExit,['admin'] ,function (err, rows, fields) {
    console.debug("err="+err);
    var a = JSON.stringify(rows[0]);
    var b = rows[0].count;
    console.debug("rows="+a);
    console.debug("rows="+(b===0));
});*/

let userName = '15019280166';
let password = 'E10ADC3949BA59ABBE56E057F20F883E';
mysql.query('\n' +
    'delete from  pub_user where user_name like \'y0%\';',null,function () {
    
});

//insert into pub_user values (null, 'y006', null, 'y006', 'E10ADC3949BA59ABBE56E057F20F883E', null, null, '15019280166', 'y006@qq.com', 'E', null, null, null, null, null)
mysql.query(userSQL.insertUser,[null, 'y006', null, 'y006', 'E10ADC3949BA59ABBE56E057F20F883E', null, null, '15019280166', 'y006@qq.com', 'E', null, null, null, null, null] ,function (err,rows,fields) {

    console.info('-------insert----');
    console.info("err="+err);
    console.info("rows="+rows);
});

console.info('用户名：' + userName + ', 密码：' + password);
mysql.query(userSQL.selectForLogin, [userName, password], function (err, rows, fields) {
    console.info('-------select----');
    console.info('获取到用户信息：' + rows);
});