import dotenv from 'dotenv'
// Load .env variables
dotenv.config()

// Define environment variables
const PORT = process.env.PORT
const MONGODB_URI = process.env.NODE_ENV === 'test'
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI

export { PORT, MONGODB_URI }