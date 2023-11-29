const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: function (req, documen, cb) {
        cb(null, 'public/uploads/' )
    },
    filename(req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
    }
})

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpg|png/
    const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimeType = allowedTypes.test(file.mimetype)

    if (extName && mimeType) {
        return cb(null, true)
    }
    cb('Error : Format Must Be JPG or PNG')
}

const upload = multer({ 
    storage, 
    fileFilter, 
    limits: {
        fileSize: 1024 * 1024 * 2 
    }
})

module.exports = {
    upload
}