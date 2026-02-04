import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Server, HardDrive, Cpu, MemoryStick, Circle } from 'lucide-react'
import toast from 'react-hot-toast'
import { infrastructureAPI, organizationsAPI } from '../services/api'

const Infrastructure = () => {
  const queryClient = useQueryClient()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [activeTab, setActiveTab] = useState<'servers' | 'clusters'>('servers')
  const [formData, setFormData] = useState({
    name: '',
    hostname: '',
    ip_address: '',
    cpu_cores: 0,
    memory_gb: 0,
    disk_gb: 0,
    os: '',
    organization_id: 0,
  })

  const { data: servers, isLoading: loadingServers } = useQuery({
    queryKey: ['servers'],
    queryFn: () => infrastructureAPI.listServers().then(res => res.data),
  })

  const { data: clusters, isLoading: loadingClusters } = useQuery({
    queryKey: ['clusters'],
    queryFn: () => infrastructureAPI.listClusters().then(res => res.data),
  })

  const { data: organizations } = useQuery({
    queryKey: ['organizations'],
    queryFn: () => organizationsAPI.list().then(res => res.data),
  })

  const createServerMutation = useMutation({
    mutationFn: (data: any) => infrastructureAPI.createServer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['servers'] })
      toast.success('Server added successfully')
      setShowCreateModal(false)
      setFormData({
        name: '',
        hostname: '',
        ip_address: '',
        cpu_cores: 0,
        memory_gb: 0,
        disk_gb: 0,
        os: '',
        organization_id: 0,
      })
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to add server')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createServerMutation.mutate(formData)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'text-green-400'
      case 'offline':
        return 'text-red-400'
      case 'degraded':
        return 'text-yellow-400'
      default:
        return 'text-gray-400'
    }
  }

  const isLoading = activeTab === 'servers' ? loadingServers : loadingClusters

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Infrastructure</h1>
          <p className="text-gray-400">Manage servers and clusters</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Add Server
        </button>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => setActiveTab('servers')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'servers'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Servers ({servers?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab('clusters')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'clusters'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Clusters ({clusters?.length || 0})
        </button>
      </div>

      {isLoading ? (
        <div className="text-white">Loading...</div>
      ) : activeTab === 'servers' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {servers?.map((server: any) => (
            <div key={server.id} className="card">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-900/20 rounded-lg">
                  <Server className="text-blue-400" size={24} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-white">{server.name}</h3>
                    <Circle className={`${getStatusColor(server.status)} fill-current`} size={12} />
                    <span className="text-sm text-gray-400">{server.status}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <span className="font-mono">{server.hostname}</span>
                      <span>•</span>
                      <span>{server.ip_address}</span>
                    </div>
                    {server.os && (
                      <p className="text-sm text-gray-400">OS: {server.os}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    {server.cpu_cores && (
                      <div className="flex items-center gap-2">
                        <Cpu size={16} className="text-gray-400" />
                        <span className="text-sm text-white">{server.cpu_cores} cores</span>
                      </div>
                    )}
                    {server.memory_gb && (
                      <div className="flex items-center gap-2">
                        <MemoryStick size={16} className="text-gray-400" />
                        <span className="text-sm text-white">{server.memory_gb} GB</span>
                      </div>
                    )}
                    {server.disk_gb && (
                      <div className="flex items-center gap-2">
                        <HardDrive size={16} className="text-gray-400" />
                        <span className="text-sm text-white">{server.disk_gb} GB</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {(!servers || servers.length === 0) && (
            <div className="col-span-2 card text-center py-12">
              <Server className="mx-auto text-gray-600 mb-4" size={48} />
              <p className="text-gray-400">No servers yet. Add your first server to get started.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {clusters?.map((cluster: any) => (
            <div key={cluster.id} className="card">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-purple-900/20 rounded-lg">
                  <Server className="text-purple-400" size={24} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-white">{cluster.name}</h3>
                    <Circle className={`${getStatusColor(cluster.status)} fill-current`} size={12} />
                    <span className="text-sm text-gray-400">{cluster.status}</span>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-400">Type: {cluster.type}</p>
                    <p className="text-sm text-gray-400">Endpoint: {cluster.endpoint}</p>
                    {cluster.version && (
                      <p className="text-sm text-gray-400">Version: {cluster.version}</p>
                    )}
                    {cluster.node_count && (
                      <p className="text-sm text-gray-400">Nodes: {cluster.node_count}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {(!clusters || clusters.length === 0) && (
            <div className="col-span-2 card text-center py-12">
              <Server className="mx-auto text-gray-600 mb-4" size={48} />
              <p className="text-gray-400">No clusters yet. Add your first cluster to get started.</p>
            </div>
          )}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-white mb-4">Add Server</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Server Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input"
                  placeholder="web-server-01"
                  required
                />
              </div>

              <div>
                <label className="label">Hostname</label>
                <input
                  type="text"
                  value={formData.hostname}
                  onChange={(e) => setFormData({ ...formData, hostname: e.target.value })}
                  className="input"
                  placeholder="web01.example.com"
                  required
                />
              </div>

              <div>
                <label className="label">IP Address</label>
                <input
                  type="text"
                  value={formData.ip_address}
                  onChange={(e) => setFormData({ ...formData, ip_address: e.target.value })}
                  className="input"
                  placeholder="192.168.1.100"
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

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="label">CPU Cores</label>
                  <input
                    type="number"
                    value={formData.cpu_cores || ''}
                    onChange={(e) => setFormData({ ...formData, cpu_cores: parseInt(e.target.value) })}
                    className="input"
                    placeholder="4"
                  />
                </div>
                <div>
                  <label className="label">Memory (GB)</label>
                  <input
                    type="number"
                    value={formData.memory_gb || ''}
                    onChange={(e) => setFormData({ ...formData, memory_gb: parseInt(e.target.value) })}
                    className="input"
                    placeholder="16"
                  />
                </div>
                <div>
                  <label className="label">Disk (GB)</label>
                  <input
                    type="number"
                    value={formData.disk_gb || ''}
                    onChange={(e) => setFormData({ ...formData, disk_gb: parseInt(e.target.value) })}
                    className="input"
                    placeholder="500"
                  />
                </div>
              </div>

              <div>
                <label className="label">Operating System</label>
                <input
                  type="text"
                  value={formData.os}
                  onChange={(e) => setFormData({ ...formData, os: e.target.value })}
                  className="input"
                  placeholder="Ubuntu 22.04"
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
                  disabled={createServerMutation.isPending}
                  className="flex-1 btn btn-primary"
                >
                  {createServerMutation.isPending ? 'Adding...' : 'Add Server'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Infrastructure
