import express from "express";
const userRouter = express.Router();

import { isLogged } from "../middlewares/isLogged.js";
import {
  getMyBookingsController,
  getTicketDetails,
} from "../controllers/userController.js";

userRouter.get("/ticket-details/:bookingId", isLogged, getTicketDetails);
userRouter.get("/my-bookings", isLogged, getMyBookingsController);

export default userRouter;
