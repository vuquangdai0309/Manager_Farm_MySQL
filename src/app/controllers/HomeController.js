
const Works = require('../models/Works')
var jwt = require('jsonwebtoken');
class HomeController {
    index(req, res) {
        res.render('home');
    }
    contact(req, res) {
        res.render('contact/contact',)
    }
   
    
}
module.exports = new HomeController