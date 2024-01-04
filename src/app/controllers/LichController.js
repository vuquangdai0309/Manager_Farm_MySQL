const Works = require('../models/Works')
var jwt = require('jsonwebtoken');
const CanhDong = require('../models/CanhDong');

class LichController {
    index(req, res) {
        let token = req.cookies.tkvungtrong
        let par = jwt.verify(token, 'mk')
        Works.getAllWorksWithId(par._id, (err, works) => {
            if (err) {
                console.log('lỗi truy vấn', err)
                return
            }
            CanhDong.getAllCanhDongWithId(par._id, (err, canhdong) => {
                if (err) {
                    console.log('lỗi truy vấn', err)
                    return
                }
                else {
                    res.render('calendar/calendar', { works, canhdong })
                }
            })
        })
    }
    list(req, res, next) {
        //   res.render('lich')
        let token = req.cookies.tkvungtrong
        let par = jwt.verify(token, 'mk')
        Works.getAllWorksWithId(par._id, (err, works) => {
            if (err) {
                console.log('lỗi truy vấn', err)
                return
            }
            else {
                res.render('calendar/listCalendars', { works })
            }
        })

    }
    store(req, res) {
        let token = req.cookies.tkvungtrong
        let par = jwt.verify(token, 'mk')

        Works.getAllWorksWithId(par._id, (err, works) => {
            if (err) {
                console.log('lỗi truy vấn', err)
                return
            }
            else {
                res.json({ works })
            }
        })

    }
    //Add calendar 
    addWork(req, res, next) {

        let token = req.cookies.tkvungtrong
        let par = jwt.verify(token, 'mk')
        const forms = {
            title: req.body.title,
            start: req.body.start,
            end: req.body.end,
            id_user: par._id,
            canhdong_id: req.body.canhdong_id
        }
        Works.addWork(forms, (err) => {
            if (err) {
                console.log('lỗi truy vấn', err)
            }
            else {
                res.redirect('back')
            }
        })

    }
    //Delete calendar/:id
    delete(req, res, next) {
        const Id_work = req.params.id
        Works.deleteWork(Id_work, (err, results) => {
            if (err) {
                console.log('lỗi truy vấn', err)
            }
            else {
                res.redirect('back')
            }
        })
    }
    // [GET] Edit calendar/:id
    edit(req, res, next) {
        let token = req.cookies.tkvungtrong
        let par = jwt.verify(token, 'mk')
        const Id_work = req.params.id
        Works.getWorkById(Id_work, (err, works) => {
            if (err) {
                console.log('lỗi truy vấn', err)
            }
            CanhDong.getAllCanhDongWithId(par._id, (err, canhdong) => {
                if (err) {
                    console.log('lỗi truy vấn', err)
                    return
                }
                else {
                    //  res.render('calendar/calendar', { works, canhdong })
                    res.render('calendar/edit', { works: works[0], canhdong })
                }
            })

        })
    }
    //[PUT] UPDATE calendar/:id
    update(req, res, next) {
        const Id_work = req.params.id
        const forms = {
            title: req.body.title,
            start: req.body.start,
            end: req.body.end,
            canhdong_id: req.body.canhdong_id

        }
        Works.updateWork(Id_work, forms, (err, results) => {
            if (err) {
                console.log('lỗi truy vấn', err)
            }
            else {
                res.redirect('/lich/listCalendars')
            }
        })

    }
    //[POST] search 
    search(req, res, next) {
        var title = req.query.q
        Works.searchWorkByName(title, (err, works) => {
            if (err) {
                console.log('lỗi truy vấn', err)
            }
            else {
                res.render('calendar/listCalendars', { works })
            }
        })

    }
    //showModel
    showModel(req, res, next) {
    }

}
module.exports = new LichController