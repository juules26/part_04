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
const errorHandler = (err, req, res) => {
    console.error('ERROR:', err.message)

    if (err.name === 'ValidationError') {
        return res.status(404).send({ error: err.message })
    }

    res.status(500).send({ error: 'Internal Server Error' })
}

export { requestLogger, unknownEndpoint, errorHandler  }