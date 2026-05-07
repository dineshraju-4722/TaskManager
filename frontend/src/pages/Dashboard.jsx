import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api/axios'
import NavBar from '../components/NavBar'

export default function Dashboard(){
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(()=>{
    // Check user role and redirect to appropriate dashboard
    const roles = JSON.parse(localStorage.getItem('roles') || '[]')
    const isAdmin = roles.some(role => role === 'ROLE_ADMIN')
    
    if (isAdmin) {
      navigate('/dashboard/admin')
    } else {
      navigate('/dashboard/user')
    }
  },[navigate])

  async function load(){
    try{
      setLoading(true)
      const res = await api.get('/projects')
      const tasks = await api.get('/tasks')
      setStats({ projects: res.data.length, tasks: tasks.data.length })
    }catch(e){
      setStats({ projects: 0, tasks: 0 })
    }finally{
      setLoading(false)
    }
  }

  const username = localStorage.getItem('username') || 'Team Member'

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <NavBar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">📊 Welcome back, {username}!</h1>
        <p className="text-gray-600 mb-8">Here's your project overview at a glance</p>

      {/* Stats Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-2">⏳</div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Projects Card */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-semibold mb-2">Total Projects</p>
                <h2 className="text-4xl font-bold">{stats?.projects ?? 0}</h2>
                <p className="text-blue-100 text-sm mt-2">Active projects</p>
              </div>
              <div className="text-6xl opacity-20">📁</div>
            </div>
          </div>

          {/* Tasks Card */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-semibold mb-2">Total Tasks</p>
                <h2 className="text-4xl font-bold">{stats?.tasks ?? 0}</h2>
                <p className="text-purple-100 text-sm mt-2">To complete</p>
              </div>
              <div className="text-6xl opacity-20">✅</div>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-semibold mb-2">Quick Actions</p>
                <Link to="/projects" className="inline-block mt-2 px-4 py-2 bg-white text-green-600 font-bold rounded-lg hover:bg-green-50 transition">
                  View Projects
                </Link>
              </div>
              <div className="text-6xl">🚀</div>
            </div>
          </div>
        </div>
      )}

      {/* Info Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-4">🎯 Get Started</h3>
          <ul className="space-y-3">
            <li className="flex gap-3">
              <span>1️⃣</span>
              <span className="text-gray-700">Create a new project</span>
            </li>
            <li className="flex gap-3">
              <span>2️⃣</span>
              <span className="text-gray-700">Add team members to your project</span>
            </li>
            <li className="flex gap-3">
              <span>3️⃣</span>
              <span className="text-gray-700">Create and organize tasks</span>
            </li>
            <li className="flex gap-3">
              <span>4️⃣</span>
              <span className="text-gray-700">Track progress and collaborate</span>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-4">💡 Tips & Features</h3>
          <ul className="space-y-3">
            <li className="flex gap-3">
              <span>🔐</span>
              <span className="text-gray-700">Secure JWT authentication</span>
            </li>
            <li className="flex gap-3">
              <span>👥</span>
              <span className="text-gray-700">Manage team collaboration</span>
            </li>
            <li className="flex gap-3">
              <span>📊</span>
              <span className="text-gray-700">Real-time project tracking</span>
            </li>
            <li className="flex gap-3">
              <span>⚡</span>
              <span className="text-gray-700">Lightning-fast performance</span>
            </li>
          </ul>
        </div>
      </div>
      </div>
    </div>
  )
}
