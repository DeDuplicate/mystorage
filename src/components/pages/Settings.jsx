import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
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
  Users,
  X,
  ChevronRight,
  ChevronLeft,
  HelpCircle,
  Grid3x3,
  MessageSquare,
  MessageCircle,
  Smartphone,
  Server
} from 'lucide-react';

const Settings = () => {
  const { t, i18n } = useTranslation();
  const { customers, units, contracts, payments } = useAppContext();
  const { theme, updateTheme } = useTheme();
  
  // Get current language
  const currentLang = i18n.language;
  
  const [activeSection, setActiveSection] = useState('profile');
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [showUnsavedChanges, setShowUnsavedChanges] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [showMessageTemplates, setShowMessageTemplates] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [templateFormData, setTemplateFormData] = useState({
    name: '',
    subject: '',
    message: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
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
      requireStrongPassword: true,
      loginEmail: '',
      enablePasswordRecovery: true,
      recoveryViaEmail: true,
      recoveryViaWhatsApp: false,
      recoveryPhone: ''
    },

    // Appearance
    appearance: {
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

    // Notification Settings
    notifications: {
      // Email/SMTP Settings
      email: {
        enabled: true,
        smtpProvider: 'custom', // 'custom', 'gmail', 'outlook', 'sendgrid'
        smtpHost: '',
        smtpPort: 587,
        smtpUsername: '',
        smtpPassword: '',
        smtpSecure: true, // TLS/SSL
        fromEmail: '',
        fromName: 'Storage Management System',
        // Notification preferences
        contractExpiry: true,
        paymentDue: true,
        paymentOverdue: true,
        maintenanceReminder: true,
        newCustomer: true
      },
      // WhatsApp Settings
      whatsapp: {
        enabled: false,
        provider: 'twilio', // 'twilio', 'wame'
        // Twilio Settings
        twilioAccountSid: '',
        twilioAuthToken: '',
        twilioPhoneNumber: '',
        // WA.me Settings
        businessPhone: '',
        // Notification preferences
        contractExpiry: true,
        paymentDue: true,
        paymentOverdue: true,
        maintenanceReminder: false,
        newCustomer: false
      },
      // SMS Settings
      sms: {
        enabled: false,
        provider: 'twilio', // 'twilio', 'custom'
        twilioAccountSid: '',
        twilioAuthToken: '',
        twilioPhoneNumber: '',
        // Notification preferences
        contractExpiry: true,
        paymentDue: true,
        paymentOverdue: true,
        maintenanceReminder: false,
        newCustomer: false
      },
      // Custom Message Templates
      messageTemplates: [
        {
          id: 'contract_expiry',
          name: 'Contract Expiry Reminder',
          subject: 'Contract Expiring Soon - Action Required',
          message: 'Dear [CUSTOMER_NAME],\n\nYour storage contract for unit [UNIT_NUMBER] will expire on [EXPIRY_DATE].\n\nPlease contact us to renew your contract.\n\nBest regards,\n[COMPANY_NAME]'
        },
        {
          id: 'payment_due',
          name: 'Payment Due Reminder',
          subject: 'Payment Due - [UNIT_NUMBER]',
          message: 'Dear [CUSTOMER_NAME],\n\nYour payment of [AMOUNT] for unit [UNIT_NUMBER] is due on [DUE_DATE].\n\nPlease make your payment to avoid any late fees.\n\nBest regards,\n[COMPANY_NAME]'
        },
        {
          id: 'payment_overdue',
          name: 'Payment Overdue Notice',
          subject: 'Urgent: Payment Overdue - [UNIT_NUMBER]',
          message: 'Dear [CUSTOMER_NAME],\n\nYour payment of [AMOUNT] for unit [UNIT_NUMBER] is now overdue by [DAYS_OVERDUE] days.\n\nPlease make immediate payment to avoid service interruption.\n\nBest regards,\n[COMPANY_NAME]'
        }
      ]
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
    // Handle dotted notation like 'notifications.email'
    if (section.includes('.')) {
      const [mainSection, subSection] = section.split('.');
      setSettings(prev => ({
        ...prev,
        [mainSection]: {
          ...prev[mainSection],
          [subSection]: {
            ...prev[mainSection][subSection],
            [field]: value
          }
        }
      }));
    } else {
      setSettings(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    }
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

  // Handle password change
  const handleChangePassword = () => {
    // Validate passwords
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      alert(t('settings.fillAllPasswordFields'));
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert(t('settings.passwordsDoNotMatch'));
      return;
    }

    if (settings.security.requireStrongPassword) {
      // Check for strong password requirements
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(passwordData.newPassword)) {
        alert(t('settings.weakPasswordError'));
        return;
      }
    }

    // In a real app, this would validate current password and update in backend
    console.log('Changing password...');
    alert(t('settings.passwordChangedSuccessfully'));
    
    // Clear password fields
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setShowCurrentPassword(false);
    setShowNewPassword(false);
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

  // SMTP Provider auto-fill presets
  const smtpPresets = {
    gmail: {
      smtpHost: 'smtp.gmail.com',
      smtpPort: 587,
      smtpSecure: true
    },
    outlook: {
      smtpHost: 'smtp-mail.outlook.com', 
      smtpPort: 587,
      smtpSecure: true
    },
    sendgrid: {
      smtpHost: 'smtp.sendgrid.net',
      smtpPort: 587,
      smtpSecure: true
    },
    custom: {
      smtpHost: '',
      smtpPort: 587,
      smtpSecure: true
    }
  };

  // Handle SMTP provider change with auto-fill
  const handleSmtpProviderChange = (provider) => {
    const preset = smtpPresets[provider];
    if (preset) {
      setSettings(prev => ({
        ...prev,
        notifications: {
          ...prev.notifications,
          email: {
            ...prev.notifications.email,
            smtpProvider: provider,
            smtpHost: preset.smtpHost,
            smtpPort: preset.smtpPort,
            smtpSecure: preset.smtpSecure
          }
        }
      }));
    }
  };

  // Message template management functions
  const handleTemplateFormChange = (e) => {
    const { name, value } = e.target;
    setTemplateFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const startEditingTemplate = (template) => {
    setEditingTemplate(template);
    setTemplateFormData({
      name: template.name,
      subject: template.subject,
      message: template.message
    });
    setShowMessageTemplates(true);
  };

  const saveTemplate = () => {
    if (!templateFormData.name.trim() || !templateFormData.subject.trim() || !templateFormData.message.trim()) {
      alert(t('settings.fillAllFields'));
      return;
    }

    const templateToSave = {
      id: editingTemplate?.id || `custom_${Date.now()}`,
      name: templateFormData.name.trim(),
      subject: templateFormData.subject.trim(),
      message: templateFormData.message.trim(),
      isCustom: !editingTemplate?.id.includes('contract_expiry') && !editingTemplate?.id.includes('payment_')
    };

    if (editingTemplate) {
      // Update existing template
      setSettings(prev => ({
        ...prev,
        notifications: {
          ...prev.notifications,
          messageTemplates: prev.notifications.messageTemplates.map(t => 
            t.id === editingTemplate.id ? templateToSave : t
          )
        }
      }));
    } else {
      // Add new template
      setSettings(prev => ({
        ...prev,
        notifications: {
          ...prev.notifications,
          messageTemplates: [...prev.notifications.messageTemplates, templateToSave]
        }
      }));
    }

    // Reset form and close modal
    setTemplateFormData({ name: '', subject: '', message: '' });
    setEditingTemplate(null);
    setShowMessageTemplates(false);
  };

  const deleteTemplate = (templateId) => {
    if (window.confirm(t('settings.confirmDeleteTemplate'))) {
      setSettings(prev => ({
        ...prev,
        notifications: {
          ...prev.notifications,
          messageTemplates: prev.notifications.messageTemplates.filter(t => t.id !== templateId)
        }
      }));
    }
  };

  // Avatar upload functions
  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert(t('settings.selectImageFile'));
      return;
    }

    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      alert(t('settings.fileTooLarge'));
      return;
    }

    setIsUploadingAvatar(true);

    try {
      // Convert image to base64 for storage
      const reader = new FileReader();
      reader.onload = (e) => {
        const avatarData = e.target.result;
        
        // Update settings with new avatar
        handleInputChange('profile', 'avatar', avatarData);
        setIsUploadingAvatar(false);
        
        // Show success message
        setTimeout(() => {
          alert(t('messages.success.uploaded'));
        }, 100);
      };
      
      reader.onerror = () => {
        setIsUploadingAvatar(false);
        alert(t('messages.error.general'));
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      setIsUploadingAvatar(false);
      alert(t('messages.error.general'));
    }
  };

  const triggerAvatarUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = handleAvatarUpload;
    input.click();
  };

  const removeAvatar = () => {
    if (window.confirm(t('settings.removeProfilePicture'))) {
      handleInputChange('profile', 'avatar', null);
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
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center overflow-hidden">
                {settings.profile.avatar ? (
                  <img 
                    src={settings.profile.avatar} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-8 h-8 text-primary-600" />
                )}
              </div>
              {settings.profile.avatar && (
                <button
                  onClick={removeAvatar}
                  className="absolute -top-1 -right-1 bg-danger-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-danger-600 transition-colors"
                  title="Remove avatar"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
            <div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={triggerAvatarUpload}
                disabled={isUploadingAvatar}
              >
                <Camera className="w-4 h-4 mr-2" />
                {isUploadingAvatar ? t('settings.uploadingAvatar') : t('settings.changeAvatar')}
              </Button>
              <p className="text-sm text-gray-500 mt-1">JPG, PNG up to 2MB</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('settings.firstName')}</label>
              <input
                type="text"
                value={settings.profile.firstName}
                onChange={(e) => handleInputChange('profile', 'firstName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('settings.lastName')}</label>
              <input
                type="text"
                value={settings.profile.lastName}
                onChange={(e) => handleInputChange('profile', 'lastName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('settings.email')}</label>
            <input
              type="email"
              value={settings.profile.email}
              onChange={(e) => handleInputChange('profile', 'email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('settings.phone')}</label>
            <input
              type="tel"
              value={settings.profile.phone}
              onChange={(e) => handleInputChange('profile', 'phone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('settings.jobTitle')}</label>
            <input
              type="text"
              value={settings.profile.title}
              onChange={(e) => handleInputChange('profile', 'title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('settings.timezone')}</label>
              <select
                value={settings.profile.timezone}
                onChange={(e) => handleInputChange('profile', 'timezone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="America/New_York">Eastern Time (EST)</option>
                <option value="America/Chicago">Central Time (CST)</option>
                <option value="America/Denver">Mountain Time (MST)</option>
                <option value="America/Los_Angeles">Pacific Time (PST)</option>
                <option value="Asia/Jerusalem">Israel Time (IST)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('settings.language')}</label>
              <select
                value={settings.profile.language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
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
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('settings.companyName')}</label>
          <input
            type="text"
            value={settings.business.companyName}
            onChange={(e) => handleInputChange('business', 'companyName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('settings.businessType')}</label>
          <select
            value={settings.business.businessType}
            onChange={(e) => handleInputChange('business', 'businessType', e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="Self Storage Facility">Self Storage Facility</option>
            <option value="RV Storage">RV Storage</option>
            <option value="Boat Storage">Boat Storage</option>
            <option value="Mixed Storage">Mixed Storage</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('settings.phone')}</label>
            <input
              type="tel"
              value={settings.business.phone}
              onChange={(e) => handleInputChange('business', 'phone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('settings.email')}</label>
            <input
              type="email"
              value={settings.business.email}
              onChange={(e) => handleInputChange('business', 'email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('settings.address')}</label>
          <input
            type="text"
            value={settings.business.address}
            onChange={(e) => handleInputChange('business', 'address', e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('customers.city')}</label>
            <input
              type="text"
              value={settings.business.city}
              onChange={(e) => handleInputChange('business', 'city', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('customers.state')}</label>
            <input
              type="text"
              value={settings.business.state}
              onChange={(e) => handleInputChange('business', 'state', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('customers.zipCode')}</label>
            <input
              type="text"
              value={settings.business.zipCode}
              onChange={(e) => handleInputChange('business', 'zipCode', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('settings.website')}</label>
            <input
              type="url"
              value={settings.business.website}
              onChange={(e) => handleInputChange('business', 'website', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('settings.taxId')}</label>
            <input
              type="text"
              value={settings.business.taxId}
              onChange={(e) => handleInputChange('business', 'taxId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('settings.lateFeeType')}</label>
              <select
                value={settings.pricing.lateFeeType}
                onChange={(e) => handleInputChange('pricing', 'lateFeeType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="flat">{t('settings.flatFee')}</option>
                <option value="percentage">{t('settings.percentage')}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {settings.pricing.lateFeeType === 'flat' ? 'Fee Amount ($)' : 'Percentage (%)'}
              </label>
              <input
                type="number"
                value={settings.pricing.defaultLateFee}
                onChange={(e) => handleInputChange('pricing', 'defaultLateFee', parseFloat(e.target.value))}
                min="0"
                step={settings.pricing.lateFeeType === 'flat' ? '1' : '0.1'}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('settings.gracePeriod')}</label>
            <input
              type="number"
              value={settings.pricing.lateFeeGracePeriod}
              onChange={(e) => handleInputChange('pricing', 'lateFeeGracePeriod', parseInt(e.target.value))}
              min="0"
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('settings.depositType')}</label>
                <select
                  value={settings.pricing.defaultSecurityDeposit}
                  onChange={(e) => handleInputChange('pricing', 'defaultSecurityDeposit', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="monthly_rate">{t('settings.equalToMonthlyRate')}</option>
                  <option value="fixed">{t('settings.fixedAmount')}</option>
                </select>
              </div>
              {settings.pricing.defaultSecurityDeposit === 'fixed' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('settings.fixedAmount')} ({getCurrencySymbol()})</label>
                  <input
                    type="number"
                    value={settings.pricing.fixedSecurityDeposit}
                    onChange={(e) => handleInputChange('pricing', 'fixedSecurityDeposit', parseFloat(e.target.value))}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('settings.taxRate')}</label>
              <input
                type="number"
                value={settings.pricing.taxRate}
                onChange={(e) => handleInputChange('pricing', 'taxRate', parseFloat(e.target.value))}
                min="0"
                max="100"
                step="0.1"
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
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
            <p className="text-sm text-gray-600 dark:text-gray-400 dark:text-gray-400 mt-1">{t('settings.unitSizeConfiguration')}</p>
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
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('settings.monthlyRentPreview')}:</p>
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
          <p className="text-sm text-gray-600 dark:text-gray-400">{t('settings.manageSizeConfigurations')}</p>
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
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{t('settings.monthlyRentPreview')}</p>
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

  // Render notifications section
  const renderNotificationsSection = () => (
    <div className="space-y-6">
      {/* Email/SMTP Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            {t('settings.emailNotifications')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={settings.notifications.email.enabled}
              onChange={(e) => handleInputChange('notifications.email', 'enabled', e.target.checked)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <label className="text-sm font-medium text-gray-700">{t('settings.enableEmailNotifications')}</label>
          </div>

          {settings.notifications.email.enabled && (
            <div className="space-y-4 pl-6 border-l-2 border-primary-100">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('settings.smtpProvider')}</label>
                  <select
                    value={settings.notifications.email.smtpProvider}
                    onChange={(e) => handleSmtpProviderChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="custom">Custom SMTP</option>
                    <option value="gmail">Gmail</option>
                    <option value="outlook">Outlook</option>
                    <option value="sendgrid">SendGrid</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('settings.smtpHost')}</label>
                  <input
                    type="text"
                    value={settings.notifications.email.smtpHost}
                    onChange={(e) => handleInputChange('notifications.email', 'smtpHost', e.target.value)}
                    placeholder="smtp.gmail.com"
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('settings.smtpPort')}</label>
                  <input
                    type="number"
                    value={settings.notifications.email.smtpPort}
                    onChange={(e) => handleInputChange('notifications.email', 'smtpPort', parseInt(e.target.value))}
                    placeholder="587"
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('settings.smtpUsername')}</label>
                  <input
                    type="text"
                    value={settings.notifications.email.smtpUsername}
                    onChange={(e) => handleInputChange('notifications.email', 'smtpUsername', e.target.value)}
                    placeholder="your-email@gmail.com"
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('settings.smtpPassword')}</label>
                  <input
                    type="password"
                    value={settings.notifications.email.smtpPassword}
                    onChange={(e) => handleInputChange('notifications.email', 'smtpPassword', e.target.value)}
                    placeholder="App Password"
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('settings.fromEmail')}</label>
                  <input
                    type="email"
                    value={settings.notifications.email.fromEmail}
                    onChange={(e) => handleInputChange('notifications.email', 'fromEmail', e.target.value)}
                    placeholder="noreply@yourdomain.com"
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('settings.fromName')}</label>
                  <input
                    type="text"
                    value={settings.notifications.email.fromName}
                    onChange={(e) => handleInputChange('notifications.email', 'fromName', e.target.value)}
                    placeholder="Storage Management System"
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={settings.notifications.email.smtpSecure}
                  onChange={(e) => handleInputChange('notifications.email', 'smtpSecure', e.target.checked)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <label className="text-sm font-medium text-gray-700">{t('settings.useTLS')}</label>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">{t('settings.emailNotificationTypes')}</h4>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { key: 'contractExpiry', label: t('settings.contractExpiryNotification') },
                    { key: 'paymentDue', label: t('settings.paymentDueNotification') },
                    { key: 'paymentOverdue', label: t('settings.paymentOverdueNotification') },
                    { key: 'maintenanceReminder', label: t('settings.maintenanceReminderNotification') },
                    { key: 'newCustomer', label: t('settings.newCustomerNotification') }
                  ].map(item => (
                    <div key={item.key} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={settings.notifications.email[item.key]}
                        onChange={(e) => handleInputChange('notifications.email', item.key, e.target.checked)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <label className="text-sm text-gray-700 dark:text-gray-300">{item.label}</label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* WhatsApp Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            WhatsApp Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={settings.notifications.whatsapp.enabled}
              onChange={(e) => handleInputChange('notifications.whatsapp', 'enabled', e.target.checked)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <label className="text-sm font-medium text-gray-700">{t('settings.enableWhatsAppNotifications')}</label>
          </div>

          {settings.notifications.whatsapp.enabled && (
            <div className="space-y-4 pl-6 border-l-2 border-green-100">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">WhatsApp Provider</label>
                <select
                  value={settings.notifications.whatsapp.provider}
                  onChange={(e) => handleInputChange('notifications.whatsapp', 'provider', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="twilio">Twilio WhatsApp API</option>
                  <option value="wame">WA.me Links (Manual)</option>
                </select>
              </div>

              {settings.notifications.whatsapp.provider === 'twilio' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Twilio Account SID</label>
                      <input
                        type="text"
                        value={settings.notifications.whatsapp.twilioAccountSid}
                        onChange={(e) => handleInputChange('notifications.whatsapp', 'twilioAccountSid', e.target.value)}
                        placeholder="AC..."
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Twilio Auth Token</label>
                      <input
                        type="password"
                        value={settings.notifications.whatsapp.twilioAuthToken}
                        onChange={(e) => handleInputChange('notifications.whatsapp', 'twilioAuthToken', e.target.value)}
                        placeholder="Auth Token"
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Twilio WhatsApp Number</label>
                    <input
                      type="text"
                      value={settings.notifications.whatsapp.twilioPhoneNumber}
                      onChange={(e) => handleInputChange('notifications.whatsapp', 'twilioPhoneNumber', e.target.value)}
                      placeholder="whatsapp:+14155238886"
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
              )}

              {settings.notifications.whatsapp.provider === 'wame' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Business Phone Number</label>
                  <input
                    type="text"
                    value={settings.notifications.whatsapp.businessPhone}
                    onChange={(e) => handleInputChange('notifications.whatsapp', 'businessPhone', e.target.value)}
                    placeholder="+1234567890"
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {t('settings.wameDescription')}
                  </p>
                </div>
              )}

              <div>
                <h4 className="font-medium text-gray-900 mb-3">WhatsApp Notification Types</h4>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { key: 'contractExpiry', label: t('settings.contractExpiryNotification') },
                    { key: 'paymentDue', label: t('settings.paymentDueNotification') },
                    { key: 'paymentOverdue', label: t('settings.paymentOverdueNotification') },
                    { key: 'maintenanceReminder', label: t('settings.maintenanceReminderNotification') },
                    { key: 'newCustomer', label: t('settings.newCustomerNotification') }
                  ].map(item => (
                    <div key={item.key} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={settings.notifications.whatsapp[item.key]}
                        onChange={(e) => handleInputChange('notifications.whatsapp', item.key, e.target.checked)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <label className="text-sm text-gray-700 dark:text-gray-300">{item.label}</label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* SMS Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            SMS Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={settings.notifications.sms.enabled}
              onChange={(e) => handleInputChange('notifications.sms', 'enabled', e.target.checked)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <label className="text-sm font-medium text-gray-700">Enable SMS notifications</label>
          </div>

          {settings.notifications.sms.enabled && (
            <div className="space-y-4 pl-6 border-l-2 border-blue-100">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">SMS Provider</label>
                <select
                  value={settings.notifications.sms.provider}
                  onChange={(e) => handleInputChange('notifications.sms', 'provider', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="twilio">Twilio SMS</option>
                  <option value="custom">Custom SMS Gateway</option>
                </select>
              </div>

              {settings.notifications.sms.provider === 'twilio' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Twilio Account SID</label>
                      <input
                        type="text"
                        value={settings.notifications.sms.twilioAccountSid}
                        onChange={(e) => handleInputChange('notifications.sms', 'twilioAccountSid', e.target.value)}
                        placeholder="AC..."
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Twilio Auth Token</label>
                      <input
                        type="password"
                        value={settings.notifications.sms.twilioAuthToken}
                        onChange={(e) => handleInputChange('notifications.sms', 'twilioAuthToken', e.target.value)}
                        placeholder="Auth Token"
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Twilio Phone Number</label>
                    <input
                      type="text"
                      value={settings.notifications.sms.twilioPhoneNumber}
                      onChange={(e) => handleInputChange('notifications.sms', 'twilioPhoneNumber', e.target.value)}
                      placeholder="+1234567890"
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
              )}

              <div>
                <h4 className="font-medium text-gray-900 mb-3">SMS Notification Types</h4>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { key: 'contractExpiry', label: t('settings.contractExpiryNotification') },
                    { key: 'paymentDue', label: t('settings.paymentDueNotification') },
                    { key: 'paymentOverdue', label: t('settings.paymentOverdueNotification') },
                    { key: 'maintenanceReminder', label: t('settings.maintenanceReminderNotification') },
                    { key: 'newCustomer', label: t('settings.newCustomerNotification') }
                  ].map(item => (
                    <div key={item.key} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={settings.notifications.sms[item.key]}
                        onChange={(e) => handleInputChange('notifications.sms', item.key, e.target.checked)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <label className="text-sm text-gray-700 dark:text-gray-300">{item.label}</label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Custom Message Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            {t('settings.customMessageTemplates')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('settings.messageTemplatesDescription')}
            </p>
            <Button
              variant="gradient"
              onClick={() => {
                setTemplateFormData({ name: '', subject: '', message: '' });
                setEditingTemplate(null);
                setShowMessageTemplates(true);
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              {t('settings.addTemplate')}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {settings.notifications.messageTemplates.map((template) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-semibold text-gray-900 text-sm">
                    {template.name}
                  </h4>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => startEditingTemplate(template)}
                      className="p-1 text-primary-600 hover:bg-primary-100 rounded transition-colors"
                      title={t('settings.editTemplate')}
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    {template.isCustom && (
                      <button
                        onClick={() => deleteTemplate(template.id)}
                        className="p-1 text-danger-600 hover:bg-danger-100 rounded transition-colors"
                        title={t('settings.deleteTemplate')}
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-gray-600 font-medium">
                    {t('settings.emailSubject')}: {template.subject}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-3">
                    {template.message.substring(0, 100)}...
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h5 className="font-medium text-blue-900 mb-2">{t('settings.availablePlaceholders')}:</h5>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-blue-700">
              <span>[CUSTOMER_NAME]</span>
              <span>[UNIT_NUMBER]</span>
              <span>[AMOUNT]</span>
              <span>[DUE_DATE]</span>
              <span>[EXPIRY_DATE]</span>
              <span>[DAYS_OVERDUE]</span>
              <span>[COMPANY_NAME]</span>
              <span>[CUSTOMER_PHONE]</span>
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
      case 'unitsizes':
        return renderUnitSizesSection();
      case 'notifications':
        return renderNotificationsSection();
      case 'system':
        return (
          <Card>
            <CardHeader>
              <CardTitle>{t('settings.systemConfiguration')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('settings.currency')}</label>
                  <select
                    value={settings.system.defaultCurrency}
                    onChange={(e) => handleInputChange('system', 'defaultCurrency', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="USD">US Dollar (USD)</option>
                    <option value="ILS">Israeli Shekel (ILS - ₪)</option>
                    <option value="EUR">Euro (EUR)</option>
                    <option value="GBP">British Pound (GBP)</option>
                    <option value="CAD">Canadian Dollar (CAD)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('settings.dateFormat')}</label>
                  <select
                    value={settings.system.dateFormat}
                    onChange={(e) => handleInputChange('system', 'dateFormat', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
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
      case 'security':
        return (
          <div className="space-y-6">
            {/* Password Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="w-5 h-5" />
                  {t('settings.passwordManagement')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    {t('settings.changePassword')}
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('settings.currentPassword')}
                      </label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? "text" : "password"}
                          value={passwordData.currentPassword || ''}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                          className="w-full px-3 py-2 pr-10 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder={t('settings.enterCurrentPassword')}
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                          {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('settings.newPassword')}
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          value={passwordData.newPassword || ''}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                          className="w-full px-3 py-2 pr-10 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder={t('settings.enterNewPassword')}
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                          {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('settings.confirmNewPassword')}
                      </label>
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={passwordData.confirmPassword || ''}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder={t('settings.confirmPassword')}
                      />
                    </div>

                    <Button 
                      variant="primary" 
                      onClick={handleChangePassword}
                      className="w-full"
                    >
                      <Lock className="w-4 h-4 mr-2" />
                      {t('settings.updatePassword')}
                    </Button>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
                  <div className="flex items-center space-x-2 mb-2">
                    <input
                      type="checkbox"
                      checked={settings.security.requireStrongPassword}
                      onChange={(e) => handleInputChange('security', 'requireStrongPassword', e.target.checked)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t('settings.requireStrongPassword')}
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 ml-6">
                    {t('settings.strongPasswordHelp')}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Authentication Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  {t('settings.authenticationSettings')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('settings.loginEmail')}
                  </label>
                  <input
                    type="email"
                    value={settings.security.loginEmail || settings.profile.email}
                    onChange={(e) => handleInputChange('security', 'loginEmail', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder={t('settings.enterLoginEmail')}
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {t('settings.loginEmailHelp')}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={settings.security.twoFactorAuth}
                    onChange={(e) => handleInputChange('security', 'twoFactorAuth', e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('settings.enableTwoFactorAuth')}
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={settings.security.enablePasswordRecovery}
                    onChange={(e) => handleInputChange('security', 'enablePasswordRecovery', e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('settings.enablePasswordRecovery')}
                  </label>
                </div>

                {settings.security.enablePasswordRecovery && (
                  <div className="ml-6 space-y-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={settings.security.recoveryViaEmail}
                        onChange={(e) => handleInputChange('security', 'recoveryViaEmail', e.target.checked)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <label className="text-sm text-gray-700 dark:text-gray-300">
                        {t('settings.recoveryViaEmail')}
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={settings.security.recoveryViaWhatsApp}
                        onChange={(e) => handleInputChange('security', 'recoveryViaWhatsApp', e.target.checked)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <label className="text-sm text-gray-700 dark:text-gray-300">
                        {t('settings.recoveryViaWhatsApp')}
                      </label>
                    </div>

                    {settings.security.recoveryViaWhatsApp && (
                      <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                          {t('settings.recoveryPhone')}
                        </label>
                        <input
                          type="tel"
                          value={settings.security.recoveryPhone || settings.profile.phone}
                          onChange={(e) => handleInputChange('security', 'recoveryPhone', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                          placeholder="+972501234567"
                        />
                      </div>
                    )}
                  </div>
                )}

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-3">
                  <div className="flex">
                    <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0" />
                    <div className="text-sm text-blue-700 dark:text-blue-300">
                      <p className="font-semibold mb-1">{t('settings.loginRequired')}</p>
                      <p>{t('settings.loginRequiredHelp')}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
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
                  ].map(themeOption => {
                    const Icon = themeOption.icon;
                    return (
                      <button
                        key={themeOption.value}
                        onClick={() => updateTheme(themeOption.value)}
                        className={`p-4 rounded-lg border-2 transition-colors ${
                          theme === themeOption.value
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                            : 'border-gray-200 hover:border-gray-300 dark:border-gray-600 dark:hover:border-gray-500'
                        }`}
                      >
                        <Icon className="w-8 h-8 mx-auto mb-2 text-gray-600 dark:text-gray-300" />
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{themeOption.label}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('settings.primaryColor')}</label>
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
                        <p className="text-xs text-gray-500 dark:text-gray-400">{section.description}</p>
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
            <div className="flex items-center gap-6">
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

      {/* Message Template Modal */}
      <AnimatePresence>
        {showMessageTemplates && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowMessageTemplates(false)}
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
                  {editingTemplate ? t('settings.editTemplate') : t('settings.addNewTemplate')}
                </h2>
                <button
                  onClick={() => setShowMessageTemplates(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('settings.templateName')} *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={templateFormData.name}
                      onChange={handleTemplateFormChange}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder={t('settings.templateNamePlaceholder')}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('settings.emailSubject')} *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={templateFormData.subject}
                      onChange={handleTemplateFormChange}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder={t('settings.subjectPlaceholder')}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('settings.messageContent')} *
                    </label>
                    <textarea
                      name="message"
                      value={templateFormData.message}
                      onChange={handleTemplateFormChange}
                      rows="8"
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder={t('settings.messagePlaceholder')}
                    />
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h5 className="font-medium text-gray-900 mb-2">{t('settings.availablePlaceholders')}:</h5>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                      <span className="px-2 py-1 bg-white rounded border">[CUSTOMER_NAME]</span>
                      <span className="px-2 py-1 bg-white rounded border">[UNIT_NUMBER]</span>
                      <span className="px-2 py-1 bg-white rounded border">[AMOUNT]</span>
                      <span className="px-2 py-1 bg-white rounded border">[DUE_DATE]</span>
                      <span className="px-2 py-1 bg-white rounded border">[EXPIRY_DATE]</span>
                      <span className="px-2 py-1 bg-white rounded border">[DAYS_OVERDUE]</span>
                      <span className="px-2 py-1 bg-white rounded border">[COMPANY_NAME]</span>
                      <span className="px-2 py-1 bg-white rounded border">[CUSTOMER_PHONE]</span>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      variant="secondary"
                      onClick={() => setShowMessageTemplates(false)}
                      className="flex-1"
                    >
                      {t('common.cancel')}
                    </Button>
                    <Button
                      variant="gradient"
                      onClick={saveTemplate}
                      className="flex-1"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {editingTemplate ? t('settings.updateTemplate') : t('settings.saveTemplate')}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Settings;