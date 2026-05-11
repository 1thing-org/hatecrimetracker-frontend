import { useState } from "react";
import { updateIncidentContact } from "../../../services/incidents";

// Step 4: optional contact info form.
// Mirrors hatecrimetracker-app/screens/SelfReport/ContactInfoForm/ContactInfo.tsx.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[0-9]{10,15}$/;

const ContactInfoForm = ({ incidentId, onSubmitted }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const validate = () => {
    if (!name.trim()) {
      setError("Please enter your name.");
      return false;
    }
    if (!EMAIL_RE.test(email.trim().toLowerCase())) {
      setError("Please enter a valid email address.");
      return false;
    }
    if (!PHONE_RE.test(phone.replace(/[^0-9]/g, ""))) {
      setError("Please enter a valid phone number (10–15 digits).");
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
      setError("There was a problem submitting your contact details. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="report-step report-contact-info" onSubmit={handleSubmit}>
      <h3 className="report-subtitle">Thank you for submitting your report!</h3>
      <p className="report-text">
        If you are comfortable, our team would like to follow up with you to
        learn more about what happened and offer our support. Your willingness
        to share further details helps us improve the accuracy of our data and
        enhance the resources we provide to the community.
      </p>

      <label className="report-label" htmlFor="contact-name">What's your name?</label>
      <input
        id="contact-name"
        type="text"
        className="report-input"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label className="report-label" htmlFor="contact-email">What's your email?</label>
      <input
        id="contact-email"
        type="email"
        className="report-input"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <label className="report-label" htmlFor="contact-phone">What's your phone number?</label>
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
          {submitting ? "Submitting..." : "Contact Me"}
        </button>
      </div>
    </form>
  );
};

export default ContactInfoForm;
