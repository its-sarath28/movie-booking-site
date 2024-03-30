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
    daySlots: "",
    photo: "",
    timeSlots: [],
    description: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
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
        setIsLoading(true);
        const getMovie = async () => {
          const res = await axios.get(`${BASE_URL}/movies/${movieId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          setIsLoading(false);
          setFormData(res.data);
          setCurrentImage(res.data.photo);
          // console.log(res.data);
        };

        getMovie();
      } catch (err) {
        setIsLoading(false);
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
    const updatedTimes = [...formData.timeSlots];
    const isChecked = updatedTimes.includes(time);

    if (isChecked) {
      // If time is already in the array, remove it
      const index = updatedTimes.indexOf(time);
      updatedTimes.splice(index, 1);
    } else {
      // If time is not in the array, add it
      updatedTimes.push(time);
    }

    setFormData({ ...formData, timeSlots: updatedTimes });
  };

  const editMovieHandler = async (e) => {
    e.preventDefault();

    console.log(formData);

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

        // console.log(`updated form data is: `);
        // console.log(updatedFormData);

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
  };

  return (
    <div className="container addMedicine d-flex flex-column align-itemscenter justify-content-center">
      <div className="row d-flex justify-content-center">
        <div className="col-md-5">
          {isLoading && (
            <div className="d-flex align-items-center justify-content-center">
              <HashLoader size={35} color="#333" />
            </div>
          )}

          {!isLoading && (
            <form
              onSubmit={editMovieHandler}
              className="shadow-lg p-4 text-center rounded"
            >
              <h3 className="mb-4">Edit Movie</h3>
              <div className="my-3">
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
                  value={formData.daySlots}
                  onChange={handleInputChange}
                  min={today}
                  max={maxDate}
                />
              </div>

              <div className="my-3 d-flex align-items-center gap-3">
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

              <div className="my-3 text-start">
                <p className="mb-0">Select Times:</p>
                <div className="row row-cols-2 ps-3">
                  <div className="form-check mt-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value={formData.timeSlots}
                      checked={
                        formData &&
                        formData.timeSlots &&
                        formData.timeSlots.includes("11.30 AM")
                      }
                      onChange={() => handleTimeCheckboxChange("11.30 AM")}
                    />
                    <label className="form-check-label" htmlFor="time1">
                      11.30 AM
                    </label>
                  </div>

                  <div className="form-check mt-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value={formData.timeSlots}
                      checked={
                        formData &&
                        formData.timeSlots &&
                        formData.timeSlots.includes("2.30 PM")
                      }
                      onChange={() => handleTimeCheckboxChange("2.30 PM")}
                    />
                    <label className="form-check-label" htmlFor="time2">
                      2.30 PM
                    </label>
                  </div>

                  <div className="form-check mt-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value={formData.timeSlots}
                      checked={
                        formData &&
                        formData.timeSlots &&
                        formData.timeSlots.includes("5 PM")
                      }
                      onChange={() => handleTimeCheckboxChange("5 PM")}
                    />
                    <label className="form-check-label" htmlFor="time3">
                      5 PM
                    </label>
                  </div>

                  <div className="form-check mt-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value={formData.timeSlots}
                      checked={
                        formData &&
                        formData.timeSlots &&
                        formData.timeSlots.includes("9 PM")
                      }
                      onChange={() => handleTimeCheckboxChange("9 PM")}
                    />
                    <label className="form-check-label" htmlFor="time4">
                      9 PM
                    </label>
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
