import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import HashLoader from "react-spinners/HashLoader";

import { UserContext } from "../../context/userContext";
import { BASE_URL } from "../../config";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loadingStates, setLoadingStates] = useState({});

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
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (res.status === 200) {
            setBookings(res.data);
            console.log(res.data);
          }
        } catch (err) {
          console.log(err);
          toast.error("Error fetching bookings");
        }
      };

      getMyBookings();
    }
  }, [token, navigate]);

  // const handleDownloadPDF = async (bookingId) => {
  //   try {
  //     setLoadingStates((prevLoadingStates) => ({
  //       ...prevLoadingStates,
  //       [bookingId]: true,
  //     }));
  //     const res = await axios.get(
  //       `${BASE_URL}/users/generate-ticket/${bookingId}`,
  //       {
  //         withCredentials: true,
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //         // Specify responseType as 'blob' to receive binary data
  //         responseType: "blob",
  //       }
  //     );

  //     if (res.status === 200) {
  //       // Create a blob URL from the binary data received
  //       const pdfUrl = URL.createObjectURL(
  //         new Blob([res.data], { type: "application/pdf" })
  //       );
  //       // Open the PDF in a new tab
  //       window.open(pdfUrl, "_blank");
  //     } else {
  //       setIsLoading(false);
  //       console.log("Download failed");
  //     }
  //   } catch (err) {
  //     console.log(`Error downloading PDF from client: ${err}`);
  //   } finally {
  //     setLoadingStates((prevLoadingStates) => ({
  //       ...prevLoadingStates,
  //       [bookingId]: false,
  //     }));
  //   }
  // };

  const handleDownloadPDF = async (bookingId) => {
    try {
      setLoadingStates((prevLoadingStates) => ({
        ...prevLoadingStates,
        [bookingId]: true,
      }));
      const res = await axios.get(
        `${BASE_URL}/users/generate-ticket/${bookingId}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
          // Specify responseType as 'blob' to receive binary data
          responseType: "blob",
        }
      );

      if (res.status === 200) {
        // Create a blob URL from the binary data received
        const blob = new Blob([res.data], { type: "application/pdf" });
        const pdfUrl = URL.createObjectURL(blob);

        // Create a link element
        const link = document.createElement("a");
        link.href = pdfUrl;
        link.setAttribute("download", `ticket_${bookingId}.pdf`);
        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);
        URL.revokeObjectURL(pdfUrl);
      } else {
        setIsLoading(false);
        console.log("Download failed");
      }
    } catch (err) {
      console.log(`Error downloading PDF from client: ${err}`);
    } finally {
      setLoadingStates((prevLoadingStates) => ({
        ...prevLoadingStates,
        [bookingId]: false,
      }));
    }
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
                            onClick={() => handleDownloadPDF(booking._id)}
                            disabled={loadingStates[booking._id]}
                            className="btn btn-dark"
                          >
                            {loadingStates[booking._id] ? (
                              <HashLoader size={25} color="#eee" />
                            ) : (
                              `Download Ticket`
                            )}
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
