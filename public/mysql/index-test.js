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

mysql.query(userSQL.isPhoneNoExit,['admin'] ,function (err, rows, fields) {
    console.debug("err="+err);
    var a = JSON.stringify(rows[0]);
    var b = rows[0].count;
    console.debug("rows="+a);
    console.debug("rows="+(b===0));
});
