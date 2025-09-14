'use client';

import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Users, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Activity,
  TrendingUp,
  MapPin,
  Calendar,
  Phone,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  UserCheck
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  getDashboardAnalytics,
  getTasks,
  getApprovedWorkers,
  Task,
  Profile,
  subscribeToTasks,
  subscribeToWorkerLocations
} from '@/lib/adminAPI';
import IssueHeatmap from './IssueHeatmap';

interface DashboardStats {
  totalReports: number;
  activeWorkers: number;
  pendingIssues: number;
  completedToday: number;
  urgentIssues: number;
  completionRate: number;
  avgResolutionTime: number;
}

const Dashboard: React.FC = () => {
  const { t } = useLanguage();
  const [stats, setStats] = useState<DashboardStats>({
    totalReports: 0,
    activeWorkers: 0,
    pendingIssues: 0,
    completedToday: 0,
    urgentIssues: 0,
    completionRate: 0,
    avgResolutionTime: 0
  });
  const [recentTasks, setRecentTasks] = useState<Task[]>([]);
  const [topWorkers, setTopWorkers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    loadDashboardData();
    
    // Set up real-time subscriptions
    const tasksSubscription = subscribeToTasks((payload) => {
      console.log('Real-time task update on dashboard:', payload);
      loadDashboardData();
      setLastUpdate(new Date());
    });

    const workersSubscription = subscribeToWorkerLocations((payload) => {
      console.log('Real-time worker update on dashboard:', payload);
      loadWorkerData();
      setLastUpdate(new Date());
    });

    return () => {
      tasksSubscription.unsubscribe();
      workersSubscription.unsubscribe();
    };
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load analytics
      const analytics = await getDashboardAnalytics();
      
      // Load recent tasks
      const tasks = await getTasks();
      setRecentTasks(tasks.slice(0, 5));
      
      // Calculate today's completed tasks
      const today = new Date().toISOString().split('T')[0];
      const completedToday = tasks.filter(task => 
        task.status === 'completed' && 
        task.updated_at.startsWith(today)
      ).length;

      setStats({
        totalReports: analytics.tasks.total,
        activeWorkers: analytics.workers.active,
        pendingIssues: analytics.tasks.pending,
        completedToday,
        urgentIssues: analytics.issues_by_priority.urgent || 0,
        completionRate: analytics.completion_rate,
        avgResolutionTime: analytics.avg_resolution_time
      });

      await loadWorkerData();
      
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadWorkerData = async () => {
    try {
      const workers = await getApprovedWorkers();
      // Sort by most recent activity
      const sortedWorkers = workers.sort((a, b) => 
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );
      setTopWorkers(sortedWorkers.slice(0, 5));
    } catch (error) {
      console.error('Error loading worker data:', error);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'अभी';
    if (diffInHours < 24) return `${diffInHours} घंटे पहले`;
    return `${Math.floor(diffInHours / 24)} दिन पहले`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'assigned': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in_progress': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'verified': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent': return <Zap className="w-4 h-4 text-red-500" />;
      case 'high': return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case 'medium': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'low': return <Activity className="w-4 h-4 text-green-500" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-600"></div>
        <span className="ml-4 text-xl text-gray-700">Loading CiviSamadhan Dashboard...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-xl shadow-lg text-white p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{t('welcome')}</h1>
            <p className="text-orange-100 text-lg">{t('real_time_overview')}</p>
            <div className="flex items-center mt-4 space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm">Real-time Data</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">{new Date().toLocaleDateString('hi-IN')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span className="text-sm">{lastUpdate.toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-2">
            <MapPin className="w-5 h-5" />
            <span className="text-lg">कोलकाता, पश्चिम बंगाल</span>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg border border-blue-200 hover:shadow-xl transition-shadow">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">{t('total_reports')}</p>
                <p className="text-3xl font-bold text-blue-900">{stats.totalReports}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+12% from last week</span>
                </div>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-green-200 hover:shadow-xl transition-shadow">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">{t('active_workers')}</p>
                <p className="text-3xl font-bold text-green-900">{stats.activeWorkers}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+8% availability</span>
                </div>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Users className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-yellow-200 hover:shadow-xl transition-shadow">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600">{t('pending_issues')}</p>
                <p className="text-3xl font-bold text-yellow-900">{stats.pendingIssues}</p>
                <div className="flex items-center mt-2">
                  <ArrowDownRight className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">-5% reduction</span>
                </div>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-emerald-200 hover:shadow-xl transition-shadow">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-600">{t('completed_today')}</p>
                <p className="text-3xl font-bold text-emerald-900">{stats.completedToday}</p>
                <div className="flex items-center mt-2">
                  <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+18% efficiency</span>
                </div>
              </div>
              <div className="bg-emerald-100 p-3 rounded-lg">
                <CheckCircle className="w-8 h-8 text-emerald-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Heatmap */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200">
        <IssueHeatmap adminId="admin_001" />
      </div>

      {/* Recent Activities & Top Workers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Task Reports */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">{t('issue_reports')}</h3>
              <button className="flex items-center text-orange-600 hover:text-orange-800">
                <Eye className="w-4 h-4 mr-1" />
                {t('view_details')}
              </button>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {recentTasks.map((task) => (
              <div key={task.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      {getPriorityIcon(task.priority)}
                      <h4 className="font-medium text-gray-900">{task.title}</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{task.description.substring(0, 100)}...</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {task.address.substring(0, 30)}...
                      </div>
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-1" />
                        {task.citizen_name}
                      </div>
                      <span>{formatTimeAgo(task.created_at)}</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Workers */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">{t('active_workers')}</h3>
              <button className="flex items-center text-green-600 hover:text-green-800">
                <UserCheck className="w-4 h-4 mr-1" />
                View All
              </button>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {topWorkers.map((worker) => (
              <div key={worker.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">
                      {worker.full_name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{worker.full_name}</h4>
                    <p className="text-sm text-gray-600">{worker.department}</p>
                    <p className="text-xs text-gray-500">{worker.speciality}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-600">Active</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatTimeAgo(worker.updated_at)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Completion Rate</h3>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-3xl font-bold text-green-600">{stats.completionRate.toFixed(1)}%</div>
          <p className="text-sm text-gray-600 mt-2">Tasks completed successfully</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Avg Resolution Time</h3>
            <Clock className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-3xl font-bold text-blue-600">{Math.round(stats.avgResolutionTime / 24)}d</div>
          <p className="text-sm text-gray-600 mt-2">Average time to resolve</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Urgent Issues</h3>
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          <div className="text-3xl font-bold text-red-600">{stats.urgentIssues}</div>
          <p className="text-sm text-gray-600 mt-2">Require immediate attention</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;