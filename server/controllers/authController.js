import bcrypt from "bcryptjs";

import User from "../models/User.js";

import { appError } from "../utils/appError.js";
import { generateToken } from "../utils/generateToken.js";

import { validationResult } from "express-validator";

export const signUpController = async (req, res, next) => {
  const { name, email, password, cnfPassword } = req.body;

  // Check if the fields are empty or not
  const errors = validationResult(req);

  let formattedErrors = {};
  if (!errors.isEmpty()) {
    errors.array().forEach((error) => {
      formattedErrors[error.path] = error.msg;
    });
    return res.status(500).json({ errors: formattedErrors });
  }

  try {
    const newEmail = email.toLowerCase();

    const userFound = await User.findOne({ email: newEmail });

    if (userFound) {
      // return next(appError("Email already exists"));
      formattedErrors.email = "Email already exists";
      return res.status(500).json({ errors: formattedErrors });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email: newEmail,
      password: hashedPassword,
    });

    await newUser.save();

    res
      .status(200)
      .json({ success: "true", message: "User registered successfully" });
  } catch (err) {
    console.log(err);
    next(appError(`Internal Server Error`));
  }
};

export const signInController = async (req, res, next) => {
  const { email, password } = req.body;

  // Check if the fields are empty or not
  const errors = validationResult(req);

  let formattedErrors = {};
  if (!errors.isEmpty()) {
    errors.array().forEach((error) => {
      formattedErrors[error.path] = error.msg;
    });
    return res.status(500).json({ errors: formattedErrors });
  }

  try {
    const newEmail = email.toLowerCase();

    const user = await User.findOne({ email: newEmail });

    if (!user) {
      // return next(appError("Invalid credentials"));
      formattedErrors.general = "Invalid credentials";
      return res.status(500).json({ errors: formattedErrors });
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      // return next(appError("Invalid credentials"));
      formattedErrors.general = "Invalid credentials";
      return res.status(500).json({ errors: formattedErrors });
    }

    res.status(200).json({
      success: true,
      token: generateToken(user._id, user.role),
      role: user.role,
    });
  } catch (err) {
    console.log(err);
    next(appError(`Internal Server Error`));
  }
};
