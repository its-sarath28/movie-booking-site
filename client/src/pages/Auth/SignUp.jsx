import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import HashLoader from "react-spinners/HashLoader";

import { BASE_URL } from "../../config";

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    cnfPassword: "",
  });

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const signUpHandler = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const res = await axios.post(`${BASE_URL}/auth/sign-up`, formData);

      if (res.status === 200) {
        setIsLoading(false);
        navigate("/auth/sign-in");
        toast.success("User registered successfully");
      }
    } catch (err) {
      setIsLoading(false);
      toast.error(err.response.data.message);
      console.error("Error:", err);
    }
  };

  return (
    <div className="sign-in d-flex align-items-center justify-content-center">
      <div className="container">
        <div className="row d-flex justify-content-center">
          <div className="col col-md-6 ">
            <form
              onSubmit={signUpHandler}
              className="shadow-md rounded shadow p-3"
            >
              <h3 className="mb-0 fw-bolder">Sign Up</h3>
              <p>Fill in your details to create an account.</p>

              <div className="mb-3">
                <input
                  type="text"
                  name="name"
                  placeholder="Full name"
                  className="form-control"
                  autoFocus
                  onChange={handleInputChange}
                />
              </div>

              <div className="mb-3">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="form-control"
                  onChange={handleInputChange}
                />
              </div>

              <div className="mb-3">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="form-control"
                  onChange={handleInputChange}
                />
              </div>

              <div className="mb-3">
                <input
                  type="password"
                  name="cnfPassword"
                  placeholder="Confirm Password"
                  className="form-control"
                  onChange={handleInputChange}
                />
              </div>

              <div className="text-center">
                <button type="submit" className="btn btn-primary">
                  {isLoading ? (
                    <HashLoader size={25} color="#eee" />
                  ) : (
                    `Sign Up`
                  )}
                </button>
              </div>
            </form>
            <p className="text-center mb-0">
              Already have an account? <Link to={"/auth/sign-in"}>Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
