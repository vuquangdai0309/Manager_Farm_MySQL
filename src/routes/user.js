const express = require('express')
const router = express.Router()
const UserController = require('../app/controllers/UserController')
const CheckController = require('../app/middlewares/checkout')
//render login
router.get('/login', UserController.index)

//render register
router.get('/register', CheckController.checkoutManager, UserController.renderRegister)

// post register
router.post('/register', CheckController.checkoutManager, UserController.register)

//post login
router.post('/', UserController.login, (req, res) => {
    res.redirect('/')
})

// render form change passwword
router.get('/changepass', CheckController.checkout, UserController.renderchangepass)
// change password
router.post('/changepass', CheckController.checkout, UserController.changepass)

// render form forgetpass
router.get('/forgot', UserController.showforgot)


// check email 
router.post('/forgot', UserController.forgot)

// form resetpass
router.get('/reset', UserController.showReset)

// post reset pass

router.post('/reset', UserController.resetPass)

//log out
router.get('/logout', (req, res) => {
    res.clearCookie('tkvungtrong')
    res.redirect('/user/login')
})
//delete
router.post('/:id/delete', CheckController.checkoutManager, UserController.delete)

//get all user 
router.get('/', CheckController.checkoutManager, UserController.getAllUser)
module.exports = router