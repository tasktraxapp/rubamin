
import { useState, useEffect } from 'react';

interface ServerPerformanceProps {
  darkMode: boolean;
}

const ServerPerformance = ({ darkMode }: ServerPerformanceProps) => {
  const [cpuUsage, setCpuUsage] = useState(32);
  const [memoryUsage, setMemoryUsage] = useState(58);
  const [diskUsage] = useState(24);

  useEffect(() => {
    const interval = setInterval(() => {
      setCpuUsage(prev =>
        Math.min(100, Math.max(15, prev + (Math.random() * 10 - 5)))
      );
      setMemoryUsage(prev =>
        Math.min(100, Math.max(40, prev + (Math.random() * 6 - 3)))
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const metrics = [
    {
      label: 'CPU Usage',
      value: Math.round(cpuUsage),
      unit: '%',
      icon: 'ri-cpu-line',
      color:
        cpuUsage > 80 ? 'red' : cpuUsage > 60 ? 'yellow' : 'green',
    },
    {
      label: 'Memory',
      value: Math.round(memoryUsage),
      unit: '%',
      icon: 'ri-ram-line',
      color:
        memoryUsage > 80 ? 'red' : memoryUsage > 60 ? 'yellow' : 'green',
    },
    {
      label: 'Disk',
      value: diskUsage,
      unit: '%',
      icon: 'ri-hard-drive-2-line',
      color: 'green',
    },
  ];

  const getColorClass = (color: string) => {
    switch (color) {
      case 'red':
        return 'text-red-500';
      case 'yellow':
        return 'text-yellow-500';
      default:
        return 'text-green-500';
    }
  };

  const getBgColorClass = (color: string) => {
    switch (color) {
      case 'red':
        return 'bg-red-500';
      case 'yellow':
        return 'bg-yellow-500';
      default:
        return 'bg-green-500';
    }
  };

  const uptimeData = [
    { period: 'Today', uptime: '100%', status: 'green' },
    { period: 'This Week', uptime: '99.98%', status: 'green' },
    { period: 'This Month', uptime: '99.95%', status: 'green' },
    { period: 'This Year', uptime: '99.87%', status: 'green' },
  ];

  const responseTimeData = [
    { endpoint: 'Homepage', time: '142ms', status: 'fast' },
    { endpoint: 'Products', time: '198ms', status: 'fast' },
    { endpoint: 'Gallery', time: '312ms', status: 'medium' },
    { endpoint: 'Contact Form', time: '89ms', status: 'fast' },
    { endpoint: 'API Endpoints', time: '67ms', status: 'fast' },
  ];

  return (
    <div
      className={`rounded-lg p-6 border ${
        darkMode
          ? 'bg-gray-800 border-gray-700'
          : 'bg-white border-gray-200'
      }`}
    >
      <div className="flex items-center justify-between mb-5">
        <h2
          className={`text-lg font-bold ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}
          style={{ fontFamily: 'Merriweather, serif' }}
        >
          Server Performance
        </h2>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span
            className={`text-xs font-medium ${
              darkMode ? 'text-green-400' : 'text-green-600'
            }`}
          >
            All Systems Normal
          </span>
        </div>
      </div>

      {/* Resource Gauges */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg text-center ${
              darkMode ? 'bg-gray-700' : 'bg-gray-50'
            }`}
          >
            <div className="relative w-16 h-16 mx-auto mb-2">
              <svg
                className="w-full h-full -rotate-90"
                viewBox="0 0 36 36"
              >
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke={darkMode ? '#374151' : '#e5e7eb'}
                  strokeWidth="3"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  className={getBgColorClass(metric.color)}
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeDasharray={`${metric.value * 0.88} 100`}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dasharray 1s ease' }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span
                  className={`text-sm font-bold ${getColorClass(
                    metric.color
                  )}`}
                >
                  {metric.value}%
                </span>
              </div>
            </div>
            <p
              className={`text-xs font-medium ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}
            >
              {metric.label}
            </p>
          </div>
        ))}
      </div>

      {/* Uptime */}
      <div className="mb-5">
        <h3
          className={`text-sm font-semibold mb-3 ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}
        >
          Uptime
        </h3>
        <div className="grid grid-cols-4 gap-2">
          {uptimeData.map((item, index) => (
            <div
              key={index}
              className={`p-2.5 rounded-md text-center ${
                darkMode ? 'bg-gray-700' : 'bg-gray-50'
              }`}
            >
              <p
                className={`text-sm font-bold ${
                  darkMode ? 'text-green-400' : 'text-green-600'
                }`}
              >
                {item.uptime}
              </p>
              <p
                className={`text-xs mt-0.5 ${
                  darkMode ? 'text-gray-500' : 'text-gray-400'
                }`}
              >
                {item.period}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Response Times */}
      <div>
        <h3
          className={`text-sm font-semibold mb-3 ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}
        >
          Response Times
        </h3>
        <div className="space-y-2">
          {responseTimeData.map((item, index) => (
            <div
              key={index}
              className={`flex items-center justify-between py-2 px-3 rounded-md ${
                darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
              } transition-colors cursor-pointer`}
            >
              <span
                className={`text-sm ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                {item.endpoint}
              </span>
              <span
                className={`text-sm font-semibold ${
                  item.status === 'fast'
                    ? darkMode
                      ? 'text-green-400'
                      : 'text-green-600'
                    : darkMode
                    ? 'text-yellow-400'
                    : 'text-yellow-600'
                }`}
              >
                {item.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServerPerformance;
