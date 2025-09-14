'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'
import {
  LayoutDashboard,
  AlertTriangle,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  UserPlus,
  Globe
} from 'lucide-react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const { user, signOut } = useAuth()
  const { language, setLanguage, t } = useLanguage()

  const navigation = [
    { name: 'dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'reports', href: '/dashboard/reports', icon: AlertTriangle },
    { name: 'workers', href: '/dashboard/workers', icon: Users },
    { name: 'Worker Onboarding', href: '/dashboard/worker-onboarding', icon: UserPlus },
    { name: 'analytics', href: '/dashboard/analytics', icon: BarChart3 },
    { name: 'settings', href: '/dashboard/settings', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Fixed Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:w-72 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="flex items-center justify-between h-20 px-6 bg-gradient-to-r from-orange-500 to-green-600">
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-orange-600 font-bold text-xl">CS</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">CiviSamadhan</h1>
                <p className="text-sm text-orange-100">{t('cityManagement')}</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-white hover:bg-opacity-20 text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-orange-500 to-green-600 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-orange-50 hover:text-orange-700'
                  }`}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  <span>{t(item.name)}</span>
                </Link>
              )
            })}
          </nav>

          {/* Language Toggle */}
          <div className="px-4 py-3 border-t border-gray-200">
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors"
            >
              <Globe className="mr-3 h-4 w-4" />
              {t('language')}
            </button>
          </div>

          {/* User section */}
          <div className="border-t border-gray-200 p-4 bg-gray-50">
            <div className="flex items-center mb-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-orange-500 to-green-600 flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {user?.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900 truncate">{user?.email}</p>
                <p className="text-xs text-gray-500 capitalize">
                  {user?.role === 'admin' ? t('admin') : user?.role}
                </p>
              </div>
            </div>
            <button
              onClick={signOut}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors"
            >
              <LogOut className="mr-3 h-4 w-4" />
              {t('logout')}
            </button>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-0">
        {/* Top navigation bar */}
        <header className="sticky top-0 z-30 bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600"
              >
                <Menu className="h-5 w-5" />
              </button>
              
              <div className="hidden md:block">
                <h2 className="text-lg font-semibold text-gray-900">
                  {t('cityManagement')}
                </h2>
                <p className="text-sm text-gray-500">
                  {t('realTimeManagement')}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                {t('lastUpdated')}: {new Date().toLocaleTimeString()}
              </div>
              <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center">
                <div className="h-2 w-2 bg-white rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content with proper spacing */}
        <main className="flex-1 overflow-auto">
          <div className="p-6 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
