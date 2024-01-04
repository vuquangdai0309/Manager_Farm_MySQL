const connection = require('../../config/db/index')
const TuLieuModle = {
    getAllBaiViets: (callback) => {
        const query = 'SELECT * FROM tulieu ';
        connection.query(query, callback);
    },
    addBaiViet: (BaiViet, callback) => {
        const query = 'INSERT INTO tulieu (title, image,content,slug,date) VALUES (?,?,?,?,?)';
        const values = [BaiViet.title, BaiViet.image, BaiViet.content, BaiViet.slug, BaiViet.date];
        connection.query(query, values, callback);
    },
    deleteBaiViet: (BaiVietId, callback) => {
        const query = 'DELETE FROM tulieu WHERE _id = ?';
        connection.query(query, [BaiVietId], callback);
    },
    // lấy bài viết theo id
    getBaiVietById: (BaiVietId, callback) => {
        const query = 'SELECT * FROM tulieu WHERE _id = ?';
        connection.query(query, [BaiVietId], callback);
    },
    updateBaiViet: (BaiVietId, BaiViet, callback) => {
        const query = 'UPDATE tulieu SET title = ?, image = ?,content = ?,slug = ?,date = ?  WHERE _id = ?';
        const values = [BaiViet.title, BaiViet.image, BaiViet.content, BaiViet.slug, BaiViet.date, BaiVietId];
        connection.query(query, values, callback);
    },
    // lấy bài viết theo slug
    getBaiVietBySlug: (BaiVietSlug, callback) => {
        const query = 'SELECT * FROM tulieu WHERE slug = ?';
        connection.query(query, [BaiVietSlug], callback);
    },
}
module.exports = TuLieuModle