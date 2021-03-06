require('dotenv').config()
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const bookmarksRouter = require('./bookmarks-router')
const logger = require('./logger')

const app = express()

app.use(helmet())
app.use(cors())
app.use(function errorHandler(error, req, res, next) {
    let response
    if (NODE_ENV === 'production') {

        response = { error: { message: 'server error' } }
    } else {
        logger.error(error)
        response = { message: error.message, error }
    }
    res.status(500).json(response)
})

app.use(function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_TOKEN
    const authToken = req.get('Authorization')

    if (!authToken || authToken.split(' ')[1] !== apiToken) {
        return res.status(401).json({ error: 'Unauthorized request' })
    }
    // move to the next middleware
    next()
})

app.use(bookmarksRouter)




module.exports = app