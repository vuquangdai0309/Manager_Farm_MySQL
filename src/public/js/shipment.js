 // change
 const inputSearch = document.getElementById('inputSearch').value
 function changePage(page) {
     window.location.href = `/shipment/store/?recordsPerPage=${getAttrRecordsPerPage}&page=${page}&name=${inputSearch}`;
 }


 const img = document.getElementById('image')
 const imagePreview = document.getElementById('imagePreview')
 // Khi click vào ảnh, chuyển sự kiện click đến trường nhập file
 imagePreview.addEventListener('click', function () {
     img.click();
 });
 // change ảnh khi chọn
 img.addEventListener('change', function () {
     imagePreview.src = URL.createObjectURL(img.files[0])

 });

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

 document.addEventListener('DOMContentLoaded', function () {
     const selects = document.querySelectorAll('[id^=product_id]');
     selects.forEach(function (select) {
         const getValue = select.getAttribute('show-value');

         showSelected(select, getValue);
     });
 });
 // showSelected(showProductId, getAttrProductId)

 $(document).ready(function () {
     $('#recordsPerPage').change(function () {
         $('#submit').click()
     })
 })


 // method delete 
 const exampleModal = document.getElementById('delete-work-modal')
 exampleModal.addEventListener('show.bs.modal', event => {
     var deleteForm = document.forms['delete-item-form']
     var btnDeleteitem = document.getElementById('btn-delete-item')
     const button = event.relatedTarget
     //get id from button delete
     const recipient = button.getAttribute('data-id')

     btnDeleteitem.onclick = function () {
         deleteForm.action = '/shipment/' + recipient + '/delete/?_method=PUT'
         deleteForm.submit()
     }
 })

 //   creat template
 document.addEventListener('DOMContentLoaded', function () {
     const defaultValue = document.getElementById('button1').getAttribute('data');
     document.getElementById('selectedButtonValue').value = defaultValue;
     // Gán sự kiện cho mỗi nút
     document.getElementById('button1').addEventListener('click', function () {
         updateButtonsAdd(this);
         updateHiddenFieldAdd(this);
     });

     document.getElementById('button2').addEventListener('click', function () {
         updateButtonsAdd(this);
         updateHiddenFieldAdd(this);
     });

     document.getElementById('button3').addEventListener('click', function () {
         updateButtonsAdd(this);
         updateHiddenFieldAdd(this);
     });

     document.getElementById('button4').addEventListener('click', function () {
         updateButtonsAdd(this);
         updateHiddenFieldAdd(this);
     });
     document.getElementById('button5').addEventListener('click', function () {
         updateButtonsAdd(this);
         updateHiddenFieldAdd(this);
     });
 });

 function updateButtonsAdd(clickedButton) {
     // Lấy tất cả các nút trong danh sách
     const buttons = document.querySelectorAll('.horizontal-list button');


     // Đặt lại màu của tất cả các nút
     buttons.forEach(function (button) {
         button.classList.remove('blurred-image');
     });

     // Đặt màu cho nút được nhấp vào
     clickedButton.classList.add('blurred-image');
 }

 function updateHiddenFieldAdd(button) {
     const attribute = button.getAttribute('data');
     document.getElementById('selectedButtonValue').value = attribute;

 }

 // edit

 ///edit load background
 document.addEventListener('DOMContentLoaded', function () {
     const selects = document.querySelectorAll('[id^=getIdData_]');
     const IdImages = document.querySelectorAll('[id^=imagePreview_]')
     //  const InputIdImage = document.querySelectorAll('[id^=image_]')
     IdImages.forEach(function (IdImage) {
         const Id = IdImage.getAttribute('data');
         const InputIdImage = document.getElementById(`image_${Id}`)


         IdImage.addEventListener('click', function () {
             InputIdImage.click();
         });
         // change ảnh khi chọn
         InputIdImage.addEventListener('change', function () {
             IdImage.src = URL.createObjectURL(InputIdImage.files[0])

         });
     })
     selects.forEach(function (select) {
         const getValue = select.getAttribute('data');
         document.getElementById(`buttonEdit1${getValue}`).addEventListener('click', function () {

             updateButtons(this);
             updateHiddenField(this);
         });

         document.getElementById(`buttonEdit2${getValue}`).addEventListener('click', function () {
             updateButtons(this);
             updateHiddenField(this);
         });

         document.getElementById(`buttonEdit3${getValue}`).addEventListener('click', function () {
             updateButtons(this);
             updateHiddenField(this);
         });

         document.getElementById(`buttonEdit4${getValue}`).addEventListener('click', function () {
             updateButtons(this);
             updateHiddenField(this);
         });
         document.getElementById(`buttonEdit5${getValue}`).addEventListener('click', function () {
             updateButtons(this);
             updateHiddenField(this);
         });

     });
     // Gán sự kiện cho mỗi nút

 });

 function updateButtons(clickedButton) {
     // Lấy tất cả các nút trong danh sách
     const buttons = document.querySelectorAll('.horizontal-list-edit button');

     // Đặt lại màu của tất cả các nút
     buttons.forEach(function (button) {
         button.classList.remove('blurred-image');
     });

     // Đặt màu cho nút được nhấp vào
     clickedButton.classList.add('blurred-image');
 }

 function updateHiddenField(button) {
     const attribute = button.getAttribute('data');
     document.getElementById('selectedButtonValueEdit').value = attribute;

     console.log(attribute)
 }

 async function GenerateQR(Id, Name) {

     try {
         // Gửi danh sách các ID đã chọn qua Fetch
         const response = await fetch(`/shipment/${Id}/generatePdf`, {
             method: 'GET',
             headers: {
                 'Content-Type': 'application/json'
             },

         });
         const blob = await response.blob();
         // Create a link element to trigger the download
         const link = document.createElement('a');
         link.href = URL.createObjectURL(blob);
         link.download = `QR_${Name}.pdf`

         // Append the link to the document and trigger the click event
         document.body.appendChild(link);
         link.click();

         // Remove the link from the document
         document.body.removeChild(link);
     } catch (error) {
         // Xử lý lỗi nếu có
         console.error('Đã xảy ra lỗi:', error);
     }

 }