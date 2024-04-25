const Map = require('../models/Map')
var jwt = require('jsonwebtoken');
const Generate = require('../middlewares/generate')
const TruyXuat = require('../models/TruyXuatNguonGoc');
const QRCode = require('qrcode');
class TruyXuatController {
    index(req, res) {
        res.render('truyxuatnguongoc/home')
    }
    tracuu(req, res) {
        const code = req.query.code
        TruyXuat.getTruyXuat_By_code(code, (err, results) => {
            if (err) {
                console.log('Lỗi truy vấn', err)
            }
            else {
                res.render('truyxuatnguongoc/client', { data: results[0] })
            }
        })

    }
    manager(req, res) {
        let token = req.cookies.tkvungtrong
        let par = jwt.verify(token, 'mk')
        const page = parseInt(req.query.page) || 1; // Trang hiện tại
        const pageSize = 8; // Kích thước trang
        const startIndex = (page - 1) * pageSize;
        const endIndex = page * pageSize;
        Map.getAllMapsTypePolygon(par._id, (err, results) => {
            if (err) {
                console.log('Lỗi truy vấn', err)
            }
            else {
                TruyXuat.getAllTruyxuatnguongoc(par._id, (err, data) => {
                    if (err) {
                        console.log('Loi truy van', err)
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
                            results: results,
                            data: paginatedData,
                            code: Generate.generateRandomString(8),
                            pagination: {
                                prev: page > 1 ? page - 1 : null,
                                next: endIndex < data.length ? page + 1 : null,
                                pages: pages,
                            },
                        };
                        res.render('truyxuatnguongoc/manager', viewData)
                    }
                })
            }
        })

    }
    create(req, res) {
        let token = req.cookies.tkvungtrong
        let par = jwt.verify(token, 'mk')

        const forms = {
            code: req.body.code,
            title: req.body.title,
            phone: req.body.phone,
            email: req.body.email,
            address: req.body.address,
            productionUnit: req.body.productionUnit,
            map_id: req.body.map_id,
            user_id: par._id,
            image: req.file.path,
            content: req.body.editor
        }
        console.log(forms)
        TruyXuat.createTruyXuat(forms, (err, results) => {
            if (err) {
                console.log("Loi truy van", err)
            }
            else {
                res.redirect('back')
            }
        })
    }
    delete(req, res) {
        const id = req.params.id
        TruyXuat.deleteTruyXuat(id, (err, results) => {
            if (err) {
                console.log('Lỗi truy vấn', err)
            }
            else {
                res.redirect('back')
            }
        })
    }
    edit(req, res) {
        const id = req.params.id
        let token = req.cookies.tkvungtrong
        let par = jwt.verify(token, 'mk')

        TruyXuat.getTruyXuat_By_Id(par._id, id, (err, results) => {
            if (err) {
                console.log('Lỗi truy vấn', err)
            }
            else {
                Map.getAllMapsTypePolygon(par._id, (err, maps) => {
                    if (err) {
                        console.log('Lỗi truy vấn', err)
                    }
                    else {
                        res.render('truyxuatnguongoc/edit', { data: results[0], maps })
                    }
                })


            }
        })

    }
    update(req, res) {
        const id = req.params.id
        let token = req.cookies.tkvungtrong
        let par = jwt.verify(token, 'mk')

        if (req.file) {
            const forms = {
                image: req.file.path,
                code: req.body.code,
                title: req.body.title,
                productionUnit: req.body.productionUnit,
                map_id: req.body.map_id,
                phone: req.body.phone,
                email: req.body.email,
                address: req.body.address,
                user_id: par._id,
                content: req.body.editor
            }
            TruyXuat.updateTruyXuat(forms, id, (err, results) => {
                if (err) {
                    console.log('Lỗi truy vấn', err)
                }
                else {
                    res.redirect('/truyxuatnguongoc/quan-ly')
                }
            })
        }
        else if (req.body.imageurl) {
            const forms = {
                image: req.body.imageurl,
                code: req.body.code,
                title: req.body.title,
                productionUnit: req.body.productionUnit,
                map_id: req.body.map_id,
                phone: req.body.phone,
                email: req.body.email,
                address: req.body.address,
                user_id: par._id,
                content: req.body.editor
            }

            TruyXuat.updateTruyXuat(forms, id, (err, results) => {
                if (err) {
                    console.log('Lỗi truy vấn', err)
                }
                else {
                    //console.log(results)
                    res.redirect('/truyxuatnguongoc/quan-ly')
                }
            })
        }
    }
    generatePdf(req, res) {
        let token = req.cookies.tkvungtrong
        let par = jwt.verify(token, 'mk')
        const idsString = req.body.ids
        const Ids = idsString.split(',');
        TruyXuat.getTruyXuat_By_Id(par._id, Ids, async (err, results) => {
            if (err) {
                console.error('Lỗi khi xóa bản ghi:', err);
            } else {
                const { createAndSendPdf } = require('../middlewares/generate')
                const timestamp = new Date().getTime();
                const filename = `Ma_QR_${timestamp}.pdf`;

                // Thêm thư viện QRCode
                const QRCode = require('qrcode');

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
                        <div style="text-align:center"> <H1> Danh sách mã QR</H1></div><br>
                        <table class="table table-bordered">
                            <thead style="text-align: center;">
                                <tr>
                                    <th>Tên sản phẩm</th>
                                    <th>Code</th>
                                    <th>Mã QR</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${await Promise.all(results.map(async (item) => {
                    const qrCodeData = `https://nongnghieplh.net/truyxuatnguongoc/tra-cuu?code=${item.code}`;
                    const qrCodeBuffer = await QRCode.toBuffer(qrCodeData);
                    return `
                                        <tr style="text-align: center;">
                                            <td>${item.title}</td>
                                            <td>${item.code}</td>
                                            <td><img src="data:image/png;base64,${qrCodeBuffer.toString('base64')}" alt="QR Code"></td>  
                                        </tr>
                                    `;
                })).then(rows => rows.join(''))}
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
        });
    }

}
module.exports = new TruyXuatController