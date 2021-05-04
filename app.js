//import packages
const express = require('express')
const morgan = require('morgan')

const app = express()

//import routes

//

app.use(morgan('dev'))
app.use(express.urlencoded({extended: false}))
app.use(express.json())