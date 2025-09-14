'use client';

import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { LanguageProvider } from '@/contexts/LanguageContext';
import '@/styles/layout-fixes.css';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <LanguageProvider>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
                <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                <div className="admin-layout">
                    <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
                    <main className="admin-main">
                        <div className="p-4 lg:p-8">
                            <div className="max-w-7xl mx-auto">
                                {children}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </LanguageProvider>
    );
};

export default Layout;