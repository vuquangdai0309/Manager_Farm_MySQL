
const connection = require('../../config/db/index')
const NguyenLieuDauVaoModle = {

    searchAllBy_GiongCay_And_Vumua: (giongcay_id, vumua_id, IdUser, callback) => {
        const query = `
        SELECT nhatkydauvao.*,vumua.*,nguyenvatlieu.*,giongcay.*,giongcay._id AS giongcay_id,nhatkydauvao._id AS nhatkydauvao_id  
        FROM nhatkydauvao
        JOIN vumua ON nhatkydauvao.vumua_id = vumua._id
        JOIN giongcay ON nhatkydauvao.giongcay_id = giongcay._id
        JOIN nguyenvatlieu ON nhatkydauvao.nguyenvatlieu_id = nguyenvatlieu._id
        WHERE  nhatkydauvao.giongcay_id LIKE ? AND nhatkydauvao.vumua_id LIKE ? AND nhatkydauvao.id_user = ? AND nhatkydauvao.is_deleted = 0 ORDER BY STR_TO_DATE(nhatkydauvao.thoigian, "%d-%m-%Y")`;
        const SearchGiongCay = '%' + giongcay_id + '%';
        const SearchVumua = '%' + vumua_id + '%';
        connection.query(query, [SearchGiongCay, SearchVumua, IdUser], callback);
    },
    addNguyenLieuDauVao: (NguyenLieu, callback) => {
        const query = `INSERT INTO nhatkydauvao (thoigian,soluong,tenvadiachi,hansudung,nguyenlieusanxuat,phuongphapxuly,hoachatxuly,id_user,nguyenvatlieu_id,vumua_id,giongcay_id) VALUES (?,?,?,?,?,?,?,?,?,?,?)`
        const values = [NguyenLieu.thoigian, NguyenLieu.soluong, NguyenLieu.tenvadiachi, NguyenLieu.hansudung, NguyenLieu.nguyenlieusanxuat, NguyenLieu.phuongphapxuly, NguyenLieu.hoachatxuly, NguyenLieu.id_user, NguyenLieu.nguyenvatlieu_id, NguyenLieu.vumua_id, NguyenLieu.giongcay_id]
        connection.query(query, values, callback)
    },
    getNguyenLieuDauVao_Id: (Id, id_user, callback) => {
        const query = `
        SELECT nhatkydauvao.*,vumua.*,nguyenvatlieu.*,giongcay.*,giongcay._id AS giongcay_id,nhatkydauvao._id AS nhatkydauvao_id  
        FROM nhatkydauvao
        JOIN vumua ON nhatkydauvao.vumua_id = vumua._id
        JOIN giongcay ON nhatkydauvao.giongcay_id = giongcay._id
        JOIN nguyenvatlieu ON nhatkydauvao.nguyenvatlieu_id = nguyenvatlieu._id
        WHERE nhatkydauvao._id IN (?) AND nhatkydauvao.id_user = ? AND nhatkydauvao.is_deleted = 0 ORDER BY nhatkydauvao.thoigian
        `
        connection.query(query, [Id, id_user], callback)
    },
    getNguyenLieuDauVao_Trash: (id_user, callback) => {
        const query = `
        SELECT nhatkydauvao.*,vumua.*,nguyenvatlieu.*,giongcay.*,giongcay._id AS giongcay_id,nhatkydauvao._id AS nhatkydauvao_id  
        FROM nhatkydauvao
        JOIN vumua ON nhatkydauvao.vumua_id = vumua._id
        JOIN giongcay ON nhatkydauvao.giongcay_id = giongcay._id
        JOIN nguyenvatlieu ON nhatkydauvao.nguyenvatlieu_id = nguyenvatlieu._id
        WHERE nhatkydauvao.id_user = ? AND nhatkydauvao.is_deleted = 1
        `
        connection.query(query, [id_user], callback)
    },

    getNguyenLieuDauVao_Id: (Id, id_user, callback) => {
        const query = `
        SELECT nhatkydauvao.*,vumua.*,nguyenvatlieu.*,giongcay.*,giongcay._id AS giongcay_id,nhatkydauvao._id AS nhatkydauvao_id  
        FROM nhatkydauvao
        JOIN vumua ON nhatkydauvao.vumua_id = vumua._id
        JOIN giongcay ON nhatkydauvao.giongcay_id = giongcay._id
        JOIN nguyenvatlieu ON nhatkydauvao.nguyenvatlieu_id = nguyenvatlieu._id
        WHERE nhatkydauvao._id IN(?) AND nhatkydauvao.id_user = ? AND nhatkydauvao.is_deleted = 0
        `
        connection.query(query, [Id, id_user], callback)
    },

    updateNguyenLieuDauVao: (NguyenLieu, Id, callback) => {
        const query = `UPDATE nhatkydauvao SET thoigian =?,soluong =?,tenvadiachi =?,hansudung =?,nguyenlieusanxuat =?,phuongphapxuly =?,hoachatxuly =?,id_user =?,nguyenvatlieu_id =?,vumua_id =?,giongcay_id =? WHERE _id = ?`
        const values = [NguyenLieu.thoigian, NguyenLieu.soluong, NguyenLieu.tenvadiachi, NguyenLieu.hansudung, NguyenLieu.nguyenlieusanxuat, NguyenLieu.phuongphapxuly, NguyenLieu.hoachatxuly, NguyenLieu.id_user, NguyenLieu.nguyenvatlieu_id, NguyenLieu.vumua_id, NguyenLieu.giongcay_id, Id]
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