import mongoose from 'mongoose'

async function connectToMongoose() {

    try {
        await mongoose.connect(process.env.MONGODB_URL)
        if (process.env.NODE_ENV !== 'test')
            console.log('Connected to MongoDB')
    } catch (err) {
        if (process.env.NODE_ENV !== 'test')
            console.error('Failed to connect to MongoDB:', err.message)
    }
}

export default connectToMongoose