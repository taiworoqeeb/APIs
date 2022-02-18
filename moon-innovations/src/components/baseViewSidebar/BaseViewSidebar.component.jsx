import React from "react";
import Header from "../header/Header.component";
import BaseViewSidebarMenu from "../baseViewSidebarMenu/BaseViewSidebarMenu.component";
import { RiMenu5Fill } from "react-icons/ri";

import "./BaseViewSidebar.styles.css";

const BaseViewSidebar = () => {
  return (
    <div className="baseview-sidebar">
      <Header>
        <RiMenu5Fill className="menu5Fill" />
      </Header>
      <BaseViewSidebarMenu />
      <div className="version">
        <p>MI.Ltd v.1.99</p>
      </div>
    </div>
  );
};

export default BaseViewSidebar;
