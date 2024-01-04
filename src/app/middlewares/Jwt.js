'use strict'
const jwt = require('jsonwebtoken')
require('dotenv').config();
const JWT_SECRET = "VUNGTRONG"
function sign(email, expiresIn = "30m") {
    return jwt.sign({ email },
        'vungtrong' || JWT_SECRET,
        { expiresIn }
    )
}
function verify(token) {
    try {
        jwt.verify(token, 'vungtrong' || JWT_SECRET);
        return true
    } catch (error) {
        return false;
    }
}
module.exports  = { sign, verify }