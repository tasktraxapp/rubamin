import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserOverview from './components/UserOverview';
import UserProfile from './components/UserProfile';
import UserDocuments from './components/UserDocuments';
import UserNotifications from './components/UserNotifications';
import UserInquiriesManagement from './components/UserInquiriesManagement';
import UserJobsManagement from './components/UserJobsManagement';
import UserMediaManagement from './components/UserMediaManagement';
import UserResourcesManagement from './components/UserResourcesManagement';
import UserTasksManagement from './components/UserTasksManagement';
import UserDeadlinesManagement from './components/UserDeadlinesManagement';

// Role-based permissions mapping
const ROLE_PERMISSIONS: Record<string, string[]> = {
  'Operations Manager': ['jobs', 'inquiries', 'resources'],
  'HSE Officer': ['media', 'resources', 'inquiries'],
  'Plant Supervisor': ['jobs', 'resources'],
  'Production Engineer': ['jobs', 'media'],
  'HR Manager': ['jobs', 'inquiries'],
  'Finance Officer': ['resources', 'inquiries'],
  'Maintenance Technician': ['resources'],
  'Quality Control Specialist': ['media', 'resources'],
};

// Management section counts (mock data)
const MANAGEMENT_COUNTS: Record<string, number> = {
  jobs: 12,
  media: 8,
  resources: 45,
  inquiries: 23,
  tasks: 15,
  deadlines: 9,
};

