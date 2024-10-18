const mongoose = require('mongoose');

 const bookingStatus = require('../utils/bookingStatus');

const bookingSchema = new mongoose.Schema({
   
    user: {
        type: mongoose.Schema.Types.ObjectId,
         ref: 'User',
         required: true
    },
    tableNumber :{
        type: Number,
        required: true,
    },
    date :{
        type: Date,
    },
    time :{
        type: String,
    },
    numberOfPeople:{
        type: Number,
        required: true
    },
    status :{
        type: String,
        enum: [bookingStatus.CANCELLED, bookingStatus.CONFIRMED, bookingStatus.PENDING],
        default: bookingStatus.PENDING
    }
});

module.exports = mongoose.model('Booking', bookingSchema);