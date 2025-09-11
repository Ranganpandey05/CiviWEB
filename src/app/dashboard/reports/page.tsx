'use client'

import ProtectedRoute from '@/components/ProtectedRoute'
import DashboardLayout from '@/components/DashboardLayout'
import { AlertTriangle, Plus, Search, Filter, MapPin, Calendar, User, Eye } from 'lucide-react'

export default function ReportsPage() {
  // Mock data - in a real app, this would come from your API
  const reports = [
    {
      id: 1,
      title: 'Large pothole on Main Street',
      description: 'Deep pothole causing traffic issues near downtown intersection',
      category: 'Road Maintenance',
      priority: 'High',
      status: 'Open',
      location: 'Main St & 5th Ave',
      address: '123 Main Street, Downtown',
      citizenName: 'John Doe',
      citizenEmail: 'john.doe@email.com',
      assignedWorker: 'John Smith',
      created: '2024-01-15T10:30:00Z',
      updated: '2024-01-15T14:20:00Z',
      images: 2
    },
    {
      id: 2,
      title: 'Broken streetlight in residential area',
      description: 'Street light pole is damaged and not working, creating safety hazard',
      category: 'Infrastructure',
      priority: 'Medium',
      status: 'In Progress',
      location: 'Park Avenue',
      address: '456 Park Avenue, North District',
      citizenName: 'Jane Smith',
      citizenEmail: 'jane.smith@email.com',
      assignedWorker: 'Sarah Johnson',
      created: '2024-01-14T16:45:00Z',
      updated: '2024-01-15T09:15:00Z',
      images: 1
    },
    {
      id: 3,
      title: 'Overflowing garbage bin',
      description: 'Public trash bin is overflowing and attracting pests',
      category: 'Sanitation',
      priority: 'Low',
      status: 'Open',
      location: 'Central Park',
      address: 'Central Park, Section B',
      citizenName: 'Mike Johnson',
      citizenEmail: 'mike.j@email.com',
      assignedWorker: null,
      created: '2024-01-14T08:20:00Z',
      updated: '2024-01-14T08:20:00Z',
      images: 3
    },
    {
      id: 4,
      title: 'Water main leak',
      description: 'Small leak in water main causing wet pavement',
      category: 'Water Services',
      priority: 'Urgent',
      status: 'Resolved',
      location: 'Oak Street',
      address: '789 Oak Street, East District',
      citizenName: 'Lisa Brown',
      citizenEmail: 'lisa.brown@email.com',
      assignedWorker: 'Mike Wilson',
      created: '2024-01-13T12:00:00Z',
      updated: '2024-01-14T16:30:00Z',
      images: 2
    }
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Urgent':
        return 'bg-red-100 text-red-800'
      case 'High':
        return 'bg-orange-100 text-orange-800'
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'Low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open':
        return 'bg-blue-100 text-blue-800'
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800'
      case 'Resolved':
        return 'bg-green-100 text-green-800'
      case 'Closed':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Page header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Issues & Reports</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage citizen reports and track issue resolution
              </p>
            </div>
            <button className="btn-primary flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              Create Issue
            </button>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100">
                  <AlertTriangle className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Issues</p>
                  <p className="text-2xl font-bold text-gray-900">{reports.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-orange-100">
                  <AlertTriangle className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Open Issues</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {reports.filter(r => r.status === 'Open').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-100">
                  <AlertTriangle className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">In Progress</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {reports.filter(r => r.status === 'In Progress').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100">
                  <AlertTriangle className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Resolved</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {reports.filter(r => r.status === 'Resolved').length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters and search */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search reports..."
                    className="pl-10 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <select className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="">All Categories</option>
                <option value="road">Road Maintenance</option>
                <option value="infrastructure">Infrastructure</option>
                <option value="sanitation">Sanitation</option>
                <option value="water">Water Services</option>
              </select>
              <select className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="">All Status</option>
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
              <select className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="">All Priorities</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          {/* Reports list */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Recent Reports</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {reports.map((report) => (
                <div key={report.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">{report.title}</h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(report.priority)}`}>
                          {report.priority}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                          {report.status}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{report.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>{report.location}</span>
                        </div>
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2" />
                          <span>{report.citizenName}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>{formatDate(report.created)}</span>
                        </div>
                        {report.assignedWorker && (
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-2" />
                            <span>Assigned: {report.assignedWorker}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-3 flex items-center space-x-4">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {report.category}
                        </span>
                        {report.images > 0 && (
                          <span className="text-xs text-gray-500">
                            📷 {report.images} image{report.images !== 1 ? 's' : ''}
                          </span>
                        )}
                        <span className="text-xs text-gray-500">
                          ID: #{report.id}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md">
                        <Eye className="h-4 w-4" />
                      </button>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Last updated</p>
                        <p className="text-xs font-medium text-gray-900">
                          {formatDate(report.updated)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-6 py-3 bg-gray-50 text-center">
              <button className="text-sm text-blue-600 hover:text-blue-500 font-medium">
                Load more reports →
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
