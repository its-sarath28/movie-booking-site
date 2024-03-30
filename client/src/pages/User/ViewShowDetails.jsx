import React, { useState } from "react";

import movie from "../../assets/images/movie-5.jpeg";

const ViewShowDetails = () => {
  // State variables for selected date and time
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  // Function to handle date selection
  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  // Function to handle time selection
  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  // Dummy data for dates and times (replace with actual data)
  const dates = ["2024-04-01", "2024-04-02", "2024-04-03"];
  const times = ["10:00 AM", "01:00 PM", "04:00 PM"];

  const bookTicketHandler = (e) => {
    e.preventDefault();
  };

  return (
    <div className="container ">
      <div className="row g-2">
        <div className="col-12 col-md-8 ">
          <div className="ps-2 ps-md-5">
            <h3 className="fw-semibold fs-4 mb-4 py-3">Movie details</h3>

            <figure className="movie-img">
              <img src={movie} alt="" className="h-100 object-fit-cover" />
            </figure>

            <p className="my-4">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. A
              ducimus aliquid quidem? Rem sint quod doloremque nesciunt
              voluptatibus aperiam illum quaerat distinctio sapiente maiores.
              Velit sint laborum illum, delectus et distinctio maxime autem
              repellendus non! Dicta alias temporibus ipsam cupiditate sunt
              nihil dolore ipsa. Nemo dolorem eos aperiam odit reprehenderit!
            </p>
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
            {/* Date selection */}
            <div className="mb-3">
              <h5 className="mb-3">
                Select Date<span className="text-danger">*</span>
              </h5>
              {dates.map((date, index) => (
                <button
                  key={index}
                  className={`btn btn-outline-primary me-2 mb-2 ${
                    selectedDate === date ? "active" : ""
                  }`}
                  onClick={() => handleDateSelect(date)}
                >
                  {date}
                </button>
              ))}
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
                  onClick={() => handleTimeSelect(time)}
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
              />
            </div>

            <div className="mt-3 text-center">
              <button className="btn btn-primary">Book ticket</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ViewShowDetails;
