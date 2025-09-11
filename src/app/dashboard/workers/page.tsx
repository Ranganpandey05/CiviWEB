'use client'

import ProtectedRoute from '@/components/ProtectedRoute'
import DashboardLayout from '@/components/DashboardLayout'
import { Users, Plus, Search, Filter, Phone, Mail, MapPin, Star } from 'lucide-react'

export default function WorkersPage() {
  // Mock data - in a real app, this would come from your API
  const workers = [
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@city.gov',
      phone: '+1 (555) 123-4567',
      department: 'Public Works',
      specialties: ['Road Maintenance', 'Pothole Repair'],
      status: 'active',
      currentAssignments: 3,
      totalResolved: 87,
      rating: 4.8,
      location: 'Downtown District',
      lastActive: '2 hours ago'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@city.gov',
      phone: '+1 (555) 234-5678',
      department: 'Electrical Services',
      specialties: ['Street Lighting', 'Electrical Repair'],
      status: 'busy',
      currentAssignments: 5,
      totalResolved: 124,
      rating: 4.9,
      location: 'North District',
      lastActive: '1 hour ago'
    },
    {
      id: 3,
      name: 'Mike Wilson',
      email: 'mike.wilson@city.gov',
      phone: '+1 (555) 345-6789',
      department: 'Sanitation',
      specialties: ['Waste Management', 'Street Cleaning'],
      status: 'active',
      currentAssignments: 2,
      totalResolved: 156,
      rating: 4.7,
      location: 'South District',
      lastActive: '30 minutes ago'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'busy':
        return 'bg-yellow-100 text-yellow-800'
      case 'inactive':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Page header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Workers</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage field workers and their assignments
              </p>
            </div>
            <button className="btn-primary flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              Add Worker
            </button>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Workers</p>
                  <p className="text-2xl font-bold text-gray-900">{workers.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Active</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {workers.filter(w => w.status === 'active').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-100">
                  <Users className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Busy</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {workers.filter(w => w.status === 'busy').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100">
                  <Star className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Avg Rating</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {(workers.reduce((acc, w) => acc + w.rating, 0) / workers.length).toFixed(1)}
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
                    placeholder="Search workers..."
                    className="pl-10 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <select className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="">All Departments</option>
                <option value="public-works">Public Works</option>
                <option value="electrical">Electrical Services</option>
                <option value="sanitation">Sanitation</option>
              </select>
              <select className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="busy">Busy</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Workers list */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Worker Directory</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {workers.map((worker) => (
                <div key={worker.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center">
                        <span className="text-lg font-medium text-white">
                          {worker.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{worker.name}</h3>
                        <p className="text-sm text-gray-500">{worker.department}</p>
                        <div className="flex items-center mt-1 space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 mr-1" />
                            {worker.email}
                          </div>
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 mr-1" />
                            {worker.phone}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {worker.location}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-900">{worker.currentAssignments}</p>
                        <p className="text-xs text-gray-500">Current</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-900">{worker.totalResolved}</p>
                        <p className="text-xs text-gray-500">Resolved</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 mr-1" />
                          <p className="text-sm font-medium text-gray-900">{worker.rating}</p>
                        </div>
                        <p className="text-xs text-gray-500">Rating</p>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(worker.status)}`}>
                          {worker.status}
                        </span>
                        <p className="text-xs text-gray-500">{worker.lastActive}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">Specialties:</span>
                      {worker.specialties.map((specialty, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
