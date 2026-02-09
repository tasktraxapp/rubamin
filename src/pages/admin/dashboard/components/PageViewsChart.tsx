
import { useState } from 'react';

interface PageViewsChartProps {
  darkMode: boolean;
}

const PageViewsChart = ({ darkMode }: PageViewsChartProps) => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');

  const chartData: Record<
    string,
    { label: string; views: number; unique: number }[]
  > = {
    '7d': [
      { label: 'Mon', views: 342, unique: 218 },
      { label: 'Tue', views: 478, unique: 312 },
      { label: 'Wed', views: 521, unique: 389 },
      { label: 'Thu', views: 395, unique: 267 },
      { label: 'Fri', views: 612, unique: 445 },
      { label: 'Sat', views: 289, unique: 178 },
      { label: 'Sun', views: 198, unique: 134 },
    ],
    '30d': [
      { label: 'W1', views: 2340, unique: 1580 },
      { label: 'W2', views: 2890, unique: 1920 },
      { label: 'W3', views: 3120, unique: 2150 },
      { label: 'W4', views: 2760, unique: 1870 },
    ],
    '90d': [
      { label: 'Jan', views: 8450, unique: 5620 },
      { label: 'Feb', views: 9120, unique: 6340 },
      { label: 'Mar', views: 10580, unique: 7210 },
    ],
  };

  const data = chartData[timeRange];
  const maxViews = Math.max(...data.map((d) => d.views));
  const totalViews = data.reduce((sum, d) => sum + d.views, 0);
  const totalUnique = data.reduce((sum, d) => sum + d.unique, 0);

  return (
    <div
      className={`rounded-lg p-6 border ${
        darkMode
          ? 'bg-gray-800 border-gray-700'
          : 'bg-white border-gray-200'
      }`}
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2
            className={`text-lg font-bold ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}
            style={{ fontFamily: 'Merriweather, serif' }}
          >
            Page Views
          </h2>
          <div className="flex items-center gap-4 mt-1">
            <span
              className={`text-xs ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}
            >
              Total:{' '}
              <strong
                className={darkMode ? 'text-white' : 'text-gray-900'}
              >
                {totalViews.toLocaleString()}
              </strong>
            </span>
            <span
              className={`text-xs ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}
            >
              Unique:{' '}
              <strong
                className={darkMode ? 'text-white' : 'text-gray-900'}
              >
                {totalUnique.toLocaleString()}
              </strong>
            </span>
          </div>
        </div>
        <div
          className={`flex items-center p-1 rounded-lg ${
            darkMode ? 'bg-gray-700' : 'bg-gray-100'
          }`}
        >
          {(['7d', '30d', '90d'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer whitespace-nowrap ${
                timeRange === range
                  ? 'bg-red-600 text-white shadow-sm'
                  : darkMode
                  ? 'text-gray-400 hover:text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {range === '7d'
                ? '7 Days'
                : range === '30d'
                ? '30 Days'
                : '90 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* Bar Chart */}
      <div className="flex items-end gap-2 h-48 mt-4">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex-1 flex flex-col items-center gap-1"
          >
            <div className="w-full flex flex-col items-center gap-0.5 flex-1 justify-end">
              <span
                className={`text-xs font-semibold ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                {item.views}
              </span>
              <div
                className="w-full flex gap-1 items-end"
                style={{
                  height: `${(item.views / maxViews) * 100}%`,
                }}
              >
                <div
                  className="flex-1 bg-red-600 rounded-t-md transition-all duration-500 min-h-[4px]"
                  style={{ height: '100%' }}
                  title={`Views: ${item.views}`}
                />
                <div
                  className={`flex-1 rounded-t-md transition-all duration-500 min-h-[4px] ${
                    darkMode ? 'bg-gray-600' : 'bg-gray-300'
                  }`}
                  style={{
                    height: `${(item.unique / item.views) * 100}%`,
                  }}
                  title={`Unique: ${item.unique}`}
                />
              </div>
            </div>
            <span
              className={`text-xs mt-2 ${
                darkMode ? 'text-gray-500' : 'text-gray-400'
              }`}
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div
        className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-dashed"
        style={{
          borderColor: darkMode ? '#374151' : '#e5e7eb',
        }}
      >
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-red-600" />
          <span
            className={`text-xs ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}
          >
            Total Views
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className={`w-3 h-3 rounded-sm ${
              darkMode ? 'bg-gray-600' : 'bg-gray-300'
            }`}
          />
          <span
            className={`text-xs ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}
          >
            Unique Visitors
          </span>
        </div>
      </div>
    </div>
  );
};

export default PageViewsChart;
