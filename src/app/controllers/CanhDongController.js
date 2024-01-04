const CanhDong = require('../models/CanhDong')
var jwt = require('jsonwebtoken');
const Map = require('../models/Map')
class CanhDongController {
    index(req, res) {
        let token = req.cookies.tkvungtrong
        let par = jwt.verify(token, 'mk')
        const page = parseInt(req.query.page) || 1; // Trang hiện tại
        const pageSize = 5; // Kích thước trang
        const startIndex = (page - 1) * pageSize;
        const endIndex = page * pageSize;
        CanhDong.getAllCanhDongWithId(par._id, (err, data) => {
            if (err) {
                console.log('Lỗi truy vấn', err)
            }
            Map.getAllMapsTypePolygon(par._id, (err, maps) => {
                if (err) {
                    console.log('Lỗi truy vấn', err)
                }
                else {
                    const totalPages = Math.ceil(data.length / pageSize);
                    const pages = Array.from({ length: totalPages }, (_, index) => {
                        return {
                            number: index + 1,
                            active: index + 1 === page,
                            isDots: index + 1 > 5
                        };
                    });
                    const paginatedData = data.slice(startIndex, endIndex);
                    // Chuẩn bị dữ liệu để truyền vào template
                    const viewData = {

                        map: maps,
                        data: paginatedData,
                        pagination: {
                            prev: page > 1 ? page - 1 : null,
                            next: endIndex < data.length ? page + 1 : null,
                            pages: pages,
                        },
                    };
                    // Render template và truyền dữ liệu               

                    res.render('canhdong/canhdong', viewData)
                }
            })



        })
    }
    // thêm mới bản ghi
    store(req, res) {
        let token = req.cookies.tkvungtrong
        let par = jwt.verify(token, 'mk')
        const canhdong = {
            map_id: req.body.map_id,
            giongcay: req.body.giongcay,
            ngaybatdau: req.body.ngaybatdau,
            ngayketthuc: req.body.ngayketthuc,
            id_user: par._id
        }
        CanhDong.addCanhDong(canhdong, (err, results) => {
            if (err) {
                console.log('Lỗi truy vấn', err)
            } else {
                res.redirect('back')
                console.log('Thêm bản ghi thành công')
            }
        })
    }
    // xóa bản ghi
    delete(req, res, next) {
        const Id_canhdong = req.params.id
        CanhDong.deleteCanhDong(Id_canhdong, (err, data) => {
            if (err) {
                console.log('Lỗi truy vấn', err)
                return
            }
            else {
                res.redirect('back')
            }
        })
    }
    // lấy edit
    edit(req, res, next) {
        const Id_canhdong = req.params.id
       
        let token = req.cookies.tkvungtrong
        let par = jwt.verify(token, 'mk')
        CanhDong.getCanhDongWithId(Id_canhdong, (err, canhdong) => {
            if (err) {
                console.log('lỗi truy vấn', err)
            }
            Map.getAllMapsTypePolygon(par._id, (err, maps) => {
                if (err) {
                    console.log('lỗi truy vấn', err)
                }
                else {
                    res.render('canhdong/edit', { canhdong: canhdong[0], map: maps }
                    )
                }
            })

        })
    }

    // update
    update(req, res, next) {
        const Id_canhdong = req.params.id
        const forms = {
            map_id: req.body.map_id,
            giongcay: req.body.giongcay,
            ngaybatdau: req.body.ngaybatdau,
            ngayketthuc: req.body.ngayketthuc,
        }
        CanhDong.updateCanhDong(Id_canhdong, forms, (err, results) => {
            if (err) {
                console.log('lỗi truy vấn', err)
            }
            else {
                res.redirect('/canhdong/canhdong')
            }
        })

    }
}
module.exports = new CanhDongController