const express = require('express')
const router = express.Router()
const NguyenLieuCayTrongController = require('../app/controllers/NguyenLieuCayTrongController')
const CheckController = require('../app/middlewares/checkout')


// 
router.get('/getData/:giongcay_id/:nguyenlieu_id/:map_id', CheckController.checkout, NguyenLieuCayTrongController.getData)
//
router.get('/getGiongCay/:giongcay_id', CheckController.checkout, NguyenLieuCayTrongController.getGiongCay)
module.exports = router