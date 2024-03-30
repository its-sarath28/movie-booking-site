import User from "../models/User.js";
import { appError } from "../utils/appError.js";
import { getTokenFromHeader } from "../utils/getTokenFromHeader.js";
import { verifyToken } from "../utils/verifyToken.js";

export const isAdmin = async (req, res, next) => {
  //Get token from header
  const token = getTokenFromHeader(req);
  //Verify the token
  const decodedUser = verifyToken(token);

  //Save the user into req object
  req.userAuth = decodedUser.id;

  //Find the user in DB
  const user = await User.findById(decodedUser.id);

  //Check if the user is Admin or not
  if (user.role === "admin") {
    return next();
  } else {
    return next(appError("Access denied, Admin only!", 403));
  }
};
