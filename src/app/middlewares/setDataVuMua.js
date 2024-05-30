// const Season = require('../models/Season')

// const setCommonData = (req, res, next) => {
//     // Truy vấn dữ liệu chung nếu cần
//     Season.getAllSeasons((err, season) => {
//         if (err) {
//             console.log('lỗi truy vấn', err)
//         } else {
           
//             // Truyền dữ liệu cho tất cả các trang
//             res.locals = Object.assign(res.locals, {season});

//             // Tiếp tục xử lý middleware tiếp theo
//             next();
//         }
//     })

// };

// module.exports = setCommonData;
