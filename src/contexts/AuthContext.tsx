'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { supabase } from '@/lib/supabase'
import { AuthState, User } from '@/types/auth'

const AuthContext = createContext<AuthState | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        // Fetch admin profile data from database
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .eq('role', 'admin')
          .single()

        if (profile && !error) {
          setUser({
            id: session.user.id,
            email: session.user.email!,
            role: profile.role,
            full_name: profile.full_name,
            username: profile.username,
            created_at: session.user.created_at!,
            updated_at: session.user.updated_at!
          })
        } else {
          // User is not an admin, sign them out
          await supabase.auth.signOut()
          setUser(null)
        }
      }
      setLoading(false)
    })

    // Listen for changes on auth state (sign in, sign out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        // Fetch admin profile data from database
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .eq('role', 'admin')
          .single()

        if (profile && !error) {
          setUser({
            id: session.user.id,
            email: session.user.email!,
            role: profile.role,
            full_name: profile.full_name,
            username: profile.username,
            created_at: session.user.created_at!,
            updated_at: session.user.updated_at!
          })
        } else {
          setUser(null)
        }
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      console.log('🔑 Starting login attempt for:', email)
      
      // Check if this is the admin trying to login with direct access
      if (email === '2004anishshit@gmail.com') {
        console.log('🎯 Admin login detected, using simple direct access...')
        
        // Use our simple admin login check function
        const { data: loginCheck, error: loginError } = await supabase.rpc('check_admin_login', {
          check_email: email,
          check_password: password
        })
        
        console.log('📊 Simple admin login check result:', { loginCheck, loginError })
        
        if (loginError) {
          console.error('❌ Admin login check error:', loginError)
          return { error: 'Login check error: ' + loginError.message }
        }
        
        if (loginCheck === true) {
          console.log('✅ Admin credentials verified!')
          
          // Get admin profile
          const { data: profileData, error: profileError } = await supabase.rpc('get_admin_profile', {
            admin_email: email
          })
          
          console.log('📊 Admin profile result:', { profileData, profileError })
          
          if (profileError) {
            console.error('❌ Error getting admin profile:', profileError)
            return { error: 'Profile error: ' + profileError.message }
          }
          
          if (profileData && profileData.length > 0) {
            const profile = profileData[0]
            console.log('✅ Admin profile found:', profile)
            
            // Set user state manually for admin (bypassing Supabase Auth)
            setUser({
              id: profile.id,
              email: profile.email,
              role: profile.role,
              profile: profile
            } as any)
            
            return { error: null }
          } else {
            console.error('❌ Admin profile not found')
            return { error: 'Admin profile not found' }
          }
        } else {
          console.error('❌ Invalid admin credentials')
          return { error: 'Invalid email or password' }
        }
      }
      
      // For non-admin users, use regular Supabase auth flow
      console.log('👤 Regular user login, using Supabase Auth...')
      console.log('Attempting to sign in with email:', email)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      console.log('Supabase auth result:', { data, error })
      
      if (error) {
        console.error('Auth error:', error)
        return { error: error.message }
      }
      
      // Check if user has admin role
      if (data.user) {
        console.log('User authenticated, checking admin role...')
        // First, ensure admin profile exists and is linked for the specific admin email
        if (data.user.email === '2004anishshit@gmail.com') {
          console.log('🔧 Ensuring admin profile for:', data.user.email)
          // Use the ensure function to create/update admin profile
          const { error: ensureError } = await supabase.rpc('ensure_admin_profile', {
            user_id: data.user.id,
            user_email: data.user.email
          })
          
          if (ensureError) {
            console.log('⚠️ Admin profile ensure function result:', ensureError)
          } else {
            console.log('✅ Admin profile ensure function completed')
          }
        }

        // Try to find admin profile by auth_user_id first, then by email as fallback
        let profile, profileError
        
        console.log('🔍 Looking for admin profile by auth_user_id:', data.user.id)
        // First attempt: by auth_user_id
        const { data: profileById, error: errorById } = await supabase
          .from('profiles')
          .select('*')
          .eq('auth_user_id', data.user.id)
          .eq('role', 'admin')
          .single()

        console.log('📊 Profile by ID result:', { profileById, errorById })

        if (profileById && !errorById) {
          profile = profileById
          profileError = errorById
          console.log('✅ Found admin profile by auth_user_id')
        } else {
          console.log('🔍 Fallback: Looking for admin profile by email:', data.user.email)
          // Fallback: by email for the specific admin user
          const { data: profileByEmail, error: errorByEmail } = await supabase
            .from('profiles')
            .select('*')
            .eq('email', data.user.email)
            .eq('role', 'admin')
            .single()
          
          console.log('📊 Profile by email result:', { profileByEmail, errorByEmail })
          
          profile = profileByEmail
          profileError = errorByEmail
          
          // If found by email, update the auth_user_id
          if (profileByEmail && !errorByEmail) {
            console.log('🔗 Linking auth_user_id to profile...')
            const { error: updateError } = await supabase
              .from('profiles')
              .update({ auth_user_id: data.user.id })
              .eq('email', data.user.email)
              .eq('role', 'admin')
            
            if (updateError) {
              console.log('⚠️ Failed to link auth_user_id:', updateError)
            } else {
              console.log('✅ Successfully linked auth_user_id to profile')
            }
          }
        }

        console.log('📋 Final profile check result:', { profile, profileError })

        if (!profile || profileError) {
          console.error('❌ User is not an admin or profile not found')
          console.error('📊 Profile details:', profile)
          console.error('📊 Profile error:', profileError)
          await supabase.auth.signOut()
          return { error: 'Access denied. Admin privileges required.' }
        }

        console.log('✅ Admin profile found, login successful!')
        console.log('👤 Admin profile:', profile)
      }
      
      return { error: null }
    } catch (error) {
      console.error('Unexpected sign in error:', error)
      return { error: 'An unexpected error occurred' }
    }
  }

  const signOut = async () => {
    // Clear user state for direct admin login
    setUser(null)
    // Also sign out from Supabase (in case regular auth was used)
    await supabase.auth.signOut()
  }

  const value = {
    user,
    loading,
    signIn,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
