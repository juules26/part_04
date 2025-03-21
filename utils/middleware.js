import User from "../models/user.js"
import jwt from "jsonwebtoken"

// Middleware to log incoming req
const requestLogger = (req, res, next) => {
    if (req.body.length > 0) {
        console.log(`${req.method} ${req.path} - Body:`, req.body)
    } next()
}

// Middleware to handle unknown endpoints
const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'Unknown endpoint' })
}

// Middleware for error handling
const errorHandler = (err, req, res, next) => {
    console.error('ERROR:', err.message)

    if (err.name === 'ValidationError') {
        return res.status(400).send({ error: err.message })
    }

    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ error: 'Token missing or invalid' })
    }

    if (err.name === 'TokenExpiredError' ) {
        return res.status(401).json({ error: 'Token expired' })
    }

    res.status(500).send({ error: 'Internal Server Error' })
}

const tokenExtractor = (req, res, next) => {
    const authorization = req.get('Authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
        req.token = authorization.replace('Bearer ', '')
    }
    next()
}

const verifyToken = async (token) => {
    try {
        const decodedToken = jwt.verify(token, process.env.SECRET)
        const user = await User.findById(decodedToken.id)
        return user
    } catch (error) {
        console.error('error en verifyToken:', error.message)
        return null
    }
}

const useExtractor = async (req, res, next) => {
    const authorization = req.get('Authorization')
    let token = null
    if (authorization && authorization.startsWith('Bearer ')) {
        token = authorization.replace('Bearer ', '')
    }
    if (token) {
        const user = await verifyToken(token)
        if (!user) {
            console.error('No se encontró usuario')
        }
        req.user = user
    } else {
        req.user = null 
        console.error('Token no encontrado o validado')
    }
    next()
}

export { requestLogger, unknownEndpoint, errorHandler, tokenExtractor, useExtractor }