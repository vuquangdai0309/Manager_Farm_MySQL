document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('generatePdfButton').addEventListener('click', async function () {
        // Lấy tất cả các ô checkbox đã chọn (trừ ô có ID là "checkbox-all")
        var checkedIds = Array.from(document.querySelectorAll('input[type="checkbox"]:not(#checkbox-all):checked')).map(function (checkbox) {
            return checkbox.value;
        });
        var idsString = checkedIds.join(',');

        try {
            // Gửi danh sách các ID đã chọn qua Fetch
            const response = await fetch('/input-material-tracking-log/generatePdf', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ids: idsString })
            });
            const blob = await response.blob();
            // Create a link element to trigger the download
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'Nhat_Ky_Nguyen_Lieu_Dau_Vao.pdf';

            // Append the link to the document and trigger the click event
            document.body.appendChild(link);
            link.click();

            // Remove the link from the document
            document.body.removeChild(link);
        } catch (error) {
            // Xử lý lỗi nếu có
            console.error('Đã xảy ra lỗi:', error);
        }
    });
});

