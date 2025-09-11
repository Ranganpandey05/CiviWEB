import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
}

if (!supabaseAnonKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable')
}

if (!supabaseUrl.startsWith('http')) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL must be a valid HTTP or HTTPS URL')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper function for server-side operations
export const createServerClient = () => {
  return createClient(supabaseUrl, supabaseAnonKey)
}
