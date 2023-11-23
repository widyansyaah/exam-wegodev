const express = require('express');

const app = express();
const port = 3000;

//midleware
app.use(express.json())

//import router
const userRouter = require('./src/routes/users.routes')
const categoryRouter = require('./src/routes/categories.routes')
const postRouter = require('./src/routes/posts.routes')
const authRouter = require('./src/routes/auth.routes')
const filesRouter = require('./src/routes/files.routes')



app.use('/api',userRouter)
app.use('/api',categoryRouter)
app.use('/api',postRouter)
app.use('/api',authRouter)
app.use('/api',filesRouter)





app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})