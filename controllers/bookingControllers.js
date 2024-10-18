const {validationResult} = require("express-validator");
const Booking= require('../models/bookingModel.js');
const httpStatusText = require('../utils/httpStatusText.js');
const asyncWrapper = require ('../middlewares/asyncWrapper.js');
const appError = require('../utils/errorHandler.js')
const userRoles = require('../utils/userRoles');
const bookingStatus = require('../utils/bookingStatus');


// Get All Bookings 
const getAllBookings = asyncWrapper (async(req, res) => {
    // const query = req.query;
    // const limit = query.limit || 10;
    // const page = query.page || 1;
    // const skip = (page - 1) * limit;

    let bookings;
    if(req.user.role === userRoles.USER) {
     
       bookings = await Booking.find({ 
        user : req.user.id ,
         $or:[{status:bookingStatus.CANCELLED},{status:bookingStatus.CONFIRMED}] }
         ,{"__v" : false});
        //  .limit(limit).skip(skip);

      res.json({status: httpStatusText.SUCCESS , data : {bookings}});
      
    }else{
       bookings = await Booking.find({},{"__v" : false});
      // .limit(limit).skip(skip);
      res.json({status: httpStatusText.SUCCESS , data : {bookings}});
    }

  });

// Create Booking
const AddBooking = asyncWrapper(
    async(req, res ,next) => {
      
      
      // console.log('Request body:', req.body);  // Log the request body

      // console.log(req.user);  // Log the request body

      
      if (!req.user || !req.user.id) {
        return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }
       const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const error = appError.create(errors.array() ,400,httpStatusText.FAIL);
        return next(error);
      }
  

      const bookingData = { ...req.body , user: req.user.id };
      const booking = new Booking(bookingData);
  
      await booking.save();
  
      res.status(201).json({status : httpStatusText.SUCCESS, data: {booking : booking}});
    }
  );



  const updateBooking = asyncWrapper(async (req, res) => {
    console.log('Received update booking request');
    console.log('Request headers:', req.headers);
    
    if (!req.user) {
        console.error('Error: req.user is undefined');
        return res.status(401).json({ status: 'error', message: 'Unauthorized: User not found' });
    }

    console.log('Authenticated user:', req.user);

    if (!req.user.role) {
        console.error('Error: req.user.role is undefined');
        return res.status(401).json({ status: 'error', message: 'Unauthorized: User role not found' });
    }

    // Only allow admins to update booking status
    if (req.user.role !== userRoles.ADMIN) {
        return res.status(403).json({ status: 'error', message: 'Forbidden: Admins only' });
    }

    const { id } = req.params;
    const { status, tableNumber, date, time, numberOfPeople } = req.body;

    if (status && ![bookingStatus.CONFIRMED, bookingStatus.CANCELLED, bookingStatus.PENDING].includes(status)) {
        return res.status(400).json({ status: 'error', message: 'Invalid status' });
    }

    try {
        const booking = await Booking.findByIdAndUpdate(
            id,
            { $set: { status, tableNumber, date, time, numberOfPeople } },
            { new: true }
        );

        if (!booking) {
            return res.status(404).json({ status: 'error', message: 'This booking is not found' });
        }

        return res.status(200).json({ status: httpStatusText.SUCCESS, data: { booking } });
    } catch (error) {
        console.error('Error updating booking:', error);
        return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
});




  module.exports = {
    getAllBookings,
    AddBooking,
    updateBooking
  }