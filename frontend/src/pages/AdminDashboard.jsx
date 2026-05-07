import { useState, useEffect } from 'react'
import api from '../api/axios'
import { useNavigate } from 'react-router-dom'
import AdminNavBar from '../components/AdminNavBar'

export default function AdminDashboard(){
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
      const res = await api.get('/dashboard/admin')
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
      <div className="min-h-screen bg-gradient-to-br from-red-400 to-pink-500 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-white text-xl">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50">
      <AdminNavBar />

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
          {/* Total Projects Created */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition border-l-4 border-blue-600">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Projects Created</p>
                <p className="text-4xl font-bold text-blue-600 mt-2">
                  {stats?.totalProjectsCreated || 0}
                </p>
              </div>
              <span className="text-3xl">📁</span>
            </div>
            <p className="text-gray-500 text-xs mt-4">Projects you've created</p>
          </div>

          {/* Active Projects */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition border-l-4 border-green-600">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm font-medium">Active Projects</p>
                <p className="text-4xl font-bold text-green-600 mt-2">
                  {stats?.activeProjects || 0}
                </p>
              </div>
              <span className="text-3xl">🚀</span>
            </div>
            <p className="text-gray-500 text-xs mt-4">Currently running projects</p>
          </div>

          {/* Total Tasks Assigned */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition border-l-4 border-purple-600">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Tasks Assigned</p>
                <p className="text-4xl font-bold text-purple-600 mt-2">
                  {stats?.totalTasksAssigned || 0}
                </p>
              </div>
              <span className="text-3xl">📋</span>
            </div>
            <p className="text-gray-500 text-xs mt-4">All tasks in your projects</p>
          </div>

          {/* Tasks Completed */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition border-l-4 border-orange-600">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm font-medium">Tasks Completed</p>
                <p className="text-4xl font-bold text-orange-600 mt-2">
                  {stats?.tasksCompleted || 0}
                </p>
              </div>
              <span className="text-3xl">✅</span>
            </div>
            <p className="text-gray-500 text-xs mt-4">Finished tasks</p>
          </div>
        </div>

        {/* Advanced Stats */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Team Performance */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">📊 Team Performance</h2>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700 font-medium">Task Completion Rate</span>
                  <span className="text-2xl font-bold text-green-600">
                    {stats?.totalTasksAssigned > 0 
                      ? Math.round((stats?.tasksCompleted / stats?.totalTasksAssigned) * 100) 
                      : 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${stats?.totalTasksAssigned > 0 
                        ? Math.round((stats?.tasksCompleted / stats?.totalTasksAssigned) * 100) 
                        : 0}%`
                    }}
                  ></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-gray-600 text-sm">Pending Tasks</p>
                  <p className="text-2xl font-bold text-blue-600 mt-2">
                    {(stats?.totalTasksAssigned || 0) - (stats?.tasksCompleted || 0)}
                  </p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-gray-600 text-sm">On Track</p>
                  <p className="text-2xl font-bold text-green-600 mt-2">
                    {stats?.tasksCompleted || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Project Summary */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">📈 Project Summary</h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Projects</p>
                  <p className="text-3xl font-bold text-blue-600 mt-2">
                    {stats?.totalProjectsCreated || 0}
                  </p>
                </div>
                <div className="text-5xl">📁</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-gray-600 text-sm">Active Now</p>
                  <p className="text-2xl font-bold text-green-600 mt-2">
                    {stats?.activeProjects || 0}
                  </p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <p className="text-gray-600 text-sm">Avg Tasks/Project</p>
                  <p className="text-2xl font-bold text-purple-600 mt-2">
                    {stats?.totalProjectsCreated > 0 
                      ? Math.round(stats?.totalTasksAssigned / stats?.totalProjectsCreated) 
                      : 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Management Tips */}
        <div className="mt-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">💡 Management Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm font-semibold mb-2">📌 Keep Projects Organized</p>
              <p className="text-sm opacity-90">Ensure all projects have clear descriptions and goals for better team coordination.</p>
            </div>
            <div>
              <p className="text-sm font-semibold mb-2">👥 Assign Tasks Wisely</p>
              <p className="text-sm opacity-90">Distribute tasks based on team capacity and skills to ensure timely completion.</p>
            </div>
            <div>
              <p className="text-sm font-semibold mb-2">📊 Monitor Progress</p>
              <p className="text-sm opacity-90">Check the completion rate regularly and adjust timelines if needed.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
