import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

import { UserContext } from "../../context/userContext";
import { BASE_URL } from "../../config";

import TicketPDF from "../../Components/TicketPDF";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);

  const { isLoggedIn } = useContext(UserContext);

  const token = isLoggedIn;

  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate(`/auth/sign-in`);
    } else {
      const getMyBookings = async () => {
        try {
          const res = await axios.get(`${BASE_URL}/users/my-bookings`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (res.status === 200) {
            setBookings(res.data);
            // console.log(res.data);
          }
        } catch (err) {
          console.log(err);
          toast.error("Error fetching bookings");
        }
      };

      getMyBookings();
    }
  }, [token, navigate]);

  const handleDownloadTicket = (booking) => {
    const blob = new Blob([<TicketPDF booking={booking} />], {
      type: "application/pdf",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "ticket.pdf";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mt-3">
      <div className="container">
        <div className="row">
          <div className="col">
            <div className="table-responsive mt-5">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Movie name</th>
                    <th scope="col">Date</th>
                    <th scope="col">Time</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.length === 0 && (
                    <tr>
                      <td colSpan={5}>
                        <p>No Bookings yet.</p>
                      </td>
                    </tr>
                  )}

                  {bookings.length > 0 &&
                    bookings.map((booking, index) => (
                      <tr className="align-middle" key={booking._id}>
                        <th scope="row">{index + 1}</th>
                        <td>{booking.movie.name}</td>
                        <td>{booking.showDate}</td>
                        <td>{booking.showTime}</td>
                        <td>
                          <button
                            onClick={() => handleDownloadTicket(booking)}
                            className="btn btn-dark"
                          >
                            Download Ticket
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyBookings;
