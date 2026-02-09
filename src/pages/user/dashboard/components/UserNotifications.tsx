
import { useState } from 'react';

interface UserNotificationsProps {
  darkMode: boolean;
}

const UserNotifications = ({ darkMode }: UserNotificationsProps) => {
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New Job Opening', message: 'Senior Process Engineer position is now open. Application deadline: Feb 15, 2025.', time: '1 hour ago', unread: true, type: 'jobs', icon: 'ri-briefcase-line' },
    { id: 2, title: 'Job Application Update', message: 'Your application for Mechanical Technician has been shortlisted for interview.', time: '3 hours ago', unread: true, type: 'jobs', icon: 'ri-briefcase-line' },
    { id: 3, title: 'New Resource Available', message: 'Annual Financial Report 2024 has been uploaded to the Resources Center.', time: '5 hours ago', unread: true, type: 'resources', icon: 'ri-folder-line' },
    { id: 4, title: 'Inquiry Response', message: 'Your inquiry INQ-2025-0042 regarding equipment specifications has been answered.', time: '1 day ago', unread: false, type: 'inquiries', icon: 'ri-question-answer-line' },
    { id: 5, title: 'Resource Update', message: 'HSE Policy Document has been updated to version 4.1. Please review the changes.', time: '2 days ago', unread: false, type: 'resources', icon: 'ri-folder-line' },
    { id: 6, title: 'Job Interview Scheduled', message: 'Interview for Electrical Engineer position scheduled for Jan 28, 2025 at 10:00 AM.', time: '3 days ago', unread: false, type: 'jobs', icon: 'ri-briefcase-line' },
    { id: 7, title: 'Inquiry Submitted', message: 'Your inquiry INQ-2025-0045 has been submitted and is under review.', time: '4 days ago', unread: false, type: 'inquiries', icon: 'ri-question-answer-line' },
    { id: 8, title: 'New Certification Added', message: 'ISO 45001:2018 certification document is now available in Resources Center.', time: '5 days ago', unread: false, type: 'resources', icon: 'ri-folder-line' },
  ]);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const markAsRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'Merriweather, serif' }}>
            Notifications
          </h1>
          <p className={`mt-2 text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className={`text-sm font-medium flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              darkMode ? 'text-red-400 hover:bg-red-600/10' : 'text-red-600 hover:bg-red-50'
            }`}
          >
            <i className="ri-check-double-line" />
            Mark all as read
          </button>
        )}
      </div>

      <div className={`rounded-lg border overflow-hidden ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        {notifications.map((notification) => (
          <div
            key={notification.id}
            onClick={() => markAsRead(notification.id)}
            className={`px-6 py-5 border-b last:border-b-0 transition-colors cursor-pointer ${
              darkMode
                ? `border-gray-700 ${notification.unread ? 'bg-gray-700/50' : ''} hover:bg-gray-700/30`
                : `border-gray-100 ${notification.unread ? 'bg-red-50/30' : ''} hover:bg-gray-50`
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                notification.unread
                  ? darkMode ? 'bg-red-600/20' : 'bg-red-50'
                  : darkMode ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                <i className={`${notification.icon} text-lg ${
                  notification.unread
                    ? darkMode ? 'text-red-400' : 'text-red-600'
                    : darkMode ? 'text-gray-400' : 'text-gray-500'
                }`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 mb-1">
                  <h3 className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {notification.title}
                  </h3>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {notification.unread && (
                      <span className="w-2 h-2 bg-red-600 rounded-full" />
                    )}
                    <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{notification.time}</span>
                  </div>
                </div>
                <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {notification.message}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserNotifications;
