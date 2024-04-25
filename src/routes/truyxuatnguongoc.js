const express = require('express')
const router = express.Router()
const TruyXuatController = require('../app/controllers/TruyXuatController')
const CheckController = require('../app/middlewares/checkout')
const upload = require('../app/middlewares/uploadMilddle')




router.use('/tra-cuu', TruyXuatController.tracuu)

router.use('/home', TruyXuatController.index)

router.use('/quan-ly', CheckController.checkout, TruyXuatController.manager)

// edit
router.use('/:id/edit', CheckController.checkout, TruyXuatController.edit)
// update
router.post('/:id/update', CheckController.checkout, upload.single('image'), TruyXuatController.update)
// delete
router.post('/:id/delete', CheckController.checkout, TruyXuatController.delete)
// generate
router.post('/generatePdf', CheckController.checkout, TruyXuatController.generatePdf)
// creat
router.post('/creat', CheckController.checkout, upload.single('image'), TruyXuatController.create)

module.exports = router