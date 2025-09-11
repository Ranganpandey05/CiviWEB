'use client'

import ProtectedRoute from '@/components/ProtectedRoute'
import DashboardLayout from '@/components/DashboardLayout'
import { BarChart3, TrendingUp, TrendingDown, Calendar, Download } from 'lucide-react'

export default function AnalyticsPage() {
  // Mock data - in a real app, this would come from your API
  const stats = {
    totalIssues: 247,
    resolvedThisMonth: 45,
    avgResolutionTime: 2.3,
    responseRate: 94.2
  }

  const categoryData = [
    { name: 'Road Maintenance', count: 87, percentage: 35 },
    { name: 'Infrastructure', count: 54, percentage: 22 },
    { name: 'Sanitation', count: 43, percentage: 17 },
    { name: 'Water Services', count: 35, percentage: 14 },
    { name: 'Other', count: 28, percentage: 12 }
  ]

  const monthlyData = [
    { month: 'Jan', issues: 45, resolved: 42 },
    { month: 'Feb', issues: 52, resolved: 48 },
    { month: 'Mar', issues: 38, resolved: 41 },
    { month: 'Apr', issues: 61, resolved: 58 },
    { month: 'May', issues: 55, resolved: 52 },
    { month: 'Jun', issues: 48, resolved: 46 }
  ]

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Page header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
              <p className="mt-1 text-sm text-gray-500">
                Performance insights and reporting trends
              </p>
            </div>
            <div className="flex space-x-3">
              <select className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 3 months</option>
                <option value="365">Last year</option>
              </select>
              <button className="btn-primary flex items-center">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </button>
            </div>
          </div>

          {/* Key metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Issues</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalIssues}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">+12% from last month</span>
                  </div>
                </div>
                <div className="p-3 rounded-full bg-blue-100">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Resolved This Month</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.resolvedThisMonth}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">+8% from last month</span>
                  </div>
                </div>
                <div className="p-3 rounded-full bg-green-100">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Avg Resolution Time</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.avgResolutionTime} days</p>
                  <div className="flex items-center mt-2">
                    <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                    <span className="text-sm text-green-600">-15% faster</span>
                  </div>
                </div>
                <div className="p-3 rounded-full bg-yellow-100">
                  <Calendar className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Response Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.responseRate}%</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">+3% improvement</span>
                  </div>
                </div>
                <div className="p-3 rounded-full bg-purple-100">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Charts row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Issues by Category */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900">Issues by Category</h3>
                <span className="text-sm text-gray-500">Last 30 days</span>
              </div>
              <div className="space-y-4">
                {categoryData.map((category, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">{category.name}</span>
                      <span className="text-sm text-gray-500">{category.count} issues</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${category.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Monthly Trends */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900">Monthly Trends</h3>
                <span className="text-sm text-gray-500">Issues vs Resolved</span>
              </div>
              <div className="space-y-4">
                {monthlyData.map((month, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="w-12 text-sm font-medium text-gray-900">{month.month}</div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <div className="flex-1 bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-blue-500 h-3 rounded-full"
                            style={{ width: `${(month.issues / 70) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500 w-8">{month.issues}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-green-500 h-3 rounded-full"
                            style={{ width: `${(month.resolved / 70) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500 w-8">{month.resolved}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center space-x-4 text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  <span className="text-gray-600">Issues Reported</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-gray-600">Issues Resolved</span>
                </div>
              </div>
            </div>
          </div>

          {/* Performance insights */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Top Performing Workers</h3>
              <div className="space-y-3">
                {[
                  { name: 'Sarah Johnson', resolved: 24, rating: 4.9 },
                  { name: 'Mike Wilson', resolved: 22, rating: 4.8 },
                  { name: 'John Smith', resolved: 19, rating: 4.7 }
                ].map((worker, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{worker.name}</p>
                      <p className="text-xs text-gray-500">{worker.resolved} issues resolved</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">★ {worker.rating}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Response Times</h3>
              <div className="space-y-3">
                {[
                  { category: 'Urgent', time: '2.1 hours', color: 'text-red-600' },
                  { category: 'High', time: '8.3 hours', color: 'text-orange-600' },
                  { category: 'Medium', time: '1.2 days', color: 'text-yellow-600' },
                  { category: 'Low', time: '3.5 days', color: 'text-green-600' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-900">{item.category}</span>
                    <span className={`text-sm font-medium ${item.color}`}>{item.time}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Satisfaction Score</h3>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">4.6</div>
                <p className="text-sm text-gray-500 mb-4">out of 5.0</p>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((stars) => (
                    <div key={stars} className="flex items-center text-sm">
                      <span className="w-6 text-gray-600">{stars}★</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2 mx-2">
                        <div 
                          className="bg-yellow-400 h-2 rounded-full"
                          style={{ width: `${stars === 5 ? 65 : stars === 4 ? 20 : stars === 3 ? 10 : 3}%` }}
                        ></div>
                      </div>
                      <span className="text-gray-500 w-8">{stars === 5 ? '65%' : stars === 4 ? '20%' : stars === 3 ? '10%' : '3%'}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
