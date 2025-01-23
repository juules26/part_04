import 'express-async-errors'
import Blog from '../models/blog.js'
import express from 'express'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { useExtractor } from '../utils/middleware.js'

dotenv.config()
const blogsRouter = express.Router()

blogsRouter.get('/', async (req, res) => {
    const blogs = await Blog.find({})
        .populate('user', { username: 1, name: 1 })
    res.json(blogs)
})

const getTokenFrom = (request) => {
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
        return authorization.replace('Bearer ', '')
    }
    return null
}

blogsRouter.post('/', useExtractor, async (req, res) => {
    console.log(req.token)
    const { title, url, author, likes = 0 } = req.body
    if (!title || !url) {
        return res.status(400).json({ error: 'Title or URL missing' })
    }

    const token = getTokenFrom(req)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!decodedToken.id) {
        return res.status(401).json({ error: 'Token invalid' })
    }

    const user = req.user
    if (!user) {
        return res.status(401).json({ error: 'User not authenticated' })
    }
    const newBlog = new Blog({
        title,
        user: user.id,
        author,
        url,
        likes,
    })

    const savedBlog = await newBlog.save()
    console.log('blog guardado', savedBlog)
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    res.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', useExtractor, async (req, res) => {
    const { id } = req.params

    const decodedToken = jwt.verify(req.token, process.env.SECRET)

    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ error: 'Invalid ID format' })
    }
    const blog = await Blog.findById(id)
    if (!blog) {
        return res.status(404).json({ error: 'Blog not found' })
    }
    const user = req.user
    if (!user) {
        return res.status(401).json({ error: 'User not authenticated' })
    }

    if (blog.user.toString() !== decodedToken.id) {
        return res.status(403).json({ error: 'Permission denied: you are not the blog creator' })
    }
    await Blog.findByIdAndDelete(id)
    res.status(204).end()
})

blogsRouter.put('/:id', async (req, res) => {
    const { likes } = req.body

    if (typeof likes !== 'number' || likes < 0) {
        return res.status(400).json({ error: 'Likes value must be a positive number' })
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
        req.params.id,
        { likes },
        { new: true, runValidators: true }
    )
    if (!updatedBlog) {
        return res.status(404).json({ error: 'Blog not found' })
    }
    res.json(updatedBlog)
})

export default blogsRouter
