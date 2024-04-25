const connection = require('../../config/db/index')
const categoryModle = {
    getAllCategories: (callback) => {
        const query = 'SELECT * FROM category WHERE is_deleted = 0';
        connection.query(query, callback);
    },
    addCategory: (Category, callback) => {
        const query = 'INSERT INTO category (title,slug) VALUES (?,?)';
        const values = [Category.title, Category.slug];
        connection.query(query, values, callback);
    },
    updateCategory: (CategoryId, Category, callback) => {
        const query = 'UPDATE category SET title = ?, slug = ? WHERE _id = ?';
        const values = [Category.title, Category.slug, CategoryId];
        connection.query(query, values, callback);
    },
    // lấy bài viết theo slug
    getCategoryBySlug: (CategorySlug, callback) => {
        const query = 'SELECT * FROM category WHERE slug = ? AND is_deleted = 0';
        connection.query(query, [CategorySlug], callback);
    },
    deleteCategory: (Id, callback) => {
        const query = 'UPDATE category SET is_deleted = 1 WHERE _id = ?'
        connection.query(query, Id, callback)
    }
}
module.exports = categoryModle