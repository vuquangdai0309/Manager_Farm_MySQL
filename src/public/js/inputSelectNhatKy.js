
document.addEventListener('DOMContentLoaded', function () {
    const selectedTreeElement = $('#selectedTree');
    const selectedNguyenLieuElement = $('#selectedNguyenLieu');
    const selectedAreaElement = $('#selectedArea');
    const selectedSeasonElement = $('#selectedSeason')

    let selectedTree = selectedTreeElement.val();
    let selectedNguyenLieu = selectedNguyenLieuElement.val();
    let selectedArea = selectedAreaElement.val();
    let selectedSeason = selectedSeasonElement.val()

    selectedTreeElement.on('change', function () {
        selectedTree = selectedTreeElement.val();
        // Khi select thay đổi, gọi lại fetchData với giá trị mới
        fetchTree(selectedTree);
    });
    selectedNguyenLieuElement.on('change', function () {
        const selectedNguyenLieu = selectedNguyenLieuElement.val();

        if (!selectedNguyenLieu) {
            $('#thoigiancachly').val('');
            $('#nongdo').val('');
            $('#luongsudung').val('');
            $('#mucdich').val('');
            $('#thietbi').val('');
        }
        else {
            // Khi select thay đổi, gọi lại fetchData với giá trị mới
            fetchData(selectedTree, selectedNguyenLieu, selectedArea);
        }
    });
    selectedAreaElement.on('change', function () {
        selectedArea = selectedAreaElement.val();
        selectedNguyenLieu = selectedNguyenLieuElement.val()
        selectedTree = selectedTreeElement.val()
        // Khi select thay đổi, gọi lại fetchData với giá trị mới
        fetchData(selectedTree, selectedNguyenLieu, selectedArea);

    });

    function fetchData(option1, option2, option3) {
        fetch(`/materials/getData/${option1}/${option2}/${option3}`)
            .then(response => response.json())
            .then(data => {
                const match = (data.data.lieuluong).match(/[\d\.,]+/);;
                var donVi = (data.data.lieuluong).match(/[^\d\s,]+/);
                var number = parseFloat(match[0].replace(',', '.'));

                // Cập nhật giá trị của các ô input sau khi nhận dữ liệu từ server
                $('#thoigiancachly').val(data.data.thoigiancachlythuoc);
                $('#nongdo').val(data.data.nongdo);
                $('#luongsudung').val((number * (data.map.areaMeter / 10000)).toFixed(5) + ` ${donVi[0]}`);
                $('#mucdich').val(data.data.mucdich);
                $('#thietbi').val(data.data.thietbi);
                // Cập nhật các ô input khác nếu cần
            })
            .catch(error => console.error('Error:', error));
    }
    // Khi trang được tải lên, gọi fetchData để lấy dữ liệu ban đầu

    function fetchTree(option, callback) {
        fetch(`/materials/getTree/${option}`)
            .then(response => response.json())
            .then(data => {

                selectedSeasonElement.empty();
                const optionElement = $('<option>'); // Tạo một phần tử option mới
                optionElement.val(''); // Thiết lập giá trị của option
                optionElement.text('Chọn tên nguyên vật liệu'); // Thiết lập nội dung văn bản của option
                selectedNguyenLieuElement.append(optionElement); // Thêm option vào phần tử select
                // Lặp qua mảng dữ liệu và thêm mỗi phần tử vào phần tử select
                $.each(data.nguyenvatlieu, function (index, result) {
                    const optionElement = $('<option>'); // Tạo một phần tử option mới
                    optionElement.val(result._id); // Thiết lập giá trị của option
                    optionElement.text(result.name); // Thiết lập nội dung văn bản của option
                    selectedNguyenLieuElement.append(optionElement); // Thêm option vào phần tử select
                });

                $.each(data.season, function (index, DataSeason) {
                    const optionElement = $('<option>'); // Tạo một phần tử option mới
                    optionElement.val(DataSeason._id); // Thiết lập giá trị của option
                    optionElement.text(DataSeason.nameSeason); // Thiết lập nội dung văn bản của option
                    selectedSeasonElement.append(optionElement); // Thêm option vào phần tử select
                });

            })
    }
})
