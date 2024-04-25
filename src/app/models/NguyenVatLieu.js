const connection = require('../../config/db/index')
const nguyenlieuModle = {
    getAllNguyenLieu: (callback) => {
        const query = 'SELECT * FROM nguyenvatlieu ';
        connection.query(query, callback);
    },
    // lấy nguyên liệu theo tên
    getNguyenLieuByName: (BaiViet, callback) => {
        const query = 'SELECT * FROM nguyenvatlieu WHERE nguyenvatlieu = ?';
        connection.query(query, [BaiViet], callback);
    },
    getGiongCayById: (Id, callback) => {
        const query = 'SELECT * FROM nguyenvatlieu WHERE giongcay_id = ?';
        connection.query(query, [Id], callback);
    },
    findNguyenLieuCayTrong: (giongcay_id, nguyenvatlieu_id, callback) => {
        const query = 'SELECT * FROM nguyenvatlieu WHERE giongcay_id = ? AND _id = ?';
        connection.query(query, [giongcay_id, nguyenvatlieu_id], callback)
    },
}
module.exports = nguyenlieuModle