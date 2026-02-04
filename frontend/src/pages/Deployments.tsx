import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Rocket, RotateCcw, CheckCircle2, XCircle, Clock } from 'lucide-react'
import toast from 'react-hot-toast'
import { deploymentsAPI, projectsAPI } from '../services/api'
import { formatDistanceToNow } from 'date-fns'

const Deployments = () => {
  const queryClient = useQueryClient()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedEnvironment, setSelectedEnvironment] = useState<string>('')
  const [formData, setFormData] = useState({
    project_id: 0,
    environment: 'development',
    version: '',
    commit_sha: '',
    image_tag: '',
    notes: '',
  })

  const { data: deployments, isLoading } = useQuery({
    queryKey: ['deployments', selectedEnvironment],
    queryFn: () => deploymentsAPI.list(undefined, selectedEnvironment || undefined).then(res => res.data),
  })

  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectsAPI.list().then(res => res.data),
  })

  const createMutation = useMutation({
    mutationFn: (data: any) => deploymentsAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deployments'] })
      toast.success('Deployment created successfully')
      setShowCreateModal(false)
      setFormData({
        project_id: 0,
        environment: 'development',
        version: '',
        commit_sha: '',
        image_tag: '',
        notes: '',
      })
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to create deployment')
    },
  })

  const rollbackMutation = useMutation({
    mutationFn: (deploymentId: number) => deploymentsAPI.rollback(deploymentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deployments'] })
      toast.success('Rollback initiated')
    },
    onError: () => {
      toast.error('Failed to rollback deployment')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createMutation.mutate(formData)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="text-green-400" size={20} />
      case 'failed':
        return <XCircle className="text-red-400" size={20} />
      case 'in_progress':
        return <Clock className="text-blue-400 animate-pulse" size={20} />
      default:
        return <Clock className="text-gray-400" size={20} />
    }
  }

  const environments = [
    { value: '', label: 'All Environments' },
    { value: 'development', label: 'Development' },
    { value: 'staging', label: 'Staging' },
    { value: 'production', label: 'Production' },
  ]

  if (isLoading) {
    return <div className="text-white">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Deployments</h1>
          <p className="text-gray-400">Track and manage application deployments</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          New Deployment
        </button>
      </div>

      <div className="flex gap-3">
        {environments.map((env) => (
          <button
            key={env.value}
            onClick={() => setSelectedEnvironment(env.value)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedEnvironment === env.value
                ? 'bg-primary-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {env.label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {deployments?.map((deployment: any) => (
          <div key={deployment.id} className="card">
            <div className="flex items-center gap-4">
              {getStatusIcon(deployment.status)}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-white">
                    Deployment #{deployment.id}
                  </h3>
                  <span className={`badge badge-${
                    deployment.environment === 'production' ? 'error' :
                    deployment.environment === 'staging' ? 'warning' :
                    'info'
                  }`}>
                    {deployment.environment}
                  </span>
                  <span className={`badge ${
                    deployment.status === 'success' ? 'badge-success' :
                    deployment.status === 'failed' ? 'badge-error' :
                    'badge-warning'
                  }`}>
                    {deployment.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400">Version</p>
                    <p className="text-white font-medium">{deployment.version}</p>
                  </div>
                  {deployment.commit_sha && (
                    <div>
                      <p className="text-gray-400">Commit</p>
                      <p className="text-white font-mono text-xs">{deployment.commit_sha.substring(0, 8)}</p>
                    </div>
                  )}
                  {deployment.image_tag && (
                    <div>
                      <p className="text-gray-400">Image Tag</p>
                      <p className="text-white font-medium">{deployment.image_tag}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-gray-400">Deployed</p>
                    <p className="text-white">{formatDistanceToNow(new Date(deployment.created_at), { addSuffix: true })}</p>
                  </div>
                </div>
                {deployment.notes && (
                  <p className="text-sm text-gray-400 mt-2">{deployment.notes}</p>
                )}
              </div>
              {deployment.status === 'success' && (
                <button
                  onClick={() => rollbackMutation.mutate(deployment.id)}
                  className="btn btn-secondary flex items-center gap-2"
                >
                  <RotateCcw size={16} />
                  Rollback
                </button>
              )}
            </div>
          </div>
        ))}
        {(!deployments || deployments.length === 0) && (
          <div className="card text-center py-12">
            <Rocket className="mx-auto text-gray-600 mb-4" size={48} />
            <p className="text-gray-400">No deployments yet. Create your first deployment to get started.</p>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Create Deployment</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Project</label>
                <select
                  value={formData.project_id}
                  onChange={(e) => setFormData({ ...formData, project_id: parseInt(e.target.value) })}
                  className="input"
                  required
                >
                  <option value="">Select project</option>
                  {projects?.map((project: any) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">Environment</label>
                <select
                  value={formData.environment}
                  onChange={(e) => setFormData({ ...formData, environment: e.target.value })}
                  className="input"
                  required
                >
                  <option value="development">Development</option>
                  <option value="staging">Staging</option>
                  <option value="production">Production</option>
                </select>
              </div>

              <div>
                <label className="label">Version</label>
                <input
                  type="text"
                  value={formData.version}
                  onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                  className="input"
                  placeholder="v1.0.0"
                  required
                />
              </div>

              <div>
                <label className="label">Commit SHA</label>
                <input
                  type="text"
                  value={formData.commit_sha}
                  onChange={(e) => setFormData({ ...formData, commit_sha: e.target.value })}
                  className="input"
                  placeholder="abc123..."
                />
              </div>

              <div>
                <label className="label">Image Tag</label>
                <input
                  type="text"
                  value={formData.image_tag}
                  onChange={(e) => setFormData({ ...formData, image_tag: e.target.value })}
                  className="input"
                  placeholder="myapp:latest"
                />
              </div>

              <div>
                <label className="label">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="input"
                  rows={3}
                  placeholder="Deployment notes"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="flex-1 btn btn-primary"
                >
                  {createMutation.isPending ? 'Deploying...' : 'Deploy'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Deployments
