import express from 'express'
import jwt from 'jsonwebtoken'
import mongoose from './db/mongoose.js'
import userRouter from './routers/user.js'
import taskRouter from './routers/task.js'
import Task from './models/task.js'
import User from './models/user.js'

const app = express()

const port = process.env.PORT || 3000

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
