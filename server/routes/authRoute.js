import express from "express";
const authRouter = express.Router();

import {
  signInController,
  signUpController,
} from "../controllers/authController.js";

authRouter.post("/sign-up", signUpController);
authRouter.post("/sign-in", signInController);

export default authRouter;
