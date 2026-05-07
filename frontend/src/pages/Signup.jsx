import { useState } from 'react'
import api from '../api/axios'
import { useNavigate, Link } from 'react-router-dom'
import NavBar from '../components/NavBar'

export default function Signup(){
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('user')
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function submit(e){
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)
    try{
      await api.post('/auth/signup', { 
        username, 
        email, 
        password,
        role: [role]
      })
      setSuccess('✅ Account created! Redirecting to login...')
      setTimeout(() => navigate('/login'), 2000)
    }catch(err){
      setError(err?.response?.data?.message || 'Signup failed')
    }finally{
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 via-blue-400 to-purple-500">
      <NavBar />
      <div className="flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">✨</div>
            <h2 className="text-3xl font-bold text-gray-900">Join Us</h2>
            <p className="text-gray-600 mt-2">Create your account to get started</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded text-red-700">
              <span className="font-medium">❌ {error}</span>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded text-green-700">
              <span className="font-medium">{success}</span>
            </div>
          )}

          <form onSubmit={submit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
              <input 
                placeholder="john_doe" 
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition"
                value={username} 
                onChange={e=>setUsername(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <input 
                type="email"
                placeholder="john@example.com" 
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition"
                value={email} 
                onChange={e=>setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition"
                value={password} 
                onChange={e=>setPassword(e.target.value)}
                required
              />
              <p className="text-xs text-gray-500 mt-1">💡 Use at least 6 characters</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Account Type</label>
              <div className="space-y-2">
                <label className="flex items-center cursor-pointer">
                  <input 
                    type="radio" 
                    name="role" 
                    value="user"
                    checked={role === 'user'}
                    onChange={e => setRole(e.target.value)}
                    className="w-4 h-4 text-green-500"
                  />
                  <span className="ml-3 text-gray-700">👤 User (Team Member)</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input 
                    type="radio" 
                    name="role" 
                    value="admin"
                    checked={role === 'admin'}
                    onChange={e => setRole(e.target.value)}
                    className="w-4 h-4 text-blue-500"
                  />
                  <span className="ml-3 text-gray-700">👨‍💼 Admin (Project Manager)</span>
                </label>
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white font-bold py-3 rounded-lg hover:shadow-lg transition disabled:opacity-50"
            >
              {loading ? '⏳ Creating account...' : '✨ Create Account'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-center text-gray-600">
              Already have an account? <Link to="/login" className="text-blue-600 font-semibold hover:text-blue-700 transition">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}
