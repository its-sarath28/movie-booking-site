import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HashLoader from "react-spinners/HashLoader";
import { UserContext } from "../../context/userContext";
import axios from "axios";
import { BASE_URL } from "../../config";
import toast from "react-hot-toast";

const AddMovie = () => {
  const [movieData, setMovieData] = useState({
    name: "",
    photo: "",
    imageURL: "",
    genere: "",
    price: "",
    description: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [previewURL, setPreviewURL] = useState(null);
  const [errors, setErrors] = useState({
    name: "",
    picture: "",
    genere: "",
    price: "",
    description: "",
  });

  const navigate = useNavigate();
  const { isLoggedIn } = useContext(UserContext);
  const token = isLoggedIn;

  useEffect(() => {
    if (!token) {
      navigate("/auth/sign-in");
    }
  }, [token, navigate]);

  const handleInputChange = (e) => {
    setMovieData({ ...movieData, [e.target.name]: e.target.value });
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setPreviewURL(URL.createObjectURL(file));
  };

  const addMovieHandler = async (e) => {
    e.preventDefault();

    // console.log(movieData);
    try {
      setIsLoading(true);

      let updatedMovieData = { ...movieData };

      if (selectedFile) {
        const movieImageToUpload = new FormData();
        movieImageToUpload.append("file", selectedFile);
        movieImageToUpload.append(
          "upload_preset",
          import.meta.env.VITE_UPLOAD_PRESET
        );

        const res = await axios.post(
          `https://api.cloudinary.com/v1_1/${
            import.meta.env.VITE_CLOUD_NAME
          }/image/upload`,
          movieImageToUpload
        );

        if (res.status === 200) {
          const imageURL = res.data.secure_url;
          updatedMovieData = { ...updatedMovieData, photo: imageURL };
        }
      } else if (imageUrl) {
        updatedMovieData = { ...updatedMovieData, imageURL: imageUrl };
      }

      const response = await axios.post(
        `${BASE_URL}/movies/add-movie`,
        updatedMovieData,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setIsLoading(false);
        navigate("/admin/dashboard");
        toast.success(`Movie added successfully`);
      }
    } catch (err) {
      setIsLoading(false);
      console.error(err);
      if (err.response && err.response.data && err.response.data.errors) {
        const { errors } = err.response.data;

        setErrors({
          name: errors.name || "",
          picture: errors.picture || "",
          genere: errors.genere || "",
          price: errors.price || "",
          description: errors.description || "",
        });
      }
    }
  };

  return (
    <div className="container">
      <div
        className="row d-flex align-items-center justify-content-center"
        style={{ minHeight: "80vh" }}
      >
        <div className="col-10">
          <form
            onSubmit={addMovieHandler}
            className="shadow-lg p-4 text-center rounded"
          >
            <h3 className="mb-4">Add Movie</h3>
            <div className="row mb-3">
              <div className="col">
                <input
                  type="text"
                  name="name"
                  placeholder="Movie name"
                  className="form-control"
                  value={movieData.name}
                  onChange={handleInputChange}
                />
                {errors.name && (
                  <p className="text-start text-danger">{errors.name}</p>
                )}
              </div>
            </div>

            <div className="row row-cols-md-2 mb-3">
              <div>
                <div className="d-flex align-items-center">
                  {previewURL && (
                    <figure className="avatar-img d-flex mt-2">
                      <img
                        src={previewURL}
                        alt="avatar"
                        className="w-100 object-fit-cover rounded-circle"
                      />
                    </figure>
                  )}

                  <div className="p-0 m-0">
                    <input
                      type="file"
                      name="photo"
                      id="customFile"
                      accept=".jpg, .png, .jpeg"
                      className="d-none absolute top-0 left-0 cursor-pointer"
                      onChange={handleFileInputChange}
                    />
                    <label
                      htmlFor="customFile"
                      className="p-2 overflow-hidden bg-secondary text-white font-semibold rounded"
                    >
                      Upload photo
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <div>
                  <input
                    type="url"
                    name="imageUrl"
                    placeholder="Image URL"
                    className="form-control"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                  />
                </div>
              </div>
              {errors.picture && (
                <p className="text-start text-danger">{errors.picture}</p>
              )}
            </div>

            <div className="row row-cols-md-2 mb-3">
              <div>
                <div>
                  <input
                    type="text"
                    name="genere"
                    placeholder="Movie genere"
                    className="form-control"
                    value={movieData.genere}
                    onChange={handleInputChange}
                  />
                </div>
                {errors.genere && (
                  <p className="text-start text-danger">{errors.genere}</p>
                )}
              </div>
              <div>
                <div>
                  <input
                    type="number"
                    name="price"
                    placeholder="Ticket price"
                    className="form-control"
                    value={movieData.price}
                    onChange={handleInputChange}
                  />
                </div>
                {errors.price && (
                  <p className="text-start text-danger">{errors.price}</p>
                )}
              </div>
            </div>

            <div className="mb-3">
              <textarea
                name="description"
                rows="5"
                placeholder="Description"
                className="form-control overflow-auto"
                value={movieData.description}
                onChange={handleInputChange}
              ></textarea>
              {errors.description && (
                <p className="text-start text-danger">{errors.description}</p>
              )}
            </div>

            <div>
              <button type="submit" className="btn btn-primary">
                {isLoading ? (
                  <HashLoader size={25} color="#eee" />
                ) : (
                  `Add Movie`
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddMovie;
