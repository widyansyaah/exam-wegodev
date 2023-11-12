const express = require('express');

const app = express();
const port = 3000;

//midleware
app.use(express.json())

//import router
const userRouter = require('./src/routes/users.routes')
app.use('/api',userRouter)


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})