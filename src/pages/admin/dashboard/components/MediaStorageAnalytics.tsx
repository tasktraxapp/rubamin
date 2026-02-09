
import { useState } from 'react';

interface MediaStorageAnalyticsProps {
  darkMode: boolean;
}

const MediaStorageAnalytics = ({ darkMode }: MediaStorageAnalyticsProps) => {
  const [view, setView] = useState<'type' | 'category'>('type');

  const byType = [
    { label: 'Images', size: '1.2 GB', count: 342, percent: 50, color: 'bg-red-600', icon: 'ri-image-line' },
    { label: 'Documents', size: '620 MB', count: 89, percent: 26, color: darkMode ? 'bg-gray-500' : 'bg-gray-700', icon: 'ri-file-text-line' },
    { label: 'Videos', size: '380 MB', count: 12, percent: 16, color: darkMode ? 'bg-gray-600' : 'bg-gray-400', icon: 'ri-video-line' },
    { label: 'Others', size: '200 MB', count: 34, percent: 8, color: darkMode ? 'bg-gray-700' : 'bg-gray-300', icon: 'ri-folder-line' },
  ];

  const byCategory = [
    { label: 'Gallery', size: '890 MB', count: 215, percent: 37, color: 'bg-red-600', icon: 'ri-gallery-line' },
    { label: 'Products', size: '520 MB', count: 78, percent: 22, color: darkMode ? 'bg-gray-500' : 'bg-gray-700', icon: 'ri-box-3-line' },
    { label: 'Reports', size: '410 MB', count: 56, percent: 17, color: darkMode ? 'bg-gray-600' : 'bg-gray-400', icon: 'ri-file-chart-line' },
    { label: 'News & Media', size: '340 MB', count: 94, percent: 14, color: darkMode ? 'bg-gray-700' : 'bg-gray-300', icon: 'ri-newspaper-line' },
    { label: 'CSR', size: '240 MB', count: 34, percent: 10, color: darkMode ? 'bg-gray-800' : 'bg-gray-200', icon: 'ri-heart-line' },
  ];

  const data = view === 'type' ? byType : byCategory;
  const totalSize = '2.4 GB';
  const totalFiles = 477;

  return (
    <div className={`rounded-lg p-6 border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      <div className="flex items-center justify-between mb-5">
        <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'Merriweather, serif' }}>
          Media Storage Analytics
        </h2>
        <div className={`flex items-center p-1 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
          {(['type', 'category'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer whitespace-nowrap capitalize ${
                view === v
                  ? 'bg-red-600 text-white shadow-sm'
                  : darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              By {v}
            </button>
          ))}
        </div>
      </div>

      {/* Overall Storage */}
      <div className={`p-4 rounded-lg mb-5 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Total Storage Used</p>
            <p className={`text-2xl font-bold mt-0.5 ${darkMode ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'Merriweather, serif' }}>
              {totalSize} <span className={`text-sm font-normal ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>/ 10 GB</span>
            </p>
          </div>
          <div className="text-right">
            <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Total Files</p>
            <p className={`text-2xl font-bold mt-0.5 ${darkMode ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'Merriweather, serif' }}>
              {totalFiles}
            </p>
          </div>
        </div>
        {/* Stacked Bar */}
        <div className="w-full h-3 rounded-full overflow-hidden flex">
          {data.map((item, i) => (
            <div
              key={i}
              className={`${item.color} h-full transition-all duration-500`}
              style={{ width: `${item.percent}%` }}
              title={`${item.label}: ${item.size}`}
            />
          ))}
        </div>
      </div>

      {/* Breakdown List */}
      <div className="space-y-3">
        {data.map((item, index) => (
          <div
            key={index}
            className={`flex items-center gap-3 p-3 rounded-lg transition-all cursor-pointer ${
              darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
            }`}
          >
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <i className={`${item.icon} text-base ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1.5">
                <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{item.label}</p>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{item.count} files</span>
                  <span className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{item.size}</span>
                </div>
              </div>
              <div className={`w-full h-1.5 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <div
                  className={`h-1.5 rounded-full ${item.color} transition-all duration-700`}
                  style={{ width: `${item.percent}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MediaStorageAnalytics;
