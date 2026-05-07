import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

export default function UserNavBar() {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const username = localStorage.getItem('username')
  const email = localStorage.getItem('email')

  function handleLogout(){
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    localStorage.removeItem('email')
    localStorage.removeItem('roles')
    navigate('/login')
  }

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/dashboard/user" className="flex items-center space-x-2 text-white font-bold text-xl hover:text-blue-100 transition">
            <span className="text-2xl">👤</span>
            <span>Dashboard</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            <Link 
              to="/dashboard/user"
              className="text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition"
            >
              📊 Dashboard
            </Link>
            <Link 
              to="/projects"
              className="text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition"
            >
              📁 Projects
            </Link>
            <div className="flex items-center ml-4 space-x-3 border-l border-blue-400 pl-4">
              <div className="text-white text-sm">
                <p className="font-semibold">{username}</p>
                <p className="text-blue-100 text-xs">{email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-800 transition"
              >
                🚪 Logout
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:bg-blue-700 p-2 rounded transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link 
              to="/dashboard/user"
              className="text-white block px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition"
              onClick={() => setIsOpen(false)}
            >
              📊 Dashboard
            </Link>
            <Link 
              to="/projects"
              className="text-white block px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition"
              onClick={() => setIsOpen(false)}
            >
              📁 Projects
            </Link>
            <div className="border-t border-blue-400 pt-2">
              <div className="text-white text-sm px-3 py-2">
                <p className="font-semibold">{username}</p>
                <p className="text-blue-100 text-xs">{email}</p>
              </div>
              <button
                onClick={() => {
                  handleLogout()
                  setIsOpen(false)
                }}
                className="w-full text-left bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-800 transition"
              >
                🚪 Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
