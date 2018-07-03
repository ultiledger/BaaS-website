let UserSSQL = {
    selectForLogin: 'select * from pub_user pu where pu.login_name = ? and pu.password = ?',
};
module.exports = UserSSQL;