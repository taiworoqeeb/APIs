import React from "react";
import { BsToggle2On } from "react-icons/bs";
import inverter from "../../assets/inverter.png";

import "./InverterControl.styles.css";

const InverterControl = () => {
  return (
    <div className="inverter--ctrl">
      <div className="control--switch">
        <h3>Inverter Telemetry</h3>
        <div className="switch--meter">
          <img src={inverter} alt="" />
          <p>
            <BsToggle2On className="toggleFont" />
            <br />
            <span>OFF/ON</span>
          </p>
        </div>
      </div>
      <div className="inverter--details">
        <div className="client-ss-mex">
          <p>
            Client SS <span>2A521</span>
          </p>
          <p className="mexD">MexD: R12</p>
        </div>
        <p className="members">2 Members have access</p>
      </div>
    </div>
  );
};

export default InverterControl;
