const Shipment = require('../models/Shipment')
const Product = require('../models/Product')
const jwt = require('jsonwebtoken')
const Generate = require('../middlewares/generate')
const NhatKySanXuat = require('../models/NhatKySanXuat')
const NhatKyDauVao = require('../models/NhatKyDauVao')
const CenterMap = require('../models/MapCenter')
const Map = require('../models/Map')
const GetAllProduct = (UserId, search) => {
    return new Promise((resolve, reject) => {
        Product.getAllquanlysanpham(UserId, search, (err, results) => {
            if (err) {
                reject(err)
            }
            else {
                resolve(results)
            }
        })
    })
}
const GetProductById = (User_id, Id) => {
    return new Promise((resolve, reject) => {
        Product.getSanPham_By_Id(User_id, Id, (err, results) => {
            if (err) {
                reject(err)
            }
            else {
                resolve(results)
            }
        })
    })
}
const GetAllShipment = (User_id, search) => {
    return new Promise((resolve, reject) => {
        Shipment.getAllShipment(User_id, search, (err, results) => {
            if (err) {
                reject(err)
            }
            else {
                resolve(results)
            }
        })
    })
}
const GetShipmentByCode = (code) => {
    return new Promise((resolve, reject) => {
        Shipment.getShipmentByCode(code, (err, results) => {
            if (err) {
                reject(err)
            }
            else {
                resolve(results)
            }
        })
    })
}
const GetAllNhatKySanXuatByCodeOfShipment = (tree_id, season_id, map_id, year_id, user_id) => {
    return new Promise((resolve, reject) => {
        NhatKySanXuat.getAllNhatKySanXuatByCodeOfShipment(tree_id, season_id, map_id, year_id, user_id, (err, results) => {
            if (err) {
                reject(err)
            }
            else {
                resolve(results)
            }
        })
    })
}
const GetAllNguyenLieuDauVaoByCodeShipment = (tree_id, season_id, map_id, year_id, user_id) => {
    return new Promise((resolve, reject) => {
        NhatKyDauVao.getAllNguyenLieuDauVaoByCodeShipment(tree_id, season_id, map_id, year_id, user_id, (err, results) => {
            if (err) {
                reject(err)
            }
            else {
                resolve(results)
            }
        })
    })
}
const GetCenterMap = (user_id) => {
    return new Promise((resolve, reject) => {
        CenterMap.getCenterLimitOne(user_id, (err, results) => {
            if (err) {
                reject(err)
            }
            else {
                resolve(results)
            }
        })
    })
}
const GetMapById = (map_id, user_id) => {
    return new Promise((resolve, rejects) => {
        Map.getMapWithId(map_id, user_id, (err, results) => {
            if (err) {
                reject(err)
            }
            else {
                resolve(results)
            }
        })

    })
}

