import React from 'react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../ui/LanguageSwitcher';
import {
  Home,
  Package,
  Users,
  FileText,
  DollarSign,
  FolderOpen,
  Settings,
  Bell,
  LogOut,
  BarChart3,
  Calendar
} from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const { t } = useTranslation();
  
  const menuItems = [
    { id: 'dashboard', label: t('navigation.dashboard'), icon: Home },
    { id: 'units', label: t('navigation.units'), icon: Package },
    { id: 'customers', label: t('navigation.customers'), icon: Users },
    { id: 'contracts', label: t('navigation.contracts'), icon: FileText },
    { id: 'payments', label: t('navigation.payments'), icon: DollarSign },
    { id: 'documents', label: t('navigation.documents'), icon: FolderOpen },
    { id: 'calendar', label: t('navigation.calendar'), icon: Calendar },
    { id: 'reports', label: t('navigation.reports'), icon: BarChart3 },
  ];

  const bottomItems = [
    { id: 'notifications', label: t('navigation.notifications'), icon: Bell, badge: 3 },
    { id: 'settings', label: t('navigation.settings'), icon: Settings },
    { id: 'logout', label: t('common.logout'), icon: LogOut },
  ];

  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-64 h-screen glass border-r border-gray-200/20 flex flex-col"
    >
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-200/20">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="flex items-center space-x-3"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg">
            <Package className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold gradient-text">StoreSpace</h1>
            <p className="text-xs text-gray-500">Management System</p>
          </div>
        </motion.div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item, index) => (
          <motion.button
            key={item.id}
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              'w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200',
              'hover:bg-white/50 hover:shadow-md group',
              activeTab === item.id
                ? 'bg-gradient-to-r from-primary-500/20 to-accent-500/20 shadow-md border border-primary-500/30'
                : 'hover:translate-x-1'
            )}
          >
            <item.icon
              className={cn(
                'w-5 h-5 transition-colors',
                activeTab === item.id
                  ? 'text-primary-600'
                  : 'text-gray-600 group-hover:text-primary-500'
              )}
            />
            <span
              className={cn(
                'font-medium transition-colors',
                activeTab === item.id
                  ? 'text-primary-700'
                  : 'text-gray-700 group-hover:text-gray-900'
              )}
            >
              {item.label}
            </span>
            {activeTab === item.id && (
              <motion.div
                layoutId="activeIndicator"
                className="ml-auto w-1 h-6 bg-gradient-to-b from-primary-500 to-accent-500 rounded-full"
              />
            )}
          </motion.button>
        ))}
      </nav>

      {/* Bottom Navigation */}
      <div className="p-4 border-t border-gray-200/20 space-y-1">
        {bottomItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-white/50 transition-all duration-200 group relative"
          >
            <item.icon className="w-5 h-5 text-gray-600 group-hover:text-primary-500" />
            <span className="font-medium text-gray-700 group-hover:text-gray-900">
              {item.label}
            </span>
            {item.badge && (
              <span className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Language Switcher */}
      <div className="p-4 border-t border-gray-200/20">
        <LanguageSwitcher />
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200/20">
        <div className="flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-r from-primary-50 to-accent-50">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center text-white font-semibold">
            AD
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-800">Admin User</p>
            <p className="text-xs text-gray-500">admin@storespace.com</p>
          </div>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;