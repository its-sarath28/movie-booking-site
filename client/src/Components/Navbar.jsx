import React, { useContext } from "react";
import { Link } from "react-router-dom";

import { UserContext } from "../context/userContext";

const Navbar = () => {
  const { isLoggedIn, role } = useContext(UserContext);

  const token = isLoggedIn;
  return (
    <nav className="navbar navbar-expand-lg bg-white px-md-5 px-3 sticky-top">
      <div className="container-fluid px-0">
        <Link className="navbar-brand fw-bolder m-0" to={"/"}>
          BookMyMovie
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className="collapse navbar-collapse bg-white "
          id="navbarSupportedContent"
        >
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link
                className={
                  "nav-link fw-bolder" +
                  ((status) => (status.isActive ? "active text-danger" : ""))
                }
                aria-current="page"
                to="/"
              >
                Home
              </Link>
            </li>
            {role === "user" && (
              <li className="nav-item">
                <Link
                  className={
                    "nav-link fw-bolder" +
                    ((status) => (status.isActive ? "active" : ""))
                  }
                  aria-current="page"
                  to="/my-bookings"
                >
                  My bookings
                </Link>
              </li>
            )}

            {role === "admin" && (
              <>
                <li className="nav-item">
                  <Link
                    className={
                      "nav-link fw-bolder" +
                      ((status) => (status.isActive ? "active" : ""))
                    }
                    aria-current="page"
                    to="/admin/dashboard"
                  >
                    Dashboard
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    className={
                      "nav-link fw-bolder" +
                      ((status) => (status.isActive ? "active" : ""))
                    }
                    aria-current="page"
                    to="/admin/add-movie"
                  >
                    Add Movie
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    className={
                      "nav-link fw-bolder" +
                      ((status) => (status.isActive ? "active" : ""))
                    }
                    aria-current="page"
                    to="/admin/add-show"
                  >
                    Add Shows
                  </Link>
                </li>
              </>
            )}
          </ul>

          <div className="d-flex align-items-center gap-3 pb-3 pb-md-0">
            {token ? (
              <Link to={`/auth/logout`} className="btn btn-dark">
                Logout
              </Link>
            ) : (
              <Link to={`/auth/sign-in`} className="btn btn-primary">
                Sign in
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
