const express = require('express')
const router = express.Router()
const SeasonController = require('../app/controllers/SeasonController')
const CheckoutController = require('../app/middlewares/checkout')
router.put('/:id/update', CheckoutController.checkoutAdmin, SeasonController.update)
router.get('/:tree/getSeasonWithTree', CheckoutController.checkout, SeasonController.getSeasonWithTree)
router.post('/creat', CheckoutController.checkoutAdmin, SeasonController.creat)
router.get('/store', CheckoutController.checkoutAdmin, SeasonController.index)
module.exports = router
