import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../context/AppContext';
import { formatCurrency, getCurrencySymbol } from '../../utils/currency';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import {
  DollarSign,
  Search,
  Filter,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  Download,
  CreditCard,
  User,
  Home,
  Plus,
  X,
  Save,
  Edit2,
  Trash2
} from 'lucide-react';

const Payments = () => {
  const { t } = useTranslation();
  const {
    payments,
    setPayments,
    customers,
    units,
    contracts,
    getCustomerById,
    getUnitById,
    addPayment,
    updatePayment
  } = useAppContext();
  
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [dateRange, setDateRange] = useState('month');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [formData, setFormData] = useState({
    customer_id: '',
    unit_id: '',
    contract_id: '',
    amount: 0,
    status: 'pending',
    paymentDate: '',
    dueDate: '',
    method: 'Credit Card',
    notes: ''
  });

  // Initialize filtered payments
  useEffect(() => {
    setFilteredPayments(payments);
  }, [payments]);

  // Filter payments based on status
  useEffect(() => {
    let filtered = payments;
    
    if (filterStatus !== 'all') {
      filtered = filtered.filter(payment => payment.status === filterStatus);
    }
    
    setFilteredPayments(filtered);
  }, [payments, filterStatus]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-fill customer info when customer is selected
    if (name === 'customer_id' && value) {
      const customer = getCustomerById(parseInt(value));
      if (customer) {
        // Find customer's active contract and unit
        const customerContract = contracts.find(c => c.customer_id === parseInt(value) && c.status === 'active');
        if (customerContract) {
          const unit = getUnitById(customerContract.unit_id);
          setFormData(prev => ({
            ...prev,
            unit_id: customerContract.unit_id || '',
            contract_id: customerContract.id,
            amount: customerContract.monthly_rate || 0,
            notes: t('payments.monthlyPaymentFor', { unit: unit?.unit_number || t('payments.unit') })
          }));
        }
      }
    }

    // Auto-fill unit info when unit is selected directly
    if (name === 'unit_id' && value) {
      const unit = getUnitById(parseInt(value));
      if (unit && unit.customer_id) {
        const contract = contracts.find(c => c.unit_id === parseInt(value) && c.status === 'active');
        setFormData(prev => ({
          ...prev,
          customer_id: unit.customer_id,
          contract_id: contract?.id || '',
          amount: unit.monthly_rate || 0,
          notes: t('payments.monthlyPaymentFor', { unit: unit.unit_number })
        }));
      }
    }
  };

  // Add or update payment
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const customer = getCustomerById(parseInt(formData.customer_id));
    const unit = getUnitById(parseInt(formData.unit_id));
    const contract = contracts.find(c => c.id === parseInt(formData.contract_id));
    
    const paymentData = {
      customer_id: parseInt(formData.customer_id),
      customer: customer?.name || '',
      customerPhone: customer?.phone || '',
      unit_id: parseInt(formData.unit_id),
      unit: unit?.unit_number || '',
      contract_id: parseInt(formData.contract_id),
      amount: parseFloat(formData.amount),
      status: formData.status,
      paymentDate: formData.status === 'paid' ? formData.paymentDate : null,
      dueDate: formData.dueDate,
      rentalEnd: contract?.end_date || '',
      method: formData.method,
      notes: formData.notes
    };
    
    if (editingPayment) {
      // Update existing payment
      updatePayment(editingPayment.id, paymentData);
    } else {
      // Add new payment
      const newPayment = {
        ...paymentData,
        id: `PAY-${String(payments.length + 1).padStart(3, '0')}`
      };
      addPayment(newPayment);
    }
    
    // Reset form
    setShowAddModal(false);
    setEditingPayment(null);
    setFormData({
      customer_id: '',
      unit_id: '',
      contract_id: '',
      amount: 0,
      status: 'pending',
      paymentDate: '',
      dueDate: '',
      method: 'Credit Card',
      notes: ''
    });
  };

  // Edit payment
  const handleEdit = (payment) => {
    setEditingPayment(payment);
    setFormData({
      customer_id: payment.customer_id?.toString() || '',
      unit_id: payment.unit_id?.toString() || '',
      contract_id: payment.contract_id?.toString() || '',
      amount: payment.amount,
      status: payment.status,
      paymentDate: payment.paymentDate || '',
      dueDate: payment.dueDate,
      method: payment.method || 'Credit Card',
      notes: payment.notes || ''
    });
    setShowAddModal(true);
  };

  // Delete payment
  const handleDelete = (paymentId) => {
    if (window.confirm(t('payments.confirmDelete'))) {
      setPayments(prev => prev.filter(payment => payment.id !== paymentId));
    }
  };

  const stats = {
    totalRevenue: formatCurrency(12450),
    monthlyRevenue: formatCurrency(3200),
    pendingAmount: formatCurrency(1875),
    overdueAmount: formatCurrency(675),
    successRate: '92%',
    expiringRentals: payments.filter(p => {
      const rentalEnd = new Date(p.rentalEnd);
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      return rentalEnd <= thirtyDaysFromNow;
    }).length
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'success';
      case 'pending': return 'warning';
      case 'overdue': return 'danger';
      case 'failed': return 'danger';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'overdue': return <AlertCircle className="w-4 h-4" />;
      case 'failed': return <XCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  // Get occupied units for payment form
  const getOccupiedUnits = () => {
    return units.filter(unit => unit.status === 'occupied' && unit.customer_id);
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('payments.title')}</h1>
          <p className="text-gray-500 mt-1">{t('payments.subtitle')}</p>
        </div>
        <div className="flex space-x-3">
          <Button
            variant="gradient"
            onClick={() => setShowAddModal(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            {t('payments.addPayment')}
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            {t('payments.exportReport')}
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-green-600 font-medium">{t('payments.totalRevenue')}</p>
                  <p className="text-2xl font-bold text-green-900">{stats.totalRevenue}</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-blue-600 font-medium">{t('payments.thisMonth')}</p>
                  <p className="text-2xl font-bold text-blue-900">{stats.monthlyRevenue}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-yellow-600 font-medium">{t('payments.pending')}</p>
                  <p className="text-2xl font-bold text-yellow-900">{stats.pendingAmount}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-red-50 to-rose-50 border-red-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-red-600 font-medium">{t('payments.overdue')}</p>
                  <p className="text-2xl font-bold text-red-900">{stats.overdueAmount}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-purple-600 font-medium">{t('payments.successRate')}</p>
                  <p className="text-2xl font-bold text-purple-900">{stats.successRate}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-orange-600 font-medium">{t('payments.rentalsExpiringSoon')}</p>
                  <p className="text-2xl font-bold text-orange-900">{stats.expiringRentals}</p>
                </div>
                <Home className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={t('payments.searchPayments')}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">{t('payments.allStatus')}</option>
                <option value="paid">{t('payments.paid')}</option>
                <option value="pending">{t('payments.pending')}</option>
                <option value="overdue">{t('payments.overdue')}</option>
                <option value="failed">{t('payments.failed')}</option>
              </select>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="today">{t('payments.today')}</option>
                <option value="week">{t('payments.thisWeek')}</option>
                <option value="month">{t('payments.thisMonth')}</option>
                <option value="year">{t('payments.thisYear')}</option>
              </select>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                {t('payments.moreFilters')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>{t('payments.recentTransactions')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('payments.customer')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('payments.unit')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('payments.amount')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('common.status')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('payments.paymentDate')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('payments.rentalExpires')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('payments.method')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('common.notes')}</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">{t('common.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPayments.map((payment) => (
                  <motion.tr
                    key={payment.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileHover={{ backgroundColor: 'rgba(249, 250, 251, 0.5)' }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <span className="text-sm font-medium text-gray-900">{payment.customer}</span>
                        <div className="text-xs text-gray-500">{payment.customerPhone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">{payment.unit}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-gray-900">{formatCurrency(payment.amount)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={getStatusColor(payment.status)}>
                        <span className="flex items-center space-x-1">
                          {getStatusIcon(payment.status)}
                          <span>{t(`payments.${payment.status}`)}</span>
                        </span>
                      </Badge>
                      {payment.daysOverdue && (
                        <span className="ml-2 text-xs text-red-600">({payment.daysOverdue} {t('common.days')})</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">
                        <div>{payment.paymentDate || '-'}</div>
                        {payment.dueDate && (
                          <div className="text-xs text-gray-500">{t('payments.due')}: {payment.dueDate}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">
                        <div>{payment.rentalEnd ? new Date(payment.rentalEnd).toLocaleDateString() : '-'}</div>
                        {payment.rentalEnd && (
                          <div className="text-xs text-gray-500">
                            {Math.ceil((new Date(payment.rentalEnd) - new Date()) / (1000 * 60 * 60 * 24))} {t('payments.daysLeft')}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-600">
                        <CreditCard className="w-4 h-4 mr-1" />
                        {payment.method || '-'}
                      </div>
                      {payment.failReason && (
                        <div className="text-xs text-red-600">{payment.failReason}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">
                        {payment.notes || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2 justify-center">
                        <button
                          onClick={() => handleEdit(payment)}
                          className="p-1.5 text-primary-500 hover:bg-primary-50 rounded-lg transition-colors"
                          title={t('payments.editPayment')}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(payment.id)}
                          className="p-1.5 text-danger-500 hover:bg-danger-50 rounded-lg transition-colors"
                          title={t('payments.deletePayment')}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add Payment Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold">
                  {editingPayment ? t('payments.editPayment') : t('payments.addNewPayment')}
                </h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingPayment(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div>
                    <h3 className="font-semibold mb-4">{t('payments.customerAndUnit')}</h3>
                    {editingPayment && (
                      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800">
                          <strong>{t('payments.editingPayment')}:</strong> {editingPayment.id}
                        </p>
                      </div>
                    )}
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('payments.selectCustomer')} *
                        </label>
                        <select
                          name="customer_id"
                          value={formData.customer_id}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                          <option value="">{t('payments.selectCustomer')}</option>
                          {customers.map(customer => (
                            <option key={customer.id} value={customer.id}>
                              {customer.name} - {customer.phone}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('payments.selectUnit')} *
                        </label>
                        <select
                          name="unit_id"
                          value={formData.unit_id}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                          <option value="">{t('payments.selectUnit')}</option>
                          {getOccupiedUnits().map(unit => (
                            <option key={unit.id} value={unit.id}>
                              {unit.unit_number} - {unit.customer_name} - {formatCurrency(unit.monthly_rate)}/{t('common.month')}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('payments.amount')} ({getCurrencySymbol()}) *
                        </label>
                        <input
                          type="number"
                          name="amount"
                          value={formData.amount}
                          onChange={handleInputChange}
                          required
                          min="0"
                          step="0.01"
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('payments.paymentStatus')} *
                        </label>
                        <select
                          name="status"
                          value={formData.status}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                          <option value="pending">{t('payments.pending')}</option>
                          <option value="paid">{t('payments.paid')}</option>
                          <option value="overdue">{t('payments.overdue')}</option>
                          <option value="failed">{t('payments.failed')}</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div>
                    <h3 className="font-semibold mb-4">{t('payments.paymentDetails')}</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('payments.paymentDate')}
                        </label>
                        <input
                          type="date"
                          name="paymentDate"
                          value={formData.paymentDate}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('payments.dueDate')} *
                        </label>
                        <input
                          type="date"
                          name="dueDate"
                          value={formData.dueDate}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('payments.paymentMethod')}
                        </label>
                        <select
                          name="method"
                          value={formData.method}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                          <option value="Credit Card">{t('payments.creditCard')}</option>
                          <option value="Bank Transfer">{t('payments.bankTransfer')}</option>
                          <option value="Cash">{t('payments.cash')}</option>
                          <option value="Check">{t('payments.check')}</option>
                          <option value="Online Payment">{t('payments.onlinePayment')}</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('common.notes')}
                        </label>
                        <textarea
                          name="notes"
                          value={formData.notes}
                          onChange={handleInputChange}
                          rows="3"
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder={t('payments.paymentNotesPlaceholder')}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 flex justify-end gap-4">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingPayment(null);
                    }}
                  >
                    {t('common.cancel')}
                  </Button>
                  <Button type="submit" variant="gradient">
                    <Save className="w-5 h-5 mr-2" />
                    {editingPayment ? t('payments.updatePayment') : t('payments.addPayment')}
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Payments;