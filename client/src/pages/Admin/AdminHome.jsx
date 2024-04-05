import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { UserContext } from "../../context/userContext";
import { BASE_URL } from "../../config";

import ViewShows from "./ViewShows";
import ViewMovies from "./ViewMovies";

const AdminHome = () => {
  const [movies, setMovies] = useState([]);
  const [shows, setShows] = useState([]);
  const [tab, setTab] = useState("shows");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const { isLoggedIn } = useContext(UserContext);
  const token = isLoggedIn;

  useEffect(() => {
    if (!token) {
      navigate("/auth/sign-in");
    }
  }, [token, navigate]);

  useEffect(() => {
    const getAllMovies = async () => {
      try {
        setIsLoading(false);
        const res = await axios.get(`${BASE_URL}/movies`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 200) {
          setMovies(res.data);
          setIsLoading(false);
        }
      } catch (err) {
        setIsLoading(false);
        console.log(`Err getting movies: ${err}`);
      }
    };

    getAllMovies();
  }, []);

  useEffect(() => {
    const getAllShows = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(`${BASE_URL}/shows`);

        if (res.status === 200) {
          setShows(res.data);
          setIsLoading(false);
        }
      } catch (err) {
        setIsLoading(false);
        console.log(`Err getting shows: ${err}`);
      }
    };

    getAllShows();
  }, []);

  return (
    <div className="container py-5">
      <div className="row mb-3">
        <div className="col">
          <div className="d-flex gap-4 align-items-center justify-content-center">
            <button
              onClick={() => setTab("shows")}
              className={`btn ${
                tab === "shows" ? "btn-primary" : "btn-outline-primary"
              }`}
            >
              Shows
            </button>
            <button
              onClick={() => setTab("movies")}
              className={`btn ${
                tab === "movies" ? "btn-primary" : "btn-outline-primary"
              }`}
            >
              Movies
            </button>
          </div>
        </div>
      </div>

      <div className="row">
        {tab === "shows" && <ViewShows shows={shows} />}
        {tab === "movies" && <ViewMovies movies={movies} />}
      </div>
    </div>
  );
};

export default AdminHome;
