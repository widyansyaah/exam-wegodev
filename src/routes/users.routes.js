const express = require('express')
const router = express.Router()
const Authentication = require('../middlewares/authentication')


const UserController = require('../controllers/userscontroller')

router.get('/v1/user', Authentication.authentication, UserController.getAllUsers)
router.post('/v1/user', UserController.createUser)
router.put('/v1/user/:id', Authentication.authentication, UserController.updateUser)
router.get('/v1/user/:id', UserController.getUserById)
router.delete('/v1/user/:id', Authentication.authentication, UserController.deleteUser)

module.exports = router