import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../context/userContext";

const ProtectedRoutes = ({ children, allowedRoutes }) => {
  const { isLoggedIn, role } = useContext(UserContext);
  const isAllowed = allowedRoutes.includes(role);

  const accessibleRoute =
    isLoggedIn && isAllowed ? (
      children
    ) : (
      <Navigate to={"/auth/sign-in"} replace={true} />
    );
  return accessibleRoute;
};

export default ProtectedRoutes;
