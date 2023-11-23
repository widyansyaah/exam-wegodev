const express = require('express')
const router = express.Router()

const { upload } = require('../middlewares/multer')
const UploadController = require('../controllers/filescontroller')

router.post('/upload/:id', upload.single('file'), UploadController.upload)

module.exports = router