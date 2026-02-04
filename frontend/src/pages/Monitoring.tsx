import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { AlertTriangle, Activity, TrendingUp, CheckCircle2, Bell } from 'lucide-react'
import toast from 'react-hot-toast'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { monitoringAPI, infrastructureAPI } from '../services/api'
import { formatDistanceToNow } from 'date-fns'

const Monitoring = () => {
  const queryClient = useQueryClient()

  const { data: alerts } = useQuery({
    queryKey: ['alerts'],
    queryFn: () => monitoringAPI.listAlerts().then(res => res.data),
  })

  const { data: metrics } = useQuery({
    queryKey: ['metrics'],
    queryFn: () => monitoringAPI.listMetrics().then(res => res.data),
  })

  const { data: servers } = useQuery({
    queryKey: ['servers'],
    queryFn: () => infrastructureAPI.listServers().then(res => res.data),
  })

  const acknowledgeMutation = useMutation({
    mutationFn: (alertId: number) => monitoringAPI.acknowledgeAlert(alertId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] })
      toast.success('Alert acknowledged')
    },
    onError: () => {
      toast.error('Failed to acknowledge alert')
    },
  })

  const resolveMutation = useMutation({
    mutationFn: (alertId: number) => monitoringAPI.updateAlert(alertId, { status: 'resolved' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] })
      toast.success('Alert resolved')
    },
    onError: () => {
      toast.error('Failed to resolve alert')
    },
  })

  // Mock data for charts
  const cpuData = [
    { time: '00:00', value: 45 },
    { time: '04:00', value: 52 },
    { time: '08:00', value: 68 },
    { time: '12:00', value: 75 },
    { time: '16:00', value: 82 },
    { time: '20:00', value: 65 },
    { time: '23:59', value: 48 },
  ]

  const memoryData = [
    { time: '00:00', value: 4.2 },
    { time: '04:00', value: 4.5 },
    { time: '08:00', value: 6.8 },
    { time: '12:00', value: 7.2 },
    { time: '16:00', value: 8.1 },
    { time: '20:00', value: 6.5 },
    { time: '23:59', value: 5.1 },
  ]

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-400'
      case 'error':
        return 'text-red-400'
      case 'warning':
        return 'text-yellow-400'
      default:
        return 'text-blue-400'
    }
  }

  const activeAlerts = alerts?.filter((a: any) => a.status === 'active') || []
  const onlineServers = servers?.filter((s: any) => s.status === 'online').length || 0
  const totalServers = servers?.length || 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Monitoring</h1>
        <p className="text-gray-400">Monitor infrastructure health and performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-900/20 rounded-lg">
              <CheckCircle2 className="text-green-400" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-400">Online Servers</p>
              <p className="text-2xl font-bold text-white">{onlineServers}/{totalServers}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-900/20 rounded-lg">
              <AlertTriangle className="text-red-400" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-400">Active Alerts</p>
              <p className="text-2xl font-bold text-white">{activeAlerts.length}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-900/20 rounded-lg">
              <Activity className="text-blue-400" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-400">Avg CPU</p>
              <p className="text-2xl font-bold text-white">64%</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-900/20 rounded-lg">
              <TrendingUp className="text-purple-400" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-400">Avg Memory</p>
              <p className="text-2xl font-bold text-white">6.2 GB</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold text-white mb-4">CPU Usage</h2>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={cpuData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                labelStyle={{ color: '#F3F4F6' }}
              />
              <Area type="monotone" dataKey="value" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold text-white mb-4">Memory Usage</h2>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={memoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                labelStyle={{ color: '#F3F4F6' }}
              />
              <Area type="monotone" dataKey="value" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Alerts */}
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <Bell className="text-red-400" size={24} />
          <h2 className="text-xl font-semibold text-white">Active Alerts</h2>
        </div>
        <div className="space-y-3">
          {alerts?.map((alert: any) => (
            <div key={alert.id} className="flex items-start gap-4 p-4 bg-gray-700/50 rounded-lg">
              <AlertTriangle className={getSeverityColor(alert.severity)} size={24} />
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-sm font-medium text-white">{alert.title}</h3>
                  <span className={`badge ${
                    alert.severity === 'critical' ? 'badge-error' :
                    alert.severity === 'warning' ? 'badge-warning' :
                    'badge-info'
                  }`}>
                    {alert.severity}
                  </span>
                  <span className={`badge ${
                    alert.status === 'active' ? 'badge-error' :
                    alert.status === 'acknowledged' ? 'badge-warning' :
                    'badge-success'
                  }`}>
                    {alert.status}
                  </span>
                </div>
                {alert.description && (
                  <p className="text-sm text-gray-400 mb-2">{alert.description}</p>
                )}
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  {alert.source && <span>Source: {alert.source}</span>}
                  <span>{formatDistanceToNow(new Date(alert.created_at), { addSuffix: true })}</span>
                </div>
              </div>
              <div className="flex gap-2">
                {alert.status === 'active' && (
                  <button
                    onClick={() => acknowledgeMutation.mutate(alert.id)}
                    className="btn btn-secondary text-xs py-1 px-3"
                  >
                    Acknowledge
                  </button>
                )}
                {alert.status !== 'resolved' && (
                  <button
                    onClick={() => resolveMutation.mutate(alert.id)}
                    className="btn btn-primary text-xs py-1 px-3"
                  >
                    Resolve
                  </button>
                )}
              </div>
            </div>
          ))}
          {(!alerts || alerts.length === 0) && (
            <p className="text-sm text-gray-400 text-center py-8">No alerts</p>
          )}
        </div>
      </div>

      {/* Server Health */}
      <div className="card">
        <h2 className="text-xl font-semibold text-white mb-4">Server Health</h2>
        <div className="space-y-3">
          {servers?.map((server: any) => (
            <div key={server.id} className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  server.status === 'online' ? 'bg-green-400' :
                  server.status === 'degraded' ? 'bg-yellow-400' :
                  'bg-red-400'
                }`} />
                <div>
                  <p className="text-sm font-medium text-white">{server.name}</p>
                  <p className="text-xs text-gray-400">{server.hostname}</p>
                </div>
              </div>
              <div className="flex gap-6 text-sm">
                <div className="text-center">
                  <p className="text-gray-400">CPU</p>
                  <p className="text-white font-medium">--</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-400">Memory</p>
                  <p className="text-white font-medium">--</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-400">Disk</p>
                  <p className="text-white font-medium">--</p>
                </div>
              </div>
            </div>
          ))}
          {(!servers || servers.length === 0) && (
            <p className="text-sm text-gray-400 text-center py-8">No servers to monitor</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Monitoring
