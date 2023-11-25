const express = require('express')
const router= express.Router()
const Authentication = require('../middlewares/authentication')

const PostController = require('../controllers/postscontroller')

router.get('/v1/post', PostController.getAllPosts)
router.post('/v1/post', Authentication.authentication, PostController.createPost)
router.get('/v1/post/get-by-slug/:slug', PostController.getPostBySlug)
router.get('/v1/post/:id', PostController.getPostById)
router.put('/v1/post/:id', Authentication.authentication, PostController.updatePost)
router.delete('/v1/post/:id', Authentication.authentication, PostController.deletePost)





module.exports = router