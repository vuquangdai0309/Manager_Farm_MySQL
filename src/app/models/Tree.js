const connection = require('../../config/db/index')
const treeModle = {
    getAllTree: (callback) => {
        const query = 'SELECT * FROM tree WHERE is_deleted = 0';
        connection.query(query, callback);
    },
    getTreeByName: (Tree, callback) => {
        const query = 'SELECT * FROM tree WHERE tree = ? AND is_deleted = 0';
        connection.query(query, [Tree], callback);
    },
    creatTree: (Tree, callback) => {
        const query = 'INSERT INTO tree (nameTree) VALUES (?)'
        const values = [Tree.nameTree]
        connection.query(query, values, callback)
    },
    updateTree: (Id, Tree, callback) => {
        const query = 'UPDATE tree SET nameTree =? WHERE _id = ?'
        const values = [Tree.nameTree, Id]
        connection.query(query, values, callback)
    }


}
module.exports = treeModle