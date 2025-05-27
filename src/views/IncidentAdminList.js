import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate  } from "react-router-dom";
import { Button } from "reactstrap";
import moment from 'moment';
import { UserContext } from "../providers/UserProvider";
import { auth } from "../firebase";
import * as incidentsService from "../services/incidents";
import "./IncidentAdminList.css";
import IncidentEdit from "./IncidentEdit";
import CustomTable from "./CustomTable";
import IncidentAdminPage from "./IncidentAdmin"
import { signInWithGoogle } from "../firebase";

const IncidentListPage = () => {
	const user = useContext(UserContext) || { photoURL: "", displayName: "Guest", email: "guest@example.com" };
	const [incidents, setIncidents] = useState([]);
	const [news, setNews] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768);
	const [selectedIncident, setSelectedIncident] = useState(null);
	const [selectedTab, setSelectedTab] = useState('news'); // State to track the selected tab

	const navigate = useNavigate();//enable url change according to clicked tab

	useEffect(() => {
		if (selectedTab === 'selfreport') {//selfreport
            loadIncidents(currentPage);
        } else if (selectedTab === 'news'){
            loadNews(currentPage);
        }

		const handleResize = () => {
			setIsSmallScreen(window.innerWidth < 768);
		};

		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, [currentPage, selectedTab]);

	const loadIncidents = async (page) => {
		try {
			//get incidents from the server
			incidentsService.getIncidents(moment().subtract(10, 'year'), moment().add(1, 'days'), null, 'en', "new", "", "self_report", true)
			.then((incidents) => {
				const newIncidents = incidents.map((incident,idx) => {		
					return {
						id: incident.id,
						title: incident.title,	
						incident_time: incident.incident_time,
						incident_location: incident.incident_location,
						content: incident.abstract,
						file_url: incident.url,
						status: "Pending",
						reviewer: "Reviewer 1"
					};
				});
				const length = newIncidents.length;
				// setIncidents(incidents);
				const startIndex = (page - 1) * 7;
				const selectedIncidents = newIncidents.slice(startIndex, startIndex + 7);
				setIncidents(selectedIncidents);
				setTotalPages(Math.ceil(length / 7));
	
			});
			
		} catch (error) {
			console.error("Error loading incidents:", error);
		}
	};

	const loadNews = async (page) => {
		try {
			//get incidents from the server
			incidentsService.getIncidents(moment().subtract(10, 'year'), moment().add(1, 'days'), null, 'en', "new", "", "news", true)
			.then((incidents) => {
				const newNews = incidents.map((incident,idx) => {		
					return {
						id: incident.id,
						title: incident.title,	
						incident_time: incident.incident_time,
						incident_location: incident.incident_location,
						content: incident.abstract,
						file_url: incident.url,
						status: "Pending",
						reviewer: "Reviewer 1"
					};
				});
				const length = newNews.length;
				// setIncidents(incidents);
				const startIndex = (page - 1) * 7;
				const selectedIncidents = newNews.slice(startIndex, startIndex + 7);
				setIncidents(selectedIncidents);
				setTotalPages(Math.ceil(length / 7));
			});

		} catch (error) {
		  console.error("Error loading news:", error);
		}
	  };

	const handlePageChange = (page) => {
		setCurrentPage(page);
	};

	const handleDetailClick = (incident) => {
		setSelectedIncident(incident);
	};

	const handleBackClick = () => {
		setSelectedIncident(null);
	};

	const handleTabClick = (tab,event) => {
		event.preventDefault(); // Modified line: Prevent default anchor behavior

		setSelectedTab(tab);
		setCurrentPage(1);

		navigate(`/admin/${tab}`); // Update the URL without reloading the page
	};

	if (!user) {
		return <div>Loading...</div>;
	}

	return (
		<div className="incident-list-page-container">
			<div className="incident-list-page">
				{/* Admin Info */}
				<div className="d-flex align-items-center admin-info">
					<div className="avatar">
						<img src={user.photoURL} alt="User Avatar" onError={(e) => (e.target.style.backgroundColor = "#D9D9D9")} />{" "}
						{/*storage format?*/}
					</div>
					<div className="user-info">
						<p className="custom-margin">
							Name: <span>{user.displayName}</span>
						</p>
						<p className="custom-margin">
							ID: <span>{user.email}</span>
						</p>
						<Link to="/home" onClick={() => auth.signOut()} className="signout">
							Sign Out
						</Link>
					</div>
				</div>
				<div className="d-flex">
					{/* Left Sidebar */}
					<div className="left-sidebar px-3">
						<nav className="nav flex-column">
							<div className="tab news">
								<div className="bullet"></div>
								<a className="nav-link" href="/admin/news" onClick={(e) => handleTabClick('news', e)}>News</a>
								<i className={`fas fa-angle-${selectedTab === 'news' ? 'down' : 'right'} fa-lg`} style={{ color: "#d9d9d9" }}></i>
							</div>
							<div className="tab">
								<div className="bullet"></div>
								<a class="nav-link" href="/admin/selfreport" onClick={(e) => handleTabClick('selfreport', e)}>Self-Report</a>
								<i className={`fas fa-angle-${selectedTab === 'selfreport' ? 'down' : 'right'} fa-lg`} style={{ color: "#d9d9d9" }}></i>
							</div>
						</nav>
					</div>

					<div className="flex-grow-1 main-content">
					{selectedTab === 'news' ? (
						<IncidentAdminPage />
					) : 
					// If the user is not an admin, display the sign-in button
					!user || !user.isadmin ? (
						<div className="col-2">
							<Button
							tag={Link}
							to="/admin/selfreport"
							color="secondary"
							block
							onClick={() => {
								signInWithGoogle();
							}}
							>
							Sign in with Google
							</Button>
						</div>
					) :	
					// If the user is an admin, display the incident list or the incident edit form
					selectedIncident ? (
						<IncidentEdit incident={selectedIncident} onBack={handleBackClick} />
					) : (
						<CustomTable
						title="Self-Report Incidents"
						data={incidents}
						isSmallScreen={isSmallScreen}
						handleDetailClick={handleDetailClick}
						currentPage={currentPage}
						totalPages={totalPages}
						handlePageChange={handlePageChange}
						selectedTab={selectedTab} // Pass the selectedTab prop here
					  />
					)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default IncidentListPage;
