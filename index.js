const express = require('express');
const path = require('path');
const swaggerJSDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

const app = express();
const port = 3000;

//midleware
app.use(express.json())


//config swagger
const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Api Documentation Exam-Wegodev',
      version: '0.0.1',
      description: 'Your API description here',
    },
  },
  apis: ['./src/routes/*.js'],
};


const swaggerSpec = swaggerJSDoc(options)

//import router
const userRouter = require('./src/routes/users.routes')
const categoryRouter = require('./src/routes/categories.routes')
const postRouter = require('./src/routes/posts.routes')
const authRouter = require('./src/routes/auth.routes')
const filesRouter = require('./src/routes/files.routes');


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec) )
app.use(express.static(path.join(__dirname, 'public/')))
app.use(userRouter)
app.use(categoryRouter)
app.use(postRouter)
app.use(authRouter)
app.use(filesRouter)





app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})