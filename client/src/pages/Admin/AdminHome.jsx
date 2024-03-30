import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import toast from "react-hot-toast";
import { BASE_URL } from "../../config";
import axios from "axios";

const AdminHome = () => {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { isLoggedIn, role } = useContext(UserContext);

  const navigate = useNavigate();
  const token = isLoggedIn;
  useEffect(() => {
    if (!token) {
      navigate("/auth/sign-in");
    } else {
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
        setIsLoading(false);
        toast.error(`An error occurred while fetching movies.`);
      }
    }
  }, [token, role, navigate]);
  return (
    <div className="container py-5">
      <div className="row">
        <div className="col d-flex justify-content-center justify-content-md-end align-items-center">
          <Link
            to={"/add-movie"}
            className="btn btn-primary d-flex align-items-center"
          >
            Add Movie
          </Link>
        </div>
      </div>

      {/* <div className="row mt-5 d-flex justify-content-center">
        <div className="col-12 col-md-12">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Movie name</th>
                  <th scope="col">Date</th>
                  <th scope="col">Time</th>
                  <th scope="col">Price</th>
                  <th scope="col">Description</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>

              <tbody>
                {!isLoading && movies.length === 0 && (
                  <tr className="align-middle">
                    <td colSpan={7}>
                      <p className="text-center mb-0">No data found.</p>
                    </td>
                  </tr>
                )}

                {!isLoading &&
                  movies.map((movie, index) => (
                    <tr key={movie._id} className="align-middle">
                      <th scope="row">{index + 1}</th>
                      <td>{movie.name}</td>
                      <td>{movie.daySlots}</td>
                      <td>
                        {movie.timeSlots.map((time, index) => (
                          <p key={index}>{time}</p>
                        ))}
                      </td>
                      <td>{movie.price}</td>
                      <td>{movie.description}</td>
                      <td className="d-flex flex-column flex-md-row gap-3">
                        <Link
                          to={`/edit-movie/${movie._id}`}
                          className="btn btn-primary"
                        >
                          Edit
                        </Link>
                        <button
                          className="btn btn-danger"
                          data-bs-toggle="modal"
                          data-bs-target="#deleteModal"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div> */}

      <div className="row row-cols-1 row-cols-md-3 g-4">
        {movies?.map(({ _id: id, name, photo, description }) => (
          <div className="col" key={id}>
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{name}</h5>
                <p className="card-text">{description}</p>
                <p className="card-text">11: 30 AM (Running)</p>
                <p className="card-text">2: 30 PM (Running)</p>
                <p className="card-text">5 PM (Running)</p>
                <p className="card-text">9 PM (Running)</p>
              </div>

              <div className="d-flex gap-2 ps-3 pb-3">
                <Link to={`/edit-movie/`} className="btn btn-primary">
                  Edit
                </Link>
                <button
                  className="btn btn-danger"
                  data-bs-toggle="modal"
                  data-bs-target="#deleteModal"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminHome;
