const connection = require('../../config/db/index')
const vumuaModle = {
    getAllVumua: (callback) => {
        const query = 'SELECT * FROM vumua ';
        connection.query(query, callback);
    },
}
module.exports = vumuaModle