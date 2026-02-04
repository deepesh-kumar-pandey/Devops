import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import Layout from './components/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import ProjectDetail from './pages/ProjectDetail'
import Pipelines from './pages/Pipelines'
import PipelineDetail from './pages/PipelineDetail'
import Deployments from './pages/Deployments'
import Infrastructure from './pages/Infrastructure'
import Monitoring from './pages/Monitoring'
import Organizations from './pages/Organizations'

function App() {
  const { token } = useAuthStore()
  const isAuthenticated = !!token

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />
        
        <Route element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/organizations" element={<Organizations />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/pipelines" element={<Pipelines />} />
          <Route path="/pipelines/:id" element={<PipelineDetail />} />
          <Route path="/deployments" element={<Deployments />} />
          <Route path="/infrastructure" element={<Infrastructure />} />
          <Route path="/monitoring" element={<Monitoring />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
