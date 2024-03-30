import { appError } from "../utils/appError.js";
import { getTokenFromHeader } from "../utils/getTokenFromHeader.js";
import { verifyToken } from "../utils/verifyToken.js";

export const isLogged = (req, res, next) => {
  //Get token from header
  const token = getTokenFromHeader(req);
  //Verify the token
  const decodedUser = verifyToken(token);
  //   console.log(`Decoded User: ${decodedUser}`);

  //Save the user into req object
  req.userAuth = decodedUser.id;

  if (!decodedUser) {
    return next(appError("Invalid/Expired token, Please login again", 500));
  } else {
    next();
  }
};
