import { QRCodeSVG } from "qrcode.react";

const TicketPDF = (prop) => {
  // const { _id: id, movie, numberOfTickets, showDate, showTime } = prop;
  return (
    <div className="container" id="pdf-content">
      <div className="row height d-flex flex-column align-items-center justify-content-center">
        <div className="col-md-6 rounded">
          <>
            <div className="bg-danger ps-4 py-3 rounded-top">
              <h3 className="text-white mb-0 fs-6">BookMyMovie</h3>
            </div>

            <div className="ticketDetails bg-light">
              <div className="row">
                <div className="col-md-8 ps-4 my-3 border-md-end border-4">
                  {/* <h2 className="fw-bold movieName">{movie}</h2> */}
                  <span className="subHeading text-muted fw-semibold">
                    MOVIE
                  </span>

                  <div className="row row-cols-3 mt-4">
                    <div className="">
                      {/* <h2 className="fw-bold heading2">{showDate}</h2> */}
                      <span className="subHeading text-muted fw-semibold">
                        DATE
                      </span>
                    </div>
                    <div className="">
                      {/* <h2 className="fw-bold heading2">{showTime}</h2> */}
                      <span className="subHeading text-muted fw-semibold">
                        TIME
                      </span>
                    </div>
                    <div className="">
                      {/* <h2 className="fw-bold heading2">{numberOfTickets}</h2> */}
                      <span className="subHeading text-muted fw-semibold">
                        TICKETS
                      </span>
                    </div>
                  </div>

                  <div className="mt-3">
                    {/* <h2 className="fw-bold heading2">{id}</h2> */}
                    <span className="subHeading text-muted fw-semibold">
                      BOOKING ID
                    </span>
                  </div>
                </div>

                <div className="col-md-4 d-flex align-items-center justify-content-center">
                  {/* <QRCodeSVG
                    value={`
                      Movie name: ${movie}
                      Show date: ${showDate}
                      Show time: ${showTime}
                      Number of tickets: ${numberOfTickets}
                      Booking ID: ${id}
                      `}
                  /> */}
                  ,
                </div>
              </div>
            </div>
          </>
        </div>
      </div>
    </div>
  );
};

export default TicketPDF;
