const BaiViet = require('../models/TuLieu')
const Category = require('../models/Category')
const moment = require('moment/moment')
const { generateUniqueSlug } = require('../middlewares/autoSlug')
class TuLieuController {
    index(req, res) {
        const page = parseInt(req.query.page) || 1; // Trang hiện tại
        const pageSize = 8; // Kích thước trang
        const startIndex = (page - 1) * pageSize;
        const endIndex = page * pageSize;
        const searchItem = req.query.search || ''
       
        Category.getAllCategories((err, results) => {
            if (err) {
                console.log('lỗi truy vấn', err)
            }
            else {
                BaiViet.searchBaiVietBy_IdCategory(searchItem, (err, data) => {
                    if (err) {
                        console.log('lỗi truy vấn', err)
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
                            data: paginatedData,
                            searchItem,
                            category: results,
                            pagination: {
                                prev: page > 1 ? page - 1 : null,
                                next: endIndex < data.length ? page + 1 : null,
                                pages: pages,
                            },
                        };
                        // Render template và truyền dữ liệu               
                        res.render('tulieu/tulieu', viewData)
                    }
                })
            }
        })

    }
    renderTuLieu(req, res) {
        const page = parseInt(req.query.page) || 1; // Trang hiện tại
        const pageSize = 5; // Kích thước trang
        const startIndex = (page - 1) * pageSize;
        const endIndex = page * pageSize;
        Category.getAllCategories((err, results) => {
            if (err) {
                console.log('lỗi truy vấn', err)
            }
            else {
                BaiViet.getAllBaiViets((err, data) => {
                    if (err) {
                        console.log('lỗi truy vấn', err)
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
                            category: results,
                            data: paginatedData,
                            pagination: {
                                prev: page > 1 ? page - 1 : null,
                                next: endIndex < data.length ? page + 1 : null,
                                pages: pages,
                            },
                        };
                        // Render template và truyền dữ liệu               
                        res.render('tulieu/store', viewData)
                    }
                })
            }
        })
    }
    creat(req, res) {
        BaiViet.addBaiViet(({
            title: req.body.title,
            image: req.file.path,
            content: req.body.editor,
            date: moment().format('DD-MM-YYYY'),
            category_id: req.body.category_id,
            slug: generateUniqueSlug(req.body.title)
        }), (err, results) => {
            if (err) {
                console.error('Lỗi thêm sản phẩm:', err);
                res.status(500).send('Internal Server Error');
            } else {
                console.log('Sản phẩm đã được thêm thành công:',);
                res.redirect('back')
            }
        })
    }
    delete(req, res, next) {
        const baivietId = req.params.id
        BaiViet.deleteBaiViet(baivietId, (err, results) => {
            if (err) {
                console.error('Lỗi truy vấn:', err);
                res.status(500).send('Internal Server Error');
            } else {
                if (results.affectedRows === 0) {
                    res.status(404).send(' not found');
                } else {
                    res.redirect('back')
                }
            }
        })
    }
    detailClient(req, res) {
        const BaiVietSlug = req.params.slug

        BaiViet.getBaiVietBySlug(BaiVietSlug, (err, data) => {
            if (err) {
                console.error('Lỗi truy vấn:', err);
                res.status(500).send('Internal Server Error');
            } else {
                if (data.length === 0) {
                    res.status(404).send(' not found');
                } else {

                    res.render('tulieu/detailClient', { data: data[0] })
                }
            }
        })
    }
    detail(req, res) {
        const BaiVietId = req.params.id
        BaiViet.getBaiVietById(BaiVietId, (err, data) => {
            if (err) {
                console.error('Lỗi truy vấn:', err);
                res.status(500).send('Internal Server Error');
            } else {
                if (data.length === 0) {
                    res.status(404).send(' not found');
                } else {
                    console.log(data)
                    res.render('tulieu/detail', { data: data[0] })
                }
            }
        })
    }
    edit(req, res) {
        const BaiVietId = req.params.id
        Category.getAllCategories((err, results) => {
            if (err) {
                console.log('lỗi truy vấn', err)
            }
            else {
                BaiViet.getBaiVietById(BaiVietId, (err, data) => {
                    if (err) {
                        console.error('Lỗi truy vấn:', err);
                        res.status(500).send('Internal Server Error');
                    } else {
                        if (data.length === 0) {
                            res.status(404).send(' not found');
                        } else {
                            res.render('tulieu/edit', { data: data[0], category: results })
                        }
                    }
                })
            }
        })
    }
    update(req, res) {
        const BaiVietId = req.params.id
        if (req.file) {
            BaiViet.updateBaiViet(BaiVietId, ({
                title: req.body.title,
                category_id: req.body.category_id,
                image: req.file.path,
                content: req.body.editor,
                date: moment().format('DD-MM-YYYY'),
                slug: generateUniqueSlug(req.body.title)
            }), (err, results) => {
                if (err) {
                    console.error('Lỗi truy vấn:', err);
                    res.status(500).send('Internal Server Error');
                } else {
                    if (results.affectedRows === 0) {
                        res.status(404).send(' not found');
                    } else {
                        res.json({ message: 'thành công' })
                    }
                }
            });
        }
        else if (req.body.imageurl) {
            BaiViet.updateBaiViet(BaiVietId, ({
                title: req.body.title,
                category_id: req.body.category_id,
                image: req.body.imageurl,
                content: req.body.editor,
                date: moment().format('DD-MM-YYYY'),
                slug: generateUniqueSlug(req.body.title)
            }), (err, results) => {
                if (err) {
                    console.error('Lỗi truy vấn:', err);
                    res.status(500).send('Internal Server Error');
                } else {
                    if (results.affectedRows === 0) {
                        res.status(404).send(' not found');
                    } else {
                        res.json({ message: 'thành công' })
                    }
                }
            });
        }
    }
}
module.exports = new TuLieuController