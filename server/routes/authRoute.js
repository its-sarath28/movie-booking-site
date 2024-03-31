import express from "express";
const authRouter = express.Router();

import { body } from "express-validator";

import {
  signInController,
  signUpController,
} from "../controllers/authController.js";

authRouter.post(
  "/sign-up",
  [
    body("name").notEmpty().withMessage("Name is required."),
    // .custom((value) => {
    //   if (!/^[a-zA-Z ]+$/.test(value)) {
    //     throw new Error("First name should only contain letters and spaces");
    //   }
    //   return true;
    // })
    body("email")
      .notEmpty()
      .withMessage("Email is required.")
      .isEmail()
      .withMessage("Invalid email format."),
    body("password").notEmpty().withMessage("Password is required."),
    body("cnfPassword")
      .notEmpty()
      .withMessage("Confirm password is required.")
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Passwords do not match");
        }
        return true;
      }),
  ],
  signUpController
);

authRouter.post(
  "/sign-in",
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email"),
  body("password").notEmpty().withMessage("Password is required."),
  signInController
);

export default authRouter;
