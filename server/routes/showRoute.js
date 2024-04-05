import express from "express";
const showRouter = express.Router();

import { body } from "express-validator";

import {
  addShowController,
  deleteShowController,
  editShowController,
  getAllShows,
  getSingleShowController,
} from "../controllers/showController.js";
import { isLogged } from "../middlewares/isLogged.js";
import { isAdmin } from "../middlewares/isAdmin.js";

// // Endpoint to fetch available dates
// showRouter.get("/available-dates", fetchAvailableShowDatesController);

showRouter.post(
  "/add-show",
  [
    body("movie")
      .notEmpty()
      .withMessage("Please select a movie")
      .bail()
      .isString()
      .withMessage("Invalid movie selection"),
    body("date").notEmpty().withMessage("Please select a date"),
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
  addShowController
);

showRouter.get("/:showId", getSingleShowController);
showRouter.get("/", getAllShows);

showRouter.put(
  "/edit-show/:showId",
  [
    body("date").notEmpty().withMessage("Date is required."),
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
  editShowController
);

showRouter.delete(
  "/delete-show/:showId",
  isLogged,
  isAdmin,
  deleteShowController
);

export default showRouter;
