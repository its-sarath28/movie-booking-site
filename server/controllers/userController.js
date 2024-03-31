import Booking from "../models/Booking.js";
import { appError } from "../utils/appError.js";

export const getTicketDetails = async (req, res, next) => {
  const bookingId = req.params.bookingId;

  try {
    if (!bookingId) {
      return next(appError("Please provide a ticket number", 404));
    }

    const bookingData = await Booking.findById(bookingId)
      .populate("user", "email")
      .populate("movie", "name date");

    if (!bookingData) {
      return next(appError("Invalid ticket", 404));
    }

    res.status(200).json(bookingData);
  } catch (err) {
    console.log(err);
    next(appError(err));
  }
};

export const getMyBookingsController = async (req, res, next) => {
  try {
    // Get user id from the request object
    const currentUser = req.userAuth;

    // Find all bookings for this user and populate them with movie data
    const myBookings = await Booking.find({ user: currentUser }).populate(
      "movie",
      "name"
    );

    // If no bookings found, send an empty array instead of null
    if (!myBookings || myBookings.length === 0) {
      return res
        .status(200)
        .json({ message: `You don't have any bookings`, data: [] });
    }

    res.status(200).json(myBookings);
  } catch (err) {
    console.log(err);
    next(appError(err));
  }
};
