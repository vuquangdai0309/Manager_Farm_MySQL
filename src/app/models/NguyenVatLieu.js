const connection = require("../../config/db/index");
const nguyenlieuModle = {
  getAllNguyenLieu: (callback) => {
    const query = "SELECT * FROM nguyenvatlieu ";
    connection.query(query, callback);
  },
  getAllNguyenLieuBySearch: (title, callback) => {
    const query = "SELECT * FROM nguyenvatlieu WHERE name LIKE ?";
    const values = "%" + title + "%";
    connection.query(query, [values], callback);
  },
  // lấy nguyên liệu theo tên
  getNguyenLieuByName: (BaiViet, callback) => {
    const query = "SELECT * FROM nguyenvatlieu WHERE nguyenvatlieu = ?";
    connection.query(query, [BaiViet], callback);
  },
  findNguyenLieuCayTrong: (nguyenvatlieu_id, callback) => {
    const query = "SELECT * FROM nguyenvatlieu WHERE _id = ?";
    connection.query(query, [nguyenvatlieu_id], callback);
  },
  creatNguyenLieu: (nguyenvatlieu, callback) => {
    const query = `INSERT INTO nguyenvatlieu (name,lieuluong,nongdo,thoigiancachlythuoc,mucdich,thietbi) VALUES (?,?,?,?,?,?)`;
    const values = [
      nguyenvatlieu.name,
      nguyenvatlieu.lieuluong,
      nguyenvatlieu.nongdo,
      nguyenvatlieu.thoigiancachlythuoc,
      nguyenvatlieu.mucdich,
      nguyenvatlieu.thietbi,
    ];
    connection.query(query, values, callback);
  },
  updateNguyenLieu: (Id, nguyenvatlieu, callback) => {
    const query = `UPDATE nguyenvatlieu SET name = ?,lieuluong = ?,nongdo = ?,thoigiancachlythuoc = ?,mucdich = ?,thietbi = ? WHERE _id = ?`;
    const values = [
      nguyenvatlieu.name,
      nguyenvatlieu.lieuluong,
      nguyenvatlieu.nongdo,
      nguyenvatlieu.thoigiancachlythuoc,
      nguyenvatlieu.mucdich,
      nguyenvatlieu.thietbi,
      Id,
    ];
    connection.query(query, values, callback);
  },
};
module.exports = nguyenlieuModle;
