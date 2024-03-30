import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { UserContext } from "../../context/userContext";

const Logout = () => {
  const { setIsLoggedIn, setRole } = useContext(UserContext);

  const navigate = useNavigate();

  useEffect(() => {
    navigate("/auth/sign-in");
    setIsLoggedIn(null);
    setRole(null);
  }, [navigate, setIsLoggedIn]);

  return null;
};

export default Logout;
