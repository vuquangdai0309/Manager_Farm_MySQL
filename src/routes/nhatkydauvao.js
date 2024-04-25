const express = require('express')
const router = express.Router()
const NhatKyDauVaoController = require('../app/controllers/NhatKyDauVaoController')
const CheckController = require('../app/middlewares/checkout')

// tạo bản ghi mới
router.post('/creat', CheckController.checkout, NhatKyDauVaoController.creat)

// edit bản ghi
router.get('/:id/edit', CheckController.checkout, NhatKyDauVaoController.edit)

//upload bản ghi
router.put('/:id', CheckController.checkout, NhatKyDauVaoController.update)

// xóa mềm bản ghi
router.post('/:id/delete', CheckController.checkout, NhatKyDauVaoController.delete)

router.delete('/:id/destroy', CheckController.checkout, NhatKyDauVaoController.destroy)

// trash
router.get('/trash', CheckController.checkout, NhatKyDauVaoController.trash)

//
router.post('/handle-form-actions', CheckController.checkout, NhatKyDauVaoController.handleformactions)

//
router.post('/handle-form-actions-trash', CheckController.checkout, NhatKyDauVaoController.handleformactionstrash)

router.post('/generatePdf', CheckController.checkout, NhatKyDauVaoController.generatePdf)

router.get('/', CheckController.checkout, NhatKyDauVaoController.index)
module.exports = router