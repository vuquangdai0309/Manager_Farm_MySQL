function getDataForTempalte(req, res, next) {
    res.locals.data = {
        done: res.locals.done
    }
    next()
}
module.exports = { getDataForTempalte }