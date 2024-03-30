import crypto from "crypto";
import Razorpay from "razorpay";

import Booking from "../models/Booking.js";
import User from "../models/User.js";

import { appError } from "../utils/appError.js";

export const bookTicketController = async (req, res, next) => {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    if (!req.body) {
      return next(appError("Bad request", 400));
    }

    const options = req.body;

    const order = await razorpay.orders.create(options);

    if (!order) {
      return next(appError("Bad request", 400));
    }

    res.status(200).json(order);
  } catch (err) {
    next(appError(err.message));
    console.log(`Error while booking: ${err}`);
  }
};

export const validatePaymentController = async (req, res, next) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    movieId,
    numberOfTickets,
    showTime,
    showDate,
  } = req.body;

  console.log(req.body);

  try {
    const sha = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);

    //razorpay_order_id + " | " + razorpay_payment_id
    sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);

    const digest = sha.digest("hex");

    if (digest !== razorpay_signature) {
      return res.status(400).json({ message: "Transaction is not legit!" });
    } else {
      const newBooking = await Booking.create({
        movie: movieId,
        user: req.userAuth,
        numberOfTickets,
        showTime,
        showDate,
      });

      await newBooking.save();
    }

    res.status(200).json({
      message: "Booking confirmed",
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
    });
  } catch (err) {
    next(appError(err.message));
    console.log(`Error while validating: ${err}`);
  }
};
