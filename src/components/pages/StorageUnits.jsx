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
  Package,
  Layers,
  DollarSign,
  User,
  Calendar,
  Search,
  Filter,
  Home,
  Check,
  AlertCircle,
  Grid3x3,
  List
} from 'lucide-react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

const StorageUnits = () => {
  const { t } = useTranslation();
  const { customers, getCustomerById } = useAppContext();
  
  const [units, setUnits] = useState([]);
  const [filteredUnits, setFilteredUnits] = useState([]);
  const [selectedFloor, setSelectedFloor] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUnit, setEditingUnit] = useState(null);
  const [formData, setFormData] = useState({
    unit_number: '',
    floor: 1,
    size: '5x5',
    monthly_rate: 50,
    status: 'available',
    customer_id: '',
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    rental_start: '',
    rental_end: '',
    notes: ''
  });

  // Unit size templates with default prices
  const unitSizes = {
    '5x5': { label: t('units.sizeSmall'), sqft: 25, defaultPrice: 50 },
    '5x10': { label: t('units.sizeMedium'), sqft: 50, defaultPrice: 75 },
    '10x10': { label: t('units.sizeLarge'), sqft: 100, defaultPrice: 100 },
    '10x15': { label: t('units.sizeXL'), sqft: 150, defaultPrice: 150 },
    '10x20': { label: t('units.sizeXXL'), sqft: 200, defaultPrice: 200 }
  };

  // Initialize with sample data
  useEffect(() => {
    const sampleUnits = [
      {
        id: 1,
        unit_number: 'A101',
        floor: 1,
        size: '5x5',
        monthly_rate: 50,
        status: 'occupied',
        customer_name: 'John Doe',
        customer_phone: '(555) 123-4567',
        customer_email: 'john@example.com',
        rental_start: '2024-01-15',
        rental_end: '2024-07-15',
        notes: 'Paid through June'
      },
      {
        id: 2,
        unit_number: 'A102',
        floor: 1,
        size: '5x10',
        monthly_rate: 75,
        status: 'available',
        customer_name: '',
        customer_phone: '',
        customer_email: '',
        rental_start: '',
        rental_end: '',
        notes: ''
      },
      {
        id: 3,
        unit_number: 'A103',
        floor: 1,
        size: '10x10',
        monthly_rate: 100,
        status: 'occupied',
        customer_name: 'Sarah Johnson',
        customer_phone: '(555) 234-5678',
        customer_email: 'sarah@example.com',
        rental_start: '2024-02-01',
        rental_end: '2025-02-01',
        notes: 'Annual contract'
      },
      {
        id: 4,
        unit_number: 'B201',
        floor: 2,
        size: '10x15',
        monthly_rate: 150,
        status: 'available',
        customer_name: '',
        customer_phone: '',
        customer_email: '',
        rental_start: '',
        rental_end: '',
        notes: 'Climate controlled'
      },
      {
        id: 5,
        unit_number: 'B202',
        floor: 2,
        size: '5x5',
        monthly_rate: 55,
        status: 'maintenance',
        customer_name: '',
        customer_phone: '',
        customer_email: '',
        rental_start: '',
        rental_end: '',
        notes: 'Painting in progress'
      },
      {
        id: 6,
        unit_number: 'A104',
        floor: 1,
        size: '10x20',
        monthly_rate: 200,
        status: 'reserved',
        customer_name: 'Mike Brown',
        customer_phone: '(555) 345-6789',
        customer_email: 'mike@example.com',
        rental_start: '2024-02-01',
        rental_end: '',
        notes: 'Moving in next week'
      }
    ];
    setUnits(sampleUnits);
    setFilteredUnits(sampleUnits);
  }, []);

  // Filter units based on search and filters
  useEffect(() => {
    let filtered = units;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(unit =>
        unit.unit_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        unit.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by floor
    if (selectedFloor !== 'all') {
      filtered = filtered.filter(unit => unit.floor === parseInt(selectedFloor));
    }

    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(unit => unit.status === selectedStatus);
    }

    setFilteredUnits(filtered);
  }, [searchTerm, selectedFloor, selectedStatus, units]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-update price when size changes
    if (name === 'size' && unitSizes[value]) {
      setFormData(prev => ({
        ...prev,
        monthly_rate: unitSizes[value].defaultPrice
      }));
    }

    // Clear customer info if status changes to available
    if (name === 'status' && value === 'available') {
      setFormData(prev => ({
        ...prev,
        customer_id: '',
        customer_name: '',
        customer_phone: '',
        customer_email: '',
        rental_start: '',
        rental_end: ''
      }));
    }
    
    // Auto-fill customer information when customer is selected
    if (name === 'customer_id' && value) {
      const customer = getCustomerById(parseInt(value));
      if (customer) {
        setFormData(prev => ({
          ...prev,
          customer_name: customer.name,
          customer_phone: customer.phone,
          customer_email: customer.email
        }));
      }
    }
  };

  // Add or update unit
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingUnit) {
      // Update existing unit
      setUnits(prev => prev.map(unit =>
        unit.id === editingUnit.id
          ? { ...formData, id: unit.id }
          : unit
      ));
    } else {
      // Add new unit
      const newUnit = {
        ...formData,
        id: Date.now()
      };
      setUnits(prev => [...prev, newUnit]);
    }

    // Reset form
    setShowAddModal(false);
    setEditingUnit(null);
    setFormData({
      unit_number: '',
      floor: 1,
      size: '5x5',
      monthly_rate: 50,
      status: 'available',
      customer_name: '',
      customer_phone: '',
      customer_email: '',
      rental_start: '',
      rental_end: '',
      notes: ''
    });
  };

  // Edit unit
  const handleEdit = (unit) => {
    setEditingUnit(unit);
    setFormData(unit);
    setShowAddModal(true);
  };

  // Delete unit
  const handleDelete = (unitId) => {
    if (window.confirm(t('units.confirmDelete'))) {
      setUnits(prev => prev.filter(unit => unit.id !== unitId));
    }
  };

  // Calculate statistics
  const stats = {
    total: units.length,
    available: units.filter(u => u.status === 'available').length,
    occupied: units.filter(u => u.status === 'occupied').length,
    maintenance: units.filter(u => u.status === 'maintenance').length,
    reserved: units.filter(u => u.status === 'reserved').length,
    floor1: units.filter(u => u.floor === 1).length,
    floor2: units.filter(u => u.floor === 2).length,
    monthlyRevenue: units
      .filter(u => u.status === 'occupied')
      .reduce((sum, u) => sum + parseFloat(u.monthly_rate || 0), 0),
    occupancyRate: units.length > 0 
      ? Math.round((units.filter(u => u.status === 'occupied').length / units.length) * 100)
      : 0
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold gradient-text mb-2">{t('units.title')}</h1>
        <p className="text-gray-600">{t('units.subtitle')}</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
        <Card className="text-center">
          <Package className="w-8 h-8 mx-auto mb-2 text-primary-500" />
          <p className="text-2xl font-bold">{stats.total}</p>
          <p className="text-xs text-gray-600">{t('dashboard.totalUnits')}</p>
        </Card>

        <Card className="text-center">
          <Check className="w-8 h-8 mx-auto mb-2 text-success-500" />
          <p className="text-2xl font-bold">{stats.available}</p>
          <p className="text-xs text-gray-600">{t('units.available')}</p>
        </Card>

        <Card className="text-center">
          <Home className="w-8 h-8 mx-auto mb-2 text-blue-500" />
          <p className="text-2xl font-bold">{stats.occupied}</p>
          <p className="text-xs text-gray-600">{t('units.occupied')}</p>
        </Card>

        <Card className="text-center">
          <AlertCircle className="w-8 h-8 mx-auto mb-2 text-warning-500" />
          <p className="text-2xl font-bold">{stats.maintenance}</p>
          <p className="text-xs text-gray-600">{t('units.maintenance')}</p>
        </Card>

        <Card className="text-center">
          <Calendar className="w-8 h-8 mx-auto mb-2 text-purple-500" />
          <p className="text-2xl font-bold">{stats.reserved}</p>
          <p className="text-xs text-gray-600">{t('units.reserved')}</p>
        </Card>

        <Card className="text-center">
          <Layers className="w-8 h-8 mx-auto mb-2 text-gray-500" />
          <p className="text-2xl font-bold">{stats.floor1}/{stats.floor2}</p>
          <p className="text-xs text-gray-600">{t('units.floor')} 1/2</p>
        </Card>

        <Card className="text-center">
          <DollarSign className="w-8 h-8 mx-auto mb-2 text-success-600" />
          <p className="text-2xl font-bold">{formatCurrency(stats.monthlyRevenue)}</p>
          <p className="text-xs text-gray-600">{t('reports.monthlyRevenue')}</p>
        </Card>

        <Card className="text-center">
          <div className="w-8 h-8 mx-auto mb-2 flex items-center justify-center">
            <span className="text-2xl font-bold text-primary-600">{stats.occupancyRate}%</span>
          </div>
          <p className="text-xs text-gray-600">{t('dashboard.occupancyRate')}</p>
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
              placeholder={t('common.search') + '...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-64 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Floor Filter */}
          <select
            value={selectedFloor}
            onChange={(e) => setSelectedFloor(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">{t('common.all')} {t('units.floor')}</option>
            <option value="1">{t('units.floor')} 1</option>
            <option value="2">{t('units.floor')} 2</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">{t('common.all')} {t('common.status')}</option>
            <option value="available">{t('units.available')}</option>
            <option value="occupied">{t('units.occupied')}</option>
            <option value="maintenance">{t('units.maintenance')}</option>
            <option value="reserved">{t('units.reserved')}</option>
          </select>

          {/* View Mode */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-primary-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Grid3x3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-primary-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Add Unit Button */}
        <Button
          variant="gradient"
          onClick={() => setShowAddModal(true)}
        >
          <Plus className="w-5 h-5 mr-2" />
          {t('units.addUnit')}
        </Button>
      </div>

      {/* Units Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredUnits.map(unit => (
            <motion.div
              key={unit.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="hover:shadow-xl transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-xl">{unit.unit_number}</h3>
                    <p className="text-sm text-gray-500">{t('units.floor')} {unit.floor}</p>
                  </div>
                  <Badge
                    variant={
                      unit.status === 'available' ? 'success' :
                      unit.status === 'occupied' ? 'info' :
                      unit.status === 'maintenance' ? 'warning' :
                      'default'
                    }
                  >
                    {t(`units.${unit.status}`)}
                  </Badge>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{t('units.size')}:</span>
                    <span className="font-medium">{unit.size} {t('common.ft')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{t('units.monthlyRate')}:</span>
                    <span className="font-bold text-primary-600">{formatCurrency(unit.monthly_rate)}/{t('common.month') || 'mo'}</span>
                  </div>
                  {unit.customer_name && (
                    <>
                      <div className="pt-2 border-t">
                        <p className="text-sm font-medium">{unit.customer_name}</p>
                        <p className="text-xs text-gray-500">{unit.customer_phone}</p>
                      </div>
                      {unit.rental_end && (
                        <p className="text-xs text-gray-500">
                          {t('units.until')}: {new Date(unit.rental_end).toLocaleDateString()}
                        </p>
                      )}
                    </>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(unit)}
                    className="flex-1 p-2 text-primary-500 hover:bg-primary-50 rounded-lg transition-colors text-sm"
                  >
                    <Edit2 className="w-4 h-4 inline mr-1" />
                    {t('common.edit')}
                  </button>
                  <button
                    onClick={() => handleDelete(unit.id)}
                    className="p-2 text-danger-500 hover:bg-danger-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr>
                  <th className="text-left py-3 px-4">{t('units.unitNumber')}</th>
                  <th className="text-left py-3 px-4">{t('units.floor')}</th>
                  <th className="text-left py-3 px-4">{t('units.size')}</th>
                  <th className="text-left py-3 px-4">{t('units.monthlyRate')}</th>
                  <th className="text-left py-3 px-4">{t('common.status')}</th>
                  <th className="text-left py-3 px-4">{t('units.customer')}</th>
                  <th className="text-left py-3 px-4">{t('contracts.endDate')}</th>
                  <th className="text-center py-3 px-4">{t('common.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {filteredUnits.map(unit => (
                  <tr key={unit.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{unit.unit_number}</td>
                    <td className="py-3 px-4">{unit.floor}</td>
                    <td className="py-3 px-4">{unit.size} {t('common.ft')}</td>
                    <td className="py-3 px-4 font-bold">{formatCurrency(unit.monthly_rate)}</td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          unit.status === 'available' ? 'success' :
                          unit.status === 'occupied' ? 'info' :
                          unit.status === 'maintenance' ? 'warning' :
                          'default'
                        }
                      >
                        {t(`units.${unit.status}`)}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      {unit.customer_name && (
                        <div>
                          <p className="text-sm">{unit.customer_name}</p>
                          <p className="text-xs text-gray-500">{unit.customer_phone}</p>
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {unit.rental_end && new Date(unit.rental_end).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleEdit(unit)}
                          className="p-1.5 text-primary-500 hover:bg-primary-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(unit.id)}
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
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold">
                  {editingUnit ? t('units.editUnit') : t('units.addUnit')}
                </h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingUnit(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-2 gap-6">
                  {/* Unit Information */}
                  <div>
                    <h3 className="font-semibold mb-4">{t('units.unitDetails')}</h3>
                    
                    <div className="space-y-4">
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
                          placeholder={t('units.unitNumberPlaceholder')}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('units.floor')} *
                        </label>
                        <select
                          name="floor"
                          value={formData.floor}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                          <option value={1}>{t('units.floor')} 1</option>
                          <option value={2}>{t('units.floor')} 2</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('units.size')} *
                        </label>
                        <select
                          name="size"
                          value={formData.size}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                          {Object.entries(unitSizes).map(([value, info]) => (
                            <option key={value} value={value}>
                              {info.label} - {formatCurrency(info.defaultPrice)}/{t('common.month') || 'mo'}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('units.monthlyRate')} ({getCurrencySymbol()}) *
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
                          {t('common.status')} *
                        </label>
                        <select
                          name="status"
                          value={formData.status}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                          <option value="available">{t('units.available')}</option>
                          <option value="occupied">{t('units.occupied')}</option>
                          <option value="maintenance">{t('units.maintenance')}</option>
                          <option value="reserved">{t('units.reserved')}</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Customer Information */}
                  <div>
                    <h3 className="font-semibold mb-4">
                      {t('customers.contactInfo')} 
                      {formData.status === 'available' && (
                        <span className="text-sm font-normal text-gray-500 ml-2">
                          {t('units.notRequiredForAvailable')}
                        </span>
                      )}
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('units.assignCustomer')}
                        </label>
                        <select
                          name="customer_id"
                          value={formData.customer_id}
                          onChange={handleInputChange}
                          disabled={formData.status === 'available'}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-50"
                        >
                          <option value="">{t('units.assignCustomer')}</option>
                          {customers.map(customer => (
                            <option key={customer.id} value={customer.id}>
                              {customer.name} - {customer.phone}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('customers.customerName')}
                        </label>
                        <input
                          type="text"
                          name="customer_name"
                          value={formData.customer_name}
                          onChange={handleInputChange}
                          disabled={formData.status === 'available'}
                          readOnly
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-50 bg-gray-50"
                          placeholder={t('units.autoFilledFromCustomer')}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('customers.phone')}
                        </label>
                        <input
                          type="tel"
                          name="customer_phone"
                          value={formData.customer_phone}
                          onChange={handleInputChange}
                          disabled={formData.status === 'available'}
                          readOnly
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-50 bg-gray-50"
                          placeholder={t('units.autoFilledFromCustomer')}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('customers.email')}
                        </label>
                        <input
                          type="email"
                          name="customer_email"
                          value={formData.customer_email}
                          onChange={handleInputChange}
                          disabled={formData.status === 'available'}
                          readOnly
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-50 bg-gray-50"
                          placeholder={t('units.autoFilledFromCustomer')}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('contracts.startDate')}
                        </label>
                        <input
                          type="date"
                          name="rental_start"
                          value={formData.rental_start}
                          onChange={handleInputChange}
                          disabled={formData.status === 'available'}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-50"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('contracts.endDate')}
                        </label>
                        <input
                          type="date"
                          name="rental_end"
                          value={formData.rental_end}
                          onChange={handleInputChange}
                          disabled={formData.status === 'available'}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-50"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('units.notes')}
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder={t('units.anyAdditionalInfo')}
                  />
                </div>

                {/* Actions */}
                <div className="mt-6 flex justify-end gap-4">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingUnit(null);
                    }}
                  >
                    {t('common.cancel')}
                  </Button>
                  <Button type="submit" variant="gradient">
                    <Save className="w-5 h-5 mr-2" />
                    {editingUnit ? t('common.save') : t('units.addUnit')}
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

export default StorageUnits;