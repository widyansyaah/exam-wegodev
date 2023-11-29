const { Files, Users } = require('../../models')
const buildResponse = require('../modules/buildresponse')
const path = require('path');



const upload = async (req, res) => {
    try {
        const file = req.file
        const { filename, mimetype, path } = file 
        const url = 'http:\\' + req.get('host') + '\\' +path
        

        const result = await Files.create({ url: url, fileName: filename, type: mimetype, path })
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