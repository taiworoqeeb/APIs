import React from "react";
import BaseViewSidebar from "../../components/baseViewSidebar/BaseViewSidebar.component";
import BaseViewMain from "../../components/baseViewMain/BaseViewMain.component";

const Baseview = () => {
  return (
    <div className="container">
      <div className="row">
        <BaseViewSidebar />
        <BaseViewMain />
      </div>
    </div>
  );
};

export default Baseview;
