//import packages
const express = require('express')
const morgan = require('morgan')
const authRoutes = require('./api/routes/authRoutes.js')
const consultationRoutes = require('./api/routes/consultationRoutes')
const chatRoutes = require('./api/routes/chatRoutes')
const miscRoutes = require('./api/routes/miscRoutes')
const app = express()

//import routes

//


app.use(morgan('dev'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use((req, res, next) => {
    console.log(req.headers)
    console.log(req.body)
    next()
})

app.use(authRoutes)
app.use('/consult', consultationRoutes)
app.use('/chat', chatRoutes)
app.use(miscRoutes)


module.exports = app