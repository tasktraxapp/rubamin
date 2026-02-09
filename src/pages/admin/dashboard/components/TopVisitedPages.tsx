
import React from 'react';

interface TopVisitedPagesProps {
  darkMode: boolean;
}

const TopVisitedPages: React.FC<TopVisitedPagesProps> = ({ darkMode }) => {
  const pages = [
    { page: 'Home', path: '/', views: 4521, change: '+8.2%', trend: 'up' },
    { page: 'Corporate Overview', path: '/company/corporate-overview', views: 1893, change: '+12.5%', trend: 'up' },
    { page: 'Copper Blister', path: '/products/copper-blister', views: 1456, change: '+5.1%', trend: 'up' },
    { page: 'Jobs', path: '/jobs', views: 1234, change: '+22.3%', trend: 'up' },
    { page: 'Contact', path: '/contact', views: 987, change: '-3.4%', trend: 'down' },
    { page: 'Gallery', path: '/gallery', views: 876, change: '+1.8%', trend: 'up' },
    { page: 'HSE', path: '/sustainability/hse', views: 654, change: '+6.7%', trend: 'up' },
    { page: 'Media Center', path: '/media', views: 543, change: '-1.2%', trend: 'down' },
  ];

  // Guard against an empty pages array
  const maxViews = pages.length > 0 ? pages[0].views : 0;

  return (
    <div
      className={`rounded-lg p-6 border ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}
    >
      <div className="flex items-center justify-between mb-5">
        <h2
          className={`text-lg font-bold ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}
          style={{ fontFamily: 'Merriweather, serif' }}
        >
          Top Visited Pages
        </h2>
        <span
          className={`text-xs font-semibold px-3 py-1.5 rounded-md ${
            darkMode ? 'text-gray-300 bg-gray-700' : 'text-gray-600 bg-gray-100'
          }`}
        >
          This Month
        </span>
      </div>

      <div className="space-y-3">
        {pages.map((item, index) => (
          <div
            key={index}
            className={`flex items-center gap-3 p-3 rounded-lg transition-all cursor-pointer ${
              darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
            }`}
          >
            <span
              className={`w-6 h-6 flex items-center justify-center rounded-md text-xs font-bold ${
                index < 3
                  ? 'bg-red-600 text-white'
                  : darkMode
                  ? 'bg-gray-700 text-gray-400'
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              {index + 1}
            </span>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <p
                  className={`text-sm font-medium truncate ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {item.page}
                </p>

                <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                  <span
                    className={`text-sm font-semibold ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {item.views.toLocaleString()}
                  </span>
                  <span
                    className={`text-xs font-medium ${
                      item.trend === 'up' ? 'text-green-500' : 'text-red-500'
                    }`}
                  >
                    {item.change}
                  </span>
                </div>
              </div>

              <div
                className={`w-full h-1.5 rounded-full ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-100'
                }`}
              >
                <div
                  className="h-1.5 rounded-full bg-red-600 transition-all duration-700"
                  style={{
                    width: maxViews
                      ? `${(item.views / maxViews) * 100}%`
                      : '0%',
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopVisitedPages;
