const connection = require('../../config/db/index')
const truyxuatnguongoc = {
    getAllTruyxuatnguongoc: (UserId, callback) => {
        const query = `SELECT truyxuatnguongoc.*,maps.*,truyxuatnguongoc._id AS truyxuat_id
         FROM truyxuatnguongoc 
         JOIN maps ON truyxuatnguongoc.map_id = maps._id
         WHERE truyxuatnguongoc.user_id = ? AND truyxuatnguongoc.is_deleted = 0`
        connection.query(query, UserId, callback)
    },
    createTruyXuat: (TruyXuat, callback) => {
        const query = 'INSERT INTO truyxuatnguongoc (code ,title ,phone ,email ,address ,productionUnit ,map_id ,user_id ,image,content ) VALUES (?,?,?,?,?,?,?,?,?,?)'
        const values = [TruyXuat.code, TruyXuat.title, TruyXuat.phone, TruyXuat.email, TruyXuat.address, TruyXuat.productionUnit, TruyXuat.map_id, TruyXuat.user_id, TruyXuat.image, TruyXuat.content]
        connection.query(query, values, callback)
    },
    deleteTruyXuat: (Id, callback) => {
        const query = 'UPDATE truyxuatnguongoc SET is_deleted = 1 WHERE _id IN (?)'
        connection.query(query, Id, callback)
    },
    getTruyXuat_By_Id: (UserId, Id, callback) => {
        const query = `SELECT truyxuatnguongoc.*,maps.*,truyxuatnguongoc._id AS truyxuat_id
         FROM truyxuatnguongoc 
         JOIN maps ON truyxuatnguongoc.map_id = maps._id
         WHERE truyxuatnguongoc.user_id = ? AND truyxuatnguongoc._id IN (?) AND truyxuatnguongoc.is_deleted = 0 `
        connection.query(query, [UserId, Id], callback)
    },
    getTruyXuat_By_code: (code, callback) => {
        const query = `SELECT truyxuatnguongoc.*,maps.*,truyxuatnguongoc._id AS truyxuat_id
         FROM truyxuatnguongoc 
         JOIN maps ON truyxuatnguongoc.map_id = maps._id
         WHERE truyxuatnguongoc.code = ? AND truyxuatnguongoc.is_deleted = 0 `
        connection.query(query, [code], callback)
    },
    updateTruyXuat: (TruyXuat, Id, callback) => {
        const query = 'UPDATE truyxuatnguongoc SET code =? ,title =? ,phone =? ,email =? ,address =? ,productionUnit =? ,map_id =? ,user_id =? ,image =? ,content =? WHERE _id = ? '
        const values = [TruyXuat.code, TruyXuat.title, TruyXuat.phone, TruyXuat.email, TruyXuat.address, TruyXuat.productionUnit, TruyXuat.map_id, TruyXuat.user_id, TruyXuat.image, TruyXuat.content, Id]
        connection.query(query, values, callback)
    }

}
module.exports = truyxuatnguongoc