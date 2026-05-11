// Step 1: introduction screen. Mirrors hatecrimetracker-app/screens/SelfReport/index.tsx.
const Intro = ({ onNext }) => (
  <div className="report-step report-intro">
    <h2 className="report-title">Report a hate incident</h2>
    <div className="report-text-block">
      <p>
        By sharing what happened, you help us document anti-Asian hate, raise
        public awareness, and build a stronger, more supportive community.
      </p>
      <p>
        We are here to listen. We encourage you to report any incidents of hate,
        bias, or violence against Asian individuals or communities, whether you
        experienced them yourself or witnessed them.
      </p>
      <p>
        Your safety and privacy are our top priorities. All information you
        provide is strictly confidential. We will never share your details with
        law enforcement or any third party without your explicit consent.
      </p>
      <p className="report-alert">
        If you are in immediate danger or require urgent assistance, please
        call 911 immediately.
      </p>
    </div>
    <div className="report-actions report-actions-center">
      <button type="button" className="report-primary-btn" onClick={onNext}>
        Report Now
      </button>
    </div>
  </div>
);

export default Intro;
