import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import HashLoader from "react-spinners/HashLoader";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/swiper-bundle.css";

import { BASE_URL } from "../../config";
import { UserContext } from "../../context/userContext";

const ViewMovieDetails = () => {
  const [movieData, setMovieData] = useState({
    name: "",
    description: "",
    photo: "",
    date: "",
    firstShow: null,
    matineeShow: null,
    eveningShow: null,
    nightShow: null,
  });

  const [movieDates, setMovieDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [movieTimes, setMovieTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [ticketPrice, setTicketPrice] = useState(0);
  const [numOfTickets, setNumOfTickets] = useState("");

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
          // console.log(res.data.price);
          setIsLoading(false);
        }
      };

      getSingleMovieData();
    } catch (err) {
      setIsLoading(false);
      console.error(err);
      toast.error("Something went wrong!");
    }
  }, []);

  useEffect(() => {
    try {
      setIsLoading(true);
      const getMovieDates = async () => {
        const res = await axios.get(
          `${BASE_URL}/movies/available-dates/${movieId}`
        );

        if (res.status === 200) {
          setMovieDates(res.data.dates);
          // if (res.data.dates.length > 0) {
          //   setSelectedDate(res.data.dates[0]);
          // }
          setIsLoading(false);
        }
      };

      getMovieDates();
    } catch (err) {
      setIsLoading(false);
      console.error(err);
      toast.error(`Error getting movie dates: ${err}`);
    }
  }, []);

  const handleDateSelect = async (date, e) => {
    e.preventDefault();
    setSelectedDate(date);

    try {
      setIsLoading(true);
      const res = await axios.get(
        `${BASE_URL}/movies/available-times/${movieId}/${date}`
      );

      if (res.status === 200) {
        setMovieTimes(res.data.times);

        setIsLoading(false);
      }
    } catch (err) {
      setIsLoading(false);
      console.error(err);
      toast.error(`Error getting movie times for ${date}: ${err}`);
    }
  };

  const handleTimeSelect = (time, e) => {
    e.preventDefault();
    setSelectedTime(time);
  };

  const times = ["11:30 AM", "02:30 PM", "5 PM", "9 PM"];

  const generateReceiptId = () => {
    // Generate a random string
    const randomString = Math.random().toString(36).substring(7);
    // Get current timestamp
    const timestamp = Date.now();
    // Concatenate timestamp and random string
    return `${timestamp}-${randomString}`;
  };

  const bookTicketHandler = async (e) => {
    e.preventDefault();

    if (!token) {
      navigate("/auth/sign-in");
      return;
    }

    try {
      if (!selectedTime) {
        toast.error(`Please select a show time`);
        return;
      }

      if (isNaN(numOfTickets) || numOfTickets < 1) {
        toast.error(`Please enter a valid Number of tickets`);
        return;
      }

      const amount = ticketPrice * numOfTickets * 100;
      const currency = "INR";
      const receiptId = generateReceiptId();

      // console.log(amount, currency, receiptId);

      setIsLoading(true);
      const res = await axios.post(
        `${BASE_URL}/bookings/book-ticket`,
        {
          amount,
          currency,
          receipt: receiptId,
        },
        {
          withCredentials: true,
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

        order_id: order.id,
        handler: async (res) => {
          const body = {
            ...res,
            movieId,
            numOfTickets,
            showTime: selectedTime,
            showDate: selectedDate,
          };
          try {
            const validateResponse = await axios.post(
              `${BASE_URL}/bookings/validate-payment`,
              body,
              {
                withCredentials: true,
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (validateResponse.status === 200) {
              setIsLoading(false);
              // console.log(`validateResponse`, validateResponse.data);
              navigate(`/show-ticket/${validateResponse.data.bookingId}`);
            }
          } catch (err) {
            console.error("Error validating payment:", err);
            toast.error(`Payment failed`);
          }
        },

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
    } catch (err) {
      console.error("Error booking ticket:", err);
    }
  };

  return (
    <div className="container ">
      <div className="row g-2">
        <div className="col-12 col-md-8 ">
          <div className="ps-2 ps-md-5">
            <h3 className="fw-semibold fs-4 mb-4 py-3">Movie details</h3>

            <figure className="">
              {movieData.imageURL ? (
                <img
                  src={movieData.imageURL}
                  alt={movieData.name}
                  className="rounded-top"
                  style={{
                    width: "auto",
                    height: "25rem",
                    objectFit: "fill",
                    aspectRatio: "1/1",
                  }}
                />
              ) : (
                movieData.photo && (
                  <img
                    src={movieData.photo}
                    alt={movieData.name}
                    className="rounded-top"
                    style={{
                      width: "auto",
                      height: "25rem",
                      objectFit: "fill",
                      aspectRatio: "1/1",
                    }}
                  />
                )
              )}
            </figure>

            <h3 className="fw-semibold fs-5 mt-5">About the movie</h3>
            <p className="mb-4">{movieData.description}</p>
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
            {movieDates?.length === 0 ? (
              <p className="mb-0 text-center fw-bold">No Shows scheduled!</p>
            ) : (
              <>
                {/* Date Selection */}
                <div className="mb-3">
                  <h5 className="mb-3">
                    Select Date<span className="text-danger">*</span>
                  </h5>

                  <Swiper
                    modules={[Pagination]}
                    spaceBetween={30}
                    slidesPerView={1}
                    pagination={{ clickable: true }}
                    breakpoints={{
                      640: {
                        slidesPerView: 1,
                        spaceBetween: 0,
                      },
                      768: {
                        slidesPerView: 2,
                        spaceBetween: 20,
                      },
                      1024: {
                        slidesPerView: 3,
                        spaceBetween: 30,
                      },
                    }}
                  >
                    {movieDates?.map((date, index) => (
                      <SwiperSlide key={index}>
                        <button
                          className={`btn ${
                            selectedDate === date
                              ? "btn-primary"
                              : "btn-outline-primary"
                          }`}
                          onClick={(e) => handleDateSelect(date, e)}
                        >
                          {date}
                        </button>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>

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
                      onClick={(e) => handleTimeSelect(time, e)}
                      disabled={
                        (time === "11:30 AM" && !movieTimes.firstShow) ||
                        (time === "02:30 PM" && !movieTimes.matineeShow) ||
                        (time === "5 PM" && !movieTimes.eveningShow) ||
                        (time === "9 PM" && !movieTimes.nightShow)
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
                    value={numOfTickets}
                    onChange={(e) => setNumOfTickets(e.target.value)}
                  />
                </div>

                <div className="mt-3 text-start">
                  <button className="btn btn-primary" type="submit">
                    {isLoading ? (
                      <HashLoader size={25} color="#eee" />
                    ) : (
                      `Book ticket`
                    )}
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ViewMovieDetails;
