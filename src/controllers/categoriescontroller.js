const { Categories } = require('../../models')
const buildResponse = require('../modules/buildresponse')

//get all categories
const getAllCategories = async(req, res) => {
    try {
        let { page, pageSize, title } = req.query
        page = parseInt(page) || 1
        pageSize = parseInt(pageSize) || 10
        
        let where = {}
        if (title) {
            where = { title }
        }
        
        const category = await Categories.findAll({
            limit: pageSize,
            offset: (page - 1) * pageSize,
            where,
        })
        const total = await Categories.count()

        const resp = buildResponse.get({category, total})
        res.status(200).json(resp)
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" })
        
    }
}


//create category
const createCategory = async(req, res) => {
    try {
        const body = req.body
        const { title } = body

        await Categories.create({ title })

        const categories = await Categories.findOne({ where : {title}})
        const resp = buildResponse.create({categories})
        
        res.status(201).json(resp)
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error"})
        
    }
}


//update category
const updateCategory = async (req, res) => {
    try {
        const id = req.params.id;
        const body = req.body;
        const { title } = body;
        const category = await Categories.findByPk(id);

        if (!category) {
            throw new Error('Category not found');
        }

        await Categories.update({ title }, { where: { id } });
        const updatedCategory = await Categories.findByPk(id)

        const resp = buildResponse.update({updatedCategory})
        res.status(201).json(resp);
    } catch (error) {
        console.log('error', error)
        res.status(500).json({ message: 'Internal server error' });
    }
}

// get category by id 
const getCategoryById = async (req, res) => {
    try {
        const id = req.params.id;
        const category = await Categories.findByPk(id);
        const resp = buildResponse.get({category})
        res.status(200).json(resp);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}

// delete category
const deleteCategory = async (req, res) => {
    try {
        const id = req.params.id;
        const category = await Categories.destroy({ where: { id } });

        if (!category) {
            throw new Error('Category not found');
        }

        const resp = buildResponse.del()

        res.status(201).json(resp);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}


module.exports = {
    getAllCategories,
    createCategory,
    updateCategory,
    getCategoryById,
    deleteCategory
}