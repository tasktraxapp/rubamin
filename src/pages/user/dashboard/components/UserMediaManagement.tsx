
import { useState } from 'react';

interface UserMediaManagementProps {
  darkMode: boolean;
}

const mockMedia = [
  { id: 1, title: 'Annual Report 2024', type: 'Notice', category: 'Reports', date: '2025-01-15', status: 'Published', views: 234 },
  { id: 2, title: 'Q4 Financial Results', type: 'Notice', category: 'Financial', date: '2025-01-12', status: 'Published', views: 189 },
  { id: 3, title: 'Equipment Procurement', type: 'Tender', category: 'Procurement', date: '2025-01-10', status: 'Open', views: 156 },
  { id: 4, title: 'Board Meeting Minutes', type: 'Notice', category: 'Corporate', date: '2025-01-08', status: 'Draft', views: 0 },
  { id: 5, title: 'Safety Equipment Supply', type: 'Tender', category: 'HSE', date: '2025-01-05', status: 'Closed', views: 98 },
  { id: 6, title: 'Press Release - Expansion', type: 'News', category: 'Media', date: '2025-01-03', status: 'Published', views: 312 },
  { id: 7, title: 'Transport Services', type: 'Tender', category: 'Logistics', date: '2025-01-02', status: 'Open', views: 87 },
  { id: 8, title: 'Holiday Schedule 2025', type: 'Notice', category: 'HR', date: '2024-12-28', status: 'Published', views: 445 },
];

export default function UserMediaManagement({ darkMode }: UserMediaManagementProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredMedia = mockMedia.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || item.type.toLowerCase() === typeFilter;
    const matchesStatus = statusFilter === 'all' || item.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const stats = [
    { label: 'Total Items', value: mockMedia.length, icon: 'ri-newspaper-line' },
    { label: 'Notices', value: mockMedia.filter(m => m.type === 'Notice').length, icon: 'ri-notification-line' },
    { label: 'Tenders', value: mockMedia.filter(m => m.type === 'Tender').length, icon: 'ri-auction-line' },
    { label: 'Total Views', value: mockMedia.reduce((acc, m) => acc + m.views, 0).toLocaleString(), icon: 'ri-eye-line' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className={`p-5 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${darkMode ? 'bg-red-600/20' : 'bg-red-50'}`}>
                <i className={`${stat.icon} text-xl ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
              </div>
              <div>
                <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'Merriweather, serif' }}>{stat.value}</p>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <i className={`ri-search-line absolute left-3 top-1/2 -translate-y-1/2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search media..."
                className={`w-full pl-10 pr-4 py-2 rounded-lg border text-sm ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500'} focus:outline-none focus:ring-2 focus:ring-red-600`}
              />
            </div>
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className={`px-4 py-2 rounded-lg border text-sm cursor-pointer ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-red-600`}
          >
            <option value="all">All Types</option>
            <option value="notice">Notices</option>
            <option value="tender">Tenders</option>
            <option value="news">News</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`px-4 py-2 rounded-lg border text-sm cursor-pointer ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-red-600`}
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
          </select>
          <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-2">
            <i className="ri-add-line" />
            Add New
          </button>
        </div>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMedia.map((item) => (
          <div key={item.id} className={`rounded-lg border overflow-hidden hover:shadow-lg transition-all cursor-pointer ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className={`px-5 py-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-0.5 text-xs font-semibold rounded ${
                      item.type === 'Notice' 
                        ? darkMode ? 'bg-blue-600/20 text-blue-400' : 'bg-blue-50 text-blue-600'
                        : item.type === 'Tender'
                          ? darkMode ? 'bg-orange-600/20 text-orange-400' : 'bg-orange-50 text-orange-600'
                          : darkMode ? 'bg-purple-600/20 text-purple-400' : 'bg-purple-50 text-purple-600'
                    }`}>
                      {item.type}
                    </span>
                    <span className={`px-2 py-0.5 text-xs font-semibold rounded ${
                      item.status === 'Published' || item.status === 'Open'
                        ? darkMode ? 'bg-green-600/20 text-green-400' : 'bg-green-50 text-green-600'
                        : item.status === 'Draft'
                          ? darkMode ? 'bg-yellow-600/20 text-yellow-400' : 'bg-yellow-50 text-yellow-600'
                          : darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  <h3 className={`text-sm font-semibold truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>{item.title}</h3>
                  <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{item.category}</p>
                </div>
              </div>
            </div>
            <div className={`px-5 py-3 flex items-center justify-between ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
              <div className="flex items-center gap-4">
                <span className={`text-xs flex items-center gap-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <i className="ri-calendar-line" />
                  {item.date}
                </span>
                <span className={`text-xs flex items-center gap-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <i className="ri-eye-line" />
                  {item.views}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button className={`w-7 h-7 flex items-center justify-center rounded cursor-pointer ${darkMode ? 'hover:bg-gray-600 text-gray-400' : 'hover:bg-gray-200 text-gray-500'}`}>
                  <i className="ri-edit-line text-sm" />
                </button>
                <button className={`w-7 h-7 flex items-center justify-center rounded cursor-pointer ${darkMode ? 'hover:bg-red-600/20 text-red-400' : 'hover:bg-red-50 text-red-600'}`}>
                  <i className="ri-delete-bin-line text-sm" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredMedia.length === 0 && (
        <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <i className="ri-inbox-line text-4xl mb-3" />
          <p className="text-sm">No media items found</p>
        </div>
      )}
    </div>
  );
}
