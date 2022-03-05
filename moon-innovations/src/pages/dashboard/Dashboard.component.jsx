import React from "react";
import BaseViewSidebar from "../../components/baseViewSidebar/BaseViewSidebar.component";
import DashboardMain from "../../components/dashboardMain/DashboardMain.component";

import "./Dashboard.styles.css";

const Dashboard = () => {
  return (
    <div className="container">
      <div className="row">
        <BaseViewSidebar />
        <DashboardMain />
      </div>
    </div>
  );
};

export default Dashboard;
