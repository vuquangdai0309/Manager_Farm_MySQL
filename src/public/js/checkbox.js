
document.addEventListener('DOMContentLoaded', function () {
    var checkboxAll = $('#checkbox-all');
    var baivietItemCheckbox = $('input[name ="workIds"]')
    var checkAllSubmitBtn = $('.btn-check-all-submit')
    // var containerForm = document.forms['container-form']
    //checkbox All change
    checkboxAll.change(function () {
        var ischecked = $(this).prop('checked')
        baivietItemCheckbox.prop('checked', ischecked)
        renderCheckAllSubmitBtn()
    })

    // Baiviet Item checkbox change
    baivietItemCheckbox.change(function () {
        var ischecked = baivietItemCheckbox.length === $('input[name ="workIds"]:checked').length
        checkboxAll.prop('checked', ischecked)
        renderCheckAllSubmitBtn()
    })

    //re-render check all submit button
    function renderCheckAllSubmitBtn() {
        var checkCount = $('input[name ="workIds"]:checked').length
        if (checkCount > 0) {
            checkAllSubmitBtn.attr('disabled', false)
        }
        else {
            checkAllSubmitBtn.attr('disabled', true)
        }
    }
})
