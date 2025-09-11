import React from 'react';
import Header from './Layout/Header';
import Sidebar from './Layout/Sidebar';
import { Outlet } from 'react-router-dom';

const Dashboard: React.FC = () => {
    return (
        <div className="dashboard">
            <Header />
            <div className="dashboard-content">
                <Sidebar />
                <main>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Dashboard;