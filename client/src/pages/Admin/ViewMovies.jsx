import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

import DeleteConfirmationModal from "../../Components/DeleteConfirmModal";
import { BASE_URL } from "../../config";
import { UserContext } from "../../context/userContext";

const ViewMovies = ({ movies }) => {
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [selectedMovieName, setSelectedMovieName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { isLoggedIn } = useContext(UserContext);

  const token = isLoggedIn;

  const navigate = useNavigate();

  const handleDeleteClick = (movieId, movieName) => {
    setSelectedMovieId(movieId);
    setSelectedMovieName(movieName);
  };

  const handleDeleteMovie = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`${BASE_URL}/movies/delete-movie/${selectedMovieId}`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setIsLoading(false);

      setSelectedMovieId(null);
      setSelectedMovieName("");
      navigate(0);
      toast.success(`Movie deleted successfully!`);
    } catch (err) {
      console.log(err);
      toast.error(`Error while deleting movie`);
    }
  };

  return (
    <>
      <div
        className="table-responsive"
        style={{ maxHeight: "30rem", overflowY: "auto" }}
      >
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Photo</th>
              <th scope="col">Movie name</th>
              <th scope="col">Genere</th>
              <th scope="col">Description</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {movies.length === 0 && (
              <tr>
                <td colSpan={6}>
                  <p className="mb-0 text-center">No movies added yet</p>
                </td>
              </tr>
            )}

            {movies.map((movie, index) => (
              <tr key={movie._id} className="align-middle">
                <th scope="row">{index + 1}</th>
                <td>
                  {movie.imageURL ? (
                    <img
                      src={movie.imageURL}
                      alt={movie.name}
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                        borderRadius: "5px",
                      }}
                    />
                  ) : (
                    movie.photo && (
                      <img
                        src={movie.photo}
                        alt={movie.name}
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                          borderRadius: "5px",
                        }}
                      />
                    )
                  )}
                </td>
                <td>{movie.name}</td>
                <td>{movie.genere}</td>
                <td>{movie.description}</td>
                <td>
                  <div className="d-flex gap-3">
                    <Link
                      to={`/admin/edit-movie/${movie._id}`}
                      className="btn btn-primary "
                    >
                      Edit
                    </Link>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDeleteClick(movie._id, movie.name)}
                      data-bs-toggle="modal"
                      data-bs-target="#deleteModal"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <DeleteConfirmationModal
        onConfirm={handleDeleteMovie}
        message={`Are you sure you want to delete the movie "${selectedMovieName}"?`}
      />
    </>
  );
};

export default ViewMovies;
