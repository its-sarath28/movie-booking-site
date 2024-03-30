import { createContext, useEffect, useState } from "react";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    JSON.parse(localStorage.getItem("token"))
  );
  const [role, setRole] = useState(JSON.parse(localStorage.getItem("role")));

  useEffect(() => {
    localStorage.setItem("token", JSON.stringify(isLoggedIn));
    localStorage.setItem("role", JSON.stringify(role));
  }, [isLoggedIn, role]);

  return (
    <UserContext.Provider value={{ isLoggedIn, setIsLoggedIn, role, setRole }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
