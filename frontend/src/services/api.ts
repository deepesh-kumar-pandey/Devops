import axios from 'axios'
import { useAuthStore } from '../store/authStore'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const api = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  register: (data: { email: string; username: string; password: string; full_name?: string }) =>
    api.post('/auth/register', data),
  login: (username: string, password: string) =>
    api.post('/auth/login', new URLSearchParams({ username, password }), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    }),
}

// Users API
export const usersAPI = {
  getCurrentUser: () => api.get('/users/me'),
  updateUser: (data: any) => api.put('/users/me', data),
}

// Organizations API
export const organizationsAPI = {
  list: () => api.get('/organizations'),
  create: (data: any) => api.post('/organizations', data),
  get: (id: number) => api.get(`/organizations/${id}`),
  update: (id: number, data: any) => api.put(`/organizations/${id}`, data),
  listMembers: (id: number) => api.get(`/organizations/${id}/members`),
  addMember: (id: number, data: any) => api.post(`/organizations/${id}/members`, data),
}

// Projects API
export const projectsAPI = {
  list: (organizationId?: number) => api.get('/projects', { params: { organization_id: organizationId } }),
  create: (data: any) => api.post('/projects', data),
  get: (id: number) => api.get(`/projects/${id}`),
  update: (id: number, data: any) => api.put(`/projects/${id}`, data),
  delete: (id: number) => api.delete(`/projects/${id}`),
}

// Pipelines API
export const pipelinesAPI = {
  list: (projectId?: number) => api.get('/pipelines', { params: { project_id: projectId } }),
  create: (data: any) => api.post('/pipelines', data),
  get: (id: number) => api.get(`/pipelines/${id}`),
  update: (id: number, data: any) => api.put(`/pipelines/${id}`, data),
  listRuns: (pipelineId: number) => api.get(`/pipelines/${pipelineId}/runs`),
  createRun: (pipelineId: number, data: any) => api.post(`/pipelines/${pipelineId}/runs`, data),
  getRun: (runId: number) => api.get(`/pipelines/runs/${runId}`),
}

// Deployments API
export const deploymentsAPI = {
  list: (projectId?: number, environment?: string) => 
    api.get('/deployments', { params: { project_id: projectId, environment } }),
  create: (data: any) => api.post('/deployments', data),
  get: (id: number) => api.get(`/deployments/${id}`),
  update: (id: number, data: any) => api.put(`/deployments/${id}`, data),
  rollback: (id: number) => api.post(`/deployments/${id}/rollback`),
}

// Infrastructure API
export const infrastructureAPI = {
  listServers: (organizationId?: number) => 
    api.get('/infrastructure/servers', { params: { organization_id: organizationId } }),
  createServer: (data: any) => api.post('/infrastructure/servers', data),
  getServer: (id: number) => api.get(`/infrastructure/servers/${id}`),
  updateServer: (id: number, data: any) => api.put(`/infrastructure/servers/${id}`, data),
  listClusters: (organizationId?: number) => 
    api.get('/infrastructure/clusters', { params: { organization_id: organizationId } }),
  createCluster: (data: any) => api.post('/infrastructure/clusters', data),
  getCluster: (id: number) => api.get(`/infrastructure/clusters/${id}`),
}

// Monitoring API
export const monitoringAPI = {
  listMetrics: (serverId?: number, metricType?: string) => 
    api.get('/monitoring/metrics', { params: { server_id: serverId, metric_type: metricType } }),
  createMetric: (data: any) => api.post('/monitoring/metrics', data),
  listAlerts: (organizationId?: number, status?: string, severity?: string) => 
    api.get('/monitoring/alerts', { params: { organization_id: organizationId, status, severity } }),
  createAlert: (data: any) => api.post('/monitoring/alerts', data),
  getAlert: (id: number) => api.get(`/monitoring/alerts/${id}`),
  updateAlert: (id: number, data: any) => api.put(`/monitoring/alerts/${id}`, data),
  acknowledgeAlert: (id: number) => api.post(`/monitoring/alerts/${id}/acknowledge`),
}
