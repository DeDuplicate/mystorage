import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import {
  Settings as SettingsIcon,
  User,
  Building,
  Bell,
  Shield,
  Database,
  Palette,
  Globe,
  Key,
  Mail,
  Phone,
  Clock,
  DollarSign,
  Percent,
  FileText,
  Download,
  Upload,
  Save,
  RefreshCw,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  Info,
  Moon,
  Sun,
  Monitor,
  Lock,
  Unlock,
  Camera,
  Edit2,
  Trash2,
  Plus,
  X,
  ChevronRight,
  HelpCircle
} from 'lucide-react';

const Settings = () => {
  const { customers, units, contracts, payments } = useAppContext();
  
  const [activeSection, setActiveSection] = useState('profile');
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [showUnsavedChanges, setShowUnsavedChanges] = useState(false);
  const [settings, setSettings] = useState({
    // User Profile
    profile: {
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@mystoragecompany.com',
      phone: '+1 (555) 123-4567',
      title: 'Storage Manager',
      avatar: null,
      timezone: 'America/New_York',
      language: 'en-US'
    },
    
    // Business Information
    business: {
      companyName: 'My Storage Company',
      businessType: 'Self Storage Facility',
      address: '123 Storage Lane',
      city: 'Storage City',
      state: 'CA',
      zipCode: '12345',
      country: 'United States',
      phone: '+1 (555) 987-6543',
      email: 'info@mystoragecompany.com',
      website: 'https://mystoragecompany.com',
      taxId: '12-3456789',
      licenseNumber: 'SSL-2024-001'
    },

    // System Configuration
    system: {
      defaultCurrency: 'USD',
      dateFormat: 'MM/DD/YYYY',
      timeFormat: '12h',
      firstDayOfWeek: 'sunday',
      autoBackup: true,
      backupFrequency: 'daily',
      backupTime: '02:00',
      dataRetention: 365,
      sessionTimeout: 30,
      maintenanceMode: false
    },

    // Pricing & Units
    pricing: {
      defaultLateFee: 25,
      lateFeeType: 'flat', // 'flat' or 'percentage'
      lateFeeGracePeriod: 5,
      securityDepositRequired: true,
      defaultSecurityDeposit: 'monthly_rate', // 'monthly_rate' or 'fixed'
      fixedSecurityDeposit: 100,
      taxRate: 8.5,
      taxIncluded: false,
      discountOptions: ['senior', 'military', 'student'],
      allowProRating: true
    },

    // Notifications
    notifications: {
      emailNotifications: true,
      smsNotifications: true,
      desktopNotifications: true,
      contractExpiry: { enabled: true, days: 30 },
      paymentDue: { enabled: true, days: 5 },
      paymentOverdue: { enabled: true, days: 1 },
      lowOccupancy: { enabled: true, threshold: 70 },
      maintenanceReminders: { enabled: true, days: 7 }
    },

    // Security
    security: {
      twoFactorAuth: false,
      loginAttempts: 5,
      lockoutDuration: 15,
      passwordExpiry: 90,
      requireStrongPassword: true,
      sessionSecurity: 'high',
      ipWhitelist: [],
      auditLogging: true,
      dataEncryption: true
    },

    // Appearance
    appearance: {
      theme: 'light', // 'light', 'dark', 'system'
      primaryColor: '#3B82F6',
      fontFamily: 'Inter',
      fontSize: 'medium',
      sidebarCollapsed: false,
      showAnimations: true,
      compactMode: false
    },

    // Integrations
    integrations: {
      paymentGateway: 'stripe',
      stripeApiKey: '',
      paypalApiKey: '',
      smsProvider: 'twilio',
      twilioAccountSid: '',
      twilioAuthToken: '',
      emailProvider: 'sendgrid',
      sendgridApiKey: '',
      googleMapsApiKey: '',
      webhookUrl: '',
      apiAccess: false
    }
  });

  const [originalSettings, setOriginalSettings] = useState(settings);

  // Settings sections
  const settingsSections = [
    { id: 'profile', label: 'Profile', icon: User, description: 'Personal information and preferences' },
    { id: 'business', label: 'Business', icon: Building, description: 'Company details and information' },
    { id: 'system', label: 'System', icon: SettingsIcon, description: 'General system configuration' },
    { id: 'pricing', label: 'Pricing', icon: DollarSign, description: 'Fees, deposits, and pricing rules' },
    { id: 'notifications', label: 'Notifications', icon: Bell, description: 'Alert preferences and settings' },
    { id: 'security', label: 'Security', icon: Shield, description: 'Security and access control' },
    { id: 'appearance', label: 'Appearance', icon: Palette, description: 'Theme and display preferences' },
    { id: 'integrations', label: 'Integrations', icon: Globe, description: 'External services and APIs' }
  ];

  // Check for unsaved changes
  useEffect(() => {
    const hasChanges = JSON.stringify(settings) !== JSON.stringify(originalSettings);
    setShowUnsavedChanges(hasChanges);
  }, [settings, originalSettings]);

  // Handle input changes
  const handleInputChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  // Handle nested input changes
  const handleNestedInputChange = (section, field, subfield, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: {
          ...prev[section][field],
          [subfield]: value
        }
      }
    }));
  };

  // Save settings
  const handleSave = () => {
    console.log('Saving settings:', settings);
    setOriginalSettings(settings);
    // In a real app, this would save to backend
    alert('Settings saved successfully!');
  };

  // Reset settings
  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all settings to default values?')) {
      setSettings(originalSettings);
    }
  };

  // Export settings
  const handleExport = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `storage-settings-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Import settings
  const handleImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedSettings = JSON.parse(e.target.result);
          setSettings(importedSettings);
          alert('Settings imported successfully!');
        } catch (error) {
          alert('Error importing settings. Please check the file format.');
        }
      };
      reader.readAsText(file);
    }
  };

  // Render profile section
  const renderProfileSection = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-primary-600" />
            </div>
            <div>
              <Button variant="outline" size="sm">
                <Camera className="w-4 h-4 mr-2" />
                Change Avatar
              </Button>
              <p className="text-sm text-gray-500 mt-1">JPG, PNG up to 2MB</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input
                type="text"
                value={settings.profile.firstName}
                onChange={(e) => handleInputChange('profile', 'firstName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input
                type="text"
                value={settings.profile.lastName}
                onChange={(e) => handleInputChange('profile', 'lastName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              value={settings.profile.email}
              onChange={(e) => handleInputChange('profile', 'email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              type="tel"
              value={settings.profile.phone}
              onChange={(e) => handleInputChange('profile', 'phone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
            <input
              type="text"
              value={settings.profile.title}
              onChange={(e) => handleInputChange('profile', 'title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
              <select
                value={settings.profile.timezone}
                onChange={(e) => handleInputChange('profile', 'timezone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="America/New_York">Eastern Time (EST)</option>
                <option value="America/Chicago">Central Time (CST)</option>
                <option value="America/Denver">Mountain Time (MST)</option>
                <option value="America/Los_Angeles">Pacific Time (PST)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
              <select
                value={settings.profile.language}
                onChange={(e) => handleInputChange('profile', 'language', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="en-US">English (US)</option>
                <option value="es-ES">Español</option>
                <option value="fr-FR">Français</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            onClick={() => setShowPasswordChange(true)}
          >
            <Key className="w-4 h-4 mr-2" />
            Change Password
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  // Render business section
  const renderBusinessSection = () => (
    <Card>
      <CardHeader>
        <CardTitle>Business Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
          <input
            type="text"
            value={settings.business.companyName}
            onChange={(e) => handleInputChange('business', 'companyName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Business Type</label>
          <select
            value={settings.business.businessType}
            onChange={(e) => handleInputChange('business', 'businessType', e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="Self Storage Facility">Self Storage Facility</option>
            <option value="RV Storage">RV Storage</option>
            <option value="Boat Storage">Boat Storage</option>
            <option value="Mixed Storage">Mixed Storage</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              value={settings.business.phone}
              onChange={(e) => handleInputChange('business', 'phone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={settings.business.email}
              onChange={(e) => handleInputChange('business', 'email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
          <input
            type="text"
            value={settings.business.address}
            onChange={(e) => handleInputChange('business', 'address', e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <input
              type="text"
              value={settings.business.city}
              onChange={(e) => handleInputChange('business', 'city', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
            <input
              type="text"
              value={settings.business.state}
              onChange={(e) => handleInputChange('business', 'state', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
            <input
              type="text"
              value={settings.business.zipCode}
              onChange={(e) => handleInputChange('business', 'zipCode', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
            <input
              type="url"
              value={settings.business.website}
              onChange={(e) => handleInputChange('business', 'website', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tax ID</label>
            <input
              type="text"
              value={settings.business.taxId}
              onChange={(e) => handleInputChange('business', 'taxId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Render pricing section
  const renderPricingSection = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Late Fees</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Late Fee Type</label>
              <select
                value={settings.pricing.lateFeeType}
                onChange={(e) => handleInputChange('pricing', 'lateFeeType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="flat">Flat Fee</option>
                <option value="percentage">Percentage</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {settings.pricing.lateFeeType === 'flat' ? 'Fee Amount ($)' : 'Percentage (%)'}
              </label>
              <input
                type="number"
                value={settings.pricing.defaultLateFee}
                onChange={(e) => handleInputChange('pricing', 'defaultLateFee', parseFloat(e.target.value))}
                min="0"
                step={settings.pricing.lateFeeType === 'flat' ? '1' : '0.1'}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Grace Period (days)</label>
            <input
              type="number"
              value={settings.pricing.lateFeeGracePeriod}
              onChange={(e) => handleInputChange('pricing', 'lateFeeGracePeriod', parseInt(e.target.value))}
              min="0"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Security Deposits</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={settings.pricing.securityDepositRequired}
              onChange={(e) => handleInputChange('pricing', 'securityDepositRequired', e.target.checked)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <label className="text-sm font-medium text-gray-700">Require Security Deposit</label>
          </div>

          {settings.pricing.securityDepositRequired && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deposit Type</label>
                <select
                  value={settings.pricing.defaultSecurityDeposit}
                  onChange={(e) => handleInputChange('pricing', 'defaultSecurityDeposit', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="monthly_rate">Equal to Monthly Rate</option>
                  <option value="fixed">Fixed Amount</option>
                </select>
              </div>
              {settings.pricing.defaultSecurityDeposit === 'fixed' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fixed Amount ($)</label>
                  <input
                    type="number"
                    value={settings.pricing.fixedSecurityDeposit}
                    onChange={(e) => handleInputChange('pricing', 'fixedSecurityDeposit', parseFloat(e.target.value))}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tax Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tax Rate (%)</label>
              <input
                type="number"
                value={settings.pricing.taxRate}
                onChange={(e) => handleInputChange('pricing', 'taxRate', parseFloat(e.target.value))}
                min="0"
                max="100"
                step="0.1"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="flex items-center mt-6">
              <input
                type="checkbox"
                checked={settings.pricing.taxIncluded}
                onChange={(e) => handleInputChange('pricing', 'taxIncluded', e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <label className="ml-2 text-sm font-medium text-gray-700">Tax Included in Price</label>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Render current section
  const renderCurrentSection = () => {
    switch (activeSection) {
      case 'profile':
        return renderProfileSection();
      case 'business':
        return renderBusinessSection();
      case 'pricing':
        return renderPricingSection();
      case 'system':
        return (
          <Card>
            <CardHeader>
              <CardTitle>System Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Default Currency</label>
                  <select
                    value={settings.system.defaultCurrency}
                    onChange={(e) => handleInputChange('system', 'defaultCurrency', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="USD">US Dollar (USD)</option>
                    <option value="EUR">Euro (EUR)</option>
                    <option value="GBP">British Pound (GBP)</option>
                    <option value="CAD">Canadian Dollar (CAD)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date Format</label>
                  <select
                    value={settings.system.dateFormat}
                    onChange={(e) => handleInputChange('system', 'dateFormat', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={settings.system.autoBackup}
                    onChange={(e) => handleInputChange('system', 'autoBackup', e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <label className="text-sm font-medium text-gray-700">Enable Automatic Backups</label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={settings.system.maintenanceMode}
                    onChange={(e) => handleInputChange('system', 'maintenanceMode', e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <label className="text-sm font-medium text-gray-700">Maintenance Mode</label>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      case 'appearance':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Appearance & Theme</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { value: 'light', label: 'Light', icon: Sun },
                    { value: 'dark', label: 'Dark', icon: Moon },
                    { value: 'system', label: 'System', icon: Monitor }
                  ].map(theme => {
                    const Icon = theme.icon;
                    return (
                      <button
                        key={theme.value}
                        onClick={() => handleInputChange('appearance', 'theme', theme.value)}
                        className={`p-4 rounded-lg border-2 transition-colors ${
                          settings.appearance.theme === theme.value
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Icon className="w-8 h-8 mx-auto mb-2" />
                        <p className="text-sm font-medium">{theme.label}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Primary Color</label>
                <input
                  type="color"
                  value={settings.appearance.primaryColor}
                  onChange={(e) => handleInputChange('appearance', 'primaryColor', e.target.value)}
                  className="w-20 h-10 rounded border border-gray-200"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={settings.appearance.showAnimations}
                    onChange={(e) => handleInputChange('appearance', 'showAnimations', e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <label className="text-sm font-medium text-gray-700">Enable Animations</label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={settings.appearance.compactMode}
                    onChange={(e) => handleInputChange('appearance', 'compactMode', e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <label className="text-sm font-medium text-gray-700">Compact Mode</label>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      default:
        return <div>Select a settings section</div>;
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold gradient-text mb-2">Settings</h1>
        <p className="text-gray-600">Configure your storage management system</p>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Settings Navigation */}
        <div className="col-span-3">
          <Card>
            <CardContent className="p-0">
              <nav className="space-y-1">
                {settingsSections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                        activeSection === section.id
                          ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-500'
                          : 'text-gray-700'
                      }`}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      <div className="flex-1">
                        <p className="font-medium">{section.label}</p>
                        <p className="text-xs text-gray-500">{section.description}</p>
                      </div>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  );
                })}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Settings Content */}
        <div className="col-span-9">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderCurrentSection()}
          </motion.div>

          {/* Action Buttons */}
          <div className="mt-8 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={handleExport}>
                <Download className="w-4 h-4 mr-2" />
                Export Settings
              </Button>
              <div>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                  id="import-settings"
                />
                <label htmlFor="import-settings">
                  <Button variant="outline" as="span">
                    <Upload className="w-4 h-4 mr-2" />
                    Import Settings
                  </Button>
                </label>
              </div>
              <Button variant="outline" onClick={handleReset}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>

            <div className="flex items-center space-x-4">
              {showUnsavedChanges && (
                <div className="flex items-center text-amber-600">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  <span className="text-sm">Unsaved changes</span>
                </div>
              )}
              <Button variant="gradient" onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;