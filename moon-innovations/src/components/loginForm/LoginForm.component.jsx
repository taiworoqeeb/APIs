import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate} from "react-router-dom";
import { setUserSession } from "../../utils/utils";
import Logo from "../../assets/logo.png";
import { FaTimes } from "react-icons/fa";
import history from "../../utils/history";


import "./LoginForm.styles.css";

const LoginForm = ({ logAcc }) => {
  let navigate = useNavigate();
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const HandleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    axios
      .post("/auth/signin-admin", {
        username: user,
        password: password,
      })
      .then((res) => {
        setUserSession(res.data.token, res.data.username);
        setLoading(false);
        setUser("");
        setPassword("");
        //navigate("/dashboard");
        history.push('/dashboard');
        history.go();
        //<Redirect to="/dashboard" />;
        console.log("response", res);
      })
      .catch((err) => {
        setLoading(false);
        setUser("");
        setPassword("");
        // console.log(err.response.data);
        if (err.response.status === 400) {
          setErrMsg(err.response.data);
          // console.log(err);
        }
      });

    // console.log(user, password);
  };
  return (
    <div className="loginForm">
      <div className="form-head">
        <img src={Logo} alt="Moon Innovation" />
        <h3>{logAcc}</h3>
        <Link to="/">
          <FaTimes className="timesFont" />
        </Link>
      </div>
      <form className="form" onSubmit={HandleSubmit}>
        <div className="form-control">
          <label htmlFor="username"></label>
          <input
            type="text"
            onChange={(e) => setUser(e.target.value)}
            name="username"
            value={user}
            placeholder="Username"
            required
          />
        </div>
        <div className="form-control">
          <label htmlFor="password"></label>
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            name="password"
            value={password}
            placeholder=".........."
            required
          />
        </div>
        {errMsg && (
          <p style={{ fontSize: "0.8rem", color: "red" }}>{`*** ${
            " " + errMsg + " "
          }  ***`}</p>
        )}
        <button>{!loading ? "Login" : "Loading..."}</button>
      </form>
    </div>
  );
};

export default LoginForm;
