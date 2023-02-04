const express = require('express')
const dotenv = require('dotenv').config()
const connectDB = require('./config/db')
require('colors')

const app = express()
const PORT = process.env.PORT || 6969

// connect to db
connectDB()

app.listen(PORT, (error) => {
   if (!error)
      console.log(
         'Server is Successfully Running, and App is listening on port ' + PORT
      )
   else console.log("Error occurred, server can't start", error)
})
