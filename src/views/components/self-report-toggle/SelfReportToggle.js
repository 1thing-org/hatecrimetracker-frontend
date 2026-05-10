import React from 'react';
import { useTranslation } from 'react-i18next';
import './SelfReportToggle.css';

const SelfReportToggle = ({ isOn, handleToggle }) => {
  const { t } = useTranslation();
  return (
    <div className="toggle-wrapper" onClick={() => handleToggle(!isOn)}>
      <div className={`toggle-button ${isOn ? 'on' : 'off'}`}>
        <div className={`switch-circle ${isOn ? 'circle-on' : 'circle-off'}`}></div>
        <span className={`toggle-text ${isOn ? 'text-on' : 'text-off'}`}>
          {isOn ? t('toggle_on') : t('toggle_off')}
        </span>
      </div>
      <span className={`toggle-label ${isOn ? 'label-on' : 'label-off'}`}>
        {t('show_user_reported_incidents')}
      </span>
    </div>
  );
};

export default SelfReportToggle;
