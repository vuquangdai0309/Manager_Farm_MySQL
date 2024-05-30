 //lấy tọa độ khi set view
 const setview = document.getElementById('setview')
 const lat = setview.getAttribute('data-lat')
 const lng = setview.getAttribute('data-lng')
 const zoomLevel = setview.getAttribute('data-zoomLevel')


 // lấy tọa độ map
 const map = $('#getmap')
 const namearea = map.attr('namearea')
 const coordinates = JSON.parse(map.attr('coordinates'))
 const type = map.attr('type')
 const areaShow = map.attr('areaShow')


 document.addEventListener('DOMContentLoaded', function () {
     const map = L.map('map').setView([lat, lng], zoomLevel);
     const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
         maxZoom: 19,
     }).addTo(map);

     const googleStreets = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
         maxZoom: 20,
         subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
     }).addTo(map);

     //Layer controller
     const baseMaps = {
         "OSM": osm,
         "Google map": googleStreets,
     }

     const drawnItems = new L.FeatureGroup();
     map.addLayer(drawnItems);
     //hiển thị dữ liệu ra client
     const stateData = {
         "type": "FeatureCollection",
         "features": [{
             type: "Feature",
             properties: {
                 "name": namearea,
                 "area": areaShow
             },
             geometry: {
                 type: type,
                 coordinates: coordinates,
             },
         }]
     }
     //Caculate measure
     L.geoJSON(stateData, {
         onEachFeature: function (feature, layer) {
             // Bind Popup với nội dung từ thuộc tính "name" của đối tượng GeoJSON

             layer.bindPopup(`<b> ${namearea}, diện tích: ${areaShow/10000} ha </b>`);
         }
     }).addTo(map);

 })
