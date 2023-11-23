const { Files, Users } = require('../../models')
const buildResponse = require('../modules/buildresponse')


const upload = async (req, res) => {
    try {
        const id = req.params.id
        const file = req.file
        const { filename, mimetype, path } = file 
        const url = req.header('host')
        const result = await Files.create({ url: url, fileName: filename, type: mimetype, path })
        const userId = await Users.findByPk(id)

        console.log(userId, 'userId')

        await Users.update({ avatar : result.id }, { where: {id}})

        // const file = await Files.
        const resp = buildResponse.create({result})

        
        res.status(201).json(resp)
    } catch (error) {
        console.log(error)
        res.status(500).json({message : 'Internal Server Error'})
    }
}

module.exports = {
    upload
}