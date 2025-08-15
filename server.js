const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const mongoose = require('mongoose')
dotenv.config({
  path: 'config.env'
})


// connect with db
mongoose.connect(process.env.DB_URI).then((conn)=>{
  console.log(`Database Connected: ${conn.connection.host}`)
}).catch((err)=>{
  console.error(`Database Error: ${err}`);
  process.exit();
});

// Express App 
const app = express();

// Middlewares 
if(process.env.NODE_ENV == 'development'){
  app.use(morgan('dev'));
  console.log(`mode: ${process.env.NODE_ENV}`)
}
app.use(express.json());

// 1- Create Schema
const CategorySchema  = new mongoose.Schema({
name : String,
});

// 2- Create Model
const CategoryModel = mongoose.model("Category",CategorySchema);




// Routes
app.get('/' , (req,res)=>{
  res.send('Our API');
})

app.post('/' , (req,res)=>{
  const name = req.body.name;
  console.log(req.body);
  const newCategory = new CategoryModel({name});
  newCategory.save().then((doc)=>{
    res.json(doc);
  }).catch((err)=>{
    res.json(err);
  });
})


// Server 
const PORT = process.env.PORT || 8000;
app.listen(PORT , ()=>{
   console.log(`App running on port ${PORT}`)
})