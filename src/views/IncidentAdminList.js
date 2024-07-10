import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate  } from "react-router-dom";
import { Table, Button } from "reactstrap";
import { UserContext } from "../providers/UserProvider";
import { auth } from "../firebase";
import "./IncidentAdminList.css";
import IncidentEdit from "./IncidentEdit";
import CustomTable from "./CustomTable";

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
			const response = await fetch("/data.json");
			const data = await response.json();
			const startIndex = (page - 1) * 7;
			const selectedIncidents = data.incidents.slice(startIndex, startIndex + 7);
			setIncidents(selectedIncidents);
			setTotalPages(Math.ceil(data.incidents.length / 7));
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
					{/* Main Content */}
					<div className="flex-grow-1  main-content">
						{selectedIncident ? (
							<IncidentEdit incident={selectedIncident} onBack={handleBackClick} />
						) : (
							<CustomTable 
								title={selectedTab === 'selfreport' ? 'Self-Report Incidents' : 'News'}
								data={selectedTab === 'selfreport' ? incidents : news} 
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
