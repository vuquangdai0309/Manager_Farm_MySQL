const Tree = require('../models/Tree')
class TreeController {
    index(req, res) {
        const page = parseInt(req.query.page) || 1; // Trang hiện tại
        const pageSize =  12; // Kích thước trang
        const startIndex = (page - 1) * pageSize;
        const endIndex = page * pageSize;
        Tree.getAllTree((err, data) => {
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
                    tree: paginatedData,
                    recordsPerPage: pageSize,
                    pagination: {
                        prev: page > 1 ? page - 1 : null,
                        next: endIndex < data.length ? page + 1 : null,
                        pages: pages,
                    },
                };
                res.render('tree/store', viewData)
            }
        })
    }
    creat(req, res) {
        Tree.creatTree(req.body, (err, results) => {
            if (err) {
                console.log('Lỗi truy vấn', err)
            }
            else {

                res.redirect('back')
            }
        })
    }
    update(req, res) {
        const Id = req.params.id
        Tree.updateTree(Id, req.body, (err, results) => {
            if (err) {
                console.log('Lỗi truy vấn', err)
            }
            else {
                res.redirect('back')
            }
        })
    }
}
module.exports = new TreeController