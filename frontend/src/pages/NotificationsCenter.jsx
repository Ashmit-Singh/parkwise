import React, { useState, useEffect } from 'react';
import { notificationsAPI } from '../services/apiEnhanced';
import { useAuthStore } from '../stores/authStore';
import { 
  Bell, 
  Check, 
  Trash2, 
  Settings,
  AlertCircle,
  Info,
  CheckCircle,
  XCircle,
  TrendingUp,
  Heart,
  Award,
  MapPin
} from 'lucide-react';
import toast from 'react-hot-toast';

const NotificationsCenter = () => {
  const { user } = useAuthStore();
  const [notifications, setNotifications] = useState([]);
  const [preferences, setPreferences] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    if (user?.id) {
      fetchNotifications();
      fetchPreferences();
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await notificationsAPI.getNotifications(user.id);
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const fetchPreferences = async () => {
    try {
      const response = await notificationsAPI.getPreferences(user.id);
      setPreferences(response.data);
    } catch (error) {
      console.error('Error fetching preferences:', error);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationsAPI.markAsRead(notificationId);
      setNotifications(notifications.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      ));
      toast.success('Marked as read');
    } catch (error) {
      console.error('Error marking as read:', error);
      toast.error('Failed to mark as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsAPI.markAllAsRead(user.id);
      setNotifications(notifications.map(n => ({ ...n, read: true })));
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Error marking all as read:', error);
      toast.error('Failed to mark all as read');
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      await notificationsAPI.deleteNotification(notificationId);
      setNotifications(notifications.filter(n => n.id !== notificationId));
      toast.success('Notification deleted');
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error('Failed to delete notification');
    }
  };

  const handleUpdatePreferences = async (key, value) => {
    try {
      const updatedPreferences = {
        ...preferences,
        [key]: value
      };
      await notificationsAPI.updatePreferences(user.id, updatedPreferences);
      setPreferences(updatedPreferences);
      toast.success('Preferences updated');
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast.error('Failed to update preferences');
    }
  };

  const getNotificationIcon = (type) => {
    const icons = {
      INFO: Info,
      SUCCESS: CheckCircle,
      WARNING: AlertCircle,
      ERROR: XCircle,
      DONATION: Heart,
      SPECIES: Award,
      CAMPAIGN: TrendingUp,
      LOCATION: MapPin
    };
    return icons[type] || Bell;
  };

  const getNotificationColor = (type) => {
    const colors = {
      INFO: 'from-blue-400 to-blue-600',
      SUCCESS: 'from-green-400 to-green-600',
      WARNING: 'from-yellow-400 to-yellow-600',
      ERROR: 'from-red-400 to-red-600',
      DONATION: 'from-pink-400 to-pink-600',
      SPECIES: 'from-purple-400 to-purple-600',
      CAMPAIGN: 'from-orange-400 to-orange-600',
      LOCATION: 'from-teal-400 to-teal-600'
    };
    return colors[type] || 'from-gray-400 to-gray-600';
  };

  const filteredNotifications = notifications.filter(n => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !n.read;
    if (activeTab === 'read') return n.read;
    return n.type === activeTab.toUpperCase();
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Bell className="w-12 h-12" />
                <h1 className="text-4xl font-bold">Notifications</h1>
              </div>
              <p className="text-xl text-blue-50">
                Stay updated with your conservation activities
              </p>
            </div>
            {unreadCount > 0 && (
              <div className="bg-white text-blue-600 px-6 py-3 rounded-full font-bold text-lg">
                {unreadCount} Unread
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>
              
              <div className="space-y-2">
                {['all', 'unread', 'read', 'donation', 'species', 'campaign'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveTab(filter)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      activeTab === filter
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </button>
                ))}
              </div>

              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="w-full mt-4 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Mark All Read
                </button>
              )}
            </div>

            {/* Notification Preferences */}
            {preferences && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Preferences
                </h2>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Email Notifications</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.emailNotifications}
                        onChange={(e) => handleUpdatePreferences('emailNotifications', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Push Notifications</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.pushNotifications}
                        onChange={(e) => handleUpdatePreferences('pushNotifications', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">SMS Notifications</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.smsNotifications}
                        onChange={(e) => handleUpdatePreferences('smsNotifications', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Notifications List */}
          <div className="lg:col-span-3">
            {filteredNotifications.length > 0 ? (
              <div className="space-y-4">
                {filteredNotifications.map((notification) => {
                  const Icon = getNotificationIcon(notification.type);
                  const gradient = getNotificationColor(notification.type);

                  return (
                    <div
                      key={notification.id}
                      className={`bg-white rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg ${
                        !notification.read ? 'border-l-4 border-blue-600' : ''
                      }`}
                    >
                      <div className="p-6">
                        <div className="flex items-start gap-4">
                          <div className={`p-3 bg-gradient-to-br ${gradient} rounded-lg flex-shrink-0`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>

                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className={`font-semibold ${!notification.read ? 'text-gray-900' : 'text-gray-600'}`}>
                                {notification.title}
                              </h3>
                              <span className="text-xs text-gray-500">
                                {new Date(notification.createdAt).toLocaleDateString()}
                              </span>
                            </div>

                            <p className="text-sm text-gray-600 mb-3">
                              {notification.message}
                            </p>

                            <div className="flex items-center gap-2">
                              {!notification.read && (
                                <button
                                  onClick={() => handleMarkAsRead(notification.id)}
                                  className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                                >
                                  <Check className="w-4 h-4" />
                                  Mark as read
                                </button>
                              )}
                              <button
                                onClick={() => handleDelete(notification.id)}
                                className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-1"
                              >
                                <Trash2 className="w-4 h-4" />
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No notifications
                </h3>
                <p className="text-gray-600">
                  You're all caught up! Check back later for updates.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsCenter;
