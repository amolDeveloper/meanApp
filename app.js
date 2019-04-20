const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const postsRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');

const app = express();

const dBURI = 'mongodb+srv://akay:Qn3rD1VAeMEliR3f@clusterzone-itc9m.mongodb.net/test?retryWrites=true';

const option = {
  socketTimeoutMS: 30000,
  keepAlive: true,
  reconnectTries: 30000,
  useNewUrlParser: true
};

mongoose.connect(dBURI, option);

mongoose.connection.on('connected', function () {
  console.log('Mongoose default connection open to ' + dBURI);
});

mongoose.connection.on('error',function (err) {
  console.log('Mongoose default connection error: ' + err);
});

mongoose.connection.on('disconnected', function () {
  console.log('Mongoose default connection disconnected');
});
  // mongodb+srv://amol:<password>@clusterzone-itc9m.mongodb.net/test?retryWrites=true
  //Qn3rD1VAeMEliR3f
  // mongodb+srv://akay:Qn3rD1VAeMEliR3f@clusterzone-itc9m.mongodb.net/test?retryWrites=true

app.use((req,res,next) => {
  res.setHeader("Access-Control-Allow-Origin","*");
  res.setHeader("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Methods","GET, POST, PATCH, OPTIONS, DELETE, PUT");
  next();
})

app.use(bodyParser.json());

app.use("/api/posts",postsRoutes);
app.use("/api/user",userRoutes);

module.exports =app;
