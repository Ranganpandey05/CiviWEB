'use client'

import React, { useState, useEffect } from 'react'
import Layout from '@/components/Layout/Layout'
import { useLanguage } from '@/contexts/LanguageContext'
import adminAPI, { Task } from '@/lib/adminAPI'
import { supabase } from '@/lib/supabase'
import { 
  FiSearch, 
  FiFilter, 
  FiMapPin, 
  FiClock, 
  FiUser, 
  FiAlertCircle,
  FiCheckCircle,
  FiXCircle,
  FiEye,
  FiUserCheck,
  FiPhone,
  FiCamera,
  FiCalendar
} from 'react-icons/fi'

export default function ReportsPage() {
  const { t } = useLanguage()
  const [reports, setReports] = useState<Task[]>([])
  const [workers, setWorkers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [selectedReport, setSelectedReport] = useState<Task | null>(null)
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [selectedWorkerId, setSelectedWorkerId] = useState('')

  useEffect(() => {
    loadReports()
    loadWorkers()

    // Set up real-time subscription for new reports
    const subscription = supabase
      .channel('reports-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'tasks' 
        }, 
        (payload) => {
          console.log('Real-time update received:', payload)
          // Reload reports when any task changes
          loadReports()
        }
      )
      .subscribe()

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const loadReports = async () => {
    try {
      setLoading(true)
      const data = await adminAPI.getTasks()
      setReports(data || [])
    } catch (error) {
      console.error('Error loading reports:', error)
      setReports([])
    } finally {
      setLoading(false)
    }
  }

  const loadWorkers = async () => {
    try {
      const workersData = await adminAPI.getWorkersWithLocation()
      setWorkers(workersData || [])
    } catch (error) {
      console.error('Error loading workers:', error)
      setWorkers([])
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <FiCheckCircle className="w-4 h-4 text-green-500" />
      case 'in_progress':
        return <FiClock className="w-4 h-4 text-blue-500" />
      case 'assigned':
        return <FiUser className="w-4 h-4 text-orange-500" />
      case 'cancelled':
        return <FiXCircle className="w-4 h-4 text-red-500" />
      default:
        return <FiAlertCircle className="w-4 h-4 text-yellow-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'assigned':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-500'
      case 'high':
        return 'bg-orange-500'
      case 'medium':
        return 'bg-yellow-500'
      default:
        return 'bg-green-500'
    }
  }

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.address.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter
    const matchesCategory = categoryFilter === 'all' || report.category === categoryFilter
    const matchesPriority = priorityFilter === 'all' || report.priority === priorityFilter
    
    return matchesSearch && matchesStatus && matchesCategory && matchesPriority
  })

  const assignWorker = async () => {
    if (!selectedReport || !selectedWorkerId) return
    
    try {
      await adminAPI.assignTaskToWorker(selectedReport.id, selectedWorkerId, 'admin-id')
      await loadReports()
      setShowAssignModal(false)
      setSelectedWorkerId('')
      setSelectedReport(null)
    } catch (error) {
      console.error('Error assigning worker:', error)
    }
  }

  const openAssignModal = (report: Task) => {
    setSelectedReport(report)
    setShowAssignModal(true)
  }

  const updateReportStatus = async (reportId: string, status: string) => {
    try {
      await adminAPI.updateTaskStatus(reportId, status, 'admin-id')
      await loadReports()
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{t('reports')}</h1>
              <p className="text-gray-600 mt-1">Manage citizen reports and issue tracking</p>
            </div>
            <div className="mt-4 sm:mt-0">
              <button className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-orange-600 hover:to-pink-600 transition-all duration-200 flex items-center gap-2">
                <FiCamera className="w-4 h-4" />
                {t('createReport')}
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="assigned">Assigned</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="road_maintenance">Road Maintenance</option>
              <option value="water_supply">Water Supply</option>
              <option value="waste_management">Waste Management</option>
              <option value="street_lighting">Street Lighting</option>
              <option value="public_safety">Public Safety</option>
            </select>

            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="all">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        </div>

        {/* Reports Grid */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="text-center py-12">
              <FiAlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No reports found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-6 font-medium text-gray-700">Report</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-700">Status</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-700">Priority</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-700">Location</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-700">Citizen</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-700">Worker</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-700">Created</th>
                    <th className="text-right py-3 px-6 font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredReports.map((report) => (
                    <tr key={report.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6">
                        <div>
                          <h3 className="font-medium text-gray-900 truncate">{report.title}</h3>
                          <p className="text-sm text-gray-500 truncate">{report.description}</p>
                          <span className="inline-block mt-1 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                            {report.category.replace('_', ' ')}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded border ${getStatusColor(report.status)}`}>
                          {getStatusIcon(report.status)}
                          {report.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${getPriorityColor(report.priority)}`}></div>
                          <span className="text-sm text-gray-700 capitalize">{report.priority}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <FiMapPin className="w-3 h-3 text-gray-400 flex-shrink-0" />
                          <span className="truncate">{report.address}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{report.citizen_name}</p>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <FiPhone className="w-3 h-3" />
                            {report.citizen_phone || 'N/A'}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        {report.assigned_worker_id ? (
                          <div>
                            <div className="flex items-center gap-1 text-sm text-gray-900">
                              <FiUserCheck className="w-3 h-3 text-green-500" />
                              Worker ID: {report.assigned_worker_id}
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">Unassigned</span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <FiCalendar className="w-3 h-3" />
                          {new Date(report.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => setSelectedReport(report)}
                          className="inline-flex items-center gap-1 px-3 py-1 text-sm text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded transition-colors"
                        >
                          <FiEye className="w-3 h-3" />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Report Details Modal */}
        {selectedReport && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Report Details</h2>
                  <button
                    onClick={() => setSelectedReport(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FiXCircle className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900">{selectedReport.title}</h3>
                    <p className="text-gray-600 mt-1">{selectedReport.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Status</label>
                      <div className="mt-1">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded border ${getStatusColor(selectedReport.status)}`}>
                          {getStatusIcon(selectedReport.status)}
                          {selectedReport.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Priority</label>
                      <div className="mt-1 flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${getPriorityColor(selectedReport.priority)}`}></div>
                        <span className="text-sm text-gray-700 capitalize">{selectedReport.priority}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700">Location</label>
                    <p className="text-sm text-gray-600 mt-1">{selectedReport.address}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700">Citizen Information</label>
                    <div className="mt-1 space-y-1">
                      <p className="text-sm text-gray-900">{selectedReport.citizen_name}</p>
                      <p className="text-sm text-gray-600">{selectedReport.citizen_phone || 'N/A'}</p>
                    </div>
                  </div>
                  
                  {selectedReport.assigned_worker_id && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Assigned Worker</label>
                      <div className="mt-1 space-y-1">
                        <p className="text-sm text-gray-900">Worker ID: {selectedReport.assigned_worker_id}</p>
                      </div>
                    </div>
                  )}
                  
                  {selectedReport.photos && selectedReport.photos.length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Images</label>
                      <div className="mt-2 grid grid-cols-3 gap-2">
                        {selectedReport.photos.map((image: string, index: number) => (
                          <img
                            key={index}
                            src={image}
                            alt={`Report image ${index + 1}`}
                            className="w-full h-20 object-cover rounded-lg border border-gray-200"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2 mt-6 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setSelectedReport(null)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    Close
                  </button>
                  {!selectedReport.assigned_worker_id && (
                    <button 
                      onClick={() => openAssignModal(selectedReport)}
                      className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
                    >
                      Assign Worker
                    </button>
                  )}
                  <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
                    Update Status
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Worker Assignment Modal */}
        {showAssignModal && selectedReport && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg max-w-md w-full mx-4">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Assign Worker to Task
                </h3>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Task: {selectedReport.title}</p>
                  <p className="text-sm text-gray-600 mb-4">Location: {selectedReport.address}</p>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Worker
                  </label>
                  <select
                    value={selectedWorkerId}
                    onChange={(e) => setSelectedWorkerId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Choose a worker...</option>
                    {workers.map((worker) => (
                      <option key={worker.id} value={worker.id}>
                        {worker.full_name} - {worker.department} ({worker.speciality})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowAssignModal(false)
                      setSelectedWorkerId('')
                    }}
                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={assignWorker}
                    disabled={!selectedWorkerId}
                    className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white rounded-lg transition-colors"
                  >
                    Assign Worker
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}