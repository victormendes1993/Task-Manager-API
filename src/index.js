import app from './app.js'

const port = process.env.PORT || 3000

const server = app.listen(port, () => {
    if (process.env.NODE_ENV !== 'test')
        console.log(`Server is running on port ${process.env.PORT || 3000}`)
})

const closeServer = () => {
    server.close()
}

export default closeServer