import bcrypt from "bcryptjs";

import User from "../models/User.js";

import { appError } from "../utils/appError.js";
import { generateToken } from "../utils/generateToken.js";

export const signUpController = async (req, res, next) => {
  const { name, email, password, cnfPassword } = req.body;
  // console.log(req.body);

  if (!name || !email || !password || !cnfPassword) {
    return next(appError("Fill in all fields"));
  }

  try {
    const newEmail = email.toLowerCase();

    const userFound = await User.findOne({ email: newEmail });

    if (userFound) {
      return next(appError("Email already exists"));
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

  try {
    const newEmail = email.toLowerCase();

    const user = await User.findOne({ email: newEmail });

    if (!user) {
      return next(appError("Invalid credentials"));
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      return next(appError("Invalid credentials"));
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
