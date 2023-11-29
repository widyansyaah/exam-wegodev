const express = require('express')
const router = express.Router()
const Authentication = require('../middlewares/authentication')


const AuthController = require('../controllers/authcontroller')

router.post('/v1/auth/login', AuthController.login)
router.get('/v1/profile', Authentication.authentication, AuthController.profile)


module.exports = router