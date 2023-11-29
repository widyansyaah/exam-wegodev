const { Users, Files } = require('../../models')
const bcrypt = require('bcrypt')
const buildResponse = require('../modules/buildresponse')
const yup = require('yup')

// schema
const createUserSchema = yup.object().shape({
    fullName: yup.string().required('fullName is Required Field'),
    email: yup.string().email().required('email is Required Field'),
    newPassword: yup.string().required('newPassword is Required Field'),
    confirmNewPassword: yup.string().required('confirmNewPassword is Required Field'),
    status: yup.string().required('status is Required Field'),
    role: yup.string().required('role is Required Field'),
})

const updateUserSchema = yup.object().shape({
    fullName: yup.string().required('fullName is Required Field'),
    email: yup.string().email().required('email is Required Field'),
    status: yup.string().required('status is Required Field'),
    role: yup.string().required('role is Required Field'),
})

//get all users
const getAllUsers = async (req, res) => {
    try {
        let { page, pageSize, fullName } = req.query
        page = parseInt(page) || 1
        pageSize = parseInt(pageSize) || 10

        let where = {}
        if (fullName) {
            where = { fullName }
        }

        const user = await Users.findAll({
            include: [
                    {
                        model: Files,
                        as: 'avatarData'
                    }
                ],
            limit: pageSize,
            offset: (page - 1) * pageSize,
            where,
        })

        const count = await Users.count()
        let message = count + " data taken"
        const resp = buildResponse.get({ message, count, data: user})

        res.status(200).json(resp)

    } catch (error) {
        console.log('error', error)
        res.status(500).json({message : 'Internal Server Error'})
        
    }

}

//create user
const createUser = async (req, res) => {
    try {
        const body = req.body
        // if (newPassword !== confirmNewPassword || newPassword.length <= 4 || newPassword == "") {
        //     throw new Error('Password and confirmNewPassword Must Be Same')
        // } 

        createUserSchema.validate(body)
            .then(async(valid) => {
                const { fullName, email, newPassword, confirmNewPassword, status, role} = valid

                const saltRounds = 10
                const hashPassword = bcrypt.hashSync(newPassword,saltRounds)
        
                await Users.create({ fullName, email, password: hashPassword, role, status })
                const user = await Users.findOne({ where : {email}})
                const resp = buildResponse.create({user})
        
                
                res.status(201).json(resp)
            } )
            .catch((error) => {
                res.status(400).json({ message : error.message})

            })

    } catch (error) {
        console.log(error)
        res.status(500).json({message : 'Internal Server Error'})
    }
}

//update user
const updateUser = async (req, res) => {
    try {
        const id = req.params.id;
        const body = req.body;
        const user = await Users.findByPk(id);
        const userPassword = user.password
        
        updateUserSchema.validate(body)
            .then(async(valid) => {
                console.log('valid', valid)
                const { fullName, email, newPassword, confirmNewPassword, status, avatar, role } = valid
                
                if (!user) {
                    throw new Error('User not found');
                } else {
                    if (newPassword === "" && confirmNewPassword === "") {
                        await Users.update({ fullName, email, status, avatar, role }, { where: { id } })
                    } else if (newPassword.length <= 4 || newPassword !== confirmNewPassword) {
                        if (newPassword.length <= 4) {
                            throw new Error('Password Length Must Be Longer Than 4 Character')
                        } else {
                            throw new Error('Password and confirmNewPassword Must Be Same')
                        }
                    } else {
                        const saltRounds = 10
                        const hashPassword = bcrypt.hashSync(newPassword,saltRounds)
                        
                        await Users.update({ fullName, email, password: hashPassword, status, avatar, role }, { where: { id } });
                    }
                    const updatedUser = await Users.findByPk(id)
                    const resp = buildResponse.update({updatedUser})
                    res.status(201).json(resp);
        
                }
            } )
            .catch((error) => {
                res.status(400).json({ message : error.message})

            })


    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal server error'});
    }
}

// get user by id 
const getUserById = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await Users.findByPk(id);

        const resp = buildResponse.get({user})
        res.status(200).json(resp);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}

// delete user
const deleteUser = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await Users.destroy({ where: { id } });

        if (!user) {
            throw new Error('User not found');
        }

        const resp = buildResponse.del()

        res.status(201).json(resp);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}



module.exports = {
    getAllUsers,
    createUser,
    updateUser,
    getUserById,
    deleteUser
}