const connection = require('../../config/db/index');

const seasonModle = {
    getAllSeason: (title, callback) => {
        const query = `SELECT season.*,tree.nameTree AS nameTree
        FROM season
        JOIN tree ON season.tree_id = tree._id
        WHERE season.is_deleted = 0 AND nameTree LIKE ?`;
        const search = '%' + title + '%'
        connection.query(query, [search], callback);
    },
    creatSeason: (Season, callback) => {
        const query = `INSERT INTO season (tree_id,nameSeason) VALUES (?,?)`
        const values = [Season.tree_id, Season.nameSeason]
        connection.query(query, values, callback)
    },
    updateSeason: (Id, Season, callback) => {
        const query = 'UPDATE season SET nameSeason =? WHERE _id = ?'
        const values = [Season.nameSeason, Id]
        connection.query(query, values, callback)
    },
    getSeasonbyTree: (Tree, callback) => {
        const query = 'SELECT * FROM season WHERE tree_id = ?'
        connection.query(query, Tree, callback)
    }
}
module.exports = seasonModle