require ('dotenv').config();

const cors = require ('cors');

const express = require('express');
const path = require('path');

const app = express();

const mongoose = require ('mongoose');



const httpStatusText = require('./utils/httpStatusText');

const usersRouter = require('./routes/users.route');

const menuRouter = require('./routes/menu.items.routs');

const BookingRouter = require('./routes/bookingRoutes');


app.use('/uploads',express.static(path.join(__dirname,'uploads')));

console.log( process.env.MONGO_URL );   

const url = process.env.MONGO_URL;


mongoose.connect(url).then(()=>{

  console.log('mongodb Server started');

});

// CORS --> cross origin resource sharing 
app.use(cors());

// middleware to parse json request body
app.use(express.json());



//users route middleware
app.use('/api/v1/users' ,usersRouter );  //  /api/users 

app.use('/api/v1/menuItem' , menuRouter );  //  /api/users 

app.use('/api/v1/booking', BookingRouter );  //  /api/users 



// wildcard(default middleware or routing)
app.all('*', (req , res, next)=>{

  return res.status(404).json({status : httpStatusText.ERROR, message:'This Resource is not Available'});
});

//global error handler
app.use((error,req,res,next)=>{
  res.status( error.statusCode || 500).json({status :error.httpStatusText || httpStatusText.ERROR, message: error.message , code: error.statusCode || 500 , data : null });
} ); 

app.listen(process.env.PORT || 5001 , ()=>{
    console.log('Server is running');
});
