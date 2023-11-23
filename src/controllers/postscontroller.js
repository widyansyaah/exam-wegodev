const { Posts, PostsCategories, Categories, sequelize } = require('../../models')
const buildResponse = require('../modules/buildresponse')


//get all posts
const getAllPosts = async (req, res) => {
    try {

    let { page, pageSize, title } = req.query
        page = parseInt(page) || 1
        pageSize = parseInt(pageSize) || 10
        
        let where = {}
        if (title) {
            where = { title }
        }
        
        const post = await Posts.findAll({
            include: [
                {
                    model: PostsCategories,
                    as: 'categories',
                    include: 
                        {
                            model: Categories,
                            as: 'category'
                        }
                }
            ],
            limit: pageSize,
            offset: (page - 1) * pageSize,
            where,
        })
        const total = await Posts.count()

        const resp = buildResponse.get({post, total})

        res.status(200).json(resp)
    } catch (error) {
        console.log(error)
        res.status(500).json({message : 'Internal Server Error'})
        
    }
}

//create post
const createPost = async (req, res) => {
    const body = req.body
    const { title, description, categoryId } = body
    const slug = body.title.replace(/ /g, '-').toLowerCase()
    
    try {

        const transaction = await sequelize.transaction();

        const post = await Posts.create({ title, description, slug }, {transaction})

        // cek id category tsb eksis atau tidak & mengelompokannya
        const validCategoryIds = await Categories.findAll({ where: { id: categoryId } });
        const validCategoryIdsArray = validCategoryIds.map(category => category.id);

        const invalidCategoryIds = categoryId.filter(id => !validCategoryIdsArray.includes(id));

        // cek ada id category yang tidak eksis atau ga
        if (invalidCategoryIds.length > 0) {

          await transaction.rollback();
          return res.status(400).json({ error: `Invalid category Ids: ${invalidCategoryIds.join(', ')}` });
        }

        // looping for insert data
        for (const categoryIds of categoryId) {
            await PostsCategories.create({
                postId: post.id,
                categoryId: categoryIds,
            }, { transaction})
        }

        
        await transaction.commit()
        
        const finalPost = await Posts.findByPk(post.id, {
            include: [
                {
                    model: PostsCategories
                }
            ]
        })
        
        const resp = buildResponse.create({data :finalPost})


        res.status(201).json(resp)
    } catch (error) {
        console.log(error)
        await transaction.rollback();
        res.status(500).json({message : 'Internal Server Error'})
    }
}

//get post by slug
const getPostBySlug = async (req, res) => {
    try {
        const slug = req.params.slug
    
        const postSlug = await Posts.findAll({ where: { slug } })
        
        if (postSlug.length < 1) {
            res.status(200).json({ message : 'Data Not Found'})
        } else {
            res.status(200).json(postSlug)
        }
    } catch (error) {
        res.status(500).json({ message : "Internal Server Error"})
    }

}

//get post by id
const getPostById = async (req, res) => {
    try {
        const id = req.params.id
        const post = await Posts.findByPk(id)
    
        if (!post) {
            throw new Error('Post Not Found')
        }

        res.status(200).json({ data: post })
    } catch (error) {
        res.status(500).json({ message : "Internal Server Error"})
    }
}

//update post
const updatePost = async (req, res) => {
    const id = req.params.id
    const body = req.body
    const { title, description, status, categoryId } = body
    const slug = body.title.replace(/ /g, '-').toLowerCase()
    try {
        const transaction = await sequelize.transaction();
        
        // cek post id
        const validPostId = await Posts.findByPk(id)
        
        if (!validPostId) {
            await transaction.rollback();
            return res.status(400).json({ message : `Invalid Post Id` });
        }
        
        // delete postscategories relation
        await PostsCategories.destroy({ where: { postId: id }, transaction})

        // update database table post
        await Posts.update({ title, description, slug, status }, { where : { id }, transaction})
        console.log('id',id)

        // create database table postCategories
        // looping for insert data
        for (const categoryIds of categoryId) {
            await PostsCategories.create({
                postId: id,
                categoryId: categoryIds,
            }, { transaction})
        }

        await transaction.commit()

        res.status(200).json('Post Updated')
    } catch (error) {
        console.log(error)
        res.status(500).json('Internal Server Error')
    }
    

}

module.exports = {
    getAllPosts,
    createPost,
    getPostBySlug,
    getPostById,
    updatePost
}