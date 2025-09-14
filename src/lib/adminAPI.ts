// CiviSamadhan Admin Portal API - Complete Mobile App Integration
// Real-time synchronization with mobile backend

import { createClient } from '@supabase/supabase-js';

// Use environment variables for Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Exact database interfaces matching mobile app
export interface Profile {
  id: string;
  created_at: string;
  updated_at: string;
  full_name: string;
  username?: string;
  email?: string;
  phone?: string;
  phone_number?: string;
  role: 'citizen' | 'worker' | 'admin';
  department?: string;
  speciality?: string;
  approval_status?: 'pending' | 'approved' | 'rejected';
  current_latitude?: number;
  current_longitude?: number;
  avatar_url?: string;
  status?: string;
  approved_at?: string;
  approved_by?: string;
  application_id?: string;
}

export interface Task {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'verified';
  latitude: number;
  longitude: number;
  address: string;
  citizen_id?: string;
  citizen_name: string;
  citizen_phone?: string;
  assigned_worker_id?: string;
  assigned_at?: string;
  started_at?: string;
  completed_at?: string;
  verified_at?: string;
  completion_photo?: string;
  completion_notes?: string;
  photos?: string[];
  estimated_hours?: number;
  actual_hours?: number;
  urgency_score?: number;
  estimated_duration?: number;
  actual_duration?: number;
}

export interface WorkerApplication {
  id: string;
  full_name: string;
  email: string;
  username: string;
  phone: string;
  department: string;
  speciality: string;
  experience_years?: number;
  education?: string;
  previous_work?: string;
  id_card_url?: string;
  id_card_type?: string;
  id_card_number?: string;
  status: 'pending' | 'approved' | 'rejected' | 'under_review';
  application_date: string;
  reviewed_at?: string;
  reviewed_by?: string;
  rejection_reason?: string;
  admin_notes?: string;
  address?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  skills?: string[];
  certifications?: string[];
  auth_user_id: string;
  created_at: string;
  updated_at: string;
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'verified';
  latitude: number;
  longitude: number;
  address: string;
  citizen_id?: string;
  citizen_name: string;
  citizen_phone?: string;
  assigned_worker_id?: string;
  photos?: string[];
  created_at: string;
  updated_at: string;
}

export interface CommunityMessage {
  id: string;
  content: string;
  sender_id: string;
  sender_name?: string;
  type: 'message' | 'help_request' | 'progress_report';
  is_urgent?: boolean;
  created_at: string;
}

export interface AdminAction {
  id: string;
  admin_id: string;
  action_type: string;
  target_id: string;
  details: any;
  created_at: string;
}

// ===== TASKS & ISSUES API =====

/**
 * Get all tasks/issues with real-time data from mobile app database
 */
export async function getTasks(filters?: {
  status?: string;
  category?: string;
  priority?: string;
  assigned_worker_id?: string;
}): Promise<Task[]> {
  try {
    let query = supabase
      .from('tasks')
      .select(`
        *,
        worker:assigned_worker_id(full_name, department, phone),
        citizen:citizen_id(full_name, phone)
      `)
      .order('created_at', { ascending: false });

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.category) {
      query = query.eq('category', filters.category);
    }
    if (filters?.priority) {
      query = query.eq('priority', filters.priority);
    }
    if (filters?.assigned_worker_id) {
      query = query.eq('assigned_worker_id', filters.assigned_worker_id);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching tasks:', error);
      // Fallback to issues table if tasks doesn't exist
      const { data: issuesData, error: issuesError } = await supabase
        .from('issues')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (issuesError) {
        throw issuesError;
      }
      return issuesData || [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getTasks:', error);
    return [];
  }
}

/**
 * Get tasks for real-time heatmap visualization
 */
export async function getTasksForHeatmap(): Promise<Array<{
  lat: number;
  lng: number;
  weight: number;
  status: string;
  priority: string;
  title: string;
  id: string;
}>> {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('id, title, latitude, longitude, status, priority, urgency_score')
      .not('latitude', 'is', null)
      .not('longitude', 'is', null);

    if (error) {
      // Fallback to issues table
      const { data: issuesData, error: issuesError } = await supabase
        .from('issues')
        .select('id, title, latitude, longitude, status, priority')
        .not('latitude', 'is', null)
        .not('longitude', 'is', null);
      
      if (issuesError) throw issuesError;
      
      return (issuesData || []).map(item => ({
        lat: item.latitude,
        lng: item.longitude,
        weight: item.priority === 'urgent' ? 4 : item.priority === 'high' ? 3 : item.priority === 'medium' ? 2 : 1,
        status: item.status,
        priority: item.priority,
        title: item.title,
        id: item.id
      }));
    }

    return (data || []).map(task => ({
      lat: task.latitude,
      lng: task.longitude,
      weight: task.urgency_score || (task.priority === 'urgent' ? 4 : task.priority === 'high' ? 3 : task.priority === 'medium' ? 2 : 1),
      status: task.status,
      priority: task.priority,
      title: task.title,
      id: task.id
    }));
  } catch (error) {
    console.error('Error fetching heatmap data:', error);
    return [];
  }
}

