import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";

import { fileURLToPath } from "url"; // Import fileURLToPath
import { dirname } from "path"; // Import dirname

import { dbConnect } from "./config/dbConnect.js";

import { globalErrorHandler } from "./middlewares/globalErrorHandler.js";

import authRouter from "./routes/authRoute.js";
import showRouter from "./routes/showRoute.js";
import bookingRouter from "./routes/bookingRoute.js";
import userRouter from "./routes/userRoute.js";
import movieRouter from "./routes/movieRoute.js";

dotenv.config();
dbConnect();

const __filename = fileURLToPath(import.meta.url); // Get the current file path
const __dirname = dirname(__filename); // Get the directory name

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//Middleware
app.use(express.static(path.join(__dirname, "/server/public")));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
// app.use(
//   cors({
//     origin: ["http://localhost:5173"],
//     methods: ["POST", "GET", "PUT", "DELETE"],
//     credentials: true,
//   })
// );

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/movies", movieRouter);
app.use("/api/v1/shows", showRouter);
app.use("/api/v1/bookings", bookingRouter);
app.use("/api/v1/users", userRouter);

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
