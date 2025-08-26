import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from '../../utils/currency';
import { useAppContext } from '../../context/AppContext';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import {
  BarChart3,
  PieChart,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  DollarSign,
  Users,
  Home,
  FileText,
  Clock,
  AlertCircle,
  CheckCircle,
  Target,
  Activity,
  Percent,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Printer,
  Mail,
  Settings,
  X,
  ChevronDown
} from 'lucide-react';

const Reports = () => {
  const { t } = useTranslation();
  const {
    customers,
    units,
    contracts,
    payments,
    documents
  } = useAppContext();

  const [selectedTimeRange, setSelectedTimeRange] = useState('month');
  const [selectedReport, setSelectedReport] = useState('overview');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState('all');
  const [reportData, setReportData] = useState({});

  // Time range options
  const timeRanges = {
    'week': { label: t('reports.lastWeek'), days: 7 },
    'month': { label: t('reports.thisMonth'), days: 30 },
    'quarter': { label: t('reports.thisQuarter'), days: 90 },
    'year': { label: t('reports.thisYear'), days: 365 },
    'custom': { label: t('reports.customRange'), days: null }
  };

  // Report types
  const reportTypes = {
    overview: { label: t('reports.businessOverview'), icon: Activity },
    financial: { label: t('reports.financialReports'), icon: DollarSign },
    occupancy: { label: t('reports.occupancyAnalysis'), icon: Home },
    customer: { label: t('reports.customerAnalytics'), icon: Users },
    payments: { label: t('reports.paymentReports'), icon: CheckCircle },
    contracts: { label: t('reports.contractManagement'), icon: FileText },
    documents: { label: t('reports.documentStatistics'), icon: FileText },
    performance: { label: t('reports.performanceMetrics'), icon: TrendingUp }
  };

  // Calculate comprehensive report data
  useEffect(() => {
    const calculateReportData = () => {
      const now = new Date();
      const timeRange = timeRanges[selectedTimeRange];
      const startDate = timeRange.days ? new Date(now.getTime() - (timeRange.days * 24 * 60 * 60 * 1000)) : new Date(now.getFullYear(), 0, 1);

      // Financial Analytics
      const totalRevenue = payments
        .filter(p => p.status === 'paid')
        .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);

      const monthlyRevenue = payments
        .filter(p => {
          const paymentDate = new Date(p.paymentDate);
          return p.status === 'paid' && paymentDate >= startDate;
        })
        .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);

      const pendingRevenue = payments
        .filter(p => p.status === 'pending' || p.status === 'overdue')
        .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);

      const overdueAmount = payments
        .filter(p => p.status === 'overdue')
        .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);

      // Unit Analytics
      const totalUnits = units.length;
      const occupiedUnits = units.filter(u => u.status === 'occupied').length;
      const availableUnits = units.filter(u => u.status === 'available').length;
      const maintenanceUnits = units.filter(u => u.status === 'maintenance').length;
      const occupancyRate = totalUnits > 0 ? (occupiedUnits / totalUnits) * 100 : 0;

      // Customer Analytics
      const totalCustomers = customers.length;
      const activeContracts = contracts.filter(c => c.status === 'active').length;
      const expiredContracts = contracts.filter(c => c.status === 'expired').length;
      const pendingContracts = contracts.filter(c => c.status === 'pending').length;

      // Contract Expiration Analysis
      const expiringThisMonth = contracts.filter(c => {
        if (!c.end_date) return false;
        const endDate = new Date(c.end_date);
        const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        return endDate <= nextMonth && endDate >= now;
      }).length;

      const expiringNext30Days = contracts.filter(c => {
        if (!c.end_date) return false;
        const endDate = new Date(c.end_date);
        const next30Days = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000));
        return endDate <= next30Days && endDate >= now;
      }).length;

      // Payment Analytics
      const totalPayments = payments.length;
      const paidPayments = payments.filter(p => p.status === 'paid').length;
      const pendingPayments = payments.filter(p => p.status === 'pending').length;
      const overduePayments = payments.filter(p => p.status === 'overdue').length;
      const failedPayments = payments.filter(p => p.status === 'failed').length;
      const paymentSuccessRate = totalPayments > 0 ? (paidPayments / totalPayments) * 100 : 0;

      // Document Analytics
      const totalDocuments = documents.length;
      const contractDocuments = documents.filter(d => d.category === 'contract').length;
      const insuranceDocuments = documents.filter(d => d.category === 'insurance').length;
      const recentUploads = documents.filter(d => {
        const uploadDate = new Date(d.upload_date);
        return uploadDate >= startDate;
      }).length;

      // Unit Size Analytics
      const unitSizeBreakdown = units.reduce((acc, unit) => {
        const size = unit.size;
        acc[size] = (acc[size] || 0) + 1;
        return acc;
      }, {});

      // Floor Analytics
      const floorBreakdown = units.reduce((acc, unit) => {
        const floor = `${t('reports.floor')} ${unit.floor}`;
        acc[floor] = (acc[floor] || 0) + 1;
        return acc;
      }, {});

      // Monthly Revenue Trend (last 6 months)
      const monthlyTrend = [];
      for (let i = 5; i >= 0; i--) {
        const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
        const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);
        
        const monthRevenue = payments
          .filter(p => {
            if (!p.paymentDate) return false;
            const paymentDate = new Date(p.paymentDate);
            return p.status === 'paid' && paymentDate >= monthStart && paymentDate <= monthEnd;
          })
          .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);

        monthlyTrend.push({
          month: monthDate.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
          revenue: monthRevenue,
          payments: payments.filter(p => {
            if (!p.paymentDate) return false;
            const paymentDate = new Date(p.paymentDate);
            return p.status === 'paid' && paymentDate >= monthStart && paymentDate <= monthEnd;
          }).length
        });
      }

      // Customer Acquisition Trend
      const customerTrend = [];
      for (let i = 11; i >= 0; i--) {
        const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
        const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);
        
        const newCustomers = contracts
          .filter(c => {
            const createdDate = new Date(c.created_date || c.start_date);
            return createdDate >= monthStart && createdDate <= monthEnd;
          }).length;

        customerTrend.push({
          month: monthDate.toLocaleDateString('en-US', { month: 'short' }),
          newCustomers
        });
      }

      // Top Performing Units
      const topUnits = units
        .filter(u => u.status === 'occupied')
        .map(unit => ({
          unit_number: unit.unit_number,
          revenue: parseFloat(unit.monthly_rate || 0),
          customer: unit.customer_name,
          floor: unit.floor,
          size: unit.size
        }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 10);

      setReportData({
        financial: {
          totalRevenue,
          monthlyRevenue,
          pendingRevenue,
          overdueAmount,
          averageMonthlyRevenue: monthlyRevenue,
          revenueGrowth: calculateGrowthRate(monthlyTrend),
          monthlyTrend
        },
        occupancy: {
          totalUnits,
          occupiedUnits,
          availableUnits,
          maintenanceUnits,
          occupancyRate,
          unitSizeBreakdown,
          floorBreakdown,
          topUnits
        },
        customer: {
          totalCustomers,
          activeContracts,
          expiredContracts,
          pendingContracts,
          customerTrend,
          averageContractValue: totalRevenue / Math.max(activeContracts, 1)
        },
        payments: {
          totalPayments,
          paidPayments,
          pendingPayments,
          overduePayments,
          failedPayments,
          paymentSuccessRate,
          averagePaymentAmount: totalRevenue / Math.max(paidPayments, 1)
        },
        contracts: {
          total: contracts.length,
          active: activeContracts,
          expired: expiredContracts,
          pending: pendingContracts,
          expiringThisMonth,
          expiringNext30Days,
          autoRenewEnabled: contracts.filter(c => c.auto_renew).length
        },
        documents: {
          totalDocuments,
          contractDocuments,
          insuranceDocuments,
          recentUploads,
          categoryBreakdown: documents.reduce((acc, doc) => {
            acc[doc.category] = (acc[doc.category] || 0) + 1;
            return acc;
          }, {})
        }
      });
    };

    const calculateGrowthRate = (trend) => {
      if (trend.length < 2) return 0;
      const current = trend[trend.length - 1].revenue;
      const previous = trend[trend.length - 2].revenue;
      if (previous === 0) return current > 0 ? 100 : 0;
      return ((current - previous) / previous) * 100;
    };

    calculateReportData();
  }, [customers, units, contracts, payments, documents, selectedTimeRange]);

  // Export report data
  const handleExport = (format) => {
    console.log(`Exporting ${selectedReport} report as ${format}`);
    // In a real app, this would generate and download the report
  };

  // Print report
  const handlePrint = () => {
    window.print();
  };

  // Render metric card
  const MetricCard = ({ title, value, change, icon: Icon, color = 'blue', trend = null }) => (
    <Card className={`bg-gradient-to-br from-${color}-50 to-${color}-100 border-${color}-200`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-xs text-${color}-600 font-medium`}>{title}</p>
            <p className={`text-2xl font-bold text-${color}-900`}>{value}</p>
            {change !== undefined && (
              <div className="flex items-center mt-1">
                {change > 0 ? (
                  <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
                )}
                <span className={`text-xs ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {Math.abs(change).toFixed(1)}%
                </span>
              </div>
            )}
          </div>
          <Icon className={`w-8 h-8 text-${color}-500`} />
        </div>
        {trend && (
          <div className="mt-2">
            <div className="text-xs text-gray-500">{trend}</div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  // Chart color palette
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#F97316', '#84CC16'];

  // Render revenue trend chart
  const RevenueChart = ({ data }) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <BarChart3 className="w-5 h-5 mr-2" />
          {t('reports.monthlyTrend')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip 
              formatter={(value) => [formatCurrency(value), t('reports.revenue')]}
              labelStyle={{ color: '#374151' }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="#3B82F6" 
              strokeWidth={3}
              dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );

  // Render floor occupancy pie chart
  const FloorOccupancyChart = ({ data }) => {
    const chartData = Object.entries(data || {}).map(([key, value]) => ({
      name: key,
      value: value
    }));

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <PieChart className="w-5 h-5 mr-2" />
            {t('reports.unitDistribution')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </RechartsPieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  };

  // Render bar chart for unit sizes
  const UnitSizeChart = ({ data }) => {
    const chartData = Object.entries(data || {}).map(([key, value]) => ({
      size: key,
      count: value
    }));

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            {t('reports.unitsBySize')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="size" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  };

  // Render payment status distribution chart
  const PaymentStatusChart = ({ data }) => {
    const chartData = [
      { name: t('payments.paid'), value: data?.paidPayments || 0, color: '#10B981' },
      { name: t('payments.pending'), value: data?.pendingPayments || 0, color: '#F59E0B' },
      { name: t('payments.overdue'), value: data?.overduePayments || 0, color: '#EF4444' },
      { name: t('payments.failed'), value: data?.failedPayments || 0, color: '#6B7280' }
    ].filter(item => item.value > 0);

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <PieChart className="w-5 h-5 mr-2" />
            {t('reports.paymentStatus')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent, value }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </RechartsPieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  };

  // Render customer acquisition chart
  const CustomerAcquisitionChart = ({ data }) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <BarChart3 className="w-5 h-5 mr-2" />
          {t('reports.customerGrowth')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="newCustomers" fill="#8B5CF6" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );

  // Render overview dashboard
  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          title={t('reports.totalRevenue')}
          value={formatCurrency(reportData.financial?.totalRevenue || 0)}
          change={reportData.financial?.revenueGrowth || 0}
          icon={DollarSign}
          color="green"
        />
        <MetricCard
          title={t('reports.occupancyRate')}
          value={`${reportData.occupancy?.occupancyRate?.toFixed(1) || 0}%`}
          icon={Home}
          color="blue"
          trend={`${reportData.occupancy?.occupiedUnits || 0}/${reportData.occupancy?.totalUnits || 0} ${t('reports.units')}`}
        />
        <MetricCard
          title={t('reports.activeCustomers')}
          value={reportData.customer?.totalCustomers || 0}
          icon={Users}
          color="purple"
          trend={`${reportData.customer?.activeContracts || 0} ${t('reports.activeContracts')}`}
        />
        <MetricCard
          title={t('reports.paymentSuccess')}
          value={`${reportData.payments?.paymentSuccessRate?.toFixed(1) || 0}%`}
          icon={CheckCircle}
          color="emerald"
          trend={`${reportData.payments?.paidPayments || 0} ${t('reports.paidPayments')}`}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart data={reportData.financial?.monthlyTrend || []} />
        <FloorOccupancyChart data={reportData.occupancy?.floorBreakdown || {}} />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('reports.contractsExpiringSoon')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {contracts
                .filter(c => {
                  if (!c.end_date) return false;
                  const endDate = new Date(c.end_date);
                  const next30Days = new Date();
                  next30Days.setDate(next30Days.getDate() + 30);
                  return endDate <= next30Days;
                })
                .slice(0, 5)
                .map(contract => (
                  <div key={contract.id} className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{contract.customer_name}</p>
                      <p className="text-xs text-gray-500">{contract.contract_number} - {contract.unit_number}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-orange-600">
                        {new Date(contract.end_date).toLocaleDateString()}
                      </p>
                      <Badge variant="warning" className="text-xs">
                        {t('reports.expiresSoon')}
                      </Badge>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('reports.topPerformingUnits')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {reportData.occupancy?.topUnits?.slice(0, 5).map(unit => (
                <div key={unit.unit_number} className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{unit.unit_number}</p>
                    <p className="text-xs text-gray-500">{unit.customer} • Floor {unit.floor}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-green-600">
                      {formatCurrency(unit.revenue)}/{t('common.month')}
                    </p>
                    <p className="text-xs text-gray-500">{unit.size} {t('common.ft')}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // Render financial reports
  const renderFinancialReports = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          title={t('reports.totalRevenue')}
          value={formatCurrency(reportData.financial?.totalRevenue || 0)}
          icon={DollarSign}
          color="green"
        />
        <MetricCard
          title={t('reports.monthlyRevenue')}
          value={formatCurrency(reportData.financial?.monthlyRevenue || 0)}
          icon={TrendingUp}
          color="blue"
        />
        <MetricCard
          title={t('reports.pendingRevenue')}
          value={formatCurrency(reportData.financial?.pendingRevenue || 0)}
          icon={Clock}
          color="yellow"
        />
        <MetricCard
          title={t('reports.overdueAmount')}
          value={formatCurrency(reportData.financial?.overdueAmount || 0)}
          icon={AlertCircle}
          color="red"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart data={reportData.financial?.monthlyTrend || []} />
        <PaymentStatusChart data={reportData.payments || {}} />
      </div>
    </div>
  );

  // Render occupancy reports
  const renderOccupancyReports = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          title={t('reports.totalUnits')}
          value={reportData.occupancy?.totalUnits || 0}
          icon={Home}
          color="blue"
        />
        <MetricCard
          title={t('reports.occupiedUnits')}
          value={reportData.occupancy?.occupiedUnits || 0}
          icon={CheckCircle}
          color="green"
        />
        <MetricCard
          title={t('reports.availableUnits')}
          value={reportData.occupancy?.availableUnits || 0}
          icon={Target}
          color="purple"
        />
        <MetricCard
          title={t('reports.occupancyRate')}
          value={`${reportData.occupancy?.occupancyRate?.toFixed(1) || 0}%`}
          icon={Percent}
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FloorOccupancyChart data={reportData.occupancy?.floorBreakdown || {}} />
        <UnitSizeChart data={reportData.occupancy?.unitSizeBreakdown || {}} />
      </div>
    </div>
  );

  // Render current report based on selection
  const renderCurrentReport = () => {
    switch (selectedReport) {
      case 'overview':
        return renderOverview();
      case 'financial':
        return renderFinancialReports();
      case 'occupancy':
        return renderOccupancyReports();
      case 'customer':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <MetricCard
                title={t('reports.totalCustomers')}
                value={reportData.customer?.totalCustomers || 0}
                icon={Users}
                color="blue"
              />
              <MetricCard
                title={t('reports.activeContracts')}
                value={reportData.customer?.activeContracts || 0}
                icon={FileText}
                color="green"
              />
              <MetricCard
                title={t('reports.avgContractValue')}
                value={formatCurrency(reportData.customer?.averageContractValue || 0)}
                icon={DollarSign}
                color="purple"
              />
              <MetricCard
                title={t('reports.pendingContracts')}
                value={reportData.customer?.pendingContracts || 0}
                icon={Clock}
                color="yellow"
              />
            </div>
            <CustomerAcquisitionChart data={reportData.customer?.customerTrend || []} />
          </div>
        );
      default:
        return renderOverview();
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold gradient-text mb-2">{t('reports.title')}</h1>
        <p className="text-gray-600">{t('reports.subtitle')}</p>
      </div>

      {/* Controls */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Report Type Selector */}
          <select
            value={selectedReport}
            onChange={(e) => setSelectedReport(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {Object.entries(reportTypes).map(([key, type]) => (
              <option key={key} value={key}>
                {type.label}
              </option>
            ))}
          </select>

          {/* Time Range Selector */}
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {Object.entries(timeRanges).map(([key, range]) => (
              <option key={key} value={key}>
                {range.label}
              </option>
            ))}
          </select>

          {/* Refresh Button */}
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            {t('common.refresh')}
          </Button>
        </div>

        {/* Export Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => handleExport('pdf')}
          >
            <Download className="w-4 h-4 mr-2" />
            {t('reports.exportPDF')}
          </Button>
          <Button
            variant="outline"
            onClick={() => handleExport('excel')}
          >
            <Download className="w-4 h-4 mr-2" />
            {t('reports.exportExcel')}
          </Button>
          <Button
            variant="outline"
            onClick={handlePrint}
          >
            <Printer className="w-4 h-4 mr-2" />
            {t('reports.print')}
          </Button>
        </div>
      </div>

      {/* Report Content */}
      <motion.div
        key={selectedReport}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {renderCurrentReport()}
      </motion.div>

      {/* Report Footer */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div>
            {t('reports.generatedOn')} {new Date().toLocaleDateString()} {t('reports.at')} {new Date().toLocaleTimeString()}
          </div>
          <div>
            {t('reports.reportPeriod')}: {timeRanges[selectedTimeRange].label}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;