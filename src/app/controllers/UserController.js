const Account = require('../models/Account')
const jwt = require('jsonwebtoken');
const Role = require('../models/Role')
class UserController {
    getAllUser(req, res) {
        const page = parseInt(req.query.page) || 1; // Trang hiện tại
        const pageSize = 12; // Kích thước trang
        const startIndex = (page - 1) * pageSize;
        const endIndex = page * pageSize;
        Account.countAccount((err, count) => {
            if (err) {
                console.log('lỗi truy vấn', err)
            }
            else {
                Account.getAllUser((err, results) => {
                    if (err) {
                        res.status(500).json({ error: 'Internal Server Error' });
                        return;
                    } else {
                        const totalPages = Math.ceil(results.length / pageSize);
                        const pages = Array.from({ length: totalPages }, (_, index) => {
                            return {
                                number: index + 1,
                                active: index + 1 === page,
                                isDots: index + 1 > 5
                            };
                        });
                        const paginatedData = results.slice(startIndex, endIndex);
                        // Chuẩn bị dữ liệu để truyền vào template
                        const viewData = {
                            data: paginatedData,
                            count: count[0],
                            pagination: {
                                prev: page > 1 ? page - 1 : null,
                                next: endIndex < results.length ? page + 1 : null,
                                pages: pages,
                            },
                        };

                        res.render('user/store', viewData)
                    }
                })
            }
        })

    }
    index(req, res) {
        res.render('user/login')
    }
    login(req, res, next) {
        var username = req.body.username
        var password = req.body.password
        //tìm kiếm user theo tên
        Account.getAccountByNameAndPassword(username, password, (err, results) => {
            if (err) {
                res.status(500).json({ error: 'Internal Server Error' });
                return;
            } else {
                if (results.length > 0) {
                    const account = results[0]
                    //tạo token cho Id
                    var token = jwt.sign({ _id: account._id }, process.env.SECRET)
                    // var par = jwt.verify(token, process.env.SECRET)
                    res.json({
                        message: 'Đăng nhập thành công',
                        token: token,
                        getUser: account.fullname,
                    })
                }
                else {
                    res.json({ message_error: 'Sai tên đăng nhập hoặc mật khẩu' })
                }
            }
        })
    }
    //[get] register
    renderRegister(req, res) {
        Role.getAllRole((err, roles) => {
            if (err) {
                console.log("Lỗi truy vấn", err)
            }
            Account.getAllAccountManager((err, accounts) => {
                if (err) {
                    console.log("Lỗi truy vấn", err)
                }
                else {
                    res.render('user/register', { roles, accounts })
                }
            })

        })

    }
    //[post] form register
    register(req, res, next) {
        var email = req.body.email
        var username = req.body.username
        var password = req.body.password
        console.log(req.body)
        //  console.log(password)
        Account.getAccountByNameorEmail(username, email, (err, results) => {
            if (err) {
                res.status(500).json({ error: 'Internal Server Error' });
                return;
            }
            if (results.length > 0) {
                res.json({ message_error: 'Tài khoản đã tồn tại', })
            }
            else {
                Account.addAccount(req.body, (err, results) => {
                    if (err) {
                        console.log('Lỗi truy vấn', err)
                    }
                    else {
                        res.json({ message_success: 'Đăng kí thành công' })
                    }
                })

            }
        })
    }
    // [GET] render formpass
    renderchangepass(req, res) {
        res.render('user/changePassword')
    }
    //[POST] change pass
    changepass(req, res, next) {

        var token = req.cookies.tkvungtrong
        var id_token = jwt.verify(token, process.env.SECRET)
        // lấy id dựa vào verify token
        const idUser = id_token._id
        //mật khẩu hiện tại
        const password = req.body.currentpassword
        // mật khẩu để thay đổi
        const passwordchange = req.body.password
        // Kiểm tra mật khẩu nhập đúng k
        Account.getAccountIdAndPassword(idUser, password, (err, data) => {
            if (err) {
                res.status(500).json({ error: 'Internal Server Error' });
                return;
            }
            if (data.length === 0) {
                res.json({ message: 'Mật khẩu hiện tại không đúng ' })
            } else {
                //nếu đúng update tài khoản 
                Account.updateAccount(idUser, {
                    password: passwordchange
                }, (err, results) => {
                    if (err) {
                        res.status(500).json({ error: 'Internal Server Error' });
                        return;
                    } else {
                        if (results.affectedRows === 0) {
                            res.status(404).send(' not found');
                        } else {
                            res.json({ message: 'Thay đổi mật khẩu thành công' })
                        }
                    }
                })
            }
        })
    }

