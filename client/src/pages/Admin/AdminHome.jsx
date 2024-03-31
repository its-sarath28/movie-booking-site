import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

import { UserContext } from "../../context/userContext";
import { BASE_URL } from "../../config";

import DeleteConfirmationModal from "./DeleteConfirmModal";

const AdminHome = () => {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState(null);
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
            console.log(res.data);
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

  const handleDeleteClick = (medicineId) => {
    setSelectedMovieId(medicineId);
  };

  const deleteMovieHandler = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`${BASE_URL}/movies/delete-movie/${selectedMovieId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setIsLoading(false);

      setSelectedMovieId(null);
      navigate(0);
      toast.success(`Movie deleted successfully!`);
    } catch (err) {
      console.log(err);
      toast.error(`Error while deleting movie`);
    }
  };

  return (
    <>
      <div className="container py-5">
        <div className="row mb-5">
          <div className="col d-flex justify-content-center justify-content-md-end align-items-center">
            <Link
              to={"/add-movie"}
              className="btn btn-primary d-flex align-items-center"
            >
              Add Movie
            </Link>
          </div>
        </div>

        <div className="row row-cols-1 row-cols-md-3 g-4">
          {movies?.map(
            ({
              _id: id,
              name,
              date,
              firstShow,
              matineeShow,
              eveningShow,
              nightShow,
            }) => (
              <div className="col" key={id}>
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">{name}</h5>
                    <p>
                      On <span className="fw-bold">{date}</span>
                    </p>
                    <p className="card-text">
                      11: 30 AM (
                      {firstShow === true ? (
                        <span className="text-success">Running</span>
                      ) : (
                        <span className="text-danger">Disbled</span>
                      )}
                      )
                    </p>
                    <p className="card-text">
                      2: 30 PM (
                      {matineeShow === true ? (
                        <span className="text-success">Running</span>
                      ) : (
                        <span className="text-danger">Disbled</span>
                      )}
                      )
                    </p>
                    <p className="card-text">
                      5 PM (
                      {eveningShow === true ? (
                        <span className="text-success">Running</span>
                      ) : (
                        <span className="text-danger">Disbled</span>
                      )}
                      )
                    </p>
                    <p className="card-text">
                      9 PM (
                      {nightShow === true ? (
                        <span className="text-success">Running</span>
                      ) : (
                        <span className="text-danger">Disbled</span>
                      )}
                      )
                    </p>
                  </div>

                  <div className="d-flex gap-2 ps-3 pb-3">
                    <Link to={`/edit-movie/${id}`} className="btn btn-primary">
                      Edit
                    </Link>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDeleteClick(id)}
                      data-bs-toggle="modal"
                      data-bs-target="#deleteModal"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>

      <DeleteConfirmationModal onConfirm={deleteMovieHandler} />
    </>
  );
};

export default AdminHome;
