import express from "express";

const bookingRouter = express.Router();

import {
  bookTicketController,
  validatePaymentController,
} from "../controllers/bookingController.js";
import { isLogged } from "../middlewares/isLogged.js";

bookingRouter.post("/book-ticket", isLogged, bookTicketController);
bookingRouter.post("/validate-payment", isLogged, validatePaymentController);

export default bookingRouter;
