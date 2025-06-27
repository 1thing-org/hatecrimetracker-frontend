import React from "react";
import "./TimeToggle.css"; 

const TimeToggle = ({ viewMode, setViewMode }) => {
  return (
    <div className="time-range-toggle">
      <div className="time-option" onClick={() => setViewMode("monthly")}> 
        <div
          className={`time-circle-outer ${
            viewMode === "monthly" ? "active" : ""
          }`}
        >
          {viewMode === "monthly" && <div className="time-circle-inner" />}
        </div>
        <span
          className={
            viewMode === "monthly" ? "active-label" : "inactive-label"
          }
        >
          Monthly
        </span>
      </div>

      <div className="time-option" onClick={() => setViewMode("daily")}> 
        <div
          className={`time-circle-outer ${
            viewMode === "daily" ? "active" : ""
          }`}
        >
          {viewMode === "daily" && <div className="time-circle-inner" />}
        </div>
        <span
          className={
            viewMode === "daily" ? "active-label" : "inactive-label"
          }
        >
          Daily
        </span>
      </div>
    </div>
  );
};

export default TimeToggle;