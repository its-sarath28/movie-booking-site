import Show from "../models/Show.js";
import { appError } from "../utils/appError.js";

import { validationResult } from "express-validator";

export const getSingleShowController = async (req, res, next) => {
  const id = req.params.showId;
  try {
    const show = await Show.findById(id).populate(
      "movie",
      "name photo imageURL description"
    );

    if (!show) {
      return next(appError("Show not found", 404));
    }

    res.status(200).json(show);
  } catch (err) {
    console.log(err);
    next(appError(err.message));
  }
};

export const getAllShows = async (req, res, next) => {
  try {
    const allShows = await Show.find({}).populate("movie", "name");

    res.status(200).json(allShows);
  } catch (err) {
    console.log(err);
    next(appError(err.message));
  }
};

export const addShowController = async (req, res, next) => {
  const { movie, date, firstShow, matineeShow, eveningShow, nightShow } =
    req.body;

  const errors = validationResult(req);

  let formattedErrors = {};
  if (!errors.isEmpty()) {
    errors.array().forEach((error) => {
      formattedErrors[error.path] = error.msg;
    });
    return res.status(500).json({ errors: formattedErrors });
  }

  try {
    // console.log(req.body);
    await Show.create({
      movie,
      date,
      firstShow,
      matineeShow,
      eveningShow,
      nightShow,
    });
    res.status(200).json({ success: true, message: "Show added successfully" });
  } catch (err) {
    console.log(err);
    next(appError(err.message));
  }
};

export const editShowController = async (req, res, next) => {
  const { movie, date, firstShow, matineeShow, eveningShow, nightShow } =
    req.body;

  const errors = validationResult(req);

  let formattedErrors = {};
  if (!errors.isEmpty()) {
    errors.array().forEach((error) => {
      formattedErrors[error.path] = error.msg;
    });
    return res.status(500).json({ errors: formattedErrors });
  }

  try {
    const showToUpdate = await Show.findById(req.params.showId);

    if (!showToUpdate) {
      return next(appError("No Show found", 404));
    }

    await Show.findByIdAndUpdate(
      req.params.showId,
      {
        movie,
        date,
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

export const deleteShowController = async (req, res, next) => {
  try {
    const showToDelete = await Show.findById(req.params.showId);

    if (!showToDelete) {
      return next(appError("No Movie found", 404));
    }

    await Show.findByIdAndDelete(req.params.showId);

    res
      .status(200)
      .json({ success: true, message: "Show deleted successfully" });
  } catch (err) {
    console.log(err);
    next(appError(err.message));
  }
};

// Endpoint to fetch available dates
export const fetchAvailableShowDatesController = async (req, res, next) => {
  try {
    const dates = await Movies.find({}, { _id: 0, date: 1 });
    const arrayOfDates = dates.map((obj) => obj.date);

    // Remove duplicates from the array using Set
    const uniqueDates = [...new Set(arrayOfDates)];

    // Filter out dates older than today
    const filteredDates = uniqueDates.filter(
      (date) => new Date(date) >= new Date()
    );

    // Sort filtered dates in ascending order
    filteredDates.sort((a, b) => new Date(a) - new Date(b));

    res.status(200).json(filteredDates);
  } catch (err) {
    console.log(err);
    next(appError(err.message));
  }
};
