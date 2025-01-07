import mongoose from 'mongoose'

async function main() {
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log('Connected to MongoDB')
    } catch (err) {
        console.error('Failed to connect to MongoDB:', err.message)
    }
}

main()

export default mongoose
