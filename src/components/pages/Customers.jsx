import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../context/AppContext';
import { formatCurrency } from '../../utils/currency';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  Calendar,
  Search,
  Plus,
  Edit2,
  Eye,
  Trash2,
  X,
  Check,
  AlertCircle,
  Users,
  CreditCard,
  FileText,
  Home,
  Briefcase,
  Shield,
  Clock,
  DollarSign,
  Package,
  Star,
  MessageSquare,
  Hash,
  Globe,
  Save
} from 'lucide-react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

const Customers = () => {
  const { t } = useTranslation();
  const appContext = useAppContext();
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [filterStatus, setFilterStatus] = useState('all');
  const [activeTab, setActiveTab] = useState('overview');
  const [formData, setFormData] = useState({
    // Personal Information
    full_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    
    // Address Information
    address: '',
    city: '',
    state: '',
    zip_code: '',
    country: 'USA',
    
    // Business Information
    company_name: '',
    business_type: '',
    
    // Additional Information
    preferred_contact_method: 'email',
    referral_source: '',
    notes: '',
    
    // Customer Preferences
    email_notifications: true,
    sms_notifications: false,
    whatsapp_notifications: false,
    
    // Status
    status: 'active',
    customer_since: new Date().toISOString().split('T')[0]
  });

  // Mock data for demonstration
  useEffect(() => {
    const mockCustomers = [
      {
        id: 1,
        full_name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '(555) 123-4567',
        date_of_birth: '1985-03-15',
        address: '123 Main St',
        city: 'New York',
        state: 'NY',
        zip_code: '10001',
        country: 'USA',
        company_name: 'Doe Enterprises',
        business_type: 'Retail',
        preferred_contact_method: 'email',
        status: 'active',
        customer_since: '2023-01-15',
        active_units: 2,
        total_paid: 5400,
        balance: 0,
        email_notifications: true,
        sms_notifications: false,
        whatsapp_notifications: true,
        last_payment: '2024-01-01',
        notes: 'VIP customer, always pays on time',
        rating: 5
      },
      {
        id: 2,
        full_name: 'Sarah Johnson',
        email: 'sarah.j@example.com',
        phone: '(555) 234-5678',
        address: '456 Oak Ave',
        city: 'Los Angeles',
        state: 'CA',
        zip_code: '90001',
        country: 'USA',
        status: 'active',
        customer_since: '2023-06-20',
        active_units: 1,
        total_paid: 2700,
        balance: 450,
        email_notifications: true,
        sms_notifications: true,
        whatsapp_notifications: false,
        last_payment: '2023-12-15',
        notes: '',
        rating: 4
      },
      {
        id: 3,
        full_name: 'Michael Brown',
        email: 'mbrown@example.com',
        phone: '(555) 345-6789',
        address: '789 Pine Rd',
        city: 'Chicago',
        state: 'IL',
        zip_code: '60601',
        country: 'USA',
        company_name: 'Brown Storage Solutions',
        business_type: 'Logistics',
        status: 'inactive',
        customer_since: '2022-11-10',
        active_units: 0,
        total_paid: 8100,
        balance: 0,
        email_notifications: false,
        sms_notifications: false,
        whatsapp_notifications: true,
        last_payment: '2023-11-30',
        notes: 'Moved to different location',
        rating: 5
      }
    ];
    setCustomers(mockCustomers);
    setFilteredCustomers(mockCustomers);
  }, []);

  // Filter customers based on search and status
  useEffect(() => {
    let filtered = customers;

    if (searchTerm) {
      filtered = filtered.filter(customer =>
        customer.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm) ||
        customer.company_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(customer => customer.status === filterStatus);
    }

    setFilteredCustomers(filtered);
  }, [searchTerm, filterStatus, customers]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditMode) {
      // Update existing customer
      setCustomers(prev => prev.map(c => 
        c.id === selectedCustomer.id ? { ...c, ...formData } : c
      ));
    } else {
      // Add new customer
      const newCustomer = {
        ...formData,
        id: Date.now(),
        active_units: 0,
        total_paid: 0,
        balance: 0,
        last_payment: null,
        rating: 0
      };
      setCustomers(prev => [...prev, newCustomer]);
    }
    setIsFormOpen(false);
    setIsEditMode(false);
    setFormData({
      full_name: '',
      email: '',
      phone: '',
      date_of_birth: '',
      address: '',
      city: '',
      state: '',
      zip_code: '',
      country: 'USA',
      company_name: '',
      business_type: '',
      preferred_contact_method: 'email',
      referral_source: '',
      notes: '',
      email_notifications: true,
      sms_notifications: false,
      whatsapp_notifications: false,
      status: 'active',
      customer_since: new Date().toISOString().split('T')[0]
    });
  };

  const handleEdit = (customer) => {
    setSelectedCustomer(customer);
    setFormData(customer);
    setIsEditMode(true);
    setIsFormOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm(t('customers.confirmDelete'))) {
      setCustomers(prev => prev.filter(c => c.id !== id));
      setSelectedCustomer(null);
    }
  };


  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold gradient-text mb-2"
        >
          {t('customers.title')}
        </motion.h1>
        <p className="text-gray-600">{t('customers.subtitle')}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-l-4 border-primary-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{t('customers.totalCustomers') || 'Total Customers'}</p>
                <p className="text-3xl font-bold">{customers.length}</p>
              </div>
              <Users className="w-10 h-10 text-primary-500 opacity-20" />
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-l-4 border-success-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{t('dashboard.activeCustomers')}</p>
                <p className="text-3xl font-bold">
                  {customers.filter(c => c.status === 'active').length}
                </p>
              </div>
              <Check className="w-10 h-10 text-success-500 opacity-20" />
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-l-4 border-warning-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{t('customers.withBalance')}</p>
                <p className="text-3xl font-bold">
                  {customers.filter(c => c.balance > 0).length}
                </p>
              </div>
              <DollarSign className="w-10 h-10 text-warning-500 opacity-20" />
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-l-4 border-accent-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{t('customers.whatsappEnabled')}</p>
                <p className="text-3xl font-bold">
                  {customers.filter(c => c.whatsapp_notifications).length}
                </p>
              </div>
              <MessageSquare className="w-10 h-10 text-accent-500 opacity-20" />
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Actions Bar */}
      <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-4 items-center">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={t('customers.searchCustomers')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-64 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-white/80 dark:bg-gray-700/80 text-gray-900 dark:text-gray-100 backdrop-blur-sm border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">{t('customers.allStatus')}</option>
            <option value="active">{t('customers.active')}</option>
            <option value="inactive">{t('customers.inactive')}</option>
            <option value="suspended">{t('customers.suspended')}</option>
          </select>

          {/* View Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-primary-500 text-white' 
                  : 'bg-white/80 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' 
                  ? 'bg-primary-500 text-white' 
                  : 'bg-white/80 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        <Button
          variant="gradient"
          onClick={() => {
            setIsFormOpen(true);
            setIsEditMode(false);
          }}
        >
          <Plus className="w-5 h-5 mr-2" />
          {t('customers.addCustomer')}
        </Button>
      </div>

      {/* Customer List/Grid */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredCustomers.map((customer, index) => (
              <motion.div
                key={customer.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="hover:shadow-xl transition-shadow cursor-pointer"
                      onClick={() => setSelectedCustomer(customer)}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center text-white font-bold">
                        {customer.full_name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{customer.full_name}</h3>
                        <p className="text-sm text-gray-500">{customer.company_name || t('customers.personal')}</p>
                      </div>
                    </div>
                    <Badge variant={customer.status === 'active' ? 'success' : 'danger'}>
                      {t(`customers.${customer.status}`)}
                    </Badge>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4" />
                      {customer.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      {customer.phone}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      {customer.city}, {customer.state}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500">{t('customers.activeUnits')}</p>
                      <p className="text-lg font-bold text-primary-600">{customer.active_units}</p>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500">{t('customers.balance')}</p>
                      <p className="text-lg font-bold text-warning-600">{formatCurrency(customer.balance)}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex gap-2">
                      {customer.whatsapp_notifications && (
                        <Badge variant="success">WhatsApp</Badge>
                      )}
                      {customer.email_notifications && (
                        <Badge variant="info">{t('customers.email')}</Badge>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(customer);
                        }}
                        className="p-1.5 text-primary-500 hover:bg-primary-50 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(customer.id);
                        }}
                        className="p-1.5 text-danger-500 hover:bg-danger-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr>
                  <th className="text-left py-3 px-4">{t('customers.customer')}</th>
                  <th className="text-left py-3 px-4">{t('customers.contact')}</th>
                  <th className="text-left py-3 px-4">{t('customers.location')}</th>
                  <th className="text-center py-3 px-4">{t('customers.units')}</th>
                  <th className="text-right py-3 px-4">{t('customers.balance')}</th>
                  <th className="text-center py-3 px-4">{t('common.status')}</th>
                  <th className="text-center py-3 px-4">{t('common.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="border-b hover:bg-gray-50 cursor-pointer"
                      onClick={() => setSelectedCustomer(customer)}>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center text-white font-bold text-sm">
                          {customer.full_name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-medium">{customer.full_name}</p>
                          <p className="text-sm text-gray-500">{customer.company_name || t('customers.personal')}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm">{customer.email}</p>
                      <p className="text-sm text-gray-500">{customer.phone}</p>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {customer.city}, {customer.state}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="font-medium">{customer.active_units}</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className={`font-medium ${customer.balance > 0 ? 'text-warning-600' : 'text-gray-600'}`}>
                        {formatCurrency(customer.balance)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Badge variant={customer.status === 'active' ? 'success' : 'danger'}>
                        {customer.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(customer);
                          }}
                          className="p-1.5 text-primary-500 hover:bg-primary-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(customer.id);
                          }}
                          className="p-1.5 text-danger-500 hover:bg-danger-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Customer Form Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsFormOpen(false)}
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
                  {isEditMode ? 'Edit Customer' : 'Add New Customer'}
                </h2>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6">
                {/* Personal Information */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-primary-500" />
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        name="date_of_birth"
                        value={formData.date_of_birth}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary-500" />
                    Address Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Street Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        name="zip_code"
                        value={formData.zip_code}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Country
                      </label>
                      <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Business Information */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-primary-500" />
                    Business Information (Optional)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Company Name
                      </label>
                      <input
                        type="text"
                        name="company_name"
                        value={formData.company_name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Business Type
                      </label>
                      <input
                        type="text"
                        name="business_type"
                        value={formData.business_type}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>
                </div>


                {/* Preferences */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Settings className="w-5 h-5 text-primary-500" />
                    Preferences
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Preferred Contact Method
                      </label>
                      <select
                        name="preferred_contact_method"
                        value={formData.preferred_contact_method}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="email">{t('customers.email')}</option>
                        <option value="phone">{t('customers.phone')}</option>
                        <option value="sms">SMS</option>
                        <option value="mail">{t('customers.mail')}</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('customers.referralSource')}
                      </label>
                      <input
                        type="text"
                        name="referral_source"
                        value={formData.referral_source}
                        onChange={handleInputChange}
                        placeholder={t('customers.howDidTheyHear')}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="email_notifications"
                        checked={formData.email_notifications}
                        onChange={handleInputChange}
                        className="rounded text-primary-500 focus:ring-primary-500"
                      />
                      <span className="text-sm">{t('customers.emailNotifications')}</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="sms_notifications"
                        checked={formData.sms_notifications}
                        onChange={handleInputChange}
                        className="rounded text-primary-500 focus:ring-primary-500"
                      />
                      <span className="text-sm">{t('customers.smsNotifications')}</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="whatsapp_notifications"
                        checked={formData.whatsapp_notifications}
                        onChange={handleInputChange}
                        className="rounded text-primary-500 focus:ring-primary-500"
                      />
                      <span className="text-sm">{t('customers.whatsappNotifications')}</span>
                    </label>
                  </div>
                </div>

                {/* Notes */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary-500" />
                    {t('customers.notes')}
                  </h3>
                  <div>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows="4"
                      placeholder={t('customers.additionalNotes')}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-4 pt-6 border-t">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setIsFormOpen(false)}
                  >
                    {t('common.cancel')}
                  </Button>
                  <Button type="submit" variant="gradient">
                    <Save className="w-5 h-5 mr-2" />
                    {isEditMode ? t('customers.updateCustomer') : t('customers.addCustomer')}
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Customer Details Modal */}
      <AnimatePresence>
        {selectedCustomer && !isFormOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedCustomer(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center text-white font-bold">
                    {selectedCustomer.full_name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{selectedCustomer.full_name}</h2>
                    <p className="text-gray-500">{selectedCustomer.company_name || 'Personal Account'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => handleEdit(selectedCustomer)}
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    {t('common.edit')}
                  </Button>
                  <button
                    onClick={() => setSelectedCustomer(null)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                {/* Tabs */}
                <div className="flex gap-4 mb-6 border-b">
                  {['overview', 'units', 'payments', 'documents', 'activity'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`pb-2 px-1 capitalize transition-colors ${
                        activeTab === tab
                          ? 'text-primary-500 border-b-2 border-primary-500'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Status and Notifications */}
                    <div className="flex gap-4">
                      <Badge variant={selectedCustomer.status === 'active' ? 'success' : 'danger'}>
                        {selectedCustomer.status}
                      </Badge>
                      {selectedCustomer.whatsapp_notifications && (
                        <Badge variant="success">WhatsApp</Badge>
                      )}
                      {selectedCustomer.email_notifications && (
                        <Badge variant="info">{t('customers.email')}</Badge>
                      )}
                      {selectedCustomer.sms_notifications && (
                        <Badge variant="warning">SMS</Badge>
                      )}
                    </div>

                    {/* Contact Information */}
                    <Card>
                      <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <Phone className="w-5 h-5 text-primary-500" />
                        {t('customers.contactInfo')}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500">{t('customers.email')}</p>
                            <p className="font-medium">{selectedCustomer.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500">{t('customers.phone')}</p>
                            <p className="font-medium">{selectedCustomer.phone}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500">{t('customers.address')}</p>
                            <p className="font-medium">
                              {selectedCustomer.address}<br/>
                              {selectedCustomer.city}, {selectedCustomer.state} {selectedCustomer.zip_code}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500">{t('customers.customerSince')}</p>
                            <p className="font-medium">{selectedCustomer.customer_since}</p>
                          </div>
                        </div>
                      </div>
                    </Card>

                    {/* Financial Summary */}
                    <Card>
                      <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-primary-500" />
                        {t('customers.financialSummary')}
                      </h3>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-500">{t('customers.activeUnits')}</p>
                          <p className="text-2xl font-bold text-primary-600">{selectedCustomer.active_units}</p>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-500">{t('customers.currentBalance')}</p>
                          <p className="text-2xl font-bold text-warning-600">{formatCurrency(selectedCustomer.balance)}</p>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-500">{t('customers.totalPaid')}</p>
                          <p className="text-2xl font-bold text-success-600">{formatCurrency(selectedCustomer.total_paid)}</p>
                        </div>
                      </div>
                    </Card>

                  </div>
                )}

                {activeTab === 'units' && (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">{t('customers.activeUnitsMessage')}</p>
                  </div>
                )}

                {activeTab === 'payments' && (
                  <div className="text-center py-12">
                    <CreditCard className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">{t('customers.paymentHistoryMessage')}</p>
                  </div>
                )}

                {activeTab === 'documents' && (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">{t('customers.documentsMessage')}</p>
                  </div>
                )}

                {activeTab === 'activity' && (
                  <div className="text-center py-12">
                    <Clock className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">{t('customers.activityLogMessage')}</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Add Settings import that was missing
const Settings = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export default Customers;