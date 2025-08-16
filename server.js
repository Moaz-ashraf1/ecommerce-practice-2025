const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const mongoose = require('mongoose')

dotenv.config({
  path: 'config.env'
})
const dbConnection = require("./config/database");
const categoryRoute = require('./routes/categoryRoute');

// connect with db
dbConnection();

// Express App 
const app = express();

// Middlewares 
if(process.env.NODE_ENV == 'development'){
  app.use(morgan('dev'));
  console.log(`mode: ${process.env.NODE_ENV}`)
}
app.use(express.json());


// Mount Routes
app.use("/api/v1/categories",categoryRoute)


// Server 
const PORT = process.env.PORT || 8000;
app.listen(PORT , ()=>{
   console.log(`App running on port ${PORT}`)
})