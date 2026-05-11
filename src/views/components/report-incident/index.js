import { useState } from "react";
import Modal from "react-modal";
import Intro from "./Intro";
import ReportForm from "./ReportForm";
import ContactConsent from "./ContactConsent";
import ContactInfoForm from "./ContactInfoForm";
import ReportSuccess from "./ReportSuccess";
import "./ReportIncident.css";

Modal.setAppElement("#root");

// Mirrors the mobile SelfReportParamList stack in
// hatecrimetracker-app/types.tsx: SelfReportScreen → ReportScreen →
// ContactPage → ContactInfo → ReportSuccessScreen.
const STEPS = {
  INTRO: "intro",
  FORM: "form",
  CONTACT_CONSENT: "contact-consent",
  CONTACT_INFO: "contact-info",
  SUCCESS: "success",
};

const ReportIncident = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(STEPS.INTRO);
  const [incidentId, setIncidentId] = useState(null);

  const open = () => {
    setStep(STEPS.INTRO);
    setIncidentId(null);
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    // Reset after the close animation so a re-open starts fresh.
    setTimeout(() => {
      setStep(STEPS.INTRO);
      setIncidentId(null);
    }, 0);
  };

  const renderStep = () => {
    switch (step) {
      case STEPS.INTRO:
        return <Intro onNext={() => setStep(STEPS.FORM)} />;
      case STEPS.FORM:
        return (
          <ReportForm
            onCancel={close}
            onSubmitted={(id) => {
              setIncidentId(id);
              setStep(STEPS.CONTACT_CONSENT);
            }}
          />
        );
      case STEPS.CONTACT_CONSENT:
        return (
          <ContactConsent
            onYes={() => setStep(STEPS.CONTACT_INFO)}
            onNo={() => setStep(STEPS.SUCCESS)}
          />
        );
      case STEPS.CONTACT_INFO:
        return (
          <ContactInfoForm
            incidentId={incidentId}
            onSubmitted={() => setStep(STEPS.SUCCESS)}
          />
        );
      case STEPS.SUCCESS:
        return <ReportSuccess onDone={close} />;
      default:
        return null;
    }
  };

  return (
    <>
      <button className="report-incident-btn" onClick={open}>
        Report Incident
      </button>

      <Modal
        isOpen={isOpen}
        onRequestClose={close}
        overlayClassName="modal-overlay"
        className="modal-content report-modal"
        shouldCloseOnOverlayClick={false}
      >
        <button className="modal-close" onClick={close} aria-label="Close">
          ×
        </button>
        {renderStep()}
      </Modal>
    </>
  );
};

export default ReportIncident;
