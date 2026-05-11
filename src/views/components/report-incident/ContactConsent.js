// Step 3: ask whether the reporter is willing to be contacted.
// Mirrors hatecrimetracker-app/screens/SelfReport/ContactConsentPage/ContactPage.tsx.
const ContactConsent = ({ onYes, onNo }) => (
  <div className="report-step report-consent">
    <div className="report-text-block">
      <p>
        Thank you for submitting your report. We deeply appreciate you sharing
        your experience.
      </p>
      <p>
        If you feel comfortable, our team would like to reach out to learn more
        about what happened and offer our support. Speaking with you helps us
        better understand the impact of these incidents and improve the
        resources we provide to the community.
      </p>
      <p>
        Any further communication is completely optional, and your privacy will
        always be respected. Would you be open to being contacted by us?
      </p>
    </div>
    <div className="report-actions report-actions-stack">
      <button type="button" className="report-primary-btn report-full-btn" onClick={onYes}>
        Yes, please contact me
      </button>
      <button type="button" className="report-ghost-btn report-full-btn" onClick={onNo}>
        No, I do not want to be contacted
      </button>
    </div>
  </div>
);

export default ContactConsent;
