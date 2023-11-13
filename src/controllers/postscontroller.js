const { Posts, Categories } = require('../../models')

//get all posts
const getAllPosts = async (req, res) => {
    try {
        const post = await Posts.findAll({
            include: [
                {
                    model: Categories
                }
            ]
    })
        res.status(200).json(post)
    } catch (error) {
        console.log(error)
        res.status(500).json({message : 'Internal Server Error'})
        
    }
}

//create post
const createPost = async (req, res) => {
    try {
        const body = req.body
        const { title, description, categoryId } = body
        const slug = body.title.replace(/ /g, '-').toLowerCase()

        await Posts.create({ title, description, categoryId, slug })
        res.status(201).json({message : 'Post Created'})
    } catch (error) {
        console.log(error)
        res.status(500).json({message : 'Internal Server Error'})
    }
}

//get post by slug
const getPostBySlug = async (req, res) => {
    try {
        const slug = req.params.slug
    
        const postSlug = await Posts.findAll({ where: { slug } })
        res.status(200).json(postSlug)
        
    } catch (error) {
        res.status(500).json({ message : "Internal Server Error"})
    }

}

module.exports = {
    getAllPosts,
    createPost,
    getPostBySlug
}