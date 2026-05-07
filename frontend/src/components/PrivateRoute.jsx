import { Navigate } from 'react-router-dom'

export default function PrivateRoute({ children }){
  try{
    const token = localStorage.getItem('token')
    if(!token) return <Navigate to="/login" replace />
    return children
  }catch(e){
    return <Navigate to="/login" replace />
  }
}
