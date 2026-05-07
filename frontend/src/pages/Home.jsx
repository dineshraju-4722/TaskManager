import { Link } from 'react-router-dom'
import NavBar from '../components/NavBar'

export default function Home(){
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 via-blue-500 to-purple-600 text-white">
      <NavBar />
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="mb-8">
          <div className="text-6xl font-bold mb-4">📋 Team Task Manager</div>
          <p className="text-2xl text-blue-100 mb-6">Collaborate, organize, and deliver projects together</p>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Streamline your team's workflow with intuitive project and task management powered by secure authentication.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex gap-4 justify-center mb-16">
          <Link to="/login" className="px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition shadow-lg">
            ➜ Sign In
          </Link>
          <Link to="/signup" className="px-8 py-3 bg-blue-400 text-white font-bold rounded-lg hover:bg-blue-300 transition shadow-lg border-2 border-white">
            ✨ Create Account
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-white bg-opacity-10 backdrop-blur p-6 rounded-xl hover:bg-opacity-20 transition">
            <div className="text-4xl mb-4">🔐</div>
            <h3 className="text-xl font-semibold mb-2">Secure Auth</h3>
            <p className="text-blue-100">JWT-based authentication keeps your data safe</p>
          </div>
          <div className="bg-white bg-opacity-10 backdrop-blur p-6 rounded-xl hover:bg-opacity-20 transition">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-xl font-semibold mb-2">Team Collab</h3>
            <p className="text-blue-100">Work together with your team seamlessly</p>
          </div>
          <div className="bg-white bg-opacity-10 backdrop-blur p-6 rounded-xl hover:bg-opacity-20 transition">
            <div className="text-4xl mb-4">✅</div>
            <h3 className="text-xl font-semibold mb-2">Task Mgmt</h3>
            <p className="text-blue-100">Organize tasks, set priorities, track progress</p>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-white text-gray-900 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">Why Choose Team Task Manager?</h2>
          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <div className="flex gap-4">
              <div className="text-3xl">🚀</div>
              <div>
                <h3 className="text-xl font-bold mb-2">Lightning Fast</h3>
                <p className="text-gray-600">Real-time updates and instant feedback</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-3xl">📱</div>
              <div>
                <h3 className="text-xl font-bold mb-2">Responsive Design</h3>
                <p className="text-gray-600">Works on desktop, tablet, and mobile</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-3xl">🔔</div>
              <div>
                <h3 className="text-xl font-bold mb-2">Smart Notifications</h3>
                <p className="text-gray-600">Stay updated on task assignments</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-3xl">🎯</div>
              <div>
                <h3 className="text-xl font-bold mb-2">Goal Tracking</h3>
                <p className="text-gray-600">Monitor project progress in real-time</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gradient-to-r from-blue-900 to-purple-900 text-white py-8 text-center">
        <p className="text-blue-100">© 2026 Team Task Manager. Built for productivity.</p>
      </div>
    </div>
  )
}
