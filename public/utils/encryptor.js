const  crypto = require('crypto');
module.exports = function (content) { /// 加密工具js
    if (content) {
        let md5 = crypto.createHash('md5');
        md5.update(content);
        return md5.digest('hex').toUpperCase();// 32位大写
    }
};