/**
 * Assign task to worker (syncs with mobile app)
 */
export async function assignTaskToWorker(
  taskId: string,
  workerId: string,
  adminId: string
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('tasks')
      .update({
        assigned_worker_id: workerId,
        assigned_at: new Date().toISOString(),
        status: 'assigned',
        updated_at: new Date().toISOString()
      })
      .eq('id', taskId);

    if (error) {
      console.error('Error assigning task:', error);
      return false;
    }

    // Log admin action
    await supabase
      .from('admin_actions')
      .insert({
        admin_id: adminId,
        action_type: 'assign_task',
        target_id: taskId,
        details: { worker_id: workerId, task_id: taskId }
      });

    return true;
  } catch (error) {
    console.error('Error in task assignment:', error);
    return false;
  }
}

/**
 * Update task status (syncs with mobile app)
 */
export async function updateTaskStatus(
  taskId: string,
  status: string,
  adminId: string,
  notes?: string
): Promise<boolean> {
  try {
    const updateData: any = {
      status: status,
      updated_at: new Date().toISOString()
    };

    if (status === 'in_progress') {
      updateData.started_at = new Date().toISOString();
    } else if (status === 'completed') {
      updateData.completed_at = new Date().toISOString();
    } else if (status === 'verified') {
      updateData.verified_at = new Date().toISOString();
    }

    if (notes) {
      updateData.completion_notes = notes;
    }

    const { error } = await supabase
      .from('tasks')
      .update(updateData)
      .eq('id', taskId);

    if (error) {
      console.error('Error updating task status:', error);
      return false;
    }

    // Log admin action
    await supabase
      .from('admin_actions')
      .insert({
        admin_id: adminId,
        action_type: 'update_task_status',
        target_id: taskId,
        details: { old_status: status, new_status: status, notes }
      });

    return true;
  } catch (error) {
    console.error('Error updating task status:', error);
    return false;
  }
}

// ===== WORKERS API (Real-time sync with mobile app) =====

/**
 * Get all approved workers from mobile app database
 */
export async function getApprovedWorkers(): Promise<Profile[]> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'worker')
      .eq('approval_status', 'approved')
      .order('full_name');

    if (error) {
      console.error('Error fetching workers:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getApprovedWorkers:', error);
    return [];
  }
}

/**
 * Get workers with real-time location tracking
 */
export async function getWorkersWithLocation(): Promise<Profile[]> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'worker')
      .eq('approval_status', 'approved')
      .not('current_latitude', 'is', null)
      .not('current_longitude', 'is', null)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching workers with location:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getWorkersWithLocation:', error);
    return [];
  }
}

/**
 * Get real-time worker statistics
 */
