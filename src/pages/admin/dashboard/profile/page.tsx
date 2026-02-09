
import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

interface NotificationSetting {
  key: string;
  label: string;
  description: string;
  email: boolean;
  push: boolean;
}

const ProfilePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('adminDarkMode');
    return saved ? JSON.parse(saved) : false;
  });

  const [activeSection, setActiveSection] = useState<
    'personal' | 'security' | 'notifications' | 'preferences'
  >('personal');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    firstName: 'John',
    lastName: 'Administrator',
    email: 'admin@rubamindrc.com',
    phone: '+243 812 345 678',
    jobTitle: 'System Administrator',
    department: 'IT & Administration',
    location: 'Lubumbashi, DRC',
    bio: 'Experienced system administrator managing the Rubamin DRC corporate website and internal tools.',
    timezone: 'Africa/Lubumbashi',
    language: 'en',
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  // Notification settings
  const [notifications, setNotifications] = useState<NotificationSetting[]>([
    {
      key: 'new_inquiry',
      label: 'New Inquiries',
      description: 'When a new contact form is submitted',
      email: true,
      push: true,
    },
    {
      key: 'job_application',
      label: 'Job Applications',
      description: 'When someone applies for a position',
      email: true,
      push: false,
    },
    {
      key: 'tender_submission',
      label: 'Tender Submissions',
      description: 'When a tender application is received',
      email: true,
      push: true,
    },
    {
      key: 'content_update',
      label: 'Content Updates',
      description: 'When pages or media are modified',
      email: false,
      push: true,
    },
    {
      key: 'user_activity',
      label: 'User Activity',
      description: 'When users login or change settings',
      email: false,
      push: false,
    },
    {
      key: 'system_alerts',
      label: 'System Alerts',
      description: 'Important system notifications',
      email: true,
      push: true,
    },
  ]);

  // Preferences
  const [preferences, setPreferences] = useState({
    darkMode: false,
    compactView: false,
    autoSave: true,
    showTips: true,
    defaultView: 'list',
    itemsPerPage: '25',
    dateFormat: 'DD/MM/YYYY',
  });

  const adminUser = JSON.parse(
    sessionStorage.getItem('adminUser') ||
      '{"name": "Admin", "email": "admin@rubamindrc.com"}'
  );

  // -------------------------------------------------------------------------
  // Effects
  // -------------------------------------------------------------------------

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn');
    if (!isLoggedIn) navigate('/admin');
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
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node)
      ) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Password strength checker
  useEffect(() => {
    const pw = passwordForm.newPassword;
    const checks = {
      length: pw.length >= 8,
      uppercase: /[A-Z]/.test(pw),
      lowercase: /[a-z]/.test(pw),
      number: /[0-9]/.test(pw),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(pw),
    };
    setPasswordChecks(checks);
    const score = Object.values(checks).filter(Boolean).length;
    setPasswordStrength(score);
  }, [passwordForm.newPassword]);

  // -------------------------------------------------------------------------
  // Helper functions
  // -------------------------------------------------------------------------

  const showToast = (message: string) => {
    setToastMessage(message);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  const handleSaveProfile = () => {
    showToast('Profile updated successfully');
  };

  const handleChangePassword = () => {
    if (
      !passwordForm.currentPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    )
      return;
    if (passwordForm.newPassword !== passwordForm.confirmPassword) return;
    if (passwordStrength < 3) return;

    showToast('Password changed successfully');
    setShowPasswordModal(false);
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleToggleNotification = (key: string, type: 'email' | 'push') => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.key === key ? { ...n, [type]: !n[type] } : n
      )
    );
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminLoggedIn');
    sessionStorage.removeItem('adminUser');
    navigate('/admin');
  };

  const getStrengthColor = () => {
    if (passwordStrength <= 1) return 'bg-red-500';
    if (passwordStrength <= 2) return 'bg-orange-500';
    if (passwordStrength <= 3) return 'bg-amber-500';
    if (passwordStrength <= 4) return 'bg-emerald-400';
    return 'bg-emerald-500';
  };

  const getStrengthLabel = () => {
    if (passwordStrength <= 1) return 'Weak';
    if (passwordStrength <= 2) return 'Fair';
    if (passwordStrength <= 3) return 'Good';
    if (passwordStrength <= 4) return 'Strong';
    return 'Very Strong';
  };

  const generateBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs = [
      { label: 'Home', path: '/', icon: 'ri-home-4-line' },
    ];
    let currentPath = '';
    pathSegments.forEach((segment) => {
      currentPath += `/${segment}`;
      const label =
        segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
      breadcrumbs.push({ label, path: currentPath, icon: '' });
    });
    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  const sidebarItems = [
    {
      label: 'Dashboard',
      icon: 'ri-dashboard-3-line',
      path: '/admin/dashboard',
    },
    {
      label: 'Pages',
      icon: 'ri-file-list-3-line',
      path: '/admin/dashboard/pages',
    },
    {
      label: 'Media Center',
      icon: 'ri-newspaper-line',
      path: '/admin/dashboard/media-center',
      badge: 5,
    },
    {
      label: 'Jobs',
      icon: 'ri-briefcase-line',
      path: '/admin/dashboard/jobs',
      badge: 3,
    },
    {
      label: 'Gallery',
      icon: 'ri-gallery-line',
      path: '/admin/dashboard/gallery',
    },
    {
      label: 'Resources',
      icon: 'ri-folder-line',
      path: '/admin/dashboard/resources',
    },
    {
      label: 'Inquiries',
      icon: 'ri-mail-line',
      path: '/admin/dashboard/inquiries',
      badge: 8,
    },
    {
      label: 'Settings',
      icon: 'ri-settings-3-line',
      path: '/admin/dashboard/settings',
    },
  ];

  const profileSections = [
    { key: 'personal', label: 'Personal Info', icon: 'ri-user-line' },
    { key: 'security', label: 'Security', icon: 'ri-lock-line' },
    {
      key: 'notifications',
      label: 'Notifications',
      icon: 'ri-notification-3-line',
    },
    { key: 'preferences', label: 'Preferences', icon: 'ri-equalizer-line' },
  ];

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  return (
    <div className={`min-h-screen flex ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Sidebar */}
      <aside
        className={`${
          sidebarCollapsed ? 'w-20' : 'w-64'
        } ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r flex flex-col fixed h-full transition-all duration-300 z-20`}
      >
        <div
          className={`p-5 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between`}
        >
          <Link
            to="/"
            className={`flex items-center gap-3 ${
              sidebarCollapsed ? 'justify-center' : ''
            }`}
          >
            <img
              src="https://static.readdy.ai/image/1b404af276821d98dfecb0eec592fbd4/2beca25c2dca50fd1a3109512ef52e33.png"
              alt="Logo"
              className="h-10 w-10 object-contain"
            />
            {!sidebarCollapsed && (
              <span
                className={`text-xl font-bold tracking-wide ${
                  darkMode ? 'text-white' : 'text-[#2C3E50]'
                }`}
              >
                RUBAMIN
              </span>
            )}
          </Link>
          {!sidebarCollapsed && (
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className={`w-8 h-8 flex items-center justify-center rounded-lg ${
                darkMode
                  ? 'hover:bg-gray-700 text-gray-400'
                  : 'hover:bg-gray-100 text-gray-500'
              } cursor-pointer transition-colors`}
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
                title={sidebarCollapsed ? item.label : ''}
              >
                <i className={`${item.icon} text-lg`} />
                {!sidebarCollapsed && (
                  <>
                    <span className="flex-1">{item.label}</span>
                    {item.badge && item.badge > 0 && (
                      <span
                        className={`min-w-5 h-5 flex items-center justify-center px-1.5 text-xs font-bold rounded-full ${
                          isActive
                            ? 'bg-white text-red-600'
                            : 'bg-red-600 text-white'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
                {sidebarCollapsed && item.badge && item.badge > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main
        className={`flex-1 ${
          sidebarCollapsed ? 'ml-20' : 'ml-64'
        } transition-all duration-300`}
      >
        {/* Top Header */}
        <header
          className={`${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          } border-b px-8 py-4 sticky top-0 z-10`}
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 max-w-xl">
              <div className="relative">
                <i
                  className={`ri-search-line absolute left-4 top-1/2 -translate-y-1/2 ${
                    darkMode ? 'text-gray-500' : 'text-gray-400'
                  }`}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search pages, media, jobs..."
                  className={`w-full pl-11 pr-4 py-2.5 ${
                    darkMode
                      ? 'bg-gray-700 text-white placeholder-gray-400 border-gray-600'
                      : 'bg-gray-50 text-gray-900 placeholder-gray-500 border-gray-200'
                  } border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all`}
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all cursor-pointer ${
                  darkMode
                    ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                }`}
              >
                <i className={`${darkMode ? 'ri-sun-line' : 'ri-moon-line'} text-lg`} />
              </button>

              <button
                className={`relative w-10 h-10 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                  darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <i
                  className={`ri-notification-3-line text-lg ${
                    darkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}
                />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-600 rounded-full" />
              </button>

              <div
                className={`hidden md:flex flex-col items-end px-4 py-2 rounded-lg ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-100'
                }`}
              >
                <p
                  className={`text-xs font-semibold ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {currentTime.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
                <p
                  className={`text-xs ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}
                >
                  {currentTime.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>

              <Link
                to="/"
                target="_blank"
                className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white hover:bg-red-700 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap"
              >
                <i className="ri-external-link-line" />
                View Site
              </Link>

              <div className="relative" ref={profileDropdownRef}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className={`w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center cursor-pointer hover:bg-red-700 transition-all ${
                    profileDropdownOpen ? 'ring-2 ring-red-600 ring-offset-2' : ''
                  }`}
                >
                  <span className="text-sm font-bold text-white">
                    {adminUser.name.charAt(0)}
                  </span>
                </button>

                {profileDropdownOpen && (
                  <div
                    className={`absolute right-0 top-full mt-2 w-56 rounded-lg shadow-lg border overflow-hidden z-50 ${
                      darkMode
                        ? 'bg-gray-800 border-gray-700'
                        : 'bg-white border-gray-200'
                    }`}
                  >
                    <div
                      className={`px-4 py-3 border-b ${
                        darkMode ? 'border-gray-700' : 'border-gray-100'
                      }`}
                    >
                      <p
                        className={`text-sm font-semibold ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}
                      >
                        {adminUser.name}
                      </p>
                      <p
                        className={`text-xs ${
                          darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}
                      >
                        {adminUser.email}
                      </p>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/admin/dashboard/profile"
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors cursor-pointer ${
                          darkMode
                            ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <i className="ri-user-line" />
                        My Profile
                      </Link>
                      <Link
                        to="/admin/dashboard/settings"
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors cursor-pointer ${
                          darkMode
                            ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <i className="ri-settings-3-line" />
                        Account Settings
                      </Link>
                    </div>

                    <div
                      className={`border-t py-1 ${
                        darkMode ? 'border-gray-700' : 'border-gray-100'
                      }`}
                    >
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
        </header>

        {/* Breadcrumb */}
        <div
          className={`px-8 py-3 border-b ${
            darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50/80 border-gray-200'
          }`}
        >
          <nav className="flex items-center gap-2 text-sm">
            {breadcrumbs.map((crumb, index) => (
              <div key={crumb.path} className="flex items-center gap-2">
                {index > 0 && (
                  <i
                    className={`ri-arrow-right-s-line ${
                      darkMode ? 'text-gray-600' : 'text-gray-400'
                    }`}
                  />
                )}
                {index === breadcrumbs.length - 1 ? (
                  <span
                    className={`font-medium ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}
                  >
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

        {/* Page Content */}
        <div className="p-8">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1
                className={`text-3xl font-bold ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}
                style={{ fontFamily: 'Merriweather, serif' }}
              >
                My Profile
              </h1>
              <p
                className={`mt-2 text-base ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                Manage your personal information and preferences
              </p>
            </div>
          </div>

          <div className="flex gap-8">
            {/* Left Sidebar - Profile Card & Navigation */}
            <div className="w-72 flex-shrink-0 space-y-6">
              {/* Profile Card */}
              <div
                className={`rounded-lg border p-6 text-center ${
                  darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                }`}
              >
                <div className="relative inline-block mb-4">
                  <div className="w-24 h-24 rounded-full bg-red-600 flex items-center justify-center text-3xl font-bold text-white mx-auto">
                    JA
                  </div>
                  <button className="absolute bottom-0 right-0 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white hover:bg-red-700 transition-colors cursor-pointer shadow-lg">
                    <i className="ri-camera-line text-sm" />
                  </button>
                </div>
                <h3
                  className={`text-lg font-semibold ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {profileForm.firstName} {profileForm.lastName}
                </h3>
                <p
                  className={`text-sm mt-1 ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}
                >
                  {profileForm.jobTitle}
                </p>
                <span className="inline-flex items-center px-3 py-1 mt-3 rounded-full text-xs font-medium bg-red-600 text-white">
                  Super Admin
                </span>
                <div
                  className={`mt-4 pt-4 border-t ${
                    darkMode ? 'border-gray-700' : 'border-gray-200'
                  }`}
                >
                  <p
                    className={`text-xs ${
                      darkMode ? 'text-gray-500' : 'text-gray-400'
                    }`}
                  >
                    Member since Jan 2023
                  </p>
                </div>
              </div>

              {/* Section Navigation */}
              <div
                className={`rounded-lg border overflow-hidden ${
                  darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                }`}
              >
                {profileSections.map((section) => (
                  <button
                    key={section.key}
                    onClick={() => setActiveSection(section.key as typeof activeSection)}
                    className={`w-full flex items-center gap-3 px-5 py-3.5 text-sm font-medium transition-all cursor-pointer ${
                      activeSection === section.key
                        ? 'bg-red-600 text-white'
                        : darkMode
                        ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <i className={`${section.icon} text-lg`} />
                    {section.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Content */}
            <div className="flex-1 min-w-0">
              {/* Personal Info Section */}
              {activeSection === 'personal' && (
                <div
                  className={`rounded-lg border ${
                    darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                  }`}
                >
                  <div
                    className={`p-6 border-b ${
                      darkMode ? 'border-gray-700' : 'border-gray-200'
                    }`}
                  >
                    <h2
                      className={`text-xl font-bold ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      Personal Information
                    </h2>
                    <p
                      className={`text-sm mt-1 ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}
                    >
                      Update your personal details and contact information
                    </p>
                  </div>

                  <div className="p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label
                          className={`block text-sm font-medium mb-2 ${
                            darkMode ? 'text-gray-300' : 'text-gray-700'
                          }`}
                        >
                          First Name
                        </label>
                        <input
                          type="text"
                          value={profileForm.firstName}
                          onChange={(e) =>
                            setProfileForm({
                              ...profileForm,
                              firstName: e.target.value,
                            })
                          }
                          className={`w-full px-4 py-2.5 ${
                            darkMode
                              ? 'bg-gray-700 text-white border-gray-600'
                              : 'bg-gray-50 text-gray-900 border-gray-200'
                          } border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600`}
                        />
                      </div>

                      <div>
                        <label
                          className={`block text-sm font-medium mb-2 ${
                            darkMode ? 'text-gray-300' : 'text-gray-700'
                          }`}
                        >
                          Last Name
                        </label>
                        <input
                          type="text"
                          value={profileForm.lastName}
                          onChange={(e) =>
                            setProfileForm({
                              ...profileForm,
                              lastName: e.target.value,
                            })
                          }
                          className={`w-full px-4 py-2.5 ${
                            darkMode
                              ? 'bg-gray-700 text-white border-gray-600'
                              : 'bg-gray-50 text-gray-900 border-gray-200'
                          } border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600`}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label
                          className={`block text-sm font-medium mb-2 ${
                            darkMode ? 'text-gray-300' : 'text-gray-700'
                          }`}
                        >
                          Email Address
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            value={profileForm.email}
                            onChange={(e) =>
                              setProfileForm({
                                ...profileForm,
                                email: e.target.value,
                              })
                            }
                            className={`w-full px-4 py-2.5 pr-10 ${
                              darkMode
                                ? 'bg-gray-700 text-white border-gray-600'
                                : 'bg-gray-50 text-gray-900 border-gray-200'
                            } border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600`}
                          />
                          <i className="ri-verified-badge-fill absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500" />
                        </div>
                      </div>

                      <div>
                        <label
                          className={`block text-sm font-medium mb-2 ${
                            darkMode ? 'text-gray-300' : 'text-gray-700'
                          }`}
                        >
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={profileForm.phone}
                          onChange={(e) =>
                            setProfileForm({
                              ...profileForm,
                              phone: e.target.value,
                            })
                          }
                          className={`w-full px-4 py-2.5 ${
                            darkMode
                              ? 'bg-gray-700 text-white border-gray-600'
                              : 'bg-gray-50 text-gray-900 border-gray-200'
                          } border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600`}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label
                          className={`block text-sm font-medium mb-2 ${
                            darkMode ? 'text-gray-300' : 'text-gray-700'
                          }`}
                        >
                          Job Title
                        </label>
                        <input
                          type="text"
                          value={profileForm.jobTitle}
                          onChange={(e) =>
                            setProfileForm({
                              ...profileForm,
                              jobTitle: e.target.value,
                            })
                          }
                          className={`w-full px-4 py-2.5 ${
                            darkMode
                              ? 'bg-gray-700 text-white border-gray-600'
                              : 'bg-gray-50 text-gray-900 border-gray-200'
                          } border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600`}
                        />
                      </div>

                      <div>
                        <label
                          className={`block text-sm font-medium mb-2 ${
                            darkMode ? 'text-gray-300' : 'text-gray-700'
                          }`}
                        >
                          Department
                        </label>
                        <select
                          value={profileForm.department}
                          onChange={(e) =>
                            setProfileForm({
                              ...profileForm,
                              department: e.target.value,
                            })
                          }
                          className={`w-full px-4 py-2.5 ${
                            darkMode
                              ? 'bg-gray-700 text-white border-gray-600'
                              : 'bg-gray-50 text-gray-900 border-gray-200'
                          } border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600 cursor-pointer`}
                        >
                          <option value="IT & Administration">
                            IT &amp; Administration
                          </option>
                          <option value="Human Resources">Human Resources</option>
                          <option value="Operations">Operations</option>
                          <option value="Finance">Finance</option>
                          <option value="Marketing">Marketing</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}
                      >
                        Location
                      </label>
                      <div className="relative">
                        <i
                          className={`ri-map-pin-line absolute left-3 top-1/2 -translate-y-1/2 ${
                            darkMode ? 'text-gray-500' : 'text-gray-400'
                          }`}
                        />
                        <input
                          type="text"
                          value={profileForm.location}
                          onChange={(e) =>
                            setProfileForm({
                              ...profileForm,
                              location: e.target.value,
                            })
                          }
                          className={`w-full pl-10 pr-4 py-2.5 ${
                            darkMode
                              ? 'bg-gray-700 text-white border-gray-600'
                              : 'bg-gray-50 text-gray-900 border-gray-200'
                          } border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600`}
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}
                      >
                        Bio
                      </label>
                      <textarea
                        value={profileForm.bio}
                        onChange={(e) =>
                          setProfileForm({ ...profileForm, bio: e.target.value })
                        }
                        rows={3}
                        maxLength={500}
                        className={`w-full px-4 py-2.5 ${
                          darkMode
                            ? 'bg-gray-700 text-white border-gray-600'
                            : 'bg-gray-50 text-gray-900 border-gray-200'
                        } border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600 resize-none`}
                      />
                      <p
                        className={`text-xs mt-1 text-right ${
                          darkMode ? 'text-gray-500' : 'text-gray-400'
                        }`}
                      >
                        {profileForm.bio.length}/500
                      </p>
                    </div>
                  </div>

                  <div
                    className={`p-6 border-t ${
                      darkMode ? 'border-gray-700' : 'border-gray-200'
                    } flex justify-end`}
                  >
                    <button
                      onClick={handleSaveProfile}
                      className="px-6 py-2.5 bg-red-600 text-white hover:bg-red-700 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              )}

              {/* Security Section */}
              {activeSection === 'security' && (
                <div className="space-y-6">
                  {/* Password Card */}
                  <div
                    className={`rounded-lg border ${
                      darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    }`}
                  >
                    <div
                      className={`p-6 border-b ${
                        darkMode ? 'border-gray-700' : 'border-gray-200'
                      }`}
                    >
                      <h2
                        className={`text-xl font-bold ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}
                      >
                        Password
                      </h2>
                      <p
                        className={`text-sm mt-1 ${
                          darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}
                      >
                        Manage your password and account security
                      </p>
                    </div>

                    <div className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                              darkMode ? 'bg-gray-700' : 'bg-gray-100'
                            }`}
                          >
                            <i
                              className={`ri-lock-password-line text-xl ${
                                darkMode ? 'text-gray-300' : 'text-gray-600'
                              }`}
                            />
                          </div>
                          <div>
                            <p
                              className={`text-sm font-medium ${
                                darkMode ? 'text-white' : 'text-gray-900'
                              }`}
                            >
                              Password
                            </p>
                            <p
                              className={`text-xs ${
                                darkMode ? 'text-gray-400' : 'text-gray-500'
                              }`}
                            >
                              Last changed 45 days ago
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => setShowPasswordModal(true)}
                          className="flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white hover:bg-red-700 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap"
                        >
                          <i className="ri-key-line" />
                          Change Password
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Password Reset Link */}
                  <div
                    className={`rounded-lg border ${
                      darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                              darkMode ? 'bg-amber-600/20' : 'bg-amber-50'
                            }`}
                          >
                            <i
                              className={`ri-mail-send-line text-xl ${
                                darkMode ? 'text-amber-400' : 'text-amber-600'
                              }`}
                            />
                          </div>
                          <div>
                            <p
                              className={`text-sm font-medium ${
                                darkMode ? 'text-white' : 'text-gray-900'
                              }`}
                            >
                              Password Reset via Email
                            </p>
                            <p
                              className={`text-xs ${
                                darkMode ? 'text-gray-400' : 'text-gray-500'
                              }`}
                            >
                              Send a password reset link to your email address
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => showToast('Password reset link sent to your email')}
                          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap border ${
                            darkMode
                              ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                              : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <i className="ri-send-plane-line" />
                          Send Reset Link
                        </button>
                      </div>

                      <div
                        className={`mt-4 p-4 rounded-lg ${
                          darkMode ? 'bg-gray-700/50' : 'bg-gray-50'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <i
                            className={`ri-information-line text-lg mt-0.5 ${
                              darkMode ? 'text-gray-400' : 'text-gray-500'
                            }`}
                          />
                          <div>
                            <p
                              className={`text-xs ${
                                darkMode ? 'text-gray-400' : 'text-gray-500'
                              }`}
                            >
                              A password reset link will be sent to{' '}
                              <strong
                                className={darkMode ? 'text-gray-300' : 'text-gray-700'}
                              >
                                {profileForm.email}
                              </strong>
                              . The link expires in 24 hours. Check your spam folder
                              if you don&apos;t see it.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Two-Factor Authentication */}
                  <div
                    className={`rounded-lg border ${
                      darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                              darkMode ? 'bg-emerald-600/20' : 'bg-emerald-50'
                            }`}
                          >
                            <i
                              className={`ri-shield-check-line text-xl ${
                                darkMode ? 'text-emerald-400' : 'text-emerald-600'
                              }`}
                            />
                          </div>
                          <div>
                            <p
                              className={`text-sm font-medium ${
                                darkMode ? 'text-white' : 'text-gray-900'
                              }`}
                            >
                              Two-Factor Authentication
                            </p>
                            <p
                              className={`text-xs ${
                                darkMode ? 'text-gray-400' : 'text-gray-500'
                              }`}
                            >
                              Add an extra layer of security to your account
                            </p>
                          </div>
                        </div>

                        <div
                          className={`relative w-12 h-7 rounded-full cursor-pointer transition-colors ${
                            darkMode ? 'bg-gray-600' : 'bg-gray-300'
                          }`}
                          onClick={() => showToast('Two-factor authentication requires Supabase connection')}
                        >
                          <div className="absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow transition-transform" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Active Sessions */}
                  <div
                    className={`rounded-lg border ${
                      darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    }`}
                  >
                    <div
                      className={`p-6 border-b ${
                        darkMode ? 'border-gray-700' : 'border-gray-200'
                      }`}
                    >
                      <h3
                        className={`text-lg font-semibold ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}
                      >
                        Active Sessions
                      </h3>
                      <p
                        className={`text-xs mt-1 ${
                          darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}
                      >
                        Manage your active login sessions
                      </p>
                    </div>

                    <div
                      className={`divide-y ${
                        darkMode ? 'divide-gray-700' : 'divide-gray-200'
                      }`}
                    >
                      {[
                        {
                          device: 'Chrome on Windows',
                          location: 'Lubumbashi, DRC',
                          time: 'Current session',
                          icon: 'ri-computer-line',
                          current: true,
                        },
                        {
                          device: 'Safari on iPhone',
                          location: 'Lubumbashi, DRC',
                          time: '2 hours ago',
                          icon: 'ri-smartphone-line',
                          current: false,
                        },
                        {
                          device: 'Firefox on MacOS',
                          location: 'Kinshasa, DRC',
                          time: '3 days ago',
                          icon: 'ri-macbook-line',
                          current: false,
                        },
                      ].map((session, idx) => (
                        <div key={idx} className="p-4 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div
                              className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                darkMode ? 'bg-gray-700' : 'bg-gray-100'
                              }`}
                            >
                              <i
                                className={`${session.icon} text-lg ${
                                  darkMode ? 'text-gray-300' : 'text-gray-600'
                                }`}
                              />
                            </div>
                            <div>
                              <p
                                className={`text-sm font-medium ${
                                  darkMode ? 'text-white' : 'text-gray-900'
                                }`}
                              >
                                {session.device}
                                {session.current && (
                                  <span className="ml-2 text-xs text-emerald-500 font-normal">
                                    (This device)
                                  </span>
                                )}
                              </p>
                              <p
                                className={`text-xs ${
                                  darkMode ? 'text-gray-400' : 'text-gray-500'
                                }`}
                              >
                                {session.location} &middot; {session.time}
                              </p>
                            </div>
                          </div>
                          {!session.current && (
                            <button
                              className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                                darkMode
                                  ? 'text-red-400 hover:bg-red-600/10'
                                  : 'text-red-600 hover:bg-red-50'
                              }`}
                            >
                              Revoke
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Section */}
              {activeSection === 'notifications' && (
                <div
                  className={`rounded-lg border ${
                    darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                  }`}
                >
                  <div
                    className={`p-6 border-b ${
                      darkMode ? 'border-gray-700' : 'border-gray-200'
                    }`}
                  >
                    <h2
                      className={`text-xl font-bold ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      Notification Preferences
                    </h2>
                    <p
                      className={`text-sm mt-1 ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}
                    >
                      Choose how you want to be notified
                    </p>
                  </div>

                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center justify-end gap-16 mb-4 pr-2">
                      <span
                        className={`text-xs font-semibold uppercase tracking-wider ${
                          darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}
                      >
                        Email
                      </span>
                      <span
                        className={`text-xs font-semibold uppercase tracking-wider ${
                          darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}
                      >
                        Push
                      </span>
                    </div>

                    <div
                      className={`divide-y ${
                        darkMode ? 'divide-gray-700' : 'divide-gray-200'
                      }`}
                    >
                      {notifications.map((notif) => (
                        <div key={notif.key} className="py-4 flex items-center justify-between">
                          <div>
                            <p
                              className={`text-sm font-medium ${
                                darkMode ? 'text-white' : 'text-gray-900'
                              }`}
                            >
                              {notif.label}
                            </p>
                            <p
                              className={`text-xs mt-0.5 ${
                                darkMode ? 'text-gray-400' : 'text-gray-500'
                              }`}
                            >
                              {notif.description}
                            </p>
                          </div>

                          <div className="flex items-center gap-12">
                            {/* Email toggle */}
                            <button
                              onClick={() => handleToggleNotification(notif.key, 'email')}
                              className={`relative w-11 h-6 rounded-full cursor-pointer transition-colors ${
                                notif.email ? 'bg-red-600' : darkMode ? 'bg-gray-600' : 'bg-gray-300'
                              }`}
                            >
                              <div
                                className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                                  notif.email ? 'translate-x-5.5' : ''
                                }`}
                                style={{
                                  transform: notif.email ? 'translateX(22px)' : 'translateX(0)',
                                }}
                              />
                            </button>

                            {/* Push toggle */}
                            <button
                              onClick={() => handleToggleNotification(notif.key, 'push')}
                              className={`relative w-11 h-6 rounded-full cursor-pointer transition-colors ${
                                notif.push ? 'bg-red-600' : darkMode ? 'bg-gray-600' : 'bg-gray-300'
                              }`}
                            >
                              <div
                                className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform"
                                style={{
                                  transform: notif.push ? 'translateX(22px)' : 'translateX(0)',
                                  left: '2px',
                                }}
                              />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div
                    className={`p-6 border-t ${
                      darkMode ? 'border-gray-700' : 'border-gray-200'
                    } flex justify-end`}
                  >
                    <button
                      onClick={() => showToast('Notification preferences saved')}
                      className="px-6 py-2.5 bg-red-600 text-white hover:bg-red-700 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Save Preferences
                    </button>
                  </div>
                </div>
              )}

              {/* Preferences Section */}
              {activeSection === 'preferences' && (
                <div
                  className={`rounded-lg border ${
                    darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                  }`}
                >
                  <div
                    className={`p-6 border-b ${
                      darkMode ? 'border-gray-700' : 'border-gray-200'
                    }`}
                  >
                    <h2
                      className={`text-xl font-bold ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      Preferences
                    </h2>
                    <p
                      className={`text-sm mt-1 ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}
                    >
                      Customize your dashboard experience
                    </p>
                  </div>

                  <div className="p-6 space-y-6">
                    {/* Display Settings */}
                    <div>
                      <h3
                        className={`text-sm font-semibold mb-4 ${
                          darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}
                      >
                        Display
                      </h3>

                      <div className="space-y-4">
                        {/* Compact View */}
                        <div className="flex items-center justify-between">
                          <div>
                            <p
                              className={`text-sm font-medium ${
                                darkMode ? 'text-white' : 'text-gray-900'
                              }`}
                            >
                              Compact View
                            </p>
                            <p
                              className={`text-xs ${
                                darkMode ? 'text-gray-400' : 'text-gray-500'
                              }`}
                            >
                              Reduce spacing and padding in lists
                            </p>
                          </div>
                          <button
                            onClick={() =>
                              setPreferences({
                                ...preferences,
                                compactView: !preferences.compactView,
                              })
                            }
                            className={`relative w-11 h-6 rounded-full cursor-pointer transition-colors ${
                              preferences.compactView
                                ? 'bg-red-600'
                                : darkMode
                                ? 'bg-gray-600'
                                : 'bg-gray-300'
                            }`}
                          >
                            <div
                              className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform"
                              style={{
                                transform: preferences.compactView
                                  ? 'translateX(22px)'
                                  : 'translateX(0)',
                                left: '2px',
                              }}
                            />
                          </button>
                        </div>

                        {/* Show Tips */}
                        <div className="flex items-center justify-between">
                          <div>
                            <p
                              className={`text-sm font-medium ${
                                darkMode ? 'text-white' : 'text-gray-900'
                              }`}
                            >
                              Show Tips
                            </p>
                            <p
                              className={`text-xs ${
                                darkMode ? 'text-gray-400' : 'text-gray-500'
                              }`}
                            >
                              Display helpful tips and suggestions
                            </p>
                          </div>
                          <button
                            onClick={() =>
                              setPreferences({
                                ...preferences,
                                showTips: !preferences.showTips,
                              })
                            }
                            className={`relative w-11 h-6 rounded-full cursor-pointer transition-colors ${
                              preferences.showTips
                                ? 'bg-red-600'
                                : darkMode
                                ? 'bg-gray-600'
                                : 'bg-gray-300'
                            }`}
                          >
                            <div
                              className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform"
                              style={{
                                transform: preferences.showTips
                                  ? 'translateX(22px)'
                                  : 'translateX(0)',
                                left: '2px',
                              }}
                            />
                          </button>
                        </div>

                        {/* Auto-Save */}
                        <div className="flex items-center justify-between">
                          <div>
                            <p
                              className={`text-sm font-medium ${
                                darkMode ? 'text-white' : 'text-gray-900'
                              }`}
                            >
                              Auto-Save
                            </p>
                            <p
                              className={`text-xs ${
                                darkMode ? 'text-gray-400' : 'text-gray-500'
                              }`}
                            >
                              Automatically save drafts while editing
                            </p>
                          </div>
                          <button
                            onClick={() =>
                              setPreferences({
                                ...preferences,
                                autoSave: !preferences.autoSave,
                              })
                            }
                            className={`relative w-11 h-6 rounded-full cursor-pointer transition-colors ${
                              preferences.autoSave
                                ? 'bg-red-600'
                                : darkMode
                                ? 'bg-gray-600'
                                : 'bg-gray-300'
                            }`}
                          >
                            <div
                              className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform"
                              style={{
                                transform: preferences.autoSave
                                  ? 'translateX(22px)'
                                  : 'translateX(0)',
                                left: '2px',
                              }}
                            />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`} />

                    {/* Data Settings */}
                    <div>
                      <h3
                        className={`text-sm font-semibold mb-4 ${
                          darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}
                      >
                        Data &amp; Format
                      </h3>

                      <div className="grid grid-cols-2 gap-6">
                        {/* Default View */}
                        <div>
                          <label
                            className={`block text-sm font-medium mb-2 ${
                              darkMode ? 'text-gray-300' : 'text-gray-700'
                            }`}
                          >
                            Default View
                          </label>
                          <select
                            value={preferences.defaultView}
                            onChange={(e) =>
                              setPreferences({
                                ...preferences,
                                defaultView: e.target.value,
                              })
                            }
                            className={`w-full px-4 py-2.5 ${
                              darkMode
                                ? 'bg-gray-700 text-white border-gray-600'
                                : 'bg-gray-50 text-gray-900 border-gray-200'
                            } border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600 cursor-pointer`}
                          >
                            <option value="list">List View</option>
                            <option value="grid">Grid View</option>
                          </select>
                        </div>

                        {/* Items Per Page */}
                        <div>
                          <label
                            className={`block text-sm font-medium mb-2 ${
                              darkMode ? 'text-gray-300' : 'text-gray-700'
                            }`}
                          >
                            Items Per Page
                          </label>
                          <select
                            value={preferences.itemsPerPage}
                            onChange={(e) =>
                              setPreferences({
                                ...preferences,
                                itemsPerPage: e.target.value,
                              })
                            }
                            className={`w-full px-4 py-2.5 ${
                              darkMode
                                ? 'bg-gray-700 text-white border-gray-600'
                                : 'bg-gray-50 text-gray-900 border-gray-200'
                            } border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600 cursor-pointer`}
                          >
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                          </select>
                        </div>

                        {/* Date Format */}
                        <div>
                          <label
                            className={`block text-sm font-medium mb-2 ${
                              darkMode ? 'text-gray-300' : 'text-gray-700'
                            }`}
                          >
                            Date Format
                          </label>
                          <select
                            value={preferences.dateFormat}
                            onChange={(e) =>
                              setPreferences({
                                ...preferences,
                                dateFormat: e.target.value,
                              })
                            }
                            className={`w-full px-4 py-2.5 ${
                              darkMode
                                ? 'bg-gray-700 text-white border-gray-600'
                                : 'bg-gray-50 text-gray-900 border-gray-200'
                            } border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600 cursor-pointer`}
                          >
                            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                          </select>
                        </div>

                        {/* Timezone */}
                        <div>
                          <label
                            className={`block text-sm font-medium mb-2 ${
                              darkMode ? 'text-gray-300' : 'text-gray-700'
                            }`}
                          >
                            Timezone
                          </label>
                          <select
                            value={profileForm.timezone}
                            onChange={(e) =>
                              setProfileForm({
                                ...profileForm,
                                timezone: e.target.value,
                              })
                            }
                            className={`w-full px-4 py-2.5 ${
                              darkMode
                                ? 'bg-gray-700 text-white border-gray-600'
                                : 'bg-gray-50 text-gray-900 border-gray-200'
                            } border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600 cursor-pointer`}
                          >
                            <option value="Africa/Lubumbashi">
                              Africa/Lubumbashi (CAT)
                            </option>
                            <option value="Africa/Kinshasa">
                              Africa/Kinshasa (WAT)
                            </option>
                            <option value="UTC">UTC</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`p-6 border-t ${
                      darkMode ? 'border-gray-700' : 'border-gray-200'
                    } flex justify-end`}
                  >
                    <button
                      onClick={() => showToast('Preferences saved successfully')}
                      className="px-6 py-2.5 bg-red-600 text-white hover:bg-red-700 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Save Preferences
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div
            className={`w-full max-w-md rounded-xl shadow-2xl ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            <div
              className={`p-6 border-b ${
                darkMode ? 'border-gray-700' : 'border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <h2
                  className={`text-xl font-bold ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  Change Password
                </h2>
                <button
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordForm({
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: '',
                    });
                  }}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                    darkMode
                      ? 'hover:bg-gray-700 text-gray-400'
                      : 'hover:bg-gray-100 text-gray-500'
                  }`}
                >
                  <i className="ri-close-line text-xl" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {/* Current Password */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={passwordForm.currentPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        currentPassword: e.target.value,
                      })
                    }
                    placeholder="Enter current password"
                    className={`w-full px-4 py-2.5 pr-10 ${
                      darkMode
                        ? 'bg-gray-700 text-white placeholder-gray-400 border-gray-600'
                        : 'bg-gray-50 text-gray-900 placeholder-gray-500 border-gray-200'
                    } border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}
                  >
                    <i
                      className={showCurrentPassword ? 'ri-eye-off-line' : 'ri-eye-line'}
                    />
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        newPassword: e.target.value,
                      })
                    }
                    placeholder="Enter new password"
                    className={`w-full px-4 py-2.5 pr-10 ${
                      darkMode
                        ? 'bg-gray-700 text-white placeholder-gray-400 border-gray-600'
                        : 'bg-gray-50 text-gray-900 placeholder-gray-500 border-gray-200'
                    } border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}
                  >
                    <i
                      className={showNewPassword ? 'ri-eye-off-line' : 'ri-eye-line'}
                    />
                  </button>
                </div>

                {/* Strength Bar */}
                {passwordForm.newPassword && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <span
                        className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
                      >
                        Password strength
                      </span>
                      <span
                        className={`text-xs font-medium ${
                          passwordStrength <= 2
                            ? 'text-red-500'
                            : passwordStrength <= 3
                            ? 'text-amber-500'
                            : 'text-emerald-500'
                        }`}
                      >
                        {getStrengthLabel()}
                      </span>
                    </div>
                    <div
                      className={`h-1.5 rounded-full ${
                        darkMode ? 'bg-gray-700' : 'bg-gray-200'
                      }`}
                    >
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${getStrengthColor()}`}
                        style={{ width: `${(passwordStrength / 5) * 100}%` }}
                      />
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2">
                      {[
                        { check: passwordChecks.length, label: 'At least 8 characters' },
                        { check: passwordChecks.uppercase, label: 'Uppercase letter' },
                        { check: passwordChecks.lowercase, label: 'Lowercase letter' },
                        { check: passwordChecks.number, label: 'Number' },
                        { check: passwordChecks.special, label: 'Special character' },
                      ].map((item) => (
                        <div key={item.label} className="flex items-center gap-1.5">
                          <i
                            className={`text-xs ${
                              item.check ? 'ri-check-line text-emerald-500' : 'ri-close-line text-gray-400'
                            }`}
                          />
                          <span
                            className={`text-xs ${
                              item.check
                                ? darkMode
                                  ? 'text-emerald-400'
                                  : 'text-emerald-600'
                                : darkMode
                                ? 'text-gray-500'
                                : 'text-gray-400'
                            }`}
                          >
                            {item.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        confirmPassword: e.target.value,
                      })
                    }
                    placeholder="Confirm new password"
                    className={`w-full px-4 py-2.5 pr-10 ${
                      darkMode
                        ? 'bg-gray-700 text-white placeholder-gray-400 border-gray-600'
                        : 'bg-gray-50 text-gray-900 placeholder-gray-500 border-gray-200'
                    } border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}
                  >
                    <i
                      className={showConfirmPassword ? 'ri-eye-off-line' : 'ri-eye-line'}
                    />
                  </button>
                </div>
                {passwordForm.confirmPassword &&
                  passwordForm.newPassword !== passwordForm.confirmPassword && (
                    <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                      <i className="ri-error-warning-line" />
                      Passwords do not match
                    </p>
                  )}
              </div>
            </div>

            <div
              className={`p-6 border-t ${
                darkMode ? 'border-gray-700' : 'border-gray-200'
              } flex items-center justify-end gap-3`}
            >
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordForm({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                  });
                }}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  darkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Cancel
              </button>

              <button
                onClick={handleChangePassword}
                disabled={
                  !passwordForm.currentPassword ||
                  !passwordForm.newPassword ||
                  !passwordForm.confirmPassword ||
                  passwordForm.newPassword !== passwordForm.confirmPassword ||
                  passwordStrength < 3
                }
                className="px-4 py-2.5 bg-red-600 text-white hover:bg-red-700 rounded-lg text-sm font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                Update Password
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Toast */}
      <div
        className={`fixed top-6 right-6 z-[60] transition-all duration-300 ${
          showSuccessToast ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        }`}
      >
        <div className="flex items-center gap-3 px-5 py-3.5 bg-emerald-600 text-white rounded-lg shadow-xl">
          <i className="ri-check-line text-lg" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
