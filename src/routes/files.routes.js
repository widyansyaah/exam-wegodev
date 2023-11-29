const express = require('express')
const router = express.Router()
const Authentication = require('../middlewares/authentication')


const { upload } = require('../middlewares/multer')
const UploadController = require('../controllers/filescontroller')

router.post('/upload',  upload.single('file'), UploadController.upload)

module.exports = router