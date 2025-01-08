import express from 'express'
import userRouter from './routers/user.js'
import taskRouter from './routers/task.js'
import jwt from 'jsonwebtoken'
import mongoose from './db/mongoose.js'
import Task from './models/task.js'
import User from './models/user.js'

const app = express()

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

export default app