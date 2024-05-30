
const NguyenVatLieu = require('../models/NguyenVatLieu')
const Map = require('../models/Map')
const Season = require('../models/Season')
var jwt = require('jsonwebtoken');
class nguyenlieucaytrongModle {

    store(req, res) {
        const page = parseInt(req.query.page) || 1; // Trang hiện tại
        const pageSize = 20; // Kích thước trang
        const startIndex = (page - 1) * pageSize;
        const endIndex = page * pageSize;
        const search = req.query.name || '';

        NguyenVatLieu.getAllNguyenLieuBySearch(search, (err, data) => {
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
                const viewData = {
                    results: paginatedData,

                    search: search,
                    recordsPerPage: pageSize,
                    pagination: {
                        prev: page > 1 ? page - 1 : null,
                        next: endIndex < data.length ? page + 1 : null,
                        pages: pages,
                    },
                };
                res.render("nguyenvatlieu/store", viewData)
            }
        })

    }
    creat(req, res) {
        NguyenVatLieu.creatNguyenLieu(req.body, (err, results) => {
            if (err) {
                console.log('Lỗi truy vấn', err)
            }
            else {
                res.redirect("back")
            }
        })
    }
    update(req, res) {
        const id = req.params.id

        NguyenVatLieu.updateNguyenLieu(id, req.body, (err, results) => {
            if (err) {
                console.log('Lỗi truy vấn', err)
            }
            else {
                res.redirect("back")
            }
        })
    }
    getData(req, res) {
        //   const tree_id = req.params.tree_id
        const nguyenlieu_id = req.params.nguyenlieu_id
        const map_id = req.params.map_id
        let token = req.cookies.tkvungtrong
        let par = jwt.verify(token, process.env.SECRET)

        NguyenVatLieu.findNguyenLieuCayTrong(nguyenlieu_id, (err, results) => {
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
    getTree(req, res) {
        const tree_id = req.params.tree_id

        NguyenVatLieu.getAllNguyenLieu((err, nguyenvatlieu) => {
            if (err) {
                console.log('Lỗi truy vấn', err)
            }
            Season.getSeasonbyTree(tree_id, (err, season) => {
                if (err) {
                    console.log('Lỗi truy vấn', err)
                } else {
                    res.json({ nguyenvatlieu, season })
                }
            })

        })
    }
}

module.exports = new nguyenlieucaytrongModle