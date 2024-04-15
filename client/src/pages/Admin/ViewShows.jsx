import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

import { UserContext } from "../../context/userContext";
import { BASE_URL } from "../../config";
import DeleteConfirmationModal from "../../Components/DeleteConfirmModal";

const ViewShows = ({ shows }) => {
  const [selectedShowId, setSelectedShowId] = useState(null);
  const [selectedShowDate, setSelectedShowDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { isLoggedIn } = useContext(UserContext);

  const token = isLoggedIn;

  const navigate = useNavigate();

  const handleDeleteClick = (showId, showDate) => {
    setSelectedShowId(showId);
    setSelectedShowDate(showDate);
  };

  const handleDeleteShow = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`${BASE_URL}/shows/delete-show/${selectedShowId}`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setIsLoading(false);

      setSelectedShowId(null);
      setSelectedShowDate("");
      navigate(0);
      toast.success(`Show deleted successfully!`);
    } catch (err) {
      console.log(err);
      toast.error(`Error while deleting movie`);
    }
  };

  return (
    <>
      <div
        className="table-responsive"
        style={{ maxHeight: "22rem", overflowY: "auto" }}
      >
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Movie name</th>
              <th scope="col">Show date</th>
              <th scope="col">Price</th>
              <th scope="col">11:30 AM</th>
              <th scope="col">02:30 PM</th>
              <th scope="col">05:00 PM</th>
              <th scope="col">09:00 PM</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {shows.length === 0 && (
              <tr>
                <td colSpan={9}>
                  <p className="mb-0 text-center">No shows added yet</p>
                </td>
              </tr>
            )}

            {shows?.map((show, index) => (
              <tr key={show._id} className="align-middle">
                <th scope="row">{index + 1}</th>
                <td>{show.movie?.name}</td>
                <td>{show.date}</td>
                <td>{show.price}</td>
                <td>
                  {show.firstShow === false ? (
                    <p className="text-danger mb-0">{"Disabled"}</p>
                  ) : (
                    <p className="text-success mb-0">{"Running"}</p>
                  )}
                </td>
                <td>
                  {show.matineeShow === false ? (
                    <p className="text-danger mb-0">{"Disabled"}</p>
                  ) : (
                    <p className="text-success mb-0">{"Running"}</p>
                  )}
                </td>
                <td>
                  {show.eveningShow === false ? (
                    <p className="text-danger mb-0">{"Disabled"}</p>
                  ) : (
                    <p className="text-success mb-0">{"Running"}</p>
                  )}
                </td>
                <td>
                  {show.nightShow === false ? (
                    <p className="text-danger mb-0">{"Disabled"}</p>
                  ) : (
                    <p className="text-success mb-0">{"Running"}</p>
                  )}
                </td>
                <td className="gap-3">
                  <Link
                    to={`/admin/edit-show/${show._id}`}
                    className="btn btn-primary me-0 me-md-3 mb-3 mb-md-0"
                  >
                    Edit
                  </Link>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDeleteClick(show._id, show.date)}
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

      <DeleteConfirmationModal
        onConfirm={handleDeleteShow}
        message={`Are you sure you want to delete the show on "${selectedShowDate}"?`}
      />
    </>
  );
};

export default ViewShows;
