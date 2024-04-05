import { promisify } from "util";
import fs from "fs";
import puppeteer from "puppeteer";
import ejs from "ejs";
import QRCode from "qrcode";

import Booking from "../models/Booking.js";
import { appError } from "../utils/appError.js";

const readFileAsync = promisify(fs.readFile);

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

export const generateTicketPDFController = async (req, res) => {
  try {
    const bookingId = req.params.bookingId;

    const booking = await Booking.findById(bookingId).populate("movie", "name");

    const template = await readFileAsync("../server/views/Ticket.ejs", "utf8");

    // Generate QR code
    const QR_DATA = `Movie name: ${booking.movie.name} \n Show Date: ${booking.showDate} \n Show Time: ${booking.showTime} \n Number of Tickets: ${booking.numberOfTickets} \n Booking Id: ${booking._id}`;
    const options = { format: "png", width: 150 };

    const qrCode = await QRCode.toDataURL(QR_DATA, options);

    const html = ejs.render(template, { booking, qrCode });

    const browser = await puppeteer.launch({ headless: "new" });

    const page = await browser.newPage();

    await page.setContent(html);

    const pdfBuffer = await page.pdf();

    await browser.close();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="ticket.pdf"`);

    res.status(200).send(pdfBuffer);
  } catch (err) {
    console.error("Error while creating pdf:", err);
    res.status(500).json("Internal Server Error");
  }
};
