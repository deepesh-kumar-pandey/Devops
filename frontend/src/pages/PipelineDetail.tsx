import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { Play, GitBranch, Clock, CheckCircle2, XCircle, Circle } from 'lucide-react'
import toast from 'react-hot-toast'
import { pipelinesAPI } from '../services/api'
import { formatDistanceToNow } from 'date-fns'

const PipelineDetail = () => {
  const { id } = useParams<{ id: string }>()
  const pipelineId = parseInt(id!)
  const queryClient = useQueryClient()

  const { data: pipeline, isLoading } = useQuery({
    queryKey: ['pipeline', pipelineId],
    queryFn: () => pipelinesAPI.get(pipelineId).then(res => res.data),
  })

  const { data: runs } = useQuery({
    queryKey: ['pipeline-runs', pipelineId],
    queryFn: () => pipelinesAPI.listRuns(pipelineId).then(res => res.data),
  })

  const runMutation = useMutation({
    mutationFn: () => pipelinesAPI.createRun(pipelineId, {
      pipeline_id: pipelineId,
      trigger: 'manual',
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pipeline-runs', pipelineId] })
      toast.success('Pipeline run started')
    },
    onError: () => {
      toast.error('Failed to start pipeline run')
    },
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="text-green-400" size={20} />
      case 'failed':
        return <XCircle className="text-red-400" size={20} />
      case 'running':
        return <Circle className="text-blue-400 animate-pulse" size={20} />
      default:
        return <Clock className="text-gray-400" size={20} />
    }
  }

  if (isLoading) {
    return <div className="text-white">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-900/20 rounded-lg">
            <GitBranch className="text-blue-400" size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{pipeline?.name}</h1>
            <p className="text-gray-400">{pipeline?.description || 'No description'}</p>
          </div>
        </div>
        <button
          onClick={() => runMutation.mutate()}
          disabled={runMutation.isPending}
          className="btn btn-primary flex items-center gap-2"
        >
          <Play size={20} />
          {runMutation.isPending ? 'Starting...' : 'Run Pipeline'}
        </button>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold text-white mb-4">Pipeline Configuration</h2>
        <pre className="bg-gray-900 p-4 rounded-lg text-sm text-gray-300 overflow-x-auto">
          {JSON.stringify(pipeline?.config, null, 2)}
        </pre>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold text-white mb-4">Recent Runs</h2>
        <div className="space-y-3">
          {runs?.map((run: any) => (
            <div key={run.id} className="flex items-center gap-4 p-4 bg-gray-700/50 rounded-lg">
              {getStatusIcon(run.status)}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <p className="text-sm font-medium text-white">Run #{run.run_number}</p>
                  <span className={`badge ${
                    run.status === 'success' ? 'badge-success' :
                    run.status === 'failed' ? 'badge-error' :
                    run.status === 'running' ? 'badge-info' :
                    'badge-warning'
                  }`}>
                    {run.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  {run.branch && <span>Branch: {run.branch}</span>}
                  {run.trigger && <span>Trigger: {run.trigger}</span>}
                  {run.duration && <span>Duration: {run.duration}s</span>}
                  <span>{formatDistanceToNow(new Date(run.created_at), { addSuffix: true })}</span>
                </div>
                {run.commit_message && (
                  <p className="text-xs text-gray-500 mt-1 truncate">{run.commit_message}</p>
                )}
              </div>
            </div>
          ))}
          {(!runs || runs.length === 0) && (
            <p className="text-sm text-gray-400 text-center py-8">No pipeline runs yet</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default PipelineDetail
