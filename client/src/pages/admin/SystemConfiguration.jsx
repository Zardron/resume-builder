import { useState, useEffect } from 'react';
import { Save, Settings, Shield, Bell, Link2, Globe } from 'lucide-react';
import {
  defaultConfig,
  getSystemSettingsConfig,
  getSecuritySettingsConfig,
  getNotificationSettingsConfig,
  getIntegrationsSettingsConfig,
  getGeneralTextSettingsConfig,
} from '../../config/SystemConfigData';
import { adminAPI } from '../../services/api';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';

// Reusable Toggle Switch Component
const ToggleSwitch = ({ checked, onChange, label, description }) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
        {description && (
          <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
          checked
            ? 'bg-blue-600 dark:bg-blue-500'
            : 'bg-gray-200 dark:bg-gray-700'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
};

// Reusable Number Input Component
const NumberInput = ({ value, onChange, label, min, max }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        min={min}
        max={max}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
      />
    </div>
  );
};

// Reusable Text Input Component
const TextInput = ({ value, onChange, label, description }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      {description && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{description}</p>
      )}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
      />
    </div>
  );
};

// Configuration Section Component
const ConfigSection = ({ title, icon: Icon, children }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex items-center gap-3 mb-4">
        <Icon className="h-5 w-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
      </div>
      {children}
    </div>
  );
};

// Configuration Group Component
const ConfigGroup = ({ title, items, config, updateConfig }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
        {title}
      </h3>
      {items.map((item) => {
        const value = config[item.category][item.key];
        return (
          <ToggleSwitch
            key={item.key}
            checked={value}
            onChange={() => updateConfig(item.category, item.key, !value)}
            label={item.label}
            description={item.description}
          />
        );
      })}
    </div>
  );
};

const SystemConfiguration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [config, setConfig] = useState(defaultConfig);
  const [saveMessage, setSaveMessage] = useState(null);

  // Fetch configuration on component mount
  useEffect(() => {
    const fetchConfig = async () => {
      setIsFetching(true);
      try {
        const response = await adminAPI.getSystemConfig();
        if (response && response.general) {
          // Merge with default config to ensure all fields are present
          setConfig({
            general: { ...defaultConfig.general, ...(response.general || {}) },
            security: { ...defaultConfig.security, ...(response.security || {}) },
            notifications: { ...defaultConfig.notifications, ...(response.notifications || {}) },
            integrations: { ...defaultConfig.integrations, ...(response.integrations || {}) },
          });
        }
      } catch (error) {
        console.error('Error fetching system configuration:', error);
        // Use default config if fetch fails
        setConfig(defaultConfig);
      } finally {
        setIsFetching(false);
      }
    };

    fetchConfig();
  }, []);

  const handleSave = async () => {
    setIsLoading(true);
    setSaveMessage(null);
    try {
      await adminAPI.updateSystemConfig(config);
      setSaveMessage({ type: 'success', text: 'Configuration saved successfully!' });
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      console.error('Error saving configuration:', error);
      setSaveMessage({ 
        type: 'error', 
        text: error.message || 'Failed to save configuration. Please try again.' 
      });
      setTimeout(() => setSaveMessage(null), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  const updateConfig = (section, key, value) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  const systemSettings = getSystemSettingsConfig();
  const securitySettings = getSecuritySettingsConfig();
  const notificationSettings = getNotificationSettingsConfig();
  const integrationsSettings = getIntegrationsSettingsConfig();
  const generalTextSettings = getGeneralTextSettingsConfig();

  // Map group keys to display titles
  const groupTitles = {
    systemControl: 'System Control',
    coreFeatures: 'Core Features',
    communication: 'Communication',
    userManagement: 'User Management',
    paymentMonetization: 'Payment & Monetization',
    integrationsAPI: 'Integrations & API',
    dataManagement: 'Data Management',
    advancedFeatures: 'Advanced Features',
  };

  if (isFetching) {
    return (
      <div className="p-6">
        <LoadingSkeleton type="default" className="w-full" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">System Configuration</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage platform-wide settings and configurations</p>
        </div>
        <div className="flex items-center gap-3">
          {saveMessage && (
            <div className={`px-4 py-2 rounded-lg text-sm ${
              saveMessage.type === 'success' 
                ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' 
                : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
            }`}>
              {saveMessage.text}
            </div>
          )}
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="h-4 w-4" />
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* General Text Settings */}
        <ConfigSection title="General Settings" icon={Globe}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {generalTextSettings.map((item) => (
              <TextInput
                key={item.key}
                value={config[item.category][item.key]}
                onChange={(value) => updateConfig(item.category, item.key, value)}
                label={item.label}
                description={item.description}
              />
            ))}
          </div>
        </ConfigSection>

        {/* System Settings */}
        <ConfigSection title="System Settings" icon={Settings}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {Object.entries(systemSettings).map(([groupKey, items]) => (
              <ConfigGroup
                key={groupKey}
                title={groupTitles[groupKey] || groupKey}
                items={items}
                config={config}
                updateConfig={updateConfig}
              />
            ))}
          </div>
        </ConfigSection>

        {/* Security & Notification Settings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ConfigSection title="Security Settings" icon={Shield}>
            <div className="space-y-4">
              {securitySettings.map((item) => {
                if (item.type === 'number') {
                  return (
                    <NumberInput
                      key={item.key}
                      value={config[item.category][item.key]}
                      onChange={(value) => updateConfig(item.category, item.key, value)}
                      label={item.label}
                      min={item.min}
                      max={item.max}
                    />
                  );
                }
                return (
                  <ToggleSwitch
                    key={item.key}
                    checked={config[item.category][item.key]}
                    onChange={() => updateConfig(item.category, item.key, !config[item.category][item.key])}
                    label={item.label}
                    description={item.description}
                  />
                );
              })}
            </div>
          </ConfigSection>

          <ConfigSection title="Notification Settings" icon={Bell}>
            <div className="space-y-4">
              {notificationSettings.map((item) => (
                <ToggleSwitch
                  key={item.key}
                  checked={config[item.category][item.key]}
                  onChange={() => updateConfig(item.category, item.key, !config[item.category][item.key])}
                  label={item.label}
                  description={item.description}
                />
              ))}
            </div>
          </ConfigSection>
        </div>

        {/* Integrations Settings */}
        <ConfigSection title="Integrations Settings" icon={Link2}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {integrationsSettings.map((item) => (
              <ToggleSwitch
                key={item.key}
                checked={config[item.category][item.key]}
                onChange={() => updateConfig(item.category, item.key, !config[item.category][item.key])}
                label={item.label}
                description={item.description}
              />
            ))}
          </div>
        </ConfigSection>
      </div>
    </div>
  );
};

export default SystemConfiguration;

