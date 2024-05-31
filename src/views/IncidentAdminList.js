import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Table, Button } from 'reactstrap';
import { UserContext } from '../providers/UserProvider';
import { auth } from '../firebase';
import './IncidentAdminList.css'; 


const IncidentListPage = () => {
    const user = useContext(UserContext) || { photoURL: '', displayName: 'Guest', email: 'guest@example.com' };
    const [incidents, setIncidents] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768);

    useEffect(() => {
        loadIncidents(currentPage);

        const handleResize = () => {
            setIsSmallScreen(window.innerWidth < 768);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [currentPage]);

    const loadIncidents = async (page) => {
        try {
            const response = await fetch('/data.json');
            const data = await response.json();
            const startIndex = (page - 1) * 7;
            const selectedIncidents = data.incidents.slice(startIndex, startIndex + 7);
            setIncidents(selectedIncidents); 
            setTotalPages(Math.ceil(data.incidents.length / 7));
        } catch (error) {
            console.error('Error loading incidents:', error);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        loadIncidents(page);
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
                        <img src={user.photoURL} alt="User Avatar" onError={(e) => e.target.style.backgroundColor = '#D9D9D9'} /> {/*storage format?*/}
                    </div>
                    <div className="user-info">
                        <p className="custom-margin">Name: <span>{user.displayName}</span></p>
                        <p className="custom-margin">ID: <span>{user.email}</span></p>
                        <Link to="/home" onClick={() => auth.signOut()} className="signout">Sign Out</Link>
                    </div>
                </div>
                <div className="d-flex">
                    {/* Left Sidebar */}
                    <div className="left-sidebar px-3">
                        <nav className="nav flex-column">
                            <div className="tab news">
                                <div className="bullet"></div>
                                <Link className="nav-link" to="/admin/news">News</Link>
                                <i className="fas fa-angle-down fa-lg" style={{ color: '#d9d9d9' }}></i>
                            </div>
                            <div className="tab">
                                <div className="bullet"></div>
                                <Link className="nav-link" to="/admin/selfreport">Self-Report</Link>
                                <i class="fas fa-angle-right fa-lg" style={{ color: '#d9d9d9' }}></i>
                            </div>
                        </nav>
                    </div>
                    {/* Main Content */}
                    <div className="flex-grow-1  main-content">
                        <div className="header-container">
                            <h5>Self-Report Incidents</h5>
                        </div>
                        <div className="table-container">
                            <div className="table-header-container">
                                <Table>
                                    <thead className="table-header">
                                        <tr>
                                            <th>Incident ID</th>
                                            <th>Date</th>
                                            <th>Location</th>
                                            <th>Content</th>
                                            <th>File</th>
                                            <th>Status</th>
                                            <th>Reviewer</th>
                                            <th>Operation</th>
                                        </tr>
                                    </thead>
                                    <tbody className="table-body-container">
                                    {incidents.map(incident => (
                                            <tr key={incident.id}>
                                                <td>{incident.id}</td>
                                                <td>{incident.incident_time}</td>
                                                <td>{incident.incident_location}</td>
                                                <td className="content-cell" title={incident.content}>
                                                    {incident.content.length > 0 ? `${incident.content.slice(0, isSmallScreen ? 10 : 85)}...` : incident.content}
                                                </td>
                                                <td>
                                                    <div className="file-icons-container">
                                                        <a href={incident.file_url} target="_blank" rel="noopener noreferrer" className="file-icon">
                                                            <img src="/path/to/document-icon.png" alt="Document" />
                                                        </a>
                                                        <a href={incident.file_url} target="_blank" rel="noopener noreferrer" className="file-icon">
                                                            <img src="/path/to/document-icon.png" alt="Document" />
                                                        </a>
                                                    </div>
                                                </td>
                                                <td>{incident.status}</td>
                                                <td>{incident.reviewer}</td>
                                                <td>
                                                    <Button color="btn btn-detail" size="sm">Detail</Button>{' '}
                                                    <Button color="btn btn-reject" size="sm">Reject</Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                            <div className="pagination">
                                <button disabled={currentPage <= 1} onClick={() => handlePageChange(currentPage - 1)}>
                                    <i className="fa-solid fa-sharp fa-angle-left fa-xl" style={{ color: '#d9d9d9' }}></i>
                                </button>
                                <span className="page-info">
                                    <span className="current-page">{currentPage}</span> / {totalPages}
                                </span>
                                <button disabled={currentPage >= totalPages} onClick={() => handlePageChange(currentPage + 1)}>
                                    <i className="fa-solid fa-angle-right fa-xl" style={{ color: '#d9d9d9' }}></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IncidentListPage;