import React from "react";

const MyBookings = () => {
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
                    <th scope="col">Number of tickets</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="align-middle">
                    <th scope="row">1</th>
                    <td>Mark</td>
                    <td>Otto</td>
                    <td>@mdo</td>
                    <td>@mdo</td>
                    <td>
                      <button className="btn btn-dark">Download Ticket</button>
                    </td>
                  </tr>
                  <tr className="align-middle">
                    <th scope="row">1</th>
                    <td>Mark</td>
                    <td>Otto</td>
                    <td>@mdo</td>
                    <td>@mdo</td>
                    <td>
                      <button className="btn btn-dark">Download Ticket</button>
                    </td>
                  </tr>
                  <tr className="align-middle">
                    <th scope="row">1</th>
                    <td>Mark</td>
                    <td>Otto</td>
                    <td>@mdo</td>
                    <td>@mdo</td>
                    <td>
                      <button className="btn btn-dark">Download Ticket</button>
                    </td>
                  </tr>
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
