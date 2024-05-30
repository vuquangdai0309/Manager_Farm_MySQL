const express = require('express')
const router = express.Router()
const upload = require('../app/middlewares/uploadMilddle')
const ShipmentController = require('../app/controllers/ShipmentController')
const CheckoutController = require('../app/middlewares/checkout')
router.post('/creat', CheckoutController.checkout, upload.single('logo'), ShipmentController.creatShipment)
router.put('/:id/update', CheckoutController.checkout, upload.single('logo'), ShipmentController.update)
router.put('/:id/delete', CheckoutController.checkout, ShipmentController.delete)
// generate
router.get('/:id/generatePdf', CheckoutController.checkout, ShipmentController.generatePdf)

router.get('/store', CheckoutController.checkout, ShipmentController.index)

router.get('/home', ShipmentController.home)
router.get('/search', ShipmentController.tracuu)
module.exports = router