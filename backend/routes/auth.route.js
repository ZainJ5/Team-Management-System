const express = require('express')
const router = express.Router()
const middleware = require('../middleware/auth')

const {register,login , userinfo} = require('../controllers/auth.controller')
router.post('/login',login)
router.post('/register',register)
router.get('/me',userinfo)

module.exports = router;