
const NguyenVatLieu = require('../models/NguyenVatLieu')
const GiongCay = require('../models/GiongCay')
const Map = require('../models/Map')
var jwt = require('jsonwebtoken');
class nguyenlieucaytrongModle {

    getData(req, res) {
        const giongcay_id = req.params.giongcay_id
        const nguyenlieu_id = req.params.nguyenlieu_id
        const map_id = req.params.map_id
        let token = req.cookies.tkvungtrong
        let par = jwt.verify(token, 'mk')

        NguyenVatLieu.findNguyenLieuCayTrong(giongcay_id, nguyenlieu_id, (err, results) => {
            if (err) {
                console.log('Lỗi truy vấn', err)
            }
            else {
                Map.getMapWithId(map_id, par._id, (err, result) => {
                    if (err) {
                        console.log('Lỗi truy vấn ', err)
                    } else {
                        res.json({
                            data: results[0],
                            map: result[0]
                        })
                    }
                })
            }
        })
    }
    getGiongCay(req, res) {
        const giongcay_id = req.params.giongcay_id

        NguyenVatLieu.getGiongCayById(giongcay_id, (err, results) => {
            if (err) {
                console.log('Lỗi truy vấn', err)
            }
            else {
                res.json(results)
            }
        })
    }
}

module.exports = new nguyenlieucaytrongModle