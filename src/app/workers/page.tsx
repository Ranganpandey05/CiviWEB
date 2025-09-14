'use client'

import React, { useState, useEffect } from 'react'
import Layout from '@/components/Layout/Layout'
import { useLanguage } from '@/contexts/LanguageContext'
import adminAPI, { WorkerApplication } from '@/lib/adminAPI'
import { 
  FiSearch, 
  FiUser, 
  FiMapPin, 
  FiPhone, 
  FiMail, 
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiEye,
  FiUserPlus,
  FiActivity,
  FiStar,
  FiCalendar,
  FiTool
} from 'react-icons/fi'

export default function WorkersPage() {
  const { t } = useLanguage()
  const [workers, setWorkers] = useState<WorkerApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedWorker, setSelectedWorker] = useState<WorkerApplication | null>(null)
  const [showAddWorkerModal, setShowAddWorkerModal] = useState(false)
  const [newWorkerData, setNewWorkerData] = useState({
    full_name: '',
    email: '',
    username: '',
    phone: '',
    department: '',
    speciality: '',
    password: ''
  })

  useEffect(() => {
    loadWorkers()
  }, [])

  const loadWorkers = async () => {
    try {
      setLoading(true)
      const response = await adminAPI.getAllWorkerApplications()
      // getAllWorkerApplications returns { applications: WorkerApplication[], total: number }
      setWorkers(response.applications || [])
    } catch (error) {
      console.error('Error loading workers:', error)
      setWorkers([])
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <FiCheckCircle className="w-4 h-4 text-green-500" />
      case 'pending':
        return <FiClock className="w-4 h-4 text-yellow-500" />
      case 'rejected':
        return <FiXCircle className="w-4 h-4 text-red-500" />
      default:
        return <FiUser className="w-4 h-4 text-gray-500" />
    }
  }

  const filteredWorkers = workers.filter(worker => {
    const matchesSearch = worker.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         worker.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         worker.phone.includes(searchTerm)
    const matchesStatus = statusFilter === 'all' || worker.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const approveWorker = async (workerId: string) => {
    try {
      await adminAPI.approveWorkerApplication(workerId, 'admin-id')
      await loadWorkers()
    } catch (error) {
      console.error('Error approving worker:', error)
    }
  }

  const rejectWorker = async (workerId: string) => {
    try {
      await adminAPI.rejectWorkerApplication(workerId, 'admin-id', 'Application rejected by admin')
      await loadWorkers()
    } catch (error) {
      console.error('Error rejecting worker:', error)
    }
  }

  const handleAddWorker = async () => {
    try {
      const result = await adminAPI.createWorker(newWorkerData)
      if (result.success) {
        setShowAddWorkerModal(false)
        setNewWorkerData({
          full_name: '',
          email: '',
          username: '',
          phone: '',
          department: '',
          speciality: '',
          password: ''
        })
        await loadWorkers()
        
        // Show detailed success message with instructions
        const message = `Worker application created successfully!

Instructions for ${newWorkerData.full_name}:
1. Download the CiviSamadhan mobile app
2. Sign up as a Worker using these credentials:
   - Email: ${newWorkerData.email}
   - Password: ${newWorkerData.password}
   - Full Name: ${newWorkerData.full_name}
   - Username: ${newWorkerData.username}
   - Department: ${newWorkerData.department}
   - Speciality: ${newWorkerData.speciality}

The application has been pre-approved and they can login immediately after signup.`
        
        alert(message)
      } else {
        alert(result.error || 'Failed to create worker')
      }
    } catch (error) {
      console.error('Error creating worker:', error)
      alert('Failed to create worker')
    }
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{t('workers')}</h1>
              <p className="text-gray-600 mt-1">Manage worker applications and assignments</p>
            </div>
            <div className="mt-4 sm:mt-0">
              <button 
                onClick={() => setShowAddWorkerModal(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 flex items-center gap-2"
              >
                <FiUserPlus className="w-4 h-4" />
                Add Worker
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Workers</p>
                <p className="text-2xl font-bold text-gray-900">{workers.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <FiUser className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">
                  {workers.filter(w => w.status === 'approved').length}
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
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {workers.filter(w => w.status === 'pending').length}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <FiClock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-blue-600">
                  {workers.filter(w => w.status === 'approved').length}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <FiActivity className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search workers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Workers Grid */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredWorkers.length === 0 ? (
            <div className="text-center py-12">
              <FiUser className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No workers found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-6 font-medium text-gray-700">Worker</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-700">Contact</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-700">Skills</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-700">Status</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-700">Applied</th>
                    <th className="text-right py-3 px-6 font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredWorkers.map((worker) => (
                    <tr key={worker.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <FiUser className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{worker.full_name}</h3>
                            <p className="text-sm text-gray-500">@{worker.username}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <FiMail className="w-3 h-3" />
                            {worker.email}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <FiPhone className="w-3 h-3" />
                            {worker.phone}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-wrap gap-1">
                          {worker.skills && worker.skills.length > 0 ? (
                            worker.skills.slice(0, 2).map((skill: string, index: number) => (
                              <span key={index} className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                                {skill}
                              </span>
                            ))
                          ) : (
                            <span className="text-sm text-gray-500">No skills listed</span>
                          )}
                          {worker.skills && worker.skills.length > 2 && (
                            <span className="text-xs text-gray-500">+{worker.skills.length - 2} more</span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded border ${getStatusColor(worker.status)}`}>
                          {getStatusIcon(worker.status)}
                          {worker.status}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <FiCalendar className="w-3 h-3" />
                          {new Date(worker.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center gap-2 justify-end">
                          <button
                            onClick={() => setSelectedWorker(worker)}
                            className="inline-flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                          >
                            <FiEye className="w-3 h-3" />
                            View
                          </button>
                          {worker.status === 'pending' && (
                            <>
                              <button
                                onClick={() => approveWorker(worker.id)}
                                className="inline-flex items-center gap-1 px-3 py-1 text-sm text-green-600 hover:text-green-700 hover:bg-green-50 rounded transition-colors"
                              >
                                <FiCheckCircle className="w-3 h-3" />
                                Approve
                              </button>
                              <button
                                onClick={() => rejectWorker(worker.id)}
                                className="inline-flex items-center gap-1 px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                              >
                                <FiXCircle className="w-3 h-3" />
                                Reject
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Worker Details Modal */}
        {selectedWorker && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Worker Details</h2>
                  <button
                    onClick={() => setSelectedWorker(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FiXCircle className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-6">
                  {/* Basic Info */}
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                      <FiUser className="w-8 h-8 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{selectedWorker.full_name}</h3>
                      <p className="text-gray-600">@{selectedWorker.username}</p>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded border ${getStatusColor(selectedWorker.status)} mt-1`}>
                        {getStatusIcon(selectedWorker.status)}
                        {selectedWorker.status}
                      </span>
                    </div>
                  </div>
                  
                  {/* Contact Information */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Contact Information</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FiMail className="w-4 h-4" />
                        {selectedWorker.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FiPhone className="w-4 h-4" />
                        {selectedWorker.phone}
                      </div>
                      {selectedWorker.address && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <FiMapPin className="w-4 h-4" />
                          {selectedWorker.address}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Skills */}
                  {selectedWorker.skills && selectedWorker.skills.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Skills & Categories</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedWorker.skills.map((skill: string, index: number) => (
                          <span key={index} className="inline-block px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-lg">
                            <FiTool className="w-3 h-3 inline mr-1" />
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Experience */}
                  {selectedWorker.experience_years && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Experience</h4>
                      <p className="text-sm text-gray-600">{selectedWorker.experience_years} years of experience</p>
                      {selectedWorker.previous_work && (
                        <p className="text-sm text-gray-600 mt-1">{selectedWorker.previous_work}</p>
                      )}
                    </div>
                  )}
                  
                  {/* Department & Speciality */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Department & Speciality</h4>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600">Department: {selectedWorker.department}</p>
                      <p className="text-sm text-gray-600">Speciality: {selectedWorker.speciality}</p>
                    </div>
                  </div>
                  
                  {/* Application Date */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Application Date</h4>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FiCalendar className="w-4 h-4" />
                      {new Date(selectedWorker.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 mt-6 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setSelectedWorker(null)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    Close
                  </button>
                  {selectedWorker.status === 'pending' && (
                    <>
                      <button
                        onClick={() => {
                          approveWorker(selectedWorker.id)
                          setSelectedWorker(null)
                        }}
                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                      >
                        Approve Application
                      </button>
                      <button
                        onClick={() => {
                          rejectWorker(selectedWorker.id)
                          setSelectedWorker(null)
                        }}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                      >
                        Reject Application
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Worker Modal */}
        {showAddWorkerModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-screen overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Add New Worker</h2>
                <button
                  onClick={() => setShowAddWorkerModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={newWorkerData.full_name}
                    onChange={(e) => setNewWorkerData({...newWorkerData, full_name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                  <input
                    type="text"
                    value={newWorkerData.username}
                    onChange={(e) => setNewWorkerData({...newWorkerData, username: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter username"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={newWorkerData.email}
                    onChange={(e) => setNewWorkerData({...newWorkerData, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={newWorkerData.phone}
                    onChange={(e) => setNewWorkerData({...newWorkerData, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <select
                    value={newWorkerData.department}
                    onChange={(e) => setNewWorkerData({...newWorkerData, department: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Department</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Water Supply">Water Supply</option>
                    <option value="Sanitation">Sanitation</option>
                    <option value="Public Works">Public Works</option>
                    <option value="Roads">Roads</option>
                    <option value="Waste Management">Waste Management</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Speciality</label>
                  <input
                    type="text"
                    value={newWorkerData.speciality}
                    onChange={(e) => setNewWorkerData({...newWorkerData, speciality: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter speciality"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    value={newWorkerData.password}
                    onChange={(e) => setNewWorkerData({...newWorkerData, password: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter password"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowAddWorkerModal(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddWorker}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Create Worker
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}