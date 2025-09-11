export interface User {
  id: string
  email: string
  role: 'admin' | 'manager'
  created_at: string
  updated_at: string
}

export interface AuthState {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
}

export interface Issue {
  id: string
  title: string
  description: string
  category: 'pothole' | 'streetlight' | 'garbage' | 'water' | 'other'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  location: {
    latitude: number
    longitude: number
    address?: string
  }
  images?: string[]
  citizen_id: string
  assigned_worker_id?: string
  created_at: string
  updated_at: string
}

export interface Worker {
  id: string
  name: string
  email: string
  phone: string
  department: string
  specialties: string[]
  status: 'active' | 'inactive' | 'busy'
  current_assignments: number
  total_resolved: number
  rating: number
  created_at: string
  updated_at: string
}
