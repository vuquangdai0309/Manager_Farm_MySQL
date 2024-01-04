const express = require('express')
const router = express.Router()
const MapController = require('../app/controllers/MapController')
const CheckController = require('../app/middlewares/checkout')
router.get('/', CheckController.checkout, MapController.index)
//  create 
router.post('/store', CheckController.checkout, MapController.store)
// khu vực bạn chọn để hiển thị 
router.get('/setview', CheckController.checkout, MapController.setview)

router.post('/save-map-center', CheckController.checkout, MapController.savemapcenter)
// Edit
router.get('/:id/edit', CheckController.checkout, MapController.edit)
//delete
router.delete('/:id', CheckController.checkout, MapController.delete)

// //chi tiết khu vực vùng trồng
// router.get('/detail', MapController.detail)
// //load maps
router.get('/loadMap', CheckController.checkout, MapController.loadMap)
module.exports = router