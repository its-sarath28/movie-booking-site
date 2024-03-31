import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { QRCodeSVG } from "qrcode.react";

import { BASE_URL } from "../config";
import { UserContext } from "../context/userContext";

const Ticket = () => {
  const [ticketData, setTicketData] = useState([]);
  const { bookingId } = useParams();

  const { isLoggedIn } = useContext(UserContext);

  const token = isLoggedIn;

  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate(`/auth/sign-in`);
    } else {
      // console.log("Booking ID:", bookingId);
      const getTicketData = async () => {
        const res = await axios.get(
          `${BASE_URL}/users/ticket-details/${bookingId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (res.status === 200) {
          setTicketData(res.data);
          // console.log(res.data);
        }
      };

      getTicketData();
      try {
      } catch (err) {
        console.log(err);
        toast.error(err.message);
      }
    }
  }, []);

  return (
    <div className="container">
      <div className="row height d-flex flex-column align-items-center justify-content-center">
        <div className="col-md-6 rounded">
          {ticketData.movie && (
            <>
              <div className="bg-danger ps-4 py-3 rounded-top">
                <h3 className="text-white mb-0 fs-6">BookMyMovie</h3>
              </div>

              <div className="ticketDetails bg-light">
                <div className="row">
                  <div className="col-md-8 ps-4 my-3 border-md-end border-4">
                    <h2 className="fw-bold movieName">
                      {ticketData.movie.name}
                    </h2>
                    <span className="subHeading text-muted fw-semibold">
                      MOVIE
                    </span>

                    <div className="row row-cols-3 mt-4">
                      <div className="">
                        <h2 className="fw-bold heading2">
                          {ticketData.showDate}
                        </h2>
                        <span className="subHeading text-muted fw-semibold">
                          DATE
                        </span>
                      </div>
                      <div className="">
                        <h2 className="fw-bold heading2">
                          {ticketData.showTime}
                        </h2>
                        <span className="subHeading text-muted fw-semibold">
                          TIME
                        </span>
                      </div>
                      <div className="">
                        <h2 className="fw-bold heading2">
                          {ticketData.numberOfTickets}
                        </h2>
                        <span className="subHeading text-muted fw-semibold">
                          TICKETS
                        </span>
                      </div>
                    </div>

                    <div className="mt-3">
                      <h2 className="fw-bold heading2">{ticketData._id}</h2>
                      <span className="subHeading text-muted fw-semibold">
                        BOOKING ID
                      </span>
                    </div>
                  </div>

                  <div className="col-md-4 d-flex align-items-center justify-content-center">
                    <QRCodeSVG
                      value={`
                      Movie name: ${ticketData.movie.name}
                      Show date: ${ticketData.showDate}
                      Show time: ${ticketData.showTime}
                      Number of tickets: ${ticketData.numberOfTickets}
                      Booking ID: ${ticketData._id}
                      `}
                    />
                    ,
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="text-center mt-4">
          <Link to={"/my-bookings"} className="btn btn-primary">
            Back to bookings
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Ticket;
