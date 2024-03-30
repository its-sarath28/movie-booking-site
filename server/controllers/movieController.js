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
      daySlots: date,
      photo,
      description,
      firstShow,
      matineeShow,
      eveningShow,
      nightShow,
      price: 120,
    });

    res
      .status(200)
      .json({ success: true, message: "Movie added successfully" });
  } catch (err) {
    console.log(err);
    next(appError(err.message));
  }
};

// export const addMovieController = async (req, res, next) => {
//   const { name, description, date, time, photo } = req.body;
//   try {
//     const existingMovie = await Movies.findOne({ name });

//     if (existingMovie) {
//       return next(appError("Movie already exists"));
//     }

//     await Movies.create({
//       name,
//       description,
//       photo,
//       daySlots: date,
//       timeSlots: time,
//       price: 120,
//     });

//     res
//       .status(200)
//       .json({ success: true, message: "Movie added successfully" });
//   } catch (err) {
//     console.log(err);
//     next(appError(err.message));
//   }
// };

export const editMovieController = async (req, res, next) => {
  const { name, description, daySlots, photo, timeSlots } = req.body;
  try {
    const movieToUpdate = await Movies.findById(req.params.movieId);

    if (!movieToUpdate) {
      return next(appError("No Movie found", 404));
    }

    await Movies.findByIdAndUpdate(
      req.params.movieId,
      {
        name,
        description,
        daySlots,
        photo,
        timeSlots,
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
