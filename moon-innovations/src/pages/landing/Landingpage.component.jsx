import React from "react";
import Sidebar from "../../components/sidebar/Sidebar.component";
import Main from "../../components/main/Main.component";

import "./Landingpage.styles.css";

const LandingPage = () => {
  return (
    <div className="container">
      <div className="row">
        <Sidebar />
        <Main />
      </div>
    </div>
  );
};

export default LandingPage;
