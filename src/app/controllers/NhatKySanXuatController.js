const Works = require('../models/NhatKySanXuat')
var jwt = require('jsonwebtoken');
const QRCode = require('qrcode');
const VuMua = require('../models/VuMua');
const NguyenVatLieu = require('../models/NguyenVatLieu');
const GiongCay = require('../models/GiongCay');
const Map = require('../models/Map')
const { formatDate } = require('../middlewares/format')
class NhatKySanXuatController {
    async index(req, res) {
        try {
            let token = req.cookies.tkvungtrong
            let par = jwt.verify(token, 'mk')

            const works = await new Promise((resolve, reject) => {
                Works.getAllWorksWithId(par._id, (err, works) => {
                    if (err) {
                        console.log('lỗi truy vấn', err)
                        reject(err);
                        return;
                    }
                    resolve(works);
                });
            });
            const map = await new Promise((resolve, reject) => {
                Map.getAllMapsTypePolygon(par._id, (err, map) => {
                    if (err) {
                        console.log('lỗi truy vấn', err)
                        reject(err);
                        return;
                    }
                    resolve(map);
                });
            });

            const vumua = await new Promise((resolve, reject) => {
                VuMua.getAllVumua((err, vumua) => {
                    if (err) {
                        console.log('lỗi truy vấn', err)
                        reject(err);
                        return;
                    }
                    resolve(vumua);
                });
            });

            const giongcay = await new Promise((resolve, reject) => {
                GiongCay.getAllGiongCay((err, giongcay) => {
                    if (err) {
                        console.log('lỗi truy vấn', err)
                        reject(err);
                        return;
                    }
                    resolve(giongcay);
                });
            });
            const nguyenvatlieu = await new Promise((resolve, reject) => {
                NguyenVatLieu.getAllNguyenLieu((err, nguyenvatlieu) => {
                    if (err) {
                        console.log('lỗi truy vấn', err)
                        reject(err);
                        return;
                    }
                    resolve(nguyenvatlieu);
                });
            });
            res.render('nhatkysanxuat/nhatkysanxuat', { works, map, vumua, giongcay, nguyenvatlieu });
        } catch (error) {
            console.error('Error:', error);
            // Handle error appropriately, send an error response, etc.
        }
    }
    list(req, res, next) {
        let token = req.cookies.tkvungtrong
        let par = jwt.verify(token, 'mk')
        const page = parseInt(req.query.page) || 1; // Trang hiện tại
        const pageSize = 10; // Kích thước trang
        const startIndex = (page - 1) * pageSize;
        const endIndex = page * pageSize;
        const vumua = req.query.vumua || '';
        const giongcay = req.query.giongcay || '';
        GiongCay.getAllGiongCay((err, Datagiongcay) => {
            if (err) {
                console.log('Lỗi truy vấn', err)
            }
            else {
                VuMua.getAllVumua((err, Datavumua) => {
                    if (err) {
                        console.log('Lỗi truy vấn', err)
                    }
                    else {
                        Works.searchAllBy_GiongCay_And_Vumua(giongcay, vumua, par._id, (err, data) => {
                            if (err) {
                                console.log('lỗi truy vấn', err)
                                return
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
                                    works: paginatedData,
                                    Datagiongcay: Datagiongcay,
                                    Datavumua: Datavumua,
                                    vumua,
                                    giongcay,
                                    pagination: {
                                        prev: page > 1 ? page - 1 : null,
                                        next: endIndex < data.length ? page + 1 : null,
                                        pages: pages,
                                    },
                                };
                                // console.log(viewData.works)
                                res.render('nhatkysanxuat/store', viewData)
                            }
                        })
                    }
                })
            }
        })
    }
    store(req, res) {
        let token = req.cookies.tkvungtrong
        let par = jwt.verify(token, 'mk')

        Works.getAllWorksWithId(par._id, (err, works) => {
            if (err) {
                console.log('lỗi truy vấn', err)
                return
            }
            else {
                res.json({ works })
            }
        })

    }
    // [PO] nhatkysanxuat 
    addWork(req, res, next) {

        let token = req.cookies.tkvungtrong
        let par = jwt.verify(token, 'mk')
        const forms = {
            title: req.body.title,
            start: formatDate(req.body.start),
            end: formatDate(req.body.end),
            id_user: par._id,
            map_id: req.body.map_id,
            nguyenvatlieu_id: req.body.nguyenvatlieu_id,
            giongcay_id: req.body.giongcay_id,
            nongdo: req.body.nongdo,
            luongsudung: req.body.luongsudung,
            thoigiancachly: req.body.thoigiancachly,
            mucdich: req.body.mucdich,
            thietbi: req.body.thietbi,
            vesinhdungcu: req.body.vesinhdungcu,
            vumua_id: req.body.vumua_id
        }

        Works.addWork(forms, (err) => {
            if (err) {
                console.log('lỗi truy vấn', err)
            }
            else {
                res.redirect('back')
            }
        })

    }
    //Delete nhatkysanxuat/:id
    delete(req, res, next) {
        const Id_work = req.params.id
        Works.deleteAllWorksWithId(Id_work, (err, results) => {
            if (err) {
                console.log('lỗi truy vấn', err)
            }
            else {
                res.redirect('back')
            }
        })
    }
    // [GET] Edit nhatkysanxuat/:id
    async edit(req, res, next) {
        try {
            let token = req.cookies.tkvungtrong
            let par = jwt.verify(token, 'mk')
            const Id_work = req.params.id

            const works = await new Promise((resolve, reject) => {
                Works.getWorkById(par._id, Id_work, (err, works) => {
                    if (err) {
                        console.log('lỗi truy vấn', err)
                        reject(err);
                        return;
                    }
                    resolve(works);
                })
            })

            const map = await new Promise((resolve, reject) => {
                Map.getAllMapsTypePolygon(par._id, (err, map) => {
                    if (err) {
                        console.log('lỗi truy vấn', err)
                        reject(err);
                        return;
                    }
                    resolve(map);
                });
            });

            const vumua = await new Promise((resolve, reject) => {
                VuMua.getAllVumua((err, vumua) => {
                    if (err) {
                        console.log('lỗi truy vấn', err)
                        reject(err);
                        return;
                    }
                    resolve(vumua);
                });
            });

            const giongcay = await new Promise((resolve, reject) => {
                GiongCay.getAllGiongCay((err, giongcay) => {
                    if (err) {
                        console.log('lỗi truy vấn', err)
                        reject(err);
                        return;
                    }
                    resolve(giongcay);
                });
            });
            const nguyenvatlieu = await new Promise((resolve, reject) => {
                NguyenVatLieu.getAllNguyenLieu((err, nguyenvatlieu) => {
                    if (err) {
                        console.log('lỗi truy vấn', err)
                        reject(err);
                        return;
                    }
                    resolve(nguyenvatlieu);
                });
            });

            res.render('nhatkysanxuat/edit', { data: works[0], map, vumua, giongcay, nguyenvatlieu });

        }
        catch {
            console.error('Error:', error);
        }

    }
    //[PUT] UPDATE nhatkysanxuat/:id
    update(req, res, next) {
        const Id_work = req.params.id
        let token = req.cookies.tkvungtrong
        let par = jwt.verify(token, 'mk')
        const forms = {
            title: req.body.title,
            start: formatDate(req.body.start),
            end: formatDate(req.body.end),
            id_user: par._id,
            map_id: req.body.map_id,
            nguyenvatlieu_id: req.body.nguyenvatlieu_id,
            giongcay_id: req.body.giongcay_id,
            nongdo: req.body.nongdo,
            luongsudung: req.body.luongsudung,
            thoigiancachly: req.body.thoigiancachly,
            mucdich: req.body.mucdich,
            thietbi: req.body.thietbi,
            vesinhdungcu: req.body.vesinhdungcu,
            vumua_id: req.body.vumua_id
        }

        Works.updateWork(Id_work, forms, (err, results) => {
            if (err) {
                console.log('lỗi truy vấn', err)
            }
            else {
                res.redirect('/nhatkysanxuat/storeList')
            }
        })

    }
    //[GET] search 
    search(req, res, next) {
        var title = req.query.q
        Works.searchWorkByName(title, (err, works) => {
            if (err) {
                console.log('lỗi truy vấn', err)
            }
            else {
                res.render('nhatkysanxuat/store', { works })
            }
        })

    }
    // [POST] lấy các bản ghi được checkbox
    handleFormAction(req, res, next) {
        const ids = req.body.workIds
        switch (req.body.action) {
            case 'delete':
                Works.deleteAllWorksWithId(ids, (err, results) => {
                    if (err) {
                        console.error('Lỗi khi xóa bản ghi:', err);
                    } else {
                        res.redirect('back')

                    }
                })
                break;

            default:
                res.json({ message: 'action is invalid' })
        }
    }
    // [GET] trash
    trash(req, res) {
        let token = req.cookies.tkvungtrong
        let par = jwt.verify(token, 'mk')
        const page = parseInt(req.query.page) || 1; // Trang hiện tại
        const pageSize = 10; // Kích thước trang
        const startIndex = (page - 1) * pageSize;
        const endIndex = page * pageSize;
        Works.getAllWorksWithId_Trash(par._id, (err, data) => {
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
                    works: paginatedData,
                    pagination: {
                        prev: page > 1 ? page - 1 : null,
                        next: endIndex < data.length ? page + 1 : null,
                        pages: pages,
                    },
                };


                // Render template và truyền dữ liệu
                res.render('nhatkysanxuat/trash', viewData);

            }
        })
    }
    // [POST ] lấy các bản ghi được checkbox trong thùng rác
    handleFormActionTrash(req, res) {
        const ids = req.body.workIds

        switch (req.body.action) {
            case 'delete':
                Works.forceDestroyAllSelected_Work(ids, (err, results) => {
                    if (err) {
                        console.error('Lỗi khi xóa bản ghi:', err);
                    } else {
                        res.redirect('back')

                    }
                })
                break;
            case 'restore':
                Works.restoreAllSelected_Work(ids, (err, results) => {
                    if (err) {
                        console.error('Lỗi khi xóa bản ghi:', err);
                    } else {
                        res.redirect('back')

                    }
                })
                break;
            default:
                res.json({ message: 'action is invalid' })
        }
    }
    // [DELETE] xóa vĩnh viễn
    trashDelete(req, res) {
        const id = req.params.id
        Works.forceDestroyAllSelected_Work(id, (err, results) => {
            if (err) {
                console.error('Lỗi khi xóa bản ghi:', err);
            } else {
                res.redirect('back')

            }
        })
    } //[POST] khôi phục
    restore(req, res) {
        const id = req.params.id
        Works.restoreAllSelected_Work(id, (err, results) => {
            if (err) {
                console.error('Lỗi khi xóa bản ghi:', err);
            } else {
                res.redirect('back')

            }
        })
    }
    generatePdf(req, res) {
        let token = req.cookies.tkvungtrong
        let par = jwt.verify(token, 'mk')
        const idsString = req.body.ids
        const Ids = idsString.split(',');
        Works.getWorkById(par._id, Ids, async (err, results) => {
            if (err) {
                console.error('Lỗi khi xóa bản ghi:', err);
            } else {
                const { createAndSendPdf } = require('../middlewares/generate')
                const timestamp = new Date().getTime();
                const filename = `nguyenlieu_sanxuat_${timestamp}.pdf`;

                const htmlContent = `
     
                <!DOCTYPE html>
                <html lang="en">
                <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>PDF Generation</title>
                  <!-- Include Bootstrap CSS -->
                  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet">
                </head>
                <body>
                <div class="container">
                <br>
                <div style = "text-align:center"> <H1> NHẬT KÝ QUÁ TRÌNH SẢN XUẤT</H1></div><br>
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th>Thời gian thực hiện</th>
                            <th>Tên nguyên vật liệu</th>
                            <th>Nồng độ pha/bón</th>
                            <th>Tổng lượng sử dụng</th>
                            <th>Thời gian cách ly</th>
                            <th>Mục đích sử dụng</th>
                            <th>Lô/thửa</th>
                            <th>Thiết bị sử dụng</th>
                            <th>VSDC/thiết bị trước và sau khi sử dụng(Đ/K)</th>
                            <th>Người theo dõi</th>
                        </tr>
                    </thead>
                    <tbody>
                
                     ${results.map(item => `
                            <tr>
                              <td>${item.start} đến ${item.end}</td>
                              <td>${item.name}</td>
                              <td>${item.nongdo}</td>
                              <td>${item.luongsudung}</td>
                              <td>${item.thoigiancachly}</td>
                              <td>${item.mucdich}</td>
                              <td>${item.namearea}</td>
                              <td>${item.thietbi}</td>
                              <td>${item.vesinhdungcu}</td>
                              <td></td>
                              <!-- Add more columns here as needed -->
                            </tr>
                          `).join('')}
                    </tbody>
                </table>
              
                </div>
                  <!-- Include Bootstrap JS (optional) -->
                  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"></script>
                </body>
                </html>
                
                      `;
                createAndSendPdf(htmlContent, filename, res);
            }
        })

    }

}
module.exports = new NhatKySanXuatController