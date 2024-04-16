import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import HashLoader from "react-spinners/HashLoader";

import { BASE_URL } from "../../config";
import { UserContext } from "../../context/userContext";

const EditShow = () => {
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
    date: "",
    price: "",
    // show: "",
  });

  const { isLoggedIn } = useContext(UserContext);

  const navigate = useNavigate();
  const token = isLoggedIn;

  const { showId } = useParams();

  // Get today's date
  const today = new Date().toISOString().split("T")[0];

  // Calculate 7 days from today
  const sevenDaysFromNow = new Date();
  sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
  const maxDate = sevenDaysFromNow.toISOString().split("T")[0];

  useEffect(() => {
    if (!token) {
      navigate("/autn/login");
    } else {
      try {
        const getShow = async () => {
          const res = await axios.get(`${BASE_URL}/shows/${showId}`, {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          setShowData(res.data);
          // console.log(res.data, "single show");
        };

        getShow();
      } catch (err) {
        console.log(err);
        toast(err.response.data.message);
      }
    }
  }, [token, navigate]);

  useEffect(() => {
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
  }, [token]);

  const handleInputChange = (e) => {
    setShowData({ ...showData, [e.target.name]: e.target.value });
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

  const editShowHandler = async (e) => {
    e.preventDefault();

    // console.log(showData);
    try {
      setIsLoading(true);
      const res = await axios.put(
        `${BASE_URL}/shows/edit-show/${showId}`,
        showData,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200) {
        setIsLoading(false);
        navigate("/admin/dashboard");
        toast.success(`Movie updated successfully`);
      }
    } catch (err) {
      setIsLoading(false);
      console.error(err);

      if (err.response && err.response.data && err.response.data.errors) {
        const { errors } = err.response.data;

        setErrors({
          date: errors.date || "",
          price: errors.price || "",
          // show: errors.show || "",
        });
      }
    }
  };

  return (
    <div
      className="container d-flex flex-column align-itemscenter justify-content-center"
      style={{ minHeight: "80dvh" }}
    >
      <div className="row d-flex justify-content-center">
        <div className="col">
          <form
            onSubmit={editShowHandler}
            className="shadow-lg p-4 text-center rounded"
          >
            <h3 className="mb-4">Edit Show</h3>
            <div className="row">
              <div className="col-md-6">
                <div>
                  <select
                    className="form-select"
                    aria-label="Default select example"
                    name="movie"
                    value={showData.movie?._id}
                    onChange={handleInputChange}
                  >
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
                    name="daySlots"
                    placeholder="Date"
                    className="form-control"
                    value={showData.date}
                    onChange={handleInputChange}
                    min={today}
                    max={maxDate}
                  />
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
                {/* {errors.show && (
                  <p className="text-start text-danger">{errors.show}</p>
                )} */}
              </div>
            </div>

            {/* <div className="col-md-6">
              <div className="">
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
              </div>
            </div> */}

            <div>
              <button type="submit" className="btn btn-success">
                {isLoading ? (
                  <HashLoader size={25} color="#eee" />
                ) : (
                  `Update Show`
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditShow;
