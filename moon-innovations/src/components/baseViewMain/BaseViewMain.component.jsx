import React from "react";
import BaseViewMainHeader from "../baseViewMainHeader/BaseViewMainHeader.component";
import BaseViewMainBody from "../baseViewMainBody/BaseViewMainBody.component";

import "./BaseViewMain.styles.css";

const BaseViewMain = () => {
  return (
    <div className="base-view--main">
      <BaseViewMainHeader />
      <BaseViewMainBody />
    </div>
  );
};

export default BaseViewMain;
