
import React from 'react';

interface UserEngagementProps {
  darkMode: boolean;
}

const UserEngagement: React.FC<UserEngagementProps> = ({ darkMode }) => {
  const metrics = [
    {
      label: 'Avg. Session Duration',
      value: '3m 42s',
      icon: 'ri-time-line',
      change: '+8%',
      trend: 'up',
      description: 'Time spent per visit',
    },
    {
      label: 'Bounce Rate',
      value: '34.2%',
      icon: 'ri-logout-box-r-line',
      change: '-5%',
      trend: 'up',
      description: 'Single page visits',
    },
    {
      label: 'Pages per Session',
      value: '4.7',
      icon: 'ri-pages-line',
      change: '+12%',
      trend: 'up',
      description: 'Avg pages viewed',
    },
    {
      label: 'Return Visitors',
      value: '28.5%',
      icon: 'ri-user-follow-line',
      change: '+3%',
      trend: 'up',
      description: 'Repeat visitors rate',
    },
  ];

  const deviceBreakdown = [
    { device: 'Desktop', percentage: 52, icon: 'ri-computer-line' },
    { device: 'Mobile', percentage: 38, icon: 'ri-smartphone-line' },
    { device: 'Tablet', percentage: 10, icon: 'ri-tablet-line' },
  ];

  const topCountries = [
    { country: 'DR Congo', flag: '🇨🇩', visitors: 542, percentage: 43 },
    { country: 'India', flag: '🇮🇳', visitors: 234, percentage: 19 },
    { country: 'South Africa', flag: '🇿🇦', visitors: 156, percentage: 12 },
    { country: 'Belgium', flag: '🇧🇪', visitors: 98, percentage: 8 },
    { country: 'Others', flag: '🌍', visitors: 217, percentage: 18 },
  ];

  return (
    <div
      className={`rounded-lg p-6 border ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}
    >
      <h2
        className={`text-lg font-bold mb-5 ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}
        style={{ fontFamily: 'Merriweather, serif' }}
      >
        User Engagement
      </h2>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className={`p-3.5 rounded-lg ${
              darkMode ? 'bg-gray-700' : 'bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <div
                className={`w-7 h-7 rounded-md flex items-center justify-center ${
                  darkMode ? 'bg-gray-600' : 'bg-white'
                }`}
              >
                <i
                  className={`${metric.icon} text-sm ${
                    darkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}
                />
              </div>
              <span
                className={`text-xs font-medium ${
                  metric.trend === 'up' ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {metric.change}
              </span>
            </div>
            <p
              className={`text-lg font-bold ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}
            >
              {metric.value}
            </p>
            <p
              className={`text-xs mt-0.5 ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}
            >
              {metric.label}
            </p>
          </div>
        ))}
      </div>

      {/* Device Breakdown */}
      <div className="mb-6">
        <h3
          className={`text-sm font-semibold mb-3 ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}
        >
          Device Breakdown
        </h3>
        <div className="space-y-3">
          {deviceBreakdown.map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-md flex items-center justify-center ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-100'
                }`}
              >
                <i
                  className={`${item.icon} text-sm ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}
                />
              </div>
              <span
                className={`text-sm w-16 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                {item.device}
              </span>
              <div
                className={`flex-1 h-2 rounded-full ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-100'
                }`}
              >
                <div
                  className="h-2 rounded-full bg-red-600 transition-all duration-700"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
              <span
                className={`text-sm font-semibold w-10 text-right ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}
              >
                {item.percentage}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Countries */}
      <div>
        <h3
          className={`text-sm font-semibold mb-3 ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}
        >
          Top Countries
        </h3>
        <div className="space-y-2">
          {topCountries.map((item, index) => (
            <div
              key={index}
              className={`flex items-center gap-3 py-2 px-3 rounded-md ${
                darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
              } transition-colors cursor-pointer`}
            >
              <span className="text-base">{item.flag}</span>
              <span
                className={`flex-1 text-sm ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                {item.country}
              </span>
              <span
                className={`text-xs ${
                  darkMode ? 'text-gray-500' : 'text-gray-400'
                }`}
              >
                {item.visitors}
              </span>
              <span
                className={`text-sm font-semibold ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}
              >
                {item.percentage}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserEngagement;
