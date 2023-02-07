const dotenv = require('dotenv').config()
const connectDB = require('./config/db')
require('colors')

const app = require('./app');

// connect to db
connectDB()

// Running the server
const PORT = process.env.PORT || 6969
const server = app.listen(PORT, (error) => {
   if (!error)
      console.log(
         'Badde Salemtak Server is Successfully Running, the server is listening on port: ' + PORT
      )
   else console.log("Error occurred, server can't start", error)
 });