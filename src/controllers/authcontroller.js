const { Users } = require('../../models')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
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
                const options = { expiresIn: '5m' }
                const accessToken = jwt.sign(payload, env.SECRET_KEY, options)
        
                const response = { accessToken, user }
                // const buildResponse = BuildResponse.created({ response })
        
                return res.status(201).json(response)
                
            }

            res.status(400).json({ message : 'Incorrect Password'})            
        }

    catch (error) {
        console.log('error', error)
        res.status(500).json({message : 'Internal Server Error'})
    }
}

module.exports = {
    login
}