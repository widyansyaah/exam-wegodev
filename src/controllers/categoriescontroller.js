const { Categories } = require('../../models')


//get all categories
const getAllCategories = async(req, res) => {
    try {
        const category = await Categories.findAll()
        res.status(200).json(category)
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
        res.status(201).json({ message: "Category Created"})
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

        res.status(201).json({ message: "Category Updated" });
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

        if (!category) {
            throw new Error('Categories not found');
        }

        res.status(200).json({ data: category });
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

        res.status(201).json({ message: "Category Deleted" });
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