export async function getWorkerStats(): Promise<{
  total: number;
  active: number;
  offline: number;
  busy: number;
  pending_approval: number;
}> {
  try {
    const { data: allWorkers } = await supabase
      .from('profiles')
      .select('role, approval_status, current_latitude, current_longitude, updated_at')
      .eq('role', 'worker');

    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

    const stats = {
      total: 0,
      active: 0,
      offline: 0,
      busy: 0,
      pending_approval: 0
    };

    (allWorkers || []).forEach(worker => {
      stats.total++;
      
      if (worker.approval_status === 'pending') {
        stats.pending_approval++;
      } else if (worker.approval_status === 'approved') {
        const lastUpdate = new Date(worker.updated_at);
        if (lastUpdate > fiveMinutesAgo) {
          stats.active++;
        } else {
          stats.offline++;
        }
      }
    });

    return stats;
  } catch (error) {
    console.error('Error getting worker stats:', error);
    return { total: 0, active: 0, offline: 0, busy: 0, pending_approval: 0 };
  }
}

// ===== WORKER APPLICATIONS API (Mobile app integration) =====

/**
 * Get pending worker applications from mobile app
 */
export async function getPendingWorkerApplications(): Promise<WorkerApplication[]> {
  try {
    const { data, error } = await supabase
      .from('worker_applications')
      .select('*')
      .eq('status', 'pending')
      .order('application_date', { ascending: false });

    if (error) {
      console.error('Error fetching pending applications:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getPendingWorkerApplications:', error);
    return [];
  }
}

/**
 * Approve worker application (syncs with mobile app)
 */
export async function approveWorkerApplication(
  applicationId: string,
  adminId: string,
  adminNotes?: string
): Promise<boolean> {
  try {
    // Use the stored function for approval if available
    const { data, error } = await supabase.rpc('approve_worker_application', {
      application_id: applicationId,
      admin_user_id: adminId
    });

    if (error) {
      console.error('Stored function not available, using manual approval:', error);
      
      // Manual approval process
      const { data: app } = await supabase
        .from('worker_applications')
        .select('*')
        .eq('id', applicationId)
        .single();

      if (!app) return false;

      // Update application status
      await supabase
        .from('worker_applications')
        .update({
          status: 'approved',
          reviewed_at: new Date().toISOString(),
          reviewed_by: adminId,
          admin_notes: adminNotes
        })
        .eq('id', applicationId);

      // Create/Update profile
      await supabase
        .from('profiles')
        .upsert({
          id: app.auth_user_id,
          full_name: app.full_name,
          username: app.username,
          email: app.email,
          role: 'worker',
          department: app.department,
          speciality: app.speciality,
          approval_status: 'approved',
          approved_at: new Date().toISOString(),
          approved_by: adminId,
          application_id: applicationId,
          updated_at: new Date().toISOString()
        });
    }

    // Log admin action
    await supabase
      .from('admin_actions')
      .insert({
        admin_id: adminId,
        action_type: 'approve_worker',
        target_id: applicationId,
        details: { application_id: applicationId, notes: adminNotes }
      });

    return true;
  } catch (error) {
    console.error('Error approving worker application:', error);
    return false;
  }
}

/**
 * Reject worker application
 */
export async function rejectWorkerApplication(
  applicationId: string,
  adminId: string,
  reason: string,
  adminNotes?: string
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('worker_applications')
      .update({
        status: 'rejected',
        reviewed_at: new Date().toISOString(),
        reviewed_by: adminId,
        rejection_reason: reason,
        admin_notes: adminNotes
      })
      .eq('id', applicationId);

    if (error) {
      console.error('Error rejecting application:', error);
      return false;
    }

    // Log admin action
    await supabase
      .from('admin_actions')
      .insert({
        admin_id: adminId,
        action_type: 'reject_worker',
        target_id: applicationId,
        details: { application_id: applicationId, reason, notes: adminNotes }
      });

    return true;
  } catch (error) {
    console.error('Error rejecting worker application:', error);
    return false;
  }
}

// ===== ANALYTICS API (Real-time data from mobile app) =====

/**
 * Get comprehensive dashboard analytics
 */
