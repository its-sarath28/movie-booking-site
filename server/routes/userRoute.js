import express from "express";
const userRouter = express.Router();

import { isLogged } from "../middlewares/isLogged.js";
import {
  generateTicketPDFController,
  getMyBookingsController,
  getTicketDetails,
} from "../controllers/userController.js";

userRouter.get("/ticket-details/:bookingId", isLogged, getTicketDetails);
userRouter.get("/my-bookings", isLogged, getMyBookingsController);

//Generate ticketPDF
userRouter.get(
  "/generate-ticket/:bookingId",
  isLogged,
  generateTicketPDFController
);

export default userRouter;
