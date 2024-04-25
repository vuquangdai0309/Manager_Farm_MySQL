const connection = require('../../config/db/index')
const AccountModel = {
    ///lấy ra các tài khoản
    getAllUser: (callback) => {
        const query = 'SELECT * FROM account WHERE is_deleted = 0';
        connection.query(query, callback);
    },
    //lấy thông tin dựa vào tên và email
    getAccountByNameorEmail: (UserName, UserEmail, callback) => {
        const query = 'SELECT * FROM account WHERE username = ? OR email = ? AND is_deleted = 0';
        connection.query(query, [UserName, UserEmail], callback);
    },
    //lấy thông tin dựa vào tên và mật khẩu
    getAccountByNameAndPassword: (UserName, PassWord, callback) => {
        const query = 'SELECT * FROM account WHERE username = ? AND password =? AND is_deleted = 0';
        connection.query(query, [UserName, PassWord], callback);
    },
    //lấy thông tin dựa vào id
    getAccountById: (UserId, callback) => {
        const query = 'SELECT * FROM account WHERE _id = ? AND is_deleted = 0';
        connection.query(query, [UserId], callback);
    },

    addAccount: (Account, callback) => {
        const query = 'INSERT INTO account (username,password,email) VALUES (?,?,?)';
        const values = [Account.username, Account.password, Account.email];
        connection.query(query, values, callback);
    },
    //lấy thông tin tài khoản dựa vào id và email
    getAccountIdAndPassword: (UserId, PassWord, callback) => {
        const query = 'SELECT * FROM account WHERE _id = ? AND password =? AND is_deleted = 0';
        connection.query(query, [UserId, PassWord], callback);
    },
    // thay đổi mật khẩu
    updateAccount: (AccountId, Account, callback) => {
        const query = 'UPDATE account SET password = ? WHERE _id = ? AND is_deleted = 0 ';
        const values = [Account.password, AccountId];
        connection.query(query, values, callback);
    },
    // lấy thông tin dựa vào email
    getAccountByEmail: (UserEmail, callback) => {
        const query = 'SELECT * FROM account WHERE email = ? AND is_deleted = 0';
        connection.query(query, [UserEmail], callback);
    },
    // quên mật khẩu
    updateForgotAccount: (email, Account, callback) => {
        const query = 'UPDATE account SET password = ? WHERE email = ? AND is_deleted = 0 ';
        const values = [Account.password, email];
        connection.query(query, values, callback);
    },
    deleteUser: (UserId, callback) => {
        const query = 'UPDATE account SET is_deleted = 1 WHERE _id = ?';
        connection.query(query, [UserId], callback);
    },
    countAccount: (callback) => {
        const query = `SELECT COUNT(*) AS CountAccount FROM account WHERE is_deleted = 0`;
        connection.query(query, callback)
    },


};

// Export model để sử dụng ở nơi khác trong ứng dụng
module.exports = AccountModel;