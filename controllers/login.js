import jwt from 'jsonwebtoken'
import express from 'express'
import bcrypt from 'bcrypt'
import User from '../models/user.js'

const loginRouter = express.Router()

loginRouter.post('/', async (req, res) => {
    const { username, password } = req.body

    const user = await User.findOne({ username })
    console.log(user)
    if (!user) {
        return res.status(401).json({
            error: 'invalid username' })
    }
    console.log('user password hash', user.passwordHash)
    const passwordCorrect = await bcrypt.compare(password, user.passwordHash)
    if (!passwordCorrect) {
        return res.status(401).json({
            error: 'invalid password'
        })
    }
    const userForToken = {
        username: user.username,
        id: user._id
    }
    const token = jwt.sign(userForToken, process.env.SECRET)
    console.log('Generated token:', token)
    res.status(200).send({
        token, username: user.username, name: user.name
    })
})

export default loginRouter