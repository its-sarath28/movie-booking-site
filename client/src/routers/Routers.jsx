import React from "react";
import { Route, Routes } from "react-router-dom";

import Home from "../pages/User/Home";
import SignIn from "../pages/Auth/SignIn";
import SignUp from "../pages/Auth/SignUp";
import ViewShowDetails from "../pages/User/ViewShowDetails";
import ErrorPage from "../pages/User/ErrorPage";
import MyBookings from "../pages/User/MyBookings";
import AdminHome from "../pages/Admin/AdminHome";
import AddMovies from "../pages/Admin/AddMovies";
import EditMovies from "../pages/Admin/EditMovies";
import Logout from "../pages/Auth/Logout";

import Ticket from "../Components/Ticket";

import ProtectedRoutes from "./ProtectedRoutes";

const Routers = () => {
  return (
    <Routes>
      {/* user routes */}
      <Route path="/" element={<Home />} />
      <Route path="/auth/sign-in" element={<SignIn />} />
      <Route path="/auth/sign-up" element={<SignUp />} />
      <Route path="/auth/logout" element={<Logout />} />
      <Route path="/movies/:movieId" element={<ViewShowDetails />} />
      <Route path="/my-bookings" element={<MyBookings />} />
      <Route path="/show-ticket/:bookingId" element={<Ticket />} />

      {/* Admin routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoutes allowedRoutes={["admin"]}>
            <AdminHome />
          </ProtectedRoutes>
        }
      />
      <Route
        path="/add-movie"
        element={
          <ProtectedRoutes allowedRoutes={["admin"]}>
            <AddMovies />
          </ProtectedRoutes>
        }
      />
      <Route
        path="/edit-movie/:movieId"
        element={
          <ProtectedRoutes allowedRoutes={["admin"]}>
            <EditMovies />
          </ProtectedRoutes>
        }
      />
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
};

export default Routers;
