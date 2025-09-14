'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  FileText, 
  Users, 
  BarChart3, 
  Map, 
  Settings,
  Bell,
  MessageSquare,
  UserCheck,
  Activity,
  MapPin,
  Calendar,
  Clock,
  X
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getDashboardAnalytics } from '@/lib/adminAPI';

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

interface QuickStats {
  totalReports: number;
  activeWorkers: number;
  pendingTasks: number;
  urgentIssues: number;
}

const Sidebar: React.FC<SidebarProps> = ({ open, setOpen }) => {
  const pathname = usePathname();
  const { t } = useLanguage();
  const [quickStats, setQuickStats] = useState<QuickStats>({
    totalReports: 0,
    activeWorkers: 0,
    pendingTasks: 0,
    urgentIssues: 0
  });

  useEffect(() => {
    loadQuickStats();
  }, []);

  const loadQuickStats = async () => {
    try {
      const analytics = await getDashboardAnalytics();
      setQuickStats({
        totalReports: analytics.tasks.total,
        activeWorkers: analytics.workers.active,
        pendingTasks: analytics.tasks.pending,
        urgentIssues: analytics.issues_by_priority.urgent || 0
      });
    } catch (error) {
      console.error('Error loading quick stats:', error);
    }
  };

  const menuItems = [
    {
      key: 'dashboard',
      label: t('dashboard'),
      icon: Home,
      href: '/',
      badge: null
    },
    {
      key: 'reports',
      label: t('reports'),
      icon: FileText,
      href: '/reports',
      badge: quickStats.pendingTasks > 0 ? quickStats.pendingTasks : null
    },
    {
      key: 'workers',
      label: t('workers'),
      icon: Users,
      href: '/workers',
      badge: null
    },
    {
      key: 'heatmap',
      label: t('real_time_map'),
      icon: Map,
      href: '/heatmap',
      badge: quickStats.urgentIssues > 0 ? quickStats.urgentIssues : null
    },
    {
      key: 'analytics',
      label: t('analytics'),
      icon: BarChart3,
      href: '/analytics',
      badge: null
    },
    {
      key: 'applications',
      label: 'Worker Applications',
      icon: UserCheck,
      href: '/applications',
      badge: null
    },
    {
      key: 'messages',
      label: 'Community Chat',
      icon: MessageSquare,
      href: '/messages',
      badge: null
    }
  ];

  const quickActions = [
    {
      label: 'Recent Activity',
      icon: Activity,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      label: 'Live Location',
      icon: MapPin,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      label: 'Today\'s Tasks',
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {open && (
        <div 
          className="mobile-overlay lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        admin-sidebar bg-white border-r border-gray-200 shadow-lg
        ${open ? 'open' : ''}
        lg:relative lg:translate-x-0
      `}>
        {/* Close Button (Mobile) */}
        <div className="lg:hidden flex justify-end p-4">
          <button
            onClick={() => setOpen(false)}
            className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-2 rounded-lg">
              <Home className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">CiviSamadhan</h2>
              <p className="text-xs text-gray-500">Admin Portal</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`
                    group flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium
                    transition-all duration-200 ease-in-out
                    ${isActive 
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg' 
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }
                  `}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-gray-600'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`
                      inline-flex items-center justify-center px-2 py-1 text-xs font-bold rounded-full
                      ${isActive ? 'bg-white text-orange-600' : 'bg-red-500 text-white'}
                    `}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Quick Stats */}
        <div className="p-4 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Stats</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="text-2xl font-bold text-blue-600">{quickStats.totalReports}</div>
              <div className="text-xs text-blue-700">Total Reports</div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="text-2xl font-bold text-green-600">{quickStats.activeWorkers}</div>
              <div className="text-xs text-green-700">Active Workers</div>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="text-2xl font-bold text-yellow-600">{quickStats.pendingTasks}</div>
              <div className="text-xs text-yellow-700">Pending</div>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="text-2xl font-bold text-red-600">{quickStats.urgentIssues}</div>
              <div className="text-xs text-red-700">Urgent</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-4 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Actions</h3>
          <div className="space-y-2">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className={`p-1.5 rounded-md ${action.bgColor}`}>
                    <Icon className={`h-4 w-4 ${action.color}`} />
                  </div>
                  <span className="text-sm text-gray-700">{action.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Current Time */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>{new Date().toLocaleTimeString('hi-IN')}</span>
          </div>
          <div className="text-center text-xs text-gray-500 mt-1">
            {t('cityLocation')}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;