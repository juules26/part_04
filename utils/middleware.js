import User from "../models/user.js"

// Middleware to log incoming req
const requestLogger = (req, res, next) => {
    console.log(`${req.method} ${req.path} - Body:`, req.body)
    next()
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

const verifyToken = (token) => {
    try {
        const decodedToken = jwt.verifyToken(token, process.env.SECRET)
        return User.findById(decodedToken.id)
    } catch (error) {
        return null
    }
}

const useExtractor = (req, res, next) => {
    const token = req.headers['authorization'] // get the authorization header from req
    if (token) {
        const user = verifyToken(token)
        req.user = user // attach user to req obj
    } else {
        req.user = null // no token no user
    }
    next()
}

export { requestLogger, unknownEndpoint, errorHandler, tokenExtractor, useExtractor }