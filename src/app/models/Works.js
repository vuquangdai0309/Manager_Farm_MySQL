const connection = require('../../config/db/index')
const WorkModel = {
    // lấy những công việc cùng ID_USER
    getAllWorksWithId: (IdUser, callback) => {
        const query = `
        SELECT canhdong.*,works.*, maps.namearea AS namearea, maps.areaMeter AS areaMeter
        FROM works
        JOIN canhdong ON works.canhdong_id = canhdong._id
        JOIN maps ON canhdong.map_id = maps._id
        WHERE works.id_user = ?  `;
        connection.query(query, IdUser, callback);
    },
    // lấy những công việc cùng ID_USER
    //     getAllWorksWithId_UserAndVuMua_Id: (IdUser, IdVuMua, callback) => {
    //         const query = `
    //   SELECT works.*, vumua.name AS vumua_name 
    //   FROM works
    //   JOIN vumua ON works.vumua_id = vumua._id
    //   WHERE works.id_user = ? AND works.vumua_id = ?
    // `;
    //         connection.query(query, [IdUser, IdVuMua], callback);
    //     },
    // lấy sản phẩm theo id 
    getWorkById: (Id, callback) => {
        const query = 'SELECT * FROM works WHERE _id = ?';
        connection.query(query, Id, callback);
    },

    updateWork: (WorkId, Work, callback) => {
        const query = 'UPDATE works SET title=?, start=? ,end =?,canhdong_id = ? WHERE _id = ?';
        const values = [Work.title, Work.start, Work.end, Work.canhdong_id, WorkId];
        connection.query(query, values, callback);
    },

    addWork: (Work, callback) => {
        const query = 'INSERT INTO works (title, start,end,id_user,canhdong_id) VALUES (?,?,?,?,?)';
        const values = [Work.title, Work.start, Work.end, Work.id_user, Work.canhdong_id];
        connection.query(query, values, callback);
    },
    deleteWork: (WorkId, callback) => {
        const query = 'DELETE FROM works WHERE _id = ?';
        connection.query(query, [WorkId], callback);
    },
    //tìm kiếm trang admin
    searchWorkByName: (title, callback) => {
        const sql = 'SELECT * FROM works WHERE title LIKE ?';
        const searchName = '%' + title + '%';
        connection.query(sql, [searchName], callback);
    },
}
// Export model để sử dụng ở nơi khác trong ứng dụng
module.exports = WorkModel;