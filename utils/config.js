import dotenv from 'dotenv'
// Load .env variables
dotenv.config()

// Define environment variables
const PORT = process.env.PORT || 3003
const MONGODB_URI = process.env.MONGODB_URI

export { PORT, MONGODB_URI }