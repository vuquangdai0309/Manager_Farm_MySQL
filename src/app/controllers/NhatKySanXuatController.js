const NhatKySanXuat = require('../models/NhatKySanXuat')
var jwt = require('jsonwebtoken');
const Season = require('../models/Season');
const NguyenVatLieu = require('../models/NguyenVatLieu');
const Tree = require('../models/Tree');
const Map = require('../models/Map')
const Year = require('../models/Year')
const { formatDate } = require('../middlewares/format')
class NhatKySanXuatController {
    async index(req, res) {
        try {
            let token = req.cookies.tkvungtrong
            let par = jwt.verify(token, process.env.SECRET)
            
            const search = ''
            const nhatkysanxuat = await new Promise((resolve, reject) => {
                NhatKySanXuat.getAllNhatKySanXuatWithId(par._id, (err, nhatkysanxuat) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(nhatkysanxuat);
                });
            });
            const map = await new Promise((resolve, reject) => {
                Map.getAllMapsTypePolygon(par._id, (err, map) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(map);
                });
            });

            const season = await new Promise((resolve, reject) => {
                Season.getAllSeason(search, (err, season) => {
                    if (err) {

                        reject(err);
                        return;
                    }
                    resolve(season);
                });
            });

            const tree = await new Promise((resolve, reject) => {
                Tree.getAllTree((err, tree) => {
                    if (err) {

                        reject(err);
                        return;
                    }
                    resolve(tree);
                });
            });
            const nguyenvatlieu = await new Promise((resolve, reject) => {
                NguyenVatLieu.getAllNguyenLieu((err, nguyenvatlieu) => {
                    if (err) {

                        reject(err);
                        return;
                    }
                    resolve(nguyenvatlieu);
                });
            });
            const year = await new Promise((resolve, reject) => {
                Year.getAllYears((err, year) => {
                    if (err) {

                        reject(err);
                        return;
                    }
                    resolve(year);
                });
            });
            res.render('nhatkysanxuat/nhatkysanxuat', { nhatkysanxuat, map, season, tree, nguyenvatlieu, year });
        } catch (error) {
            console.error('Error:', error);
            // Handle error appropriately, send an error response, etc.
        }
    }
    list(req, res, next) {
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
                NhatKySanXuat.searchAllBy_tree_And_Season(tree, season, map, year, Id, (err, results) => {
                    if (err) {
                        reject(err)
                    }
                    else {
                        // console.log(results)
                        resolve(results)
                    }
                })
            })
        }
        Promise.all([
            GetAllTree(),
            GetAllSeason(search),
            GetAllYears(),
            GetAllMaps(par._id),
            SearchbyInput(tree, season, map, year, par._id)
        ])
            .then(([DataTree, DataSeason, DataYear, DataMap, data]) => {
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
                    nhatkysanxuat: paginatedData,
                    DataTree,
                    DataSeason,
                    DataYear,
                    DataMap,
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
                res.render('nhatkysanxuat/store', viewData)
            })
    }
    store(req, res) {
        let token = req.cookies.tkvungtrong
        let par = jwt.verify(token, process.env.SECRET)

        NhatKySanXuat.getAllNhatKySanXuatWithId(par._id, (err, nhatkysanxuat) => {
            if (err) {
                console.log('lỗi truy vấn', err)
                return
            }
            else {
                res.json({ nhatkysanxuat })
            }
        })

    }
    // [PO] nhatkysanxuat 
    addNhatKySanXuat(req, res, next) {

        let token = req.cookies.tkvungtrong
        let par = jwt.verify(token, process.env.SECRET)
        const forms = {
            title: req.body.title,
            start: formatDate(req.body.start),
            end: formatDate(req.body.end),
            id_user: par._id,
            map_id: req.body.map_id,
            nguyenvatlieu_id: req.body.nguyenvatlieu_id,
            tree_id: req.body.tree_id,
            nongdo: req.body.nongdo,
            luongsudung: req.body.luongsudung,
            thoigiancachly: req.body.thoigiancachly,
            mucdich: req.body.mucdich,
            thietbi: req.body.thietbi,
            vesinhdungcu: req.body.vesinhdungcu ? req.body.vesinhdungcu : 'Không',
            season_id: req.body.season_id,
            year_id: req.body.year_id
        }

        NhatKySanXuat.addNhatKySanXuat(forms, (err) => {
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
        const Id_NhatKySanXuat = req.params.id
        NhatKySanXuat.deleteAllNhatKySanXuatWithId(Id_NhatKySanXuat, (err, results) => {
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
            let par = jwt.verify(token, process.env.SECRET)
            const Id_NhatKySanXuat = req.params.id

            const nhatkysanxuat = await new Promise((resolve, reject) => {
                NhatKySanXuat.getNhatKySanXuatById(par._id, Id_NhatKySanXuat, (err, nhatkysanxuat) => {
                    if (err) {
                        console.log('lỗi truy vấn', err)
                        reject(err);
                        return;
                    }
                    resolve(nhatkysanxuat);
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

            const season = await new Promise((resolve, reject) => {
                Season.getAllSeason('', (err, season) => {
                    if (err) {
                        console.log('lỗi truy vấn', err)
                        reject(err);
                        return;
                    }
                    resolve(season);
                });
            });

            const tree = await new Promise((resolve, reject) => {
                Tree.getAllTree((err, tree) => {
                    if (err) {
                        console.log('lỗi truy vấn', err)
                        reject(err);
                        return;
                    }
                    resolve(tree);
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
            const year = await new Promise((resolve, reject) => {
                Year.getAllYears((err, year) => {
                    if (err) {
                        console.log('lỗi truy vấn', err)
                        reject(err);
                        return;
                    }
                    resolve(year);
                });
            });

            res.render('nhatkysanxuat/edit', { data: nhatkysanxuat[0], map, season, tree, nguyenvatlieu, year });

        }
        catch {
            console.error('Error:', error);
        }

    }
    //[PUT] UPDATE nhatkysanxuat/:id
    update(req, res, next) {
        const Id_NhatKySanXuat = req.params.id
        let token = req.cookies.tkvungtrong
        let par = jwt.verify(token, process.env.SECRET)
        const forms = {
            title: req.body.title,
            start: formatDate(req.body.start),
            end: formatDate(req.body.end),
            id_user: par._id,
            map_id: req.body.map_id,
            nguyenvatlieu_id: req.body.nguyenvatlieu_id,
            tree_id: req.body.tree_id,
            nongdo: req.body.nongdo,
            luongsudung: req.body.luongsudung,
            thoigiancachly: req.body.thoigiancachly,
            mucdich: req.body.mucdich,
            thietbi: req.body.thietbi,
            vesinhdungcu: req.body.vesinhdungcu ? req.body.vesinhdungcu : 'Không',
            season_id: req.body.season_id,
            year_id: req.body.year_id
        }

        NhatKySanXuat.updateNhatKySanXuat(Id_NhatKySanXuat, forms, (err, results) => {
            if (err) {
                console.log('lỗi truy vấn', err)
            }
            else {
                res.redirect('/production-process-log/storeList')
            }
        })

    }
    //[GET] search 
    search(req, res, next) {
        var title = req.query.q
        NhatKySanXuat.searchNhatKySanXuatByName(title, (err, nhatkysanxuat) => {
            if (err) {
                console.log('lỗi truy vấn', err)
            }
            else {
                res.render('nhatkysanxuat/store', { nhatkysanxuat })
            }
        })

    }
    // [POST] lấy các bản ghi được checkbox
    handleFormAction(req, res, next) {
        const ids = req.body.workIds
        console.log(ids)
        switch (req.body.action) {
            case 'delete':
                NhatKySanXuat.deleteAllNhatKySanXuatWithId(ids, (err, results) => {
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
        let par = jwt.verify(token, process.env.SECRET)
        const page = parseInt(req.query.page) || 1; // Trang hiện tại
        const pageSize = 10; // Kích thước trang
        const startIndex = (page - 1) * pageSize;
        const endIndex = page * pageSize;
        NhatKySanXuat.getAllNhatKySanXuatWithId_Trash(par._id, (err, data) => {
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
                    nhatkysanxuat: paginatedData,
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
                NhatKySanXuat.forceDestroyAllSelected_NhatKySanXuat(ids, (err, results) => {
                    if (err) {
                        console.error('Lỗi khi xóa bản ghi:', err);
                    } else {
                        res.redirect('back')

                    }
                })
                break;
            case 'restore':
                NhatKySanXuat.restoreAllSelected_NhatKySanXuat(ids, (err, results) => {
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
        NhatKySanXuat.forceDestroyAllSelected_NhatKySanXuat(id, (err, results) => {
            if (err) {
                console.error('Lỗi khi xóa bản ghi:', err);
            } else {
                res.redirect('back')

            }
        })
    } //[POST] khôi phục
    restore(req, res) {
        const id = req.params.id
        NhatKySanXuat.restoreAllSelected_NhatKySanXuat(id, (err, results) => {
            if (err) {
                console.error('Lỗi khi xóa bản ghi:', err);
            } else {
                res.redirect('back')

            }
        })
    }
    generatePdf(req, res) {
        let token = req.cookies.tkvungtrong
        let par = jwt.verify(token, process.env.SECRET)
        const idsString = req.body.ids
        const Ids = idsString.split(',');
        NhatKySanXuat.getNhatKySanXuatById(par._id, Ids, async (err, results) => {
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