export async function getDashboardAnalytics(): Promise<{
  tasks: {
    total: number;
    pending: number;
    assigned: number;
    in_progress: number;
    completed: number;
    verified: number;
  };
  workers: {
    total: number;
    active: number;
    offline: number;
    pending_approval: number;
  };
  issues_by_category: { [key: string]: number };
  issues_by_priority: { [key: string]: number };
  completion_rate: number;
  avg_resolution_time: number;
  recent_activities: Array<{
    id: string;
    title: string;
    type: string;
    timestamp: string;
    status: string;
  }>;
}> {
  try {
    // Get task statistics
    const { data: tasks } = await supabase
      .from('tasks')
      .select('status, category, priority, created_at, completed_at, title, id');

    const taskStats = {
      total: 0,
      pending: 0,
      assigned: 0,
      in_progress: 0,
      completed: 0,
      verified: 0
    };

    const categoryCounts: { [key: string]: number } = {};
    const priorityCounts: { [key: string]: number } = {};
    let totalResolutionTime = 0;
    let resolvedTasks = 0;
    const recentActivities: Array<{
      id: string;
      title: string;
      type: string;
      timestamp: string;
      status: string;
    }> = [];

    (tasks || []).forEach(task => {
      taskStats.total++;
      taskStats[task.status as keyof typeof taskStats]++;
      
      categoryCounts[task.category] = (categoryCounts[task.category] || 0) + 1;
      priorityCounts[task.priority] = (priorityCounts[task.priority] || 0) + 1;
      
      if (task.completed_at && task.created_at) {
        const resolutionTime = new Date(task.completed_at).getTime() - new Date(task.created_at).getTime();
        totalResolutionTime += resolutionTime;
        resolvedTasks++;
      }

      // Add to recent activities
      recentActivities.push({
        id: task.id,
        title: task.title,
        type: 'task',
        timestamp: task.created_at,
        status: task.status
      });
    });

    // Sort recent activities by timestamp
    recentActivities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // Get worker statistics
    const workerStats = await getWorkerStats();

    return {
      tasks: taskStats,
      workers: workerStats,
      issues_by_category: categoryCounts,
      issues_by_priority: priorityCounts,
      completion_rate: taskStats.total > 0 ? ((taskStats.completed + taskStats.verified) / taskStats.total) * 100 : 0,
      avg_resolution_time: resolvedTasks > 0 ? totalResolutionTime / resolvedTasks / (1000 * 60 * 60) : 0, // in hours
      recent_activities: recentActivities.slice(0, 10)
    };
  } catch (error) {
    console.error('Error getting dashboard analytics:', error);
    return {
      tasks: { total: 0, pending: 0, assigned: 0, in_progress: 0, completed: 0, verified: 0 },
      workers: { total: 0, active: 0, offline: 0, pending_approval: 0 },
      issues_by_category: {},
      issues_by_priority: {},
      completion_rate: 0,
      avg_resolution_time: 0,
      recent_activities: []
    };
  }
}

// ===== REAL-TIME SUBSCRIPTIONS (Mobile app sync) =====

/**
 * Subscribe to real-time task updates from mobile app
 */
export function subscribeToTasks(callback: (payload: any) => void) {
  return supabase
    .channel('tasks_changes')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'tasks' },
      callback
    )
    .subscribe();
}

/**
 * Subscribe to real-time worker location updates
 */
export function subscribeToWorkerLocations(callback: (payload: any) => void) {
  return supabase
    .channel('worker_locations')
    .on('postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'profiles' },
      (payload) => {
        if (payload.new.current_latitude && payload.new.current_longitude) {
          callback(payload);
        }
      }
    )
    .subscribe();
}

/**
 * Subscribe to real-time worker applications
 */
export function subscribeToWorkerApplications(callback: (payload: any) => void) {
  return supabase
    .channel('worker_applications')
    .on('postgres_changes',
      { event: '*', schema: 'public', table: 'worker_applications' },
      callback
    )
    .subscribe();
}

// ===== COMMUNITY & COMMUNICATION (Mobile app integration) =====

/**
 * Get community messages from worker app
 */
