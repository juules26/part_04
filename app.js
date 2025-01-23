import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import 'express-async-errors' // import before routes
import blogsRouter from './controllers/blogs.js'  // Importas las rutas
import { MONGODB_URI } from './utils/config.js'  // Importas el URI para la DB
import { info, error } from './utils/logger.js'
import usersRouter from './controllers/users.js'
import Blog from './models/blog.js'
import loginRouter from './controllers/login.js'
import { tokenExtractor, useExtractor, errorHandler, requestLogger } from './utils/middleware.js'

const app = express()

// Conexión a MongoDB
mongoose.connect(MONGODB_URI)
    .then(() => info('Connected to MongoDB'))
    .catch(err => error('Error connecting to MongoDB', err.message))

// Middleware
app.use(cors())  // Habilita CORS
app.use(express.json())  // Acepta JSON en las peticiones
app.use(tokenExtractor)
app.use(requestLogger)

// Rutas de blogs
app.use('/api/blogs', blogsRouter, useExtractor) 
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

// Use the error handler middleware after the routes
app.use(errorHandler)

app.get('/api/blogs', async (req, res) => {
    const blogs = await Blog.find({}); // Esto asegura que se consulta MongoDB cada vez
    res.json(blogs);
});

export default app
