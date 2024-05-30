
const NLDV = require('../models/NhatKyDauVao')
const NLSX = require('../models/NhatKySanXuat')
var jwt = require('jsonwebtoken');

class HomeController {
    index(req, res) {
        let token = req.cookies.tkvungtrong

        let par = jwt.verify(token, process.env.SECRET)
        NLDV.countNguyenLieuDauVao(par._id, (err, nldv) => {
            if (err) {
                console.log('Lỗi truy vấn', err)
            }
            else {
                NLSX.countNguyenLieusSanXuat(par._id, (err, nlsx) => {
                    if (err) {
                        console.log('Lỗi truy vấn', err)
                    } else {

                        res.render('home', { countNLDV: nldv[0], countNLSX: nlsx[0] });

                    }
                })
            }

        })
        


    }
    contact(req, res) {
        res.render('contact/contact',)
    }
    annouce(req, res) {
        res.redirect('back')
    }
}
module.exports = new HomeController