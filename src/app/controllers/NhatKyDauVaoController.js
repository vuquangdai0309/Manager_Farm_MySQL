
var jwt = require('jsonwebtoken');
const VuMua = require('../models/VuMua');
const NguyenVatLieu = require('../models/NguyenVatLieu');
const GiongCay = require('../models/GiongCay');
const NhatKyDauVao = require('../models/NhatKyDauVao')
const QRCode = require('qrcode');
const { formatDate } = require('../middlewares/format')
class NhatKyDauVaoController {
    index(req, res) {
        let token = req.cookies.tkvungtrong
        let par = jwt.verify(token, 'mk')
        const page = parseInt(req.query.page) || 1; // Trang hiện tại
        const pageSize = 10; // Kích thước trang
        const startIndex = (page - 1) * pageSize;
        const endIndex = page * pageSize;
        const searchvumua = req.query.vumua || '';
        const searchgiongcay = req.query.giongcay || '';
        VuMua.getAllVumua((err, vumua) => {
            if (err) {
                console.log('lỗi truy vấn', err)
            }
            else {
                NguyenVatLieu.getAllNguyenLieu((err, nguyenvatlieu) => {
                    if (err) {
                        console.log('lỗi truy vấn', err)
                    }
                    else {
                        GiongCay.getAllGiongCay((err, giongcay) => {
                            if (err) {
                                console.log('lỗi truy vấn', err)
                            }
                            else {
                                NhatKyDauVao.searchAllBy_GiongCay_And_Vumua(searchgiongcay, searchvumua, par._id, (err, data) => {
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
                                            nhatkydauvao: paginatedData,
                                            searchvumua: searchvumua,
                                            searchgiongcay: searchgiongcay,
                                            giongcay: giongcay,
                                            vumua: vumua,
                                            nguyenvatlieu: nguyenvatlieu,
                                            pagination: {
                                                prev: page > 1 ? page - 1 : null,
                                                next: endIndex < data.length ? page + 1 : null,
                                                pages: pages,
                                            },
                                        };
console.log(viewData.nhatkydauvao)
                                        res.render('nhatkydauvao/store', viewData)

                                    }
                                })
                            }
                        })
                    }
                })
            }

        })
    }
    creat(req, res) {
        let token = req.cookies.tkvungtrong
        let par = jwt.verify(token, 'mk')
        const forms = {
            thoigian: formatDate(req.body.thoigian),
            id_user: par._id,
            nguyenvatlieu_id: req.body.nguyenvatlieu_id,
            giongcay_id: req.body.giongcay_id,
            soluong: req.body.soluong,
            tenvadiachi: req.body.tenvadiachi,
            hansudung: formatDate(req.body.hansudung),
            phuongphapxuly: req.body.phuongphapxuly,
            nguyenlieusanxuat: req.body.nguyenlieusanxuat,
            hoachatxuly: req.body.hoachatxuly,
            vumua_id: req.body.vumua_id
        }
        NhatKyDauVao.addNguyenLieuDauVao(forms, (err, results) => {
            if (err) {
                console.log('lỗi truy vấn', err)
            }
            else {
                res.redirect('back')
            }
        })
    }
    edit(req, res) {

        let token = req.cookies.tkvungtrong
        let par = jwt.verify(token, 'mk')
        const id = req.params.id
        NhatKyDauVao.getNguyenLieuDauVao_Id(id, par._id, (err, results) => {
            if (err) {
                console.log('lỗi truy vấn', err)
            }
            else {
                VuMua.getAllVumua((err, vumua) => {
                    if (err) {
                        console.log('lỗi truy vấn', err)
                    }
                    else {
                        NguyenVatLieu.getAllNguyenLieu((err, nguyenvatlieu) => {
                            if (err) {
                                console.log('lỗi truy vấn', err)
                            }
                            else {
                                GiongCay.getAllGiongCay((err, giongcay) => {
                                    if (err) {
                                        console.log('lỗi truy vấn', err)
                                    }
                                    else {
                                      
                                        res.render('nhatkydauvao/edit', { data: results[0], vumua, nguyenvatlieu, giongcay })
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })
    }
    update(req, res) {
        let token = req.cookies.tkvungtrong
        let par = jwt.verify(token, 'mk')
        const Id = req.params.id
     
        const forms = {
            thoigian: formatDate(req.body.thoigian),
            id_user: par._id,
            nguyenvatlieu_id: req.body.nguyenvatlieu_id,
            giongcay_id: req.body.giongcay_id,
            soluong: req.body.soluong,
            tenvadiachi: req.body.tenvadiachi,
            hansudung: formatDate(req.body.hansudung),
            phuongphapxuly: req.body.phuongphapxuly,
            nguyenlieusanxuat: req.body.nguyenlieusanxuat,
            hoachatxuly: req.body.hoachatxuly,
            vumua_id: req.body.vumua_id
        }
        NhatKyDauVao.updateNguyenLieuDauVao(forms, Id, (err, result) => {
            if (err) {
                console.log('Lỗi truy vấn', err)
            }
            else {
                res.redirect('/nhatkydauvao')
            }
        })
    }
    delete(req, res) {
        const Id = req.params.id
        NhatKyDauVao.deleteNguyenLieuDauVao(Id, (err, results) => {
            if (err) {
                console.log('Lỗi truy vấn', err)
            }
            else {
                res.redirect('back')
            }
        })
    }
    destroy(req, res) {
        const Id = req.params.id
        NhatKyDauVao.destroyNguyenLieuDauVao(Id, (err, results) => {
            if (err) {
                console.log('Lỗi truy vấn', err)
            }
            else {
                res.redirect('back')
            }
        })
    }
    trash(req, res) {
        let token = req.cookies.tkvungtrong
        let par = jwt.verify(token, 'mk')
        const page = parseInt(req.query.page) || 1; // Trang hiện tại
        const pageSize = 10; // Kích thước trang
        const startIndex = (page - 1) * pageSize;
        const endIndex = page * pageSize;
        NhatKyDauVao.getNguyenLieuDauVao_Trash(par._id, (err, data) => {
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
                    nhatkydauvao: paginatedData,
                    pagination: {
                        prev: page > 1 ? page - 1 : null,
                        next: endIndex < data.length ? page + 1 : null,
                        pages: pages,
                    },
                };


                // Render template và truyền dữ liệu
                res.render('nhatkydauvao/trash', viewData);

            }
        })
    }
    handleformactions(req, res) {
        const ids = req.body.workIds
        switch (req.body.action) {
            case 'delete':
                NhatKyDauVao.deleteNguyenLieuDauVao(ids, (err, results) => {
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
    handleformactionstrash(req, res) {
        const ids = req.body.workIds

        switch (req.body.action) {
            case 'delete':
                NhatKyDauVao.destroyNguyenLieuDauVao(ids, (err, results) => {
                    if (err) {
                        console.error('Lỗi khi xóa bản ghi:', err);
                    } else {
                        res.redirect('back')
                    }
                })
                break;
            case 'restore':
                NhatKyDauVao.restoreNguyenLieuDauVao(ids, (err, results) => {
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
    generatePdf(req, res) {
        let token = req.cookies.tkvungtrong
        let par = jwt.verify(token, 'mk')
        const idsString = req.body.ids
        const Ids = idsString.split(',');
        NhatKyDauVao.getNguyenLieuDauVao_Id(Ids, par._id, async (err, results) => {
            if (err) {
                console.error('Lỗi khi xóa bản ghi:', err);
            } else {
                const { createAndSendPdf } = require('../middlewares/generate')
                const timestamp = new Date().getTime();
                const filename = `nguyenlieu_dauvao_${timestamp}.pdf`;
                // thay đổi ở đây
            
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
                <div style = "text-align:center"> <H1> NHẬT KÝ THEO DÕI NGUYÊN VẬT LIỆU ĐẦU VÀO</H1></div>
                <p style = "text-align:center">(Bao gồm giống cây trồng (hạt giống, củ giống, cây giống, hom giống…), phân bón/chất bổ sung, thuốc BVTV, hóa chất khác)</p>
                <table class="table table-bordered">
                <thead>
                <tr>

                 
                    <th rowspan="2">Thời gian mua/ sản xuất</th>
                    <th rowspan="2">Tên nguyên vật liệu</th>
                    <th rowspan="2">Số lượng</th>
                    <th rowspan="2">Tên và địa chỉ mua vật tư</th>
                    <th rowspan="2">Hạn sử dụng</th>
                    <th rowspan="2">Người mua/ người theo dõi</th>
                    <th colspan="4">Đối với vật tư tự sản xuất,ghi thêm thông tin sau</th>
                    
                </tr>
                <tr>
                    <th>Nguyên liệu sản xuất</th>
                    <th>Phương pháp xử lý</th>
                    <th>Hóa chất xử lý</th>
                    <th>Người xử lý</th>
                </tr>
            </thead>
                    <tbody>
                     ${results.map(item => `
                            <tr>
                              <td>${item.thoigian}</td>
                              <td>${item.name}</td>
                              <td>${item.soluong}</td>
                              <td>${item.tenvadiachi}</td>
                              <td>${item.hansudung}</td>
                              <td></td>
                              <td>${item.nguyenlieusanxuat}</td>
                              <td>${item.phuongphapxuly}</td>
                              <td>${item.hoachatxuly}</td>
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
module.exports = new NhatKyDauVaoController