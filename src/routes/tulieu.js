const express = require('express')
const router = express.Router()
const TuLieuController = require('../app/controllers/TuLieuController')
const CheckController = require('../app/middlewares/checkout')
const upload = require('../app/middlewares/uploadMilddle')
//xem chi tiết tin tức
router.get('/:slug/detail/client', CheckController.checkout, TuLieuController.detailClient)
//xem chi tiết content
router.get('/:id/detail', CheckController.checkoutAdmin, TuLieuController.detail)
// render ra bảng tư liệu
router.post('/store/creat', CheckController.checkoutAdmin, upload.single('image'), TuLieuController.creat)
// render ra bảng tư liệu
router.use('/store', CheckController.checkoutAdmin, TuLieuController.renderTuLieu)

//xóa 
router.delete('/:id', CheckController.checkoutAdmin, TuLieuController.delete)
//form edit
router.get('/:id/edit', CheckController.checkoutAdmin, TuLieuController.edit)
// // //update
router.put('/:id', CheckController.checkoutAdmin, upload.single('image'), TuLieuController.update)

// router.use('/search', CheckController.checkout, TuLieuController.search)
// hiển thị ra giao diện người dùng
router.use('/', CheckController.checkout, TuLieuController.index)

module.exports = router