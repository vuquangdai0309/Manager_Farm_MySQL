const connection = require('../../config/db/index')
const quanlysanpham = {
    getAllquanlysanpham: (UserId, title, callback) => {
        const query = `SELECT quanlysanpham.*,maps.*,
        quanlysanpham._id AS sanpham_id,
        season.nameSeason AS nameSeason,
        tree.nameTree AS nameTree,
        year.year AS year
         FROM quanlysanpham 
         JOIN maps ON quanlysanpham.map_id = maps._id
         JOIN season ON quanlysanpham.season_id = season._id
         JOIN year ON quanlysanpham.year_id = year._id
         JOIN tree ON quanlysanpham.tree_id = tree._id
         WHERE quanlysanpham.user_id = ? AND quanlysanpham.is_deleted = 0 AND quanlysanpham.title LIKE ?`
        const searchName = '%' + title + '%';
        connection.query(query, [UserId, searchName], callback)
    },
    createSanPham: (SanPham, callback) => {
        const query = 'INSERT INTO quanlysanpham (title ,phone ,email ,address ,productionUnit ,map_id ,user_id ,image,content,season_id,tree_id,year_id ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)'
        const values = [SanPham.title, SanPham.phone, SanPham.email, SanPham.address, SanPham.productionUnit, SanPham.map_id, SanPham.user_id, SanPham.image, SanPham.content, SanPham.season_id, SanPham.tree_id, SanPham.year_id]
        connection.query(query, values, callback)
    },
    deleteSanPham: (Id, callback) => {
        const query = 'UPDATE quanlysanpham SET is_deleted = 1 WHERE _id IN (?)'
        connection.query(query, Id, callback)
    },
    getSanPham_By_Id: (UserId, Id, callback) => {
        const query = `SELECT quanlysanpham.*,maps.*,quanlysanpham._id AS sanpham_id
         FROM quanlysanpham 
         JOIN maps ON quanlysanpham.map_id = maps._id
         WHERE quanlysanpham.user_id = ? AND quanlysanpham._id =? AND quanlysanpham.is_deleted = 0 `
        connection.query(query, [UserId, Id], callback)
    },
    getSanPham_By_code: (code, callback) => {
        const query = `SELECT quanlysanpham.*,maps.*,quanlysanpham._id AS sanpham_id
         FROM quanlysanpham 
         JOIN maps ON quanlysanpham.map_id = maps._id
         WHERE quanlysanpham.code = ? AND quanlysanpham.is_deleted = 0 `
        connection.query(query, [code], callback)
    },
    updateSanPham: (SanPham, Id, callback) => {
        const query = 'UPDATE quanlysanpham SET title =? ,phone =? ,email =? ,address =? ,productionUnit =? ,map_id =? ,user_id =? ,image =? ,content =?,season_id = ?,tree_id = ?,year_id = ? WHERE _id = ? '
        const values = [SanPham.title, SanPham.phone, SanPham.email, SanPham.address, SanPham.productionUnit, SanPham.map_id, SanPham.user_id, SanPham.image, SanPham.content, SanPham.season_id, SanPham.tree_id, SanPham.year_id, Id]
        connection.query(query, values, callback)
    }

}
module.exports = quanlysanpham