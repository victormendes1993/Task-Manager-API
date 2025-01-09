import request from 'supertest'
import User from '../src/models/user.js'
import app from '../src/app.js'
import sgMail from '@sendgrid/mail';
import { userOne, setupDatabase, closeDatabase } from './fixtures/db.js';
import closeServer from '../src/index.js';

jest.mock('@sendgrid/mail')

beforeEach(async () => {
    await setupDatabase()
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
    const user = await User.findById(userOne._id)
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
    const user = await User.findById(userOne._id)
    expect(user).toBeNull()
})

test('Should not delete account for unauthenticated user', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})

test('Should upload avatar image', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/profile-pic.jpeg')
        .expect(200)
    const user = await User.findById(userOne._id)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should update valid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'Jess'
        })
        .expect(200)
    const user = await User.findById(userOne._id)
    expect(user.name).toBe('Jess')
})

test('Should not update invalid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            location: 'Philadelphia'
        })
        .expect(400)
})

test('Should not signup user with invalid name/email/password', async () => {
    await request(app)
        .post('/users')
        .send({
            name: 'Victor Mendes',
            email: 'victor@live',
            password: '12345678@',
        }).expect(400)
})

test('Should not update user if unauthenticated', async () => {
    await request(app)
        .patch('/users/me')
        .send({
            name: 'Jess'
        })
        .expect(401)
})

test('Should not update user with invalid name/email/password', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            email: 'victor@live',
        })
        .expect(400)
})

test('Should not delete user if unauthenticated', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})

afterAll(async () => {
    await closeDatabase()
    closeServer()
})

