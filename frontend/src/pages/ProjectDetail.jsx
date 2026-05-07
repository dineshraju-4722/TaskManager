import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '../api/axios'
import AdminNavBar from '../components/AdminNavBar'
import UserNavBar from '../components/UserNavBar'

export default function ProjectDetail(){
  const { id } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [tasks, setTasks] = useState([])
  const [allUsers, setAllUsers] = useState([])
  const [showEditForm, setShowEditForm] = useState(false)
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [showEditTaskForm, setShowEditTaskForm] = useState(false)
  const [showAddMemberForm, setShowAddMemberForm] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [taskTitle, setTaskTitle] = useState('')
  const [taskDescription, setTaskDescription] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editingTask, setEditingTask] = useState(null)
  const [selectedMemberId, setSelectedMemberId] = useState('')
  const [selectedTaskAssignees, setSelectedTaskAssignees] = useState([])
  const [editTaskData, setEditTaskData] = useState({
    title: '',
    description: '',
    status: 'TODO',
    priority: 'MEDIUM',
    dueDate: ''
  })

  const roles = JSON.parse(localStorage.getItem('roles') || '[]')
  const isAdmin = roles.some(role => role === 'ROLE_ADMIN')
  const NavBar = isAdmin ? AdminNavBar : UserNavBar

  useEffect(()=>{
    loadProject()
    loadTasks()
    loadAllUsers()
  },[id])

  async function loadProject(){
    try{
      setLoading(true)
      const r = await api.get(`/projects/${id}`)
      setProject(r.data)
      setName(r.data.name)
      setDescription(r.data.description)
    }catch(e){
      setProject(null)
    }finally{
      setLoading(false)
    }
  }

  async function loadTasks(){
    try{
      const r = await api.get(`/projects/${id}/tasks`)
      setTasks(r.data)
    }catch(e){
      setTasks([])
    }
  }

  async function loadAllUsers(){
    try{
      const r = await api.get(`/users`)
      setAllUsers(r.data || [])
    }catch(e){
      setAllUsers([])
    }
  }

  async function handleAddMember(e){
    e.preventDefault()
    if(!selectedMemberId) {
      setError('Please select a user')
      return
    }
    setError(null)
    try{
      await api.post(`/projects/${id}/members/${selectedMemberId}`)
      setShowAddMemberForm(false)
      setSelectedMemberId('')
      loadProject()
    }catch(err){
      setError(err?.response?.data?.message || 'Failed to add member')
    }
  }

  async function handleEditTask(e){
    e.preventDefault()
    if(!editingTask) return
    if (!isAdmin) {
      setError('Only admins can edit tasks')
      return
    }
    setError(null)
    try{
      const taskUpdateData = {
        ...editTaskData,
        assignedUserIds: selectedTaskAssignees
      }
      await api.put(`/tasks/${editingTask.id}`, taskUpdateData)
      setShowEditTaskForm(false)
      setEditingTask(null)
      setSelectedTaskAssignees([])
      loadTasks()
    }catch(err){
      setError(err?.response?.data?.message || 'Failed to update task')
    }
  }

  function openEditTaskForm(task){
    if (!isAdmin) {
      setError('Only admins can edit tasks')
      return
    }
    setEditingTask(task)
    setEditTaskData({
      title: task.title || '',
      description: task.description || '',
      status: task.status || 'TODO',
      priority: task.priority || 'MEDIUM',
      dueDate: task.dueDate ? task.dueDate.split('T')[0] : ''
    })
    setSelectedTaskAssignees(task.assignedUsers?.map(u => u.id) || [])
    setShowEditTaskForm(true)
  }

  async function handleUpdate(e){
    e.preventDefault()
    if (!isAdmin) {
      setError('Only admins can edit projects')
      return
    }
    setError(null)
    try{
      await api.put(`/projects/${id}`, { name, description })
      setShowEditForm(false)
      loadProject()
    }catch(err){
      setError(err?.response?.data?.message || 'Failed to update project')
    }
  }

  async function handleCreateTask(e){
    e.preventDefault()
    if (!isAdmin) {
      setError('Only admins can create tasks')
      return
    }
    setError(null)
    try{
      const taskData = {
        title: taskTitle,
        description: taskDescription,
        assignedUserIds: selectedTaskAssignees
      }
      await api.post(`/projects/${id}/tasks`, taskData)
      setShowTaskForm(false)
      setTaskTitle('')
      setTaskDescription('')
      setSelectedTaskAssignees([])
      loadTasks()
    }catch(err){
      setError(err?.response?.data?.message || 'Failed to create task')
    }
  }

  async function handleCompleteProject(){
    if (!isAdmin) {
      setError('Only admins can complete projects')
      return
    }
    if(!window.confirm('Are you sure you want to mark this project as completed?')) return
    try{
      await api.put(`/projects/${id}/complete`)
      navigate('/projects')
    }catch(err){
      setError(err?.response?.data?.message || 'Failed to complete project')
    }
  }

  async function handleDeleteProject(){
    if (!isAdmin) {
      setError('Only admins can delete projects')
      return
    }
    if(!window.confirm('Are you sure? This action cannot be undone.')) return
    try{
      await api.delete(`/projects/${id}`)
      navigate('/projects')
    }catch(err){
      setError(err?.response?.data?.message || 'Failed to delete project')
    }
  }

  if (loading) return (
    <div className="text-center py-16">
      <div className="text-5xl mb-4">⏳</div>
      <p className="text-gray-600">Loading project details...</p>
    </div>
  )

  if (!project) return (
    <div className="text-center py-16">
      <div className="text-5xl mb-4">❌</div>
      <p className="text-gray-600 mb-6">Project not found</p>
      <Link to="/projects" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">← Back to Projects</Link>
    </div>
  )

  const taskStats = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'TODO').length,
    inProgress: tasks.filter(t => t.status === 'IN_PROGRESS').length,
    done: tasks.filter(t => t.status === 'DONE').length
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'TODO': return 'bg-yellow-100 text-yellow-700 border-yellow-300'
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-700 border-blue-300'
      case 'DONE': return 'bg-green-100 text-green-700 border-green-300'
      default: return 'bg-gray-100 text-gray-700 border-gray-300'
    }
  }

  const getStatusIcon = (status) => {
    switch(status) {
      case 'TODO': return '📝'
      case 'IN_PROGRESS': return '⚙️'
      case 'DONE': return '✅'
      default: return '❓'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.name}</h1>
              <p className="text-gray-600 mb-4">{project.description || '(no description)'}</p>
              <div className="flex items-center gap-3">
                <span className={`px-4 py-2 rounded-full text-sm font-bold ${project.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {project.status === 'ACTIVE' ? '🟢 Active' : '🔴 Completed'}
                </span>
                <span className="text-sm text-gray-600">
                  👥 {project.members?.length || 0} member{(project.members?.length || 0) !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {isAdmin && project.status === 'ACTIVE' && (
                <button 
                  onClick={handleCompleteProject}
                  className="px-4 py-2 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition"
                >
                  ✅ Complete Project
                </button>
              )}
              {isAdmin && (
                <button 
                  onClick={()=>setShowEditForm(!showEditForm)}
                  className="px-4 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition"
                >
                  ✏️ Edit
                </button>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded text-red-700">
            <span className="font-medium">❌ {error}</span>
          </div>
        )}

        {/* Edit Form */}
        {showEditForm && isAdmin && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h3 className="text-xl font-bold mb-4">Edit Project</h3>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Project Name</label>
                <input className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none" value={name} onChange={e=>setName(e.target.value)} required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none" rows="3" value={description} onChange={e=>setDescription(e.target.value)}></textarea>
              </div>
              <div className="flex gap-3">
                <button type="submit" className="flex-1 px-4 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600">💾 Save</button>
                <button type="button" onClick={()=>setShowEditForm(false)} className="flex-1 px-4 py-2 bg-gray-400 text-white font-bold rounded-lg">✕ Cancel</button>
                <button type="button" onClick={handleDeleteProject} className="px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700">🗑️ Delete</button>
              </div>
            </form>
          </div>
        )}

        {/* Members & Task Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Members */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">👥 Team Members</h3>
              {isAdmin && (
                <button onClick={()=>setShowAddMemberForm(!showAddMemberForm)} className="px-3 py-1 bg-blue-600 text-white text-sm font-bold rounded">➕ Add</button>
              )}
            </div>
            {showAddMemberForm && isAdmin && (
              <form onSubmit={handleAddMember} className="mb-4 p-3 bg-blue-50 rounded border border-blue-200">
                <select value={selectedMemberId} onChange={e=>setSelectedMemberId(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded mb-2">
                  <option value="">Select a user...</option>
                  {allUsers.map(u=> (
                    <option key={u.id} value={u.id}>{u.username} ({u.email})</option>
                  ))}
                </select>
                <div className="flex gap-2">
                  <button type="submit" className="flex-1 px-3 py-2 bg-blue-600 text-white font-bold rounded">Add</button>
                  <button type="button" onClick={()=>{setShowAddMemberForm(false); setSelectedMemberId('')}} className="flex-1 px-3 py-2 bg-gray-400 text-white rounded">Cancel</button>
                </div>
              </form>
            )}
            <div className="space-y-2">
              {project.members?.length > 0 ? (
                project.members.map(m=> (
                  <div key={m.id} className="p-3 bg-gray-50 rounded border border-gray-200">
                    <p className="font-semibold">{m.username}</p>
                    <p className="text-sm text-gray-600">{m.email}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No members</p>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-bold mb-4">📊 Tasks</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span>Total</span>
                <span className="font-bold text-lg">{taskStats.total}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-yellow-50 rounded">
                <span>📝 To Do</span>
                <span className="font-bold text-lg">{taskStats.todo}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                <span>⚙️ In Progress</span>
                <span className="font-bold text-lg">{taskStats.inProgress}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                <span>✅ Done</span>
                <span className="font-bold text-lg">{taskStats.done}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tasks Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">✅ Tasks ({tasks.length})</h2>
            {isAdmin && (
              <button onClick={()=>setShowTaskForm(!showTaskForm)} className="px-4 py-2 bg-green-500 text-white font-bold rounded">
                ➕ New Task
              </button>
            )}
          </div>

          {/* Edit Task Modal */}
          {showEditTaskForm && editingTask && isAdmin && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg shadow-2xl p-6 max-w-2xl w-full max-h-96 overflow-y-auto">
                <h3 className="text-xl font-bold mb-4">Edit Task</h3>
                <form onSubmit={handleEditTask} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1">Title</label>
                    <input className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-blue-500 focus:outline-none" value={editTaskData.title} onChange={e=>setEditTaskData({...editTaskData, title: e.target.value})} required />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Description</label>
                    <textarea className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-blue-500 focus:outline-none" rows="2" value={editTaskData.description} onChange={e=>setEditTaskData({...editTaskData, description: e.target.value})}></textarea>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-semibold mb-1">Status</label>
                      <select className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-blue-500" value={editTaskData.status} onChange={e=>setEditTaskData({...editTaskData, status: e.target.value})}>
                        <option value="TODO">📝 To Do</option>
                        <option value="IN_PROGRESS">⚙️ In Progress</option>
                        <option value="DONE">✅ Done</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">Priority</label>
                      <select className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-blue-500" value={editTaskData.priority} onChange={e=>setEditTaskData({...editTaskData, priority: e.target.value})}>
                        <option value="LOW">🟢 Low</option>
                        <option value="MEDIUM">🟡 Medium</option>
                        <option value="HIGH">🔴 High</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Assign to:</label>
                    <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto p-2 border border-gray-200 rounded">
                      {project.members?.map(member => (
                        <label key={member.id} className="flex items-center cursor-pointer">
                          <input type="checkbox" checked={selectedTaskAssignees.includes(member.id)} onChange={e => {
                            if (e.target.checked) {
                              setSelectedTaskAssignees([...selectedTaskAssignees, member.id])
                            } else {
                              setSelectedTaskAssignees(selectedTaskAssignees.filter(id => id !== member.id))
                            }
                          }} className="w-4 h-4" />
                          <span className="ml-2 text-sm">{member.username}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button type="submit" className="flex-1 px-4 py-2 bg-blue-500 text-white font-bold rounded">💾 Save</button>
                    <button type="button" onClick={()=>{setShowEditTaskForm(false); setEditingTask(null)}} className="flex-1 px-4 py-2 bg-gray-400 text-white rounded">Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Create Task Form */}
          {showTaskForm && isAdmin && (
            <form onSubmit={handleCreateTask} className="p-4 bg-green-50 rounded border-2 border-green-200 mb-6">
              <h4 className="font-bold mb-3">Create Task</h4>
              <div className="space-y-3">
                <input placeholder="Task title" className="w-full px-3 py-2 border border-gray-300 rounded focus:border-green-500 focus:outline-none" value={taskTitle} onChange={e=>setTaskTitle(e.target.value)} required />
                <textarea placeholder="Description" className="w-full px-3 py-2 border border-gray-300 rounded focus:border-green-500 focus:outline-none" rows="2" value={taskDescription} onChange={e=>setTaskDescription(e.target.value)}></textarea>
                <div>
                  <label className="block text-sm font-semibold mb-2">Assign to:</label>
                  <div className="grid grid-cols-2 gap-2">
                    {project.members?.map(member => (
                      <label key={member.id} className="flex items-center cursor-pointer">
                        <input type="checkbox" checked={selectedTaskAssignees.includes(member.id)} onChange={e => {
                          if (e.target.checked) {
                            setSelectedTaskAssignees([...selectedTaskAssignees, member.id])
                          } else {
                            setSelectedTaskAssignees(selectedTaskAssignees.filter(id => id !== member.id))
                          }
                        }} className="w-4 h-4" />
                        <span className="ml-2 text-sm">{member.username}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3">
                  <button type="submit" className="flex-1 px-4 py-2 bg-green-500 text-white font-bold rounded">✅ Create</button>
                  <button type="button" onClick={()=>{setShowTaskForm(false); setTaskTitle(''); setTaskDescription(''); setSelectedTaskAssignees([])}} className="flex-1 px-4 py-2 bg-gray-400 text-white rounded">Cancel</button>
                </div>
              </div>
            </form>
          )}

          {/* Tasks List */}
          {tasks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No tasks yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tasks.map(t=> (
                <div key={t.id} className="p-4 border-2 border-gray-200 rounded-lg hover:shadow-md transition">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-900 flex-1">{t.title}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-bold border ${getStatusColor(t.status)}`}>
                      {getStatusIcon(t.status)} {t.status}
                    </span>
                  </div>
                  {t.description && <p className="text-sm text-gray-600 mb-2">{t.description}</p>}
                  {t.assignedUsers?.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs text-gray-600 font-semibold mb-1">Assigned:</p>
                      <div className="flex flex-wrap gap-1">
                        {t.assignedUsers.map(u => (
                          <span key={u.id} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">{u.username}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="flex gap-2 pt-2 border-t border-gray-200">
                    {isAdmin && (
                      <button onClick={()=>openEditTaskForm(t)} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200">✏️ Edit</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
