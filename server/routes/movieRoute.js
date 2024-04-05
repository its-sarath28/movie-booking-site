import express from "express";
const movieRouter = express.Router();

import {
  addMovieController,
  deleteMovieController,
  editMovieController,
  fetchAvailableMovieDatesController,
  getAllMovieNamesController,
  getAllMoviesController,
  getAvailableTimesController,
  getSingleMovieController,
} from "../controllers/movieController.js";
import { isLogged } from "../middlewares/isLogged.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import { body } from "express-validator";

// Endpoint to fetch available dates
movieRouter.get(
  "/available-dates/:movieId",
  fetchAvailableMovieDatesController
);

// Endpoint to fetch available times
movieRouter.get("/available-times/:movieId/:date", getAvailableTimesController);

movieRouter.get("/", getAllMoviesController);
movieRouter.get("/names", isLogged, isAdmin, getAllMovieNamesController);
movieRouter.get("/:movieId", getSingleMovieController);
movieRouter.post(
  "/add-movie",
  [
    body("name").notEmpty().withMessage("Please enter a movie name"),
    body("picture").custom((value, { req }) => {
      if (!req.body.photo && !req.body.imageURL) {
        throw new Error("Please provide a movie image.");
      }
      return true;
    }),
    body("genere")
      .notEmpty()
      .withMessage("Please enter a movie genere")
      .isAlpha()
      .withMessage("Genere can only contains alphabets"),
    body("price")
      .notEmpty()
      .withMessage("Price is required.")
      .isNumeric()
      .withMessage("Price must be a number"),
    body("description")
      .notEmpty()
      .withMessage("Please enter a movie description"),
  ],
  isLogged,
  isAdmin,
  addMovieController
);
movieRouter.put(
  "/edit-movie/:movieId",
  [
    body("name").notEmpty().withMessage("Please enter a movie name"),
    body("picture").custom((value, { req }) => {
      if (!req.body.photo && !req.body.imageURL) {
        throw new Error("Please provide a movie image.");
      }
      return true;
    }),
    body("price")
      .notEmpty()
      .withMessage("Price is required.")
      .isNumeric()
      .withMessage("Price must be a number"),
    body("description")
      .notEmpty()
      .withMessage("Please enter a movie description"),
  ],
  isLogged,
  isAdmin,
  editMovieController
);
movieRouter.delete(
  "/delete-movie/:movieId",
  isLogged,
  isAdmin,
  deleteMovieController
);

export default movieRouter;
