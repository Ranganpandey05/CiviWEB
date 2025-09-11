import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
    return (
        <header className="header">
            <h1>Civic Issue Reporting Dashboard</h1>
            <nav>
                <ul>
                    <li><Link to="/">Dashboard</Link></li>
                    <li><Link to="/reports">Reports</Link></li>
                    <li><Link to="/workers">Workers</Link></li>
                    <li><Link to="/analytics">Analytics</Link></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;