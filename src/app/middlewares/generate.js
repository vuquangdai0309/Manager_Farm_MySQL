const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
let browserInstance;

async function createAndSendPdf(htmlContent, filename, res) {
    try {
        if (!browserInstance) {
            browserInstance = await puppeteer.launch(
                { args: ['--no-sandbox'] }
            );
        }

        const page = await browserInstance.newPage();

        // Set content and generate PDF
        await page.setContent(htmlContent);
        const pdfBuffer = await page.pdf({ format: 'A4', landscape: true });
        // Lưu file
        const pdfPath = path.join(__dirname, '..', '..', '..', 'uploads', 'pdf', filename);
        fs.writeFileSync(pdfPath, pdfBuffer);

        // Đóng trang hiện tại, giữ trình duyệt mở
        await page.close();

        // Gửi PDF như một phản hồi
        res.contentType('application/pdf');
        res.send(pdfBuffer);

    } catch (error) {
        console.error('Error during PDF creation and sending:', error);
        res.status(500).send('Internal Server Error');
    }
}

// Đóng trình duyệt khi quá trình kết thúc
process.on('exit', () => {
    if (browserInstance) {
        browserInstance.close();
    }
});
function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}
module.exports = { createAndSendPdf, generateRandomString }