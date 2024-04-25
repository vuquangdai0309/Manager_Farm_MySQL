const express = require('express')
const router = express.Router()
const HomeController = require('../app/controllers/HomeController')
const CheckController = require('../app/middlewares/checkout')

// thông báo lỗi 
router.use('/annouce',CheckController.checkout, HomeController.annouce)
// liên hệ
router.use('/contact',CheckController.checkout, HomeController.contact)
// 
router.use('/',CheckController.checkout, HomeController.index)

module.exports = router