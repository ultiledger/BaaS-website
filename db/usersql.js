let UserSSQL = {
    selectForLogin: 'select * from pub_user pu where pu.login_name = ? and pu.password = ?',
    isLoginNameExit: 'select count(*) count from pub_user pu where pu.login_name = ? ',
    isPhoneNoExit: 'select count(*) count from pub_user pu where pu.phone_no = ? ',
    isEmailExit: 'select count(*) count from pub_user pu where pu.e_mail = ? ',
    insertUser: 'insert into pub_user values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
};
module.exports = UserSSQL;