const express = require('express')
const router = express.Router()
const CategoryController = require('../app/controllers/CategoryController')
const CheckController = require('../app/middlewares/checkout')
// render ra bảng tư liệu
router.post('/store/creat', CheckController.checkoutAdmin, CategoryController.creat)
// render ra bảng tư liệu
router.use('/store', CheckController.checkoutAdmin, CategoryController.storeCategory)

//update
router.put('/:slug', CheckController.checkoutAdmin, CategoryController.update)
// delete
router.post('/:id/delete', CheckController.checkoutAdmin, CategoryController.delete)

module.exports = router