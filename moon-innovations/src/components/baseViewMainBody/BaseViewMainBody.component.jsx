import React from "react";
import product1 from "../../assets/product1.jpg";
import product2 from "../../assets/product2.jpg";
import product3 from "../../assets/product3.jpg";
import product4 from "../../assets/product4.jpg";
import product5 from "../../assets/product5.jpg";

import "./BaseViewMainBody.styles.css";

const BaseViewMainBody = () => {
  return (
    <div className="baseView--main__body vert--grow__main--body">
      <div className="products">
        <div className="product-desc">
          <div className="prod-img">
            <img src={product1} alt="inverter" />
          </div>
          <h3>Product1</h3>
        </div>
        <div className="product-desc">
          <div className="prod-img">
            <img src={product2} alt="inverter" />
          </div>
          <h3>Product2</h3>
        </div>
        <div className="product-desc">
          <div className="prod-img">
            <img src={product3} alt="inverter" />
          </div>
          <h3>Product3</h3>
        </div>
        <div className="product-desc">
          <div className="prod-img">
            <img src={product4} alt="inverter" />
          </div>
          <h3>Product4</h3>
        </div>
        <div className="product-desc">
          <div className="prod-img">
            <img src={product5} alt="inverter" />
          </div>
          <h3>Product5</h3>
        </div>
        <div className="product-desc">
          <div className="prod-img">
            <img src={product5} alt="" />
          </div>
          <h3>Product6</h3>
        </div>
      </div>
      <div className="user-details">
        <h3>CSA M26</h3>
        <p>
          <span>Last Login</span> 20/12/2022
        </p>
      </div>
    </div>
  );
};

export default BaseViewMainBody;
