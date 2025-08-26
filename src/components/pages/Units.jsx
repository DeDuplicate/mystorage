import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import {
  Package,
  Search,
  Filter,
  Grid3x3,
  List,
  MapPin,
  Maximize,
  DollarSign,
  User,
  Calendar,
  MoreVertical,
  Edit,
  Eye,
  Trash2
} from 'lucide-react';

const Units = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Sample units data
  const units = [
    { id: 'A-101', size: '5x5', status: 'available', price: 50, floor: 1, type: 'Small' },
    { id: 'A-102', size: '5x10', status: 'occupied', price: 75, customer: 'John Doe', contractEnd: '2024-03-15', floor: 1, type: 'Medium' },
    { id: 'A-103', size: '10x10', status: 'occupied', price: 100, customer: 'Jane Smith', contractEnd: '2024-02-28', floor: 1, type: 'Large' },
    { id: 'A-104', size: '10x15', status: 'maintenance', price: 125, floor: 1, type: 'Large' },
    { id: 'B-201', size: '5x5', status: 'available', price: 50, floor: 2, type: 'Small' },
    { id: 'B-202', size: '10x20', status: 'occupied', price: 150, customer: 'Mike Johnson', contractEnd: '2024-04-10', floor: 2, type: 'Extra Large' },
    { id: 'B-203', size: '5x10', status: 'overdue', price: 75, customer: 'Sarah Wilson', contractEnd: '2023-12-15', floor: 2, type: 'Medium' },
    { id: 'B-204', size: '10x10', status: 'available', price: 100, floor: 2, type: 'Large' },
    { id: 'C-301', size: '10x15', status: 'occupied', price: 125, customer: 'Robert Brown', contractEnd: '2024-05-20', floor: 3, type: 'Large' },
    { id: 'C-302', size: '10x20', status: 'available', price: 150, floor: 3, type: 'Extra Large' },
  ];

  const statusColors = {
    available: 'available',
    occupied: 'occupied',
    maintenance: 'maintenance',
    overdue: 'overdue'
  };

  const statusCounts = {
    all: units.length,
    available: units.filter(u => u.status === 'available').length,
    occupied: units.filter(u => u.status === 'occupied').length,
    maintenance: units.filter(u => u.status === 'maintenance').length,
    overdue: units.filter(u => u.status === 'overdue').length,
  };

  const filteredUnits = units.filter(unit => {
    const matchesFilter = filterStatus === 'all' || unit.status === filterStatus;
    const matchesSearch = unit.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (unit.customer && unit.customer.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const UnitCard = ({ unit }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="relative overflow-hidden group">
        <div className={`absolute top-0 left-0 w-full h-1 ${statusColors[unit.status]}`} />
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Unit {unit.id}</h3>
              <Badge variant={unit.status} size="sm">
                {unit.status}
              </Badge>
            </div>
            <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
              <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center text-gray-600 dark:text-gray-300">
              <Maximize className="w-4 h-4 mr-2" />
              <span>{unit.size} ({unit.type})</span>
            </div>
            <div className="flex items-center text-gray-600 dark:text-gray-300">
              <MapPin className="w-4 h-4 mr-2" />
              <span>Floor {unit.floor}</span>
            </div>
            <div className="flex items-center font-semibold text-gray-900 dark:text-gray-100">
              <DollarSign className="w-4 h-4 mr-2" />
              <span>${unit.price}/month</span>
            </div>
            {unit.customer && (
              <>
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <User className="w-4 h-4 mr-2" />
                  <span>{unit.customer}</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>Ends: {unit.contractEnd}</span>
                </div>
              </>
            )}
          </div>

          <div className="mt-4 flex space-x-2">
            <Button size="sm" variant="outline" className="flex-1">
              <Eye className="w-3 h-3 mr-1" />
              View
            </Button>
            {unit.status === 'available' ? (
              <Button size="sm" variant="primary" className="flex-1">
                Reserve
              </Button>
            ) : (
              <Button size="sm" variant="secondary" className="flex-1">
                <Edit className="w-3 h-3 mr-1" />
                Edit
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const UnitListItem = ({ unit }) => (
    <motion.tr
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ backgroundColor: 'rgba(249, 250, 251, 0.5)' }}
      className="border-b border-gray-100 dark:border-gray-700"
    >
      <td className="px-6 py-4">
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${statusColors[unit.status]}`} />
          <span className="font-medium text-gray-900 dark:text-gray-100">{unit.id}</span>
        </div>
      </td>
      <td className="px-6 py-4">
        <Badge variant={unit.status}>{unit.status}</Badge>
      </td>
      <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{unit.size}</td>
      <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{unit.type}</td>
      <td className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100">${unit.price}</td>
      <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{unit.customer || '-'}</td>
      <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{unit.contractEnd || '-'}</td>
      <td className="px-6 py-4">
        <div className="flex space-x-2">
          <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
            <Eye className="w-4 h-4 text-gray-600 dark:text-gray-300" />
          </button>
          <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
            <Edit className="w-4 h-4 text-gray-600 dark:text-gray-300" />
          </button>
          <button className="p-1 hover:bg-red-50 dark:hover:bg-red-900/30 rounded">
            <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
          </button>
        </div>
      </td>
    </motion.tr>
  );

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Storage Units</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage and monitor all storage units</p>
        </div>
        <Button variant="primary">
          <Package className="w-4 h-4 mr-2" />
          Add New Unit
        </Button>
      </motion.div>

      {/* Status Overview */}
      <div className="grid grid-cols-5 gap-4">
        {Object.entries(statusCounts).map(([status, count]) => (
          <motion.button
            key={status}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => setFilterStatus(status)}
            className={`p-4 rounded-xl transition-all ${
              filterStatus === status
                ? 'glass dark:glass-dark shadow-lg scale-105'
                : 'bg-white dark:bg-gray-800 hover:shadow-md'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300 capitalize">{status}</span>
              <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">{count}</span>
            </div>
            {status !== 'all' && (
              <div className={`mt-2 h-1 rounded-full ${statusColors[status]}`} />
            )}
          </motion.button>
        ))}
      </div>

      {/* Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by unit ID or customer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Grid3x3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Units Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredUnits.map((unit) => (
            <UnitCard key={unit.id} unit={unit} />
          ))}
        </div>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-600">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Unit ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Size</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Contract End</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUnits.map((unit) => (
                  <UnitListItem key={unit.id} unit={unit} />
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Units;