const express = require('express')
const router = express.Router()
const middleware = require('../middleware/auth')

const {register,login , userinfo,getUsers} = require('../controllers/auth.controller')
router.post('/login',login)
router.post('/register',register)
router.get('/me',userinfo)
router.get('/users', getUsers);

module.exports = router;