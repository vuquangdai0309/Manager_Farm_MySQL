const connection = require('../../config/db/index')
const CanhDongModel = {
    getAllCanhDongWithId: (IdUser, callback) => {
        const query = `SELECT canhdong.*, maps.namearea AS namearea, maps.areaMeter AS areaMeter
        FROM canhdong
        JOIN maps ON canhdong.map_id = maps._id
        WHERE canhdong.id_user = ? 
        `;
        connection.query(query, IdUser, callback);
    },
    addCanhDong: (CanhDong, callback) => {
        const query = 'INSERT INTO canhdong ( giongcay,map_id,ngaybatdau,ngayketthuc,id_user) VALUES (?,?,?,?,?)';
        const values = [CanhDong.giongcay, CanhDong.map_id, CanhDong.ngaybatdau, CanhDong.ngayketthuc, CanhDong.id_user];
        connection.query(query, values, callback);
    },
    deleteCanhDong: (CanhDong, callback) => {
        const query = 'DELETE FROM canhdong WHERE _id = ?';
        connection.query(query, [CanhDong], callback);
    },
    getCanhDongWithId: (Id, callback) => {
        const query = 'SELECT * FROM canhdong WHERE _id = ?';
        connection.query(query, Id, callback);
    },
    updateCanhDong: (CanhDongId, CanhDong, callback) => {
        const query = 'UPDATE canhdong SET giongcay=? ,map_id =?,ngaybatdau =?,ngayketthuc = ? WHERE _id = ?';
        const values = [CanhDong.giongcay, CanhDong.map_id, CanhDong.ngaybatdau, CanhDong.ngayketthuc, CanhDongId];
        connection.query(query, values, callback);
    }
}
module.exports = CanhDongModel