export async function getCommunityMessages(limit: number = 50): Promise<CommunityMessage[]> {
  try {
    const { data, error } = await supabase
      .from('community_messages')
      .select(`
        *,
        profiles:sender_id(full_name, department)
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching community messages:', error);
      return [];
    }

    return (data || []).map(msg => ({
      ...msg,
      sender_name: msg.profiles?.full_name || 'Unknown'
    }));
  } catch (error) {
    console.error('Error in getCommunityMessages:', error);
    return [];
  }
}

/**
 * Create Indian dummy data matching mobile app
 */
export async function createIndianDummyData() {
  try {
    // Generate proper UUIDs for workers
    const generateUUID = () => {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    };

    // Create dummy workers with proper UUIDs and English names
    const dummyWorkers = [
      {
        id: generateUUID(),
        full_name: 'Ram Kumar Sharma',
        email: 'ram.kumar@kmc.gov.in',
        username: 'ram_kumar_kmc',
        phone: '+91-9830123456',
        department: 'Street Lighting',
        speciality: 'Electrical Maintenance',
        role: 'worker',
        approval_status: 'approved',
        current_latitude: 22.5743 + (Math.random() - 0.5) * 0.02,
        current_longitude: 88.4348 + (Math.random() - 0.5) * 0.02,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: generateUUID(),
        full_name: 'Shyam Babu Verma',
        email: 'shyam.verma@kmc.gov.in',
        username: 'shyam_verma_kmc',
        phone: '+91-9830123457',
        department: 'Water Supply',
        speciality: 'Plumbing & Pipe Repair',
        role: 'worker',
        approval_status: 'approved',
        current_latitude: 22.5743 + (Math.random() - 0.5) * 0.02,
        current_longitude: 88.4348 + (Math.random() - 0.5) * 0.02,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: generateUUID(),
        full_name: 'Geeta Devi',
        email: 'geeta.devi@kmc.gov.in',
        username: 'geeta_devi_kmc',
        phone: '+91-9830123458',
        department: 'Sanitation',
        speciality: 'Waste Management',
        role: 'worker',
        approval_status: 'approved',
        current_latitude: 22.5743 + (Math.random() - 0.5) * 0.02,
        current_longitude: 88.4348 + (Math.random() - 0.5) * 0.02,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: generateUUID(),
        full_name: 'Amit Kumar Das',
        email: 'amit.das@kmc.gov.in',
        username: 'amit_das_kmc',
        phone: '+91-9830123459',
        department: 'Road Maintenance',
        speciality: 'Pothole Repair',
        role: 'worker',
        approval_status: 'approved',
        current_latitude: 22.5743 + (Math.random() - 0.5) * 0.02,
        current_longitude: 88.4348 + (Math.random() - 0.5) * 0.02,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: generateUUID(),
        full_name: 'Priya Singh',
        email: 'priya.singh@kmc.gov.in',
        username: 'priya_singh_kmc',
        phone: '+91-9830123460',
        department: 'Drainage',
        speciality: 'Drain Cleaning',
        role: 'worker',
        approval_status: 'approved',
        current_latitude: 22.5743 + (Math.random() - 0.5) * 0.02,
        current_longitude: 88.4348 + (Math.random() - 0.5) * 0.02,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];

    // Insert dummy workers with proper error handling
    const { error: workersError } = await supabase
      .from('profiles')
      .upsert(dummyWorkers, { onConflict: 'id' });

    if (workersError) {
      throw new Error(`Failed to create dummy workers: ${workersError.message}`);
    }

    return true;
  } catch (error) {
    throw new Error(`Error creating Indian dummy data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get all worker applications with status filtering
 */
export async function getAllWorkerApplications(
  page: number = 1,
  limit: number = 20,
  status?: string
): Promise<{ applications: WorkerApplication[]; total: number }> {
  try {
    let query = supabase
      .from('worker_applications')
      .select('*', { count: 'exact' })
      .order('application_date', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching applications:', error);
      throw error;
    }

    return {
      applications: data || [],
      total: count || 0
    };
  } catch (error) {
    console.error('Error in getAllWorkerApplications:', error);
    return { applications: [], total: 0 };
  }
}

// Real-time notifications for admin dashboard
export async function getRealtimeNotifications() {
  try {
    const notifications: any[] = [];
    
    // Get recent tasks for notifications
    const { data: recentTasks } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    if (recentTasks) {
      recentTasks.forEach((task, index) => {
        notifications.push({
          id: `task_${task.id}_${index}`,
          title: task.priority === 'urgent' ? 'तत्काल समस्या रिपोर्ट' : 'नई समस्या रिपोर्ट',
          message: task.title,
          type: task.priority === 'urgent' ? 'urgent' : 'task',
          timestamp: new Date(task.created_at),
          read: false
        });
      });
    }

    // Get recent worker applications
    const { data: recentApplications } = await supabase
      .from('worker_applications')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .limit(3);

    if (recentApplications) {
      recentApplications.forEach((app, index) => {
        notifications.push({
          id: `app_${app.id}_${index}`,
          title: 'नया कर्मचारी आवेदन',
          message: `${app.full_name} ने ${app.department} के लिए आवेदन किया है`,
          type: 'worker',
          timestamp: new Date(app.created_at),
          read: false
        });
      });
    }

    return notifications.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  } catch (error) {
    console.error('Error getting real-time notifications:', error);
    return [];
  }
}

// Create new worker function - creates both auth user and profile
export async function createWorker(workerData: {
  full_name: string;
  email: string;
  username: string;
  phone: string;
  department: string;
  speciality: string;
  password: string;
}): Promise<{ success: boolean; error?: string; worker?: Profile }> {
  try {
    console.log('Creating worker with data:', workerData);
    
    // First create a worker application record
    const { data: applicationData, error: applicationError } = await supabase
      .from('worker_applications')
      .insert({
        full_name: workerData.full_name,
        email: workerData.email,
        username: workerData.username,
        phone: workerData.phone,
        department: workerData.department,
        speciality: workerData.speciality,
        status: 'approved',
        application_date: new Date().toISOString(),
        reviewed_at: new Date().toISOString(),
        reviewed_by: (await supabase.auth.getUser()).data.user?.id,
        admin_notes: 'Created directly by admin'
      })
      .select()
      .single();

    if (applicationError) {
      console.error('Application creation error:', applicationError);
      return { success: false, error: applicationError.message };
    }

    console.log('Worker application created:', applicationData);

    // Create an instruction for the worker to sign up via mobile app
    // We cannot create auth users from client side, so we provide instructions
    const instructions = {
      email: workerData.email,
      password: workerData.password,
      full_name: workerData.full_name,
      username: workerData.username,
      phone: workerData.phone,
      department: workerData.department,
      speciality: workerData.speciality,
      status: 'pre_approved',
      instructions: 'This worker has been pre-approved. They can now sign up using the mobile app with these credentials.'
    };

    return { 
      success: true, 
      worker: {
        id: applicationData.id,
        full_name: workerData.full_name,
        username: workerData.username,
        email: workerData.email,
        phone: workerData.phone,
        role: 'worker' as const,
        department: workerData.department,
        speciality: workerData.speciality,
        approval_status: 'approved' as const,
        created_at: applicationData.created_at,
        updated_at: applicationData.updated_at
      }
    };
  } catch (error: any) {
    console.error('Create worker error:', error);
    return { success: false, error: error.message };
  }
}

export default {
  getTasks,
  getTasksForHeatmap,
  assignTaskToWorker,
  updateTaskStatus,
  getApprovedWorkers,
  getWorkersWithLocation,
  getWorkerStats,
  getPendingWorkerApplications,
  getAllWorkerApplications,
  approveWorkerApplication,
  rejectWorkerApplication,
  createWorker,
  getDashboardAnalytics,
  subscribeToTasks,
  subscribeToWorkerLocations,
  subscribeToWorkerApplications,
  getCommunityMessages,
  createIndianDummyData,
  getRealtimeNotifications
};