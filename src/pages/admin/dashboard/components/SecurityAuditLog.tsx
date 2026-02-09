
import { useState } from 'react';

interface SecurityAuditLogProps {
  darkMode: boolean;
}

const SecurityAuditLog = ({ darkMode }: SecurityAuditLogProps) => {
  const [filter, setFilter] = useState<'all' | 'login' | 'changes' | 'alerts'>('all');

  const auditLogs = [
    { type: 'login', action: 'Successful Login', user: 'Admin', ip: '192.168.1.45', time: '10 min ago', icon: 'ri-login-box-line', severity: 'info' },
    { type: 'changes', action: 'Password Changed', user: 'HR Manager', ip: '192.168.1.78', time: '2h ago', icon: 'ri-lock-password-line', severity: 'warning' },
    { type: 'alerts', action: 'Failed Login Attempt (3x)', user: 'Unknown', ip: '45.33.12.98', time: '4h ago', icon: 'ri-error-warning-line', severity: 'danger' },
    { type: 'login', action: 'Successful Login', user: 'Content Editor', ip: '192.168.1.102', time: '6h ago', icon: 'ri-login-box-line', severity: 'info' },
    { type: 'changes', action: 'Role Permission Updated', user: 'Admin', ip: '192.168.1.45', time: '1d ago', icon: 'ri-shield-user-line', severity: 'warning' },
    { type: 'alerts', action: 'Suspicious IP Blocked', user: 'System', ip: '103.45.67.89', time: '1d ago', icon: 'ri-spam-2-line', severity: 'danger' },
    { type: 'login', action: 'Session Expired', user: 'HR Manager', ip: '192.168.1.78', time: '2d ago', icon: 'ri-time-line', severity: 'info' },
    { type: 'changes', action: 'Two-Factor Enabled', user: 'Admin', ip: '192.168.1.45', time: '3d ago', icon: 'ri-shield-check-line', severity: 'info' },
  ];

  const filtered = filter === 'all' ? auditLogs : auditLogs.filter(l => l.type === filter);

  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case 'danger':
        return darkMode ? 'text-red-400 bg-red-600/20' : 'text-red-600 bg-red-50';
      case 'warning':
        return darkMode ? 'text-yellow-400 bg-yellow-600/20' : 'text-yellow-600 bg-yellow-50';
      default:
        return darkMode ? 'text-green-400 bg-green-600/20' : 'text-green-600 bg-green-50';
    }
  };

  const getIconBg = (severity: string) => {
    switch (severity) {
      case 'danger':
        return darkMode ? 'bg-red-600/20' : 'bg-red-50';
      case 'warning':
        return darkMode ? 'bg-yellow-600/20' : 'bg-yellow-50';
      default:
        return darkMode ? 'bg-green-600/20' : 'bg-green-50';
    }
  };

  const getIconColor = (severity: string) => {
    switch (severity) {
      case 'danger':
        return darkMode ? 'text-red-400' : 'text-red-600';
      case 'warning':
        return darkMode ? 'text-yellow-400' : 'text-yellow-600';
      default:
        return darkMode ? 'text-green-400' : 'text-green-600';
    }
  };

  const stats = [
    { label: 'Total Logins', value: '128', icon: 'ri-login-box-line' },
    { label: 'Failed Attempts', value: '7', icon: 'ri-error-warning-line' },
    { label: 'IPs Blocked', value: '3', icon: 'ri-spam-2-line' },
  ];

  return (
    <div className={`rounded-lg p-6 border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'Merriweather, serif' }}>
            Security Audit Log
          </h2>
          <span className={`w-2 h-2 rounded-full ${darkMode ? 'bg-green-400' : 'bg-green-500'} animate-pulse`} />
        </div>
        <div className={`flex items-center p-1 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
          {(['all', 'login', 'changes', 'alerts'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer whitespace-nowrap capitalize ${
                filter === f
                  ? 'bg-red-600 text-white shadow-sm'
                  : darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {stats.map((stat, i) => (
          <div key={i} className={`p-3 rounded-lg text-center ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <div className={`w-8 h-8 mx-auto mb-1.5 rounded-md flex items-center justify-center ${darkMode ? 'bg-gray-600' : 'bg-white'}`}>
              <i className={`${stat.icon} text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
            </div>
            <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stat.value}</p>
            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Log Entries */}
      <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
        {filtered.map((log, index) => (
          <div
            key={index}
            className={`flex items-center gap-3 p-3 rounded-lg transition-all cursor-pointer ${
              darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
            }`}
          >
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${getIconBg(log.severity)}`}>
              <i className={`${log.icon} text-base ${getIconColor(log.severity)}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{log.action}</p>
              <p className={`text-xs mt-0.5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                {log.user} &middot; {log.ip}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1 flex-shrink-0">
              <span className={`text-xs px-2 py-0.5 rounded-md font-medium ${getSeverityStyle(log.severity)}`}>
                {log.severity === 'danger' ? 'Alert' : log.severity === 'warning' ? 'Notice' : 'OK'}
              </span>
              <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{log.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SecurityAuditLog;
