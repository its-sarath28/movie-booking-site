import express from "express";
const movieRouter = express.Router();

import { body } from "express-validator";

import {
  addMovieController,
  deleteMovieController,
  editMovieController,
  fetchAvailableDatesController,
  getAllMoviesController,
  getSingleMovieController,
} from "../controllers/movieController.js";
import { isLogged } from "../middlewares/isLogged.js";
import { isAdmin } from "../middlewares/isAdmin.js";

// Endpoint to fetch available dates
movieRouter.get("/available-dates", fetchAvailableDatesController);

movieRouter.get("/", getAllMoviesController);

movieRouter.post(
  "/add-movie",
  [
    body("name").notEmpty().withMessage("Name is required."),
    body("date").notEmpty().withMessage("Date is required."),
    body("photo").notEmpty().withMessage("Photo is required."),
    body("price")
      .notEmpty()
      .withMessage("Price is required.")
      .isNumeric()
      .withMessage("Price must be a number"),
    body("description").notEmpty().withMessage("Description is required."),
    body("show").custom((value, { req }) => {
      if (
        !req.body.firstShow &&
        !req.body.matineeShow &&
        !req.body.eveningShow &&
        !req.body.nightShow
      ) {
        throw new Error("Please select at least one show time.");
      }
      return true;
    }),
  ],
  isLogged,
  isAdmin,
  addMovieController
);

movieRouter.get("/:movieId", getSingleMovieController);

movieRouter.put(
  "/edit-movie/:movieId",
  [
    body("name").notEmpty().withMessage("Name is required."),
    body("price")
      .notEmpty()
      .withMessage("Price is required.")
      .isNumeric()
      .withMessage("Price must be a number"),
    body("description").notEmpty().withMessage("Description is required."),
    body("show").custom((value, { req }) => {
      if (
        !req.body.firstShow &&
        !req.body.matineeShow &&
        !req.body.eveningShow &&
        !req.body.nightShow
      ) {
        throw new Error("Please select at least one show time.");
      }
      return true;
    }),
  ],
  editMovieController
);

movieRouter.delete("/delete-movie/:movieId", deleteMovieController);

export default movieRouter;
