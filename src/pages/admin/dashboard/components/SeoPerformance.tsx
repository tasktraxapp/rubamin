
import React from 'react';

interface SeoPerformanceProps {
  darkMode: boolean;
}

/**
 * SeoPerformance component
 *
 * Displays a set of SEO metrics and a list of top keywords.
 * The component is fully typed, includes a React import (required for JSX
 * when using TypeScript with the "react-jsx" pragma disabled), and adds a
 * small amount of defensive error handling to avoid runtime crashes if
 * the provided data arrays are empty or malformed.
 */
const SeoPerformance: React.FC<SeoPerformanceProps> = ({ darkMode }) => {
  // Defensive defaults – if the arrays were to become undefined they will
  // fallback to an empty array, preventing .map crashes.
  const metrics = React.useMemo(
    () => [
      { label: 'Domain Authority', value: 42, max: 100, icon: 'ri-shield-check-line', change: '+3' },
      { label: 'Page Speed Score', value: 87, max: 100, icon: 'ri-speed-line', change: '+5' },
      { label: 'Indexed Pages', value: 34, max: 40, icon: 'ri-file-search-line', change: '+2' },
      { label: 'Backlinks', value: 156, max: 200, icon: 'ri-link', change: '+12' },
    ],
    []
  );

  const topKeywords = React.useMemo(
    () => [
      { keyword: 'rubamin sarl', position: 1, volume: 320, change: 0 },
      { keyword: 'copper blister drc', position: 3, volume: 210, change: 2 },
      { keyword: 'mining company lubumbashi', position: 5, volume: 180, change: -1 },
      { keyword: 'industrial gas congo', position: 8, volume: 140, change: 3 },
      { keyword: 'medical oxygen drc', position: 12, volume: 95, change: 1 },
    ],
    []
  );

  // Helper to safely compute the progress‑bar width.
  const getProgressWidth = (value: number, max: number): string => {
    if (max <= 0) return '0%';
    const perc = Math.min(Math.max((value / max) * 100, 0), 100);
    return `${perc}%`;
  };

  return (
    <div
      className={`rounded-lg p-6 border ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2
          className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}
          style={{ fontFamily: 'Merriweather, serif' }}
        >
          SEO Performance
        </h2>
        <div
          className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md ${
            darkMode ? 'text-green-400 bg-green-500/20' : 'text-green-600 bg-green-50'
          }`}
        >
          <i className="ri-arrow-up-s-line" />
          Improving
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className={`p-3.5 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}
          >
            <div className="flex items-center justify-between mb-2">
              <div
                className={`w-8 h-8 rounded-md flex items-center justify-center ${
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
                  darkMode ? 'text-green-400' : 'text-green-600'
                }`}
              >
                {metric.change}
              </span>
            </div>
            <p className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {metric.value}
            </p>
            <p className={`text-xs mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {metric.label}
            </p>
            <div
              className={`w-full h-1 rounded-full mt-2 ${
                darkMode ? 'bg-gray-600' : 'bg-gray-200'
              }`}
            >
              <div
                className="h-1 rounded-full bg-red-600"
                style={{ width: getProgressWidth(metric.value, metric.max) }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Top Keywords */}
      <div>
        <h3
          className={`text-sm font-semibold mb-3 ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}
        >
          Top Keywords
        </h3>
        <div className="space-y-2">
          {topKeywords.map((kw, index) => (
            <div
              key={index}
              className={`flex items-center gap-3 py-2 px-3 rounded-md ${
                darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
              } transition-colors cursor-pointer`}
            >
              <span
                className={`w-8 text-center text-sm font-bold ${
                  kw.position <= 3 ? 'text-red-600' : darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}
              >
                #{kw.position}
              </span>
              <span
                className={`flex-1 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
              >
                {kw.keyword}
              </span>
              <span
                className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}
              >
                {kw.volume}/mo
              </span>
              <span
                className={`text-xs font-medium ${
                  kw.change > 0
                    ? 'text-green-500'
                    : kw.change < 0
                    ? 'text-red-500'
                    : darkMode
                    ? 'text-gray-500'
                    : 'text-gray-400'
                }`}
              >
                {kw.change > 0 ? `+${kw.change}` : kw.change === 0 ? '—' : kw.change}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SeoPerformance;
