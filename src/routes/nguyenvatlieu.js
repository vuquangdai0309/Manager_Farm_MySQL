const express = require('express')
const router = express.Router()
const NguyenLieuCayTrongController = require('../app/controllers/NguyenLieuCayTrongController')
const CheckController = require('../app/middlewares/checkout')

router.get('/store', CheckController.checkoutAdmin, NguyenLieuCayTrongController.store)
router.post('/creat', CheckController.checkoutAdmin, NguyenLieuCayTrongController.creat)

router.put('/:id/update', CheckController.checkoutAdmin, NguyenLieuCayTrongController.update)
// 
router.get('/getData/:tree_id/:nguyenlieu_id/:map_id', CheckController.checkout, NguyenLieuCayTrongController.getData)
//
router.get('/getTree/:tree_id', CheckController.checkout, NguyenLieuCayTrongController.getTree)
module.exports = router