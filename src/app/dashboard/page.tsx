'use client'

import ProtectedRoute from '@/components/ProtectedRoute'
import DashboardLayout from '@/components/DashboardLayout'
import IssueHeatmap from '@/components/IssueHeatmap'
import { AlertTriangle, Users, CheckCircle, Clock, TrendingUp, MapPin } from 'lucide-react'

export default function DashboardPage() {
  // Mock data - in a real app, this would come from your API
  const stats = {
    totalIssues: 247,
    openIssues: 89,
    inProgress: 34,
    resolved: 124,
    activeWorkers: 15,
    avgResolutionTime: '2.3 days'
  }

  const recentIssues = [
    {
      id: 1,
      title: 'Pothole on Main Street',
      category: 'Road Maintenance',
      priority: 'High',
      status: 'Open',
      location: 'Main St & 5th Ave',
      created: '2 hours ago'
    },
    {
      id: 2,
      title: 'Broken streetlight',
      category: 'Infrastructure',
      priority: 'Medium',
      status: 'In Progress',
      location: 'Park Avenue',
      created: '5 hours ago'
    },
    {
      id: 3,
      title: 'Overflowing garbage bin',
      category: 'Sanitation',
      priority: 'Low',
      status: 'Open',
      location: 'Central Park',
      created: '1 day ago'
    }
  ]

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Page header */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">CiviSamadhan Dashboard</h1>
            <p className="mt-1 text-sm text-gray-500">
              नगर सेवा प्रबंधन - Smart city issue management and resolution
            </p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-gradient-to-r from-orange-100 to-orange-200">
                  <AlertTriangle className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">कुल शिकायतें</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalIssues}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-gradient-to-r from-red-100 to-red-200">
                  <Clock className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">खुली शिकायतें</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.openIssues}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-gradient-to-r from-green-100 to-green-200">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">हल की गई</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.resolved}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-gradient-to-r from-blue-100 to-blue-200">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">सक्रिय कर्मचारी</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeWorkers}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Heatmap Section */}
          <IssueHeatmap />

          {/* Recent Issues */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Recent Issues</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {recentIssues.map((issue) => (
                <div key={issue.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900">{issue.title}</h3>
                      <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                        <span>{issue.category}</span>
                        <span>•</span>
                        <span>{issue.location}</span>
                        <span>•</span>
                        <span>{issue.created}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        issue.priority === 'High' 
                          ? 'bg-red-100 text-red-800'
                          : issue.priority === 'Medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {issue.priority}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        issue.status === 'Open' 
                          ? 'bg-gray-100 text-gray-800'
                          : issue.status === 'In Progress'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {issue.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-6 py-3 bg-gray-50 text-center">
              <button className="text-sm text-blue-600 hover:text-blue-500 font-medium">
                View all issues →
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full text-left px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center">
                    <AlertTriangle className="h-5 w-5 text-blue-600 mr-3" />
                    <span className="text-sm font-medium">Create New Issue</span>
                  </div>
                </button>
                <button className="w-full text-left px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-green-600 mr-3" />
                    <span className="text-sm font-medium">Add New Worker</span>
                  </div>
                </button>
                <button className="w-full text-left px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center">
                    <TrendingUp className="h-5 w-5 text-purple-600 mr-3" />
                    <span className="text-sm font-medium">View Analytics</span>
                  </div>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Metrics</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Resolution Rate</span>
                    <span className="font-medium">78%</span>
                  </div>
                  <div className="mt-1 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '78%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Avg. Response Time</span>
                    <span className="font-medium">{stats.avgResolutionTime}</span>
                  </div>
                  <div className="mt-1 bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Worker Utilization</span>
                    <span className="font-medium">85%</span>
                  </div>
                  <div className="mt-1 bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
