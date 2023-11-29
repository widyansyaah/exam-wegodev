const express = require('express')
const router = express.Router()
const Authentication = require('../middlewares/authentication')


const UserController = require('../controllers/userscontroller')

router.get('/v1/user', Authentication.superAdminAuthentication, UserController.getAllUsers)
router.post('/v1/user', Authentication.superAdminAuthentication, UserController.createUser)
router.put('/v1/user/:id', Authentication.authentication, UserController.updateUser)
router.get('/v1/user/:id', Authentication.authentication, UserController.getUserById)
router.delete('/v1/user/:id', Authentication.superAdminAuthentication, UserController.deleteUser)

module.exports = router