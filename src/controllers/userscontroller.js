const { Users } = require('../../models')
const bcrypt = require('bcrypt')

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
        let body = req.body
        const { fullName, email, password } = body 

        const saltRounds = 10
        const hashPassword = bcrypt.hashSync(password,saltRounds)

        await Users.create({ fullName, email, password: hashPassword })
        
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
        const { fullName, email, status } = body;
        const user = await Users.findByPk(id);

        if (!user) {
            throw new Error('User not found');
        }

        await Users.update({ fullName, email, status }, { where: { id } });

        res.status(201).json({ message: "User Updated" });
    } catch (error) {
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