const express = require('express')
const router = express.Router()
const LichController = require('../app/controllers/LichController')
const CheckController = require('../app/middlewares/checkout')
router.get('/', CheckController.checkout, LichController.index)
router.get('/store', CheckController.checkout, LichController.store)
router.get('/:id/edit', CheckController.checkout, LichController.edit)

router.get('/listCalendars', CheckController.checkout, LichController.list)
//update
router.put('/:id', CheckController.checkout, LichController.update)

//delete
router.delete('/:id', CheckController.checkout, LichController.delete)

// search
router.get('/search', CheckController.checkout, LichController.search)

router.post('/', CheckController.checkout, LichController.addWork)
module.exports = router