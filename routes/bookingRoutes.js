const express = require('express');
const {body} = require("express-validator");
const router = express.Router();
const bookingControllers = require('../controllers/bookingControllers');
const userRoles = require('../utils/userRoles');
const verifyToken = require('../middlewares/verifyToken');
const allowedTo = require('../middlewares/allowTo')

// Get All Bookings

router.route("/")
            .get(verifyToken, bookingControllers.getAllBookings)
            .post(verifyToken, bookingControllers.AddBooking);

// Create Booking

// Update Booking Status
router.route("/:id")
            .patch(verifyToken,allowedTo(userRoles.ADMIN),bookingControllers.updateBooking);

module.exports = router;



