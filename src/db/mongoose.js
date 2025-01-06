import mongoose from 'mongoose'

async function main() {

    try {
        await mongoose.connect(process.env.MONGODB_URL)
    } catch (err) {
        console.log(err.message)
    }
}

main()

export default mongoose