import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../context/AppContext';
import { formatCurrency, getCurrencySymbol } from '../../utils/currency';
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
  ChevronLeft,
  HelpCircle,
  Grid3x3
} from 'lucide-react';

const Settings = () => {
  const { t, i18n } = useTranslation();
  const { customers, units, contracts, payments } = useAppContext();
  
  // Get current language
  const currentLang = i18n.language;
  
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
    },

    // Unit Size Presets
    unitSizes: {
      presets: [
        { id: 1, name: 'Small', size: 25, rentPerSqFt: 1.2 },
        { id: 2, name: 'Medium', size: 50, rentPerSqFt: 1.0 },
        { id: 3, name: 'Large', size: 100, rentPerSqFt: 0.9 },
        { id: 4, name: 'Extra Large', size: 200, rentPerSqFt: 0.8 }
      ],
      nextId: 5
    }
  });

  const [originalSettings, setOriginalSettings] = useState(settings);

  // Settings sections
  const settingsSections = [
    { id: 'profile', label: t('settings.profile'), icon: User, description: t('settings.profileDescription') },
    { id: 'business', label: t('settings.business'), icon: Building, description: t('settings.businessDescription') },
    { id: 'system', label: t('settings.system'), icon: SettingsIcon, description: t('settings.systemDescription') },
    { id: 'pricing', label: t('settings.pricing'), icon: DollarSign, description: t('settings.pricingDescription') },
    { id: 'unitsizes', label: t('settings.unitSizePresets'), icon: Database, description: 'Manage unit size presets and rent rates' },
    { id: 'notifications', label: t('settings.notifications'), icon: Bell, description: t('settings.notificationsDescription') },
    { id: 'security', label: t('settings.security'), icon: Shield, description: t('settings.securityDescription') },
    { id: 'appearance', label: t('settings.appearance'), icon: Palette, description: t('settings.appearanceDescription') },
    { id: 'integrations', label: t('settings.integrations'), icon: Globe, description: t('settings.integrationsDescription') }
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

  // Handle language change
  const handleLanguageChange = (newLanguage) => {
    handleInputChange('profile', 'language', newLanguage);
    // Change the actual app language
    const langCode = newLanguage.split('-')[0]; // Convert 'en-US' to 'en', 'he-IL' to 'he'
    i18n.changeLanguage(langCode);
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
    alert(t('settings.settingsSavedSuccessfully'));
  };

  // Reset settings
  const handleReset = () => {
    if (window.confirm(t('settings.confirmResetSettings'))) {
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
          alert(t('settings.settingsImportedSuccessfully'));
        } catch (error) {
          alert(t('settings.errorImportingSettings'));
        }
      };
      reader.readAsText(file);
    }
  };

  // Unit size preset management state
  const [editingPreset, setEditingPreset] = useState(null);
  const [showAddPreset, setShowAddPreset] = useState(false);
  const [presetFormData, setPresetFormData] = useState({
    name: '',
    size: 0,
    rentPerSqFt: 0
  });

  // Unit size preset management functions
  const handlePresetFormChange = (e) => {
    const { name, value, type } = e.target;
    setPresetFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const startAddingPreset = () => {
    setPresetFormData({ name: '', size: 0, rentPerSqFt: 0 });
    setEditingPreset(null);
    setShowAddPreset(true);
  };

  const startEditingPreset = (preset) => {
    setPresetFormData({
      name: preset.name,
      size: preset.size,
      rentPerSqFt: preset.rentPerSqFt
    });
    setEditingPreset(preset);
    setShowAddPreset(false);
  };

  const savePreset = () => {
    if (!presetFormData.name.trim()) {
      alert(t('contracts.templateNameRequired'));
      return;
    }
    if (presetFormData.size <= 0) {
      alert('Size must be greater than 0');
      return;
    }
    if (presetFormData.rentPerSqFt < 0) {
      alert('Rent per sq ft must be 0 or greater');
      return;
    }

    if (editingPreset) {
      // Update existing preset
      const updatedPreset = {
        ...editingPreset,
        name: presetFormData.name.trim(),
        size: presetFormData.size,
        rentPerSqFt: presetFormData.rentPerSqFt
      };
      
      setSettings(prev => ({
        ...prev,
        unitSizes: {
          ...prev.unitSizes,
          presets: prev.unitSizes.presets.map(p => p.id === editingPreset.id ? updatedPreset : p)
        }
      }));
    } else {
      // Add new preset
      const newPreset = {
        id: settings.unitSizes.nextId,
        name: presetFormData.name.trim(),
        size: presetFormData.size,
        rentPerSqFt: presetFormData.rentPerSqFt
      };
      
      setSettings(prev => ({
        ...prev,
        unitSizes: {
          ...prev.unitSizes,
          presets: [...prev.unitSizes.presets, newPreset],
          nextId: prev.unitSizes.nextId + 1
        }
      }));
    }
    
    // Reset form
    cancelPresetEdit();
  };

  const cancelPresetEdit = () => {
    setEditingPreset(null);
    setShowAddPreset(false);
    setPresetFormData({ name: '', size: 0, rentPerSqFt: 0 });
  };

  const deleteUnitSizePreset = (presetId) => {
    if (window.confirm(t('settings.deleteSizePreset') + '?')) {
      setSettings(prev => ({
        ...prev,
        unitSizes: {
          ...prev.unitSizes,
          presets: prev.unitSizes.presets.filter(p => p.id !== presetId)
        }
      }));
    }
  };

  // Render profile section
  const renderProfileSection = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('settings.personalInfo')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-primary-600" />
            </div>
            <div>
              <Button variant="outline" size="sm">
                <Camera className="w-4 h-4 mr-2" />
{t('settings.changeAvatar')}
              </Button>
              <p className="text-sm text-gray-500 mt-1">JPG, PNG up to 2MB</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('settings.firstName')}</label>
              <input
                type="text"
                value={settings.profile.firstName}
                onChange={(e) => handleInputChange('profile', 'firstName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('settings.lastName')}</label>
              <input
                type="text"
                value={settings.profile.lastName}
                onChange={(e) => handleInputChange('profile', 'lastName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('settings.email')}</label>
            <input
              type="email"
              value={settings.profile.email}
              onChange={(e) => handleInputChange('profile', 'email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('settings.phone')}</label>
            <input
              type="tel"
              value={settings.profile.phone}
              onChange={(e) => handleInputChange('profile', 'phone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('settings.jobTitle')}</label>
            <input
              type="text"
              value={settings.profile.title}
              onChange={(e) => handleInputChange('profile', 'title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('settings.timezone')}</label>
              <select
                value={settings.profile.timezone}
                onChange={(e) => handleInputChange('profile', 'timezone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="America/New_York">Eastern Time (EST)</option>
                <option value="America/Chicago">Central Time (CST)</option>
                <option value="America/Denver">Mountain Time (MST)</option>
                <option value="America/Los_Angeles">Pacific Time (PST)</option>
                <option value="Asia/Jerusalem">Israel Time (IST)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('settings.language')}</label>
              <select
                value={settings.profile.language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="en-US">English (US)</option>
                <option value="he-IL">עברית (Hebrew)</option>
                <option value="es-ES">Español</option>
                <option value="fr-FR">Français</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('settings.security')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            onClick={() => setShowPasswordChange(true)}
          >
            <Key className="w-4 h-4 mr-2" />
{t('settings.changePassword')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  // Render business section
  const renderBusinessSection = () => (
    <Card>
      <CardHeader>
        <CardTitle>{t('settings.businessInfo')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('settings.companyName')}</label>
          <input
            type="text"
            value={settings.business.companyName}
            onChange={(e) => handleInputChange('business', 'companyName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('settings.businessType')}</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('settings.phone')}</label>
            <input
              type="tel"
              value={settings.business.phone}
              onChange={(e) => handleInputChange('business', 'phone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('settings.email')}</label>
            <input
              type="email"
              value={settings.business.email}
              onChange={(e) => handleInputChange('business', 'email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('settings.address')}</label>
          <input
            type="text"
            value={settings.business.address}
            onChange={(e) => handleInputChange('business', 'address', e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('customers.city')}</label>
            <input
              type="text"
              value={settings.business.city}
              onChange={(e) => handleInputChange('business', 'city', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('customers.state')}</label>
            <input
              type="text"
              value={settings.business.state}
              onChange={(e) => handleInputChange('business', 'state', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('customers.zipCode')}</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('settings.website')}</label>
            <input
              type="url"
              value={settings.business.website}
              onChange={(e) => handleInputChange('business', 'website', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('settings.taxId')}</label>
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
          <CardTitle>{t('settings.lateFees')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('settings.lateFeeType')}</label>
              <select
                value={settings.pricing.lateFeeType}
                onChange={(e) => handleInputChange('pricing', 'lateFeeType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="flat">{t('settings.flatFee')}</option>
                <option value="percentage">{t('settings.percentage')}</option>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('settings.gracePeriod')}</label>
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
          <CardTitle>{t('settings.securityDeposit')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={settings.pricing.securityDepositRequired}
              onChange={(e) => handleInputChange('pricing', 'securityDepositRequired', e.target.checked)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <label className="text-sm font-medium text-gray-700">{t('settings.requireSecurityDeposit')}</label>
          </div>

          {settings.pricing.securityDepositRequired && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('settings.depositType')}</label>
                <select
                  value={settings.pricing.defaultSecurityDeposit}
                  onChange={(e) => handleInputChange('pricing', 'defaultSecurityDeposit', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="monthly_rate">{t('settings.equalToMonthlyRate')}</option>
                  <option value="fixed">{t('settings.fixedAmount')}</option>
                </select>
              </div>
              {settings.pricing.defaultSecurityDeposit === 'fixed' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('settings.fixedAmount')} ({getCurrencySymbol()})</label>
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
          <CardTitle>{t('settings.taxSettings')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('settings.taxRate')}</label>
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
              <label className="ml-2 text-sm font-medium text-gray-700">{t('settings.taxIncluded')}</label>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Render unit sizes section
  const renderUnitSizesSection = () => (
    <div className="space-y-6">
      {/* Header Card with Add Button */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{t('settings.unitSizePresets')}</CardTitle>
            <p className="text-sm text-gray-600 mt-1">{t('settings.unitSizeConfiguration')}</p>
          </div>
          <Button 
            variant="gradient" 
            onClick={startAddingPreset} 
            disabled={showAddPreset}
          >
            <Plus className="w-4 h-4 mr-2" />
            {t('settings.addSizePreset')}
          </Button>
        </CardHeader>
      </Card>

      {/* Add/Edit Form */}
      <AnimatePresence>
        {(showAddPreset || editingPreset) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-primary-200 bg-gradient-to-br from-primary-50 to-white">
              <CardHeader>
                <CardTitle className="text-primary-700">
                  {editingPreset ? t('settings.editSizePreset') : t('settings.addSizePreset')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('settings.sizePresetName')} *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={presetFormData.name}
                      onChange={handlePresetFormChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder={t('settings.sizeNamePlaceholder')}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('settings.sizeInSqFt')} *
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name="size"
                        value={presetFormData.size}
                        onChange={handlePresetFormChange}
                        min="1"
                        step="1"
                        className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="25"
                      />
                      <span className="absolute right-3 top-2 text-gray-500 text-sm">{t('common.ft')}</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('settings.rentPerSqFt')} *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-gray-500 text-sm">{getCurrencySymbol()}</span>
                      <input
                        type="number"
                        name="rentPerSqFt"
                        value={presetFormData.rentPerSqFt}
                        onChange={handlePresetFormChange}
                        min="0"
                        step="0.01"
                        className="w-full px-4 py-2 pl-8 pr-16 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="1.20"
                      />
                      <span className="absolute right-3 top-2 text-gray-500 text-sm">{t('common.ft')}</span>
                    </div>
                  </div>
                </div>
                
                {/* Preview Calculation */}
                {presetFormData.size > 0 && presetFormData.rentPerSqFt > 0 && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 p-4 bg-white rounded-lg border border-primary-200"
                  >
                    <p className="text-sm font-medium text-gray-700 mb-1">{t('settings.monthlyRentPreview')}:</p>
                    <p className="text-lg font-bold text-primary-600">
                      {presetFormData.size} {t('common.ft')} × {getCurrencySymbol()}{presetFormData.rentPerSqFt}{t('settings.perSqFt')} = {formatCurrency(presetFormData.size * presetFormData.rentPerSqFt)}/{t('common.month')}
                    </p>
                  </motion.div>
                )}
                
                <div className="flex justify-end gap-3 mt-6">
                  <Button variant="secondary" onClick={cancelPresetEdit}>
                    <X className="w-4 h-4 mr-2" />
                    {t('common.cancel')}
                  </Button>
                  <Button variant="gradient" onClick={savePreset}>
                    <Save className="w-4 h-4 mr-2" />
                    {editingPreset ? t('common.save') : t('settings.addSizePreset')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Presets List */}
      <Card>
        <CardHeader>
          <CardTitle>{t('settings.currentSizePresets')}</CardTitle>
          <p className="text-sm text-gray-600">{t('settings.manageSizeConfigurations')}</p>
        </CardHeader>
        <CardContent>
          {settings.unitSizes.presets.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Database className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">{t('settings.noUnitSizePresets')}</h3>
              <p className="text-gray-600 mb-4">{t('settings.createFirstPresetDescription')}</p>
              <Button variant="gradient" onClick={startAddingPreset}>
                <Plus className="w-4 h-4 mr-2" />
                {t('settings.createFirstPresetButton')}
              </Button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {settings.unitSizes.presets.map((preset, index) => (
                <motion.div
                  key={preset.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative group bg-gradient-to-br from-white to-gray-50 border-2 rounded-xl p-6 hover:shadow-lg transition-all duration-300 ${
                    editingPreset?.id === preset.id 
                      ? 'border-primary-300 ring-4 ring-primary-100' 
                      : 'border-gray-200 hover:border-primary-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">{preset.name}</h3>
                    <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => startEditingPreset(preset)}
                        className="p-2 text-primary-600 hover:bg-primary-100 rounded-lg transition-colors"
                        title={t('settings.editSizePreset')}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteUnitSizePreset(preset.id)}
                        className="p-2 text-danger-600 hover:bg-danger-100 rounded-lg transition-colors"
                        title={t('settings.deleteSizePreset')}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-600">
                      <Grid3x3 className="w-4 h-4 mr-2 text-primary-500" />
                      <span className="text-sm font-medium">{preset.size} {t('common.ft')}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-600">
                      <DollarSign className="w-4 h-4 mr-2 text-success-500" />
                      <span className="text-sm font-medium">
                        {getCurrencySymbol()}{preset.rentPerSqFt} {t('settings.perSqFt')}
                      </span>
                    </div>
                    
                    <div className="pt-2 border-t border-gray-200">
                      <p className="text-xs text-gray-500 mb-1">{t('settings.monthlyRentPreview')}</p>
                      <p className="text-xl font-bold text-primary-600">
                        {formatCurrency(preset.size * preset.rentPerSqFt)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
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
      case 'unitsizes':
        return renderUnitSizesSection();
      case 'system':
        return (
          <Card>
            <CardHeader>
              <CardTitle>{t('settings.systemConfiguration')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('settings.currency')}</label>
                  <select
                    value={settings.system.defaultCurrency}
                    onChange={(e) => handleInputChange('system', 'defaultCurrency', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="USD">US Dollar (USD)</option>
                    <option value="ILS">Israeli Shekel (ILS - ₪)</option>
                    <option value="EUR">Euro (EUR)</option>
                    <option value="GBP">British Pound (GBP)</option>
                    <option value="CAD">Canadian Dollar (CAD)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('settings.dateFormat')}</label>
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
                  <label className="text-sm font-medium text-gray-700">{t('settings.autoBackup')}</label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={settings.system.maintenanceMode}
                    onChange={(e) => handleInputChange('system', 'maintenanceMode', e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <label className="text-sm font-medium text-gray-700">{t('settings.maintenanceMode')}</label>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      case 'appearance':
        return (
          <Card>
            <CardHeader>
              <CardTitle>{t('settings.appearanceAndTheme')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('settings.theme')}</label>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { value: 'light', label: t('settings.light'), icon: Sun },
                    { value: 'dark', label: t('settings.dark'), icon: Moon },
                    { value: 'system', label: t('settings.system'), icon: Monitor }
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
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('settings.primaryColor')}</label>
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
                  <label className="text-sm font-medium text-gray-700">{t('settings.animations')}</label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={settings.appearance.compactMode}
                    onChange={(e) => handleInputChange('appearance', 'compactMode', e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <label className="text-sm font-medium text-gray-700">{t('settings.compactMode')}</label>
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
        <h1 className="text-4xl font-bold gradient-text mb-2">{t('settings.title')}</h1>
        <p className="text-gray-600">{t('settings.subtitle')}</p>
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
                      {currentLang === 'he' ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
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
{t('settings.exportSettings')}
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
{t('settings.importSettings')}
                  </Button>
                </label>
              </div>
              <Button variant="outline" onClick={handleReset}>
                <RefreshCw className="w-4 h-4 mr-2" />
{t('common.reset')}
              </Button>
            </div>

            <div className="flex items-center space-x-4">
              {showUnsavedChanges && (
                <div className="flex items-center text-amber-600">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  <span className="text-sm">{t('settings.unsavedChanges')}</span>
                </div>
              )}
              <Button variant="gradient" onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
{t('settings.saveChanges')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;