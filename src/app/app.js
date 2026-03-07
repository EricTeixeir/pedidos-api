const express = require('express')
const setupSwagger = require('../config/swagger')
const app = express()

app.use(express.json())

setupSwagger(app)

module.exports = app