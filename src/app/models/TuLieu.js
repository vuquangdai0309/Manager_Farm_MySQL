const connection = require('../../config/db/index')
const TuLieuModle = {
    getAllBaiViets: (callback) => {
        const query = 'SELECT tulieu.*, category.title AS name_category FROM tulieu INNER JOIN category ON tulieu.category_id = category._id WHERE tulieu.is_deleted = 0';
        connection.query(query, callback);
    },
    searchBaiVietBy_IdCategory: (category_id, callback) => {
        let query = `
        SELECT tulieu.*, category.title AS name_cate FROM tulieu INNER JOIN category ON tulieu.category_id = category._id 
        WHERE tulieu.category_id LIKE ? AND tulieu.is_deleted = 0 
        `;
        const searchName = '%' + category_id + '%'
        connection.query(query, [searchName], callback);
    },
    addBaiViet: (BaiViet, callback) => {
        const query = 'INSERT INTO tulieu (title, image,content,slug,date,category_id) VALUES (?,?,?,?,?,?)';
        const values = [BaiViet.title, BaiViet.image, BaiViet.content, BaiViet.slug, BaiViet.date, BaiViet.category_id];
        connection.query(query, values, callback);
    },
    deleteBaiViet: (BaiVietId, callback) => {
        const query = 'UPDATE tulieu SET is_deleted = 1 WHERE _id = ?  ';
        connection.query(query, [BaiVietId], callback);
    },
    // lấy bài viết theo id
    getBaiVietById: (BaiVietId, callback) => {
        const query = 'SELECT * FROM tulieu WHERE _id = ?';
        connection.query(query, [BaiVietId], callback);
    },
    updateBaiViet: (BaiVietId, BaiViet, callback) => {
        const query = 'UPDATE tulieu SET title = ?, image = ?,content = ?,slug = ?,date = ?,category_id = ?  WHERE _id = ?';
        const values = [BaiViet.title, BaiViet.image, BaiViet.content, BaiViet.slug, BaiViet.date, BaiViet.category_id, BaiVietId];
        connection.query(query, values, callback);
    },
    // lấy bài viết theo slug
    getBaiVietBySlug: (BaiVietSlug, callback) => {
        const query = 'SELECT * FROM tulieu WHERE slug = ? AND is_deleted = 0 ';
        connection.query(query, [BaiVietSlug], callback);
    },
    deleteBaiViet_With_Category: (Id, callback) => {
        const query = 'UPDATE tulieu SET is_deleted = 1 WHERE category_id IN(?)  '
        connection.query(query, Id, callback)
    }
}
module.exports = TuLieuModle