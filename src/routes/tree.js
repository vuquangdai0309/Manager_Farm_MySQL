const express = require('express')
const router = express.Router()
const TreeController = require('../app/controllers/TreeController')
const CheckController = require('../app/middlewares/checkout')
router.put('/:id/update', CheckController.checkoutAdmin, TreeController.update)
router.post('/creat', CheckController.checkoutAdmin, TreeController.creat)
router.get('/store', CheckController.checkoutAdmin, TreeController.index)
module.exports = router