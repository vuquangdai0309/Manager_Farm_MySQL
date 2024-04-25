const connection = require('../../config/db/index')
const NhatKySanXuatModel = {
    // lấy những công việc cùng ID_USER
    getAllWorksWithId: (IdUser, callback) => {
        const query = `
        SELECT maps.*,works.*,vumua.*,nguyenvatlieu.*,giongcay.*,giongcay._id AS giongcay_id
        FROM works
        JOIN maps ON works.map_id = maps._id
        JOIN vumua ON works.vumua_id = vumua._id
        JOIN giongcay ON works.giongcay_id = giongcay._id
        JOIN nguyenvatlieu ON works.nguyenvatlieu_id = nguyenvatlieu._id
        WHERE works.id_user = ? AND works.is_deleted = 0 `;
        connection.query(query, IdUser, callback);
    },
    getAllWorksWithId_Trash: (IdUser, callback) => {
        const query = `
        SELECT maps.*,works.*,vumua.*,nguyenvatlieu.*,giongcay.*,giongcay._id AS giongcay_id,works._id AS works_id  
        FROM works
        JOIN maps ON works.map_id = maps._id
        JOIN vumua ON works.vumua_id = vumua._id
        JOIN giongcay ON works.giongcay_id = giongcay._id
        JOIN nguyenvatlieu ON works.nguyenvatlieu_id = nguyenvatlieu._id
        WHERE works.id_user = ? AND works.is_deleted = 1`;
        connection.query(query, IdUser, callback);
    },
    searchAllBy_GiongCay_And_Vumua: (giongcay_id, vumua_id, IdUser, callback) => {
        const query = `
        SELECT maps.*,works.*,vumua.*,nguyenvatlieu.*,giongcay.*,giongcay._id AS giongcay_id,works._id AS works_id  
        FROM works
        JOIN maps ON works.map_id = maps._id
        JOIN vumua ON works.vumua_id = vumua._id
        JOIN giongcay ON works.giongcay_id = giongcay._id
        JOIN nguyenvatlieu ON works.nguyenvatlieu_id = nguyenvatlieu._id
        WHERE  works.giongcay_id LIKE ? AND works.vumua_id LIKE ? AND works.id_user = ? AND works.is_deleted = 0 ORDER BY STR_TO_DATE(works.start, "%d-%m-%Y")`;
        const SearchGiongCay = '%' + giongcay_id + '%';
        const SearchVumua = '%' + vumua_id + '%';
        connection.query(query, [SearchGiongCay, SearchVumua, IdUser], callback);
    },

    // lấy sản phẩm theo id 
    getWorkById: (ID_USER, Id, callback) => {
        const query = `
        SELECT maps.*,works.*,vumua.*,nguyenvatlieu.*,giongcay.*,giongcay._id AS giongcay_id,works._id AS works_id  
        FROM works
        JOIN maps ON works.map_id = maps._id
        JOIN vumua ON works.vumua_id = vumua._id
        JOIN giongcay ON works.giongcay_id = giongcay._id
        JOIN nguyenvatlieu ON works.nguyenvatlieu_id = nguyenvatlieu._id
        WHERE works.id_user = ? AND works._id IN (?) AND works.is_deleted = 0 ORDER BY works.start
        `;
        connection.query(query, [ID_USER, Id], callback);
    },

    updateWork: (WorkId, Work, callback) => {
        const query = 'UPDATE works SET title =?, start =?,end =?,id_user =?,map_id =?,nguyenvatlieu_id =?,giongcay_id =?,nongdo =?,luongsudung =?,thoigiancachly =?,mucdich =?,thietbi =?,vesinhdungcu =?,vumua_id =? WHERE _id = ?';
        const values = [Work.title, Work.start, Work.end, Work.id_user, Work.map_id, Work.nguyenvatlieu_id, Work.giongcay_id, Work.nongdo, Work.luongsudung, Work.thoigiancachly, Work.mucdich, Work.thietbi, Work.vesinhdungcu, Work.vumua_id, WorkId];
        connection.query(query, values, callback);
    },
    addWork: (Work, callback) => {
        const query = 'INSERT INTO works (title, start,end,id_user,map_id,nguyenvatlieu_id,giongcay_id,nongdo,luongsudung,thoigiancachly,mucdich,thietbi,vesinhdungcu,vumua_id) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
        const values = [Work.title, Work.start, Work.end, Work.id_user, Work.map_id, Work.nguyenvatlieu_id, Work.giongcay_id, Work.nongdo, Work.luongsudung, Work.thoigiancachly, Work.mucdich, Work.thietbi, Work.vesinhdungcu, Work.vumua_id];
        connection.query(query, values, callback);
    },
    // xóa bản ghi 
    deleteAllWorksWithId: (idsToDelete, callback) => {
        const query = 'UPDATE works SET is_deleted = 1 WHERE _id IN (?)';
        connection.query(query, [idsToDelete], callback);
    },
    deleteWork_With_Map: (idsToDelete, callback) => {
        const query = 'UPDATE works SET is_deleted = 2 WHERE map_id IN (?) ';
        connection.query(query, [idsToDelete], callback);
    },
    // xóa vĩnh viễn 
    forceDestroyAllSelected_Work: (idsToDelete, callback) => {
        const query = 'DELETE FROM works WHERE _id IN (?)';
        connection.query(query, [idsToDelete], callback);
    },
    // khôi phục 
    restoreAllSelected_Work: (Ids, callback) => {
        const query = 'UPDATE works SET is_deleted = 0 WHERE _id IN (?)';
        connection.query(query, [Ids], callback);
    },
    countNguyenLieusSanXuat: (User, callback) => {
        const query = `SELECT COUNT(*) AS CountNLSX FROM works WHERE is_deleted = 0 AND id_user = ?`
        connection.query(query, User, callback)
    }
}
// Export model để sử dụng ở nơi khác trong ứng dụng
module.exports = NhatKySanXuatModel;