import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import {
  FolderKanban, MessageSquareQuote, Mail, ArrowUpRight,
  FolderPlus, MessageSquarePlus,
} from 'lucide-react'
import api from '@/lib/api'
import StatCard from '@/components/ui/StatCard'
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import EmptyState from '@/components/ui/EmptyState'
import { timeAgo, formatDate } from '@/lib/utils'

export default function Overview() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: async () => (await api.get('/dashboard/stats')).data.data,
  })

  const { data: trend } = useQuery({
    queryKey: ['dashboard', 'contacts-trend'],
    queryFn: async () => (await api.get('/dashboard/contacts-trend', { params: { days: 30 } })).data.data,
  })

  const { data: recentContacts, isLoading: contactsLoading } = useQuery({
    queryKey: ['dashboard', 'recent-contacts'],
    queryFn: async () => (await api.get('/dashboard/recent-contacts', { params: { limit: 5 } })).data.data,
  })

  const quickActions = [
    { label: 'New Project', to: '/projects/create', icon: FolderPlus },
    { label: 'Add Testimonial', to: '/testimonials', icon: MessageSquarePlus },
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-900 dark:text-white sm:text-2xl">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Here's what's happening across your website.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard loading={statsLoading} label="Total Projects" value={stats?.projects.total || 0} icon={FolderKanban} tone="info" />
        <StatCard loading={statsLoading} label="Pending Testimonials" value={stats?.testimonials.pending || 0} icon={MessageSquareQuote} tone="warning" />
        <StatCard loading={statsLoading} label="New Messages" value={stats?.contacts.new || 0} icon={Mail} tone="danger" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Contacts trend chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Contact submissions — last 30 days</CardTitle>
          </CardHeader>
          <CardContent className="pl-2 pr-4">
            {!trend ? (
              <div className="skeleton h-64 w-full rounded-xl" />
            ) : trend.length === 0 ? (
              <EmptyState title="No submissions yet" description="New contact-form leads will appear here." />
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={trend}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#5b5ff0" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#5b5ff0" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={(d) => formatDate(d, { year: undefined })} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} allowDecimals={false} width={30} />
                  <Tooltip
                    contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb', fontSize: 12 }}
                    labelFormatter={(d) => formatDate(d)}
                  />
                  <Area type="monotone" dataKey="count" stroke="#5b5ff0" strokeWidth={2} fill="url(#colorCount)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Quick actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                to={action.to}
                className="flex flex-col items-start gap-3 rounded-xl border border-slate-100 p-4 transition-colors hover:border-brand-200 hover:bg-brand-50/50 dark:border-slate-800 dark:hover:border-brand-500/30 dark:hover:bg-brand-500/5"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400">
                  <action.icon className="h-4 w-4" />
                </span>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{action.label}</span>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent messages */}
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Messages</CardTitle>
            <Link to="/contact" className="flex items-center gap-1 text-xs font-medium text-brand-600 dark:text-brand-400">
              View all <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {contactsLoading ? (
              <div className="space-y-4 p-6">
                {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-12 rounded-lg" />)}
              </div>
            ) : !recentContacts?.length ? (
              <EmptyState title="No messages yet" description="Contact form submissions will show up here." />
            ) : (
              <div className="grid grid-cols-1 divide-y divide-slate-100 sm:grid-cols-2 sm:divide-y-0 dark:divide-slate-800">
                {recentContacts.map((c) => (
                  <Link key={c._id} to="/contact" className="flex items-start justify-between gap-3 border-slate-100 px-6 py-4 hover:bg-slate-50 sm:border-b dark:border-slate-800 dark:hover:bg-slate-800/50">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-200">{c.name}</p>
                      <p className="truncate text-xs text-slate-500">{c.message || c.service || c.email}</p>
                    </div>
                    <span className="shrink-0 text-xs text-slate-400">{timeAgo(c.createdAt)}</span>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}