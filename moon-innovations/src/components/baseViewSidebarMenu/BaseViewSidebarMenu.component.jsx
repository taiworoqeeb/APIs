import React from "react";

import "./BaseViewSidebarMenu.styles.css";

const BaseViewSidebarMenu = () => {
  return (
    <div>
      <ul className="baseview-menu">
        <li className="baseview-menu--item">Dashboard</li>
        <li className="baseview-menu--item">Posts</li>
        <li className="baseview-menu--item">Pool</li>
        <li className="baseview-menu--item">Profile View</li>
      </ul>
    </div>
  );
};

export default BaseViewSidebarMenu;
