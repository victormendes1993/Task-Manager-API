import mongoose from "../../src/db/mongoose"
import jwt from 'jsonwebtoken'
import User from '../../src/models/user'

const userOneId = new mongoose.Types.ObjectId()

const userOne = {
    _id: userOneId,
    name: 'Andrew',
    email: 'andrewmendes@live.com',
    password: '12345678@',
    tokens: [{
        token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
    }]
}

const setupDatabase = async () => {
    await User.deleteMany()
    await new User(userOne).save()
}

const closeDatabase = async () => {
    await mongoose.disconnect()
}

export { userOne, userOneId, setupDatabase, closeDatabase }