const Hero = () => {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col">
          <div id="carouselExampleCaptions" className="carousel slide">
            <div className="carousel-indicators">
              <button
                type="button"
                data-bs-target="#carouselExampleCaptions"
                data-bs-slide-to="0"
                className="active"
                aria-current="true"
                aria-label="Slide 1"
              ></button>
              <button
                type="button"
                data-bs-target="#carouselExampleCaptions"
                data-bs-slide-to="1"
                aria-label="Slide 2"
              ></button>
              <button
                type="button"
                data-bs-target="#carouselExampleCaptions"
                data-bs-slide-to="2"
                aria-label="Slide 3"
              ></button>
            </div>
            <div className="carousel-inner">
              <div className="carousel-item active">
                <img
                  src="https://i.pinimg.com/474x/3f/ff/d7/3fffd702d48852ede79ed71d04f36a2b.jpg"
                  className="d-block w-50 mx-auto object-fit-cover"
                  style={{ height: "30rem" }}
                  alt="..."
                />
                {/* <div className="carousel-caption d-none d-md-block">
                  <h5>First slide label</h5>
                  <p>
                    Some representative placeholder content for the first slide.
                  </p>
                </div> */}
              </div>
              <div className="carousel-item">
                <img
                  src="https://i.pinimg.com/474x/fe/f2/29/fef229ab3a2c8c7193b569fe02265da2.jpg"
                  className="d-block w-50 mx-auto object-fit-cover"
                  style={{ height: "30rem" }}
                  alt="..."
                />
                {/* <div className="carousel-caption d-none d-md-block">
                  <h5>Second slide label</h5>
                  <p>
                    Some representative placeholder content for the second
                    slide.
                  </p>
                </div> */}
              </div>
              <div className="carousel-item">
                <img
                  src="https://i.pinimg.com/236x/6f/69/00/6f690089947a98659643e2ce8f5f0200.jpg"
                  className="d-block w-50 mx-auto object-fit-cover"
                  style={{ height: "30rem" }}
                  alt="..."
                />
                {/* <div className="carousel-caption d-none d-md-block">
                  <h5>Third slide label</h5>
                  <p>
                    Some representative placeholder content for the third slide.
                  </p>
                </div> */}
              </div>
            </div>
            <button
              className="carousel-control-prev "
              type="button"
              data-bs-target="#carouselExampleCaptions"
              data-bs-slide="prev"
            >
              <span
                className="carousel-control-prev-icon rounded-circle bg-dark"
                aria-hidden="true"
              ></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button
              className="carousel-control-next "
              type="button"
              data-bs-target="#carouselExampleCaptions"
              data-bs-slide="next"
            >
              <span
                className="carousel-control-next-icon rounded-circle bg-dark"
                aria-hidden="true"
              ></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
