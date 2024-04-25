const express = require('express')
const router = express.Router()
const LichController = require('../app/controllers/NhatKySanXuatController')
const CheckController = require('../app/middlewares/checkout')
router.get('/', CheckController.checkout, LichController.index)

// hiển thị ra lịch
router.get('/store', CheckController.checkout, LichController.store)

// edit nhật ký
router.get('/:id/edit', CheckController.checkout, LichController.edit)

// danh sách nhật ký sản xuất
router.get('/storeList', CheckController.checkout, LichController.list)

// xóa vĩnh viễn
router.delete('/:id/trash', CheckController.checkout, LichController.trashDelete)

// thùng rác
router.get('/trash', CheckController.checkout, LichController.trash)

// update
router.put('/:id', CheckController.checkout, LichController.update)

// xóa mềm
router.post('/:id/delete', CheckController.checkout, LichController.delete)

// tìm kiếm
router.get('/search', CheckController.checkout, LichController.search)

// lấy các bản ghi được checkbox
router.post('/handle-form-actions', CheckController.checkout, LichController.handleFormAction)

// lấy các bản ghi được checkbox trong thùng rác
router.post('/handle-form-actions-trash', CheckController.checkout, LichController.handleFormActionTrash)

//khôi phục bản ghi
router.post('/:id/restore', CheckController.checkout, LichController.restore)

//generate PDF
router.post('/generatePdf', CheckController.checkout, LichController.generatePdf)

//  thêm bản ghi
router.post('/', CheckController.checkout, LichController.addWork)

module.exports = router