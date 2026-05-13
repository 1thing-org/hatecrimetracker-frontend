import { useTranslation } from "react-i18next";

// Step 1: introduction screen. Mirrors hatecrimetracker-app/screens/SelfReport/index.tsx.
const Intro = ({ onNext }) => {
  const { t } = useTranslation();
  return (
    <div className="report-step report-intro">
      <h2 className="report-title">{t("report.title")}</h2>
      <div className="report-text-block">
        <p>{t("report.intro_p1")}</p>
        <p>{t("report.intro_p2")}</p>
        <p>{t("report.intro_p3")}</p>
        <p className="report-alert">{t("report.intro_alert")}</p>
      </div>
      <div className="report-actions report-actions-center">
        <button type="button" className="report-primary-btn" onClick={onNext}>
          {t("report.report_now")}
        </button>
      </div>
    </div>
  );
};

export default Intro;
