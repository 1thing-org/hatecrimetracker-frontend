import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import moment from 'moment';
import { UserContext } from "../providers/UserProvider";
import { auth } from "../firebase";
import * as incidentsService from "../services/incidents";
import "./IncidentAdminList.css";
import IncidentEdit from "./IncidentEdit";
import CustomTable from "./CustomTable";
import IncidentAdminPage from "./IncidentAdmin"


// Derive the tab to show from the URL. /admin defaults to news so the
// tab-based admin is the new default landing page.
const tabFromPath = (pathname) => {
	if (pathname && pathname.indexOf('/admin/selfreport') === 0) return 'selfreport';
	return 'news';
};

const IncidentListPage = () => {
	const user = useContext(UserContext) || { photoURL: "", displayName: "Guest", email: "guest@example.com" };
	const location = useLocation();
	const [incidents, setIncidents] = useState([]);
	const [news, setNews] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768);
	const [selectedIncident, setSelectedIncident] = useState(null);
	// Initialise the tab from the current URL so deep links land on the
	// correct tab (e.g. /admin/selfreport opens the User Reported tab).
	const [selectedTab, setSelectedTab] = useState(tabFromPath(location.pathname));
	// Bumping this value forces a reload of the active tab's data, e.g.
	// after returning from the edit page so updated statuses show up.
	const [reloadKey, setReloadKey] = useState(0);

	const navigate = useNavigate();//enable url change according to clicked tab

	// Keep tab state in sync with the URL when the user uses the browser's
	// back/forward buttons or navigates between /admin/news and /admin/selfreport.
	useEffect(() => {
		const next = tabFromPath(location.pathname);
		if (next !== selectedTab) {
			setSelectedTab(next);
			setCurrentPage(1);
			setSelectedIncident(null);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [location.pathname]);

	useEffect(() => {
		if (selectedTab === 'selfreport') {//selfreport
			loadIncidents(currentPage);
		} else if (selectedTab === 'news') {
			loadNews(currentPage);
		}

		const handleResize = () => {
			setIsSmallScreen(window.innerWidth < 768);
		};

		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, [currentPage, selectedTab, reloadKey]);

	const loadIncidents = async (page) => {
		try {
			// const response = await fetch("/data.json");
			incidentsService.getIncidents(moment().subtract(10, 'year'), moment().add(1, 'days'), null, 'en', "new", "", "self_report", true)
				.then(incidents => {
					//setRecentIncidents(incidents)
					//const data = await response.json();
					const startIndex = (page - 1) * 7;
					const selectedIncidents = incidents.slice(startIndex, startIndex + 7);
					setIncidents(selectedIncidents);
					setTotalPages(Math.ceil(incidents.length / 7));
				});


		} catch (error) {
			console.error("Error loading incidents:", error);
		}
	};

	const loadNews = async (page) => {
		try {
			const response = await fetch("/news.json");
			const data = await response.json();
			const startIndex = (page - 1) * 7;
			const selectedNews = data.news.slice(startIndex, startIndex + 7);
			setNews(selectedNews);
			setTotalPages(Math.ceil(data.news.length / 7));
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

	// onBack is called by the edit page after Save / Cancel. When `didSave`
	// is true we bump reloadKey so the table re-fetches and the updated
	// status / comment show up immediately.
	const handleBackClick = (didSave) => {
		setSelectedIncident(null);
		if (didSave) {
			setReloadKey(k => k + 1);
		}
	};

	const handleTabClick = (tab, event) => {
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
								<a className="nav-link" href="/admin/selfreport" onClick={(e) => handleTabClick('selfreport', e)}>User Reported</a>
								<i className={`fas fa-angle-${selectedTab === 'selfreport' ? 'down' : 'right'} fa-lg`} style={{ color: "#d9d9d9" }}></i>
							</div>
						</nav>
					</div>

					<div className="flex-grow-1 main-content">
						{selectedTab === 'news' ? (
							<IncidentAdminPage />
						) : selectedIncident ? (
							<IncidentEdit
								incident={selectedIncident}
								onBack={handleBackClick}
								reviewer={user.displayName || user.email}
							/>
						) : (
							<CustomTable
								title="User Reported Incidents"
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
