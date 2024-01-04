clickbtn = document.getElementById('clickbtn')
document.addEventListener('DOMContentLoaded', function () {
    var map = L.map('setmap').setView([16.7, 107.03], 5)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    var googleStreets = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    }).addTo(map);

    map.on('click', function (e) {
        // Lấy tọa độ khi người dùng click vào bản đồ
        var lat = e.latlng.lat;
        var lng = e.latlng.lng;
        var zoomLevel = map.getZoom();
        // Gửi tọa độ trung tâm đến server
        clickbtn.addEventListener('click', function () {
            fetch('/map/save-map-center', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ lat, lng, zoomLevel })
            })
            .then(() => {
                    window.location.replace('/map')
                })
        })
    });

})