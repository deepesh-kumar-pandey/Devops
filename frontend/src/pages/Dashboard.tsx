import { useQuery } from '@tanstack/react-query'
import { 
  Activity, 
  GitBranch, 
  Rocket, 
  Server, 
  AlertTriangle,
  TrendingUp,
  CheckCircle2,
  XCircle
} from 'lucide-react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { projectsAPI, pipelinesAPI, deploymentsAPI, monitoringAPI } from '../services/api'

const Dashboard = () => {
  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectsAPI.list().then(res => res.data),
  })

  const { data: pipelines } = useQuery({
    queryKey: ['pipelines'],
    queryFn: () => pipelinesAPI.list().then(res => res.data),
  })

  const { data: deployments } = useQuery({
    queryKey: ['deployments'],
    queryFn: () => deploymentsAPI.list().then(res => res.data),
  })

  const { data: alerts } = useQuery({
    queryKey: ['alerts'],
    queryFn: () => monitoringAPI.listAlerts(undefined, 'active').then(res => res.data),
  })

  // Mock data for charts
  const pipelineData = [
    { name: 'Mon', runs: 12, success: 10 },
    { name: 'Tue', runs: 15, success: 13 },
    { name: 'Wed', runs: 8, success: 7 },
    { name: 'Thu', runs: 20, success: 18 },
    { name: 'Fri', runs: 18, success: 15 },
    { name: 'Sat', runs: 5, success: 5 },
    { name: 'Sun', runs: 3, success: 3 },
  ]

  const deploymentData = [
    { name: 'Mon', deployments: 5 },
    { name: 'Tue', deployments: 8 },
    { name: 'Wed', deployments: 3 },
    { name: 'Thu', deployments: 10 },
    { name: 'Fri', deployments: 12 },
    { name: 'Sat', deployments: 2 },
    { name: 'Sun', deployments: 1 },
  ]

  const stats = [
    {
      name: 'Active Projects',
      value: projects?.length || 0,
      icon: Activity,
      color: 'text-blue-400',
      bgColor: 'bg-blue-900/20',
    },
    {
      name: 'Pipelines',
      value: pipelines?.length || 0,
      icon: GitBranch,
      color: 'text-green-400',
      bgColor: 'bg-green-900/20',
    },
    {
      name: 'Recent Deployments',
      value: deployments?.length || 0,
      icon: Rocket,
      color: 'text-purple-400',
      bgColor: 'bg-purple-900/20',
    },
    {
      name: 'Active Alerts',
      value: alerts?.length || 0,
      icon: AlertTriangle,
      color: 'text-red-400',
      bgColor: 'bg-red-900/20',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">Welcome to your DevOps Platform</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="card">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={stat.color} size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-400">{stat.name}</p>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold text-white mb-4">Pipeline Activity</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={pipelineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                labelStyle={{ color: '#F3F4F6' }}
              />
              <Line type="monotone" dataKey="runs" stroke="#3B82F6" strokeWidth={2} />
              <Line type="monotone" dataKey="success" stroke="#10B981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold text-white mb-4">Deployment Frequency</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={deploymentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                labelStyle={{ color: '#F3F4F6' }}
              />
              <Bar dataKey="deployments" fill="#8B5CF6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold text-white mb-4">Recent Deployments</h2>
          <div className="space-y-3">
            {deployments?.slice(0, 5).map((deployment: any) => (
              <div key={deployment.id} className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg">
                <Rocket size={20} className="text-purple-400" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">Deployment #{deployment.id}</p>
                  <p className="text-xs text-gray-400">{deployment.environment} - {deployment.version}</p>
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
              <p className="text-sm text-gray-400 text-center py-4">No recent deployments</p>
            )}
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold text-white mb-4">Active Alerts</h2>
          <div className="space-y-3">
            {alerts?.slice(0, 5).map((alert: any) => (
              <div key={alert.id} className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg">
                <AlertTriangle size={20} className="text-red-400" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{alert.title}</p>
                  <p className="text-xs text-gray-400">{alert.source}</p>
                </div>
                <span className={`badge ${
                  alert.severity === 'critical' ? 'badge-error' :
                  alert.severity === 'warning' ? 'badge-warning' :
                  'badge-info'
                }`}>
                  {alert.severity}
                </span>
              </div>
            ))}
            {(!alerts || alerts.length === 0) && (
              <p className="text-sm text-gray-400 text-center py-4">No active alerts</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
