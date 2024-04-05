import React from "react";
import { Route, Routes } from "react-router-dom";

import Home from "../pages/User/Home";
import SignIn from "../pages/Auth/SignIn";
import SignUp from "../pages/Auth/SignUp";
import ViewMovieDetails from "../pages/User/ViewMovieDetails";
import ErrorPage from "../pages/User/ErrorPage";
import MyBookings from "../pages/User/MyBookings";
import AdminHome from "../pages/Admin/AdminHome";
import AddMovie from "../pages/Admin/AddMovie";
import AddShow from "../pages/Admin/AddShow";
import Logout from "../pages/Auth/Logout";

import Ticket from "../Components/Ticket";

import ProtectedRoutes from "./ProtectedRoutes";
import EditMovie from "../pages/Admin/EditMovie";
import EditShow from "../pages/Admin/EditShow";

const Routers = () => {
  return (
    <Routes>
      {/* user routes */}
      <Route path="/" element={<Home />} />
      <Route path="/auth/sign-in" element={<SignIn />} />
      <Route path="/auth/sign-up" element={<SignUp />} />
      <Route path="/auth/logout" element={<Logout />} />
      <Route path="/movies/:movieId" element={<ViewMovieDetails />} />
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
        path="/admin/add-movie"
        element={
          <ProtectedRoutes allowedRoutes={["admin"]}>
            <AddMovie />
          </ProtectedRoutes>
        }
      />
      <Route
        path="/admin/add-show"
        element={
          <ProtectedRoutes allowedRoutes={["admin"]}>
            <AddShow />
          </ProtectedRoutes>
        }
      />
      <Route
        path="/admin/edit-movie/:movieId"
        element={
          <ProtectedRoutes allowedRoutes={["admin"]}>
            <EditMovie />
          </ProtectedRoutes>
        }
      />
      <Route
        path="/admin/edit-show/:showId"
        element={
          <ProtectedRoutes allowedRoutes={["admin"]}>
            <EditShow />
          </ProtectedRoutes>
        }
      />
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
};

export default Routers;
