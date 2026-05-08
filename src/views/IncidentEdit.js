import React, { useState } from "react";
import { Button, Form, FormGroup, Label, Input, Row, Col, Modal, ModalHeader, ModalBody } from "reactstrap";
import * as incidentsService from "../services/incidents";
import "./IncidentEdit.css";

const IncidentEdit = ({ incident }) => {
	const [localIncident, setLocalIncident] = useState({
		...incident,
		self_report_status: incident.self_report_status || "new",
	});
	const [selectedFiles, setSelectedFiles] = useState(incident.files || []);
	const [selectedPreviews, setSelectedPreviews] = useState([]);
	const [modal, setModal] = useState(false);
	const [previewFile, setPreviewFile] = useState(null);

	const toggleModal = () => setModal(!modal);

	const handleSaveIncident = (event) => {
		incidentsService.upsertIncident(localIncident)
			.then((updatedIncident) => {
				console.log("Incident updated:", updatedIncident);
			})
			.catch((error) => {
				console.error("Error updating incident:", error);
				alert("Failed to update incident. Please try again:" + error);
			});
	}

	const handleFileChange = (event) => {
		const files = Array.from(event.target.files);
		setSelectedFiles(files);
	};

	const handlePreview = (file) => {
		setPreviewFile(file);
		toggleModal();
	};

	const handleCheckboxChange = (file) => {
		setSelectedPreviews((prev) => {
			if (prev.includes(file)) {
				return prev.filter((item) => item !== file);
			} else {
				return [...prev, file];
			}
		});
	};

	const renderFilePreview = (file) => {
		const fileURL = URL.createObjectURL(file);
		if (file.type.startsWith("image/")) {
			return <img src={fileURL} alt={file.name} className="file-thumbnail" />;
		} else if (file.type.startsWith("video/")) {
			return <video src={fileURL} controls className="file-thumbnail" />;
		} else {
			return <div className="file-placeholder"></div>;
		}
	};

	const renderPreviewContent = () => {
		if (!previewFile) return null;
		const fileURL = URL.createObjectURL(previewFile);
		if (previewFile.type.startsWith("image/")) {
			return <img src={fileURL} alt={previewFile.name} className="file-preview-image" />;
		} else if (previewFile.type.startsWith("video/")) {
			return <video src={fileURL} controls className="file-preview-video" />;
		} else {
			return <div className="file-placeholder"></div>;
		}
	};

	return (
		<>
			<div className="header-container">
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
						<Label for="exampleFile">Uploaded Files:</Label>
						{
							localIncident.attachments && localIncident.attachments.length > 0 ? (
								<div className="file-icons-container">
									{localIncident.attachments.map((attachment, attIndex) => (
										<img src={attachment} alt={`Uploaded media ${attIndex + 1}`} key={attIndex} className="file-icon" />
									))}
								</div>
							) : (
								<div>No files Uploaded</div>
							)
						}
					</FormGroup>
					<FormGroup>
						<Label for="exampleFile">File:</Label>
						<Input id="exampleFile" name="file" type="file" multiple onChange={handleFileChange} />
						<div className="file-list">
							{selectedFiles.map((file, index) => (
								<div key={index} className="file-item">
									<Col md={1} className="checkbox-container">
										<Input
											type="checkbox"
											checked={selectedPreviews.includes(file)}
											onChange={() => handleCheckboxChange(file)}
										/>
									</Col>
									<Col md={2} className="file-preview">
										{renderFilePreview(file)}
									</Col>
									<Col md={3}>
										<span>{file.name}</span>
									</Col>
									<Col md={6} className="preview">
										<Button color="link" onClick={() => handlePreview(file)}>
											Preview
										</Button>
									</Col>
								</div>
							))}
						</div>
					</FormGroup>
					<div className="divider">
						<FormGroup>
							<Label for="reviewBy">Reporter ID: </Label>
							<span> 000001</span>
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
						<span> reviewer 1</span>
					</FormGroup>
					<Col md={2}>
						<FormGroup>
							<Label for="status">Current Status:</Label>
							<Input type="select" name="status" id="status" value={localIncident.self_report_status}
								onChange={(e) => setLocalIncident(prev => ({ ...prev, self_report_status: e.target.value }))}>
								<option value="new">Pending</option>
								<option value="approved">Approved</option>
								<option value="rejected">Rejected</option>
							</Input>
						</FormGroup>
					</Col>

					<FormGroup>
						<Label for="comment">Comment:</Label>
						<Input className="textarea" type="textarea" name="comment" id="comment" value={localIncident.comment || ''}
							onChange={(e) => setLocalIncident(prev => ({ ...prev, comment: e.target.value }))} />
					</FormGroup>
					<Button className="btn-save" onClick={handleSaveIncident}>Save</Button>
					<Button className="btn-cancel">Cancel</Button>
				</Form>
			</div>

			<Modal isOpen={modal} toggle={toggleModal} className="modal-custom">
				<ModalHeader className="modal-header-custom" toggle={toggleModal}>
					File Preview
				</ModalHeader>
				<ModalBody className="modal-body-custom">{renderPreviewContent()}</ModalBody>
			</Modal>
		</>
	);
};

export default IncidentEdit;
