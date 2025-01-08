import request from 'supertest'
import User from '../src/models/user.js'
import mongoose from 'mongoose'
import server from '../src/index.js'

const userOne = {
    name: 'Andrew',
    email: 'andrewmendes@live.com',
    password: '12345678@'
}

beforeEach(async () => {
    await User.deleteMany()
    await new User(userOne).save()
})

test('Should signup a new user', async () => {
    await request(server)
        .post('/users')
        .send({
            name: 'Victor Mendes',
            email: 'victormendes1993@live.com',
            password: '12345678@',
        })
        .expect(201)
})

test('Should login existing user', async () => {
    await request(server)
        .post('/users/login')
        .send({
            email: userOne.email,
            password: userOne.password
        }).expect(200)
})

test('Should not login nonexisting user', async () => {
    await request(server)
        .post('/users/login')
        .send({
            email: userOne.email,
            password: 'thisisnotmypassword'
        }).expect(400)
})

afterAll(async () => {
    await mongoose.disconnect()
    server.close()

})

