tinymceAddProduct()
$('#exampleModal').on('shown.bs.modal', function () {
    $(".js-example-disabled-results").select2({
        dropdownParent: $('#exampleModal') // Xác định modal là cha của dropdown
    });
});

var img = document.getElementById('image')
var imagePreview = document.getElementById('imagePreview')
// Khi click vào ảnh, chuyển sự kiện click đến trường nhập file
imagePreview.addEventListener('click', function () {
    img.click();
});
// change ảnh khi chọn
img.addEventListener('change', function () {
    imagePreview.src = URL.createObjectURL(img.files[0])

});
function onclickItem() {
    const tinymceHtmlContent = tinymce.get('editor').getContent();
    const title = document.getElementById('title')?.value || '';
    const map_id = document.getElementById('map_id')?.value || '';
    const tree_id = document.getElementById('tree_id')?.value || '';
    const year_id = document.getElementById('year_id')?.value || '';
    const season_id = document.getElementById('season_id')?.value || '';
    const phone = document.getElementById('phone')?.value || '';
    const email = document.getElementById('email')?.value || '';
    const address = document.getElementById('address')?.value || '';
    const productionUnit = document.getElementById('productionUnit')?.value || '';
    const fileInput = document.getElementById('image');
    const file = fileInput.files !== undefined ? fileInput.files[0] : '';


    const fields = [
        { id: 'title', value: title, message: 'Vui lòng nhập trường này' },
        { id: 'editor', value: tinymceHtmlContent, message: 'Vui lòng nhập trường này' },
        { id: 'phone', value: phone, message: 'Vui lòng nhập trường này' },
        { id: 'email', value: email, message: 'Vui lòng nhập trường này' },
        { id: 'address', value: address, message: 'Vui lòng nhập trường này' },
        { id: 'productionUnit', value: productionUnit, message: 'Vui lòng nhập trường này' },
        { id: 'season_id', value: season_id, message: 'Vui lòng chọn trường này' },
        { id: 'tree_id', value: tree_id, message: 'Vui lòng chọn trường này' },
        { id: 'image', value: file, message: 'Vui lòng chọn ảnh' }
    ];

    let allFieldsFilled = true;

    // Helper function to update field style and error message based on its value
    function updateField(fieldId, isValid, message) {
        const element = document.getElementById(fieldId);
        const errorSpanId = fieldId + '-error';
        let errorSpan = document.getElementById(errorSpanId);

        if (!isValid) {

            if (!errorSpan) {
                errorSpan = document.createElement('span');
                errorSpan.id = errorSpanId;
                errorSpan.style.color = 'red';
                errorSpan.innerText = message;
                element.parentNode.appendChild(errorSpan);
            }
        } else {
            element.style.borderColor = '';
            if (errorSpan) {
                errorSpan.remove();
            }
        }
    }


    // Check all fields and update their styles and error messages
    fields.forEach(field => {
      
        if (!field.value) {
            updateField(field.id, false, field.message);
            allFieldsFilled = false;
        } else {
            updateField(field.id, true);
        }
    });

    if (allFieldsFilled) {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('title', title);
        formData.append('map_id', map_id);
        formData.append('tree_id', tree_id);
        formData.append('year_id', year_id);
        formData.append('season_id', season_id);
        formData.append('productionUnit', productionUnit);
        formData.append('phone', phone);
        formData.append('email', email);
        formData.append('address', address);
        formData.append('editor', tinymceHtmlContent);

        fetch('/product/creat', {
            method: 'POST',
            body: formData,
        }).then(() => {
            window.location.replace('/product/management');
        });
    }
}


// method delete 
const exampleModal = document.getElementById('delete-work-modal')
exampleModal.addEventListener('show.bs.modal', event => {
    var deleteForm = document.forms['delete-item-form']
    var btnDeleteitem = document.getElementById('btn-delete-item')
    const button = event.relatedTarget
    //get id from button delete
    const recipient = button.getAttribute('data-id')

    btnDeleteitem.onclick = function () {
        deleteForm.action = '/product/' + recipient + '/delete'
        deleteForm.submit()
    }
})

//  thay đổi bản ghi
var recordsPerPage = document.getElementById('recordsPerPage')
var getAttrRecordsPerPage = recordsPerPage.getAttribute('show-value')
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
            break; // Dừng vòng lặp nếu đã tìm thấy giá trị0
        }
    }
}
showSelected(recordsPerPage, getAttrRecordsPerPage)
$(document).ready(function () {
    $('#recordsPerPage').change(function () {
        $('#submit').click()
    })
})
const inputSearch = document.getElementById('inputSearch').value
function changePage(page) {
    window.location.href = `/product/management/?recordsPerPage=${getAttrRecordsPerPage}&page=${page}&name=${inputSearch}`;
}