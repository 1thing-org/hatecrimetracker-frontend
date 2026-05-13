import { useTranslation } from "react-i18next";

// Step 5: post-submission acknowledgement.
// Mirrors hatecrimetracker-app/screens/SelfReport/ReportSuccess/index.tsx.
const ReportSuccess = ({ onDone }) => {
  const { t } = useTranslation();
  return (
    <div className="report-step report-success">
      <h3 className="report-subtitle report-subtitle-left">
        {t("report.success_thank_you")}
      </h3>
      <p className="report-text">{t("report.success_p1")}</p>
      <div className="report-success-box">
        <p>{t("report.success_box")}</p>
      </div>
      <div className="report-actions report-actions-center">
        <button type="button" className="report-primary-btn" onClick={onDone}>
          {t("report.success_done")}
        </button>
      </div>
    </div>
  );
};

export default ReportSuccess;
