
import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const ActivityLogPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('adminDarkMode');
    return saved ? JSON.parse(saved) : false;
  });

  // Filters
  const [userFilter, setUserFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [activitySearch, setActivitySearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn');
    if (!isLoggedIn) {
      navigate('/admin');
    }
  }, [navigate]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('adminDarkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const adminUser = JSON.parse(sessionStorage.getItem('adminUser') || '{"name": "Admin", "email": "admin@rubamindrc.com"}');

  const handleLogout = () => {
    sessionStorage.removeItem('adminLoggedIn');
    sessionStorage.removeItem('adminUser');
    navigate('/admin');
  };

  const allActivities = [
    { id: 1, action: 'Page Updated', item: 'Corporate Overview', user: 'Admin', time: '2 hours ago', date: '2024-01-15', icon: 'ri-edit-line', type: 'update', ip: '192.168.1.100' },
    { id: 2, action: 'Notice Added', item: 'Annual Report 2024', user: 'Admin', time: '5 hours ago', date: '2024-01-15', icon: 'ri-notification-line', type: 'create', ip: '192.168.1.100' },
    { id: 3, action: 'Job Posted', item: 'Mining Engineer', user: 'HR', time: '1 day ago', date: '2024-01-14', icon: 'ri-briefcase-line', type: 'create', ip: '192.168.1.105' },
    { id: 4, action: 'Gallery Updated', item: 'Facilities Photos', user: 'Admin', time: '2 days ago', date: '2024-01-13', icon: 'ri-image-line', type: 'update', ip: '192.168.1.100' },
    { id: 5, action: 'User Login', item: 'Dashboard Access', user: 'Finance', time: '2 days ago', date: '2024-01-13', icon: 'ri-login-box-line', type: 'login', ip: '192.168.1.110' },
    { id: 6, action: 'Document Uploaded', item: 'Q3 Financial Statement', user: 'Finance', time: '3 days ago', date: '2024-01-12', icon: 'ri-file-upload-line', type: 'upload', ip: '192.168.1.110' },
    { id: 7, action: 'Tender Published', item: 'Equipment Procurement', user: 'Procurement', time: '3 days ago', date: '2024-01-12', icon: 'ri-auction-line', type: 'create', ip: '192.168.1.115' },
    { id: 8, action: 'Inquiry Responded', item: 'Partnership Request', user: 'Admin', time: '4 days ago', date: '2024-01-11', icon: 'ri-mail-send-line', type: 'response', ip: '192.168.1.100' },
    { id: 9, action: 'Policy Updated', item: 'HSE Guidelines 2024', user: 'HSE Manager', time: '4 days ago', date: '2024-01-11', icon: 'ri-shield-check-line', type: 'update', ip: '192.168.1.120' },
    { id: 10, action: 'Certificate Added', item: 'ISO 14001:2015', user: 'Quality', time: '5 days ago', date: '2024-01-10', icon: 'ri-award-line', type: 'create', ip: '192.168.1.125' },
    { id: 11, action: 'Media Published', item: 'Press Release - Expansion', user: 'PR Team', time: '5 days ago', date: '2024-01-10', icon: 'ri-newspaper-line', type: 'create', ip: '192.168.1.130' },
    { id: 12, action: 'Job Closed', item: 'Accountant Position', user: 'HR', time: '6 days ago', date: '2024-01-09', icon: 'ri-checkbox-circle-line', type: 'update', ip: '192.168.1.105' },
    { id: 13, action: 'User Login', item: 'Dashboard Access', user: 'Admin', time: '6 days ago', date: '2024-01-09', icon: 'ri-login-box-line', type: 'login', ip: '192.168.1.100' },
    { id: 14, action: 'Settings Changed', item: 'Email Notifications', user: 'Admin', time: '7 days ago', date: '2024-01-08', icon: 'ri-settings-3-line', type: 'update', ip: '192.168.1.100' },
    { id: 15, action: 'Report Generated', item: 'Monthly Analytics', user: 'Admin', time: '7 days ago', date: '2024-01-08', icon: 'ri-file-chart-line', type: 'create', ip: '192.168.1.100' },
    { id: 16, action: 'User Created', item: 'New HR Account', user: 'Admin', time: '8 days ago', date: '2024-01-07', icon: 'ri-user-add-line', type: 'create', ip: '192.168.1.100' },
    { id: 17, action: 'Password Changed', item: 'Account Security', user: 'Finance', time: '8 days ago', date: '2024-01-07', icon: 'ri-lock-password-line', type: 'update', ip: '192.168.1.110' },
    { id: 18, action: 'File Deleted', item: 'Old Report 2022', user: 'Admin', time: '9 days ago', date: '2024-01-06', icon: 'ri-delete-bin-line', type: 'delete', ip: '192.168.1.100' },
    { id: 19, action: 'Backup Created', item: 'Full System Backup', user: 'System', time: '9 days ago', date: '2024-01-06', icon: 'ri-database-2-line', type: 'create', ip: 'System' },
    { id: 20, action: 'Page Created', item: 'New CSR Initiative', user: 'Admin', time: '10 days ago', date: '2024-01-05', icon: 'ri-file-add-line', type: 'create', ip: '192.168.1.100' },
    { id: 21, action: 'User Login', item: 'Dashboard Access', user: 'Procurement', time: '10 days ago', date: '2024-01-05', icon: 'ri-login-box-line', type: 'login', ip: '192.168.1.115' },
    { id: 22, action: 'Document Uploaded', item: 'Safety Manual v3', user: 'HSE Manager', time: '11 days ago', date: '2024-01-04', icon: 'ri-file-upload-line', type: 'upload', ip: '192.168.1.120' },
    { id: 23, action: 'Tender Closed', item: 'Vehicle Maintenance', user: 'Procurement', time: '11 days ago', date: '2024-01-04', icon: 'ri-auction-line', type: 'update', ip: '192.168.1.115' },
    { id: 24, action: 'Gallery Updated', item: 'Training Photos 2024', user: 'HR', time: '12 days ago', date: '2024-01-03', icon: 'ri-image-line', type: 'update', ip: '192.168.1.105' },
    { id: 25, action: 'Notice Published', item: 'Holiday Schedule', user: 'HR', time: '12 days ago', date: '2024-01-03', icon: 'ri-notification-line', type: 'create', ip: '192.168.1.105' },
    { id: 26, action: 'User Logout', item: 'Session Ended', user: 'Quality', time: '13 days ago', date: '2024-01-02', icon: 'ri-logout-box-line', type: 'logout', ip: '192.168.1.125' },
    { id: 27, action: 'Report Updated', item: 'Q4 Statistics', user: 'Finance', time: '13 days ago', date: '2024-01-02', icon: 'ri-file-chart-line', type: 'update', ip: '192.168.1.110' },
    { id: 28, action: 'Media Uploaded', item: 'Company Video 2024', user: 'PR Team', time: '14 days ago', date: '2024-01-01', icon: 'ri-video-upload-line', type: 'upload', ip: '192.168.1.130' },
    { id: 29, action: 'User Login', item: 'Dashboard Access', user: 'HR', time: '14 days ago', date: '2024-01-01', icon: 'ri-login-box-line', type: 'login', ip: '192.168.1.105' },
    { id: 30, action: 'System Update', item: 'CMS Version 2.5.1', user: 'System', time: '15 days ago', date: '2023-12-31', icon: 'ri-refresh-line', type: 'update', ip: 'System' },
  ];

  const uniqueUsers = ['all', ...Array.from(new Set(allActivities.map(a => a.user)))];
  const activityTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'create', label: 'Created' },
    { value: 'update', label: 'Updated' },
    { value: 'upload', label: 'Uploaded' },
    { value: 'login', label: 'Login' },
    { value: 'logout', label: 'Logout' },
    { value: 'delete', label: 'Deleted' },
    { value: 'response', label: 'Response' },
  ];

  const dateFilters = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
  ];

  const filteredActivities = allActivities.filter(activity => {
    const userMatch = userFilter === 'all' || activity.user === userFilter;
    const typeMatch = typeFilter === 'all' || activity.type === typeFilter;
    const searchMatch = activitySearch === '' || 
      activity.action.toLowerCase().includes(activitySearch.toLowerCase()) ||
      activity.item.toLowerCase().includes(activitySearch.toLowerCase()) ||
      activity.user.toLowerCase().includes(activitySearch.toLowerCase());
    return userMatch && typeMatch && searchMatch;
  });

  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);
  const paginatedActivities = filteredActivities.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const resetFilters = () => {
    setUserFilter('all');
    setTypeFilter('all');
    setDateFilter('all');
    setActivitySearch('');
    setCurrentPage(1);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'create':
        return darkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-50 text-green-600';
      case 'update':
        return darkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-50 text-blue-600';
      case 'delete':
        return darkMode ? 'bg-red-500/20 text-red-400' : 'bg-red-50 text-red-600';
      case 'login':
      case 'logout':
        return darkMode ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-50 text-purple-600';
      case 'upload':
        return darkMode ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-50 text-orange-600';
      default:
        return darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-100 text-gray-600';
    }
  };

  const sidebarItems = [
    { label: 'Dashboard', icon: 'ri-dashboard-3-line', path: '/admin/dashboard' },
    { label: 'Pages', icon: 'ri-file-list-3-line', path: '/admin/dashboard/pages' },
    { label: 'Media Center', icon: 'ri-newspaper-line', path: '/admin/dashboard/media-center', badge: 5 },
    { label: 'Jobs', icon: 'ri-briefcase-line', path: '/admin/dashboard/jobs', badge: 3 },
    { label: 'Gallery', icon: 'ri-gallery-line', path: '/admin/dashboard/gallery' },
    { label: 'Resources', icon: 'ri-folder-line', path: '/admin/dashboard/resources' },
    { label: 'Inquiries', icon: 'ri-mail-line', path: '/admin/dashboard/inquiries', badge: 8 },
    { label: 'Notifications', icon: 'ri-notification-3-line', path: '/admin/dashboard/notifications', badge: 4 },
    { label: 'Settings', icon: 'ri-settings-3-line', path: '/admin/dashboard/settings' },
  ];

  const breadcrumbs = [
    { label: 'Home', path: '/', icon: 'ri-home-4-line' },
    { label: 'Admin', path: '/admin' },
    { label: 'Dashboard', path: '/admin/dashboard' },
    { label: 'Activity Log', path: '/admin/dashboard/activity-log' },
  ];

  return (
    <div className={`min-h-screen flex ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Sidebar */}
      <aside className={`${sidebarCollapsed ? 'w-20' : 'w-64'} ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r flex flex-col fixed h-full transition-all duration-300 z-20`}>
        <div className={`p-5 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between`}>
          <button 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className={`flex items-center gap-3 ${sidebarCollapsed ? 'justify-center' : ''} cursor-pointer`}
          >
            <img
              src="https://static.readdy.ai/image/1b404af276821d98dfecb0eec592fbd4/2beca25c2dca50fd1a3109512ef52e33.png"
              alt="Logo"
              className="h-10 w-10 object-contain"
            />
            {!sidebarCollapsed && <span className={`text-xl font-bold tracking-wide ${darkMode ? 'text-white' : 'text-[#2C3E50]'}`}>RUBAMIN</span>}
          </button>
          {!sidebarCollapsed && (
            <button 
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className={`w-8 h-8 flex items-center justify-center rounded-lg ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'} cursor-pointer transition-colors`}
            >
              <i className="ri-menu-fold-line text-lg" />
            </button>
          )}
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {sidebarItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all relative ${
                  isActive
                    ? 'bg-red-600 text-white shadow-md'
                    : darkMode
                      ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                } ${sidebarCollapsed ? 'justify-center' : ''}`}
              >
                <i className={`${item.icon} text-lg`} />
                {!sidebarCollapsed && (
                  <>
                    <span className="flex-1">{item.label}</span>
                    {item.badge && item.badge > 0 && (
                      <span className={`min-w-5 h-5 flex items-center justify-center px-1.5 text-xs font-bold rounded-full ${
                        isActive ? 'bg-white text-red-600' : 'bg-red-600 text-white'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 ${sidebarCollapsed ? 'ml-20' : 'ml-64'} transition-all duration-300`}>
        {/* Top Header */}
        <header className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b px-8 py-4 sticky top-0 z-10`}>
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 max-w-xl">
              <div className="relative">
                <i className={`ri-search-line absolute left-4 top-1/2 -translate-y-1/2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search pages, media, jobs..."
                  className={`w-full pl-11 pr-4 py-2.5 ${darkMode ? 'bg-gray-700 text-white placeholder-gray-400 border-gray-600' : 'bg-gray-50 text-gray-900 placeholder-gray-500 border-gray-200'} border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all`}
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all cursor-pointer ${
                  darkMode ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                }`}
              >
                <i className={`${darkMode ? 'ri-sun-line' : 'ri-moon-line'} text-lg`} />
              </button>

              <Link to="/admin/dashboard/notifications" className={`relative w-10 h-10 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}>
                <i className={`ri-notification-3-line text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-600 rounded-full" />
              </Link>

              <div className={`hidden md:flex flex-col items-end px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <p className={`text-xs font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {currentTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>

              <Link to="/" target="_blank" className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white hover:bg-red-700 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap">
                <i className="ri-external-link-line" />
                View Site
              </Link>

              <div className="relative" ref={profileDropdownRef}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className={`w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center cursor-pointer hover:bg-red-700 transition-all ${profileDropdownOpen ? 'ring-2 ring-red-600 ring-offset-2' : ''}`}
                >
                  <span className="text-sm font-bold text-white">{adminUser.name.charAt(0)}</span>
                </button>

                {profileDropdownOpen && (
                  <div className={`absolute right-0 top-full mt-2 w-56 rounded-lg shadow-lg border overflow-hidden z-50 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <div className={`px-4 py-3 border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                      <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{adminUser.name}</p>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{adminUser.email}</p>
                    </div>
                    <div className={`border-t py-1 ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                      <button onClick={handleLogout} className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors cursor-pointer ${darkMode ? 'text-red-400 hover:bg-red-600/10' : 'text-red-600 hover:bg-red-50'}`}>
                        <i className="ri-logout-box-line" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Breadcrumb */}
        <div className={`px-8 py-3 border-b ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50/80 border-gray-200'}`}>
          <nav className="flex items-center gap-2 text-sm">
            {breadcrumbs.map((crumb, index) => (
              <div key={crumb.path} className="flex items-center gap-2">
                {index > 0 && <i className={`ri-arrow-right-s-line ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />}
                {index === breadcrumbs.length - 1 ? (
                  <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {crumb.icon && <i className={`${crumb.icon} mr-1.5`} />}
                    {crumb.label}
                  </span>
                ) : (
                  <Link to={crumb.path} className={`flex items-center transition-colors cursor-pointer ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}>
                    {crumb.icon && <i className={`${crumb.icon} mr-1.5`} />}
                    {crumb.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Page Content */}
        <div className="p-8">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'Merriweather, serif' }}>
                Activity Log
              </h1>
              <p className={`mt-2 text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Complete history of all system activities and user actions
              </p>
            </div>
            <button
              onClick={() => {/* Export functionality */}}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                darkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                  : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
              }`}
            >
              <i className="ri-download-line" />
              Export Log
            </button>
          </div>

          {/* Filters Card */}
          <div className={`rounded-lg p-6 border mb-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="flex flex-wrap items-center gap-4">
              {/* Search */}
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <i className={`ri-search-line absolute left-3 top-1/2 -translate-y-1/2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                  <input
                    type="text"
                    value={activitySearch}
                    onChange={(e) => { setActivitySearch(e.target.value); setCurrentPage(1); }}
                    placeholder="Search activities..."
                    className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-red-600 ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500'
                    }`}
                  />
                </div>
              </div>

              {/* User Filter */}
              <div className="relative">
                <select
                  value={userFilter}
                  onChange={(e) => { setUserFilter(e.target.value); setCurrentPage(1); }}
                  className={`appearance-none pl-3 pr-10 py-2.5 text-sm rounded-lg border cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-600 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-gray-50 border-gray-200 text-gray-900'
                  }`}
                >
                  {uniqueUsers.map(user => (
                    <option key={user} value={user}>
                      {user === 'all' ? 'All Users' : user}
                    </option>
                  ))}
                </select>
                <i className={`ri-arrow-down-s-line absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              </div>

              {/* Type Filter */}
              <div className="relative">
                <select
                  value={typeFilter}
                  onChange={(e) => { setTypeFilter(e.target.value); setCurrentPage(1); }}
                  className={`appearance-none pl-3 pr-10 py-2.5 text-sm rounded-lg border cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-600 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-gray-50 border-gray-200 text-gray-900'
                  }`}
                >
                  {activityTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                <i className={`ri-arrow-down-s-line absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              </div>

              {/* Date Filter */}
              <div className="relative">
                <select
                  value={dateFilter}
                  onChange={(e) => { setDateFilter(e.target.value); setCurrentPage(1); }}
                  className={`appearance-none pl-3 pr-10 py-2.5 text-sm rounded-lg border cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-600 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-gray-50 border-gray-200 text-gray-900'
                  }`}
                >
                  {dateFilters.map(filter => (
                    <option key={filter.value} value={filter.value}>
                      {filter.label}
                    </option>
                  ))}
                </select>
                <i className={`ri-arrow-down-s-line absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              </div>

              {/* Clear Filters */}
              {(userFilter !== 'all' || typeFilter !== 'all' || dateFilter !== 'all' || activitySearch !== '') && (
                <button
                  onClick={resetFilters}
                  className={`flex items-center gap-1.5 px-4 py-2.5 text-sm rounded-lg transition-colors cursor-pointer ${
                    darkMode 
                      ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <i className="ri-close-line" />
                  Clear All
                </button>
              )}
            </div>

            {/* Results Count */}
            <div className={`mt-4 pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Showing <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{filteredActivities.length}</span> activities
              </p>
            </div>
          </div>

          {/* Activities Table */}
          <div className={`rounded-lg border overflow-hidden ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            {/* Table Header */}
            <div className={`grid grid-cols-12 gap-4 px-6 py-4 text-xs font-semibold uppercase tracking-wider border-b ${
              darkMode ? 'bg-gray-700/50 border-gray-700 text-gray-400' : 'bg-gray-50 border-gray-200 text-gray-500'
            }`}>
              <div className="col-span-4">Activity</div>
              <div className="col-span-2">User</div>
              <div className="col-span-2">Type</div>
              <div className="col-span-2">IP Address</div>
              <div className="col-span-2">Time</div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {paginatedActivities.length > 0 ? (
                paginatedActivities.map((activity) => (
                  <div 
                    key={activity.id} 
                    className={`grid grid-cols-12 gap-4 px-6 py-4 items-center transition-colors cursor-pointer ${
                      darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="col-span-4 flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                        <i className={`${activity.icon} text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                      </div>
                      <div className="min-w-0">
                        <p className={`text-sm font-medium truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>{activity.action}</p>
                        <p className={`text-xs truncate ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{activity.item}</p>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{activity.user}</span>
                    </div>
                    <div className="col-span-2">
                      <span className={`text-xs px-2.5 py-1 rounded-md capitalize font-medium ${getTypeColor(activity.type)}`}>
                        {activity.type}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <span className={`text-sm font-mono ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{activity.ip}</span>
                    </div>
                    <div className="col-span-2">
                      <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{activity.time}</p>
                      <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{activity.date}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className={`text-center py-16 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <i className="ri-inbox-line text-5xl mb-4" />
                  <p className="text-lg font-medium">No activities found</p>
                  <p className="text-sm mt-1">Try adjusting your filters</p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {filteredActivities.length > itemsPerPage && (
              <div className={`flex items-center justify-between px-6 py-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredActivities.length)} of {filteredActivities.length} results
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className={`w-9 h-9 flex items-center justify-center rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                      darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
                    }`}
                  >
                    <i className="ri-skip-back-line" />
                  </button>
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className={`w-9 h-9 flex items-center justify-center rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                      darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
                    }`}
                  >
                    <i className="ri-arrow-left-s-line" />
                  </button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                          currentPage === pageNum
                            ? 'bg-red-600 text-white'
                            : darkMode 
                              ? 'hover:bg-gray-700 text-gray-400' 
                              : 'hover:bg-gray-100 text-gray-600'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className={`w-9 h-9 flex items-center justify-center rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                      darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
                    }`}
                  >
                    <i className="ri-arrow-right-s-line" />
                  </button>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className={`w-9 h-9 flex items-center justify-center rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                      darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
                    }`}
                  >
                    <i className="ri-skip-forward-line" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ActivityLogPage;
