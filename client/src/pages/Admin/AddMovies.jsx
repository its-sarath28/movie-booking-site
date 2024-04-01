import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import HashLoader from "react-spinners/HashLoader";
import axios from "axios";
import toast from "react-hot-toast";

import { UserContext } from "../../context/userContext";
import { BASE_URL } from "../../config";

const AddMovies = () => {
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
  const [previewURL, setPreviewURL] = useState(null);

  const [errors, setErrors] = useState({
    name: "",
    date: "",
    photo: "",
    price: "",
    description: "",
    show: "",
  });

  const navigate = useNavigate();
  const { isLoggedIn } = useContext(UserContext);
  const token = isLoggedIn;

  const today = new Date().toISOString().split("T")[0];
  const sevenDaysFromNow = new Date();
  sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
  const maxDate = sevenDaysFromNow.toISOString().split("T")[0];

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

  const addMovieHandler = async (e) => {
    e.preventDefault();

    console.log(formData);
    try {
      setIsLoading(true);

      let updatedFormData = { ...formData }; // Create a mutable copy of formData

      if (selectedFile) {
        const formDataToUpload = new FormData();
        formDataToUpload.append("file", selectedFile);
        formDataToUpload.append(
          "upload_preset",
          import.meta.env.VITE_UPLOAD_PRESET
        );

        const res = await axios.post(
          `https://api.cloudinary.com/v1_1/${
            import.meta.env.VITE_CLOUD_NAME
          }/image/upload`,
          formDataToUpload
        );

        if (res.status === 200) {
          const imageURL = res.data.secure_url;
          updatedFormData = { ...updatedFormData, photo: imageURL }; // Update the copy of formData
        }
      }

      const response = await axios.post(
        `${BASE_URL}/movies/add-movie`,
        updatedFormData,
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
          date: errors.date || "",
          photo: errors.photo || "",
          price: errors.price || "",
          description: errors.description || "",
          show: errors.show || "",
        });
      }
    }
  };

  return (
    <div
      className="container d-flex flex-column align-items-center justify-content-center"
      style={{ minHeight: "80dvh" }}
    >
      <div className="row d-flex justify-content-center">
        <div className="col">
          <form
            onSubmit={addMovieHandler}
            className="shadow-lg p-4 text-center rounded"
          >
            <h3 className="mb-4">Add Movie</h3>
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
                  {errors.name && (
                    <p className="text-start text-danger">{errors.name}</p>
                  )}
                </div>

                <div className="my-3">
                  <input
                    type="date"
                    name="date"
                    placeholder="Date"
                    className="form-control"
                    value={formData.date}
                    onChange={handleInputChange}
                    min={today}
                    max={maxDate}
                  />
                  {errors.date && (
                    <p className="text-start text-danger">{errors.date}</p>
                  )}
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
                          onChange={() => handleTimeCheckboxChange("11:30 AM")}
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
                {errors.show && (
                  <p className="text-start text-danger">{errors.show}</p>
                )}
              </div>
            </div>

            <div className="my-3">
              <div className="row row-cols-sm-2 align-items-center">
                <div className="col-md-6  align-items-center justify-content-start">
                  <div className="d-flex">
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
                  {errors.photo && (
                    <p className="text-start text-danger">{errors.photo}</p>
                  )}
                </div>
                <div className="col-md-6 mt-2 mt-sm-0">
                  <div className="">
                    <input
                      type="number"
                      name="price"
                      placeholder="Ticket price"
                      className="form-control"
                      value={formData.price}
                      onChange={handleInputChange}
                    />
                    {errors.price && (
                      <p className="text-start text-danger">{errors.price}</p>
                    )}
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

export default AddMovies;
