// Step 5: post-submission acknowledgement.
// Mirrors hatecrimetracker-app/screens/SelfReport/ReportSuccess/index.tsx.
const ReportSuccess = ({ onDone }) => (
  <div className="report-step report-success">
    <h3 className="report-subtitle report-subtitle-left">
      Thank you for submitting your report!
    </h3>
    <p className="report-text">
      Our volunteers are keen to learn more about the incident you reported. If
      you're willing, please let us know the best way to contact you. Your
      insights will help improve our information quality.
    </p>
    <div className="report-success-box">
      <p>
        We truly value your willingness to share this information, as it plays
        an important role in enhancing our understanding and the quality of
        resources we offer to the community. We appreciate your support.
      </p>
    </div>
    <div className="report-actions report-actions-center">
      <button type="button" className="report-primary-btn" onClick={onDone}>
        Done
      </button>
    </div>
  </div>
);

export default ReportSuccess;
