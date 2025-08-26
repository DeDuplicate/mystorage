import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    'week': { label: 'Last 7 Days', days: 7 },
    'month': { label: 'This Month', days: 30 },
    'quarter': { label: 'This Quarter', days: 90 },
    'year': { label: 'This Year', days: 365 },
    'custom': { label: 'Custom Range', days: null }
  };

  // Report types
  const reportTypes = {
    overview: { label: 'Business Overview', icon: Activity },
    financial: { label: 'Financial Reports', icon: DollarSign },
    occupancy: { label: 'Occupancy Analysis', icon: Home },
    customer: { label: 'Customer Analytics', icon: Users },
    payments: { label: 'Payment Reports', icon: CheckCircle },
    contracts: { label: 'Contract Management', icon: FileText },
    documents: { label: 'Document Statistics', icon: FileText },
    performance: { label: 'Performance Metrics', icon: TrendingUp }
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
        const floor = `Floor ${unit.floor}`;
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
          Monthly Revenue Trend
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip 
              formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
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
            Unit Distribution by Floor
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
            Units by Size
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
      { name: 'Paid', value: data?.paidPayments || 0, color: '#10B981' },
      { name: 'Pending', value: data?.pendingPayments || 0, color: '#F59E0B' },
      { name: 'Overdue', value: data?.overduePayments || 0, color: '#EF4444' },
      { name: 'Failed', value: data?.failedPayments || 0, color: '#6B7280' }
    ].filter(item => item.value > 0);

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <PieChart className="w-5 h-5 mr-2" />
            Payment Status Distribution
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
          Customer Acquisition Trend
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
          title="Total Revenue"
          value={`$${reportData.financial?.totalRevenue?.toLocaleString() || 0}`}
          change={reportData.financial?.revenueGrowth || 0}
          icon={DollarSign}
          color="green"
        />
        <MetricCard
          title="Occupancy Rate"
          value={`${reportData.occupancy?.occupancyRate?.toFixed(1) || 0}%`}
          icon={Home}
          color="blue"
          trend={`${reportData.occupancy?.occupiedUnits || 0}/${reportData.occupancy?.totalUnits || 0} units`}
        />
        <MetricCard
          title="Active Customers"
          value={reportData.customer?.totalCustomers || 0}
          icon={Users}
          color="purple"
          trend={`${reportData.customer?.activeContracts || 0} active contracts`}
        />
        <MetricCard
          title="Payment Success"
          value={`${reportData.payments?.paymentSuccessRate?.toFixed(1) || 0}%`}
          icon={CheckCircle}
          color="emerald"
          trend={`${reportData.payments?.paidPayments || 0} paid payments`}
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
            <CardTitle>Contracts Expiring Soon</CardTitle>
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
                        Expires Soon
                      </Badge>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Performing Units</CardTitle>
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
                      ${unit.revenue}/mo
                    </p>
                    <p className="text-xs text-gray-500">{unit.size} ft</p>
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
          title="Total Revenue"
          value={`$${reportData.financial?.totalRevenue?.toLocaleString() || 0}`}
          icon={DollarSign}
          color="green"
        />
        <MetricCard
          title="Monthly Revenue"
          value={`$${reportData.financial?.monthlyRevenue?.toLocaleString() || 0}`}
          icon={TrendingUp}
          color="blue"
        />
        <MetricCard
          title="Pending Revenue"
          value={`$${reportData.financial?.pendingRevenue?.toLocaleString() || 0}`}
          icon={Clock}
          color="yellow"
        />
        <MetricCard
          title="Overdue Amount"
          value={`$${reportData.financial?.overdueAmount?.toLocaleString() || 0}`}
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
          title="Total Units"
          value={reportData.occupancy?.totalUnits || 0}
          icon={Home}
          color="blue"
        />
        <MetricCard
          title="Occupied Units"
          value={reportData.occupancy?.occupiedUnits || 0}
          icon={CheckCircle}
          color="green"
        />
        <MetricCard
          title="Available Units"
          value={reportData.occupancy?.availableUnits || 0}
          icon={Target}
          color="purple"
        />
        <MetricCard
          title="Occupancy Rate"
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
                title="Total Customers"
                value={reportData.customer?.totalCustomers || 0}
                icon={Users}
                color="blue"
              />
              <MetricCard
                title="Active Contracts"
                value={reportData.customer?.activeContracts || 0}
                icon={FileText}
                color="green"
              />
              <MetricCard
                title="Avg Contract Value"
                value={`$${reportData.customer?.averageContractValue?.toFixed(0) || 0}`}
                icon={DollarSign}
                color="purple"
              />
              <MetricCard
                title="Pending Contracts"
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
        <h1 className="text-4xl font-bold gradient-text mb-2">Reports & Analytics</h1>
        <p className="text-gray-600">Comprehensive business insights and performance metrics</p>
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
            Refresh
          </Button>
        </div>

        {/* Export Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => handleExport('pdf')}
          >
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
          <Button
            variant="outline"
            onClick={() => handleExport('excel')}
          >
            <Download className="w-4 h-4 mr-2" />
            Export Excel
          </Button>
          <Button
            variant="outline"
            onClick={handlePrint}
          >
            <Printer className="w-4 h-4 mr-2" />
            Print
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
            Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
          </div>
          <div>
            Report period: {timeRanges[selectedTimeRange].label}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;