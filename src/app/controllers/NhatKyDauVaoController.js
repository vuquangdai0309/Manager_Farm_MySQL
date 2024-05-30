
var jwt = require('jsonwebtoken');
const Season = require('../models/Season');
const NguyenVatLieu = require('../models/NguyenVatLieu');
const Tree = require('../models/Tree');
const NhatKyDauVao = require('../models/NhatKyDauVao')
const Map = require('../models/Map')
const Year = require('../models/Year')
const { formatDate } = require('../middlewares/format');
const GetAllTree = () => {
    return new Promise((resolve, reject) => {
        Tree.getAllTree((err, results) => {
            if (err) {
                reject(err)
            }
            else {
                resolve(results)
            }
        })
    })
}
const GetAllSeason = (search) => {
    return new Promise((resolve, reject) => {
        Season.getAllSeason(search, (err, results) => {
            if (err) {
                reject(err)
            }
            else {
                //  console.log(results)
                resolve(results)
            }
        })
    })
}
const GetAllYears = () => {
    return new Promise((resolve, reject) => {
        Year.getAllYears((err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};
const GetAllMaps = (Id) => {
    return new Promise((resolve, reject) => {
        Map.getAllMapsTypePolygon(Id, (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};
const SearchbyInput = (tree, season, map, year, Id) => {
    return new Promise((resolve, reject) => {
        NhatKyDauVao.searchAllBy_Tree_And_Season(tree, season, map, year, Id, (err, results) => {
            if (err) {
                reject(err)
            }
            else {
                // console.log(results)
                resolve(results)
            }
        })
    })
};
const GetAllNguyenVatLieu = () => {
    return new Promise((resolve, reject) => {
        NguyenVatLieu.getAllNguyenLieu((err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};
const GetNguyenLieuDauVao = (Id, IdUser) => {
    return new Promise((resolve, reject) => {
        NhatKyDauVao.getNguyenLieuDauVao_Id(Id, IdUser, (err, result) => {
            if (err) {
                reject(err)
            }
            else {
                resolve(result)
            }
        })
    })
}
class NhatKyDauVaoController {
    index(req, res) {
        let token = req.cookies.tkvungtrong
        let par = jwt.verify(token, process.env.SECRET)
        const page = parseInt(req.query.page) || 1; // Trang hiện tại
        const pageSize = 12; // Kích thước trang
        const startIndex = (page - 1) * pageSize;
        const endIndex = page * pageSize;
        const season = req.query.season || '';
        const tree = req.query.tree || '';
        const map = req.query.map || '';
        const year = req.query.year || '';
        const search = ''

        Promise.all([
            GetAllTree(),
            GetAllSeason(search),
            GetAllYears(),
            GetAllMaps(par._id),
            SearchbyInput(tree, season, map, year, par._id),
            GetAllNguyenVatLieu()
        ])
            .then(([DataTree, DataSeason, DataYear, DataMap, data, DataNguyenVatLieu]) => {
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
                    DataTree,
                    DataSeason,
                    DataYear,
                    DataMap,
                    DataNguyenVatLieu,
                    season,
                    tree,
                    map,
                    year,
                    pagination: {
                        prev: page > 1 ? page - 1 : null,
                        next: endIndex < data.length ? page + 1 : null,
                        pages: pages,
                    },
                };
                // console.log(viewData.nhatkysanxuat)
                res.render('nhatkydauvao/store', viewData)
            })
    }
    creat(req, res) {
        let token = req.cookies.tkvungtrong
        let par = jwt.verify(token, process.env.SECRET)
        const forms = {
            thoigian: formatDate(req.body.thoigian),
            id_user: par._id,
            nguyenvatlieu_id: req.body.nguyenvatlieu_id,
            tree_id: req.body.tree_id,
            map_id: req.body.vungtrong_id,
            soluong: req.body.soluong,
            tenvadiachi: req.body.tenvadiachi,
            hansudung: formatDate(req.body.hansudung),
            phuongphapxuly: req.body.phuongphapxuly,
            nguyenlieusanxuat: req.body.nguyenlieusanxuat,
            hoachatxuly: req.body.hoachatxuly,
            season_id: req.body.season_id,
            year_id: req.body.year_id,
            nguoixuly: req.body.nguoixuly
        }
        if (req.body.newNguyenLieu) {
            NguyenVatLieu.creatNguyenLieu({ name: req.body.newNguyenLieu }, (err, data) => {
                if (err) {
                    console.log('Lỗi truy vấn', err)
                }
                else {
                    NhatKyDauVao.addNguyenLieuDauVao({
                        thoigian: formatDate(req.body.thoigian),
                        id_user: par._id,
                        nguyenvatlieu_id: data.insertId,
                        tree_id: req.body.tree_id,
                        map_id: req.body.vungtrong_id,
                        soluong: req.body.soluong,
                        tenvadiachi: req.body.tenvadiachi,
                        hansudung: formatDate(req.body.hansudung),
                        phuongphapxuly: req.body.phuongphapxuly,
                        nguyenlieusanxuat: req.body.nguyenlieusanxuat,
                        hoachatxuly: req.body.hoachatxuly,
                        season_id: req.body.season_id,
                        year_id: req.body.year_id,
                        nguoixuly: req.body.nguoixuly
                    }, (err, results) => {
                        if (err) {
                            console.log('lỗi truy vấn', err)
                        }
                        else {
                            res.redirect('back')
                        }
                    })
                }
            })
        }
        else {
            NhatKyDauVao.addNguyenLieuDauVao(forms, (err, results) => {
                if (err) {
                    console.log('lỗi truy vấn', err)
                }
                else {
                    res.redirect('back')
                }
            })
        }
    }
    edit(req, res) {
        let token = req.cookies.tkvungtrong
        let par = jwt.verify(token, process.env.SECRET)
        const id = req.params.id
        console.log(id)
        const search = ''
        Promise.all([
            GetAllTree(),
            GetAllSeason(search),
            GetAllYears(),
            GetAllMaps(par._id),
            GetNguyenLieuDauVao(id, par._id),
            GetAllNguyenVatLieu()
        ])
            .then(([tree, season, year, map, data, nguyenvatlieu]) => {
                console.log(data)
                res.render('nhatkydauvao/edit', { tree, season, year, map, data: data[0], nguyenvatlieu })
            })
    }
    update(req, res) {
        let token = req.cookies.tkvungtrong
        let par = jwt.verify(token, process.env.SECRET)
        const Id = req.params.id

        const forms = {
            thoigian: formatDate(req.body.thoigian),
            id_user: par._id,
            nguyenvatlieu_id: req.body.nguyenvatlieu_id,
            tree_id: req.body.tree_id,
            map_id: req.body.map_id,
            soluong: req.body.soluong,
            tenvadiachi: req.body.tenvadiachi,
            hansudung: formatDate(req.body.hansudung),
            phuongphapxuly: req.body.phuongphapxuly,
            nguyenlieusanxuat: req.body.nguyenlieusanxuat,
            hoachatxuly: req.body.hoachatxuly,
            season_id: req.body.season_id,
            year_id: req.body.year_id,
            nguoixuly: req.body.nguoixuly
        }
        NhatKyDauVao.updateNguyenLieuDauVao(forms, Id, (err, result) => {
            if (err) {
                console.log('Lỗi truy vấn', err)
            }
            else {
                res.redirect('/input-material-tracking-log')
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
        let par = jwt.verify(token, process.env.SECRET)
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
        let par = jwt.verify(token, process.env.SECRET)
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
                              <td>${item.nguoixuly}</td>
                           
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