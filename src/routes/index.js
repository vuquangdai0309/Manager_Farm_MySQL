
const HomeRouter = require('./home')
const LichRouter = require('./lich')
const MapRouter = require('./map')
const UserRouter = require('./user')
const TulieuRouter = require('./tulieu')
const CanhdongRouter = require('./canhdong')
function route(app) {
    app.use('/lich', LichRouter)
    app.use('/user', UserRouter)
    app.use('/map', MapRouter)
    app.use('/tulieu', TulieuRouter)
    app.use('/canhdong', CanhdongRouter)
    app.use('/', HomeRouter)
}

module.exports = route;