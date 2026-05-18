import { useTranslation } from "react-i18next";

// Step 3: ask whether the reporter is willing to be contacted.
// Mirrors hatecrimetracker-app/screens/SelfReport/ContactConsentPage/ContactPage.tsx.
const ContactConsent = ({ onYes, onNo }) => {
  const { t } = useTranslation();
  return (
    <div className="report-step report-consent">
      <div className="report-text-block">
        <p>{t("report.consent_p1")}</p>
        <p>{t("report.consent_p2")}</p>
        <p>{t("report.consent_p3")}</p>
      </div>
      <div className="report-actions report-actions-stack">
        <button
          type="button"
          className="report-primary-btn report-full-btn"
          onClick={onYes}
        >
          {t("report.consent_yes")}
        </button>
        <button
          type="button"
          className="report-ghost-btn report-full-btn"
          onClick={onNo}
        >
          {t("report.consent_no")}
        </button>
      </div>
    </div>
  );
};

export default ContactConsent;
