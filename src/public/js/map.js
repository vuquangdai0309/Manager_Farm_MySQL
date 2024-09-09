const exampleModal = document.getElementById("delete-work-modal");
exampleModal.addEventListener("show.bs.modal", (event) => {
  var deleteForm = document.forms["delete-calendar-form"];
  var btnDeleteCalendar = document.getElementById("btn-delete-calendar");
  const button = event.relatedTarget;
  //get id from button delete
  const recipient = button.getAttribute("data-id");

  btnDeleteCalendar.onclick = function () {
    deleteForm.action = "/map/" + recipient + "?_method=DELETE";
    deleteForm.submit();
  };
});
// show map
btnsave = document.getElementById("btnsave");
message = document.getElementById("message");

//lấy tọa độ khi set view
const setview = document.getElementById("setview");
const lat = setview.getAttribute("data-lat");
const lng = setview.getAttribute("data-lng");
const zoomLevel = setview.getAttribute("data-zoomLevel");

document.addEventListener("DOMContentLoaded", function () {
  const map = L.map("map").setView([lat, lng], zoomLevel);
  const osm = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      maxZoom: 19,
    }
  ).addTo(map);

  const googleStreets = L.tileLayer(
    "http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
    {
      maxZoom: 20,
      subdomains: ["mt0", "mt1", "mt2", "mt3"],
    }
  ).addTo(map);

  //Layer controller
  const baseMaps = {
    OSM: osm,
    "Google map": googleStreets,
  };

  const drawnItems = new L.FeatureGroup();
  map.addLayer(drawnItems);

  const drawControl = new L.Control.Draw({
    draw: {
      circlemarker: false,
      circle: false,
      // marker: true,
      polyline: false,
      // polygon: false,
      rectangle: false,
    },
    edit: {
      featureGroup: drawnItems,

      poly: {
        allowIntersection: false,
      },
    },
  });
  map.addControl(drawControl);
  map.on("editable:deleted", function (e) {
    console.log("Polygon deleted:", e.layers);
  });

  // chỉnh sửa polygon
  map.on("draw:edited", function (e) {
    const layers = e.layers;
    const type = "Polygon";
    layers.eachLayer(function (layer) {
      // Update your data or perform other actions
      const localpolygon = layer.toGeoJSON().geometry.coordinates[0];
      const areaMeter = L.GeometryUtil.geodesicArea(layer.getLatLngs()[0]);
      const area = areaMeter.toFixed(2);
      //    console.log('Diện tích: ' + area.toFixed(2) + ' mét vuông');
      const arrayPolygon = [];
      arrayPolygon.push(localpolygon);
      //chuyển tọa độ từ object sang string
      const parseLocalpolygon = JSON.stringify(arrayPolygon);
      btnsave.onclick = function () {
        input = document.getElementById("namearea").value;
        if (input === "") {
          message.innerHTML = "Vui lòng nhập vùng trồng !";
        } else {
          $.ajax({
            url: "/map/store",
            type: "POST",
            data: {
              area: area,
              type: type,
              namearea: `Khu vực: ${input}`,
              coordinates: parseLocalpolygon,
            },
          });
          //bắt dự kiên load trang
          location.reload();
        }
      };
    });
  });
  map.on("draw:created", function (event) {
    //  const type = event.layerType;
    const layer = event.layer;
    drawnItems.addLayer(layer);

    const type = layer instanceof L.Marker ? "Point" : "Polygon";
    const localpolygon =
      layer instanceof L.Marker
        ? layer.toGeoJSON().geometry.coordinates
        : layer.toGeoJSON().geometry.coordinates[0];
    //  lưu tọa độ vào mảng

    if (layer instanceof L.Marker) {
      //chuyển tọa độ từ object sang string
      const parseLocalpolygon = JSON.stringify(localpolygon);
      btnsave.onclick = function () {
        input = document.getElementById("namearea").value;
        if (input === "") {
          message.innerHTML = "Vui lòng nhập tên điểm !";
        } else {
          $.ajax({
            url: "/map/store",
            type: "POST",
            data: {
              area: "",
              type: type,
              namearea: `Điểm: ${input}`,
              coordinates: parseLocalpolygon,
            },
          });
          //bắt dự kiên load trang
          location.reload();
        }
      };
    } else {
      //tính diện tích
      const areaMeter = L.GeometryUtil.geodesicArea(layer.getLatLngs()[0]);
      const area = areaMeter.toFixed(2);
      // console.log('Diện tích: ' + area.toFixed(2) + ' mét vuông');
      const arrayPolygon = [];
      arrayPolygon.push(localpolygon);
      //chuyển tọa độ từ object sang string
      const parseLocalpolygon = JSON.stringify(arrayPolygon);
      btnsave.onclick = function () {
        input = document.getElementById("namearea").value;
        if (input === "") {
          message.innerHTML = "Vui lòng nhập vùng trồng !";
        } else {
          $.ajax({
            url: "/map/store",
            type: "POST",
            data: {
              area: area,
              type: type,
              namearea: `Vùng trồng: ${input}`,
              coordinates: parseLocalpolygon,
            },
          });
          //bắt dự kiên load trang
          location.reload();
        }
      };
    }
  });

  //hàm load dữ liệu
  function loadData() {
    $.ajax({
      url: "/map/loadMap",
      type: "GET",
    })
      .then((data) => {
        const list = data.data.map((toado) => {
          //chuyển dữ liệu về dạng object
          const par = JSON.parse(toado.coordinates);
          const namearea = toado.namearea;
          const type = toado.type;
          const areaShow = toado.areaMeter;
          return {
            type: "Feature",
            properties: {
              name: namearea,
              area: areaShow,
            },
            geometry: {
              type: type,
              coordinates: par,
            },
          };
        });
        //hiển thị dữ liệu ra client
        const stateData = {
          type: "FeatureCollection",
          features: list,
        };
        //Caculate measure
        L.geoJSON(stateData, {
          onEachFeature: function (feature, layer) {
            // Bind Popup với nội dung từ thuộc tính "name" của đối tượng GeoJSON

            layer.bindPopup(`<b> ${feature.properties.name} </b>`);
          },
        }).addTo(map);
      })
      .catch((err) => console.log(err));
  }
  loadData();
  // get data từ localstorage sau đó gán stateData
});
