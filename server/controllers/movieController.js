import { validationResult } from "express-validator";

import Movie from "../models/Movie.js";
import Show from "../models/Show.js";

import { appError } from "../utils/appError.js";

export const getAllMoviesController = async (req, res, next) => {
  try {
    const allMovies = await Movie.find({});

    res.status(200).json(allMovies);
  } catch (err) {
    console.log(err);
    next(appError(err.message));
  }
};

export const getAllMovieNamesController = async (req, res, next) => {
  try {
    const allMovieNames = await Movie.find({}).select("name");

    res.status(200).json(allMovieNames);
  } catch (error) {
    console.log(err);
    next(appError(err.message));
  }
};

export const getSingleMovieController = async (req, res, next) => {
  const movieId = req.params.movieId;
  try {
    const singleMovie = await Movie.findById(movieId);

    res.status(200).json(singleMovie);
  } catch (err) {
    console.log(err);
    next(appError(err.message));
  }
};

export const addMovieController = async (req, res, next) => {
  const { name, photo, imageURL, genere, price, description } = req.body;
  const errors = validationResult(req);

  let formattedErrors = {};
  if (!errors.isEmpty()) {
    errors.array().forEach((error) => {
      formattedErrors[error.path] = error.msg;
    });
    return res.status(500).json({ errors: formattedErrors });
  }

  try {
    await Movie.create({
      name,
      photo,
      imageURL,
      genere,
      price,
      description,
    });

    res
      .status(200)
      .json({ success: true, message: "Movie added successfully" });
  } catch (err) {
    next(appError(err.message));
  }
};

export const editMovieController = async (req, res, next) => {
  const { name, photo, imageURL, genere, price, description } = req.body;
  const errors = validationResult(req);

  let formattedErrors = {};
  if (!errors.isEmpty()) {
    errors.array().forEach((error) => {
      formattedErrors[error.path] = error.msg;
    });
    return res.status(500).json({ errors: formattedErrors });
  }

  try {
    const movieToUpdate = await Movie.findById(req.params.movieId);

    if (!movieToUpdate) {
      return next(appError("No Movie found", 404));
    }

    await Movie.findByIdAndUpdate(
      req.params.movieId,
      {
        name,
        photo,
        imageURL,
        genere,
        price,
        description,
      },
      {
        new: true,
      }
    );

    res
      .status(200)
      .json({ success: true, message: "Movie edited successfully" });
  } catch (err) {
    next(appError(err.message));
  }
};

export const deleteMovieController = async (req, res, next) => {
  try {
    const movieToDelete = await Movie.findById(req.params.movieId);

    if (!movieToDelete) {
      return next(appError("No Movie found", 404));
    }

    // Find all shows associated with the movie
    const showsToDelete = await Show.find({ movie: movieToDelete._id });

    // Delete all shows associated with the movie
    await Promise.all(
      showsToDelete.map(async (show) => {
        await Show.findByIdAndDelete(show._id);
      })
    );

    // Now, delete the movie
    await Movie.findByIdAndDelete(req.params.movieId);

    res
      .status(200)
      .json({ success: true, message: "Movie deleted successfully" });
  } catch (err) {
    console.log(err);
    next(appError(err.message));
  }
};

// Endpoint to fetch available dates
export const fetchAvailableMovieDatesController = async (req, res, next) => {
  try {
    const movieId = req.params.movieId;
    const dates = await Show.find(
      { movie: movieId },
      {
        _id: 0,
        date: 1,
      }
    );
    const arrayOfDates = dates.map((obj) => obj.date);

    // Remove duplicates from the array using Set
    const uniqueDates = [...new Set(arrayOfDates)];

    // Filter out dates older than today
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to midnight
    const filteredDates = uniqueDates.filter((date) => new Date(date) >= today);

    // Sort filtered dates in ascending order
    filteredDates.sort((a, b) => new Date(a) - new Date(b));

    //Get time
    const times = await Show.find(
      { movie: movieId },
      {
        _id: 0,
        date: 1,
        firstShow: 1,
        matineeShow: 1,
        eveningShow: 1,
        nightShow: 1,
      }
    );

    res.status(200).json({ dates: filteredDates, times });
  } catch (err) {
    console.log(err);
    next(appError(err.message));
  }
};

export const getAvailableTimesController = async (req, res, next) => {
  try {
    const { movieId, date } = req.params;

    // Find the show for the specified movie and date
    const show = await Show.findOne({ movie: movieId, date: date });

    if (!show) {
      return res.status(404).json({
        message: "No show available for the specified movie and date.",
      });
    }

    // Extract available times from the show document
    const availableTimes = {
      firstShow: show.firstShow,
      matineeShow: show.matineeShow,
      eveningShow: show.eveningShow,
      nightShow: show.nightShow,
      date,
    };

    res.status(200).json({ times: availableTimes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
