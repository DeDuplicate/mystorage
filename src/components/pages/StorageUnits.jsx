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
    size: 25, // Now storing square footage directly
    size_preset: '', // Selected preset ID
    use_custom_size: false,
    monthly_rate: 50,
    rent_calculation_mode: 'manual', // 'manual' or 'calculated'
    status: 'available',
    customer_id: '',
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    rental_start: '',
    rental_end: '',
    notes: ''
  });

  // Load unit size presets from localStorage (from Settings)
  const [unitSizePresets, setUnitSizePresets] = useState([
    { id: 1, name: 'Small', size: 25, rentPerSqFt: 1.2 },
    { id: 2, name: 'Medium', size: 50, rentPerSqFt: 1.0 },
    { id: 3, name: 'Large', size: 100, rentPerSqFt: 0.9 },
    { id: 4, name: 'Extra Large', size: 200, rentPerSqFt: 0.8 }
  ]);

  // Load presets from settings
  useEffect(() => {
    const savedSettings = localStorage.getItem('storageSettings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        if (settings.unitSizes && settings.unitSizes.presets) {
          setUnitSizePresets(settings.unitSizes.presets);
        }
      } catch (error) {
        console.log('Error loading unit size presets:', error);
      }
    }
  }, []);

  // Handle preset size selection
  const handlePresetChange = (presetId) => {
    const preset = unitSizePresets.find(p => p.id === parseInt(presetId));
    if (preset) {
      setFormData(prev => ({
        ...prev,
        size_preset: presetId,
        size: preset.size,
        monthly_rate: formData.rent_calculation_mode === 'calculated' ? preset.size * preset.rentPerSqFt : prev.monthly_rate,
        use_custom_size: false
      }));
    } else {
      // Custom size selected
      setFormData(prev => ({
        ...prev,
        size_preset: '',
        use_custom_size: true
      }));
    }
  };

  // Handle rent calculation mode change
  const handleRentCalculationModeChange = (mode) => {
    setFormData(prev => {
      let newRate = prev.monthly_rate;
      if (mode === 'calculated' && prev.size_preset) {
        const preset = unitSizePresets.find(p => p.id === parseInt(prev.size_preset));
        if (preset) {
          newRate = prev.size * preset.rentPerSqFt;
        }
      }
      return {
        ...prev,
        rent_calculation_mode: mode,
        monthly_rate: newRate
      };
    });
  };

  // Initialize with sample data
  useEffect(() => {
    const sampleUnits = [
      {
        id: 1,
        unit_number: 'A101',
        floor: 1,
        size: 25,
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
        size: 50,
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
        size: 100,
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
        size: 150,
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
        size: 200,
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

                      {/* Unit Size Selection */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('units.size')} *
                        </label>
                        <select
                          name="size_preset"
                          value={formData.size_preset}
                          onChange={(e) => handlePresetChange(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                          <option value="">{t('settings.selectPresetSize')}</option>
                          {unitSizePresets.map((preset) => (
                            <option key={preset.id} value={preset.id}>
                              {preset.name} - {preset.size} sq ft - {getCurrencySymbol()}{preset.rentPerSqFt}/sq ft
                            </option>
                          ))}
                          <option value="custom">{t('settings.customSize')}</option>
                        </select>
                        {formData.size_preset && formData.size_preset !== 'custom' && (
                          <p className="text-xs text-gray-500 mt-1">
                            {t('settings.orEnterCustom')}
                          </p>
                        )}
                      </div>

                      {/* Custom Size Input */}
                      {(formData.use_custom_size || formData.size_preset === 'custom') && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('settings.customSize')} (sq ft) *
                          </label>
                          <input
                            type="number"
                            name="size"
                            value={formData.size}
                            onChange={(e) => setFormData(prev => ({...prev, size: parseFloat(e.target.value) || 0}))}
                            min="1"
                            required
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder="Enter size in square feet"
                          />
                        </div>
                      )}

                      {/* Rent Calculation */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-sm font-medium text-gray-700">
                            {t('units.monthlyRate')} ({getCurrencySymbol()}) *
                          </label>
                          <div className="flex items-center text-xs">
                            <input
                              type="radio"
                              id="manual"
                              name="rent_calculation_mode"
                              value="manual"
                              checked={formData.rent_calculation_mode === 'manual'}
                              onChange={(e) => handleRentCalculationModeChange(e.target.value)}
                              className="mr-1"
                            />
                            <label htmlFor="manual" className="mr-3">{t('settings.manualOverride')}</label>
                            <input
                              type="radio"
                              id="calculated"
                              name="rent_calculation_mode"
                              value="calculated"
                              checked={formData.rent_calculation_mode === 'calculated'}
                              onChange={(e) => handleRentCalculationModeChange(e.target.value)}
                              className="mr-1"
                              disabled={!formData.size_preset || formData.size_preset === 'custom'}
                            />
                            <label htmlFor="calculated" className="text-xs">{t('settings.calculateFromRate')}</label>
                          </div>
                        </div>
                        <input
                          type="number"
                          name="monthly_rate"
                          value={formData.monthly_rate}
                          onChange={(e) => setFormData(prev => ({...prev, monthly_rate: parseFloat(e.target.value) || 0}))}
                          required
                          min="0"
                          step="0.01"
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          disabled={formData.rent_calculation_mode === 'calculated' && formData.size_preset && formData.size_preset !== 'custom'}
                        />
                        {formData.rent_calculation_mode === 'calculated' && formData.size_preset && formData.size_preset !== 'custom' && (
                          <p className="text-xs text-gray-500 mt-1">
                            {t('settings.basedOnSize')}: {formData.size} sq ft × {getCurrencySymbol()}{unitSizePresets.find(p => p.id === parseInt(formData.size_preset))?.rentPerSqFt}/sq ft
                          </p>
                        )}
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