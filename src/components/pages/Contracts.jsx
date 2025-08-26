import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../context/AppContext';
import { formatCurrency, getCurrencySymbol } from '../../utils/currency';
import {
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  FileText,
  Upload,
  Download,
  Eye,
  Search,
  Filter,
  Calendar,
  User,
  AlertCircle,
  CheckCircle,
  Clock,
  FileCheck,
  Paperclip,
  ExternalLink
} from 'lucide-react';
import Button from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import Badge from '../ui/Badge';

const Contracts = () => {
  const { t } = useTranslation();
  const {
    contracts,
    setContracts,
    customers,
    units,
    getCustomerById,
    getUnitById,
    getAvailableUnits,
    addContract,
    updateUnit
  } = useAppContext();
  
  const [filteredContracts, setFilteredContracts] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingContract, setEditingContract] = useState(null);
  const [formData, setFormData] = useState({
    customer_id: '',
    unit_id: '',
    contract_number: '',
    unit_number: '',
    contract_type: 'rental',
    start_date: '',
    end_date: '',
    monthly_rate: 0,
    security_deposit: 0,
    status: 'draft',
    terms: '',
    notes: '',
    auto_renew: false,
    files: []
  });

  // Contract statuses
  const contractStatuses = {
    'draft': { label: t('contracts.draft'), color: 'warning', icon: Edit2 },
    'active': { label: t('contracts.active'), color: 'success', icon: CheckCircle },
    'pending': { label: t('contracts.pendingSignature'), color: 'info', icon: Clock },
    'expired': { label: t('contracts.expired'), color: 'danger', icon: AlertCircle },
    'terminated': { label: t('contracts.terminated'), color: 'default', icon: X },
    'renewed': { label: t('contracts.renewed'), color: 'success', icon: FileCheck }
  };

  // Initialize filtered contracts when contracts change
  useEffect(() => {
    setFilteredContracts(contracts);
  }, [contracts]);

  // Filter contracts
  useEffect(() => {
    let filtered = contracts;

    if (searchTerm) {
      filtered = filtered.filter(contract =>
        contract.contract_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.unit_number.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCustomer !== 'all') {
      filtered = filtered.filter(contract => contract.customer_id === parseInt(selectedCustomer));
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(contract => contract.status === selectedStatus);
    }

    setFilteredContracts(filtered);
  }, [searchTerm, selectedCustomer, selectedStatus, contracts]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Auto-generate contract number when customer is selected
    if (name === 'customer_id' && value) {
      const customer = getCustomerById(parseInt(value));
      if (customer && !editingContract) {
        const nextNumber = String(contracts.length + 1).padStart(3, '0');
        setFormData(prev => ({
          ...prev,
          contract_number: `CNT-2024-${nextNumber}`
        }));
      }
    }

    // Auto-fill unit information when unit is selected
    if (name === 'unit_id' && value) {
      const unit = getUnitById(parseInt(value));
      if (unit) {
        setFormData(prev => ({
          ...prev,
          unit_number: unit.unit_number,
          monthly_rate: unit.monthly_rate,
          security_deposit: unit.monthly_rate, // Default to same as monthly rate
          terms: t('contracts.standardAgreement', { unitNumber: unit.unit_number, size: unit.size })
        }));
      }
    }
  };

  // Handle file upload
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
      type: file.type,
      uploadDate: new Date().toISOString().split('T')[0],
      file: file // Store actual file for upload
    }));

    setFormData(prev => ({
      ...prev,
      files: [...prev.files, ...newFiles]
    }));
  };

  // Remove file
  const removeFile = (fileId) => {
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter(file => file.id !== fileId)
    }));
  };

  // Add or update contract
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const selectedCustomer = getCustomerById(parseInt(formData.customer_id));
    const selectedUnit = getUnitById(parseInt(formData.unit_id));
    
    const contractData = {
      ...formData,
      customer_name: selectedCustomer?.name || '',
      customer_phone: selectedCustomer?.phone || '',
      signed_date: formData.status === 'active' ? new Date().toISOString().split('T')[0] : null
    };
    
    if (editingContract) {
      setContracts(prev => prev.map(contract =>
        contract.id === editingContract.id
          ? {
              ...contractData,
              id: contract.id,
              created_date: contract.created_date
            }
          : contract
      ));
    } else {
      addContract(contractData);
    }

    // Update unit status if contract is active and unit is selected
    if (formData.status === 'active' && selectedUnit && selectedCustomer) {
      updateUnit(selectedUnit.id, {
        status: 'occupied',
        customer_id: selectedCustomer.id,
        customer_name: selectedCustomer.name,
        customer_phone: selectedCustomer.phone,
        customer_email: selectedCustomer.email,
        rental_start: formData.start_date,
        rental_end: formData.end_date
      });
    }

    // Reset form
    setShowAddModal(false);
    setEditingContract(null);
    setFormData({
      customer_id: '',
      unit_id: '',
      contract_number: '',
      unit_number: '',
      contract_type: 'rental',
      start_date: '',
      end_date: '',
      monthly_rate: 0,
      security_deposit: 0,
      status: 'draft',
      terms: '',
      notes: '',
      auto_renew: false,
      files: []
    });
  };

  // Edit contract
  const handleEdit = (contract) => {
    setEditingContract(contract);
    setFormData({
      ...contract,
      files: contract.files || []
    });
    setShowAddModal(true);
  };

  // Delete contract
  const handleDelete = (contractId) => {
    if (window.confirm(t('contracts.confirmDelete'))) {
      setContracts(prev => prev.filter(contract => contract.id !== contractId));
    }
  };

  // Calculate statistics
  const stats = {
    total: contracts.length,
    active: contracts.filter(c => c.status === 'active').length,
    pending: contracts.filter(c => c.status === 'pending').length,
    expired: contracts.filter(c => c.status === 'expired').length,
    draft: contracts.filter(c => c.status === 'draft').length,
    totalValue: contracts
      .filter(c => c.status === 'active')
      .reduce((sum, c) => sum + parseFloat(c.monthly_rate || 0), 0),
    expiringThisMonth: contracts.filter(c => {
      if (c.status !== 'active' || !c.end_date) return false;
      const endDate = new Date(c.end_date);
      const today = new Date();
      const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      return endDate <= nextMonth && endDate >= today;
    }).length
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold gradient-text mb-2">{t('contracts.title')}</h1>
        <p className="text-gray-600">{t('contracts.subtitle')}</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
        <Card className="text-center">
          <FileText className="w-8 h-8 mx-auto mb-2 text-primary-500" />
          <p className="text-2xl font-bold">{stats.total}</p>
          <p className="text-xs text-gray-600">{t('contracts.totalContracts')}</p>
        </Card>

        <Card className="text-center">
          <CheckCircle className="w-8 h-8 mx-auto mb-2 text-success-500" />
          <p className="text-2xl font-bold">{stats.active}</p>
          <p className="text-xs text-gray-600">{t('contracts.active')}</p>
        </Card>

        <Card className="text-center">
          <Clock className="w-8 h-8 mx-auto mb-2 text-info-500" />
          <p className="text-2xl font-bold">{stats.pending}</p>
          <p className="text-xs text-gray-600">{t('contracts.pending')}</p>
        </Card>

        <Card className="text-center">
          <Edit2 className="w-8 h-8 mx-auto mb-2 text-warning-500" />
          <p className="text-2xl font-bold">{stats.draft}</p>
          <p className="text-xs text-gray-600">{t('contracts.draft')}</p>
        </Card>

        <Card className="text-center">
          <AlertCircle className="w-8 h-8 mx-auto mb-2 text-danger-500" />
          <p className="text-2xl font-bold">{stats.expired}</p>
          <p className="text-xs text-gray-600">{t('contracts.expired')}</p>
        </Card>

        <Card className="text-center">
          <Calendar className="w-8 h-8 mx-auto mb-2 text-orange-500" />
          <p className="text-2xl font-bold">{stats.expiringThisMonth}</p>
          <p className="text-xs text-gray-600">{t('contracts.expiringSoon')}</p>
        </Card>

        <Card className="text-center">
          <div className="w-8 h-8 mx-auto mb-2 flex items-center justify-center text-success-600 font-bold text-lg">{getCurrencySymbol()}</div>
          <p className="text-2xl font-bold">{formatCurrency(stats.totalValue)}</p>
          <p className="text-xs text-gray-600">{t('contracts.monthlyValue')}</p>
        </Card>
      </div>

      {/* Filters and Actions */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={t('contracts.searchContracts')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-64 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Customer Filter */}
          <select
            value={selectedCustomer}
            onChange={(e) => setSelectedCustomer(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">{t('contracts.allCustomers')}</option>
            {customers.map(customer => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">{t('contracts.allStatus')}</option>
            {Object.entries(contractStatuses).map(([key, status]) => (
              <option key={key} value={key}>
                {status.label}
              </option>
            ))}
          </select>
        </div>

        {/* Add Contract Button */}
        <Button
          variant="gradient"
          onClick={() => setShowAddModal(true)}
        >
          <Plus className="w-5 h-5 mr-2" />
          {t('contracts.newContract')}
        </Button>
      </div>

      {/* Contracts Table */}
      <Card>
        <CardHeader>
          <CardTitle>{t('contracts.contractManagement')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('contracts.contractNumber')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('contracts.customer')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('contracts.unit')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('contracts.period')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('contracts.rate')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('common.status')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('contracts.files')}</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">{t('common.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredContracts.map((contract) => (
                  <motion.tr
                    key={contract.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileHover={{ backgroundColor: 'rgba(249, 250, 251, 0.5)' }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">{contract.contract_number}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <span className="text-sm font-medium text-gray-900">{contract.customer_name}</span>
                        <div className="text-xs text-gray-500">{contract.customer_phone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">{contract.unit_number}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">
                        <div>{new Date(contract.start_date).toLocaleDateString()} -</div>
                        <div>{new Date(contract.end_date).toLocaleDateString()}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-gray-900">{formatCurrency(contract.monthly_rate)}/{t('common.month')}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={contractStatuses[contract.status]?.color || 'default'}>
                        <span className="flex items-center space-x-1">
                          {React.createElement(contractStatuses[contract.status]?.icon || FileText, { className: "w-3 h-3" })}
                          <span>{contractStatuses[contract.status]?.label || contract.status}</span>
                        </span>
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <Paperclip className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{contract.files?.length || 0} {t('contracts.files')}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2 justify-center">
                        <button
                          onClick={() => handleEdit(contract)}
                          className="p-1.5 text-primary-500 hover:bg-primary-50 rounded-lg transition-colors"
                          title={t('contracts.editContract')}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(contract.id)}
                          className="p-1.5 text-danger-500 hover:bg-danger-50 rounded-lg transition-colors"
                          title={t('contracts.deleteContract')}
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

      {/* Add/Edit Modal */}
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
              className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold">
                  {editingContract ? t('contracts.editContract') : t('contracts.newContract')}
                </h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingContract(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-2 gap-6">
                  {/* Left Column - Contract Info */}
                  <div>
                    <h3 className="font-semibold mb-4">{t('contracts.contractInformation')}</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('contracts.customer')} *
                        </label>
                        <select
                          name="customer_id"
                          value={formData.customer_id}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                          <option value="">{t('contracts.selectCustomer')}</option>
                          {customers.map(customer => (
                            <option key={customer.id} value={customer.id}>
                              {customer.name} - {customer.phone}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('contracts.contractNumber')} *
                        </label>
                        <input
                          type="text"
                          name="contract_number"
                          value={formData.contract_number}
                          onChange={handleInputChange}
                          required
                          placeholder={t('contracts.contractNumberPlaceholder')}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('contracts.selectUnit')} *
                        </label>
                        <select
                          name="unit_id"
                          value={formData.unit_id}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                          <option value="">{t('contracts.selectAUnit')}</option>
                          {getAvailableUnits().map(unit => (
                            <option key={unit.id} value={unit.id}>
                              {unit.unit_number} - {unit.size} {t('common.ft')} - {formatCurrency(unit.monthly_rate)}/{t('common.month')} ({t('units.floor')} {unit.floor})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('units.unitNumber')} *
                        </label>
                        <input
                          type="text"
                          name="unit_number"
                          value={formData.unit_number}
                          onChange={handleInputChange}
                          required
                          readOnly
                          placeholder={t('contracts.autoFilledFromUnit')}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('contracts.contractType')}
                        </label>
                        <select
                          name="contract_type"
                          value={formData.contract_type}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                          <option value="rental">{t('contracts.rentalAgreement')}</option>
                          <option value="lease">{t('contracts.leaseAgreement')}</option>
                          <option value="month-to-month">{t('contracts.monthToMonth')}</option>
                          <option value="annual">{t('contracts.annualContract')}</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('contracts.startDate')} *
                          </label>
                          <input
                            type="date"
                            name="start_date"
                            value={formData.start_date}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('contracts.endDate')} *
                          </label>
                          <input
                            type="date"
                            name="end_date"
                            value={formData.end_date}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('contracts.monthlyRate')} ({getCurrencySymbol()}) *
                          </label>
                          <input
                            type="number"
                            name="monthly_rate"
                            value={formData.monthly_rate}
                            onChange={handleInputChange}
                            required
                            min="0"
                            step="0.01"
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('contracts.securityDeposit')} ({getCurrencySymbol()})
                          </label>
                          <input
                            type="number"
                            name="security_deposit"
                            value={formData.security_deposit}
                            onChange={handleInputChange}
                            min="0"
                            step="0.01"
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('common.status')}
                        </label>
                        <select
                          name="status"
                          value={formData.status}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                          {Object.entries(contractStatuses).map(([key, status]) => (
                            <option key={key} value={key}>
                              {status.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            name="auto_renew"
                            checked={formData.auto_renew}
                            onChange={handleInputChange}
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                          <span className="text-sm font-medium text-gray-700">{t('contracts.autoRenewEnabled')}</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Files & Terms */}
                  <div>
                    <h3 className="font-semibold mb-4">{t('contracts.filesDocumentation')}</h3>
                    
                    {/* File Upload Section */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('contracts.contractFiles')}
                      </label>
                      
                      {/* Upload Area */}
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-300 transition-colors">
                        <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600 mb-2">
                          {t('contracts.dropFilesHere')}
                        </p>
                        <input
                          type="file"
                          multiple
                          onChange={handleFileUpload}
                          accept=".pdf,.doc,.docx,.txt,.jpg,.png"
                          className="hidden"
                          id="file-upload"
                        />
                        <label
                          htmlFor="file-upload"
                          className="inline-block px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 cursor-pointer transition-colors"
                        >
                          {t('contracts.chooseFiles')}
                        </label>
                        <p className="text-xs text-gray-500 mt-2">
                          {t('contracts.fileTypes')}
                        </p>
                      </div>

                      {/* Uploaded Files List */}
                      {formData.files && formData.files.length > 0 && (
                        <div className="mt-4 space-y-2">
                          <h4 className="text-sm font-medium text-gray-700">{t('contracts.attachedFiles')}:</h4>
                          {formData.files.map((file) => (
                            <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center space-x-3">
                                <FileText className="w-5 h-5 text-primary-500" />
                                <div>
                                  <p className="text-sm font-medium text-gray-900">{file.name}</p>
                                  <p className="text-xs text-gray-500">{file.size} • {file.uploadDate}</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <button
                                  type="button"
                                  className="p-1 text-primary-500 hover:bg-primary-50 rounded"
                                  title={t('common.download')}
                                >
                                  <Download className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => removeFile(file.id)}
                                  className="p-1 text-danger-500 hover:bg-danger-50 rounded"
                                  title={t('common.remove')}
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Terms Section */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('contracts.contractTerms')}
                        </label>
                        <textarea
                          name="terms"
                          value={formData.terms}
                          onChange={handleInputChange}
                          rows="4"
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder={t('contracts.enterContractTerms')}
                        />
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
                          placeholder={t('contracts.additionalNotes')}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-8 flex justify-end gap-4">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingContract(null);
                    }}
                  >
                    {t('common.cancel')}
                  </Button>
                  <Button type="submit" variant="gradient">
                    <Save className="w-5 h-5 mr-2" />
                    {editingContract ? t('contracts.updateContract') : t('contracts.createContract')}
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

export default Contracts;