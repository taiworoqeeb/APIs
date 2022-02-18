import React, { useState } from "react";
import Logo from "../../assets/logo.png";
import { BsToggle2On, BsToggle2Off } from "react-icons/bs";
import { Link } from "react-router-dom";

import "./SidebarMenu.styles.css";

const SidebarMenu = () => {
  const [login, setLogin] = useState("/login");

  const HandleLogin = () => {
    if (login === "/login") {
      setLogin("/login-ad");
    } else {
      setLogin("/login");
    }
  };
  return (
    <div className="sidebar-menu">
      <div className="logo-shadow">
        <img src={Logo} alt="moon innovation" />
        <div className="shadow"></div>
      </div>
      <div className="logger-switch">
        <div className="switch">
          <h2>Admin</h2>
          <h2>|</h2>
          <h2>SA</h2>
        </div>
        <div className="togglebtn" onClick={HandleLogin}>
          {login === "/login" ? (
            <BsToggle2On className="toggleFont" />
          ) : (
            <BsToggle2Off className="toggleFont" />
          )}
        </div>
      </div>
      <Link to={login} className="btn">
        Login
      </Link>
    </div>
  );
};

export default SidebarMenu;
