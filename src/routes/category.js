const express = require('express')
const router = express.Router()
const CategoryController = require('../app/controllers/CategoryController')
const CheckController = require('../app/middlewares/checkout')
// render ra bảng tư liệu
router.post('/store/creat', CheckController.checkout, CategoryController.creat)
// render ra bảng tư liệu
router.use('/store', CheckController.checkoutManager, CategoryController.storeCategory)
//form edit
router.get('/:slug/edit', CheckController.checkout, CategoryController.edit)
//update
router.put('/:slug', CheckController.checkout, CategoryController.update)
// delete
router.post('/:id/delete', CheckController.checkout, CategoryController.delete)

module.exports = router