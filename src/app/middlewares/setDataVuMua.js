// const VuMua = require('../models/VuMua')

// const setCommonData = (req, res, next) => {
//     // Truy vấn dữ liệu chung nếu cần
//     VuMua.getAllVuMuas((err, vumua) => {
//         if (err) {
//             console.log('lỗi truy vấn', err)
//         } else {
           
//             // Truyền dữ liệu cho tất cả các trang
//             res.locals = Object.assign(res.locals, {vumua});

//             // Tiếp tục xử lý middleware tiếp theo
//             next();
//         }
//     })

// };

// module.exports = setCommonData;
