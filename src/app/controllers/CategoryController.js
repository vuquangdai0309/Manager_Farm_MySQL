const Category = require('../models/Category')
const TuLieu = require('../models/TuLieu')
const { generateUniqueSlug } = require('../middlewares/autoSlug')
class TuLieuController {
    storeCategory(req, res) {
        const page = parseInt(req.query.page) || 1; // Trang hiện tại
        const pageSize = 12; // Kích thước trang
        const startIndex = (page - 1) * pageSize;
        const endIndex = page * pageSize;
        Category.getAllCategories((err, data) => {
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
                    pagination: {
                        prev: page > 1 ? page - 1 : null,
                        next: endIndex < data.length ? page + 1 : null,
                        pages: pages,
                    },
                };
                // Render template và truyền dữ liệu               
                res.render('category/store', viewData)
            }
        })

    }
    creat(req, res) {
        Category.addCategory(({
            title: req.body.title,
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
    // edit(req, res) {
    //     const BaiVietSlug = req.params.slug
    //     Category.getCategoryBySlug(BaiVietSlug, (err, data) => {
    //         if (err) {
    //             console.error('Lỗi truy vấn:', err);
    //             res.status(500).send('Internal Server Error');
    //         } else {
    //             if (data.length === 0) {
    //                 res.status(404).send(' not found');
    //             } else {
    //                 res.render('category/edit', { data: data[0] })
    //             }
    //         }
    //     })
    // }
    update(req, res) {
        const BaiVietSlug = req.params.slug
        Category.getCategoryBySlug(BaiVietSlug, (err, data) => {
            if (err) {
                console.error('Lỗi truy vấn:', err);
                res.status(500).send('Internal Server Error');
            } else {
                if (data.length === 0) {
                    res.status(404).send(' not found');
                } else {
                    Category.updateCategory(data[0]._id, ({
                        title: req.body.title,
                        slug: generateUniqueSlug(req.body.title)
                    }), (err, results) => {
                        if (err) {
                            console.error('Lỗi truy vấn:', err);
                            res.status(500).send('Internal Server Error');
                        } else {
                            if (results.affectedRows === 0) {
                                res.status(404).send(' not found');
                            } else {
                                res.redirect('/category/store')
                            }
                        }
                    });
                }
            }
        })


    }
    delete(req, res) {
        const id = req.params.id
        Category.deleteCategory(id, (err) => {
            if (err) {
                console.log('lỗi truy vấn ', err)
            }
            else {
                TuLieu.deleteBaiViet_With_Category(id, (err) => {
                    if (err) {
                        console.log('lỗi truy vấn ', err)
                    }
                    else {
                        res.redirect('back')
                    }
                })
            }
        })
    }
}
module.exports = new TuLieuController