import { useState } from "react";
import Modal from "react-modal";
import "./ReportIncident.css";

Modal.setAppElement("#root");

const ReportIncident = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button className="report-incident-btn" onClick={() => setIsOpen(true)}>
        Report Incident
      </button>

      <Modal
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
        overlayClassName="modal-overlay"
        className="modal-content"
      >
        <button className="modal-close" onClick={() => setIsOpen(false)}>
          ×
        </button>
        <h3 className="modal-title">Download App</h3>
        <p className="modal-desc">Use our mobile app to report anti-Asian incidents. We will show your reported incidents in our website after the content got reviewed and confirmed.</p>
        <div className="modal-badges">
          <a href="https://apps.apple.com/us/app/anti-asian-hate-crime-tracker/id6504161404" target="_blank" rel="noopener noreferrer">
            <img
              src="https://www.1thing.org/static/media/appstore.005ff290ce90a1c5f9e2.png"
              alt="App Store"
            />
          </a>
          <a href="https://play.google.com/store/apps/details?id=org.onething.hatecrimetracker" target="_blank" rel="noopener noreferrer">
            <img
              src="https://www.1thing.org/static/media/googleplay.b2106989d7482baf2454.png"
              alt="Google Play"
            />
          </a>
        </div>
      </Modal>
    </>
  );
};

export default ReportIncident;
