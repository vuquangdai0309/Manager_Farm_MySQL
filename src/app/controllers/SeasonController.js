const Season = require('../models/Season')
const Tree = require('../models/Tree')
class SeasonController {
    index(req, res) {
        const page = parseInt(req.query.page) || 1; // Trang hiện tại
        const pageSize = 12; // Kích thước trang
        const startIndex = (page - 1) * pageSize;
        const endIndex = page * pageSize;
        const search = req.query.tree || ''
        Tree.getAllTree((err, tree) => {
            if (err) {
                console.log('Lỗi truy vấn', err)
            }
            else {
                Season.getAllSeason(search, (err, data) => {
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
                            season: paginatedData,
                            tree: tree,
                            search: search,
                            recordsPerPage: pageSize,
                            pagination: {
                                prev: page > 1 ? page - 1 : null,
                                next: endIndex < data.length ? page + 1 : null,
                                pages: pages,
                            },
                        };
                        res.render('season/store', viewData)
                    }
                })
            }
        })
    }
    creat(req, res) {
        Season.creatSeason(req.body, (err, results) => {
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
        Season.updateSeason(Id, req.body, (err, results) => {
            if (err) {
                console.log('Lỗi truy vấn', err)
            }
            else {
                res.redirect('back')
            }
        })
    }
    getSeasonWithTree(req, res) {
        const Tree_id = req.params.tree
        Season.getSeasonbyTree(Tree_id, (err, results) => {
            if (err) {
                console.log('Lỗi truy vấn', err)
            }
            else {
                res.json(results)
            }
        })
    }

}
module.exports = new SeasonController