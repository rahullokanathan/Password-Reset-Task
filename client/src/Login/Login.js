import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import "./Login.css";

const Login = () => {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  let url = "https://password-reset-pg.herokuapp.com";

  const handleClick = async () => {
    if (email !== "" && password !== "") {
      try {
        await axios
          .post(`${url}/user/login`, { email, password })
          .then((response) => {
            if (!response.data.token) {
              alert(response.data.message);
            } else {
              setToken(response.data.token);
              history.push("/homepage");
            }
          });
        setEmail("");
        setPassword("");
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("Please fill all the details");
    }
  };
  return (
    <div className="login-page">
      <h2 className="login-page-heading">Sign in to continue</h2>
      <div className="login-form  col-md-4">
        <div className="form-group">
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            className="form-control"
            id="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </div>
        <div className="form-group">
          <label htmlFor="pass">Password</label>
          <input
            type="password"
            className="form-control"
            id="pass"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </div>

        <button
          type="submit"
          className=" login-button btn btn-success"
          onClick={handleClick}
        >
          Login
        </button>

        <div className="additional-options">
          <Link to="/create-account">Create new account</Link>
          <Link to="/forgot-password">Forgot Password?</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