class ShipmentController {
    index(req, res) {
        let token = req.cookies.tkvungtrong
        let par = jwt.verify(token, process.env.SECRET)
        const code = Generate.generateRandomString(8)
        const page = parseInt(req.query.page) || 1;
        const pageSize = req.query.recordsPerPage || 10;
        const startIndex = (page - 1) * pageSize;
        const endIndex = page * pageSize;
        const searchProduct = ''
        const searchShipment = req.query.name || ''
        Promise.all([
            GetAllProduct(par._id, searchProduct),
            GetAllShipment(par._id, searchShipment)
        ]).then(([products, data]) => {
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
                products,
                data: paginatedData,
                searchShipment,
                code,
                recordsPerPage: pageSize,
                pagination: {
                    prev: page > 1 ? page - 1 : null,
                    next: endIndex < data.length ? page + 1 : null,
                    pages: pages,
                },
            };
            res.render('shipment/store', viewData)
        })
    }
    creatShipment(req, res) {

        let token = req.cookies.tkvungtrong
        let par = jwt.verify(token, process.env.SECRET)
        const forms = {
            product_id: req.body.product_id,
            nameShipment: req.body.nameShipment,
            code: req.body.code,
            quantity: req.body.quantity,
            unit: req.body.unit,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            user_id: par._id,
            background: req.body.background,
            logo: req.file.path
        }

        Shipment.creatShipment(forms, (err, results) => {
            if (err) {
                console.log('Lỗi truy vấn', err)
            }
            else {
                res.redirect('back')
            }
        })

    }
    update(req, res) {

        let token = req.cookies.tkvungtrong
        let par = jwt.verify(token, process.env.SECRET)
        const Id = req.params.id
        const forms = {
            product_id: req.body.product_id,
            nameShipment: req.body.nameShipment,
            code: req.body.code,
            quantity: req.body.quantity,
            unit: req.body.unit,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            user_id: par._id,
            background: req.body.background,
            logo: req.file ? req.file.path : req.body.imageUrl
        }

        Shipment.update(forms, Id, (err, results) => {
            if (err) {
                console.log('Lỗi truy vấn', err)
            }
            else {
                res.redirect('back')
            }
        })
    }
    delete(req, res) {
        const Id = req.params.id
        let token = req.cookies.tkvungtrong
        let par = jwt.verify(token, process.env.SECRET)
        Shipment.delete(Id, par._id, (err, results) => {
            if (err) {
                console.log('loi truy van', err)
            }
            else {
                res.redirect('back')
            }
        })
    }

    home(req, res) {
        res.render('shipment/home')
    }
    tracuu(req, res) {
        const code = req.query.code
        Shipment.getShipmentByCode(code, (err, shipment) => {
            if (err) {
                console.log('Lỗi truy vấn', err)
            }
            else {
                if (shipment.length > 0) {
                    Promise.all([
                        GetAllNhatKySanXuatByCodeOfShipment(shipment[0].tree_id, shipment[0].season_id, shipment[0].map_id, shipment[0].year_id, shipment[0].user_id),
                        GetAllNguyenLieuDauVaoByCodeShipment(shipment[0].tree_id, shipment[0].season_id, shipment[0].map_id, shipment[0].year_id, shipment[0].user_id),
                        GetCenterMap(shipment[0].user_id),
                        GetMapById(shipment[0].map_id, shipment[0].user_id)
                    ])
                        .then(([nhatkysanxuat, nhatkydauvao, centermap, map]) => {

                            res.render('shipment/client', { data: shipment[0], nhatkydauvao, nhatkysanxuat, centermap: centermap[0], map: map[0], done: true })
                        }).catch(err => {
                            console.log('Lỗi truy vấn', err);
                        });
                }
                else {
                    res.render('shipment/client', { done: false })
                }


            }
        })
    }


    generatePdf(req, res) {
        try {
            let token = req.cookies.tkvungtrong
            let par = jwt.verify(token, process.env.SECRET)
            const Id = req.params.id
            Shipment.getShipmentById(Id, par._id, async (err, results) => {
                if (err) {
                    console.error('Lỗi khi xóa bản ghi:', err);
                } else {

                    const { createAndSendPdf } = require('../middlewares/generate')

                    const filename = `QR_CODE_${results[0].code}.pdf`;
                    const logo = process.env.LINK + results[0].logo
                    const background = process.env.LINK + results[0].background
                    // Thêm thư viện QRCode
                    const QRCode = require('qrcode');
                    const qrCodeData = `${process.env.LINK}shipment/search?code=${results[0].code}`;
                    const qrCodeBuffer = await QRCode.toBuffer(qrCodeData);
                    //  res.render('home')
                    const htmlContent = `<!DOCTYPE html>
                    <html lang="en">
                    
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1">
                        <title>Document</title>
                        <style>
                            body,
                            html {
                                height: 100%;
                                margin: 0;
                                display: flex;
                                justify-content: center;
                                align-items: center;
                            }
                    
                            .selector-for-some-widget {
                                box-sizing: content-box;
                            }
                    
                            h1,
                            h3,
                            p,
                            span,
                            strong {
                                color: #166335 !important;
                            }
                            html {
                                font-family: 'Times New Roman', Times, serif !important;
                                height: 100vh;
                                width: 100%;
                            }
                    
                            body {
                                width: 100%;
                            }
                    
                            .background {
                                width: 100%;
                                height: 100%;
                                position: relative;
                                justify-content: center;
                                text-align: center;
                            }
                    
                            .img_background {
                                width: 100%;
                                height: 100%;
                                object-fit: cover;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                            }
                    
                    
                            .content {
                                position: absolute;
                                top: 50%;
                                transform: translateY(-50%);
                                padding: 0 75px;
                            }
                    
                            .content_left {
                                text-align: center;
                                padding: 0 0 0 29px !important;
                            }
                    
                            .content_left-logo {
                                width: 300px;
                                height: 200px;
                                object-fit: contain;
                    
                            }
                    
                            .content_left-address {
                                font-size: 24px;
                                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                                line-height: 28px;
                                margin-top: 10px;
                                letter-spacing: -1px;
                            }
                    
                            .content_left-title {
                                font-size: 24px;
                                line-height: 28px;
                                display: inline-block;
                                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                                flex: 1;
                                margin-top: auto;
                            }
                            .content_right {
                                height: 300px;
                                border-radius: 20px;
                                padding-top: 20px;
                                text-align: center;
                            }
                    
                            .content_right-qr {
                                margin-top: 30px;
                                border-radius: 20px;
                                width: 250px;
                                height: 250px;
                                margin: auto;
                                background-color: rgb(255, 254, 254);
                                display: flex;
                                justify-content: center;
                                align-items: center;
                            }
                    
                            .img-qr {
                                width: 230px;
                                height: 230px;
                                object-fit: cover;
                            }
                    
                            .content_right-title {
                                font-weight: 600;
                                font-size: 24px;
                                margin: 12px 0;
                                font-style: italic;
                                letter-spacing: 1px;
                                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                            }
                    
                            .container-creat {
                                width: 1000px;
                                height: 500px;
                                margin: 0 auto;
                            }
                        </style>
                        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
                    </head>
                    
                    <body>
                        <div class="container-creat background ">
                            <img src="${background}" class="img_background" alt="">
                            <div class="content row">
                                <div class="content_left col-sm-7">
                                    <img src="${logo}"
                                        class="content_left-logo" alt="">
                                    <strong class="content_left-title">
                                    ${results[0].productionUnit}
                                    </strong>
                                    <p class="content_left-address">
                                        Địa chỉ: ${results[0].address}
                                    </p>
                                </div>
                                <div class="content_right col-sm-5">
                                   
                                    <div class="content_right-qr">
                                        <img src="data:image/png;base64,${qrCodeBuffer.toString('base64')}" class="img-qr">
                                    </div>
                                    <p class="content_right-title">${results[0].title}</p>
                                </div>
                            </div>
                        </div>
                    </body>
                    </html>
                    `
                    createAndSendPdf(htmlContent, filename, res);
                }
            });
        }
        catch (error) {
            console.error('Lỗi khi xử lý yêu cầu:', error);
            res.status(500).send('Lỗi khi xử lý yêu cầu');
        }
    }
}
module.exports = new ShipmentController