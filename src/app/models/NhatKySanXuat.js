const connection = require('../../config/db/index')
const NhatKySanXuatModel = {
    // lấy những công việc cùng ID_USER
    getAllNhatKySanXuatWithId: (IdUser, callback) => {
        const query = `
        SELECT maps.*,nhatkysanxuat.*,season.*,nguyenvatlieu.*,tree.*,tree._id AS tree_id,year.*
        FROM nhatkysanxuat
        JOIN maps ON nhatkysanxuat.map_id = maps._id
        JOIN season ON nhatkysanxuat.season_id = season._id
        JOIN tree ON nhatkysanxuat.tree_id = tree._id
        JOIN year ON nhatkysanxuat.year_id = year._id
        JOIN nguyenvatlieu ON nhatkysanxuat.nguyenvatlieu_id = nguyenvatlieu._id
        WHERE nhatkysanxuat.id_user = ? AND nhatkysanxuat.is_deleted = 0 ORDER BY STR_TO_DATE(nhatkysanxuat.start, "%d-%m-%Y")`;
        connection.query(query, IdUser, callback);
    },
    getAllNhatKySanXuatByCodeOfShipment: (tree_id, season_id, map_id, year_id, IdUser, callback) => {
        const query = `
        SELECT maps.*, nhatkysanxuat.*, season.*, nguyenvatlieu.*, tree.*, tree._id AS tree_id, year.*
        FROM nhatkysanxuat
        JOIN maps ON nhatkysanxuat.map_id = maps._id
        JOIN season ON nhatkysanxuat.season_id = season._id
        JOIN tree ON nhatkysanxuat.tree_id = tree._id
        JOIN year ON nhatkysanxuat.year_id = year._id
        JOIN nguyenvatlieu ON nhatkysanxuat.nguyenvatlieu_id = nguyenvatlieu._id
        WHERE nhatkysanxuat.tree_id = ? AND nhatkysanxuat.season_id = ? AND nhatkysanxuat.map_id = ? AND nhatkysanxuat.year_id = ? AND nhatkysanxuat.id_user = ? AND nhatkysanxuat.is_deleted = 0
        ORDER BY STR_TO_DATE(nhatkysanxuat.start, "%d-%m-%Y")`;

        connection.query(query, [tree_id, season_id, map_id, year_id, IdUser], callback);
    },

    getAllNhatKySanXuatWithId_Trash: (IdUser, callback) => {
        const query = `
        SELECT maps.*,nhatkysanxuat.*,season.*,nguyenvatlieu.*,tree.*,tree._id AS tree_id,nhatkysanxuat._id AS nhatkysanxuat_id,year.* 
        FROM nhatkysanxuat
        JOIN maps ON nhatkysanxuat.map_id = maps._id
        JOIN season ON nhatkysanxuat.season_id = season._id
        JOIN tree ON nhatkysanxuat.tree_id = tree._id
        JOIN year ON nhatkysanxuat.year_id = year._id
        JOIN nguyenvatlieu ON nhatkysanxuat.nguyenvatlieu_id = nguyenvatlieu._id
        WHERE nhatkysanxuat.id_user = ? AND nhatkysanxuat.is_deleted = 1 ORDER BY STR_TO_DATE(nhatkysanxuat.start, "%d-%m-%Y")`;
        connection.query(query, IdUser, callback);
    },
    searchAllBy_tree_And_Season: (tree_id, season_id, map_id, year_id, IdUser, callback) => {
        const query = `
        SELECT maps.*,nhatkysanxuat.*,season.*,nguyenvatlieu.*,tree.*,year.*,tree._id AS tree_id,nhatkysanxuat._id AS nhatkysanxuat_id  
        FROM nhatkysanxuat
        JOIN maps ON nhatkysanxuat.map_id = maps._id
        JOIN season ON nhatkysanxuat.season_id = season._id
        JOIN tree ON nhatkysanxuat.tree_id = tree._id
        JOIN year ON nhatkysanxuat.year_id = year._id
        JOIN nguyenvatlieu ON nhatkysanxuat.nguyenvatlieu_id = nguyenvatlieu._id
        WHERE  nhatkysanxuat.tree_id LIKE ? AND nhatkysanxuat.season_id LIKE ? AND  nhatkysanxuat.map_id LIKE ? AND nhatkysanxuat.year_id LIKE ? AND nhatkysanxuat.id_user = ? AND nhatkysanxuat.is_deleted = 0 ORDER BY STR_TO_DATE(nhatkysanxuat.start, "%d-%m-%Y")`;
        const Searchtree = '%' + tree_id + '%';
        const SearchSeason = '%' + season_id + '%';
        const SearchMap = '%' + map_id + '%';
        const SearchYear = '%' + year_id + '%';
        connection.query(query, [Searchtree, SearchSeason, SearchMap, SearchYear, IdUser], callback);
    },

    // lấy sản phẩm theo id 
    getNhatKySanXuatById: (ID_USER, Id, callback) => {
        const query = `
        SELECT maps.*,nhatkysanxuat.*,season.*,nguyenvatlieu.*,tree.*,tree._id AS tree_id,nhatkysanxuat._id AS nhatkysanxuat_id  
        FROM nhatkysanxuat
        JOIN maps ON nhatkysanxuat.map_id = maps._id
        JOIN season ON nhatkysanxuat.season_id = season._id
        JOIN tree ON nhatkysanxuat.tree_id = tree._id
        JOIN nguyenvatlieu ON nhatkysanxuat.nguyenvatlieu_id = nguyenvatlieu._id
        WHERE nhatkysanxuat.id_user = ? AND nhatkysanxuat._id IN (?) AND nhatkysanxuat.is_deleted = 0 ORDER BY nhatkysanxuat.start
        `;
        connection.query(query, [ID_USER, Id], callback);
    },

    updateNhatKySanXuat: (NhatKySanXuatId, NhatKySanXuat, callback) => {
        const query = 'UPDATE nhatkysanxuat SET title =?, start =?,end =?,id_user =?,map_id =?,nguyenvatlieu_id =?,tree_id =?,nongdo =?,luongsudung =?,thoigiancachly =?,mucdich =?,thietbi =?,vesinhdungcu =?,season_id =?,year_id = ? WHERE _id = ?';
        const values = [NhatKySanXuat.title, NhatKySanXuat.start, NhatKySanXuat.end, NhatKySanXuat.id_user, NhatKySanXuat.map_id, NhatKySanXuat.nguyenvatlieu_id, NhatKySanXuat.tree_id, NhatKySanXuat.nongdo, NhatKySanXuat.luongsudung, NhatKySanXuat.thoigiancachly, NhatKySanXuat.mucdich, NhatKySanXuat.thietbi, NhatKySanXuat.vesinhdungcu, NhatKySanXuat.season_id, NhatKySanXuat.year_id, NhatKySanXuatId];
        connection.query(query, values, callback);
    },
    addNhatKySanXuat: (NhatKySanXuat, callback) => {
        const query = 'INSERT INTO nhatkysanxuat (title, start,end,id_user,map_id,nguyenvatlieu_id,tree_id,nongdo,luongsudung,thoigiancachly,mucdich,thietbi,vesinhdungcu,season_id,year_id) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
        const values = [NhatKySanXuat.title, NhatKySanXuat.start, NhatKySanXuat.end, NhatKySanXuat.id_user, NhatKySanXuat.map_id, NhatKySanXuat.nguyenvatlieu_id, NhatKySanXuat.tree_id, NhatKySanXuat.nongdo, NhatKySanXuat.luongsudung, NhatKySanXuat.thoigiancachly, NhatKySanXuat.mucdich, NhatKySanXuat.thietbi, NhatKySanXuat.vesinhdungcu, NhatKySanXuat.season_id, NhatKySanXuat.year_id];
        connection.query(query, values, callback);
    },
    // xóa bản ghi 
    deleteAllNhatKySanXuatWithId: (idsToDelete, callback) => {
        const query = 'UPDATE nhatkysanxuat SET is_deleted = 1 WHERE _id IN (?)';
        connection.query(query, [idsToDelete], callback);
    },
    deleteNhatKySanXuat_With_Map: (idsToDelete, callback) => {
        const query = 'UPDATE nhatkysanxuat SET is_deleted = 2 WHERE map_id IN (?) ';
        connection.query(query, [idsToDelete], callback);
    },
    // xóa vĩnh viễn 
    forceDestroyAllSelected_NhatKySanXuat: (idsToDelete, callback) => {
        const query = 'DELETE FROM nhatkysanxuat WHERE _id IN (?)';
        connection.query(query, [idsToDelete], callback);
    },
    // khôi phục 
    restoreAllSelected_NhatKySanXuat: (Ids, callback) => {
        const query = 'UPDATE nhatkysanxuat SET is_deleted = 0 WHERE _id IN (?)';
        connection.query(query, [Ids], callback);
    },
    countNguyenLieusSanXuat: (User, callback) => {
        const query = `SELECT COUNT(*) AS CountNLSX FROM nhatkysanxuat WHERE is_deleted = 0 AND id_user = ?`
        connection.query(query, User, callback)
    }
}
// Export model để sử dụng ở nơi khác trong ứng dụng
module.exports = NhatKySanXuatModel;