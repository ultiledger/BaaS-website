/**
 * 消息类型
 * @type {{SUCCESS: string, WARING: string, ERROR: string, INFO: string, TOLOGIN: string, RELOAD: string}}
 */
 const MsgType = {
    SUCCESS: 'success', // 成功
    WARING: 'warning', // 警告
    ERROR: 'error', // 错误
    INFO: 'info', // 消息
    TOLOGIN: 'tologin', // 跳转到登录页面
    RELOAD: 'reload' // 刷新
};
module.exports = MsgType;