import React from "react";
import { RiArrowDropDownLine, RiArrowDropRightLine } from "react-icons/ri";

import "./InverterTest.styles.css";

const InverterTest = () => {
  return (
    <div className="inverter--test">
      <ul className="test-menu">
        <li className="dropdown--active">
          Home <RiArrowDropDownLine />
          <ul>
            <li>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit.
              Similique quas excepturi amet, rem consequuntur accusamus aperiam
              facere saepe laborum illum optio aliquid aut quod provident!
              Itaque accusamus ducimus alias, corporis quae praesentium
            </li>
          </ul>
        </li>
        <li>
          Solar
          <RiArrowDropRightLine />
        </li>
        <li>
          Grid
          <RiArrowDropRightLine />
        </li>
        <li>
          Poswerall
          <RiArrowDropRightLine />
        </li>
      </ul>
    </div>
  );
};

export default InverterTest;
