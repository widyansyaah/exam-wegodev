const jwt = require('jsonwebtoken')
require('dotenv').config()

const env = process.env

const authentication = (req, res, next) => {
    const token = req.headers.authorization
    const decode = jwt.verify(token.split(' ')[1], env.SECRET_KEY, (err, decode) => {
        if (err) {
            throw new Error(err.message)
        }
    })
    next(null, decode)
}

module.exports = { authentication }