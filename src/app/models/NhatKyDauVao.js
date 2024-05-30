
const connection = require('../../config/db/index')
const NguyenLieuDauVaoModle = {

    searchAllBy_Tree_And_Season: (tree_id, season_id, map_id, year_id, IdUser, callback) => {
        const query = `
        SELECT nhatkydauvao.*,season.*,nguyenvatlieu.*,tree.*,year.*,tree._id AS tree_id,nhatkydauvao._id AS nhatkydauvao_id  ,maps.namearea AS mapname
        FROM nhatkydauvao
        JOIN season ON nhatkydauvao.season_id = season._id
        JOIN maps ON nhatkydauvao.map_id = maps._id
        JOIN tree ON nhatkydauvao.tree_id = tree._id
        JOIN year ON nhatkydauvao.year_id = year._id
        JOIN nguyenvatlieu ON nhatkydauvao.nguyenvatlieu_id = nguyenvatlieu._id
        WHERE  nhatkydauvao.tree_id LIKE ? AND nhatkydauvao.season_id LIKE ? AND  nhatkydauvao.map_id LIKE ? AND nhatkydauvao.year_id LIKE ? AND nhatkydauvao.id_user = ? AND nhatkydauvao.is_deleted = 0 ORDER BY STR_TO_DATE(nhatkydauvao.thoigian, "%d-%m-%Y")`;
        const Searchtree = '%' + tree_id + '%';
        const SearchSeason = '%' + season_id + '%';
        const SearchMap = '%' + map_id + '%';
        const SearchYear = '%' + year_id + '%';
        connection.query(query, [Searchtree, SearchSeason, SearchMap, SearchYear, IdUser], callback);
    },

    getAllNguyenLieuDauVaoByCodeShipment: (tree_id, season_id, map_id, year_id, IdUser, callback) => {
        const query = `
        SELECT nhatkydauvao.*,season.*,nguyenvatlieu.*,tree.*,year.*,tree._id AS tree_id,nhatkydauvao._id AS nhatkydauvao_id  ,maps.namearea AS mapname
        FROM nhatkydauvao
        JOIN season ON nhatkydauvao.season_id = season._id
        JOIN maps ON nhatkydauvao.map_id = maps._id
        JOIN tree ON nhatkydauvao.tree_id = tree._id
        JOIN year ON nhatkydauvao.year_id = year._id
        JOIN nguyenvatlieu ON nhatkydauvao.nguyenvatlieu_id = nguyenvatlieu._id
        WHERE  nhatkydauvao.tree_id = ? AND nhatkydauvao.season_id = ? AND  nhatkydauvao.map_id = ? AND nhatkydauvao.year_id = ? AND nhatkydauvao.id_user = ? AND nhatkydauvao.is_deleted = 0 ORDER BY STR_TO_DATE(nhatkydauvao.thoigian, "%d-%m-%Y")`;

        connection.query(query, [tree_id, season_id, map_id, year_id, IdUser], callback);
    },
    addNguyenLieuDauVao: (NguyenLieu, callback) => {
        const query = `INSERT INTO nhatkydauvao (thoigian,soluong,tenvadiachi,hansudung,nguyenlieusanxuat,phuongphapxuly,hoachatxuly,id_user,nguyenvatlieu_id,season_id,tree_id,map_id,year_id,nguoixuly) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
        const values = [NguyenLieu.thoigian, NguyenLieu.soluong, NguyenLieu.tenvadiachi, NguyenLieu.hansudung, NguyenLieu.nguyenlieusanxuat, NguyenLieu.phuongphapxuly, NguyenLieu.hoachatxuly, NguyenLieu.id_user, NguyenLieu.nguyenvatlieu_id, NguyenLieu.season_id, NguyenLieu.tree_id, NguyenLieu.map_id, NguyenLieu.year_id, NguyenLieu.nguoixuly]
        connection.query(query, values, callback)
    },
    getNguyenLieuDauVao_Id: (Id, id_user, callback) => {
        const query = `
        SELECT nhatkydauvao.*,season.*,nguyenvatlieu.*,tree.*,tree._id AS tree_id,nhatkydauvao._id AS nhatkydauvao_id  
        FROM nhatkydauvao
        JOIN season ON nhatkydauvao.season_id = season._id
        JOIN tree ON nhatkydauvao.tree_id = tree._id
        JOIN nguyenvatlieu ON nhatkydauvao.nguyenvatlieu_id = nguyenvatlieu._id
        WHERE nhatkydauvao._id IN (?) AND nhatkydauvao.id_user = ? AND nhatkydauvao.is_deleted = 0 ORDER BY nhatkydauvao.thoigian
        `
        connection.query(query, [Id, id_user], callback)
    },
    getNguyenLieuDauVao_Trash: (id_user, callback) => {
        const query = `
        SELECT nhatkydauvao.*,season.*,nguyenvatlieu.*,tree.*,maps.*,year.*,tree._id AS tree_id,nhatkydauvao._id AS nhatkydauvao_id  
        FROM nhatkydauvao
        JOIN maps ON nhatkydauvao.map_id  = maps._id
        JOIN season ON nhatkydauvao.season_id = season._id
        JOIN tree ON nhatkydauvao.tree_id = tree._id
        JOIN year ON nhatkydauvao.year_id = year._id
        JOIN nguyenvatlieu ON nhatkydauvao.nguyenvatlieu_id = nguyenvatlieu._id
        WHERE nhatkydauvao.id_user = ? AND nhatkydauvao.is_deleted = 1
        `
        connection.query(query, [id_user], callback)
    },

    getNguyenLieuDauVao_Id: (Id, id_user, callback) => {
        const query = `
        SELECT nhatkydauvao.*,season.*,nguyenvatlieu.*,tree.*,tree._id AS tree_id,nhatkydauvao._id AS nhatkydauvao_id  
        FROM nhatkydauvao
        JOIN season ON nhatkydauvao.season_id = season._id
        JOIN tree ON nhatkydauvao.tree_id = tree._id
        JOIN nguyenvatlieu ON nhatkydauvao.nguyenvatlieu_id = nguyenvatlieu._id
        WHERE nhatkydauvao._id IN(?) AND nhatkydauvao.id_user = ? AND nhatkydauvao.is_deleted = 0
        `
        connection.query(query, [Id, id_user], callback)
    },

    updateNguyenLieuDauVao: (NguyenLieu, Id, callback) => {
        const query = `UPDATE nhatkydauvao SET thoigian =?,soluong =?,tenvadiachi =?,hansudung =?,nguyenlieusanxuat =?,phuongphapxuly =?,hoachatxuly =?,id_user =?,nguyenvatlieu_id =?,season_id =?,tree_id =?,map_id= ?,year_id = ?,nguoixuly = ? WHERE _id = ?`
        const values = [NguyenLieu.thoigian, NguyenLieu.soluong, NguyenLieu.tenvadiachi, NguyenLieu.hansudung, NguyenLieu.nguyenlieusanxuat, NguyenLieu.phuongphapxuly, NguyenLieu.hoachatxuly, NguyenLieu.id_user, NguyenLieu.nguyenvatlieu_id, NguyenLieu.season_id, NguyenLieu.tree_id, NguyenLieu.map_id, NguyenLieu.year_id, NguyenLieu.nguoixuly, Id]
        connection.query(query, values, callback)
    },
    deleteNguyenLieuDauVao: (Id, callback) => {
        const query = 'UPDATE nhatkydauvao SET is_deleted = 1 WHERE _id IN (?)'
        connection.query(query, [Id], callback)
    },
    destroyNguyenLieuDauVao: (Id, callback) => {
        const query = 'DELETE FROM nhatkydauvao WHERE _id IN(?)'
        connection.query(query, [Id], callback)
    },
    restoreNguyenLieuDauVao: (Id, callback) => {
        const query = `UPDATE nhatkydauvao  SET is_deleted = 0 WHERE _id IN (?)`
        connection.query(query, [Id], callback)
    },
    countNguyenLieuDauVao: (User, callback) => {
        const query = `SELECT COUNT(*) AS CountNLDV FROM nhatkydauvao WHERE is_deleted = 0 AND id_user = ?`
        connection.query(query, User, callback)
    }



}
module.exports = NguyenLieuDauVaoModle