'use client'

import ProtectedRoute from '@/components/ProtectedRoute'
import DashboardLayout from '@/components/DashboardLayout'
import { Plus, Clock, CheckCircle, XCircle, Eye, Download, Phone, Mail, MapPin, IdCard } from 'lucide-react'
import { useState } from 'react'

export default function WorkerOnboardingPage() {
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected' | 'add'>('pending')

  // Mock pending worker applications
  const pendingWorkers = [
    {
      id: 1,
      name: 'राम कुमार शर्मा',
      email: 'ram.sharma@email.com',
      phone: '+91 9876543210',
      department: 'Road Maintenance',
      experience: '5 years',
      address: 'Sector 15, Noida, UP',
      aadharNumber: '1234-5678-9012',
      panNumber: 'ABCDE1234F',
      profileImage: '/placeholder-profile.jpg',
      aadharImage: '/placeholder-aadhar.jpg',
      resumeUrl: '/placeholder-resume.pdf',
      appliedDate: '2024-01-15T10:30:00Z',
      status: 'pending'
    },
    {
      id: 2,
      name: 'प्रिया गुप्ता',
      email: 'priya.gupta@email.com',
      phone: '+91 9876543211',
      department: 'Sanitation',
      experience: '3 years',
      address: 'Dwarka, New Delhi',
      aadharNumber: '2345-6789-0123',
      panNumber: 'BCDEF2345G',
      profileImage: '/placeholder-profile.jpg',
      aadharImage: '/placeholder-aadhar.jpg',
      resumeUrl: '/placeholder-resume.pdf',
      appliedDate: '2024-01-14T16:45:00Z',
      status: 'pending'
    }
  ]

  const handleApprove = (workerId: number) => {
    console.log('Approving worker:', workerId)
    // Here you would call your API to approve the worker
  }

  const handleReject = (workerId: number) => {
    console.log('Rejecting worker:', workerId)
    // Here you would call your API to reject the worker
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Page header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Worker Onboarding</h1>
              <p className="mt-1 text-sm text-gray-500">
                कर्मचारी पंजीकरण और अनुमोदन प्रबंधन
              </p>
            </div>
            <button 
              onClick={() => setActiveTab('add')}
              className="bg-gradient-to-r from-orange-500 to-green-600 text-white px-4 py-2 rounded-lg flex items-center hover:from-orange-600 hover:to-green-700 transition-all"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Worker Manually
            </button>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-100">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Pending Applications</p>
                  <p className="text-2xl font-bold text-gray-900">{pendingWorkers.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Approved This Month</p>
                  <p className="text-2xl font-bold text-gray-900">12</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-red-100">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Rejected</p>
                  <p className="text-2xl font-bold text-gray-900">3</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100">
                  <IdCard className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Active Workers</p>
                  <p className="text-2xl font-bold text-gray-900">45</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {[
                  { key: 'pending', label: 'Pending Approval', count: pendingWorkers.length },
                  { key: 'approved', label: 'Approved Workers', count: 45 },
                  { key: 'rejected', label: 'Rejected', count: 3 },
                  { key: 'add', label: 'Add Manually', count: null }
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as any)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.key
                        ? 'border-orange-500 text-orange-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab.label}
                    {tab.count !== null && (
                      <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                        activeTab === tab.key
                          ? 'bg-orange-100 text-orange-600'
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {activeTab === 'pending' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900">Pending Worker Applications</h3>
                  <div className="space-y-4">
                    {pendingWorkers.map((worker) => (
                      <div key={worker.id} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex space-x-4">
                            <div className="h-16 w-16 bg-gradient-to-r from-orange-100 to-green-100 rounded-lg flex items-center justify-center">
                              <span className="text-lg font-bold text-orange-600">
                                {worker.name.split(' ')[0][0]}{worker.name.split(' ')[1] ? worker.name.split(' ')[1][0] : ''}
                              </span>
                            </div>
                            <div className="flex-1">
                              <h4 className="text-lg font-medium text-gray-900">{worker.name}</h4>
                              <p className="text-sm text-gray-600">{worker.department} • {worker.experience} experience</p>
                              
                              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
                                <div className="space-y-1">
                                  <div className="flex items-center">
                                    <Mail className="h-4 w-4 mr-2" />
                                    {worker.email}
                                  </div>
                                  <div className="flex items-center">
                                    <Phone className="h-4 w-4 mr-2" />
                                    {worker.phone}
                                  </div>
                                  <div className="flex items-center">
                                    <MapPin className="h-4 w-4 mr-2" />
                                    {worker.address}
                                  </div>
                                </div>
                                <div className="space-y-1">
                                  <div className="flex items-center">
                                    <IdCard className="h-4 w-4 mr-2" />
                                    Aadhar: {worker.aadharNumber}
                                  </div>
                                  <div className="flex items-center">
                                    <IdCard className="h-4 w-4 mr-2" />
                                    PAN: {worker.panNumber}
                                  </div>
                                  <div className="text-xs text-gray-400">
                                    Applied: {formatDate(worker.appliedDate)}
                                  </div>
                                </div>
                              </div>

                              <div className="mt-4 flex items-center space-x-4">
                                <button className="text-blue-600 hover:text-blue-500 flex items-center text-sm">
                                  <Eye className="h-4 w-4 mr-1" />
                                  View Profile Photo
                                </button>
                                <button className="text-blue-600 hover:text-blue-500 flex items-center text-sm">
                                  <Eye className="h-4 w-4 mr-1" />
                                  View Aadhar
                                </button>
                                <button className="text-blue-600 hover:text-blue-500 flex items-center text-sm">
                                  <Download className="h-4 w-4 mr-1" />
                                  Download Resume
                                </button>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex space-x-3">
                            <button
                              onClick={() => handleReject(worker.id)}
                              className="px-4 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50 transition-colors"
                            >
                              Reject
                            </button>
                            <button
                              onClick={() => handleApprove(worker.id)}
                              className="px-4 py-2 bg-gradient-to-r from-orange-500 to-green-600 text-white rounded-md hover:from-orange-600 hover:to-green-700 transition-all"
                            >
                              Approve & Generate Credentials
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'add' && (
                <div className="max-w-2xl">
                  <h3 className="text-lg font-medium text-gray-900 mb-6">Manually Add Worker</h3>
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name (पूरा नाम)
                        </label>
                        <input
                          type="text"
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          placeholder="राम कुमार शर्मा"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          placeholder="worker@email.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          placeholder="+91 9876543210"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Department
                        </label>
                        <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                          <option value="">Select Department</option>
                          <option value="road-maintenance">Road Maintenance</option>
                          <option value="sanitation">Sanitation</option>
                          <option value="electrical">Electrical Services</option>
                          <option value="water">Water Services</option>
                          <option value="parks">Parks & Recreation</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address
                      </label>
                      <textarea
                        rows={3}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="Complete address with pin code"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Aadhar Number
                        </label>
                        <input
                          type="text"
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          placeholder="1234-5678-9012"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          PAN Number
                        </label>
                        <input
                          type="text"
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          placeholder="ABCDE1234F"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 bg-gradient-to-r from-orange-500 to-green-600 text-white rounded-md hover:from-orange-600 hover:to-green-700 transition-all"
                      >
                        Create Worker & Generate Credentials
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {(activeTab === 'approved' || activeTab === 'rejected') && (
                <div className="text-center py-12">
                  <div className="text-gray-500">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4" />
                    <p>This section will show {activeTab} workers</p>
                    <p className="text-sm">Feature coming soon...</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}