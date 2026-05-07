import { useState, useEffect } from 'react'
import api from '../api/axios'
import { useNavigate } from 'react-router-dom'
import UserNavBar from '../components/UserNavBar'

export default function UserDashboard(){
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const username = localStorage.getItem('username')
  const email = localStorage.getItem('email')

  useEffect(() => {
    fetchDashboardData()
  }, [])

  async function fetchDashboardData(){
    try {
      setLoading(true)
      const res = await api.get('/dashboard/user')
      setStats(res.data)
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load dashboard')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-white text-xl">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <UserNavBar />

      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded text-red-700">
            <span className="font-medium">❌ {error}</span>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Projects Involved */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Projects Involved</p>
                <p className="text-4xl font-bold text-blue-600 mt-2">
                  {stats?.totalProjectsInvolved || 0}
                </p>
              </div>
              <span className="text-3xl">📊</span>
            </div>
            <p className="text-gray-500 text-xs mt-4">Projects you're a member of</p>
          </div>

          {/* Active Projects */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm font-medium">Active Projects</p>
                <p className="text-4xl font-bold text-green-600 mt-2">
                  {stats?.activeProjects || 0}
                </p>
              </div>
              <span className="text-3xl">✅</span>
            </div>
            <p className="text-gray-500 text-xs mt-4">Currently ongoing projects</p>
          </div>

          {/* Total Tasks */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Tasks</p>
                <p className="text-4xl font-bold text-purple-600 mt-2">
                  {stats?.totalTasks || 0}
                </p>
              </div>
              <span className="text-3xl">📋</span>
            </div>
            <p className="text-gray-500 text-xs mt-4">All tasks assigned to you</p>
          </div>

          {/* Remaining Tasks */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm font-medium">Remaining Tasks</p>
                <p className="text-4xl font-bold text-orange-600 mt-2">
                  {stats?.remainingTasks || 0}
                </p>
              </div>
              <span className="text-3xl">⏳</span>
            </div>
            <p className="text-gray-500 text-xs mt-4">Tasks not yet completed</p>
          </div>
        </div>

        {/* Quick Stats Summary */}
        <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">📈 Quick Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <span className="text-2xl">📚</span>
              </div>
              <p className="text-gray-600 text-sm">You're involved in</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {stats?.totalProjectsInvolved || 0}
              </p>
              <p className="text-gray-500 text-xs mt-2">project{stats?.totalProjectsInvolved !== 1 ? 's' : ''}</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                <span className="text-2xl">✏️</span>
              </div>
              <p className="text-gray-600 text-sm">You have</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">
                {stats?.remainingTasks || 0}
              </p>
              <p className="text-gray-500 text-xs mt-2">pending task{stats?.remainingTasks !== 1 ? 's' : ''}</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <span className="text-2xl">✨</span>
              </div>
              <p className="text-gray-600 text-sm">Completion Rate</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {stats?.totalTasks > 0 
                  ? Math.round(((stats?.totalTasks - stats?.remainingTasks) / stats?.totalTasks) * 100) 
                  : 0}%
              </p>
              <p className="text-gray-500 text-xs mt-2">tasks completed</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
