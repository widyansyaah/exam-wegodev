const express = require('express')
const router = express.Router()
const Authentication = require('../middlewares/authentication')


const { upload } = require('../middlewares/multer')
const UploadController = require('../controllers/filescontroller')

router.post('/v1/upload', Authentication.authentication, upload.single('documen'), UploadController.upload)

module.exports = router