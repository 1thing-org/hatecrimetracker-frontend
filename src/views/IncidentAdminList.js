import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Table, Button } from 'reactstrap';
import { UserContext } from '../providers/UserProvider';
import { auth } from '../firebase';
import './IncidentAdminList.css'; 

const IncidentListPage = () => {
    const user = useContext(UserContext) || { photoURL: '', displayName: 'Guest', email: 'guest@example.com' };
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
                                    </tbody>
                                </Table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IncidentListPage;