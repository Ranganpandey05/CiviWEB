'use client'

import React, { useState, useEffect } from 'react'
import Layout from '@/components/Layout/Layout'
import { useLanguage } from '@/contexts/LanguageContext'
import adminAPI from '@/lib/adminAPI'
import { 
  FiTrendingUp,
  FiUsers,
  FiClock,
  FiCheckCircle,
  FiBarChart,
  FiPieChart,
  FiActivity,
  FiCalendar,
  FiMapPin,
  FiStar
} from 'react-icons/fi'

interface AnalyticsData {
  totalTasks: number
  completedTasks: number
  pendingTasks: number
  activeWorkers: number
  averageResolutionTime: number
  tasksByCategory: { [key: string]: number }
  tasksByPriority: { [key: string]: number }
  performanceMetrics: {
    completionRate: number
    averageRating: number
    responseTime: number
  }
}

export default function AnalyticsPage() {
  const { t } = useLanguage()
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('7d')

  useEffect(() => {
    loadAnalytics()
  }, [timeRange])

  const loadAnalytics = async () => {
    try {
      setLoading(true)
      const data = await adminAPI.getDashboardAnalytics()
      
      // Transform the data to match our analytics structure
      const analyticsData: AnalyticsData = {
        totalTasks: data.tasks.total || 0,
        completedTasks: data.tasks.completed || 0,
        pendingTasks: data.tasks.pending || 0,
        activeWorkers: data.workers.active || 0,
        averageResolutionTime: 2.5, // hours
        tasksByCategory: {
          'Road Maintenance': 45,
          'Water Supply': 32,
          'Waste Management': 28,
          'Street Lighting': 18,
          'Public Safety': 15
        },
        tasksByPriority: {
          'Urgent': 12,
          'High': 28,
          'Medium': 45,
          'Low': 23
        },
        performanceMetrics: {
          completionRate: data.tasks.completed && data.tasks.total ? 
            (data.tasks.completed / data.tasks.total) * 100 : 0,
          averageRating: 4.3,
          responseTime: 1.2 // hours
        }
      }
      
      setAnalytics(analyticsData)
    } catch (error) {
      console.error('Error loading analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (hours: number) => {
    if (hours < 1) {
      return `${Math.round(hours * 60)}m`
    }
    return `${hours.toFixed(1)}h`
  }

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Road Maintenance': 'bg-blue-500',
      'Water Supply': 'bg-cyan-500',
      'Waste Management': 'bg-green-500',
      'Street Lighting': 'bg-yellow-500',
      'Public Safety': 'bg-red-500'
    }
    return colors[category] || 'bg-gray-500'
  }

  const getPriorityColor = (priority: string) => {
    const colors: { [key: string]: string } = {
      'Urgent': 'bg-red-500',
      'High': 'bg-orange-500',
      'Medium': 'bg-yellow-500',
      'Low': 'bg-green-500'
    }
    return colors[priority] || 'bg-gray-500'
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{t('analytics')}</h1>
              <p className="text-gray-600 mt-1">Performance insights and data analytics</p>
            </div>
            <div className="mt-4 sm:mt-0">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
              </select>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                <p className="text-2xl font-bold text-gray-900">{analytics?.totalTasks || 0}</p>
                <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
                  <FiTrendingUp className="w-3 h-3" />
                  +12% from last period
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <FiBarChart className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics?.performanceMetrics.completionRate.toFixed(1) || 0}%
                </p>
                <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
                  <FiTrendingUp className="w-3 h-3" />
                  +5% from last period
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <FiCheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Workers</p>
                <p className="text-2xl font-bold text-gray-900">{analytics?.activeWorkers || 0}</p>
                <p className="text-sm text-blue-600 flex items-center gap-1 mt-1">
                  <FiUsers className="w-3 h-3" />
                  Available now
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <FiUsers className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Resolution</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatTime(analytics?.averageResolutionTime || 0)}
                </p>
                <p className="text-sm text-orange-600 flex items-center gap-1 mt-1">
                  <FiClock className="w-3 h-3" />
                  Response time
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <FiClock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tasks by Category */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <FiPieChart className="w-5 h-5 text-gray-700" />
              <h3 className="text-lg font-semibold text-gray-900">Tasks by Category</h3>
            </div>
            <div className="space-y-3">
              {analytics?.tasksByCategory && Object.entries(analytics.tasksByCategory).map(([category, count]) => {
                const total = Object.values(analytics.tasksByCategory).reduce((a, b) => a + b, 0)
                const percentage = total > 0 ? (count / total) * 100 : 0
                return (
                  <div key={category} className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className={`w-3 h-3 rounded-full ${getCategoryColor(category)}`}></div>
                      <span className="text-sm text-gray-700">{category}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${getCategoryColor(category)}`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 w-8">{count}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Tasks by Priority */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <FiBarChart className="w-5 h-5 text-gray-700" />
              <h3 className="text-lg font-semibold text-gray-900">Tasks by Priority</h3>
            </div>
            <div className="space-y-3">
              {analytics?.tasksByPriority && Object.entries(analytics.tasksByPriority).map(([priority, count]) => {
                const total = Object.values(analytics.tasksByPriority).reduce((a, b) => a + b, 0)
                const percentage = total > 0 ? (count / total) * 100 : 0
                return (
                  <div key={priority} className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className={`w-3 h-3 rounded-full ${getPriorityColor(priority)}`}></div>
                      <span className="text-sm text-gray-700">{priority}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${getPriorityColor(priority)}`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 w-8">{count}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <FiActivity className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Task Completion</h3>
            </div>
            <div className="text-center">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="40" 
                    fill="none" 
                    stroke="#10b981" 
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${(analytics?.performanceMetrics.completionRate || 0) * 2.51} 251.2`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-900">
                    {analytics?.performanceMetrics.completionRate.toFixed(0) || 0}%
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-600">Tasks completed successfully</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <FiStar className="w-5 h-5 text-yellow-600" />
              <h3 className="text-lg font-semibold text-gray-900">Average Rating</h3>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">
                {analytics?.performanceMetrics.averageRating.toFixed(1) || 0}
              </div>
              <div className="flex justify-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FiStar 
                    key={star}
                    className={`w-5 h-5 ${
                      star <= (analytics?.performanceMetrics.averageRating || 0) 
                        ? 'text-yellow-400 fill-current' 
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-600">Citizen satisfaction rating</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <FiClock className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Response Time</h3>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">
                {formatTime(analytics?.performanceMetrics.responseTime || 0)}
              </div>
              <p className="text-sm text-gray-600 mb-4">Average response time</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: '75%' }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Target: 2h | Current: {formatTime(analytics?.performanceMetrics.responseTime || 0)}</p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-4">
            <FiActivity className="w-5 h-5 text-gray-700" />
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity Trends</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <FiMapPin className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">156</div>
              <div className="text-sm text-gray-600">Reports this week</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <FiCheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">89</div>
              <div className="text-sm text-gray-600">Resolved this week</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <FiUsers className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">12</div>
              <div className="text-sm text-gray-600">Active workers today</div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}