import { Link, useNavigate, useLocation } from 'react-router-dom'

export default function NavBar(){
  const navigate = useNavigate()
  const location = useLocation()
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

  function logout(){
    try{ 
      localStorage.removeItem('token')
      localStorage.removeItem('username')
    }catch(e){}
    navigate('/login')
  }

  const isActive = (path) => location.pathname === path ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'

  return (
    <nav className="bg-white shadow-lg border-b-4 border-blue-600">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-80 transition">
          📋 Team Task Manager
        </Link>
        
        {token && (
          <div className="flex items-center space-x-6">
            <Link to="/dashboard" className={`py-2 transition font-medium ${isActive('/dashboard')}`}>
              📊 Dashboard
            </Link>
            <Link to="/projects" className={`py-2 transition font-medium ${isActive('/projects')}`}>
              📁 Projects
            </Link>
          </div>
        )}

        <div className="flex items-center space-x-4">
          {token ? (
            <button onClick={logout} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium shadow">
              🚪 Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium transition">
                Sign In
              </Link>
              <Link to="/signup" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
