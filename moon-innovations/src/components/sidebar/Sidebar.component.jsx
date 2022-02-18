import React from "react";
import Header from "../header/Header.component";
import SidebarMenu from "../sidebarmenu/SidebarMenu.component";
import "./Sidebar.style.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <Header />
      <SidebarMenu />
      <div className="version">
        <p>MI.Ltd v.1.99</p>
      </div>
    </div>
  );
};

export default Sidebar;
