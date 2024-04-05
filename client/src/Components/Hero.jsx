import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const Hero = () => {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col">
          <Swiper
            modules={[Autoplay, Pagination]}
            autoplay={{ delay: 5000 }}
            pagination={{ clickable: true }}
            className="mySwiper"
          >
            <SwiperSlide>
              <div className="carousel-item active">
                <img
                  src="https://i.pinimg.com/236x/1e/b8/74/1eb874f4cec4c16b402c1edbca01c172.jpg"
                  className="d-block w-100"
                  alt="hero"
                />
                <div className="carousel-caption">
                  <h5>Text 1</h5>
                  <p>Description 1</p>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="carousel-item">
                <img
                  src="https://i.pinimg.com/236x/1e/b8/74/1eb874f4cec4c16b402c1edbca01c172.jpg"
                  className="d-block w-100"
                  alt="hero"
                />
                <div className="carousel-caption">
                  <h5>Text 2</h5>
                  <p>Description 2</p>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="carousel-item">
                <img
                  src="https://i.pinimg.com/236x/1e/b8/74/1eb874f4cec4c16b402c1edbca01c172.jpg"
                  className="d-block w-100"
                  alt="hero"
                />
                <div className="carousel-caption">
                  <h5>Text 3</h5>
                  <p>Description 3</p>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default Hero;