export default function UserDashboard() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [hoveredMenuItem, setHoveredMenuItem] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('userDarkMode');
    return saved ? JSON.parse(saved) : false;
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Get user data from session with fallback
  const storedData = sessionStorage.getItem('userData');
  const userData = storedData ? JSON.parse(storedData) : null;

  // Redirect to login if no user data
  useEffect(() => {
    if (!userData || !userData.name) {
      navigate('/auth/login');
    }
  }, [userData, navigate]);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Save dark mode preference
  useEffect(() => {
    localStorage.setItem('userDarkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!userData || !userData.name) {
    return null;
  }

  const userName = userData.name;
  const userRole = userData.role;
  const userDepartment = userData.department;

  // Get permissions for current user role
  const userPermissions = ROLE_PERMISSIONS[userRole] || [];

  // Check if user has permission for a section
  const hasPermission = (section: string) => userPermissions.includes(section);

  const handleLogout = () => {
    sessionStorage.removeItem('userData');
    navigate('/auth/login');
  };

  // Generate breadcrumbs
  const generateBreadcrumbs = () => {
    const sectionLabels: Record<string, string> = {
      overview: 'Overview',
      profile: 'My Profile',
      documents: 'Documents',
      notifications: 'Notifications',
      jobs: 'Jobs Management',
      media: 'Media Center',
      resources: 'Resources Center',
      inquiries: 'Inquiries',
      tasks: 'Tasks Management',
    };

    return [
      { label: 'Home', path: '/', icon: 'ri-home-4-line' },
      { label: 'User', path: '/user/dashboard', icon: '' },
      { label: 'Dashboard', path: '/user/dashboard', icon: '' },
      { label: sectionLabels[activeSection] || 'Overview', path: '', icon: '' },
    ];
  };

  const breadcrumbs = generateBreadcrumbs();

  const sidebarItems = [
    { id: 'overview', icon: 'ri-dashboard-3-line', label: 'Dashboard', badge: 0 },
    { id: 'notifications', icon: 'ri-notification-3-line', label: 'Notifications', badge: 5 },
  ];

  // Add management sections based on permissions
  const managementItems: { id: string; icon: string; label: string; badge: number }[] = [];
  if (hasPermission('jobs')) {
    managementItems.push({ 
      id: 'jobs', 
      icon: 'ri-briefcase-line', 
      label: 'Jobs Management', 
      badge: MANAGEMENT_COUNTS.jobs 
    });
  }
  if (hasPermission('media')) {
    managementItems.push({ 
      id: 'media', 
      icon: 'ri-newspaper-line', 
      label: 'Media Center', 
      badge: MANAGEMENT_COUNTS.media 
    });
  }
  if (hasPermission('resources')) {
    managementItems.push({ 
      id: 'resources', 
      icon: 'ri-folder-line', 
      label: 'Resources Center', 
      badge: MANAGEMENT_COUNTS.resources 
    });
  }
  if (hasPermission('inquiries')) {
    managementItems.push({ 
      id: 'inquiries', 
      icon: 'ri-mail-line', 
      label: 'Inquiries', 
      badge: MANAGEMENT_COUNTS.inquiries 
    });
  }
  if (hasPermission('jobs') || hasPermission('resources') || hasPermission('inquiries')) {
    managementItems.push({
      id: 'tasks',
      icon: 'ri-task-line',
      label: 'Tasks',
      badge: MANAGEMENT_COUNTS.tasks,
    });
    managementItems.push({
      id: 'deadlines',
      icon: 'ri-calendar-todo-line',
      label: 'Deadlines',
      badge: MANAGEMENT_COUNTS.deadlines,
    });
  }

  const allSidebarItems = [...sidebarItems, ...managementItems];

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return <UserOverview darkMode={darkMode} userData={userData} onNavigate={setActiveSection} />;
      case 'profile':
        return <UserProfile darkMode={darkMode} userData={userData} />;
      case 'documents':
        return <UserDocuments darkMode={darkMode} />;
      case 'notifications':
        return <UserNotifications darkMode={darkMode} />;
      case 'jobs':
        return hasPermission('jobs') ? <UserJobsManagement darkMode={darkMode} /> : null;
      case 'media':
        return hasPermission('media') ? <UserMediaManagement darkMode={darkMode} /> : null;
      case 'resources':
        return hasPermission('resources') ? <UserResourcesManagement darkMode={darkMode} /> : null;
      case 'inquiries':
        return hasPermission('inquiries') ? <UserInquiriesManagement darkMode={darkMode} /> : null;
      case 'tasks':
        return (hasPermission('jobs') || hasPermission('resources') || hasPermission('inquiries')) ? <UserTasksManagement darkMode={darkMode} /> : null;
      case 'deadlines':
        return (hasPermission('jobs') || hasPermission('resources') || hasPermission('inquiries')) ? <UserDeadlinesManagement darkMode={darkMode} /> : null;
      default:
        return <UserOverview darkMode={darkMode} userData={userData} onNavigate={setActiveSection} />;
    }
  };

  return (
    <div className={`min-h-screen flex ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`${sidebarCollapsed ? 'lg:w-20' : 'lg:w-64'} w-64 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r flex flex-col fixed h-full transition-all duration-300 z-40 ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Logo */}
        <div className={`p-5 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between`}>
          <button 
            onClick={() => {
              if (window.innerWidth >= 1024) {
                setSidebarCollapsed(!sidebarCollapsed);
              }
            }}
            className={`flex items-center gap-3 ${sidebarCollapsed ? 'lg:justify-center' : ''} cursor-pointer`}
            title={sidebarCollapsed ? 'Expand sidebar' : ''}
          >
            <img
              src="https://static.readdy.ai/image/1b404af276821d98dfecb0eec592fbd4/2beca25c2dca50fd1a3109512ef52e33.png"
              alt="Logo"
              className="h-10 w-10 object-contain"
            />
            {(!sidebarCollapsed || window.innerWidth < 1024) && <span className={`text-xl font-bold tracking-wide ${darkMode ? 'text-white' : 'text-[#2C3E50]'} ${sidebarCollapsed ? 'lg:hidden' : ''}`}>RUBAMIN</span>}
          </button>
          <div className="flex items-center gap-2">
            {/* Close button for mobile */}
            <button 
              onClick={() => setMobileSidebarOpen(false)}
              className={`lg:hidden w-8 h-8 flex items-center justify-center rounded-lg ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'} cursor-pointer transition-colors`}
            >
              <i className="ri-close-line text-lg" />
            </button>
            {/* Collapse button for desktop */}
            {!sidebarCollapsed && (
              <button 
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className={`hidden lg:flex w-8 h-8 items-center justify-center rounded-lg ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'} cursor-pointer transition-colors`}
              >
                <i className="ri-menu-fold-line text-lg" />
              </button>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {/* Separator for management items */}
          {managementItems.length > 0 && (
            <>
              {sidebarItems.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <div key={item.id} className="relative">
                    <button
                      onClick={() => {
                        setActiveSection(item.id);
                        setMobileSidebarOpen(false);
                        if (sidebarCollapsed && window.innerWidth >= 1024) {
                          setSidebarCollapsed(false);
                        }
                      }}
                      onMouseEnter={() => sidebarCollapsed && setHoveredMenuItem(item.id)}
                      onMouseLeave={() => setHoveredMenuItem(null)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all relative ${
                        isActive
                          ? 'bg-red-600 text-white shadow-md'
                          : darkMode
                            ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      } ${sidebarCollapsed ? 'lg:justify-center' : ''}`}
                    >
                      <i className={`${item.icon} text-lg`} />
                      <span className={`flex-1 text-left ${sidebarCollapsed ? 'lg:hidden' : ''}`}>{item.label}</span>
                      {item.badge > 0 && (
                        <span className={`min-w-5 h-5 flex items-center justify-center px-1.5 text-xs font-bold rounded-full ${sidebarCollapsed ? 'lg:hidden' : ''} ${
                          isActive 
                            ? 'bg-white text-red-600' 
                            : 'bg-red-600 text-white'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                      {sidebarCollapsed && item.badge > 0 && (
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full hidden lg:block" />
                      )}
                    </button>
                    {/* Tooltip for collapsed sidebar */}
                    {sidebarCollapsed && hoveredMenuItem === item.id && (
                      <div className={`absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-2 rounded-lg shadow-lg whitespace-nowrap z-50 hidden lg:block ${
                        darkMode ? 'bg-gray-700 text-white' : 'bg-gray-900 text-white'
                      }`}>
                        <div className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 rotate-45 ${
                          darkMode ? 'bg-gray-700' : 'bg-gray-900'
                        }`} />
                        <span className="text-sm font-medium">{item.label}</span>
                        {item.badge > 0 && (
                          <span className="ml-2 px-1.5 py-0.5 text-xs font-bold bg-red-600 text-white rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Divider */}
              <div className={`my-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <p className={`text-xs font-semibold uppercase tracking-wider mt-4 mb-2 px-4 ${sidebarCollapsed ? 'lg:hidden' : ''} ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  Management
                </p>
              </div>

              {managementItems.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <div key={item.id} className="relative">
                    <button
                      onClick={() => {
                        setActiveSection(item.id);
                        setMobileSidebarOpen(false);
                        if (sidebarCollapsed && window.innerWidth >= 1024) {
                          setSidebarCollapsed(false);
                        }
                      }}
                      onMouseEnter={() => sidebarCollapsed && setHoveredMenuItem(item.id)}
                      onMouseLeave={() => setHoveredMenuItem(null)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all relative ${
                        isActive
                          ? 'bg-red-600 text-white shadow-md'
                          : darkMode
                            ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      } ${sidebarCollapsed ? 'lg:justify-center' : ''}`}
                    >
                      <i className={`${item.icon} text-lg`} />
                      <span className={`flex-1 text-left ${sidebarCollapsed ? 'lg:hidden' : ''}`}>{item.label}</span>
                      {item.badge > 0 && (
                        <span className={`min-w-5 h-5 flex items-center justify-center px-1.5 text-xs font-bold rounded-full ${sidebarCollapsed ? 'lg:hidden' : ''} ${
                          isActive 
                            ? 'bg-white text-red-600' 
                            : 'bg-red-600 text-white'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                      {sidebarCollapsed && item.badge > 0 && (
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full hidden lg:block" />
                      )}
                    </button>
                    {/* Tooltip for collapsed sidebar */}
                    {sidebarCollapsed && hoveredMenuItem === item.id && (
                      <div className={`absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-2 rounded-lg shadow-lg whitespace-nowrap z-50 hidden lg:block ${
                        darkMode ? 'bg-gray-700 text-white' : 'bg-gray-900 text-white'
                      }`}>
                        <div className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 rotate-45 ${
                          darkMode ? 'bg-gray-700' : 'bg-gray-900'
                        }`} />
                        <span className="text-sm font-medium">{item.label}</span>
                        {item.badge > 0 && (
                          <span className="ml-2 px-1.5 py-0.5 text-xs font-bold bg-red-600 text-white rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </>
          )}

          {/* If no management items, just show regular items */}
          {managementItems.length === 0 && sidebarItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <div key={item.id} className="relative">
                <button
                  onClick={() => {
                    setActiveSection(item.id);
                    setMobileSidebarOpen(false);
                    if (sidebarCollapsed && window.innerWidth >= 1024) {
                      setSidebarCollapsed(false);
                    }
                  }}
                  onMouseEnter={() => sidebarCollapsed && setHoveredMenuItem(item.id)}
                  onMouseLeave={() => setHoveredMenuItem(null)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all relative ${
                    isActive
                      ? 'bg-red-600 text-white shadow-md'
                      : darkMode
                        ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  } ${sidebarCollapsed ? 'lg:justify-center' : ''}`}
                >
                  <i className={`${item.icon} text-lg`} />
                  <span className={`flex-1 text-left ${sidebarCollapsed ? 'lg:hidden' : ''}`}>{item.label}</span>
                  {item.badge > 0 && (
                    <span className={`min-w-5 h-5 flex items-center justify-center px-1.5 text-xs font-bold rounded-full ${sidebarCollapsed ? 'lg:hidden' : ''} ${
                      isActive 
                        ? 'bg-white text-red-600' 
                        : 'bg-red-600 text-white'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                  {sidebarCollapsed && item.badge > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full hidden lg:block" />
                  )}
                </button>
                {/* Tooltip for collapsed sidebar */}
                {sidebarCollapsed && hoveredMenuItem === item.id && (
                  <div className={`absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-2 rounded-lg shadow-lg whitespace-nowrap z-50 hidden lg:block ${
                    darkMode ? 'bg-gray-700 text-white' : 'bg-gray-900 text-white'
                  }`}>
                    <div className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 rotate-45 ${
                      darkMode ? 'bg-gray-700' : 'bg-gray-900'
                    }`} />
                    <span className="text-sm font-medium">{item.label}</span>
                    {item.badge > 0 && (
                      <span className="ml-2 px-1.5 py-0.5 text-xs font-bold bg-red-600 text-white rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'} ml-0 transition-all duration-300`}>
        {/* Top Header */}
        <header className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b px-4 sm:px-6 lg:px-8 py-4 sticky top-0 z-10`}>
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className={`lg:hidden w-10 h-10 flex items-center justify-center rounded-lg ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'} cursor-pointer`}
            >
              <i className="ri-menu-line text-xl" />
            </button>

            {/* Search Bar */}
            <div className="flex-1 max-w-xl hidden sm:block">
              <div className="relative">
                <i className={`ri-search-line absolute left-4 top-1/2 -translate-y-1/2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search documents, training, team..."
                  className={`w-full pl-11 pr-4 py-2.5 ${darkMode ? 'bg-gray-700 text-white placeholder-gray-400 border-gray-600' : 'bg-gray-50 text-gray-900 placeholder-gray-500 border-gray-200'} border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all`}
                />
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Dark Mode Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all cursor-pointer ${
                  darkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                }`}
                title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                <i className={`${darkMode ? 'ri-sun-line' : 'ri-moon-line'} text-lg`} />
              </button>

              {/* Notifications */}
              <button 
                onClick={() => setActiveSection('notifications')}
                className={`relative w-10 h-10 flex items-center justify-center rounded-lg cursor-pointer ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                <i className="ri-notification-3-line text-lg" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-600 rounded-full" />
              </button>

              {/* Date & Time */}
              <div className={`hidden lg:flex flex-col items-end px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <p className={`text-xs font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {currentTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>

              {/* View Website */}
              <Link
                to="/"
                target="_blank"
                className={`hidden md:flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium cursor-pointer whitespace-nowrap ${darkMode ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-red-600 text-white hover:bg-red-700'}`}
              >
                <i className="ri-external-link-line" />
                <span className="hidden lg:inline">View Site</span>
              </Link>

              {/* User Profile Dropdown */}
              <div className="relative" ref={profileDropdownRef}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center cursor-pointer overflow-hidden transition-all ${profileDropdownOpen ? 'ring-2 ring-red-600 ring-offset-2' : ''} ${darkMode ? 'ring-offset-gray-800' : 'ring-offset-white'}`}
                  title={userName}
                >
                  <img 
                    src="https://readdy.ai/api/search-image?query=professional%20business%20person%20portrait%20headshot%20in%20office%20setting%20with%20neutral%20background%20corporate%20attire%20confident%20expression%20high%20quality%20photography%20studio%20lighting&width=200&height=200&seq=user-avatar-001&orientation=squarish"
                    alt={userName}
                    className="w-full h-full object-cover"
                  />
                </button>

                {/* Dropdown Menu */}
                {profileDropdownOpen && (
                  <div className={`absolute right-0 top-full mt-2 w-56 rounded-lg shadow-lg border overflow-hidden z-50 ${
                    darkMode 
                      ? 'bg-gray-800 border-gray-700' 
                      : 'bg-white border-gray-200'
                  }`}>
                    {/* User Info Header */}
                    <div className={`px-4 py-3 border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                      <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{userName}</p>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{userRole}</p>
                      <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{userDepartment}</p>
                    </div>

                    {/* Menu Items */}
                    <div className="py-1">
                      <button 
                        onClick={() => {
                          setActiveSection('profile');
                          setProfileDropdownOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors cursor-pointer ${
                          darkMode 
                            ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <i className="ri-user-line" />
                        My Profile
                      </button>
                      <button className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors cursor-pointer ${
                        darkMode 
                          ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}>
                        <i className="ri-lock-password-line" />
                        Change Password
                      </button>
                    </div>

                    {/* Sign Out */}
                    <div className={`border-t py-1 ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                      <button
                        onClick={handleLogout}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors cursor-pointer ${
                          darkMode 
                            ? 'text-red-400 hover:bg-red-600/10' 
                            : 'text-red-600 hover:bg-red-50'
                        }`}
                      >
                        <i className="ri-logout-box-line" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="sm:hidden mt-3">
            <div className="relative">
              <i className={`ri-search-line absolute left-4 top-1/2 -translate-y-1/2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className={`w-full pl-11 pr-4 py-2.5 ${darkMode ? 'bg-gray-700 text-white placeholder-gray-400 border-gray-600' : 'bg-gray-50 text-gray-900 placeholder-gray-500 border-gray-200'} border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all`}
              />
            </div>
          </div>
        </header>

        {/* Breadcrumb Navigation */}
        <div className={`px-4 sm:px-6 lg:px-8 py-3 border-b ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50/80 border-gray-200'}`}>
          <nav className="flex items-center gap-2 text-sm overflow-x-auto">
            {breadcrumbs.map((crumb, index) => (
              <div key={index} className="flex items-center gap-2 flex-shrink-0">
                {index > 0 && (
                  <i className={`ri-arrow-right-s-line ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                )}
                {index === breadcrumbs.length - 1 ? (
                  <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {crumb.icon && <i className={`${crumb.icon} mr-1.5`} />}
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    to={crumb.path}
                    className={`flex items-center transition-colors cursor-pointer ${
                      darkMode 
                        ? 'text-gray-400 hover:text-white' 
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    {crumb.icon && <i className={`${crumb.icon} mr-1.5`} />}
                    {crumb.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Dashboard Content */}
        <div className="p-4 sm:p-6 lg:p-8">
          {/* Content */}
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
