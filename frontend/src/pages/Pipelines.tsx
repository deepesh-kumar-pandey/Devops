import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Plus, GitBranch, Play, CheckCircle2, XCircle, Clock } from 'lucide-react'
import toast from 'react-hot-toast'
import { pipelinesAPI, projectsAPI } from '../services/api'
import { formatDistanceToNow } from 'date-fns'

const Pipelines = () => {
  const queryClient = useQueryClient()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    project_id: 0,
    config: { stages: [] },
  })

  const { data: pipelines, isLoading } = useQuery({
    queryKey: ['pipelines'],
    queryFn: () => pipelinesAPI.list().then(res => res.data),
  })

  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectsAPI.list().then(res => res.data),
  })

  const createMutation = useMutation({
    mutationFn: (data: any) => pipelinesAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pipelines'] })
      toast.success('Pipeline created successfully')
      setShowCreateModal(false)
      setFormData({ name: '', description: '', project_id: 0, config: { stages: [] } })
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to create pipeline')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createMutation.mutate(formData)
  }

  if (isLoading) {
    return <div className="text-white">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">CI/CD Pipelines</h1>
          <p className="text-gray-400">Manage and monitor your build pipelines</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          New Pipeline
        </button>
      </div>

      <div className="space-y-4">
        {pipelines?.map((pipeline: any) => (
          <div key={pipeline.id} className="card">
            <div className="flex items-center justify-between">
              <Link
                to={`/pipelines/${pipeline.id}`}
                className="flex items-center gap-4 flex-1"
              >
                <div className="p-3 bg-blue-900/20 rounded-lg">
                  <GitBranch className="text-blue-400" size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-1">{pipeline.name}</h3>
                  <p className="text-sm text-gray-400">{pipeline.description || 'No description'}</p>
                </div>
              </Link>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-400">0</p>
                  <p className="text-xs text-gray-400">Success</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-400">0</p>
                  <p className="text-xs text-gray-400">Failed</p>
                </div>
                <button className="btn btn-primary flex items-center gap-2">
                  <Play size={16} />
                  Run
                </button>
              </div>
            </div>
          </div>
        ))}
        {(!pipelines || pipelines.length === 0) && (
          <div className="card text-center py-12">
            <GitBranch className="mx-auto text-gray-600 mb-4" size={48} />
            <p className="text-gray-400">No pipelines yet. Create your first pipeline to get started.</p>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Create Pipeline</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Pipeline Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input"
                  placeholder="Build and Test"
                  required
                />
              </div>

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
                <label className="label">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input"
                  rows={3}
                  placeholder="Pipeline description"
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
                  {createMutation.isPending ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Pipelines
