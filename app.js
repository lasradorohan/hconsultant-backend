//import packages
const express = require('express')
const morgan = require('morgan')
const authRoutes = require('./api/routes/authRoutes.js')

const app = express()

//import routes

//

app.use(morgan('dev'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use(authRoutes)

module.exports = app