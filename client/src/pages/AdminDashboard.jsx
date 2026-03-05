import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  HiUsers,
  HiChat,
  HiShieldCheck,
  HiSearch,
  HiTrash,
  HiRefresh,
  HiChevronLeft,
  HiChevronRight,
  HiExclamationCircle,
} from 'react-icons/hi';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';

const COLORS = [
  '#16a34a', '#0ea5e9', '#f59e0b', '#ef4444', '#8b5cf6',
  '#ec4899', '#14b8a6', '#f97316', '#6366f1', '#84cc16',
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: 'easeOut' },
  }),
};

/* ── Stat Card ──────────────────────────────────────────────── */
function StatCard({ icon: Icon, label, value, sub, color, index }) {
  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-dark-border p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        {sub && <p className="text-xs text-green-600 dark:text-green-400 mt-0.5">{sub}</p>}
      </div>
    </motion.div>
  );
}

/* ── Section Wrapper ────────────────────────────────────────── */
function Section({ title, children, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-dark-border p-6 shadow-sm ${className}`}
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
      {children}
    </motion.div>
  );
}

/* ── Custom Tooltip ─────────────────────────────────────────── */
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-lg p-3 shadow-lg text-sm">
      <p className="font-medium text-gray-900 dark:text-white mb-1">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} style={{ color: entry.color }}>
          {entry.name}: <span className="font-semibold">{entry.value}</span>
        </p>
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   ADMIN DASHBOARD
   ════════════════════════════════════════════════════════════════ */
export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [diseaseData, setDiseaseData] = useState(null);
  const [users, setUsers] = useState({ users: [], page: 1, total: 0, totalPages: 1 });
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [userPage, setUserPage] = useState(1);
  const [activeTab, setActiveTab] = useState('overview');

  /* ── Fetch helpers ──────────────────────────────────────── */
  const fetchStats = useCallback(async () => {
    try {
      const { data } = await api.get('/admin/stats');
      setStats(data);
    } catch (err) {
      console.error('Stats error', err);
    }
  }, []);

  const fetchDiseases = useCallback(async () => {
    try {
      const { data } = await api.get('/admin/analytics/diseases');
      setDiseaseData(data);
    } catch (err) {
      console.error('Disease error', err);
    }
  }, []);

  const fetchUsers = useCallback(async (page = 1, q = '') => {
    try {
      const { data } = await api.get('/admin/users', { params: { page, limit: 10, search: q } });
      setUsers(data);
    } catch (err) {
      console.error('Users error', err);
    }
  }, []);

  const fetchActivity = useCallback(async () => {
    try {
      const { data } = await api.get('/admin/activity', { params: { limit: 40 } });
      setActivity(data);
    } catch (err) {
      console.error('Activity error', err);
    }
  }, []);

  /* ── Initial load ───────────────────────────────────────── */
  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/dashboard', { replace: true });
      return;
    }
    (async () => {
      setLoading(true);
      await Promise.all([
        fetchStats(),
        fetchDiseases(),
        fetchUsers(1, ''),
        fetchActivity(),
      ]);
      setLoading(false);
    })();
  }, [user, navigate, fetchStats, fetchDiseases, fetchUsers, fetchActivity]);

  /* ── User search / pagination ───────────────────────────── */
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers(userPage, search);
    }, 350);
    return () => clearTimeout(timer);
  }, [search, userPage, fetchUsers]);

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      fetchUsers(userPage, search);
      fetchStats();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const refreshAll = async () => {
    setLoading(true);
    await Promise.all([
      fetchStats(),
      fetchDiseases(),
      fetchUsers(userPage, search),
      fetchActivity(),
    ]);
    setLoading(false);
  };

  /* ── Render ─────────────────────────────────────────────── */
  if (loading && !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const tabs = [
    { key: 'overview', label: '📊 Overview' },
    { key: 'diseases', label: '🔬 Diseases' },
    { key: 'users', label: '👥 Users' },
    { key: 'activity', label: '📋 Activity' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg pt-4 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span className="bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
                Admin Dashboard
              </span>
              🛡️
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Platform overview, analytics &amp; management — all data is live from the database
            </p>
          </div>
          <button
            onClick={refreshAll}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors disabled:opacity-50"
          >
            <HiRefresh className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh Data
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border p-1 mb-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.key
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-border'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── OVERVIEW TAB ─────────────────────────────────── */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Summary Cards — only real-time data from the database */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard
                icon={HiUsers}
                label="Farmers Registered"
                value={stats?.totalUsers ?? 0}
                sub={stats?.newUsersLast7Days ? `+${stats.newUsersLast7Days} this week` : null}
                color="bg-blue-500"
                index={0}
              />
              <StatCard
                icon={HiShieldCheck}
                label="Disease Predictions"
                value={stats?.totalDetections ?? 0}
                color="bg-amber-500"
                index={1}
              />
              <StatCard
                icon={HiChat}
                label="AI Chatbot Queries"
                value={stats?.totalChats ?? 0}
                color="bg-purple-500"
                index={2}
              />
            </div>

            {/* Disease Detections Overview */}
            <Section title="🔬 Most Frequent Disease Detections">
              {diseaseData?.diseaseFrequency?.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie
                        data={diseaseData.diseaseFrequency.slice(0, 8)}
                        dataKey="count"
                        nameKey="disease"
                        cx="50%"
                        cy="50%"
                        outerRadius={95}
                        label={({ disease, percent }) =>
                          `${disease?.substring(0, 14)}${disease?.length > 14 ? '…' : ''} ${(percent * 100).toFixed(0)}%`
                        }
                        labelLine={false}
                      >
                        {diseaseData.diseaseFrequency.slice(0, 8).map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-2 self-center">
                    {diseaseData.diseaseFrequency.slice(0, 10).map((d, i) => (
                      <div key={i} className="flex items-center justify-between text-sm px-2">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                          <span className="text-gray-700 dark:text-gray-300 truncate max-w-[200px]">{d.disease}</span>
                        </div>
                        <span className="font-semibold text-gray-900 dark:text-white">{d.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <EmptyState message="No disease detection data yet — use Disease Prediction to generate data" />
              )}
            </Section>

            {/* Recent Activity Preview */}
            <Section title="📋 Recent Platform Activity (Latest 10)">
              {activity.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                  {activity.slice(0, 10).map((item, i) => (
                    <ActivityItem key={`${item.type}-${item.id}-${i}`} item={item} />
                  ))}
                </div>
              ) : (
                <EmptyState message="No recent activity" />
              )}
            </Section>
          </div>
        )}

        {/* ── DISEASES TAB ──────────────────────────────── */}
        {activeTab === 'diseases' && (
          <div className="space-y-6">
            {/* Disease Frequency Chart + Ranked List */}
            <Section title="🦠 Most Frequently Detected Crop Diseases">
              {diseaseData?.diseaseFrequency?.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={diseaseData.diseaseFrequency.slice(0, 10)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="disease" tick={{ fontSize: 10 }} angle={-20} textAnchor="end" height={60} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip content={<ChartTooltip />} />
                      <Bar dataKey="count" radius={[6, 6, 0, 0]} name="Detections">
                        {diseaseData.diseaseFrequency.slice(0, 10).map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                  {/* Ranked list */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Ranked by Frequency</h4>
                    {diseaseData.diseaseFrequency.map((d, i) => (
                      <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-border/30">
                        <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }}>
                          {i + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{d.disease}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-bold text-gray-900 dark:text-white">{d.count}</p>
                          <p className="text-xs text-gray-500">avg {(d.avg_confidence * 100).toFixed(1)}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <EmptyState message="No disease data available" />
              )}
            </Section>

            {/* Detection Trend */}
            <Section title="📈 Disease Detection Trend (Last 12 Months)">
              {diseaseData?.detectionTrend?.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={diseaseData.detectionTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip content={<ChartTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="#ef4444"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      name="Detections"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <EmptyState message="No detection trend data" />
              )}
            </Section>

            {/* Full table */}
            <Section title="📊 Disease Frequency Breakdown">
              {diseaseData?.diseaseFrequency?.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-dark-border">
                        <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">#</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">Disease</th>
                        <th className="text-right py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">Detections</th>
                        <th className="text-right py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">Avg Confidence</th>
                      </tr>
                    </thead>
                    <tbody>
                      {diseaseData.diseaseFrequency.map((d, i) => (
                        <tr key={i} className="border-b border-gray-100 dark:border-dark-border/50 hover:bg-gray-50 dark:hover:bg-dark-border/30">
                          <td className="py-2.5 px-4 text-gray-500">{i + 1}</td>
                          <td className="py-2.5 px-4 text-gray-800 dark:text-gray-200 font-medium">{d.disease}</td>
                          <td className="py-2.5 px-4 text-right font-bold text-gray-900 dark:text-white">{d.count}</td>
                          <td className="py-2.5 px-4 text-right">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              d.avg_confidence >= 0.8
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                : d.avg_confidence >= 0.5
                                ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                            }`}>
                              {(d.avg_confidence * 100).toFixed(1)}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <EmptyState message="No disease data available" />
              )}
            </Section>
          </div>
        )}

        {/* ── USERS TAB — Task 8 ───────────────────────────── */}
        {activeTab === 'users' && (
          <Section title="👥 User Management Panel">
            {/* Search */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="relative flex-1">
                <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or email…"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setUserPage(1); }}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-bg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-white"
                />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 self-center whitespace-nowrap">
                {users.total} user{users.total !== 1 ? 's' : ''} total
              </p>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-dark-border">
                    <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">Email</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-gray-400 hidden sm:table-cell">Phone</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">Role</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-gray-400 hidden md:table-cell">Registration Date</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.users.length > 0 ? (
                    users.users.map((u) => (
                      <tr key={u.id} className="border-b border-gray-100 dark:border-dark-border/50 hover:bg-gray-50 dark:hover:bg-dark-border/30">
                        <td className="py-2.5 px-4 font-medium text-gray-900 dark:text-white">{u.full_name}</td>
                        <td className="py-2.5 px-4 text-gray-600 dark:text-gray-300">{u.email}</td>
                        <td className="py-2.5 px-4 text-gray-600 dark:text-gray-300 hidden sm:table-cell">{u.phone}</td>
                        <td className="py-2.5 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            u.role === 'admin'
                              ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                              : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          }`}>
                            {u.role || 'farmer'}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-gray-500 dark:text-gray-400 hidden md:table-cell">
                          {new Date(u.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-2.5 px-4 text-right">
                          {u.role !== 'admin' ? (
                            <button
                              onClick={() => handleDeleteUser(u.id)}
                              className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                              title="Delete user"
                            >
                              <HiTrash className="w-4 h-4" />
                            </button>
                          ) : (
                            <span className="text-xs text-gray-400">—</span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-gray-400">No users found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {users.totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Page {users.page} of {users.totalPages}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setUserPage((p) => Math.max(1, p - 1))}
                    disabled={userPage <= 1}
                    className="p-2 rounded-lg border border-gray-200 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-border disabled:opacity-40 transition-colors"
                  >
                    <HiChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setUserPage((p) => Math.min(users.totalPages, p + 1))}
                    disabled={userPage >= users.totalPages}
                    className="p-2 rounded-lg border border-gray-200 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-border disabled:opacity-40 transition-colors"
                  >
                    <HiChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </Section>
        )}

        {/* ── ACTIVITY TAB — Task 9 ────────────────────────── */}
        {activeTab === 'activity' && (
          <Section title="📋 Platform Activity Monitor (Recent Logins, Predictions & Queries)">
            {activity.length > 0 ? (
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                {activity.map((item, i) => (
                  <ActivityItem key={`${item.type}-${item.id}-${i}`} item={item} />
                ))}
              </div>
            ) : (
              <EmptyState message="No activity recorded yet" />
            )}
          </Section>
        )}
      </div>
    </div>
  );
}

/* ── Activity Item ──────────────────────────────────────────── */
function ActivityItem({ item }) {
  const typeConfig = {
    chat: {
      icon: HiChat,
      color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
      label: 'Chatbot Query',
    },
    detection: {
      icon: HiShieldCheck,
      color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
      label: 'Disease Detection',
    },
    registration: {
      icon: HiUsers,
      color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
      label: 'New Registration',
    },
  };

  const config = typeConfig[item.type] || typeConfig.registration;
  const Icon = config.icon;

  return (
    <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-border/30 transition-colors">
      <div className={`p-2 rounded-lg shrink-0 ${config.color}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 dark:bg-dark-border text-gray-600 dark:text-gray-400">
            {config.label}
          </span>
          <span className="text-xs text-gray-400">
            {new Date(item.created_at).toLocaleString()}
          </span>
        </div>
        <p className="text-sm text-gray-800 dark:text-gray-200 mt-1 truncate">
          {item.type === 'chat' && (
            <><span className="font-medium">{item.user_name || 'User'}</span> asked: "{item.question}"</>
          )}
          {item.type === 'detection' && (
            <><span className="font-medium">{item.user_name || 'User'}</span> detected <span className="font-medium text-amber-600 dark:text-amber-400">{item.detected_disease}</span> ({(item.confidence_score * 100).toFixed(1)}%)</>
          )}
          {item.type === 'registration' && (
            <><span className="font-medium">{item.user_name}</span> ({item.email}) joined the platform</>
          )}
        </p>
      </div>
    </div>
  );
}

/* ── Empty State ────────────────────────────────────────────── */
function EmptyState({ message }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-gray-400">
      <HiExclamationCircle className="w-10 h-10 mb-2" />
      <p className="text-sm">{message}</p>
    </div>
  );
}
