import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import HashLoader from "react-spinners/HashLoader";

import { BASE_URL } from "../../config";

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    try {
      const getAvailableDates = async () => {
        const res = await axios.get(`${BASE_URL}/movies/available-dates`);

        if (res.status === 200) {
          setDates(res.data);
          // Set the selectedDate to the first date by default
          setSelectedDate(res.data[0]);
          // console.log("Available Dates:", res.data);
        }
      };

      getAvailableDates();
    } catch (err) {
      console.log("Error: ", err);
      toast.error(`An error occurred while fetching dates.`);
    }
  }, []);

  useEffect(() => {
    try {
      setIsLoading(true);
      const getMovies = async () => {
        const res = await axios.get(`${BASE_URL}/movies`);

        if (res.status === 200) {
          setMovies(res.data);
          setIsLoading(false);
        }
      };

      getMovies();
    } catch (err) {
      console.log("Error: ", err);
      toast.error(`An error occurred while fetching movies.`);
    }
  }, []);

  const truncateDescription = (description, maxLength) => {
    if (description.length <= maxLength) {
      return description;
    }
    return description.slice(0, maxLength) + "...";
  };

  const filterMoviesByDate = () => {
    return movies.filter((movie) => movie.date === selectedDate);
  };

  return (
    <div className="container-fluid px-2">
      <div className="row mx-0">
        {/* Sidebar for Date Selection */}
        <div className="col-md-3 bg-light rounded rounded-lg h-100">
          <div className="pb-4 pb-md-0">
            <h2 className="text-center fs-4 py-3">Select Date</h2>
            <div className="date-buttons d-flex flex-row flex-md-column">
              {dates.map((date, index) => (
                <button
                  key={index}
                  className={`btn btn-outline-primary mx-md-auto mb-md-3 me-3 ${
                    selectedDate === date ? "active" : ""
                  }`}
                  onClick={() => setSelectedDate(date)}
                >
                  {date}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Movies Section */}
        <div className="col-md-9">
          <div className="container home">
            {isLoading && (
              <div className="d-flex align-items-center justify-content-center">
                <HashLoader size={35} color="#333" />
              </div>
            )}
            {/* Movies List */}
            {!isLoading && (
              <div className="row row-cols-1 row-cols-md-3 gx-4">
                {filterMoviesByDate().map(
                  ({ _id: id, name, photo, description, date }) => (
                    <div className="col" key={id}>
                      <div className="card" style={{ width: "18rem" }}>
                        <img
                          src={photo}
                          className="card-img-top object-fit-cover"
                          alt="movie"
                        />
                        <div className="card-body">
                          <h5 className="card-title fw-bold">{name}</h5>
                          <p className="mb-0 text-muted fw-semibold">On</p>
                          <p className="card-text">
                            {truncateDescription(description, 100)}
                          </p>
                        </div>
                        <div className="ps-3 pb-3">
                          <Link
                            to={`/movies/${id}`}
                            className="btn btn-primary d-flex align-items-center"
                          >
                            View
                          </Link>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
