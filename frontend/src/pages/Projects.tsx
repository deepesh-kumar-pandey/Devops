import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Plus, FolderKanban, GitBranch, Calendar } from 'lucide-react'
import toast from 'react-hot-toast'
import { projectsAPI, organizationsAPI } from '../services/api'
import { formatDistanceToNow } from 'date-fns'

const Projects = () => {
  const queryClient = useQueryClient()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    repository_url: '',
    organization_id: 0,
  })

  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectsAPI.list().then(res => res.data),
  })

  const { data: organizations } = useQuery({
    queryKey: ['organizations'],
    queryFn: () => organizationsAPI.list().then(res => res.data),
  })

  const createMutation = useMutation({
    mutationFn: (data: any) => projectsAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      toast.success('Project created successfully')
      setShowCreateModal(false)
      setFormData({ name: '', description: '', repository_url: '', organization_id: 0 })
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to create project')
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
          <h1 className="text-3xl font-bold text-white mb-2">Projects</h1>
          <p className="text-gray-400">Manage your DevOps projects</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          New Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects?.map((project: any) => (
          <Link
            key={project.id}
            to={`/projects/${project.id}`}
            className="card hover:border-primary-500 transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-900/20 rounded-lg">
                <FolderKanban className="text-blue-400" size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-white mb-1 truncate">{project.name}</h3>
                <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                  {project.description || 'No description'}
                </p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <GitBranch size={14} />
                    <span>{project.slug}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>{formatDistanceToNow(new Date(project.created_at), { addSuffix: true })}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-700">
              <span className={`badge ${project.is_active ? 'badge-success' : 'badge-error'}`}>
                {project.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Create Project</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Project Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input"
                  placeholder="My Awesome Project"
                  required
                />
              </div>

              <div>
                <label className="label">Organization</label>
                <select
                  value={formData.organization_id}
                  onChange={(e) => setFormData({ ...formData, organization_id: parseInt(e.target.value) })}
                  className="input"
                  required
                >
                  <option value="">Select organization</option>
                  {organizations?.map((org: any) => (
                    <option key={org.id} value={org.id}>
                      {org.display_name}
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
                  placeholder="Project description"
                />
              </div>

              <div>
                <label className="label">Repository URL</label>
                <input
                  type="url"
                  value={formData.repository_url}
                  onChange={(e) => setFormData({ ...formData, repository_url: e.target.value })}
                  className="input"
                  placeholder="https://github.com/username/repo"
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

export default Projects
