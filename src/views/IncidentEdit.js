import React, { useMemo, useState } from "react";
import { Button, Form, FormGroup, Label, Input, Row, Col, Modal, ModalHeader, ModalBody } from "reactstrap";
import * as incidentsService from "../services/incidents";
import { uploadAttachment } from "../services/storage";
import "./IncidentEdit.css";

// Map between the API status value and the human-readable label.
const STATUS_LABELS = {
	new: "Pending",
	approved: "Approved",
	rejected: "Rejected",
};

// Heuristic: treat URLs ending in a known video extension as videos.
const VIDEO_RE = /\.(mp4|mov|m4v|avi|wmv|mkv|webm|3gp)(?:\?|$)/i;
const isVideoUrl = (url) => VIDEO_RE.test(url || "");

const IncidentEdit = ({ incident, onBack, reviewer }) => {
	const initialIncident = useMemo(() => ({
		...incident,
		attachments: Array.isArray(incident.attachments) ? incident.attachments : [],
		self_report_status: incident.self_report_status || "new",
	}), [incident]);

	const [localIncident, setLocalIncident] = useState(initialIncident);
	// Tracks files that are currently uploading (for per-file progress UI).
	// Each entry: { id, name, status: "uploading" | "error", error?: string }
	const [pendingUploads, setPendingUploads] = useState([]);
	const [modal, setModal] = useState(false);
	const [previewUrl, setPreviewUrl] = useState(null);
	const [isSaving, setIsSaving] = useState(false);
	const [saveError, setSaveError] = useState(null);

	const toggleModal = () => setModal((m) => !m);

	const isUploading = pendingUploads.some(p => p.status === "uploading");

	// Detect unsaved changes so we can warn before discarding them on Cancel.
	const isDirty = useMemo(() => {
		const sameAttachments =
			localIncident.attachments.length === initialIncident.attachments.length &&
			localIncident.attachments.every((a, i) => a === initialIncident.attachments[i]);
		return (
			!sameAttachments ||
			localIncident.self_report_status !== initialIncident.self_report_status ||
			(localIncident.comment || "") !== (initialIncident.comment || "") ||
			(localIncident.incident_time || "") !== (initialIncident.incident_time || "") ||
			(localIncident.incident_location || "") !== (initialIncident.incident_location || "") ||
			(localIncident.abstract || "") !== (initialIncident.abstract || "") ||
			(localIncident.contact_email || "") !== (initialIncident.contact_email || "") ||
			(localIncident.contact_phone_number || "") !== (initialIncident.contact_phone_number || "")
		);
	}, [localIncident, initialIncident]);

	// `savedIncident` is the locally-known state at the moment of save —
	// the parent uses it to optimistically refresh the matching row in
	// the list before the server-side refetch completes.
	const goBack = (didSave, savedIncident) => {
		if (typeof onBack === "function") {
			onBack(didSave, savedIncident);
		}
	};

	const handleStatusChange = (status) => {
		setSaveError(null);
		setLocalIncident(prev => ({ ...prev, self_report_status: status }));
	};

	// Upload immediately when the admin picks a file. The resulting URL gets
	// pushed into localIncident.attachments so it's visible right away — no
	// hidden state, easy to confirm uploads happened before clicking Save.
	const handleFileChange = async (event) => {
		const files = Array.from(event.target.files || []);
		// Reset the input so picking the same file again still triggers onChange.
		event.target.value = "";
		if (files.length === 0) return;
		setSaveError(null);

		// Seed pending entries for the progress UI.
		const seeds = files.map((file) => ({
			id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
			name: file.name,
			status: "uploading",
		}));
		setPendingUploads(prev => [...prev, ...seeds]);

		await Promise.all(files.map(async (file, i) => {
			const seedId = seeds[i].id;
			try {
				const url = await uploadAttachment(file);
				// Append the new URL to attachments and remove from the pending list.
				setLocalIncident(prev => ({
					...prev,
					attachments: [...(prev.attachments || []), url],
				}));
				setPendingUploads(prev => prev.filter(p => p.id !== seedId));
			} catch (err) {
				console.error("Upload failed:", err);
				setPendingUploads(prev =>
					prev.map(p => p.id === seedId
						? { ...p, status: "error", error: (err && err.message) || String(err) }
						: p
					)
				);
			}
		}));
	};

	const handleRemoveAttachment = (url) => {
		setLocalIncident(prev => ({
			...prev,
			attachments: (prev.attachments || []).filter(a => a !== url),
		}));
	};

	const handleDismissPending = (id) => {
		setPendingUploads(prev => prev.filter(p => p.id !== id));
	};

	const handlePreviewUrl = (url) => {
		setPreviewUrl(url);
		setModal(true);
	};

	const handleSaveIncident = async () => {
		setIsSaving(true);
		setSaveError(null);
		try {
			// Build a clean payload. Explicitly include `type: "self_report"`
			// (the backend rejects payloads where type is missing or unknown)
			// and write the admin into `approved_by` (the actual model field).
			const payload = {
				...localIncident,
				type: localIncident.type || "self_report",
				attachments: localIncident.attachments || [],
				approved_by: reviewer || localIncident.approved_by || null,
			};
			console.log("Saving incident with attachments:", payload.attachments);
			await incidentsService.upsertIncident(payload);
			setIsSaving(false);
			// Hand the parent the post-save snapshot so the row updates
			// immediately on the list. Including `reviewer` so the list's
			// reviewer column also reflects who acted on it.
			goBack(true, {
				...payload,
				reviewer: reviewer || payload.approved_by || null,
			});
		} catch (error) {
			console.error("Error updating incident:", error);
			setIsSaving(false);
			let message = (error && error.message) || "Failed to update incident.";
			if (error && error.response && error.response.data && error.response.data.error) {
				message = error.response.data.error;
			}
			setSaveError(message);
		}
	};

	const handleCancel = () => {
		if (isDirty) {
			const ok = window.confirm("Discard your unsaved changes?");
			if (!ok) return;
		}
		goBack(false);
	};

	const renderAttachment = (url, index) => {
		const key = `${index}-${url}`;
		return (
			<div key={key} className="attachment-tile">
				<button
					type="button"
					className="attachment-thumb"
					onClick={() => handlePreviewUrl(url)}
					title="Click to preview"
				>
					{isVideoUrl(url) ? (
						<video src={url} className="attachment-media" muted />
					) : (
						<img src={url} alt={`Attachment ${index + 1}`} className="attachment-media" />
					)}
				</button>
				<button
					type="button"
					className="attachment-remove"
					onClick={() => handleRemoveAttachment(url)}
					aria-label="Remove attachment"
					title="Remove"
				>
					×
				</button>
			</div>
		);
	};

	const renderPreviewContent = () => {
		if (!previewUrl) return null;
		if (isVideoUrl(previewUrl)) {
			return <video src={previewUrl} controls className="file-preview-video" />;
		}
		return <img src={previewUrl} alt="Preview" className="file-preview-image" />;
	};

	const currentStatus = localIncident.self_report_status;
	const reporterId = localIncident.reporter_id || localIncident.reporter || "—";
	const displayedReviewer = reviewer || localIncident.reviewer || localIncident.approved_by || "—";
	const attachments = localIncident.attachments || [];

	return (
		<>
			<div className="header-container header-with-back">
				<Button color="link" className="back-link" onClick={handleCancel}>
					&larr; Back to list
				</Button>
				<h5>Edit User Reported Incidents</h5>
			</div>
			<div className="incident-edit-container">
				<Form>
					<Row form>
						<FormGroup>
							<Label for="incidentID">Incident ID: </Label>
							<span> #{localIncident.id}</span>
						</FormGroup>
					</Row>
					<Row form>
						<Col md={3}>
							<FormGroup>
								<Label for="incidentTime">Incident Time: </Label>
								<Input type="text" name="incidentTime" id="incidentTime" value={localIncident.incident_time || ''}
									onChange={(e) => setLocalIncident(prev => ({ ...prev, incident_time: e.target.value }))} />
							</FormGroup>
						</Col>
						<Col md={9}>
							<FormGroup>
								<Label for="location">Location:</Label>
								<Input type="text" name="location" id="location" value={localIncident.incident_location || ''}
									onChange={(e) => setLocalIncident(prev => ({ ...prev, incident_location: e.target.value }))} />
							</FormGroup>
						</Col>
					</Row>
					<FormGroup>
						<Label for="abstract">Abstract:</Label>
						<Input className="textarea" type="textarea" name="abstract" id="abstract" value={localIncident.abstract || ''}
							onChange={(e) => setLocalIncident(prev => ({ ...prev, abstract: e.target.value }))} />
					</FormGroup>

					<FormGroup>
						<Label>Attachments:</Label>
						<div className="attachments-grid">
							{attachments.length === 0 && pendingUploads.length === 0 && (
								<div className="attachments-empty">No files uploaded</div>
							)}
							{attachments.map(renderAttachment)}
							{pendingUploads.map((p) => (
								<div key={p.id} className={`attachment-tile pending pending-${p.status}`}>
									<div className="attachment-thumb attachment-pending-thumb">
										{p.status === "uploading"
											? <span>Uploading…</span>
											: <span>Failed</span>}
									</div>
									<div className="attachment-pending-name" title={p.name}>{p.name}</div>
									{p.status === "error" && (
										<div className="attachment-pending-error" title={p.error}>{p.error}</div>
									)}
									<button
										type="button"
										className="attachment-remove"
										onClick={() => handleDismissPending(p.id)}
										aria-label="Dismiss"
										title="Dismiss"
									>
										×
									</button>
								</div>
							))}
						</div>
						<div className="attachments-add">
							<Label for="exampleFile" className="btn-add-files">
								+ Add files
							</Label>
							<Input
								id="exampleFile"
								name="file"
								type="file"
								multiple
								accept="image/*,video/*"
								onChange={handleFileChange}
								className="hidden-file-input"
							/>
							{isUploading && <span className="attachments-uploading-hint">Uploading…</span>}
						</div>
					</FormGroup>

					<div className="divider">
						<FormGroup>
							<Label for="reporterId">Reporter ID: </Label>
							<span id="reporterId"> {reporterId}</span>
						</FormGroup>

						<FormGroup>
							<Row form>
								<Col md={3}>
									<FormGroup>
										<Label for="contactEmail">Contact Email:</Label>
										<Input type="email" name="contactEmail" id="contactEmail" value={localIncident.contact_email || ''}
											onChange={(e) => setLocalIncident(prev => ({ ...prev, contact_email: e.target.value }))} />
									</FormGroup>
								</Col>
								<Col md={3}>
									<FormGroup>
										<Label for="contactPhoneNumber">Contact Phone Number:</Label>
										<Input
											type="text"
											name="contactPhoneNumber"
											id="contactPhoneNumber"
											value={localIncident.contact_phone_number || ''}
											onChange={(e) => setLocalIncident(prev => ({ ...prev, contact_phone_number: e.target.value }))}
										/>
									</FormGroup>
								</Col>
							</Row>
						</FormGroup>
					</div>
					<FormGroup>
						<Label for="reviewBy">Review by: </Label>
						<span id="reviewBy"> {displayedReviewer}</span>
					</FormGroup>

					<FormGroup>
						<Label>Current Status:</Label>
						<div className="status-display">
							<span className={`status-pill status-${currentStatus}`}>
								{STATUS_LABELS[currentStatus] || currentStatus}
							</span>
							<Button
								className={`btn-action btn-approve${currentStatus === 'approved' ? ' is-active' : ''}`}
								onClick={() => handleStatusChange('approved')}
								disabled={isSaving}
								type="button"
							>
								Approve
							</Button>
							<Button
								className={`btn-action btn-reject${currentStatus === 'rejected' ? ' is-active' : ''}`}
								onClick={() => handleStatusChange('rejected')}
								disabled={isSaving}
								type="button"
							>
								Reject
							</Button>
						</div>
					</FormGroup>

					<FormGroup>
						<Label for="comment">Comment:</Label>
						<Input className="textarea" type="textarea" name="comment" id="comment" value={localIncident.comment || ''}
							onChange={(e) => setLocalIncident(prev => ({ ...prev, comment: e.target.value }))} />
					</FormGroup>

					{saveError && (
						<div className="save-error" role="alert">{saveError}</div>
					)}

					<div className="action-buttons">
						<Button
							className="btn-action btn-save"
							onClick={handleSaveIncident}
							disabled={isSaving || isUploading}
							type="button"
							title={isUploading ? "Wait for uploads to finish" : ""}
						>
							{isSaving ? 'Saving…' : 'Save'}
						</Button>
						<Button
							className="btn-action btn-cancel"
							onClick={handleCancel}
							disabled={isSaving}
							type="button"
						>
							Cancel
						</Button>
					</div>
				</Form>
			</div>

			<Modal isOpen={modal} toggle={toggleModal} className="modal-custom">
				<ModalHeader className="modal-header-custom" toggle={toggleModal}>
					Attachment Preview
				</ModalHeader>
				<ModalBody className="modal-body-custom">{renderPreviewContent()}</ModalBody>
			</Modal>
		</>
	);
};

export default IncidentEdit;
