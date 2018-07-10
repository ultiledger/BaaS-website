let mysql = require('mysql');
const config = require('../config/mysqlConfig');
let pool=mysql.createPool(config);//创建数据库连接池
module.exports = {
    query: function (sql,paramArray,callback) {
        pool.getConnection(function (err, connection) {
            if (err) {
                callback(err, null, null);
            } else {
                connection.query(sql,paramArray,function (err, rows, fields) {
                    if (err) callback(err, null, null);
                    console.info(rows);
                    connection.release();
                    callback(err, rows, fields);
                });
            }
        });
    },
};