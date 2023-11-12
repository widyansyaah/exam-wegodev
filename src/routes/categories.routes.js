const express = require('express')
const router = express.Router()

const CategoriesController = require('../controllers/categoriescontroller')

router.get('/v1/category', CategoriesController.getAllCategories)
router.post('/v1/category', CategoriesController.createCategory)
router.put('/v1/category/:id', CategoriesController.updateCategory)
router.get('/v1/category/:id', CategoriesController.getCategoryById)
router.delete('/v1/category/:id', CategoriesController.deleteCategory)


module.exports = router