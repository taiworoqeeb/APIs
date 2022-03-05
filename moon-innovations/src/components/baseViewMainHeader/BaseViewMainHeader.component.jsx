import React, { useState } from "react";
import { Link } from "react-router-dom";
import { removeUserSession } from "../../utils/utils";
import profilePics from "../../assets/profile-pics.jpg";
import { BiSearchAlt, BiLogOut } from "react-icons/bi";
import { FaList, FaEllipsisV } from "react-icons/fa";
import { FiSettings } from "react-icons/fi";
import { CgMenuGridR } from "react-icons/cg";
import { IoRefreshCircleOutline } from "react-icons/io5";
import { BsBellFill } from "react-icons/bs";

import "./BaseViewMainHeader.styles.css";

const BaseViewMainHeader = () => {
  const [logout, setLogout] = useState(false);
  return (
    <div className="baseview-header">
      <ul className="navigation">
        <li className="nav--item">
          <input type="search" />
          {/* {<BiSearchAlt />} */}
        </li>
        <li className="nav--item">
          {<FaList />} <span>Menu</span>{" "}
        </li>
        <li className="nav--item">
          <span className="badge">4</span> <span>Settings</span>{" "}
          {<FiSettings className="settings" />}
        </li>
      </ul>
      <div className="profile">
        <div className="notifications">
          <IoRefreshCircleOutline />
          <CgMenuGridR />
          <BsBellFill />
        </div>
        <div className="profile-details">
          <div className="profile--pics">
            <img src={profilePics} alt="profile" />
          </div>
          <div className="profile--name">
            <h4>Alvaro Monte</h4>
            <p>CSO MON</p>
          </div>
          <div className="ellipsis">
            <FaEllipsisV onClick={() => setLogout(!logout)} />
            {console.log(logout)}
            <div className={!logout ? "logout" : "logout logout--display"}>
              <Link onClick={() => removeUserSession()} to="/login">
                <BiLogOut /> Logout
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BaseViewMainHeader;
