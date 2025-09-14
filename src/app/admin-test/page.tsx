'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function AdminTestPage() {
  const [profiles, setProfiles] = useState<any[]>([])
  const [authUsers, setAuthUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        // Check profiles table
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .eq('role', 'admin')

        console.log('Admin profiles:', profilesData, profilesError)
        setProfiles(profilesData || [])

        // Try to get current session
        const { data: { session } } = await supabase.auth.getSession()
        console.log('Current session:', session)

      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <div className="p-8">Loading admin data...</div>
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Admin Database Test</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Admin Profiles in Database:</h2>
        {profiles.length > 0 ? (
          <div className="space-y-4">
            {profiles.map((profile) => (
              <div key={profile.id} className="p-4 border rounded-lg">
                <p><strong>ID:</strong> {profile.id}</p>
                <p><strong>Name:</strong> {profile.full_name}</p>
                <p><strong>Email:</strong> {profile.email}</p>
                <p><strong>Username:</strong> {profile.username}</p>
                <p><strong>Role:</strong> {profile.role}</p>
                <p><strong>Status:</strong> {profile.approval_status}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-red-600">No admin profiles found in database!</p>
        )}
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Instructions:</h2>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <p className="mb-2">If no admin profiles are shown above, you need to:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Go to your Supabase Dashboard</li>
            <li>Navigate to Authentication → Users</li>
            <li>Add a new user with email: admin@cvsamadhan.com</li>
            <li>Set password: admin123</li>
            <li>Run the ADMIN_SETUP.sql script in SQL Editor</li>
          </ol>
        </div>
      </div>
    </div>
  )
}