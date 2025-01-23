import 'express-async-errors'
import express from 'express'
import bcrypt from 'bcryptjs'
import User from '../models/user.js'

const usersRouter = express.Router()

usersRouter.post('/', async (request, response) => {
    const { username, name, password } = request.body

    if (!username || !name || !password) {
        return response.status(400).json({ error: 'Missing required fields' })
    }

    if (password.length < 3 || username.length < 3) {
        return response.status(400).json({ error: 'Username and password must be at least 3 characters long' })
    }
    const existingUser = await User.findOne({ username })
    if (existingUser) {
        return response.status(400).json({ error: 'Username already exists' })
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const user = new User({
        username,
        name,
        passwordHash,
    })

    const savedUser = await user.save()
    response.status(201).json(savedUser)
})

usersRouter.get('/', async (request, response) => {
    const users = await User.find({})
        .populate('blogs', { title: 1, url: 1, likes: 1 })
    response.json(users)
})

export default usersRouter
