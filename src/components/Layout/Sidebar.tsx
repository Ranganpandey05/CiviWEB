import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar: React.FC = () => {
    return (
        <div className="sidebar">
            <h2>Admin Dashboard</h2>
            <ul>
                <li>
                    <Link to="/">Dashboard</Link>
                </li>
                <li>
                    <Link to="/reports">Reports</Link>
                </li>
                <li>
                    <Link to="/workers">Workers</Link>
                </li>
                <li>
                    <Link to="/analytics">Analytics</Link>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;