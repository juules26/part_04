// Funct to log general info
const info = (message) => {
    console.log(`INFO: ${message}`)
}

// Funct to log errors
const error = (message) => {
    console.error(`ERROR: ${message}`)
}

// Export logging functions
export { info, error }