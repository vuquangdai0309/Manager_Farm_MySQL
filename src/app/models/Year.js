const connection = require('../../config/db/index');
const YearModal = {
    getAllYears: (callback) => {
        const query = `SELECT * FROM year WHERE is_deleted = 0`
        connection.query(query, callback)
    },
}
module.exports = YearModal