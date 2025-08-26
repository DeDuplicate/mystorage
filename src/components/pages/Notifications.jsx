import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from '../../utils/currency';
import { useAppContext } from '../../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import {
  Bell,
  BellRing,
  BellOff,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  Calendar,
  User,
  Home,
  FileText,
  Settings,
  Search,
  Filter,
  MoreHorizontal,
  Archive,
  Trash2,
  Eye,
  EyeOff,
  Send,
  Mail,
  Phone,
  MessageSquare,
  Zap,
  AlertTriangle,
  Info,
  X,
  Plus,
  RefreshCw,
  Volume2,
  VolumeX
} from 'lucide-react';

const Notifications = () => {
  const { t } = useTranslation();
  const {
    customers,
    units,
    contracts,
    payments,
    documents
  } = useAppContext();

  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    contractExpiry: { enabled: true, days: 30, methods: ['email', 'app'] },
    paymentDue: { enabled: true, days: 5, methods: ['email', 'sms', 'app'] },
    paymentOverdue: { enabled: true, days: 1, methods: ['email', 'sms', 'app'] },
    maintenanceReminder: { enabled: true, days: 7, methods: ['email', 'app'] },
    documentExpiry: { enabled: true, days: 30, methods: ['email', 'app'] },
    lowOccupancy: { enabled: true, threshold: 70, methods: ['email', 'app'] },
    newCustomer: { enabled: true, methods: ['app'] },
    systemAlerts: { enabled: true, methods: ['email', 'app'] }
  });

  // Notification categories and priorities
  const notificationCategories = {
    contract: { label: t('navigation.contracts'), icon: FileText, color: 'blue' },
    payment: { label: t('navigation.payments'), icon: DollarSign, color: 'green' },
    maintenance: { label: t('units.maintenance'), icon: Home, color: 'orange' },
    customer: { label: t('navigation.customers'), icon: User, color: 'purple' },
    system: { label: t('settings.system'), icon: Zap, color: 'gray' },
    document: { label: t('navigation.documents'), icon: FileText, color: 'indigo' }
  };

  const priorityLevels = {
    high: { label: t('notifications.high'), color: 'red', icon: AlertTriangle },
    medium: { label: t('notifications.medium'), color: 'yellow', icon: AlertCircle },
    low: { label: t('notifications.low'), color: 'blue', icon: Info }
  };

  // Generate automated notifications
  useEffect(() => {
    const generateNotifications = () => {
      const now = new Date();
      const generatedNotifications = [];
      let notificationId = 1;

      // Contract expiration notifications
      if (notificationSettings.contractExpiry.enabled) {
        const expiringContracts = contracts.filter(contract => {
          if (!contract.end_date) return false;
          const endDate = new Date(contract.end_date);
          const daysUntilExpiry = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
          return daysUntilExpiry <= notificationSettings.contractExpiry.days && daysUntilExpiry > 0;
        });

        expiringContracts.forEach(contract => {
          const daysUntilExpiry = Math.ceil((new Date(contract.end_date) - now) / (1000 * 60 * 60 * 24));
          generatedNotifications.push({
            id: notificationId++,
            category: 'contract',
            priority: daysUntilExpiry <= 7 ? 'high' : 'medium',
            title: t('notifications.contractExpiry'),
            message: t('notifications.contractExpiringMessage', { 
              contractNumber: contract.contract_number, 
              customerName: contract.customer_name, 
              days: daysUntilExpiry 
            }),
            timestamp: new Date().toISOString(),
            read: false,
            actionRequired: true,
            relatedId: contract.id,
            relatedType: 'contract',
            actions: [t('notifications.renewContract'), t('notifications.contactCustomer'), t('notifications.markAsHandled')]
          });
        });
      }

      // Payment due notifications
      if (notificationSettings.paymentDue.enabled) {
        const upcomingPayments = payments.filter(payment => {
          if (payment.status !== 'pending') return false;
          const dueDate = new Date(payment.dueDate);
          const daysUntilDue = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));
          return daysUntilDue <= notificationSettings.paymentDue.days && daysUntilDue > 0;
        });

        upcomingPayments.forEach(payment => {
          const daysUntilDue = Math.ceil((new Date(payment.dueDate) - now) / (1000 * 60 * 60 * 24));
          generatedNotifications.push({
            id: notificationId++,
            category: 'payment',
            priority: daysUntilDue <= 2 ? 'high' : 'medium',
            title: t('notifications.paymentDue'),
            message: t('notifications.paymentDueMessage', { 
              amount: formatCurrency(payment.amount), 
              customer: payment.customer, 
              days: daysUntilDue 
            }),
            timestamp: new Date().toISOString(),
            read: false,
            actionRequired: true,
            relatedId: payment.id,
            relatedType: 'payment',
            actions: [t('notifications.sendReminder'), t('notifications.processPayment'), t('notifications.markAsHandled')]
          });
        });
      }

      // Overdue payment notifications
      if (notificationSettings.paymentOverdue.enabled) {
        const overduePayments = payments.filter(payment => payment.status === 'overdue');

        overduePayments.forEach(payment => {
          generatedNotifications.push({
            id: notificationId++,
            category: 'payment',
            priority: 'high',
            title: t('notifications.paymentOverdue'),
            message: t('notifications.paymentOverdueMessage', { 
              amount: formatCurrency(payment.amount), 
              customer: payment.customer, 
              days: payment.daysOverdue || 1 
            }),
            timestamp: new Date().toISOString(),
            read: false,
            actionRequired: true,
            relatedId: payment.id,
            relatedType: 'payment',
            actions: [t('notifications.contactCustomer'), t('notifications.sendFinalNotice'), t('notifications.startCollectionProcess')]
          });
        });
      }

      // Maintenance notifications
      if (notificationSettings.maintenanceReminder.enabled) {
        const maintenanceUnits = units.filter(unit => unit.status === 'maintenance');

        maintenanceUnits.forEach(unit => {
          generatedNotifications.push({
            id: notificationId++,
            category: 'maintenance',
            priority: 'medium',
            title: t('notifications.maintenanceReminder'),
            message: t('notifications.unitMaintenanceMessage', { 
              unitNumber: unit.unit_number, 
              notes: unit.notes 
            }),
            timestamp: new Date().toISOString(),
            read: false,
            actionRequired: true,
            relatedId: unit.id,
            relatedType: 'unit',
            actions: [t('notifications.checkProgress'), t('notifications.markComplete'), t('notifications.scheduleInspection')]
          });
        });
      }

      // Document expiry notifications
      if (notificationSettings.documentExpiry.enabled && documents.length > 0) {
        const expiringDocuments = documents.filter(doc => {
          if (!doc.expiry_date) return false;
          const expiryDate = new Date(doc.expiry_date);
          const daysUntilExpiry = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));
          return daysUntilExpiry <= notificationSettings.documentExpiry.days && daysUntilExpiry > 0;
        });

        expiringDocuments.forEach(doc => {
          const daysUntilExpiry = Math.ceil((new Date(doc.expiry_date) - now) / (1000 * 60 * 60 * 24));
          generatedNotifications.push({
            id: notificationId++,
            category: 'document',
            priority: daysUntilExpiry <= 7 ? 'high' : 'medium',
            title: t('notifications.documentExpiry'),
            message: t('notifications.documentExpiringMessage', { 
              documentName: doc.name, 
              customerName: doc.customer_name, 
              days: daysUntilExpiry 
            }),
            timestamp: new Date().toISOString(),
            read: false,
            actionRequired: true,
            relatedId: doc.id,
            relatedType: 'document',
            actions: [t('notifications.requestUpdate'), t('notifications.contactCustomer'), t('notifications.markAsHandled')]
          });
        });
      }

      // Low occupancy alert
      if (notificationSettings.lowOccupancy.enabled) {
        const totalUnits = units.length;
        const occupiedUnits = units.filter(u => u.status === 'occupied').length;
        const occupancyRate = totalUnits > 0 ? (occupiedUnits / totalUnits) * 100 : 0;

        if (occupancyRate < notificationSettings.lowOccupancy.threshold) {
          generatedNotifications.push({
            id: notificationId++,
            category: 'system',
            priority: 'medium',
            title: t('notifications.lowOccupancy'),
            message: t('notifications.lowOccupancyMessage', { 
              rate: occupancyRate.toFixed(1), 
              occupied: occupiedUnits, 
              total: totalUnits 
            }),
            timestamp: new Date().toISOString(),
            read: false,
            actionRequired: false,
            relatedId: null,
            relatedType: 'system',
            actions: [t('notifications.reviewMarketing'), t('notifications.adjustPricing'), t('notifications.dismiss')]
          });
        }
      }

      // System notifications (sample)
      if (notificationSettings.systemAlerts.enabled) {
        generatedNotifications.push({
          id: notificationId++,
          category: 'system',
          priority: 'low',
          title: t('notifications.systemBackupComplete'),
          message: t('notifications.systemBackupMessage'),
          timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
          read: true,
          actionRequired: false,
          relatedId: null,
          relatedType: 'system',
          actions: [t('notifications.viewReport')]
        });

        generatedNotifications.push({
          id: notificationId++,
          category: 'customer',
          priority: 'low',
          title: t('notifications.newCustomer'),
          message: t('notifications.newCustomerInquiryMessage'),
          timestamp: new Date(now.getTime() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
          read: false,
          actionRequired: true,
          relatedId: null,
          relatedType: 'customer',
          actions: [t('notifications.viewInquiry'), t('notifications.contactCustomer'), t('notifications.assignAgent')]
        });
      }

      setNotifications(generatedNotifications);
      setFilteredNotifications(generatedNotifications);
    };

    generateNotifications();
  }, [contracts, payments, units, documents, notificationSettings]);

  // Filter notifications
  useEffect(() => {
    let filtered = notifications;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(notification => notification.category === selectedCategory);
    }

    if (selectedPriority !== 'all') {
      filtered = filtered.filter(notification => notification.priority === selectedPriority);
    }

    if (searchTerm) {
      filtered = filtered.filter(notification =>
        notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notification.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredNotifications(filtered);
  }, [notifications, selectedCategory, selectedPriority, searchTerm]);

  // Mark notification as read
  const markAsRead = (notificationId) => {
    setNotifications(prev => prev.map(notification =>
      notification.id === notificationId
        ? { ...notification, read: true }
        : notification
    ));
  };

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notification => ({
      ...notification,
      read: true
    })));
  };

  // Delete notification
  const deleteNotification = (notificationId) => {
    setNotifications(prev => prev.filter(notification => notification.id !== notificationId));
  };

  // Handle notification action
  const handleAction = (notification, action) => {
    console.log(`Handling action: ${action} for notification:`, notification);
    markAsRead(notification.id);
  };

  // Calculate statistics
  const stats = {
    total: notifications.length,
    unread: notifications.filter(n => !n.read).length,
    high: notifications.filter(n => n.priority === 'high').length,
    actionRequired: notifications.filter(n => n.actionRequired && !n.read).length,
    byCategory: Object.keys(notificationCategories).reduce((acc, category) => {
      acc[category] = notifications.filter(n => n.category === category).length;
      return acc;
    }, {})
  };

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 1) return t('notifications.justNow');
    if (diffInMinutes < 60) return t('notifications.minutesAgo', { count: diffInMinutes });
    if (diffInMinutes < 1440) return t('notifications.hoursAgo', { count: Math.floor(diffInMinutes / 60) });
    return date.toLocaleDateString();
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold gradient-text mb-2">{t('notifications.title')}</h1>
        <p className="text-gray-600">{t('notifications.subtitle')}</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
        <Card className="text-center bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <Bell className="w-8 h-8 mx-auto mb-2 text-blue-500" />
          <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
          <p className="text-xs text-blue-600">{t('common.all')}</p>
        </Card>

        <Card className="text-center bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
          <BellRing className="w-8 h-8 mx-auto mb-2 text-orange-500" />
          <p className="text-2xl font-bold text-orange-900">{stats.unread}</p>
          <p className="text-xs text-orange-600">{t('notifications.unread')}</p>
        </Card>

        <Card className="text-center bg-gradient-to-br from-red-50 to-pink-50 border-red-200">
          <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-red-500" />
          <p className="text-2xl font-bold text-red-900">{stats.high}</p>
          <p className="text-xs text-red-600">{t('notifications.highPriority')}</p>
        </Card>

        <Card className="text-center bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <Zap className="w-8 h-8 mx-auto mb-2 text-purple-500" />
          <p className="text-2xl font-bold text-purple-900">{stats.actionRequired}</p>
          <p className="text-xs text-purple-600">{t('notifications.actionRequired')}</p>
        </Card>

        <Card className="text-center bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <FileText className="w-8 h-8 mx-auto mb-2 text-green-500" />
          <p className="text-2xl font-bold text-green-900">{stats.byCategory.contract || 0}</p>
          <p className="text-xs text-green-600">{t('navigation.contracts')}</p>
        </Card>

        <Card className="text-center bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200">
          <DollarSign className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
          <p className="text-2xl font-bold text-yellow-900">{stats.byCategory.payment || 0}</p>
          <p className="text-xs text-yellow-600">{t('navigation.payments')}</p>
        </Card>
      </div>

      {/* Controls */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={t('notifications.searchNotifications')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-64 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">{t('notifications.allNotifications')}</option>
            {Object.entries(notificationCategories).map(([key, category]) => (
              <option key={key} value={key}>
                {category.label}
              </option>
            ))}
          </select>

          {/* Priority Filter */}
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">{t('notifications.allPriorities')}</option>
            {Object.entries(priorityLevels).map(([key, priority]) => (
              <option key={key} value={key}>
{t('notifications.priorityLevel', { level: priority.label })}
              </option>
            ))}
          </select>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={markAllAsRead}
            disabled={stats.unread === 0}
          >
            <CheckCircle className="w-4 h-4 mr-2" />
{t('notifications.markAllAsRead')}
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowSettings(true)}
          >
            <Settings className="w-4 h-4 mr-2" />
{t('common.settings')}
          </Button>
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
{t('common.refresh')}
          </Button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <Card className="text-center py-12">
            <BellOff className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">{t('notifications.noNotifications')}</h3>
            <p className="text-gray-500">
              {notifications.length === 0 
                ? t('notifications.allCaughtUp')
                : t('notifications.noMatchingNotifications')}
            </p>
          </Card>
        ) : (
          filteredNotifications.map((notification) => {
            const categoryInfo = notificationCategories[notification.category];
            const priorityInfo = priorityLevels[notification.priority];
            const CategoryIcon = categoryInfo.icon;
            const PriorityIcon = priorityInfo.icon;

            return (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <Card className={`${!notification.read ? 'border-l-4 border-l-primary-500 bg-primary-50' : 'border-l-4 border-l-gray-200'} hover:shadow-md transition-shadow`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        {/* Icon */}
                        <div className={`p-2 rounded-lg bg-${categoryInfo.color}-100`}>
                          <CategoryIcon className={`w-5 h-5 text-${categoryInfo.color}-600`} />
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className={`font-semibold text-lg ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                              {notification.title}
                            </h3>
                            <Badge variant={priorityInfo.color}>
                              <PriorityIcon className="w-3 h-3 mr-1" />
                              {priorityInfo.label}
                            </Badge>
                            <Badge variant={categoryInfo.color}>
                              {categoryInfo.label}
                            </Badge>
                            {notification.actionRequired && (
                              <Badge variant="warning">
                                <Zap className="w-3 h-3 mr-1" />
                                {t('notifications.actionRequired')}
                              </Badge>
                            )}
                          </div>

                          <p className={`mb-3 ${!notification.read ? 'text-gray-800' : 'text-gray-600'}`}>
                            {notification.message}
                          </p>

                          {/* Actions */}
                          {notification.actions && notification.actions.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-3">
                              {notification.actions.map((action, index) => (
                                <Button
                                  key={index}
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleAction(notification, action)}
                                >
                                  {action}
                                </Button>
                              ))}
                            </div>
                          )}

                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">
                              {formatTimestamp(notification.timestamp)}
                            </span>
                            <div className="flex items-center space-x-2">
                              {!notification.read && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => markAsRead(notification.id)}
                                >
                                  <Eye className="w-4 h-4 mr-1" />
                                  {t('notifications.markAsRead')}
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteNotification(notification.id)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowSettings(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold">{t('notifications.notificationSettings')}</h2>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6">
                <div className="space-y-6">
                  {Object.entries(notificationSettings).map(([key, setting]) => (
                    <Card key={key} className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-lg capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </h3>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={setting.enabled}
                            onChange={(e) => setNotificationSettings(prev => ({
                              ...prev,
                              [key]: { ...setting, enabled: e.target.checked }
                            }))}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                        </label>
                      </div>

                      {setting.enabled && (
                        <div className="space-y-4">
                          {setting.days && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                {t('notifications.alertDaysBefore', { days: setting.days })}
                              </label>
                              <input
                                type="number"
                                min="1"
                                max="365"
                                value={setting.days}
                                onChange={(e) => setNotificationSettings(prev => ({
                                  ...prev,
                                  [key]: { ...setting, days: parseInt(e.target.value) }
                                }))}
                                className="w-24 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                              />
                            </div>
                          )}

                          {setting.threshold && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                {t('notifications.alertBelowThreshold', { threshold: setting.threshold })}
                              </label>
                              <input
                                type="number"
                                min="1"
                                max="100"
                                value={setting.threshold}
                                onChange={(e) => setNotificationSettings(prev => ({
                                  ...prev,
                                  [key]: { ...setting, threshold: parseInt(e.target.value) }
                                }))}
                                className="w-24 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                              />
                            </div>
                          )}

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              {t('notifications.notificationMethods')}
                            </label>
                            <div className="flex flex-wrap gap-2">
                              {['email', 'sms', 'app'].map(method => (
                                <label key={method} className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    checked={setting.methods.includes(method)}
                                    onChange={(e) => {
                                      const newMethods = e.target.checked
                                        ? [...setting.methods, method]
                                        : setting.methods.filter(m => m !== method);
                                      setNotificationSettings(prev => ({
                                        ...prev,
                                        [key]: { ...setting, methods: newMethods }
                                      }));
                                    }}
                                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                  />
                                  <span className="text-sm capitalize">{method}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </Card>
                  ))}
                </div>

                <div className="mt-8 flex justify-end gap-4">
                  <Button
                    variant="secondary"
                    onClick={() => setShowSettings(false)}
                  >
                    {t('common.cancel')}
                  </Button>
                  <Button
                    variant="gradient"
                    onClick={() => setShowSettings(false)}
                  >
                    {t('notifications.saveSettings')}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Notifications;