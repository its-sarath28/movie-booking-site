import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import HashLoader from "react-spinners/HashLoader";

import { BASE_URL } from "../../config";
import { UserContext } from "../../context/userContext";

const EditMovies = () => {
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    photo: "",
    price: "",
    description: "",
    firstShow: false,
    matineeShow: false,
    eveningShow: false,
    nightShow: false,
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingForm, setIsLoadingForm] = useState(false);
  const [previewURL, setPreviewURL] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);

  const { isLoggedIn } = useContext(UserContext);

  const navigate = useNavigate();
  const token = isLoggedIn;

  const { movieId } = useParams();

  // Get today's date
  const today = new Date().toISOString().split("T")[0];

  // Calculate 7 days from today
  const sevenDaysFromNow = new Date();
  sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
  const maxDate = sevenDaysFromNow.toISOString().split("T")[0];

  useEffect(() => {
    if (!token) {
      navigate("/autn/login");
    } else {
      try {
        setIsLoadingForm(true);
        const getMovie = async () => {
          const res = await axios.get(`${BASE_URL}/movies/${movieId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          setIsLoadingForm(false);
          setFormData(res.data);
          setCurrentImage(res.data.photo);
          // console.log(res.data);
        };

        getMovie();
      } catch (err) {
        setIsLoadingForm(false);
        console.log(err);
        toast(err.response.data.message);
      }
    }
  }, [token, navigate]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setPreviewURL(URL.createObjectURL(file));
  };

  const handleTimeCheckboxChange = (time) => {
    let updatedFormData = { ...formData };

    switch (time) {
      case "11:30 AM":
        updatedFormData.firstShow = !updatedFormData.firstShow;
        break;
      case "2:30 PM":
        updatedFormData.matineeShow = !updatedFormData.matineeShow;
        break;
      case "5 PM":
        updatedFormData.eveningShow = !updatedFormData.eveningShow;
        break;
      case "9 PM":
        updatedFormData.nightShow = !updatedFormData.nightShow;
        break;
      default:
        break;
    }

    setFormData(updatedFormData);
  };

  const editMovieHandler = async (e) => {
    e.preventDefault();

    console.log(formData);

    // Check if a new image has been selected
    if (!selectedFile && !previewURL) {
      // If no new image is selected, update movie details without modifying the image
      try {
        setIsLoading(true);
        const response = await axios.put(
          `${BASE_URL}/movies/edit-movie/${movieId}`,
          formData, // Use formData directly without modifying it
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          setIsLoading(false);
          navigate("/admin/home");
          toast.success(`Movie updated successfully`);
        }
      } catch (err) {
        setIsLoading(false);
        console.error(err);
        toast.error("Something went wrong!");
      }
    } else {
      // If a new image is selected, proceed with uploading the image and updating movie details
      if (!selectedFile) {
        toast.error(`Please select an image`);
        return;
      }

      const formDataToUpload = new FormData();
      formDataToUpload.append("file", selectedFile);
      formDataToUpload.append(
        "upload_preset",
        import.meta.env.VITE_UPLOAD_PRESET
      );

      try {
        setIsLoading(true);
        const res = await axios.post(
          `https://api.cloudinary.com/v1_1/${
            import.meta.env.VITE_CLOUD_NAME
          }/image/upload`,
          formDataToUpload
        );

        if (res.status === 200) {
          const imageURL = res.data.secure_url;
          const updatedFormData = {
            ...formData,
            photo: imageURL,
          };

          const response = await axios.put(
            `${BASE_URL}/movies/edit-movie/${movieId}`,
            updatedFormData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.status === 200) {
            setIsLoading(false);
            navigate("/admin/home");
            toast.success(`Movie updated successfully`);
          }
        }
      } catch (err) {
        setIsLoading(false);
        console.error(err);
        toast.error("Something went wrong!");
      }
    }
  };

  return (
    <div className="container addMedicine d-flex flex-column align-itemscenter justify-content-center">
      <div className="row d-flex justify-content-center">
        <div className="col mt-3">
          {isLoadingForm && (
            <div className="d-flex align-items-center justify-content-center">
              <HashLoader size={35} color="#333" />
            </div>
          )}

          {!isLoadingForm && (
            <form
              onSubmit={editMovieHandler}
              className="shadow-lg px-4 py-2 text-center rounded"
            >
              <h3 className="mb-4">Edit Movie</h3>
              <div className="row">
                <div className="col-md-6">
                  <div>
                    <input
                      type="text"
                      name="name"
                      placeholder="Movie name"
                      className="form-control"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="my-3">
                    <input
                      type="date"
                      name="daySlots"
                      placeholder="Date"
                      className="form-control"
                      value={formData.date}
                      onChange={handleInputChange}
                      min={today}
                      max={maxDate}
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="row row-cols-2">
                    <div className="d-flex align-items-center gap-4">
                      <p className="text-start mb-0">11:30 AM</p>
                      <span>
                        <label className="switch">
                          <input
                            type="checkbox"
                            onChange={() =>
                              handleTimeCheckboxChange("11:30 AM")
                            }
                            checked={formData.firstShow === true}
                          />
                          <span className="slider round"></span>
                        </label>
                      </span>
                    </div>
                    <div className="d-flex align-items-center gap-4">
                      <p className="text-start mb-0">2:30 PM</p>
                      <span>
                        <label className="switch">
                          <input
                            type="checkbox"
                            onChange={() => handleTimeCheckboxChange("2:30 PM")}
                            checked={formData.matineeShow === true}
                          />
                          <span className="slider round"></span>
                        </label>
                      </span>
                    </div>
                    <div className="d-flex align-items-center gap-4 mt-4">
                      <p className="text-start mb-0">5 PM</p>
                      <span>
                        <label className="switch">
                          <input
                            type="checkbox"
                            onChange={() => handleTimeCheckboxChange("5 PM")}
                            checked={formData.eveningShow === true}
                          />
                          <span className="slider round"></span>
                        </label>
                      </span>
                    </div>
                    <div className="d-flex align-items-center gap-4 mt-4">
                      <p className="text-start mb-0">9 PM</p>
                      <span>
                        <label className="switch">
                          <input
                            type="checkbox"
                            onChange={() => handleTimeCheckboxChange("9 PM")}
                            checked={formData.nightShow === true}
                          />
                          <span className="slider round"></span>
                        </label>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <div className="row row-cols-sm-2 align-items-center">
                  <div className="col-md-6 d-flex align-items-center justify-content-start">
                    {previewURL && (
                      <figure className="avatar-img d-flex mt-2">
                        <img
                          src={previewURL}
                          alt="avatar"
                          className="w-100 object-fit-cover rounded-circle"
                        />
                      </figure>
                    )}

                    {!previewURL && currentImage && (
                      <figure className="avatar-img d-flex mt-2">
                        <img
                          src={currentImage}
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
                  <div className="col-md-6">
                    <div className="">
                      <input
                        type="number"
                        name="price"
                        placeholder="Ticket price"
                        className="form-control"
                        value={formData.price}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <textarea
                  name="description"
                  rows="5"
                  placeholder="Description"
                  className="form-control overflow-auto"
                  value={formData.description}
                  onChange={handleInputChange}
                ></textarea>
              </div>

              <div>
                <button type="submit" className="btn btn-success">
                  {isLoading ? (
                    <HashLoader size={25} color="#eee" />
                  ) : (
                    `Update Movie`
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditMovies;
