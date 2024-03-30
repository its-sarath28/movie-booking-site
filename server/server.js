import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import { dbConnect } from "./config/dbConnect.js";

import { globalErrorHandler } from "./middlewares/globalErrorHandler.js";

import authRouter from "./routes/authRoute.js";
import movieRouter from "./routes/movieRoute.js";
import bookingRouter from "./routes/bookingRoute.js";

dotenv.config();
dbConnect();

const app = express();

//Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: true }));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/movies", movieRouter);
app.use("/api/v1/bookings", bookingRouter);

//Error handlers middleware
app.use(globalErrorHandler);

//404 Error
app.use("*", (req, res) => {
  res.status(404).json({
    message: `${req.originalUrl} - File not found`,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in port ${PORT}`);
});
