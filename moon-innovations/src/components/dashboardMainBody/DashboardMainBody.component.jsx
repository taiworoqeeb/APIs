import React from "react";
import DashboardBodyLog from "../dashboardBodyLog/DashboardBodyLog.component";
import DashboardBodyControl from "../dashboardBodyControl/DashboardBodyControl.component";

import "./DashboardMainBody.styles.css";
const DashboardMainBody = () => {
  return (
    <div className="dashboardView--main__body vert--grow__main--body">
      <DashboardBodyLog />
      <DashboardBodyControl />
    </div>
  );
};

export default DashboardMainBody;
