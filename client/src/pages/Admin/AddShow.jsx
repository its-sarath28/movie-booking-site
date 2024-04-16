import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HashLoader from "react-spinners/HashLoader";
import axios from "axios";
import toast from "react-hot-toast";

import { UserContext } from "../../context/userContext";
import { BASE_URL } from "../../config";

const AddShow = () => {
  const [showData, setShowData] = useState({
    movie: "",
    date: "",
    price: "",
    firstShow: false,
    matineeShow: false,
    eveningShow: false,
    nightShow: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [movieNames, setMovieNames] = useState([]);

  const [errors, setErrors] = useState({
    movie: "",
    date: "",
    // price: "",
    show: "",
  });

  const navigate = useNavigate();
  const { isLoggedIn } = useContext(UserContext);
  const token = isLoggedIn;

  const today = new Date().toISOString().split("T")[0];
  const sevenDaysFromNow = new Date();
  sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
  const maxDate = sevenDaysFromNow.toISOString().split("T")[0];

  useEffect(() => {
    if (!token) {
      navigate("/auth/sign-in");
    } else {
      const getAvailableMovieNames = async () => {
        try {
          setIsLoading(true);
          const res = await axios.get(`${BASE_URL}/movies/names`, {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (res.status === 200) {
            // console.log(res.data, "Movie names");
            setMovieNames(res.data);
            setIsLoading(false);
          }
        } catch (err) {
          setIsLoading(false);
          console.log(`Error getting movie names: ${err}`);
        }
      };

      getAvailableMovieNames();
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShowData({ ...showData, [name]: value });
  };

  const handleTimeCheckboxChange = (time) => {
    let updatedShowData = { ...showData };

    switch (time) {
      case "11:30 AM":
        updatedShowData.firstShow = !updatedShowData.firstShow;
        break;
      case "2:30 PM":
        updatedShowData.matineeShow = !updatedShowData.matineeShow;
        break;
      case "5 PM":
        updatedShowData.eveningShow = !updatedShowData.eveningShow;
        break;
      case "9 PM":
        updatedShowData.nightShow = !updatedShowData.nightShow;
        break;
      default:
        break;
    }

    setShowData(updatedShowData);
  };

  const addMovieHandler = async (e) => {
    e.preventDefault();

    // console.log(showData);
    try {
      setIsLoading(true);

      const response = await axios.post(
        `${BASE_URL}/shows/add-show`,
        showData,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setIsLoading(false);
        navigate("/admin/dashboard");
        toast.success(`Movie added successfully`);
      }
    } catch (err) {
      setIsLoading(false);
      console.error(err);
      if (err.response && err.response.data && err.response.data.errors) {
        const { errors } = err.response.data;

        console.log(errors);
        setErrors({
          movie: errors.movie || "",
          date: errors.date || "",
          // price: errors.price || "",
          show: errors.show || "",
        });
      }
    }
  };

  return (
    <div
      className="container d-flex flex-column align-items-center justify-content-center"
      style={{ minHeight: "80dvh" }}
    >
      <div className="row d-flex justify-content-center">
        <div className="col">
          <form
            onSubmit={addMovieHandler}
            className="shadow-lg p-4 text-center rounded"
          >
            <h3 className="mb-4">Add Movie</h3>
            <div className="row">
              <div className="col-md-6">
                <div>
                  <select
                    className="form-select"
                    aria-label="Default select example"
                    name="movie"
                    value={showData.movie}
                    onChange={handleInputChange}
                  >
                    <option value="" defaultValue={"select one"} hidden>
                      Select Movie
                    </option>
                    {movieNames?.map((movie) => (
                      <option key={movie._id} value={movie._id}>
                        {movie.name}
                      </option>
                    ))}
                  </select>
                  {errors.movie && (
                    <p className="text-start text-danger">{errors.movie}</p>
                  )}
                </div>

                <div className="my-3">
                  <input
                    type="date"
                    name="date"
                    placeholder="Date"
                    className="form-control"
                    value={showData.date}
                    onChange={handleInputChange}
                    min={today}
                    max={maxDate}
                  />
                  {errors.date && (
                    <p className="text-start text-danger">{errors.date}</p>
                  )}
                </div>
              </div>
              <div className="col-md-6">
                <div className="row row-cols-2">
                  <div className="d-flex align-items-center gap-4">
                    <p className="text-start mb-0">11:30 AM</p>
                    <span>
                      <label className="switch">
                        <input
                          type="checkbox"
                          onChange={() => handleTimeCheckboxChange("11:30 AM")}
                          checked={showData.firstShow === true}
                        />
                        <span className="slider round"></span>
                      </label>
                    </span>
                  </div>
                  <div className="d-flex align-items-center gap-4">
                    <p className="text-start mb-0">2:30 PM</p>
                    <span>
                      <label className="switch">
                        <input
                          type="checkbox"
                          onChange={() => handleTimeCheckboxChange("2:30 PM")}
                          checked={showData.matineeShow === true}
                        />
                        <span className="slider round"></span>
                      </label>
                    </span>
                  </div>
                  <div className="d-flex align-items-center gap-4 mt-4">
                    <p className="text-start mb-0">5 PM</p>
                    <span>
                      <label className="switch">
                        <input
                          type="checkbox"
                          onChange={() => handleTimeCheckboxChange("5 PM")}
                          checked={showData.eveningShow === true}
                        />
                        <span className="slider round"></span>
                      </label>
                    </span>
                  </div>
                  <div className="d-flex align-items-center gap-4 mt-4">
                    <p className="text-start mb-0">9 PM</p>
                    <span>
                      <label className="switch">
                        <input
                          type="checkbox"
                          onChange={() => handleTimeCheckboxChange("9 PM")}
                          checked={showData.nightShow === true}
                        />
                        <span className="slider round"></span>
                      </label>
                    </span>
                  </div>
                </div>
                {errors.show && (
                  <p className="text-start text-danger">{errors.show}</p>
                )}
              </div>
            </div>

            {/* <div className="my-3">
              <input
                type="number"
                name="price"
                placeholder="Ticket price"
                className="form-control"
                value={showData.price}
                onChange={handleInputChange}
              />
              {errors.price && (
                <p className="text-start text-danger">{errors.price}</p>
              )}
            </div> */}

            <div>
              <button type="submit" className="btn btn-primary">
                {isLoading ? <HashLoader size={25} color="#eee" /> : `Add Show`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddShow;
