import React from "react";
import InverterControl from "../inverterControl/InverterControl.component";
import InverterReadings from "../inverterReadings/InverterReadings.component";
import InverterTest from "../invertTest/InverterTest.component";

import "./DashboardBodyControl.styles.css";

const DashboardBodyControl = () => {
  return (
    <div className="dashboard-body-ctrl">
      <InverterControl />
      <InverterReadings />
      <InverterTest />
    </div>
  );
};

export default DashboardBodyControl;
