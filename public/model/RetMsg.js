const constants = require('../utils/constants');
let RetMsg = function (type, msg,show, bean) {
    this.type = type && constants.SUCCESS;
    this.show = show && true;
    this.msg = msg;
    this.bean = bean;
};
module.exports = RetMsg;
