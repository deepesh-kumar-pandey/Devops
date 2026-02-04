import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Building2, Users } from 'lucide-react'
import toast from 'react-hot-toast'
import { organizationsAPI } from '../services/api'

const Organizations = () => {
  const queryClient = useQueryClient()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    display_name: '',
    description: '',
  })

  const { data: organizations, isLoading } = useQuery({
    queryKey: ['organizations'],
    queryFn: () => organizationsAPI.list().then(res => res.data),
  })

  const createMutation = useMutation({
    mutationFn: (data: any) => organizationsAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] })
      toast.success('Organization created successfully')
      setShowCreateModal(false)
      setFormData({ name: '', display_name: '', description: '' })
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to create organization')
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
          <h1 className="text-3xl font-bold text-white mb-2">Organizations</h1>
          <p className="text-gray-400">Manage your organizations and teams</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          New Organization
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {organizations?.map((org: any) => (
          <div key={org.id} className="card hover:border-primary-500 transition-colors cursor-pointer">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary-900/20 rounded-lg">
                <Building2 className="text-primary-400" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-1">{org.display_name}</h3>
                <p className="text-sm text-gray-400 mb-3">{org.description || 'No description'}</p>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Users size={16} />
                  <span>Team members</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Create Organization</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Organization Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input"
                  placeholder="my-org"
                  required
                />
              </div>

              <div>
                <label className="label">Display Name</label>
                <input
                  type="text"
                  value={formData.display_name}
                  onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                  className="input"
                  placeholder="My Organization"
                  required
                />
              </div>

              <div>
                <label className="label">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input"
                  rows={3}
                  placeholder="Optional description"
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

export default Organizations
