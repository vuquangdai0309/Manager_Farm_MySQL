
const HomeRouter = require('./home')
const NhatKySanXuatRouter = require('./nhatkysanxuat')
const MapRouter = require('./map')
const UserRouter = require('./user')
const TulieuRouter = require('./tulieu')
const CategoryRouter = require('./category')
const NhatKyDauVaoRouter = require('./nhatkydauvao')
const NguyenVatLieuRouter = require('./nguyenvatlieu')
const Product = require('./product')
const Tree = require('./tree')
const Season = require('./season')
const Shipment = require('./shipment')
function route(app) {
    app.use('/production-process-log', NhatKySanXuatRouter)
    app.use('/user', UserRouter)
    app.use('/map', MapRouter)
    app.use('/document', TulieuRouter)
    app.use('/category', CategoryRouter)
    app.use('/input-material-tracking-log', NhatKyDauVaoRouter)
    app.use('/materials', NguyenVatLieuRouter)
    app.use('/product', Product)
    app.use('/tree', Tree)
    app.use('/season', Season)
    app.use('/shipment', Shipment)
    app.use('/', HomeRouter)
}

module.exports = route;