import { useQuery } from '@tanstack/react-query'
import { useParams, Link } from 'react-router-dom'
import { GitBranch, Rocket, Settings, ExternalLink } from 'lucide-react'
import { projectsAPI, pipelinesAPI, deploymentsAPI } from '../services/api'

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>()
  const projectId = parseInt(id!)

  const { data: project, isLoading } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => projectsAPI.get(projectId).then(res => res.data),
  })

  const { data: pipelines } = useQuery({
    queryKey: ['pipelines', projectId],
    queryFn: () => pipelinesAPI.list(projectId).then(res => res.data),
  })

  const { data: deployments } = useQuery({
    queryKey: ['deployments', projectId],
    queryFn: () => deploymentsAPI.list(projectId).then(res => res.data),
  })

  if (isLoading) {
    return <div className="text-white">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">{project?.name}</h1>
          <p className="text-gray-400">{project?.description || 'No description'}</p>
          {project?.repository_url && (
            <a
              href={project.repository_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-primary-400 hover:text-primary-300 mt-2"
            >
              <ExternalLink size={16} />
              View Repository
            </a>
          )}
        </div>
        <button className="btn btn-secondary flex items-center gap-2">
          <Settings size={20} />
          Settings
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="text-center">
            <GitBranch className="mx-auto text-blue-400 mb-2" size={32} />
            <p className="text-2xl font-bold text-white">{pipelines?.length || 0}</p>
            <p className="text-sm text-gray-400">Pipelines</p>
          </div>
        </div>
        <div className="card">
          <div className="text-center">
            <Rocket className="mx-auto text-purple-400 mb-2" size={32} />
            <p className="text-2xl font-bold text-white">{deployments?.length || 0}</p>
            <p className="text-sm text-gray-400">Deployments</p>
          </div>
        </div>
        <div className="card">
          <div className="text-center">
            <Settings className="mx-auto text-gray-400 mb-2" size={32} />
            <p className="text-2xl font-bold text-white">{project?.is_active ? 'Active' : 'Inactive'}</p>
            <p className="text-sm text-gray-400">Status</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Pipelines</h2>
            <Link to="/pipelines" className="text-sm text-primary-400 hover:text-primary-300">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {pipelines?.map((pipeline: any) => (
              <Link
                key={pipeline.id}
                to={`/pipelines/${pipeline.id}`}
                className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <GitBranch size={20} className="text-blue-400" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{pipeline.name}</p>
                  <p className="text-xs text-gray-400">{pipeline.description || 'No description'}</p>
                </div>
              </Link>
            ))}
            {(!pipelines || pipelines.length === 0) && (
              <p className="text-sm text-gray-400 text-center py-4">No pipelines yet</p>
            )}
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Recent Deployments</h2>
            <Link to="/deployments" className="text-sm text-primary-400 hover:text-primary-300">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {deployments?.slice(0, 5).map((deployment: any) => (
              <div key={deployment.id} className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg">
                <Rocket size={20} className="text-purple-400" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{deployment.environment}</p>
                  <p className="text-xs text-gray-400">{deployment.version}</p>
                </div>
                <span className={`badge ${
                  deployment.status === 'success' ? 'badge-success' :
                  deployment.status === 'failed' ? 'badge-error' :
                  'badge-warning'
                }`}>
                  {deployment.status}
                </span>
              </div>
            ))}
            {(!deployments || deployments.length === 0) && (
              <p className="text-sm text-gray-400 text-center py-4">No deployments yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectDetail
