'use client';

import React from 'react';
import Layout from './components/Layout/Layout';
import Dashboard from './components/Dashboard';
import './styles/globals.css';

const App = () => {
    return (
        <Layout>
            <Dashboard />
        </Layout>
    );
};

export default App;