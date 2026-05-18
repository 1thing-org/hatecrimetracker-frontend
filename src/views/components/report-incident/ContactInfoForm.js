import { useState } from "react";
import { useTranslation } from "react-i18next";
import { updateIncidentContact } from "../../../services/incidents";

// Step 4: optional contact info form.
// Mirrors hatecrimetracker-app/screens/SelfReport/ContactInfoForm/ContactInfo.tsx.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[0-9]{10,15}$/;

const ContactInfoForm = ({ incidentId, onSubmitted }) => {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const validate = () => {
    if (!name.trim()) {
      setError(t("report.validation_name"));
      return false;
    }
    if (!EMAIL_RE.test(email.trim().toLowerCase())) {
      setError(t("report.validation_email"));
      return false;
    }
    if (!PHONE_RE.test(phone.replace(/[^0-9]/g, ""))) {
      setError(t("report.validation_phone"));
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    if (!validate()) return;
    setSubmitting(true);
    try {
      await updateIncidentContact(incidentId, {
        contact_name: name.trim(),
        email: email.trim(),
        phone: phone.replace(/[^0-9]/g, ""),
      });
      onSubmitted();
    } catch (err) {
      console.error("Error updating contact info:", err);
      setError(t("report.error_contact_submit"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="report-step report-contact-info" onSubmit={handleSubmit}>
      <h3 className="report-subtitle">{t("report.contact_thank_you")}</h3>
      <p className="report-text">{t("report.contact_intro")}</p>

      <label className="report-label" htmlFor="contact-name">
        {t("report.contact_name_label")}
      </label>
      <input
        id="contact-name"
        type="text"
        className="report-input"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label className="report-label" htmlFor="contact-email">
        {t("report.contact_email_label")}
      </label>
      <input
        id="contact-email"
        type="email"
        className="report-input"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <label className="report-label" htmlFor="contact-phone">
        {t("report.contact_phone_label")}
      </label>
      <input
        id="contact-phone"
        type="tel"
        className="report-input"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      {error && <p className="report-error">{error}</p>}

      <div className="report-actions report-actions-center">
        <button
          type="submit"
          className="report-primary-btn"
          disabled={submitting}
        >
          {submitting
            ? t("report.form_submitting")
            : t("report.contact_submit")}
        </button>
      </div>
    </form>
  );
};

export default ContactInfoForm;
