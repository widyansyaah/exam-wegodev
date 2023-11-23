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
            // include: [
            //     {
            //         model: PostsCategories
            //     }
            // ],
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

        const validCategoryIds = await Categories.findAll({
            where: {
              id: categoryId,
            },
            attributes: ['id'],
          });
      
          const validCategoryIdsArray = validCategoryIds.map(category => category.id);
          const invalidCategoryIds = categoryId.filter(id => !validCategoryIdsArray.includes(id));

          if (invalidCategoryIds.length > 0) {

            await transaction.rollback();
            return res.status(400).json({ error: `Invalid category IDs: ${invalidCategoryIds.join(', ')}` });
          }

        for (const categoryIds of categoryId) {
            await PostsCategories.create({
                postId: post.id,
                categoryId: categoryIds,
            }, { transaction})
        }

        await transaction.commit()

        res.status(201).json({message : 'Post Created'})
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

        const validPostId = await Posts.findByPk(id)

        // pengecekan post id pada table posts
        if (!validPostId) {
            await transaction.rollback();
            return res.status(400).json({ message : `Invalid Post Id` });
        }

        // await Posts.update({ title, description, slug, status }, { where : { id:postId }, transaction})

        // pengecekan post id pada table post categories
        const postCategoriesCount = await PostsCategories.count({
            where: { postId },
        });
    
        if (postCategoriesCount === 0) {
            await transaction.rollback();
            return res.status(400).json({ message: `Data Error.` });
        }

        // const validCategoryIds = await PostsCategories.findAll({
        //     where: {
        //       postId,
        //       categoryId,
        //     },
        //     attributes: ['categoryId'],
        //   });
      
        // const validCategoryIdsArray = validCategoryIds.map(category => category.categoryId);
      
        // // Tentukan kategori yang perlu dihapus
        // const categoriesToRemove = validCategoryIdsArray.filter(id => !categoryId.includes(id));

        // // Hapus kategori yang tidak disertakan dalam permintaan API
        // if (categoriesToRemove.length > 0) {
        // await PostsCategories.destroy({
        //     where: {
        //     postId,
        //     categoryId: categoriesToRemove,
        //     },
        //     transaction,
        // });
        // }

        // // Pengecekan apakah categoryIds valid
        // const validCategoryIdsNew = await Categories.findAll({
        //     where: {
        //     id: categoryId,
        //     },
        //     attributes: ['id'],
        // });
    
        // const validCategoryIdsArrayNew = validCategoryIdsNew.map(category => category.id);
        // const invalidCategoryIds = categoryId.filter(id => !validCategoryIdsArrayNew.includes(id));
  
        // if (invalidCategoryIds.length > 0) {
        //     // Rollback transaksi jika ada ID kategori yang tidak valid
        //     await transaction.rollback();
        //     return res.status(400).json({ error: `Invalid category IDs: ${invalidCategoryIds.join(', ')}` });
        //   }

        // //------
        // const currentCategories = await PostsCategories.findAll({
        //     where: { postId },
        //     attributes: ['categoryId'],
        //   });

        //   const currentCategoryIds = currentCategories.map(category => category.categoryId);

        //   const categoriesToRemove = currentCategoryIds.filter(id => !categoryId.includes(id));
      
        //   if (categoriesToRemove.length > 0) {
        //     await PostsCategories.destroy({
        //       where: {
        //         postId,
        //         categoryId: categoriesToRemove,
        //       },
        //       transaction,
        //     });
        //   }
        
        // const validCategoryIds = await Categories.findAll({
        //     where: {
        //       id: categoryId,
        //     },
        //     attributes: ['id'],
        //   });
      
        //   const validCategoryIdsArray = validCategoryIds.map(category => category.id);
        //   const invalidCategoryIds = categoryId.filter(id => !validCategoryIdsArray.includes(id));

        //   if (invalidCategoryIds.length > 0) {

        //     await transaction.rollback();
        //     return res.status(400).json({ error: `Invalid category IDs: ${invalidCategoryIds.join(', ')}` });
        //   }

        // for (const categoryIds of categoryId) {
        //     await PostsCategories.create({
        //         postId: post.id,
        //         categoryId: categoryIds,
        //     }, { transaction})
        // }

        await transaction.commit()

        res.status(201).json({message : 'Post Created'})
        
    
        await Posts.update( { title, description, slug, status, categoryId}, { where: { id } })
        res.status(201).json('Post Updated')
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