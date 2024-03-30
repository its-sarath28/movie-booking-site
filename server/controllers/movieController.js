import Movies from "../models/Movies.js";
import { appError } from "../utils/appError.js";

export const getAllMoviesController = async (req, res, next) => {
  try {
    const allMovies = await Movies.find({});

    res.status(200).json(allMovies);
  } catch (err) {
    console.log(err);
    next(appError(err.message));
  }
};

export const getSingleMovieController = async (req, res, next) => {
  const id = req.params.movieId;
  try {
    const movie = await Movies.findById(id);

    if (!movie) {
      return next(appError("Movie not found", 404));
    }

    res.status(200).json(movie);
  } catch (err) {
    console.log(err);
    next(appError(err.message));
  }
};

export const addMovieController = async (req, res, next) => {
  const {
    name,
    date,
    photo,
    price,
    description,
    firstShow,
    matineeShow,
    eveningShow,
    nightShow,
  } = req.body;

  console.log(req.body);
  try {
    const existingMovie = await Movies.findOne({ name });

    if (existingMovie) {
      return next(appError("Movie already exists"));
    }

    await Movies.create({
      name,
      date,
      photo,
      price,
      description,
      firstShow,
      matineeShow,
      eveningShow,
      nightShow,
      price,
    });

    res
      .status(200)
      .json({ success: true, message: "Movie added successfully" });
  } catch (err) {
    console.log(err);
    next(appError(err.message));
  }
};

export const editMovieController = async (req, res, next) => {
  const {
    name,
    date,
    photo,
    price,
    description,
    firstShow,
    matineeShow,
    eveningShow,
    nightShow,
  } = req.body;
  try {
    const movieToUpdate = await Movies.findById(req.params.movieId);

    if (!movieToUpdate) {
      return next(appError("No Movie found", 404));
    }

    await Movies.findByIdAndUpdate(
      req.params.movieId,
      {
        name,
        date,
        photo,
        price,
        description,
        firstShow,
        matineeShow,
        eveningShow,
        nightShow,
      },
      {
        new: true,
      }
    );

    res
      .status(200)
      .json({ success: true, message: "Movie updated successfully" });
  } catch (err) {
    console.log(err);
    next(appError(err.message));
  }
};

export const deleteMovieController = async (req, res, next) => {
  try {
    const movieToDelete = await Movies.findById(req.params.movieId);

    if (!movieToDelete) {
      return next(appError("No Movie found", 404));
    }

    await Movies.findByIdAndDelete(req.params.movieId);

    res
      .status(200)
      .json({ success: true, message: "Movie deleted successfully" });
  } catch (err) {
    console.log(err);
    next(appError(err.message));
  }
};

// Endpoint to fetch available dates
export const fetchAvailableDatesController = async (req, res, next) => {
  try {
    const dates = await Movies.find({}, { _id: 0, date: 1 });
    const arrayOfDates = dates.map((obj) => obj.date);

    // Remove duplicates from the array using Set
    const uniqueDates = [...new Set(arrayOfDates)];

    // Sort unique dates in ascending order
    uniqueDates.sort((a, b) => new Date(a) - new Date(b));

    res.status(200).json(uniqueDates);
  } catch (err) {
    console.log(err);
    next(appError(err.message));
  }
};
