import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { formatCurrency, getCurrencySymbol } from '../../utils/currency';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import Badge from '../ui/Badge';
import {
  Package,
  Users,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Calendar,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const Dashboard = () => {
  const { t } = useTranslation();
  
  // Sample data for charts
  const revenueData = [
    { month: 'Jan', revenue: 45000 },
    { month: 'Feb', revenue: 52000 },
    { month: 'Mar', revenue: 48000 },
    { month: 'Apr', revenue: 61000 },
    { month: 'May', revenue: 55000 },
    { month: 'Jun', revenue: 67000 },
  ];

  const occupancyData = [
    { name: t('units.available'), value: 35, color: '#10b981' },
    { name: t('units.occupied'), value: 145, color: '#3b82f6' },
    { name: t('units.maintenance'), value: 8, color: '#f59e0b' },
    { name: t('units.reserved'), value: 12, color: '#8b5cf6' },
  ];

  const metrics = [
    {
      title: t('dashboard.totalRevenue'),
      value: formatCurrency(67420),
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'from-green-50 to-emerald-50'
    },
    {
      title: t('dashboard.totalUnits'),
      value: '200',
      subtitle: '145 ' + t('units.occupied'),
      occupancy: '72.5%',
      icon: Package,
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'from-blue-50 to-indigo-50'
    },
    {
      title: t('dashboard.activeCustomers'),
      value: '145',
      change: '+8',
      trend: 'up',
      icon: Users,
      color: 'from-purple-500 to-pink-600',
      bgColor: 'from-purple-50 to-pink-50'
    },
    {
      title: t('dashboard.overduePayments'),
      value: '12',
      subtitle: formatCurrency(8450) + ' ' + t('payments.pending').toLowerCase(),
      alert: true,
      icon: AlertCircle,
      color: 'from-orange-500 to-red-600',
      bgColor: 'from-orange-50 to-red-50'
    },
  ];

  const recentActivities = [
    { 
      id: 1, 
      type: 'payment', 
      messageKey: 'dashboard.activities.paymentReceived',
      messageData: { customer: 'John Doe' },
      amount: formatCurrency(250), 
      time: t('common.hoursAgo', { count: 2 }), 
      status: 'success' 
    },
    { 
      id: 2, 
      type: 'contract', 
      messageKey: 'dashboard.activities.contractSigned',
      messageData: { unit: 'A-105' },
      customer: 'Jane Smith', 
      time: t('common.hoursAgo', { count: 4 }), 
      status: 'new' 
    },
    { 
      id: 3, 
      type: 'alert', 
      messageKey: 'dashboard.activities.paymentOverdue',
      messageData: { unit: 'B-203' },
      customer: 'Mike Johnson', 
      time: t('common.hoursAgo', { count: 6 }), 
      status: 'warning' 
    },
    { 
      id: 4, 
      type: 'maintenance', 
      messageKey: 'dashboard.activities.maintenanceCompleted',
      messageData: { unit: 'C-101' },
      time: t('common.daysAgo', { count: 1 }), 
      status: 'info' 
    },
  ];

  const upcomingExpirations = [
    { id: 1, unit: 'A-102', customer: 'Robert Brown', date: '2024-01-15', daysLeft: 5 },
    { id: 2, unit: 'B-205', customer: 'Sarah Wilson', date: '2024-01-18', daysLeft: 8 },
    { id: 3, unit: 'C-303', customer: 'David Lee', date: '2024-01-20', daysLeft: 10 },
    { id: 4, unit: 'D-401', customer: 'Emily Davis', date: '2024-01-25', daysLeft: 15 },
  ];

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{t('dashboard.title')}</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{t('dashboard.subtitle')}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="success" size="lg">
            <CheckCircle className="w-4 h-4 mr-1" />
            {t('common.systemOnline') || 'System Online'}
          </Badge>
        </div>
      </motion.div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="relative overflow-hidden">
              <div className={`absolute inset-0 bg-gradient-to-br ${metric.bgColor} opacity-50`} />
              <CardContent className="relative p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{metric.title}</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{metric.value}</p>
                    {metric.subtitle && (
                      <p className="text-sm text-gray-600 dark:text-gray-300">{metric.subtitle}</p>
                    )}
                    {metric.occupancy && (
                      <Badge variant="primary">{metric.occupancy} {t('dashboard.occupancyRate')}</Badge>
                    )}
                    {metric.change && (
                      <div className="flex items-center space-x-1">
                        {metric.trend === 'up' ? (
                          <ArrowUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                        ) : (
                          <ArrowDown className="w-4 h-4 text-red-600 dark:text-red-400" />
                        )}
                        <span className={`text-sm font-medium ${
                          metric.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                        }`}>
                          {metric.change}
                        </span>
                      </div>
                    )}
                    {metric.alert && (
                      <Badge variant="danger" pulse>{t('notifications.actionRequired')}</Badge>
                    )}
                  </div>
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${metric.color} shadow-lg`}>
                    <metric.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{t('reports.monthlyTrend')}</span>
                <Badge variant="success">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +12.5%
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#0ea5e9"
                    strokeWidth={2}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Occupancy Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>{t('reports.unitDistribution')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={occupancyData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {occupancyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Activity and Expirations Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>{t('dashboard.recentActivity')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.status === 'success' ? 'bg-green-500' :
                    activity.status === 'warning' ? 'bg-yellow-500' :
                    activity.status === 'new' ? 'bg-blue-500' : 'bg-gray-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {t(activity.messageKey, activity.messageData)}
                    </p>
                    {activity.customer && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">{activity.customer}</p>
                    )}
                    {activity.amount && (
                      <p className="text-sm font-semibold text-green-600 dark:text-green-400">{activity.amount}</p>
                    )}
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Upcoming Expirations */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-baseline space-x-2">
                <span>{t('dashboard.expiringContracts')}</span>
                <Badge variant="warning">
                  <span className="mx-1">4</span>
                  {t('common.soon') || 'Soon'}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingExpirations.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/30 dark:to-red-900/30 border border-orange-200 dark:border-orange-700/50">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-gray-900 dark:text-gray-100">{t('units.unitNumber')} {item.unit}</span>
                        <Badge variant={item.daysLeft <= 7 ? 'danger' : 'warning'} size="sm">
                          {item.daysLeft} {t('common.days') || 'days'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{item.customer}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center mt-1">
                        <Calendar className="w-3 h-3 mr-1" />
                        {item.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;