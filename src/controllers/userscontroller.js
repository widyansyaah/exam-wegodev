const { Users } = require('../../models')
const bcrypt = require('bcrypt')

//get all users
const getAllUsers = async (req, res) => {
    try {
        const user = await Users.findAll()
        res.status(200).json(user)
        
    } catch (error) {
        res.status(500).json({message : 'Internal Server Error'})
        
    }

}

//create user
const createUser = async (req, res) => {
    try {
        const body = req.body
        const { fullName, email, newPassword, confirmNewPassword, role, status } = body 

        if (newPassword !== confirmNewPassword) {
            throw new Error('Password and confirmNewPassword Must Be Same')
        } 

        const saltRounds = 10
        const hashPassword = bcrypt.hashSync(newPassword,saltRounds)

        await Users.create({ fullName, email, password: hashPassword, role, status })
        
        res.status(201).json({message : 'User Created'})
    } catch (error) {
        res.status(500).json({message : 'Internal Server Error'})
    }
}

//update user
const updateUser = async (req, res) => {
    try {
        const id = req.params.id;
        const body = req.body;
        const { fullName, email, newPassword, confirmNewPassword, status, avatar, role } = body;
        const user = await Users.findByPk(id);
        const userPassword = user.password

        //compare
        const comparePassword = bcrypt.compareSync(newPassword, userPassword )
        

        if (!user) {
            throw new Error('User not found');
        } else {
            if (newPassword !== confirmNewPassword) {
                throw new Error('Password and confirmNewPassword Must Be Same')
            } else if (comparePassword === true ) {
    
                await Users.update({ fullName, email, status, avatar, role }, { where: { id } });
                res.status(201).json({ message: "User Updated" });
            } else {
                const saltRounds = 10
                const hashPassword = bcrypt.hashSync(newPassword,saltRounds)
                
                await Users.update({ fullName, email, password: hashPassword, status, avatar, role }, { where: { id } });
                res.status(201).json({ message: "User Updated" });
            }

        }
    } catch (error) {
        console.log('error', error)
        res.status(500).json({ message: 'Internal server error' });
    }
}

// get user by id 
const getUserById = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await Users.findByPk(id);

        if (!user) {
            throw new Error('User not found');
        }

        res.status(200).json({ data: user });
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

        res.status(201).json({ message: "User Deleted" });
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