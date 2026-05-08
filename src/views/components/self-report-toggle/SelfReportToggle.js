import React from 'react';
import './SelfReportToggle.css';

const SelfReportToggle = ({ isOn, handleToggle }) => {
  return (
    <div className="toggle-wrapper" onClick={() => handleToggle(!isOn)}>
      <div className={`toggle-button ${isOn ? 'on' : 'off'}`}>
        <div className={`switch-circle ${isOn ? 'circle-on' : 'circle-off'}`}></div>
        <span className={`toggle-text ${isOn ? 'text-on' : 'text-off'}`}>
          {isOn ? 'on' : 'off'}
        </span>
      </div>
      <span className={`toggle-label ${isOn ? 'label-on' : 'label-off'}`}>
        Show User Reported Incidents
      </span>
    </div>
  );
};

export default SelfReportToggle;