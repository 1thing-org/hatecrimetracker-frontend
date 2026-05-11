import { useRef, useState } from "react";
import { SelectPicker } from "rsuite";
import { forEachState } from "../../../utility/Utils";
import { uploadAttachments } from "../../../services/storage";
import { upsertIncident } from "../../../services/incidents";

// Reuse the canonical state list (US + ONLINE + CANADA) defined in
// utility/Utils.js — the same source the home page's StateSelection and the
// admin's IncidentEdit dropdown read from.
const STATE_OPTIONS = [];
forEachState((abbrev, name) => STATE_OPTIONS.push({ label: name, value: abbrev }));

// react-modal's focus trap closes any popover that portals to <body> the
// instant focus moves to it, so we render rsuite's SelectPicker menu inside
// this form by passing `container` to the picker. The ref must live in
// state so the picker re-renders once we know the container node.

// Step 2: incident details form. Mirrors hatecrimetracker-app/screens/SelfReport/Report/index.tsx.
// On submit we upload any attached media to Firebase Storage (same path layout
// the mobile app uses) and POST the incident to the backend, then advance to
// the contact-consent step with the new incident_id.
const todayIsoDate = () => new Date().toISOString().split("T")[0];

const ReportForm = ({ onSubmitted, onCancel }) => {
  const fileInputRef = useRef(null);
  const [pickerContainer, setPickerContainer] = useState(null);
  const [date, setDate] = useState(todayIsoDate());
  const [state, setState] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]); // { file, previewUrl }
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const onFilesPicked = (e) => {
    const picked = Array.from(e.target.files || []);
    if (!picked.length) return;
    const next = picked.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));
    setFiles((prev) => [...prev, ...next]);
    // Reset the input so the same file can be reselected after removal.
    e.target.value = "";
  };

  const removeFile = (index) => {
    setFiles((prev) => {
      const next = prev.slice();
      const [removed] = next.splice(index, 1);
      if (removed) URL.revokeObjectURL(removed.previewUrl);
      return next;
    });
  };

  const validate = () => {
    if (!state) {
      setError("Please pick where the incident took place.");
      return false;
    }
    if (!description.trim()) {
      setError("Please describe what happened.");
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
      let attachments = [];
      if (files.length) {
        const { urls, errors } = await uploadAttachments(
          files.map((f) => f.file)
        );
        attachments = urls;
        if (errors.length) {
          // Surface partial upload failures but still let the report through
          // when at least one URL came back, matching the mobile behavior of
          // never blocking a submission on a media failure.
          console.warn("Some attachments failed to upload:", errors);
        }
      }

      const incidentId = await upsertIncident({
        incident_time: date,
        incident_location: state,
        abstract: description.trim(),
        attachments,
        self_report_status: "new",
        type: "self_report",
      });

      onSubmitted(incidentId);
    } catch (err) {
      console.error("Failed to submit report:", err);
      setError("Something went wrong while submitting the report. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      className="report-step report-form"
      onSubmit={handleSubmit}
      ref={setPickerContainer}
    >
      <label className="report-label" htmlFor="report-date">
        When was the incident?
      </label>
      <input
        id="report-date"
        type="date"
        className="report-input"
        value={date}
        max={todayIsoDate()}
        onChange={(e) => setDate(e.target.value)}
      />

      <label className="report-label">
        Where did the incident take place?
      </label>
      <SelectPicker
        data={STATE_OPTIONS}
        value={state}
        onChange={(value) => setState(value || "")}
        searchable
        cleanable={false}
        placeholder="All States"
        block
        menuMaxHeight={240}
        className="rs-theme-dark report-state-picker"
        // Render the popup inside the modal so react-modal's focus trap
        // doesn't immediately collapse it.
        container={() => pickerContainer || document.body}
        preventOverflow
      />

      <label className="report-label" htmlFor="report-description">
        Describe in detail what happened
      </label>
      <textarea
        id="report-description"
        className="report-input report-textarea"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={6}
      />

      <label className="report-label">
        If you have any images or videos related to the incident, please upload them here.
      </label>
      <div className="report-upload-box">
        <button
          type="button"
          className="report-upload-trigger"
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
        >
          <span className="report-upload-icon" aria-hidden="true">↓</span>
          <span className="report-upload-text">Choose files</span>
          <span className="report-upload-hint">(Size limit: 10MB)</span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          multiple
          style={{ display: "none" }}
          onChange={onFilesPicked}
        />
      </div>

      {files.length > 0 && (
        <div className="report-media-grid">
          {files.map((f, i) => {
            const isVideo = f.file.type && f.file.type.startsWith("video/");
            return (
              <div className="report-media-item" key={f.previewUrl}>
                {isVideo ? (
                  <video src={f.previewUrl} className="report-media-thumb" />
                ) : (
                  <img
                    src={f.previewUrl}
                    alt={f.file.name}
                    className="report-media-thumb"
                  />
                )}
                <button
                  type="button"
                  className="report-media-remove"
                  onClick={() => removeFile(i)}
                  aria-label={`Remove ${f.file.name}`}
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>
      )}

      {error && <p className="report-error">{error}</p>}

      <div className="report-actions report-actions-split">
        <button
          type="button"
          className="report-secondary-btn"
          onClick={onCancel}
          disabled={submitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="report-primary-btn"
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Submit"}
        </button>
      </div>
    </form>
  );
};

export default ReportForm;
