import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import 'express-async-errors' 
import blogsRouter from './controllers/blogs.js'  
import { MONGODB_URI } from './utils/config.js'  
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

app.use('/api/blogs', blogsRouter, useExtractor) 
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

app.use(errorHandler)

if (process.env.NODE_ENV === 'test') {
  const testingRouter = await import('./controllers/testing.js')
  app.use('/api/testing', testingRouter.default)
}

app.get('/api/blogs', async (req, res) => {
    const blogs = await Blog.find({}); // Esto asegura que se consulta MongoDB cada vez
    res.json(blogs);
});

app.put('/api/blogs/:id', async (req, res) => {
    const { id } = req.params
    const { likes, ...updatedData } = req.body
  
    try {
      const blog = await Blog.findById(id)
      if (!blog) {
        return res.status(404).json({ error: 'Blog not found' })
      }
  
      blog.likes += 1 
  
      // Actualiza el resto de los campos (author, title, etc.)
      blog.set(updatedData)
  
      const savedBlog = await blog.save()
      res.json(savedBlog) 
    } catch (error) {
      res.status(500).json({ error: 'Something went wrong' })
    }
  })

  app.delete('/api/blogs/:id', useExtractor, async (req, res) => {
    const blog = await Blog.findById(req.params.id)
    if (!blog) {
      return res.status(404).json({ error: 'blog not found' })
    }
    if (!req.user || blog.user.toString() !== req.user.id) {
      return res.status(403).json({ error: 'you can only delete your own blogs' })
    }
    await Blog.findByIdAndRemove(req.params.id)
    res.status(204).end()
  })

export default app
