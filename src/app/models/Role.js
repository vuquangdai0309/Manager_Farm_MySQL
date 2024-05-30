
const connection = require('../../config/db/index')
const role = {
    getAllRole: (callback) => {
        const query = `SELECT * FROM role WHERE is_deleted = 0`
        connection.query(query, callback)
    }
}
module.exports = role