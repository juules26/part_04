import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import blogsRouter from './controllers/blogs.js'  // Importas las rutas
import { MONGODB_URI } from './utils/config.js'  // Importas el URI para la DB
import { info, error } from './utils/logger.js'

const app = express()

// Conexión a MongoDB
mongoose.connect(MONGODB_URI)
    .then(() => info('Connected to MongoDB'))
    .catch(err => error('Error connecting to MongoDB', err.message))

// Middleware
app.use(cors())  // Habilita CORS
app.use(express.json())  // Acepta JSON en las peticiones

// Rutas de blogs
app.use('/api/blogs', blogsRouter)  // Aquí usas el router de blogs para manejar las rutas

export default app  // Exportas el app para poder usarlo en otros archivos si es necesario
