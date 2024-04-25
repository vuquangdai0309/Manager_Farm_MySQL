const connection = require('../../config/db/index')
const giongcayModle = {
    getAllGiongCay: (callback) => {
        const query = 'SELECT * FROM giongcay ';
        connection.query(query, callback);
    },
    getGiongCayByName: (GiongCay, callback) => {
        const query = 'SELECT * FROM giongcay WHERE giongcay = ?';
        connection.query(query, [GiongCay], callback);
    },


}
module.exports = giongcayModle