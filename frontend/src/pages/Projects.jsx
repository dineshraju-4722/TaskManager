import { useEffect, useState } from 'react'
import api from '../api/axios'
import { Link } from 'react-router-dom'
import AdminNavBar from '../components/AdminNavBar'
import UserNavBar from '../components/UserNavBar'

export default function Projects(){
  const [projects, setProjects] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('ACTIVE')

  const roles = JSON.parse(localStorage.getItem('roles') || '[]')
  const isAdmin = roles.some(role => role === 'ROLE_ADMIN')
  const NavBar = isAdmin ? AdminNavBar : UserNavBar

  useEffect(()=>{
    loadProjects(activeTab)
  },[activeTab])

  async function loadProjects(status){
    try{
      setLoading(true)
      const r = await api.get(`/projects?status=${status}`)
      setProjects(r.data)
    }catch(e){
      console.error('Error loading projects:', e)
      setProjects([])
    }finally{
      setLoading(false)
    }
  }

  async function handleCreate(e){
    e.preventDefault()
    setError(null)
    try{
      await api.post('/projects', { name, description })
      setShowForm(false)
      setName('')
      setDescription('')
      loadProjects(activeTab)
    }catch(err){
      setError(err?.response?.data?.message || 'Failed to create project')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <NavBar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">📁 Projects</h1>
          <p className="text-gray-600 mt-2">Manage and organize all your team projects</p>
        </div>
        <button 
          onClick={()=>setShowForm(!showForm)}
          className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg hover:shadow-lg transition shadow"
        >
          ✨ New Project
        </button>
      </div>

      {/* Tabs */}
      <div className="mb-8 flex gap-4 border-b-2 border-gray-200">
        <button 
          onClick={() => setActiveTab('ACTIVE')}
          className={`px-6 py-3 font-semibold text-lg transition border-b-4 ${activeTab === 'ACTIVE' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
        >
          🚀 Active Projects
        </button>
        <button 
          onClick={() => setActiveTab('COMPLETED')}
          className={`px-6 py-3 font-semibold text-lg transition border-b-4 ${activeTab === 'COMPLETED' ? 'border-green-600 text-green-600' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
        >
          ✅ Completed Projects
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border-l-4 border-green-500">
          <h3 className="text-2xl font-bold mb-4 text-gray-900">Create New Project</h3>
          {error && <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded text-red-700">❌ {error}</div>}
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Project Name</label>
              <input 
                placeholder="e.g., Mobile App Redesign"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition" 
                value={name} 
                onChange={e=>setName(e.target.value)} 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
              <textarea 
                placeholder="Brief description of the project..."
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition" 
                rows="3" 
                value={description} 
                onChange={e=>setDescription(e.target.value)}
              ></textarea>
            </div>
            <div className="flex gap-3">
              <button 
                type="submit" 
                className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg hover:shadow-lg transition"
              >
                ✅ Create Project
              </button>
              <button 
                type="button" 
                onClick={()=>{setShowForm(false); setName(''); setDescription(''); setError(null)}} 
                className="flex-1 px-4 py-3 bg-gray-400 text-white font-bold rounded-lg hover:bg-gray-500 transition"
              >
                ✕ Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Projects Grid */}
      {loading ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">⏳</div>
          <p className="text-gray-600 text-lg">Loading your projects...</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">📭</div>
          <p className="text-gray-600 text-lg mb-6">No projects yet. Create your first one!</p>
          <button 
            onClick={()=>setShowForm(true)}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-lg hover:shadow-lg transition"
          >
            🚀 Get Started
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(p=> (
            <Link to={`/projects/${p.id}`} key={p.id} className="group">
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1 h-full p-6 border-t-4 border-blue-500">
                <div className="flex items-start justify-between mb-3">
                  <div className="text-4xl">📋</div>
                  <div className="text-2xl opacity-20">→</div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition mb-2">{p.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{p.description || '(no description)'}</p>
                <div className="flex gap-2 pt-4 border-t border-gray-200">
                  <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold">📁 Project</span>
                  <span className={`text-xs px-3 py-1 rounded-full font-semibold ${p.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                    {p.status === 'ACTIVE' ? '✨ Active' : '✅ Completed'}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
      </div>
    </div>
  )
}
