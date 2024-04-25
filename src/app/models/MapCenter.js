const connection = require('../../config/db/index')
const CenterModel = {
    getAllCenters: (idUser, callback) => {
        const query = 'SELECT * FROM centers WHERE id_user = ? AND is_deleted = 0';
        connection.query(query, idUser, callback);
    },
    getCenterLimitOne: (idUser, callback) => {
        const query = 'SELECT * FROM centers WHERE id_user = ? AND is_deleted = 0 LIMIT 1';
        connection.query(query, idUser, callback);
    },
    updateCenter: (CenterId, IdUser, Center, callback) => {
        const query = 'UPDATE centers SET lat=?, lng=?,zoomLevel=?  WHERE _id = ? AND id_user = ?';
        const values = [Center.lat, Center.lng, Center.zoomLevel, CenterId, IdUser];
        connection.query(query, values, callback);
    },

    addCenter: (Center, callback) => {
        const query = 'INSERT INTO centers (lat, lng,zoomLevel,id_user) VALUES (?,?,?,?)';
        const values = [Center.lat, Center.lng, Center.zoomLevel, Center.id_user];
        connection.query(query, values, callback);
    },
}
// Export model để sử dụng ở nơi khác trong ứng dụng
module.exports = CenterModel;