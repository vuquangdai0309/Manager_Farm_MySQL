const Map = require("../models/Map");
const MapCenter = require("../models/MapCenter");
var jwt = require("jsonwebtoken");
class MapController {
  index(req, res, next) {
    let token = req.cookies.tkvungtrong;
    let par = jwt.verify(token, process.env.SECRET);
    MapCenter.getAllCenters(par._id, (err, onedata) => {
      if (err) {
        console.log("Lỗi truy vấn", err);
        return;
      }
      Map.getAllMaps(par._id, (err, data) => {
        if (err) {
          console.log("Lỗi truy vấn", err);
          return;
        } else {
          console.log(onedata);
          res.render("map/app", { onedata, data });
        }
      });
    });
  }
  // thêm bản ghi
  store(req, res, next) {
    //   console.log(req.body)
    const namearea = req.body.namearea;
    const coordinates = req.body.coordinates;
    const type = req.body.type;
    const area = req.body.area;
    let token = req.cookies.tkvungtrong;
    let par = jwt.verify(token, process.env.SECRET);
    Map.addMap(
      {
        id_user: par._id,
        areaMeter: area,
        type: type,
        namearea: namearea,
        coordinates: coordinates,
      },
      (err, results) => {
        if (err) {
          console.log("lỗi truy vấn", err);
        } else {
          console.log("Thêm bản ghi thành công", results);
        }
      }
    );
  }
  setview(req, res, next) {
    res.render("map/setview");
  }
  // lưu khu vực bạn muốn hiển thị
  savemapcenter(req, res, next) {
    try {
      const lat = req.body.lat;
      const lng = req.body.lng;
      const zoomLevel = req.body.zoomLevel;
      let token = req.cookies.tkvungtrong;
      let par = jwt.verify(token, process.env.SECRET);
      // Sử dụng findOne để lấy sản phẩm đầu tiên từ cơ sở dữ liệu
      MapCenter.getCenterLimitOne(par._id, (err, results) => {
        if (err) {
          console.log("Lỗi truy vấn", err);
          return;
        } else {
          if (results.length > 0) {
            const id_data = results[0]._id;
            MapCenter.updateCenter(
              id_data,
              par._id,
              {
                lat: lat,
                lng: lng,
                zoomLevel: zoomLevel,
              },
              (err, results) => {
                if (err) {
                  console.log("Lỗi truy vấn", err);
                  return;
                } else {
                  res.render("map/app");
                }
              }
            );
          } else {
            MapCenter.addCenter(
              {
                lat: lat,
                lng: lng,
                zoomLevel: zoomLevel,
                id_user: par._id,
              },
              (err, results) => {
                if (err) {
                  console.log("Lỗi truy vấn", err);
                  return;
                } else {
                  res.render("map/app");
                }
              }
            );
          }
        }
      });
    } catch (error) {
      console.error(error);
      res.send("Internal Server Error");
    }
  }

  // load map
  loadMap(req, res, next) {
    let token = req.cookies.tkvungtrong;
    let par = jwt.verify(token, process.env.SECRET);
    Map.getAllMaps(par._id, (err, data) => {
      if (err) {
        console.log("Lỗi truy vấn", err);
        return;
      } else {
        return res.json({ data: data });
      }
    });
  }
  delete(req, res, next) {
    const Id_map = req.params.id;
    Map.deleteMap(Id_map, (err, data) => {
      if (err) {
        console.log("Lỗi truy vấn", err);
      } else {
        res.redirect("back");
      }
    });
  }
  edit(req, res, next) {
    const Id_map = req.params.id;
    Map.getNhatKySanXuatById(Id_map, (err, map) => {
      if (err) {
        console.log("lỗi truy vấn", err);
      } else {
        res.render("nhatkysanxuat/edit", { map: map[0] });
      }
    });
  }
}

module.exports = new MapController();
