const connection = require('../../config/db/index')
const MapModel = {
    getAllMaps: (IdUser,callback) => {
        const query = 'SELECT * FROM maps WHERE id_user = ? ';
        connection.query(query,IdUser, callback);
    },
    getAllMapsTypePolygon: (IdUser,callback) => {
        const query = `SELECT * FROM maps WHERE id_user = ? AND type  = 'Polygon'`;
        connection.query(query,IdUser, callback);
    },
    getMapLimitOne: (callback) => {
        const query = 'SELECT * FROM maps LIMIT 1';
        connection.query(query, callback);
    },
    updateMap: (MapId, Map, callback) => {
        const query = 'UPDATE maps SET namearea=?, coordinates=?  WHERE _id = ?';
        const values = [Map.namearea, Map.coordinates, MapId];
        connection.query(query, values, callback);
    },

    addMap: (Map, callback) => {
        const query = 'INSERT INTO maps (namearea, coordinates,type,areaMeter,id_user) VALUES (?,?,?,?,?)';
        const values = [Map.namearea, Map.coordinates, Map.type, Map.areaMeter,Map.id_user];
        connection.query(query, values, callback);
    },
    deleteMap: (MapId, callback) => {
        const query = 'DELETE FROM maps WHERE _id = ?';
        connection.query(query, [MapId], callback);
    },
}
// Export model để sử dụng ở nơi khác trong ứng dụng
module.exports = MapModel;