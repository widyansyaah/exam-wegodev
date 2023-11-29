const { Users } = require('../../models')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const buildResponse = require('../modules/buildresponse')

require('dotenv').config()

const env = process.env


const login = async (req, res) => {
    try {
        const { email, password } = req.body

        // get user
        const user = await Users.findOne({ where: { email }, raw: true })
        
        if (!user) {
            throw new Error('User Not Found')
        }
        
        //password check
        const userPassword = user.password
        const comparePassword = bcrypt.compareSync(password, userPassword)
        
            if (comparePassword === true ) {
                
                // generate token
                const payload = {
                    role: user.role,
                    id: user.id
                }
                const options = { expiresIn: '1h' }
                const accessToken = jwt.sign(payload, env.SECRET_KEY, options)
        
                const response = { 
                    accessToken,
                    expiresIn: options.expiresIn,
                    tokenType: 'Bearer',
                    user }
                
                const resp = buildResponse.login(response)
        
                return res.status(201).json(resp)
                
            }

            res.status(400).json({ message : 'Incorrect Password'})            
        }

    catch (error) {
        console.log('error', error)
        res.status(500).json({message : 'Internal Server Error'})
    }
}


const profile = async (req, res) => {
    try {
        const token = req.headers.authorization
        console.log('token', token)
        if (token === undefined) {
            throw new Error('Token Needed')
        }
        const decode = jwt.verify(token.split(' ')[1], env.SECRET_KEY, async (err, decode) => {
            if (err) {
                throw new Error(err.message)
            }
    
            const id = decode.id
            const data = await Users.findByPk(id)
            
            const resp = buildResponse.get({data})
            res.status(201).json(resp)
        })
        
    } catch (error) {
        res.status(500).json({message : 'Internal Server Error'})
        
    }
}

module.exports = {
    login,
    profile
}