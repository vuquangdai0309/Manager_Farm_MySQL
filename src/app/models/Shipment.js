
const connection = require('../../config/db/index')
const Shipment = {
    getAllShipment: (Id, title, callback) => {
        const query = `SELECT shipment.*,quanlysanpham.title AS nameProduct
         FROM shipment 
         JOIN quanlysanpham ON shipment.product_id = quanlysanpham._id
        WHERE shipment.user_id = ? AND shipment.is_deleted = 0 AND shipment.nameShipment LIKE ?
        `
        const value = '%' + title + '%'
        connection.query(query, [Id, value], callback)
    },
    getShipmentById: (Id, User_id, callback) => {
        const query = `SELECT shipment.*,quanlysanpham.*
         FROM shipment 
         JOIN quanlysanpham ON shipment.product_id = quanlysanpham._id
        WHERE shipment._id = ? AND shipment.user_id = ? AND  shipment.is_deleted = 0 
        `

        connection.query(query, [Id, User_id], callback)
    },
    getShipmentByCode: (code, callback) => {
        const query = `SELECT shipment.*,quanlysanpham.*
        FROM shipment 
        JOIN quanlysanpham ON shipment.product_id = quanlysanpham._id
        WHERE shipment.code = ? AND shipment.is_deleted = 0 
        `
        connection.query(query, code, callback)
    },
    searchShipment: (search, callback) => {
        const query = `SELECT * FROM shipment
        WHERE nameShipment LIKE ?
        `
        const value = '%' + search + '%'
        connection.query(query, [value], callback)

    },
    creatShipment: (Shipment, callback) => {
        const query = `INSERT INTO shipment (code,nameShipment,product_id,quantity,unit,startDate,endDate,user_id,logo,background) VALUES (?,?,?,?,?,?,?,?,?,?)`
        const value = [Shipment.code, Shipment.nameShipment, Shipment.product_id, Shipment.quantity, Shipment.unit, Shipment.startDate, Shipment.endDate, Shipment.user_id, Shipment.logo, Shipment.background]
        connection.query(query, value, callback)
    },
    update: (Shipment, Id, callback) => {
        const query = `UPDATE shipment SET code = ?,nameShipment = ?,product_id = ?,quantity = ?,unit = ?,startDate = ?,endDate = ?,user_id = ?,logo = ?,background = ? WHERE _id = ?`
        const value = [Shipment.code, Shipment.nameShipment, Shipment.product_id, Shipment.quantity, Shipment.unit, Shipment.startDate, Shipment.endDate, Shipment.user_id, Shipment.logo, Shipment.background, Id]
        connection.query(query, value, callback)
    },
    delete: (Id, User_id, callback) => {
        const query = `UPDATE shipment SET is_deleted = 1 
        WHERE _id = ? AND user_id = ?
        `
        connection.query(query, [Id, User_id], callback)
    }

}
module.exports = Shipment