const express = require('express')
const router= express.Router()

const PostController = require('../controllers/postscontroller')

router.get('/v1/post', PostController.getAllPosts)
router.post('/v1/post', PostController.createPost)
router.get('/v1/post/get-by-slug/:slug', PostController.getPostBySlug)
router.get('/v1/post/:id', PostController.getPostById)
router.put('/v1/post/:id', PostController.updatePost)
router.delete('/v1/post/:id', PostController.deletePost)





module.exports = router