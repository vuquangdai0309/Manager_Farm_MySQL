document.addEventListener('DOMContentLoaded', function () {

    let showTreeId = $('#selectedTree');
    let getAttrTreeId = showTreeId.attr('show-value');

    let showSeasonId = $('#selectedSeason');
    let getAttrSeasonId = showSeasonId.attr('show-value');

    let showAreaId = $('#selectedArea');
    let getAttrAreaId = showAreaId.attr('show-value');

    let showNguyenLieuId = $('#selectedNguyenLieu');
    let getAttrNguyenLieuId = showNguyenLieuId.attr('show-value');

    let showYearId = $('#selectedYear');
    let getAttrYearId = showYearId.attr('show-value');


    let showVSDCId = $('#vesinhdungcu');
    let getAttrVSDCId = showVSDCId.attr('show-value');

    function showSelected(showElement, value) {
        let valueFromDatabase = value;
        let selectElement = showElement;

        selectElement.find('option').each(function () {
            if ($(this).val() === valueFromDatabase) {
                $(this).prop('selected', true);
                return false; // Dừng vòng lặp nếu đã tìm thấy giá trị
            }
        });
    }

    showSelected(showTreeId, getAttrTreeId)
    showSelected(showSeasonId, getAttrSeasonId)
    showSelected(showAreaId, getAttrAreaId)
    showSelected(showNguyenLieuId, getAttrNguyenLieuId)
    showSelected(showYearId, getAttrYearId)
    showSelected(showVSDCId, getAttrVSDCId)
})
