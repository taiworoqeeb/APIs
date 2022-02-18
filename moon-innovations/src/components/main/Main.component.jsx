import React from "react";
import bg from "../../assets/bg.png";

import "./Main.styles.css";

const Main = (props) => {
  return (
    <div
      className="bg"
      style={{ background: `url(${bg})`, backgroundSize: `contain` }}
    >
      <div className="motto">
        <h3>
          "Service with
          <br /> Commitment"
        </h3>
        <p>Thursday 10/03/2022</p>
      </div>
      {props.children}
    </div>
  );
};

export default Main;
