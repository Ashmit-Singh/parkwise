import React, { useState, useEffect } from 'react';
import { privacyAPI } from '../services/apiEnhanced';
import { useAuthStore } from '../stores/authStore';
import { 
  Shield, 
  Download, 
  Trash2, 
  Eye, 
  EyeOff,
  CheckCircle,
  AlertTriangle,
  Lock,
  Globe,
  FileText,
  Settings
} from 'lucide-react';
import toast from 'react-hot-toast';

const PrivacyCenter = () => {
  const { user } = useAuthStore();
  const [privacySettings, setPrivacySettings] = useState(null);
  const [consentStatus, setConsentStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchPrivacyData();
    }
  }, [user]);

  const fetchPrivacyData = async () => {
    try {
      setLoading(true);

      // Fetch privacy settings
      const settingsRes = await privacyAPI.getPrivacySettings(user.id);
      setPrivacySettings(settingsRes.data);

      // Fetch consent status
      const consentRes = await privacyAPI.getConsentStatus(user.id);
      setConsentStatus(consentRes.data);

    } catch (error) {
      console.error('Error fetching privacy data:', error);
      toast.error('Failed to load privacy settings');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSettings = async (setting, value) => {
    try {
      const updatedSettings = {
        ...privacySettings,
        [setting]: value
      };

      await privacyAPI.updatePrivacySettings(user.id, updatedSettings);
      setPrivacySettings(updatedSettings);
      toast.success('Privacy settings updated');
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('Failed to update settings');
    }
  };

  const handleUpdateConsent = async (consentType, value) => {
    try {
      const updatedConsent = {
        ...consentStatus,
        [consentType]: value,
        timestamp: new Date().toISOString()
      };

      await privacyAPI.updateConsent(user.id, updatedConsent);
      setConsentStatus(updatedConsent);
      toast.success('Consent preferences updated');
    } catch (error) {
      console.error('Error updating consent:', error);
      toast.error('Failed to update consent');
    }
  };

  const handleExportData = async () => {
    try {
      setExporting(true);
      const response = await privacyAPI.exportUserData(user.id);
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `parkwise-data-${user.id}.json`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success('Your data has been exported successfully');
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('Failed to export data');
    } finally {
      setExporting(false);
    }
  };

  const handleDeleteData = async () => {
    const confirmation = window.confirm(
      'Are you sure you want to delete all your data? This action cannot be undone.'
    );
    
    if (!confirmation) return;

    const secondConfirmation = window.prompt(
      'Type "DELETE" to confirm permanent deletion of your account and all data:'
    );

    if (secondConfirmation !== 'DELETE') {
      toast.error('Deletion cancelled');
      return;
    }

    try {
      setDeleting(true);
      await privacyAPI.deleteUserData(user.id);
      toast.success('Your data has been deleted. You will be logged out.');
      
      // Logout after 2 seconds
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } catch (error) {
      console.error('Error deleting data:', error);
      toast.error('Failed to delete data');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-12 h-12" />
            <h1 className="text-4xl font-bold">Privacy Center</h1>
          </div>
          <p className="text-xl text-blue-50">
            Manage your data, privacy settings, and GDPR compliance
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* GDPR Rights */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600" />
            Your GDPR Rights
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Export Data */}
            <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-600 rounded-lg">
                  <Download className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Export Your Data</h3>
                  <p className="text-sm text-gray-600">Download all your data</p>
                </div>
              </div>
              <p className="text-sm text-gray-700 mb-4">
                Get a complete copy of all your personal data stored in our system in JSON format.
              </p>
              <button
                onClick={handleExportData}
                disabled={exporting}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {exporting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Export Data
                  </>
                )}
              </button>
            </div>

            {/* Delete Data */}
            <div className="p-6 bg-gradient-to-br from-red-50 to-orange-50 rounded-xl border border-red-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-red-600 rounded-lg">
                  <Trash2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Delete Your Data</h3>
                  <p className="text-sm text-gray-600">Permanently remove all data</p>
                </div>
              </div>
              <p className="text-sm text-gray-700 mb-4">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
              <button
                onClick={handleDeleteData}
                disabled={deleting}
                className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {deleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Delete All Data
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Privacy Settings */}
        {privacySettings && (
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Settings className="w-6 h-6 text-purple-600" />
              Privacy Settings
            </h2>

            <div className="space-y-4">
              {/* Profile Visibility */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  {privacySettings.profilePublic ? (
                    <Eye className="w-5 h-5 text-green-600" />
                  ) : (
                    <EyeOff className="w-5 h-5 text-gray-600" />
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-900">Public Profile</h3>
                    <p className="text-sm text-gray-600">
                      Make your profile visible to other users
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={privacySettings.profilePublic}
                    onChange={(e) => handleUpdateSettings('profilePublic', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* Location Sharing */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-blue-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Location Sharing</h3>
                    <p className="text-sm text-gray-600">
                      Share your location for geospatial features
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={privacySettings.shareLocation}
                    onChange={(e) => handleUpdateSettings('shareLocation', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* Activity Tracking */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Lock className="w-5 h-5 text-purple-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Activity Tracking</h3>
                    <p className="text-sm text-gray-600">
                      Allow tracking for personalized recommendations
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={privacySettings.allowTracking}
                    onChange={(e) => handleUpdateSettings('allowTracking', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* Data Anonymization */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-green-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Data Anonymization</h3>
                    <p className="text-sm text-gray-600">
                      Anonymize your data in research studies
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={privacySettings.anonymizeData}
                    onChange={(e) => handleUpdateSettings('anonymizeData', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Consent Management */}
        {consentStatus && (
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-600" />
              Consent Management
            </h2>

            <div className="space-y-4">
              {/* Marketing Consent */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">Marketing Communications</h3>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consentStatus.marketingConsent}
                      onChange={(e) => handleUpdateConsent('marketingConsent', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <p className="text-sm text-gray-600">
                  Receive updates about new features, campaigns, and conservation news
                </p>
              </div>

              {/* Research Participation */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">Research Participation</h3>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consentStatus.researchConsent}
                      onChange={(e) => handleUpdateConsent('researchConsent', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <p className="text-sm text-gray-600">
                  Allow your anonymized data to be used in conservation research studies
                </p>
              </div>

              {/* Third-party Sharing */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">Third-party Data Sharing</h3>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consentStatus.thirdPartySharing}
                      onChange={(e) => handleUpdateConsent('thirdPartySharing', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <p className="text-sm text-gray-600">
                  Share anonymized data with trusted conservation partners
                </p>
              </div>
            </div>

            {consentStatus.timestamp && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-900">
                  <strong>Last Updated:</strong> {new Date(consentStatus.timestamp).toLocaleString()}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Information Notice */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-2xl shadow-xl p-8">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-8 h-8 flex-shrink-0" />
            <div>
              <h3 className="text-xl font-bold mb-2">Your Privacy Matters</h3>
              <p className="text-blue-50 mb-4">
                We are committed to protecting your privacy and complying with GDPR, CCPA, and other data protection regulations. Your data is encrypted, anonymized where possible, and never sold to third parties.
              </p>
              <p className="text-sm text-blue-100">
                For more information, please read our <a href="/privacy-policy" className="underline hover:text-white">Privacy Policy</a> and <a href="/terms" className="underline hover:text-white">Terms of Service</a>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyCenter;
