'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { supabase } from '@/lib/supabase'
import Layout from '@/components/Layout/Layout'
import { 
  Users, 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  Clock, 
  FileText,
  Eye,
  Phone,
  Mail,
  MapPin,
  Briefcase
} from 'lucide-react'

interface WorkerApplication {
  id: string
  full_name: string
  email: string
  username: string
  phone?: string
  department: string
  speciality: string
  experience_years: number
  education?: string
  previous_work?: string
  id_card_url?: string
  id_card_type?: string
  id_card_number?: string
  status: 'pending' | 'approved' | 'rejected' | 'under_review'
  application_date: string
  reviewed_at?: string
  reviewed_by?: string
  rejection_reason?: string
  admin_notes?: string
  address?: string
  emergency_contact_name?: string
  emergency_contact_phone?: string
  skills?: string[]
  certifications?: string[]
}

export default function ApplicationsPage() {
  const { t } = useTranslation()
  const [applications, setApplications] = useState<WorkerApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')
  const [selectedApplication, setSelectedApplication] = useState<WorkerApplication | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [processingAction, setProcessingAction] = useState(false)

  const fetchApplications = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('worker_applications')
        .select('*')
        .order('application_date', { ascending: false })

      if (error) throw error
      setApplications(data || [])
    } catch (error) {
      console.error('Error fetching applications:', error)
    } finally {
      setLoading(false)
    }
  }

  const approveApplication = async (applicationId: string) => {
    try {
      setProcessingAction(true)
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) return

      const { error } = await supabase.rpc('approve_worker_application', {
        application_id: applicationId,
        admin_user_id: user.user.id
      })

      if (error) throw error

      // Refresh applications
      await fetchApplications()
      setShowModal(false)
      setSelectedApplication(null)
    } catch (error) {
      console.error('Error approving application:', error)
    } finally {
      setProcessingAction(false)
    }
  }

  const rejectApplication = async (applicationId: string, reason: string) => {
    try {
      setProcessingAction(true)
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) return

      const { error } = await supabase
        .from('worker_applications')
        .update({
          status: 'rejected',
          reviewed_at: new Date().toISOString(),
          reviewed_by: user.user.id,
          rejection_reason: reason
        })
        .eq('id', applicationId)

      if (error) throw error

      // Refresh applications
      await fetchApplications()
      setShowModal(false)
      setSelectedApplication(null)
    } catch (error) {
      console.error('Error rejecting application:', error)
    } finally {
      setProcessingAction(false)
    }
  }

  useEffect(() => {
    fetchApplications()

    // Subscribe to real-time updates
    const subscription = supabase
      .channel('worker_applications')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'worker_applications' },
        () => {
          fetchApplications()
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.department.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'under_review': return 'bg-yellow-100 text-yellow-800'
      case 'pending': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'rejected': return <XCircle className="h-4 w-4 text-red-600" />
      case 'under_review': return <Clock className="h-4 w-4 text-yellow-600" />
      case 'pending': return <Clock className="h-4 w-4 text-gray-600" />
      default: return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const stats = {
    total: applications.length,
    pending: applications.filter(app => app.status === 'pending').length,
    approved: applications.filter(app => app.status === 'approved').length,
    rejected: applications.filter(app => app.status === 'rejected').length
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Users className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">{t('workerApplications')}</h1>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">{t('totalApplications')}</dt>
                <dd className="text-lg font-medium text-gray-900">{stats.total}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">{t('pending')}</dt>
                <dd className="text-lg font-medium text-gray-900">{stats.pending}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">{t('approved')}</dt>
                <dd className="text-lg font-medium text-gray-900">{stats.approved}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">{t('rejected')}</dt>
                <dd className="text-lg font-medium text-gray-900">{stats.rejected}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder={t('searchApplications')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">{t('allStatuses')}</option>
              <option value="pending">{t('pending')}</option>
              <option value="approved">{t('approved')}</option>
              <option value="rejected">{t('rejected')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p>{t('noApplicationsFound')}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('applicant')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('contact')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('department')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('status')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('applicationDate')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredApplications.map((application) => (
                  <tr key={application.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {application.full_name}
                          </div>
                          <div className="text-sm text-gray-500">@{application.username}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <Mail className="h-4 w-4 mr-1" />
                        {application.email}
                      </div>
                      {application.phone && (
                        <div className="text-sm text-gray-500 flex items-center">
                          <Phone className="h-4 w-4 mr-1" />
                          {application.phone}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{application.department}</div>
                      <div className="text-sm text-gray-500">{application.speciality}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                        {getStatusIcon(application.status)}
                        <span className="ml-1">{application.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(application.application_date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => {
                          setSelectedApplication(application)
                          setShowModal(true)
                        }}
                        className="text-blue-600 hover:text-blue-900 flex items-center"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        {t('view')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Application Detail Modal */}
      {showModal && selectedApplication && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setShowModal(false)}></div>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {t('applicationDetails')}
                  </h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="h-6 w-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">{t('personalInformation')}</h4>
                      <div className="space-y-2 text-sm">
                        <p><strong>{t('fullName')}:</strong> {selectedApplication.full_name}</p>
                        <p><strong>{t('username')}:</strong> {selectedApplication.username}</p>
                        <p><strong>{t('email')}:</strong> {selectedApplication.email}</p>
                        {selectedApplication.phone && <p><strong>{t('phone')}:</strong> {selectedApplication.phone}</p>}
                        {selectedApplication.address && <p><strong>{t('address')}:</strong> {selectedApplication.address}</p>}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">{t('workDetails')}</h4>
                      <div className="space-y-2 text-sm">
                        <p><strong>{t('department')}:</strong> {selectedApplication.department}</p>
                        <p><strong>{t('speciality')}:</strong> {selectedApplication.speciality}</p>
                        <p><strong>{t('experience')}:</strong> {selectedApplication.experience_years} {t('years')}</p>
                        {selectedApplication.education && <p><strong>{t('education')}:</strong> {selectedApplication.education}</p>}
                        {selectedApplication.previous_work && <p><strong>{t('previousWork')}:</strong> {selectedApplication.previous_work}</p>}
                      </div>
                    </div>

                    {selectedApplication.emergency_contact_name && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">{t('emergencyContact')}</h4>
                        <div className="space-y-2 text-sm">
                          <p><strong>{t('name')}:</strong> {selectedApplication.emergency_contact_name}</p>
                          {selectedApplication.emergency_contact_phone && (
                            <p><strong>{t('phone')}:</strong> {selectedApplication.emergency_contact_phone}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">{t('applicationStatus')}</h4>
                      <div className="space-y-2 text-sm">
                        <p><strong>{t('status')}:</strong> 
                          <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedApplication.status)}`}>
                            {getStatusIcon(selectedApplication.status)}
                            <span className="ml-1">{selectedApplication.status}</span>
                          </span>
                        </p>
                        <p><strong>{t('applicationDate')}:</strong> {formatDate(selectedApplication.application_date)}</p>
                        {selectedApplication.reviewed_at && (
                          <p><strong>{t('reviewedAt')}:</strong> {formatDate(selectedApplication.reviewed_at)}</p>
                        )}
                        {selectedApplication.rejection_reason && (
                          <p><strong>{t('rejectionReason')}:</strong> {selectedApplication.rejection_reason}</p>
                        )}
                        {selectedApplication.admin_notes && (
                          <p><strong>{t('adminNotes')}:</strong> {selectedApplication.admin_notes}</p>
                        )}
                      </div>
                    </div>

                    {selectedApplication.id_card_url && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">{t('idCard')}</h4>
                        <div className="space-y-2">
                          {selectedApplication.id_card_type && (
                            <p className="text-sm"><strong>{t('idType')}:</strong> {selectedApplication.id_card_type}</p>
                          )}
                          {selectedApplication.id_card_number && (
                            <p className="text-sm"><strong>{t('idNumber')}:</strong> {selectedApplication.id_card_number}</p>
                          )}
                          <img 
                            src={selectedApplication.id_card_url} 
                            alt="ID Card"
                            className="w-full max-w-xs rounded-lg border"
                          />
                        </div>
                      </div>
                    )}

                    {(selectedApplication.skills && selectedApplication.skills.length > 0) && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">{t('skills')}</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedApplication.skills.map((skill, index) => (
                            <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {(selectedApplication.certifications && selectedApplication.certifications.length > 0) && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">{t('certifications')}</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedApplication.certifications.map((cert, index) => (
                            <span key={index} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                              {cert}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              {selectedApplication.status === 'pending' && (
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    disabled={processingAction}
                    onClick={() => approveApplication(selectedApplication.id)}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {processingAction ? t('processing') : t('approve')}
                  </button>
                  <button
                    type="button"
                    disabled={processingAction}
                    onClick={() => rejectApplication(selectedApplication.id, 'Rejected by admin')}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    {t('reject')}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      </div>
    </Layout>
  )
}