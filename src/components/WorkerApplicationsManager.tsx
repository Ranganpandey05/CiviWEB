'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, Eye, Search, Users, FileText, Phone, Mail, Calendar, User, Building, Award, AlertTriangle } from 'lucide-react';
import adminAPI, { WorkerApplication } from '@/lib/adminAPI';

interface WorkerApplicationsManagerProps {
  adminId: string;
  onApplicationProcessed?: (applicationId: string, action: 'approved' | 'rejected') => void;
}

interface ApplicationStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  under_review: number;
}

export default function WorkerApplicationsManager({ adminId, onApplicationProcessed }: WorkerApplicationsManagerProps) {
  const [applications, setApplications] = useState<WorkerApplication[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<WorkerApplication[]>([]);
  const [stats, setStats] = useState<ApplicationStats>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    under_review: 0
  });
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<WorkerApplication | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'view' | 'approve' | 'reject'>('view');
  const [rejectionReason, setRejectionReason] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Load applications on component mount
  useEffect(() => {
    loadApplications();
    loadStats();
    
    // Set up real-time subscription
    const subscription = adminAPI.subscribeToWorkerApplications((payload: any) => {
      console.log('Real-time update:', payload);
      loadApplications();
      loadStats();
    });

    return () => {
      // Clean up subscription if needed
    };
  }, [statusFilter]);

  // Filter applications when search term changes
  useEffect(() => {
    filterApplications();
  }, [applications, searchTerm, statusFilter]);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const statusToQuery = statusFilter === 'all' ? undefined : statusFilter;
      const { applications: data } = await adminAPI.getAllWorkerApplications(1, 50, statusToQuery);
      setApplications(data);
    } catch (error) {
      console.error('Error loading applications:', error);
      alert('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      // Calculate stats from applications
      const pending = applications.filter(app => app.status === 'pending').length;
      const approved = applications.filter(app => app.status === 'approved').length;
      const rejected = applications.filter(app => app.status === 'rejected').length;
      const under_review = applications.filter(app => app.status === 'under_review').length;
      
      setStats({
        total: applications.length,
        pending,
        approved,
        rejected,
        under_review
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const filterApplications = () => {
    let filtered = applications;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(app =>
        app.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.department.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredApplications(filtered);
  };

  const handleApprove = async (applicationId: string) => {
    try {
      setIsProcessing(true);
      const success = await adminAPI.approveWorkerApplication(applicationId, adminId, adminNotes);
      
      if (success) {
        alert('Worker application approved successfully');
        onApplicationProcessed?.(applicationId, 'approved');
        loadApplications();
        loadStats();
        closeModal();
      } else {
        alert('Failed to approve application');
      }
    } catch (error) {
      console.error('Error approving application:', error);
      alert('Error occurred while approving application');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (applicationId: string) => {
    if (!rejectionReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }

    try {
      setIsProcessing(true);
      const success = await adminAPI.rejectWorkerApplication(
        applicationId,
        adminId,
        rejectionReason,
        adminNotes
      );
      
      if (success) {
        alert('Worker application rejected');
        onApplicationProcessed?.(applicationId, 'rejected');
        loadApplications();
        loadStats();
        closeModal();
      } else {
        alert('Failed to reject application');
      }
    } catch (error) {
      console.error('Error rejecting application:', error);
      alert('Error occurred while rejecting application');
    } finally {
      setIsProcessing(false);
    }
  };

  const openModal = (application: WorkerApplication, type: 'view' | 'approve' | 'reject') => {
    setSelectedApplication(application);
    setModalType(type);
    setShowModal(true);
    setRejectionReason('');
    setAdminNotes('');
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedApplication(null);
    setRejectionReason('');
    setAdminNotes('');
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex items-center px-2 py-1 text-xs font-medium rounded-full";
    switch (status) {
      case 'pending':
        return (
          <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </span>
        );
      case 'approved':
        return (
          <span className={`${baseClasses} bg-green-100 text-green-800`}>
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </span>
        );
      case 'rejected':
        return (
          <span className={`${baseClasses} bg-red-100 text-red-800`}>
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </span>
        );
      case 'under_review':
        return (
          <span className={`${baseClasses} bg-blue-100 text-blue-800`}>
            <Eye className="w-3 h-3 mr-1" />
            Under Review
          </span>
        );
      default:
        return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>{status}</span>;
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Worker Applications Management</h1>
        <p className="text-gray-600">Review and manage worker applications for CiviSamadhan platform</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <FileText className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-sm text-gray-600">Total Applications</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              <p className="text-sm text-gray-600">Pending</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{stats.approved}</p>
              <p className="text-sm text-gray-600">Approved</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <XCircle className="w-8 h-8 text-red-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{stats.rejected}</p>
              <p className="text-sm text-gray-600">Rejected</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <Eye className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{stats.under_review}</p>
              <p className="text-sm text-gray-600">Under Review</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg shadow border">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, email, or username..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="under_review">Under Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Applications List */}
      <div className="bg-white rounded-lg shadow border">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-900">Worker Applications</h2>
            {filteredApplications.length > 0 && (
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded">
                {filteredApplications.length}
              </span>
            )}
          </div>
        </div>
        
        <div className="p-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Users className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <p className="text-lg">No applications found</p>
              <p className="text-sm">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredApplications.map((application) => (
                <div key={application.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl font-semibold text-gray-900">{application.full_name}</h3>
                        {getStatusBadge(application.status)}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          <span>{application.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>@{application.username}</span>
                        </div>
                        {application.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            <span>{application.phone}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Building className="w-4 h-4" />
                          <span>{application.department}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Award className="w-4 h-4" />
                          <span>{application.speciality}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(application.application_date).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {application.rejection_reason && (
                        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded text-sm">
                          <div className="flex items-center gap-1 text-red-600 font-medium mb-1">
                            <AlertTriangle className="w-4 h-4" />
                            Rejection Reason:
                          </div>
                          <p className="text-red-700">{application.rejection_reason}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2 ml-6">
                      <button
                        onClick={() => openModal(application, 'view')}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>
                      
                      {application.status === 'pending' && (
                        <>
                          <button
                            onClick={() => openModal(application, 'approve')}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-green-600 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Approve
                          </button>
                          <button
                            onClick={() => openModal(application, 'reject')}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                          >
                            <XCircle className="w-4 h-4" />
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  {modalType === 'view' && 'Application Details'}
                  {modalType === 'approve' && 'Approve Application'}
                  {modalType === 'reject' && 'Reject Application'}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {modalType === 'view' && (
                <div className="space-y-6">
                  {/* Personal Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedApplication.full_name}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Username</label>
                        <p className="mt-1 text-sm text-gray-900">@{selectedApplication.username}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedApplication.email}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedApplication.phone || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Work Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Work Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Department</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedApplication.department}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Speciality</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedApplication.speciality}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Experience</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedApplication.experience_years || 0} years</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Application Date</label>
                        <p className="mt-1 text-sm text-gray-900">
                          {new Date(selectedApplication.application_date).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Current Status */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Status</h3>
                    <div className="mb-4">
                      {getStatusBadge(selectedApplication.status)}
                    </div>
                    
                    {selectedApplication.status === 'pending' && (
                      <div className="flex gap-3">
                        <button
                          onClick={() => setModalType('approve')}
                          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Approve Application
                        </button>
                        <button
                          onClick={() => setModalType('reject')}
                          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          <XCircle className="w-4 h-4" />
                          Reject Application
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {modalType === 'approve' && (
                <div className="space-y-6">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 text-green-800">
                      <CheckCircle className="w-5 h-5" />
                      <h3 className="font-semibold">Approve Worker Application</h3>
                    </div>
                    <p className="text-green-700 mt-2">
                      Are you sure you want to approve {selectedApplication.full_name}'s application?
                      This will grant them access to the worker dashboard.
                    </p>
                  </div>

                  <div>
                    <label htmlFor="adminNotes" className="block text-sm font-medium text-gray-700 mb-2">
                      Admin Notes (Optional)
                    </label>
                    <textarea
                      id="adminNotes"
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      placeholder="Add any notes about this approval..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div className="flex gap-3 justify-end">
                    <button
                      onClick={closeModal}
                      className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleApprove(selectedApplication.id)}
                      disabled={isProcessing}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      {isProcessing ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Approving...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          Approve Application
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {modalType === 'reject' && (
                <div className="space-y-6">
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2 text-red-800">
                      <XCircle className="w-5 h-5" />
                      <h3 className="font-semibold">Reject Worker Application</h3>
                    </div>
                    <p className="text-red-700 mt-2">
                      Please provide a reason for rejecting {selectedApplication.full_name}'s application.
                    </p>
                  </div>

                  <div>
                    <label htmlFor="rejectionReason" className="block text-sm font-medium text-gray-700 mb-2">
                      Rejection Reason *
                    </label>
                    <textarea
                      id="rejectionReason"
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Explain why this application is being rejected..."
                      rows={3}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="adminNotesReject" className="block text-sm font-medium text-gray-700 mb-2">
                      Admin Notes (Optional)
                    </label>
                    <textarea
                      id="adminNotesReject"
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      placeholder="Add any additional notes..."
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>

                  <div className="flex gap-3 justify-end">
                    <button
                      onClick={closeModal}
                      className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleReject(selectedApplication.id)}
                      disabled={isProcessing || !rejectionReason.trim()}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                      {isProcessing ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Rejecting...
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4" />
                          Reject Application
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}