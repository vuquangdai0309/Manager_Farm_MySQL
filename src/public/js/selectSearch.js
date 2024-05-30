const showtree = document.getElementById('tree_id')
const getAttrtree = showtree.getAttribute('show-value')

const showSeason = document.getElementById('season_id')
const getAttrSeason = showSeason.getAttribute('show-value')

const showMap = document.getElementById('map_id')
const getAttrMap = showMap.getAttribute('show-value')

const showYear = document.getElementById('year_id')
const getAttrYear = showYear.getAttribute('show-value')

function showSelected(showElement, value) {
    valueFromDatabase = value
    // Lấy tham chiếu đến element select
    var selectElement = showElement

    // Duyệt qua từng option trong select
    for (var i = 0; i < selectElement.options.length; i++) {
        // So sánh giá trị của option với giá trị từ database
        if (selectElement.options[i].value === valueFromDatabase) {
            // Đặt thuộc tính selected cho option tương ứng
            selectElement.options[i].selected = true;
            break; // Dừng vòng lặp nếu đã tìm thấy giá trị
        }
    }
}
showSelected(showtree, getAttrtree)
showSelected(showSeason, getAttrSeason)
showSelected(showMap, getAttrMap)
showSelected(showYear, getAttrYear)

const TreesSelect = $('#tree_id');
const SeasonsSelect = $('#season_id');

TreesSelect.on('change', () => {
    const TreeId = TreesSelect.val();


    fetchTree(TreeId)

});
function fetchTree(tree, callback) {
    fetch(`/season/${tree}/getSeasonWithTree`)
        .then(response => response.json())
        .then(datas => {

            SeasonsSelect.empty();
            const option = $('<option>');
            option.val("");
            option.text('Chọn mùa');
            SeasonsSelect.append(option);
            datas.forEach(data => {
                const option = $('<option>');
                option.val(data._id);
                option.text(data.nameSeason);
                SeasonsSelect.append(option);
            });
         
        })
}