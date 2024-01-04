const express = require('express')
const router = express.Router()
const CanhDongController = require('../app/controllers/CanhDongController')
const CheckController = require('../app/middlewares/checkout')

// thêm bản ghi
router.post('/store', CheckController.checkout, CanhDongController.store)
// xóa bản ghi
router.delete('/:id', CheckController.checkout, CanhDongController.delete)
// Edit
router.get('/:id/edit', CheckController.checkout, CanhDongController.edit)
//update
router.put('/:id', CheckController.checkout, CanhDongController.update)
// 
router.use('/', CheckController.checkout, CanhDongController.index)
module.exports = router