import React from "react";
import BaseViewMainHeader from "../baseViewMainHeader/BaseViewMainHeader.component";
import DashboardMainBody from "../dashboardMainBody/DashboardMainBody.component";

import "./DashboardMain.styles.css";

const DashboardMain = () => {
  return (
    <div className="dashboard--view">
      <BaseViewMainHeader />
      <DashboardMainBody />
    </div>
  );
};

export default DashboardMain;
