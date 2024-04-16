import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import HashLoader from "react-spinners/HashLoader";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/swiper-bundle.css";

import { BASE_URL } from "../../config";
import Hero from "../../Components/Hero";

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    try {
      setIsLoading(true);
      const getMovies = async () => {
        const res = await axios.get(`${BASE_URL}/movies`);

        if (res.status === 200) {
          setMovies(res.data);
          // console.log(res.data);
          setIsLoading(false);
        }
      };

      getMovies();
    } catch (err) {
      console.log("Error: ", err);
      toast.error(`An error occurred while fetching movies.`);
    }
  }, []);

  return (
    <>
      <Hero />
      <div className="container-fluid px-2">
        <div className="row mx-0 mt-5">
          {/* Movies Section */}
          <div className="col">
            <div className="container home">
              {isLoading && (
                <div className="d-flex align-items-center justify-content-center">
                  <HashLoader size={35} color="#333" />
                </div>
              )}

              {/* Movies List */}
              {!isLoading && (
                <Swiper
                  modules={[Navigation]}
                  navigation
                  className="swiper-top"
                  spaceBetween={30}
                  slidesPerView={1}
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
                      slidesPerView: 4,
                      spaceBetween: 30,
                    },
                  }}
                >
                  {movies?.map((movie) => (
                    <SwiperSlide key={movie._id}>
                      <div className="col" key={movie._id}>
                        <div
                          className="card border-0"
                          style={{ height: "30rem" }}
                        >
                          {movie.imageURL ? (
                            <img
                              src={movie.imageURL}
                              alt={movie.name}
                              className="rounded"
                              style={{
                                width: "auto",
                                height: "18rem",
                                objectFit: "contain",
                                aspectRatio: "3/4",
                              }}
                            />
                          ) : (
                            movie.photo && (
                              <img
                                src={movie.photo}
                                alt={movie.name}
                                className="rounded"
                                style={{
                                  width: "auto",
                                  height: "18rem",
                                  objectFit: "fill",
                                  aspectRatio: "1/1",
                                }}
                              />
                            )
                          )}
                          <div className="card-body p-0">
                            <Link
                              to={`/movies/${movie._id}`}
                              className="card-title movie-heading"
                            >
                              {movie.name}
                            </Link>
                            <p className="card-text">{movie.genere}</p>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
