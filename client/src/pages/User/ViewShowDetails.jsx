import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import HashLoader from "react-spinners/HashLoader";

import { BASE_URL } from "../../config";
import { UserContext } from "../../context/userContext";

const ViewShowDetails = () => {
  const [movieData, setMovieData] = useState({
    name: "",
    description: "",
    photo: "",
    date: "",
    firstShow: null,
    matineeShow: null,
    eveningShow: null,
    nightShow: null,
    ticketNumber: "",
  });

  const [selectedTime, setSelectedTime] = useState(null);
  const [ticketPrice, setTicketPrice] = useState(0);

  const { isLoggedIn } = useContext(UserContext);

  const token = isLoggedIn;

  const [isLoading, setIsLoading] = useState(false);

  const { movieId } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    try {
      setIsLoading(true);
      const getSingleMovieData = async () => {
        const res = await axios.get(`${BASE_URL}/movies/${movieId}`);

        if (res.status === 200) {
          setMovieData(res.data);
          setTicketPrice(res.data.price);
          setIsLoading(false);
          // console.log(res.data);
        }
      };

      getSingleMovieData();
    } catch (err) {
      setIsLoading(false);
      console.error(err);
      toast.error("Something went wrong!");
    }
  }, []);

  const handleInputChange = (e) => {
    setMovieData({ ...movieData, [e.target.name]: e.target.value });
  };

  const handleTimeSelect = (time, e) => {
    e.preventDefault();
    setSelectedTime(time);
  };

  const times = ["11:30 AM", "02:30 PM", "5 PM", "9 PM"];

  const bookTicketHandler = async (e) => {
    e.preventDefault();

    if (isNaN(movieData.ticketNumber) || movieData.ticketNumber < 1) {
      toast.error(`Please enter a valid Number of tickets`);
      return;
    }

    const amount = ticketPrice * movieData.ticketNumber * 100;
    const currency = "INR";
    const receiptId = "1234567890";

    try {
      const res = await axios.post(
        `${BASE_URL}/bookings/book-ticket`,
        {
          amount,
          currency,
          receipt: receiptId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const order = res.data;
      // console.log(order);

      var options = {
        key: "",
        amount,
        currency,
        name: "BookMyMovie",
        description: "Test transaction",
        image: "https://i.ibb..co/5Y3m33n/test.png",
        order_id: order.id,
        handler: async (res) => {
          const body = {
            ...res,
            movieId,
            numberOfTickets: movieData.ticketNumber,
            showTime: selectedTime,
            showDate: movieData.date,
          };
          try {
            const validateResponse = await axios.post(
              `${BASE_URL}/bookings/validate-payment`,
              body,
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (validateResponse.status === 200) {
              // toast.success(validateResponse.data.bookingId);
              console.log(`validateResponse`, validateResponse.data);
              navigate(`/show-ticket/${validateResponse.data.bookingId}`);
            }
          } catch (err) {
            console.error("Error validating payment:", err);
            toast.error(`Payment failed`);
          }
        },
        // prefill: {
        //   name: "",
        //   email: "",
        // },
        // notes: {
        //   address: "",
        // },
        theme: {
          color: "43399cc",
        },
      };

      var rzp1 = new Razorpay(options);

      rzp1.on("payment.failed", (res) => {
        alert(res.error.code);
        alert(res.error.description);
        alert(res.error.source);
        alert(res.error.step);
        alert(res.error.reason);
        alert(res.error.metadata.order_id);
        alert(res.error.metadata.payment_id);
      });

      rzp1.open();
      e.preventDefault();
    } catch (error) {
      console.error("Error booking ticket:", error);
    }
  };

  return (
    <div className="container ">
      <div className="row g-2">
        <div className="col-12 col-md-8 ">
          <div className="ps-2 ps-md-5">
            <h3 className="fw-semibold fs-4 mb-4 py-3">Movie details</h3>

            <figure className="movie-img">
              <img
                src={movieData.photo}
                alt="movie"
                className="h-100 object-fit-cover"
              />
            </figure>

            <p className="my-4">{movieData.description}</p>
          </div>
        </div>
        <div className="col-12 col-md-4 ">
          <h3 className="fw-semibold fs-4 mb-4 py-3 text-center">
            Show details
          </h3>

          <form
            onSubmit={bookTicketHandler}
            className="p-3 border border-2 rounded"
          >
            {/* Time selection */}
            <div className="mb-3">
              <h5 className="mb-3">
                Select Time<span className="text-danger">*</span>
              </h5>
              {times.map((time, index) => (
                <button
                  key={index}
                  className={`btn btn-outline-primary me-2 mb-2 ${
                    selectedTime === time ? "active" : ""
                  }`}
                  onClick={(e) => handleTimeSelect(time, e)} // Pass event here
                  disabled={
                    (time === "11:30 AM" && !movieData.firstShow) ||
                    (time === "02:30 PM" && !movieData.matineeShow) ||
                    (time === "5 PM" && !movieData.eveningShow) ||
                    (time === "9 PM" && !movieData.nightShow)
                  }
                >
                  {time}
                </button>
              ))}
            </div>

            {/* Number of tickets */}
            <div>
              <label htmlFor="ticket" className="form-label">
                <h5 className="mb-2">
                  Number of tickets<span className="text-danger">*</span>
                </h5>
              </label>

              <input
                type="text"
                placeholder="Number of tickets"
                className="form-control"
                name="ticketNumber"
                value={movieData.ticketNumber}
                onChange={handleInputChange}
              />
            </div>

            <div className="mt-3 text-start">
              <button className="btn btn-primary">
                {isLoading ? (
                  <HashLoader size={25} color="#eee" />
                ) : (
                  `Book ticket`
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ViewShowDetails;
