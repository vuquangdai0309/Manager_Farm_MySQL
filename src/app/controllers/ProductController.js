const Map = require('../models/Map')
var jwt = require('jsonwebtoken');
const Generate = require('../middlewares/generate')
const SanPham = require('../models/Product');
const Season = require('../models/Season')
const Year = require('../models/Year')
const Tree = require('../models/Tree')

const getAllMaps = (userId) => {
    return new Promise((resolve, reject) => {
        Map.getAllMapsTypePolygon(userId, (err, maps) => {
            if (err) {
                reject(err);
            } else {
                resolve(maps);
            }
        });
    });
};

// Định nghĩa hàm lấy tất cả các mùa với Promise
const getAllSeasons = (search) => {
    return new Promise((resolve, reject) => {
        Season.getAllSeason(search, (err, season) => {
            if (err) {
                reject(err);
            } else {
                resolve(season);
            }
        });
    });
};

// Định nghĩa hàm lấy tất cả các cây với Promise
const getAllTrees = () => {
    return new Promise((resolve, reject) => {
        Tree.getAllTree((err, tree) => {
            if (err) {
                reject(err);
            } else {
                resolve(tree);
            }
        });
    });
};

// Định nghĩa hàm lấy tất cả các năm với Promise
const getAllYears = () => {
    return new Promise((resolve, reject) => {
        Year.getAllYears((err, year) => {
            if (err) {
                reject(err);
            } else {
                resolve(year);
            }
        });
    });
};

// Hàm lấy sản phẩm theo id với Promise
const getSanPhamById = (userId, id) => {
    return new Promise((resolve, reject) => {
        SanPham.getSanPham_By_Id(userId, id, (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};
const getAllProducts = (userId, search) => {
    return new Promise((resolve, reject) => {
        SanPham.getAllquanlysanpham(userId, search, (err, results) => {
            if (err) {
                reject(err)
            }
            else {
                resolve(results)
            }
        })
    })
}
class SanPhamController {
   
   
    manager(req, res) {
        let token = req.cookies.tkvungtrong;
        let par = jwt.verify(token, process.env.SECRET);
        const page = parseInt(req.query.page) || 1;
        const pageSize = req.query.recordsPerPage || 10;
        const startIndex = (page - 1) * pageSize;
        const endIndex = page * pageSize;
        const search = req.query.name || '';
        const season = '';

        Promise.all([
            getAllMaps(par._id),
            getAllSeasons(season),
            getAllTrees(),
            getAllYears(),
            getAllProducts(par._id, search)
        ])
            .then(([maps, season, tree, year, data]) => {
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
                    results: maps,
                    data: paginatedData,
                    season,
                    code: Generate.generateRandomString(8),
                    search,
                    year,
                    tree,
                    recordsPerPage: pageSize,
                    pagination: {
                        prev: page > 1 ? page - 1 : null,
                        next: endIndex < data.length ? page + 1 : null,
                        pages: pages,
                    },
                };
                res.render('product/manager', viewData);
            })
            .catch(err => {
                console.log('Lỗi truy vấn', err);
            });
    }

    // Phương thức edit
    edit(req, res) {
        const id = req.params.id;
        let token = req.cookies.tkvungtrong;
        let par = jwt.verify(token, process.env.SECRET);
        const search = '';
        Promise.all([
            getSanPhamById(par._id, id),
            getAllMaps(par._id),
            getAllSeasons(search),
            getAllTrees(),
            getAllYears()
        ])
            .then(([results, maps, season, tree, year]) => {
                res.render('product/edit', { data: results[0], maps, season, tree, year });
            })
            .catch(err => {
                console.log('Lỗi truy vấn', err);
            });
    }
    create(req, res) {
        let token = req.cookies.tkvungtrong
        let par = jwt.verify(token, process.env.SECRET)
        const forms = {
            title: req.body.title,
            phone: req.body.phone,
            email: req.body.email,
            address: req.body.address,
            productionUnit: req.body.productionUnit,
            map_id: req.body.map_id,
            season_id: req.body.season_id,
            user_id: par._id,
            tree_id: req.body.tree_id,
            year_id: req.body.year_id,
            season_id: req.body.season_id,
            image: req.file.path,
            content: req.body.editor
        }

        SanPham.createSanPham(forms, (err, results) => {
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
        SanPham.deleteSanPham(id, (err, results) => {
            if (err) {
                console.log('Lỗi truy vấn', err)
            }
            else {
                res.redirect('back')
            }
        })
    }
    update(req, res) {
        const id = req.params.id
        let token = req.cookies.tkvungtrong
        let par = jwt.verify(token, process.env.SECRET)
        const forms = {
            image: req.file ? req.file.path : req.body.imageurl,
            title: req.body.title,
            productionUnit: req.body.productionUnit,
            map_id: req.body.map_id,
            season_id: req.body.season_id,
            phone: req.body.phone,
            email: req.body.email,
            address: req.body.address,
            user_id: par._id,
            tree_id: req.body.tree_id,
            year_id: req.body.year_id,
            content: req.body.editor
        }

        SanPham.updateSanPham(forms, id, (err, results) => {
            if (err) {
                console.log('Lỗi truy vấn', err)
            }
            else {

                res.redirect('/product/management')
            }
        })
    }
   

}
module.exports = new SanPhamController