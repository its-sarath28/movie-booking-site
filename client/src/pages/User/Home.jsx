import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";
import axios from "axios";
import { BASE_URL } from "../../config";
import toast from "react-hot-toast";

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
    <div className="container py-5 home">
      <div className="row d-flex justify-content-center mb-5">
        <div className="col-md-4 col-sm-6 col-12">
          <input
            type="search"
            placeholder="Search movies..."
            className="form-control py-2"
          />
        </div>
      </div>
      {!isLoading && movies.length === 0 && (
        <p className="text-center">No movies</p>
      )}
      <div className="row row-cols-1 row-cols-md-3 g-4">
        {movies?.map(({ _id: id, title, photo, description }) => (
          <div className="col" key={id}>
            <div className="card">
              <img
                src={photo}
                className="card-img-top object-fit-cover"
                alt="movie"
              />
              <div className="card-body">
                <h5 className="card-title">{title}</h5>
                <p className="card-text">{description}</p>
              </div>

              <div className="ps-3 pb-3">
                <Link
                  to={`/movies/${id}`}
                  className="btn btn-primary d-flex align-items-center"
                >
                  Book ticket
                  <MdOutlineKeyboardDoubleArrowRight className="ms-2" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
