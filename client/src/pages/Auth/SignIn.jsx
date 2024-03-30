import { useContext, useState } from "react";
import HashLoader from "react-spinners/HashLoader";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

import { BASE_URL } from "../../config";
import { UserContext } from "../../context/userContext";

const SignIn = () => {
  const [formData, setFormData] = useState({
    name: "",
    password: "",
  });

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const { setIsLoggedIn, setRole } = useContext(UserContext);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const signInHandler = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const res = await axios.post(`${BASE_URL}/auth/sign-in`, formData);

      if (res.status === 200) {
        setIsLoading(false);
        const { token, role } = res.data;

        setIsLoggedIn(token);
        setRole(role);

        if (role === "admin") {
          navigate("/admin/dashboard");
          toast.success("Logged in");
        } else {
          navigate("/");
          toast.success("Logged in");
        }
      }
    } catch (err) {
      setIsLoading(false);
      console.log(err);
      toast.error(err.response.data.message);
    }
  };

  return (
    <div className="sign-in d-flex align-items-center justify-content-center">
      <div className="container">
        <div className="row d-flex justify-content-center">
          <div className="col col-md-6 ">
            <form
              onSubmit={signInHandler}
              className="shadow-md rounded shadow p-3"
            >
              <h3 className="mb-0 fw-bolder">Sign in</h3>
              <p>Fill in your credentials to signin.</p>

              <div className="mb-3">
                <input
                  type="email"
                  placeholder="Email"
                  className="form-control"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>

              <div className="mb-3">
                <input
                  type="password"
                  placeholder="Password"
                  className="form-control"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>

              <div className="text-center">
                <button type="submit" className="btn btn-primary">
                  {isLoading ? (
                    <HashLoader size={25} color="#eee" />
                  ) : (
                    `Sign In`
                  )}
                </button>
              </div>
            </form>
            <p className="text-center mb-0">
              Don't have an account? <Link to={"/auth/sign-up"}>sign-up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
