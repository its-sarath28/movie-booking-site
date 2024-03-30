import express from "express";
const movieRouter = express.Router();

import {
  addMovieController,
  deleteMovieController,
  editMovieController,
  getAllMoviesController,
  getSingleMovieController,
} from "../controllers/movieController.js";
import { isLogged } from "../middlewares/isLogged.js";
import { isAdmin } from "../middlewares/isAdmin.js";

movieRouter.get("/", getAllMoviesController);
movieRouter.post("/add-movie", isLogged, isAdmin, addMovieController);
movieRouter.get("/:movieId", isLogged, isAdmin, getSingleMovieController);
movieRouter.put("/edit-movie/:movieId", editMovieController);
movieRouter.delete("/delete-movie/:movieId", deleteMovieController);

export default movieRouter;
