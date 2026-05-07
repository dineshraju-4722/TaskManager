import { useState } from 'react'
import api from '../api/axios'
import { useNavigate, Link } from 'react-router-dom'
import NavBar from '../components/NavBar'

export default function Login(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function submit(e){
    e.preventDefault()
    setError(null)
    setLoading(true)
    try{
      const res = await api.post('/auth/signin', { email, password })
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('username', res.data.username)
      localStorage.setItem('email', res.data.email)
      localStorage.setItem('roles', JSON.stringify(res.data.roles))
      
      // Redirect based on role
      const roles = res.data.roles || []
      const isAdmin = roles.some(role => role === 'ROLE_ADMIN')
      
      if (isAdmin) {
        navigate('/dashboard/admin')
      } else {
        navigate('/dashboard/user')
      }
    }catch(err){
      setError(err?.response?.data?.message || 'Login failed')
    }finally{
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-blue-400 to-purple-500">
      <NavBar />
      <div className="flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">🔐</div>
            <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
            <p className="text-gray-600 mt-2">Sign in to your account</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded text-red-700">
              <span className="font-medium">❌ {error}</span>
            </div>
          )}

          <form onSubmit={submit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <input 
                type="email"
                placeholder="your@email.com" 
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition"
                value={email} 
                onChange={e=>setEmail(e.target.value)}
                required
              />
              <p className="text-xs text-gray-500 mt-1">💡 Enter the email address you used to sign up</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition"
                value={password} 
                onChange={e=>setPassword(e.target.value)}
                required
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 rounded-lg hover:shadow-lg transition disabled:opacity-50"
            >
              {loading ? '⏳ Signing in...' : '➜ Sign In'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-center text-gray-600">
              Don't have an account? <Link to="/signup" className="text-blue-600 font-semibold hover:text-blue-700 transition">Create one</Link>
            </p>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}
