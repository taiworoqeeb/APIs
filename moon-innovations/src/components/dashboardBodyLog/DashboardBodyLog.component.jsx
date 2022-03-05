import React from "react";
import dash from "../../assets/dash.png";
import log from "../../assets/invent-log.png";

import "./DashboardBodyLog.styles.css";

const DashboardBodyLog = () => {
  return (
    <div className="dashboard--event">
      <div className="dash">
        <img src={dash} alt="" />
      </div>
      <div className="event-log">
        <h3>Event Logs</h3>
        <img src={log} alt="" />
      </div>
    </div>
  );
};

export default DashboardBodyLog;