    // [get] forget PASSWORD
    showforgot(req, res) {
        res.render('user/forgotPassword')
    }
    // [post ] email when forget password
    forgot(req, res, next) {
        let email = req.body.email
        Account.getAccountByEmail(email, (err, results) => {
            if (err) {
                res.status(500).json({ error: 'Internal Server Error' });
                return;
            }
            else {
                if (results.length > 0) {
                    const data = results[0]

                    const { sign } = require('../middlewares/Jwt');
                    const host = req.header('host');
                    const resetLink = `${req.protocol}://${host}/user/reset?token=${sign(email)}&email=${email}`
                    const { sendForgotPasswordMail } = require('../middlewares/Email')
                    sendForgotPasswordMail(data, host, resetLink)
                        .then((result) => {
                            console.log('email has been sent')
                            return res.render('user/forgotPassword', { done: true })
                        })
                        .catch(error => {
                            console.log(error)
                            return res.render('user/forgotPassword', { message: "check email " })
                        })
                } else {
                    return res.render('user/forgotPassword', { done: false, message: "Email này chưa được đăng ký" })
                }

            }
        })
    }
    // [get]  show reset password
    showReset(req, res) {
        let email = req.query.email;
        let token = req.query.token;
        let { verify } = require('../middlewares/Jwt');

        if (!token || !verify(token)) {
            return res.render('user/reset', { expired: true })
        }
        else {
            return res.render('user/reset', { email, token })
        }
    }
    resetPass(req, res, next) {
        const password = req.body.password
        const email = req.body.email
        Account.updateForgotAccount(email, { password: password }, (err, results) => {
            if (err) {
                res.status(500).json({ error: 'Internal Server Error' });
                return;
            }
            else {
                if (results.affectedRows === 0) {
                    res.json({ message: "Link của bạn hết hiệu lực" })
                } else {
                    res.json({ message: "Thay đổi mật khẩu thành công" })
                }
            }
        })
    }
    delete(req, res) {
        const Id_user = req.params.id
        Account.deleteUser(Id_user, (err, data) => {
            if (err) {
                console.log('Lỗi truy vấn', err)
                return
            }

            else {
                res.redirect('back')
            }
        })
    }
    getAllAccountChild(req, res) {
        var token = req.cookies.tkvungtrong
        var id_token = jwt.verify(token, process.env.SECRET)
        const page = parseInt(req.query.page) || 1; // Trang hiện tại
        const pageSize = 12; // Kích thước trang
        const startIndex = (page - 1) * pageSize;
        const endIndex = page * pageSize;
        Account.getAllAccountChildById(id_token._id, (err, results) => {
            if (err) {
                console.log('Lỗi truy vấn', err)
            }
            else {
                const totalPages = Math.ceil(results.length / pageSize);
                const pages = Array.from({ length: totalPages }, (_, index) => {
                    return {
                        number: index + 1,
                        active: index + 1 === page,
                        isDots: index + 1 > 5
                    };
                });
                const paginatedData = results.slice(startIndex, endIndex);
                // Chuẩn bị dữ liệu để truyền vào template
                const viewData = {
                    data: paginatedData,
                    count: results[0],
                    pagination: {
                        prev: page > 1 ? page - 1 : null,
                        next: endIndex < results.length ? page + 1 : null,
                        pages: pages,
                    },
                };
                res.render('user/accountChild', viewData)
            }
        })

    }
}

module.exports = new UserController