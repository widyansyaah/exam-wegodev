const jwt = require('jsonwebtoken')
require('dotenv').config()

const env = process.env

const authentication = (req, res, next) => {
    const token = req.headers.authorization
    if (token === undefined) {
        throw new Error('Token Needed')
    }
    const decode = jwt.verify(token.split(' ')[1], env.SECRET_KEY, (err, decode) => {
        if (err) {
            throw new Error(err.message)
        }
    })
    next(null, decode)
}

const superAdminAuthentication = (req, res, next) => {
    const token = req.headers.authorization
    console.log('token', token)
    if (token === undefined) {
        throw new Error('Token Needed')
    }
    const decode = jwt.verify(token.split(' ')[1], env.SECRET_KEY, (err, decode) => {
        if (err) {
            throw new Error(err.message)
        } else if (decode.role !== 'Super Admin') {
            throw new Error('You are not Super Admin')
        }

    })
    next(null, decode)
}

module.exports = { 
    authentication,
    superAdminAuthentication 
}