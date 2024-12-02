console.log('blogs.js loaded')

// It allows interaction w/ 'blogs' collection in Mongo db
import Blog from '../models/blog.js'
// Import Express to create a new router for handling blog-related routes
import express from 'express'

// Create express router to define routes specific to 'blogs'
const router = express.Router()

// Route for getting all blogs
router.get('/', async (req, res) => { // Define GET route to fetch all blogs
    try {
        const blogs = await Blog.find({}) // Use Blog model to fetch all blog entries from db
        res.json(blogs) // Respond w/ list of blogs in JSON format
    } catch (error) {
        console.log(error) // Log any errors
        res.status(500).send({ error: 'Soomething went wrong' })
    }
})
// Route for adding a new blog
router.post('/', async (req, res) => { // Define POST route to add new blog
    try {
        const { title, author, url, likes } = req.body // Desestructure data from the req body (blog data)
        const newBlog = new Blog({ title, author, url, likes }) // Create new instance of the Blog model

        const savedBlog = await newBlog.save() // Save new blog to db and wait to complete
        res.status(201).json(savedBlog) // Respond with saved blog in JSON and status (created)
    } catch (error) {
        console.error(error) // Log errors to console
        res.status(500).send({ error: 'Failed to add blog' })
    }
})
// Route for deleting a blog
router.delete('/:id', async (req,res) => {
    console.log('DELETE /api/blogs', req.params.id)
    try {
        const blog = await Blog.findOneAndDelete(req.params.id)
        if (!blog) {
            return res.status(404).json({ error: 'Blog not found' })
        }
        res.status(200).json({ message: 'Blog deleted' })
    } catch (error) {
        console.log('Error deleting blog:', error)
        res.status(500).json({ error: 'Failed to delete blog' })
    }
})

export default router // Export router to be used in app.js (so it can be used in the main app)