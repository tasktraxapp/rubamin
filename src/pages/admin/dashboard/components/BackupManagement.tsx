
import { useState } from 'react';

interface BackupManagementProps {
  darkMode: boolean;
}

const BackupManagement = ({ darkMode }: BackupManagementProps) => {
  const [showSchedule, setShowSchedule] = useState(false);

  const backups = [
    { id: 1, name: 'Full Backup', date: 'Jan 15, 2025 — 03:00 AM', size: '2.4 GB', status: 'completed', type: 'auto', icon: 'ri-checkbox-circle-line' },
    { id: 2, name: 'Full Backup', date: 'Jan 14, 2025 — 03:00 AM', size: '2.3 GB', status: 'completed', type: 'auto', icon: 'ri-checkbox-circle-line' },
    { id: 3, name: 'Manual Backup', date: 'Jan 13, 2025 — 11:45 AM', size: '2.3 GB', status: 'completed', type: 'manual', icon: 'ri-checkbox-circle-line' },
    { id: 4, name: 'Full Backup', date: 'Jan 13, 2025 — 03:00 AM', size: '2.2 GB', status: 'completed', type: 'auto', icon: 'ri-checkbox-circle-line' },
    { id: 5, name: 'Full Backup', date: 'Jan 12, 2025 — 03:00 AM', size: '2.2 GB', status: 'failed', type: 'auto', icon: 'ri-close-circle-line' },
    { id: 6, name: 'Full Backup', date: 'Jan 11, 2025 — 03:00 AM', size: '2.1 GB', status: 'completed', type: 'auto', icon: 'ri-checkbox-circle-line' },
  ];

  const scheduleInfo = [
    { label: 'Frequency', value: 'Daily' },
    { label: 'Time', value: '03:00 AM IST' },
    { label: 'Retention', value: '30 Days' },
    { label: 'Next Backup', value: 'Tomorrow, 03:00 AM' },
  ];

  return (
    <div className={`rounded-lg p-6 border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      <div className="flex items-center justify-between mb-5">
        <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'Merriweather, serif' }}>
          Backup Management
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSchedule(!showSchedule)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer whitespace-nowrap ${
              showSchedule
                ? 'bg-red-600 text-white'
                : darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <i className="ri-calendar-schedule-line mr-1" />
            Schedule
          </button>
          <button className="px-3 py-1.5 text-xs font-medium rounded-md bg-red-600 text-white hover:bg-red-700 transition-all cursor-pointer whitespace-nowrap">
            <i className="ri-download-cloud-line mr-1" />
            Backup Now
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className={`p-3 rounded-lg text-center ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>28</p>
          <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Total Backups</p>
        </div>
        <div className={`p-3 rounded-lg text-center ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <p className={`text-lg font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>96%</p>
          <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Success Rate</p>
        </div>
        <div className={`p-3 rounded-lg text-center ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>64 GB</p>
          <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Total Size</p>
        </div>
      </div>

      {/* Schedule Info */}
      {showSchedule && (
        <div className={`grid grid-cols-2 gap-3 mb-5 p-4 rounded-lg border ${darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
          {scheduleInfo.map((item, i) => (
            <div key={i} className="flex items-center justify-between">
              <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{item.label}</span>
              <span className={`text-xs font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{item.value}</span>
            </div>
          ))}
        </div>
      )}

      {/* Backup History */}
      <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
        {backups.map((backup) => (
          <div
            key={backup.id}
            className={`flex items-center gap-3 p-3 rounded-lg transition-all cursor-pointer ${
              darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
            }`}
          >
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
              backup.status === 'completed'
                ? darkMode ? 'bg-green-600/20' : 'bg-green-50'
                : darkMode ? 'bg-red-600/20' : 'bg-red-50'
            }`}>
              <i className={`${backup.icon} text-base ${
                backup.status === 'completed'
                  ? darkMode ? 'text-green-400' : 'text-green-600'
                  : darkMode ? 'text-red-400' : 'text-red-600'
              }`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{backup.name}</p>
                {backup.type === 'manual' && (
                  <span className={`text-xs px-1.5 py-0.5 rounded ${darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-600'}`}>Manual</span>
                )}
              </div>
              <p className={`text-xs mt-0.5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{backup.date}</p>
            </div>
            <div className="flex flex-col items-end gap-1 flex-shrink-0">
              <span className={`text-xs font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{backup.size}</span>
              <span className={`text-xs font-medium capitalize ${
                backup.status === 'completed'
                  ? darkMode ? 'text-green-400' : 'text-green-600'
                  : darkMode ? 'text-red-400' : 'text-red-600'
              }`}>{backup.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BackupManagement;
