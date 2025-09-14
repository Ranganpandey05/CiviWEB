'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Layout from '@/components/Layout/Layout'
import Dashboard from '@/components/Dashboard'
import DataInitializer from '@/components/DataInitializer'
import { useState } from 'react'

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [showInitializer, setShowInitializer] = useState(false);

  // Check if we should show data initializer (for first time setup)
  const shouldShowInitializer = process.env.NEXT_PUBLIC_CREATE_DUMMY_DATA === 'true';

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to login
  }

  if (showInitializer || shouldShowInitializer) {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-yellow-800 mb-2">
              First Time Setup Required
            </h2>
            <p className="text-yellow-700 mb-4">
              Please initialize the database with Indian dummy data to see the complete CiviSamadhan admin dashboard.
            </p>
            <button
              onClick={() => setShowInitializer(false)}
              className="text-sm text-yellow-600 hover:text-yellow-800 underline"
            >
              Skip and show empty dashboard
            </button>
          </div>
          <DataInitializer />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Dashboard />
    </Layout>
  )
}
