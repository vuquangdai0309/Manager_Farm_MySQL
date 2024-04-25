
const HomeRouter = require('./home')
const NhatKySanXuatRouter = require('./nhatkysanxuat')
const MapRouter = require('./map')
const UserRouter = require('./user')
const TulieuRouter = require('./tulieu')
const CategoryRouter = require('./category')
const NhatKyDauVaoRouter = require('./nhatkydauvao')
const NguyenVatLieuRouter = require('./nguyenvatlieu')
const TruyXuatNguonGoc = require('./truyxuatnguongoc')
function route(app) {
    app.use('/nhatkysanxuat', NhatKySanXuatRouter)
    app.use('/user', UserRouter)
    app.use('/map', MapRouter)
    app.use('/tulieu', TulieuRouter)
    app.use('/category', CategoryRouter)
    app.use('/nhatkydauvao', NhatKyDauVaoRouter)
    app.use('/nguyenvatlieu', NguyenVatLieuRouter)
    app.use('/truyxuatnguongoc', TruyXuatNguonGoc)
    app.use('/', HomeRouter)
  

}

module.exports = route;