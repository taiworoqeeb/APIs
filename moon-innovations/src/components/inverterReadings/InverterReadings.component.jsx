import React from "react";

import "./InverterReadings.styles.css";

const InverterReadings = () => {
  return (
    <div className="inverter--readings-tracing">
      <div className="inverter--readings">
        <div className="reading--values">
          <p>
            AC IN <span>/Volts</span>
          </p>
          <input type="text" value={159} disabled />
          <p>
            AC IN <span>/Volts</span>
          </p>
          <input type="text" value={230} disabled />
        </div>
        <div className="reading--values">
          <p>MODE</p>
          <input type="text" value={"Idle"} disabled />
          <p>
            BATTERY <span>%</span>
          </p>
          <input type="text" value={80} disabled />
        </div>
        <div className="reading--values">
          <p>STATE</p>
          <input type="text" value={"Off"} disabled />
          <p>
            LOAD<span>/kwh</span>
          </p>
          <input type="text" value={12.08} disabled />
        </div>
        <div className="reading--values">
          <p>
            SOLAR <span>/Volts</span>
          </p>
          <input type="text" value={135} disabled />
          <p>
            TEMP <span>oC</span>
          </p>
          <input type="text" value={28} disabled />
        </div>
      </div>
      <div className="trace">
        <h3>Tracing</h3>
        <h3>Trace</h3>
        <h3>Trace</h3>
        <h3>Trace</h3>
      </div>
    </div>
  );
};

export default InverterReadings;
