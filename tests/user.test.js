import request from 'supertest'
import User from '../src/models/user.js'
import mongoose from 'mongoose'
import server from '../src/index.js'
import jwt from 'jsonwebtoken'
import app from '../src/app.js'
import sgMail from '@sendgrid/mail';

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

jest.mock('@sendgrid/mail', () => ({
    setApiKey: jest.fn(),
    send: jest.fn().mockResolvedValue({}), // Mock send to always resolve successfully
}));

beforeEach(async () => {
    await User.deleteMany()
    await new User(userOne).save()
})

test('Should signup a new user', async () => {
    const response = await request(app)
        .post('/users')
        .send({
            name: 'Victor Mendes',
            email: 'victormendes1993@live.com',
            password: '12345678@',
        }).expect(201)

    expect(sgMail.send).toHaveBeenCalled();
    expect(sgMail.send).toHaveBeenCalledWith(
        expect.objectContaining({
            to: 'victormendes1993@live.com',
        })
    )

    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    expect(response.body).toMatchObject({
        user: {
            name: 'Victor Mendes',
            email: 'victormendes1993@live.com',
        },
        token: user.tokens[0].token
    })

    expect(user.password).not.toBe('12345678@')
})

test('Should login existing user', async () => {
    const response = await request(app)
        .post('/users/login')
        .send({
            email: userOne.email,
            password: userOne.password
        })
        .expect(200)
    const user = await User.findById(userOneId)
    expect(response.body.token).toBe(user.tokens[1].token)
})

test('Should not login nonexisting user', async () => {
    await request(app)
        .post('/users/login')
        .send({
            email: userOne.email,
            password: 'thisisnotmypassword'
        }).expect(400)
})

test('Should get profile for user', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not get profile for unauthenticated user', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

test('Should delete account for user', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not delete account for unauthenticated user', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})

afterAll(async () => {
    await mongoose.disconnect()
    server.close()
})

