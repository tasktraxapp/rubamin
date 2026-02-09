import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

interface Notification {
  id: string;
  type: 'inquiry' | 'job' | 'content' | 'user' | 'system' | 'tender' | 'media';
  title: string;
  message: string;
  time: string;
  timestamp: Date;
  read: boolean;
  priority: 'high' | 'medium' | 'low';
  user?: string;
  avatar?: string;
  actionUrl?: string;
}

interface EmailPreference {
  id: string;
  category: string;
  label: string;
  description: string;
  enabled: boolean;
  frequency: 'instant' | 'daily' | 'weekly' | 'never';
}

const NotificationsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('adminDarkMode');
    return saved ? JSON.parse(saved) : false;
  });

  // Email Preferences State
  const [showEmailPreferences, setShowEmailPreferences] = useState(false);
  const [emailPreferences, setEmailPreferences] = useState<EmailPreference[]>([
    {
      id: 'inquiry_new',
      category: 'Inquiries',
      label: 'New Contact Inquiries',
      description: 'Get notified when someone submits a contact form',
      enabled: true,
      frequency: 'instant',
    },
    {
      id: 'inquiry_urgent',
      category: 'Inquiries',
      label: 'Urgent Inquiries',
      description: 'High priority inquiries requiring immediate attention',
      enabled: true,
      frequency: 'instant',
    },
    {
      id: 'job_application',
      category: 'Jobs',
      label: 'New Job Applications',
      description: 'Receive alerts when candidates apply for positions',
      enabled: true,
      frequency: 'daily',
    },
    {
      id: 'job_deadline',
      category: 'Jobs',
      label: 'Application Deadlines',
      description: 'Reminders for upcoming job posting deadlines',
      enabled: true,
      frequency: 'daily',
    },
    {
      id: 'content_published',
      category: 'Content',
      label: 'Content Published',
      description: 'When pages or posts are published by team members',
      enabled: false,
      frequency: 'daily',
    },
    {
      id: 'content_draft',
      category: 'Content',
      label: 'Draft Reminders',
      description: 'Reminders about unpublished drafts',
      enabled: false,
      frequency: 'weekly',
    },
    {
      id: 'tender_new',
      category: 'Tenders',
      label: 'New Tenders',
      description: 'Notifications when new tenders are published',
      enabled: true,
      frequency: 'instant',
    },
    {
      id: 'tender_deadline',
      category: 'Tenders',
      label: 'Tender Deadlines',
      description: 'Alerts for approaching tender submission deadlines',
      enabled: true,
      frequency: 'daily',
    },
    {
      id: 'user_activity',
      category: 'Users',
      label: 'User Activity',
      description: 'New user registrations and role changes',
      enabled: true,
      frequency: 'daily',
    },
    {
      id: 'user_login',
      category: 'Users',
      label: 'Login Alerts',
      description: 'Suspicious login attempts and security alerts',
      enabled: true,
      frequency: 'instant',
    },
    {
      id: 'media_upload',
      category: 'Media',
      label: 'Media Uploads',
      description: 'When new images or files are uploaded to gallery',
      enabled: false,
      frequency: 'weekly',
    },
    {
      id: 'system_backup',
      category: 'System',
      label: 'System Backups',
      description: 'Daily backup completion notifications',
      enabled: false,
      frequency: 'never',
    },
    {
      id: 'system_updates',
      category: 'System',
      label: 'System Updates',
      description: 'Important system updates and maintenance alerts',
      enabled: true,
      frequency: 'instant',
    },
    {
      id: 'system_errors',
      category: 'System',
      label: 'Error Alerts',
      description: 'Critical system errors and failures',
      enabled: true,
      frequency: 'instant',
    },
  ]);
  const [masterEmailEnabled, setMasterEmailEnabled] = useState(true);
  const [digestTime, setDigestTime] = useState('09:00');
  const [digestDay, setDigestDay] = useState('monday');

  // Notifications state
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'inquiry',
      title: 'New Contact Inquiry',
      message: 'John Smith submitted a contact form regarding copper blister pricing.',
      time: '2 minutes ago',
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
      read: false,
      priority: 'high',
      user: 'John Smith',
      avatar: 'JS',
      actionUrl: '/admin/dashboard/inquiries',
    },
    {
      id: '2',
      type: 'job',
      title: 'New Job Application',
      message: 'Sarah Johnson applied for the Mining Engineer position.',
      time: '15 minutes ago',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      read: false,
      priority: 'high',
      user: 'Sarah Johnson',
      avatar: 'SJ',
      actionUrl: '/admin/dashboard/jobs',
    },
    {
      id: '3',
      type: 'content',
      title: 'Page Published',
      message: 'Corporate Overview page has been successfully published by Admin.',
      time: '1 hour ago',
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      read: false,
      priority: 'medium',
      user: 'Admin',
      avatar: 'AD',
      actionUrl: '/admin/dashboard/pages',
    },
    {
      id: '4',
      type: 'tender',
      title: 'Tender Deadline Approaching',
      message: 'Mining Equipment Supply tender closes in 24 hours.',
      time: '2 hours ago',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: false,
      priority: 'high',
      actionUrl: '/admin/dashboard/media-center',
    },
    {
      id: '5',
      type: 'user',
      title: 'New User Registered',
      message: 'Emily Davis has been added as Content Manager.',
      time: '3 hours ago',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      read: true,
      priority: 'medium',
      user: 'Emily Davis',
      avatar: 'ED',
      actionUrl: '/admin/dashboard/settings',
    },
    {
      id: '6',
      type: 'system',
      title: 'Backup Completed',
      message: 'Daily system backup completed successfully at 03:00 AM.',
      time: '5 hours ago',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      read: true,
      priority: 'low',
    },
    {
      id: '7',
      type: 'media',
      title: 'Gallery Updated',
      message: '12 new photos added to Facilities gallery by Media Manager.',
      time: '6 hours ago',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      read: true,
      priority: 'low',
      user: 'Media Manager',
      avatar: 'MM',
      actionUrl: '/admin/dashboard/gallery',
    },
    {
      id: '8',
      type: 'inquiry',
      title: 'Urgent Inquiry',
      message: 'ABC Mining Corp requested immediate callback regarding bulk order.',
      time: '8 hours ago',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
      read: true,
      priority: 'high',
      user: 'ABC Mining Corp',
      avatar: 'AM',
      actionUrl: '/admin/dashboard/inquiries',
    },
    {
      id: '9',
      type: 'job',
      title: 'Application Reviewed',
      message: 'HR Manager reviewed 5 applications for Safety Officer position.',
      time: '1 day ago',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      read: true,
      priority: 'medium',
      user: 'HR Manager',
      avatar: 'HR',
      actionUrl: '/admin/dashboard/jobs',
    },
    {
      id: '10',
      type: 'content',
      title: 'Draft Saved',
      message: 'Sustainability Report 2024 draft has been auto-saved.',
      time: '1 day ago',
      timestamp: new Date(Date.now() - 26 * 60 * 60 * 1000),
      read: true,
      priority: 'low',
      actionUrl: '/admin/dashboard/resources',
    },
    {
      id: '11',
      type: 'system',
      title: 'Security Alert',
      message: 'Multiple failed login attempts detected from unknown IP.',
      time: '2 days ago',
      timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
      read: true,
      priority: 'high',
    },
    {
      id: '12',
      type: 'tender',
      title: 'New Tender Published',
      message: 'Chemical Supplies tender has been published and is now accepting bids.',
      time: '2 days ago',
      timestamp: new Date(Date.now() - 50 * 60 * 60 * 1000),
      read: true,
      priority: 'medium',
      actionUrl: '/admin/dashboard/media-center',
    },
  ]);

  const [filterType, setFilterType] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [notificationSearch, setNotificationSearch] = useState('');
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [isLiveUpdates, setIsLiveUpdates] = useState(true);

  // Simulate real-time notifications
  useEffect(() => {
    if (!isLiveUpdates) return;
    
    const interval = setInterval(() => {
      const randomNotifications = [
        {
          type: 'inquiry' as const,
          title: 'New Contact Inquiry',
          message: 'A visitor submitted a question about industrial gas products.',
          priority: 'medium' as const,
        },
        {
          type: 'job' as const,
          title: 'New Job Application',
          message: 'New application received for open position.',
          priority: 'high' as const,
        },
        {
          type: 'system' as const,
          title: 'System Update',
          message: 'CMS has been updated to the latest version.',
          priority: 'low' as const,
        },
      ];
      
      const shouldAdd = Math.random() > 0.7;
      if (shouldAdd) {
        const randomNotif = randomNotifications[Math.floor(Math.random() * randomNotifications.length)];
        const newNotification: Notification = {
          id: Date.now().toString(),
          ...randomNotif,
          time: 'Just now',
          timestamp: new Date(),
          read: false,
        };
        setNotifications(prev => [newNotification, ...prev]);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [isLiveUpdates]);

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

  const generateBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs = [{ label: 'Home', path: '/', icon: 'ri-home-4-line' }];
    let currentPath = '';
    pathSegments.forEach((segment) => {
      currentPath += `/${segment}`;
      const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
      breadcrumbs.push({ label, path: currentPath, icon: '' });
    });
    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  const handleLogout = () => {
    sessionStorage.removeItem('adminLoggedIn');
    sessionStorage.removeItem('adminUser');
    navigate('/admin');
  };

  const adminUser = JSON.parse(sessionStorage.getItem('adminUser') || '{"name": "Admin", "email": "admin@rubamindrc.com"}');

  const sidebarItems = [
    { label: 'Dashboard', icon: 'ri-dashboard-3-line', path: '/admin/dashboard' },
    { label: 'Pages', icon: 'ri-file-list-3-line', path: '/admin/dashboard/pages' },
    { label: 'Media', icon: 'ri-newspaper-line', path: '/admin/dashboard/media-center', badge: 5 },
    { label: 'Jobs', icon: 'ri-briefcase-line', path: '/admin/dashboard/jobs', badge: 3 },
    { label: 'Gallery', icon: 'ri-gallery-line', path: '/admin/dashboard/gallery' },
    { label: 'Resources Center', icon: 'ri-folder-line', path: '/admin/dashboard/resources', badge: 7 },
    { label: 'Inquiries', icon: 'ri-mail-line', path: '/admin/dashboard/inquiries', badge: 8 },
    { label: 'Notifications', icon: 'ri-notification-3-line', path: '/admin/dashboard/notifications', active: true, badge: notifications.filter(n => !n.read).length },
    { label: 'Tasks', icon: 'ri-task-line', path: '/admin/dashboard/tasks', badge: 12 },
    { label: 'Deadlines', icon: 'ri-calendar-todo-line', path: '/admin/dashboard/deadlines', badge: 11 },
    { label: 'Settings', icon: 'ri-settings-3-line', path: '/admin/dashboard/settings' },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'inquiry': return 'ri-mail-line';
      case 'job': return 'ri-briefcase-line';
      case 'content': return 'ri-file-list-3-line';
      case 'user': return 'ri-user-add-line';
      case 'system': return 'ri-settings-3-line';
      case 'tender': return 'ri-auction-line';
      case 'media': return 'ri-image-line';
      default: return 'ri-notification-line';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'inquiry': return 'bg-sky-500';
      case 'job': return 'bg-emerald-500';
      case 'content': return 'bg-violet-500';
      case 'user': return 'bg-amber-500';
      case 'system': return 'bg-gray-500';
      case 'tender': return 'bg-rose-500';
      case 'media': return 'bg-pink-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return darkMode ? 'text-red-400 bg-red-500/20' : 'text-red-600 bg-red-50';
      case 'medium': return darkMode ? 'text-amber-400 bg-amber-500/20' : 'text-amber-600 bg-amber-50';
      case 'low': return darkMode ? 'text-gray-400 bg-gray-500/20' : 'text-gray-600 bg-gray-100';
      default: return darkMode ? 'text-gray-400 bg-gray-500/20' : 'text-gray-600 bg-gray-100';
    }
  };

  const filteredNotifications = notifications.filter((notif) => {
    const matchesType = filterType === 'all' || notif.type === filterType;
    const matchesPriority = filterPriority === 'all' || notif.priority === filterPriority;
    const matchesStatus = filterStatus === 'all' || (filterStatus === 'unread' ? !notif.read : notif.read);
    const matchesSearch = notif.title.toLowerCase().includes(notificationSearch.toLowerCase()) ||
                          notif.message.toLowerCase().includes(notificationSearch.toLowerCase());
    return matchesType && matchesPriority && matchesStatus && matchesSearch;
  });

  const unreadCount = notifications.filter(n => !n.read).length;
  const todayCount = notifications.filter(n => {
    const today = new Date();
    return n.timestamp.toDateString() === today.toDateString();
  }).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleMarkAsUnread = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: false } : n));
  };

  const handleDelete = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleSelectAll = () => {
    if (selectedNotifications.length === filteredNotifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(filteredNotifications.map(n => n.id));
    }
  };

  const handleSelectNotification = (id: string) => {
    setSelectedNotifications(prev => 
      prev.includes(id) ? prev.filter(nid => nid !== id) : [...prev, id]
    );
  };

  const handleBulkMarkAsRead = () => {
    setNotifications(prev => prev.map(n => 
      selectedNotifications.includes(n.id) ? { ...n, read: true } : n
    ));
    setSelectedNotifications([]);
  };

  const handleBulkDelete = () => {
    setNotifications(prev => prev.filter(n => !selectedNotifications.includes(n.id)));
    setSelectedNotifications([]);
  };

  const toggleEmailPreference = (id: string) => {
    setEmailPreferences(prev =>
      prev.map(pref =>
        pref.id === id ? { ...pref, enabled: !pref.enabled } : pref
      )
    );
  };

  const updateFrequency = (id: string, frequency: 'instant' | 'daily' | 'weekly' | 'never') => {
    setEmailPreferences(prev =>
      prev.map(pref =>
        pref.id === id ? { ...pref, frequency } : pref
      )
    );
  };

  const enableAllInCategory = (category: string) => {
    setEmailPreferences(prev =>
      prev.map(pref =>
        pref.category === category ? { ...pref, enabled: true } : pref
      )
    );
  };

  const disableAllInCategory = (category: string) => {
    setEmailPreferences(prev =>
      prev.map(pref =>
        pref.category === category ? { ...pref, enabled: false } : pref
      )
    );
  };

  const getGroupedPreferences = () => {
    const groups: { [key: string]: EmailPreference[] } = {};
    emailPreferences.forEach(pref => {
      if (!groups[pref.category]) {
        groups[pref.category] = [];
      }
      groups[pref.category].push(pref);
    });
    return groups;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Inquiries': return 'ri-mail-line';
      case 'Jobs': return 'ri-briefcase-line';
      case 'Content': return 'ri-file-list-3-line';
      case 'Tenders': return 'ri-auction-line';
      case 'Users': return 'ri-user-line';
      case 'Media': return 'ri-image-line';
      case 'System': return 'ri-settings-3-line';
      default: return 'ri-notification-line';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Inquiries': return 'bg-sky-500';
      case 'Jobs': return 'bg-emerald-500';
      case 'Content': return 'bg-violet-500';
      case 'Tenders': return 'bg-rose-500';
      case 'Users': return 'bg-amber-500';
      case 'Media': return 'bg-pink-500';
      case 'System': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const groupedPreferences = getGroupedPreferences();
  const enabledCount = emailPreferences.filter(p => p.enabled).length;

  const groupNotificationsByDate = (notifs: Notification[]) => {
    const groups: { [key: string]: Notification[] } = {};
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    notifs.forEach(notif => {
      let dateKey: string;
      if (notif.timestamp.toDateString() === today.toDateString()) {
        dateKey = 'Today';
      } else if (notif.timestamp.toDateString() === yesterday.toDateString()) {
        dateKey = 'Yesterday';
      } else {
        dateKey = notif.timestamp.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      }
      
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(notif);
    });

    return groups;
  };

  const groupedNotifications = groupNotificationsByDate(filteredNotifications);

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
                title={sidebarCollapsed ? item.label : ''}
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
                {sidebarCollapsed && item.badge && item.badge > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
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
            {/* Search Bar */}
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

            {/* Right Section */}
            <div className="flex items-center gap-3">
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
              <Link to="/admin/dashboard/notifications" className={`relative w-10 h-10 flex items-center justify-center rounded-lg cursor-pointer ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                <i className={`ri-notification-3-line text-lg`} />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-600 rounded-full" />
                )}
              </Link>

              {/* Date & Time */}
              <div className={`hidden md:flex flex-col items-end px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
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
                className={`hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium cursor-pointer whitespace-nowrap ${darkMode ? 'bg-red-600 text-white' : 'bg-red-600 text-white'}`}
              >
                <i className="ri-external-link-line" />
                View Site
              </Link>

              {/* User Profile Dropdown */}
              <div className="relative" ref={profileDropdownRef}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center cursor-pointer overflow-hidden transition-all ${profileDropdownOpen ? 'ring-2 ring-red-600 ring-offset-2' : ''}`}
                  title={adminUser.name}
                >
                  <img 
                    src="https://readdy.ai/api/search-image?query=professional%20business%20person%20headshot%20portrait%20in%20formal%20attire%20with%20neutral%20background%20corporate%20style%20high%20quality%20photography%20clean%20simple%20background%20professional%20lighting%20confident%20expression&width=200&height=200&seq=admin-user-profile-pic&orientation=squarish"
                    alt={adminUser.name}
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
                      <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{adminUser.name}</p>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{adminUser.email}</p>
                    </div>

                    {/* Menu Items */}
                    <div className="py-1">
                      <button
                        onClick={() => { setProfileDropdownOpen(false); navigate('/admin/dashboard/profile'); }}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors cursor-pointer ${
                          darkMode 
                            ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <i className="ri-user-line" />
                        My Profile
                      </button>
                      <button
                        onClick={() => { setProfileDropdownOpen(false); navigate('/admin/dashboard/settings'); }}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors cursor-pointer ${
                          darkMode 
                            ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <i className="ri-settings-3-line" />
                        Account Settings
                      </button>
                      <button
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors cursor-pointer ${
                          darkMode 
                            ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
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
                  <Link
                    to={crumb.path}
                    className={`flex items-center transition-colors cursor-pointer ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}
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
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'Merriweather, serif' }}>
                Notifications
              </h1>
              <p className={`mt-2 text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Stay updated with real-time activity and alerts
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* Email Preferences Button */}
              <button
                onClick={() => setShowEmailPreferences(true)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer border ${
                  darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <i className="ri-mail-settings-line" />
                Email Preferences
              </button>
              {/* Live Updates Toggle */}
              <button
                onClick={() => setIsLiveUpdates(!isLiveUpdates)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer border ${
                  isLiveUpdates
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : darkMode
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                    : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${isLiveUpdates ? 'bg-white animate-pulse' : darkMode ? 'bg-gray-500' : 'bg-gray-400'}`} />
                {isLiveUpdates ? 'Live' : 'Paused'}
              </button>
              <button
                onClick={handleMarkAllAsRead}
                disabled={unreadCount === 0}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer border disabled:opacity-50 disabled:cursor-not-allowed ${
                  darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <i className="ri-check-double-line" />
                Mark All Read
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className={`rounded-lg p-5 border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${darkMode ? 'bg-red-600/20' : 'bg-red-50'}`}>
                  <i className={`ri-notification-3-line text-xl ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
                </div>
                <div>
                  <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{notifications.length}</p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total</p>
                </div>
              </div>
            </div>
            <div className={`rounded-lg p-5 border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${darkMode ? 'bg-amber-600/20' : 'bg-amber-50'}`}>
                  <i className={`ri-mail-unread-line text-xl ${darkMode ? 'text-amber-400' : 'text-amber-600'}`} />
                </div>
                <div>
                  <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{unreadCount}</p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Unread</p>
                </div>
              </div>
            </div>
            <div className={`rounded-lg p-5 border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${darkMode ? 'bg-emerald-600/20' : 'bg-emerald-50'}`}>
                  <i className={`ri-calendar-check-line text-xl ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                </div>
                <div>
                  <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{todayCount}</p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Today</p>
                </div>
              </div>
            </div>
            <div className={`rounded-lg p-5 border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${darkMode ? 'bg-rose-600/20' : 'bg-rose-50'}`}>
                  <i className={`ri-alarm-warning-line text-xl ${darkMode ? 'text-rose-400' : 'text-rose-600'}`} />
                </div>
                <div>
                  <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{notifications.filter(n => n.priority === 'high' && !n.read).length}</p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>High Priority</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters & Search */}
          <div className={`rounded-lg border mb-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1">
                  {/* Search */}
                  <div className="relative flex-1 max-w-xs">
                    <i className={`ri-search-line absolute left-3 top-1/2 -translate-y-1/2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                    <input
                      type="text"
                      value={notificationSearch}
                      onChange={(e) => setNotificationSearch(e.target.value)}
                      placeholder="Search notifications..."
                      className={`w-full pl-10 pr-4 py-2 ${darkMode ? 'bg-gray-700 text-white placeholder-gray-400 border-gray-600' : 'bg-gray-50 text-gray-900 placeholder-gray-500 border-gray-200'} border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600`}
                    />
                  </div>

                  {/* Type Filter */}
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className={`px-4 py-2 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-200'} border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600 cursor-pointer`}
                  >
                    <option value="all">All Types</option>
                    <option value="inquiry">Inquiries</option>
                    <option value="job">Jobs</option>
                    <option value="content">Content</option>
                    <option value="user">Users</option>
                    <option value="system">System</option>
                    <option value="tender">Tenders</option>
                    <option value="media">Media</option>
                  </select>

                  {/* Priority Filter */}
                  <select
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value)}
                    className={`px-4 py-2 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-200'} border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600 cursor-pointer`}
                  >
                    <option value="all">All Priority</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>

                  {/* Status Filter */}
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className={`px-4 py-2 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-200'} border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600 cursor-pointer`}
                  >
                    <option value="all">All Status</option>
                    <option value="unread">Unread</option>
                    <option value="read">Read</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {filteredNotifications.length} notifications
                  </span>
                </div>
              </div>
            </div>

            {/* Bulk Actions */}
            {selectedNotifications.length > 0 && (
              <div className={`px-4 py-3 border-b flex items-center justify-between ${darkMode ? 'bg-gray-700/50 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {selectedNotifications.length} selected
                  </span>
                  <button
                    onClick={() => setSelectedNotifications([])}
                    className={`text-sm ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'} cursor-pointer`}
                  >
                    Clear selection
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleBulkMarkAsRead}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                      darkMode ? 'bg-gray-600 text-white hover:bg-gray-500' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    <i className="ri-check-line" />
                    Mark as Read
                  </button>
                  <button
                    onClick={handleBulkDelete}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-colors cursor-pointer"
                  >
                    <i className="ri-delete-bin-line" />
                    Delete
                  </button>
                </div>
              </div>
            )}

            {/* Notifications List */}
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {/* Select All Header */}
              <div className={`px-4 py-3 flex items-center gap-4 ${darkMode ? 'bg-gray-700/30' : 'bg-gray-50/50'}`}>
                <input
                  type="checkbox"
                  checked={selectedNotifications.length === filteredNotifications.length && filteredNotifications.length > 0}
                  onChange={handleSelectAll}
                  className="w-4 h-4 mt-1 rounded border-gray-300 text-red-600 focus:ring-red-600 cursor-pointer"
                />
                <span className={`text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Select All
                </span>
              </div>

              {Object.keys(groupedNotifications).length === 0 ? (
                <div className="p-12 text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <i className={`ri-notification-off-line text-3xl ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                  </div>
                  <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>No notifications found</h3>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Try adjusting your filters or search query</p>
                </div>
              ) : (
                Object.entries(groupedNotifications).map(([date, notifs]) => (
                  <div key={date}>
                    {/* Date Header */}
                    <div className={`px-4 py-2 sticky top-0 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                      <span className={`text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        {date}
                      </span>
                    </div>

                    {/* Notifications */}
                    {notifs.map((notification, index) => (
                      <div
                        key={notification.id}
                        className={`px-4 py-4 flex items-start gap-4 transition-colors cursor-pointer group ${
                          index !== notifs.length - 1 ? (darkMode ? 'border-b border-gray-700' : 'border-b border-gray-200') : ''
                        } ${
                          !notification.read
                            ? darkMode
                              ? 'border-l-4 border-l-red-500 hover:bg-gray-700/50'
                              : 'border-l-4 border-l-red-600 hover:bg-gray-50'
                            : darkMode
                            ? 'hover:bg-gray-700/50'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        {/* Checkbox */}
                        <input
                          type="checkbox"
                          checked={selectedNotifications.includes(notification.id)}
                          onChange={() => handleSelectNotification(notification.id)}
                          className="w-4 h-4 mt-1 rounded border-gray-300 text-red-600 focus:ring-red-600 cursor-pointer"
                        />

                        {/* Icon */}
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getTypeColor(notification.type)}`}>
                          <i className={`${getTypeIcon(notification.type)} text-lg text-white`} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className={`text-sm font-semibold truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                  {notification.title}
                                </h4>
                                {!notification.read && (
                                  <span className="w-2 h-2 rounded-full bg-red-600 flex-shrink-0" />
                                )}
                                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getPriorityColor(notification.priority)}`}>
                                  {notification.priority}
                                </span>
                              </div>
                              <p className={`text-sm mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                {notification.message}
                              </p>
                              <div className="flex items-center gap-3">
                                {notification.user && (
                                  <div className="flex items-center gap-1.5">
                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${getTypeColor(notification.type)}`}>
                                      {notification.avatar}
                                    </div>
                                    <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{notification.user}</span>
                                  </div>
                                )}
                                <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                  <i className="ri-time-line mr-1" />
                                  {notification.time}
                                </span>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              {notification.actionUrl && (
                                <Link
                                  to={notification.actionUrl}
                                  className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
                                    darkMode ? 'hover:bg-gray-600 text-gray-400' : 'hover:bg-gray-200 text-gray-500'
                                  }`}
                                  title="View"
                                >
                                  <i className="ri-external-link-line" />
                                </Link>
                              )}
                              {notification.read ? (
                                <button
                                  onClick={() => handleMarkAsUnread(notification.id)}
                                  className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                                    darkMode ? 'hover:bg-gray-600 text-gray-400' : 'hover:bg-gray-200 text-gray-500'
                                  }`}
                                  title="Mark as Unread"
                                >
                                  <i className="ri-mail-unread-line" />
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleMarkAsRead(notification.id)}
                                  className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                                    darkMode ? 'hover:bg-gray-600 text-gray-400' : 'hover:bg-gray-200 text-gray-500'
                                  }`}
                                  title="Mark as Read"
                                >
                                  <i className="ri-check-line" />
                                </button>
                              )}
                              <button
                                onClick={() => handleDelete(notification.id)}
                                className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                                  darkMode ? 'hover:bg-red-600/20 text-red-400' : 'hover:bg-red-50 text-red-500'
                                }`}
                                title="Delete"
                              >
                                <i className="ri-delete-bin-line" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Email Preferences Modal */}
      {showEmailPreferences && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowEmailPreferences(false)} />
          <div className={`relative w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-xl shadow-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            {/* Modal Header */}
            <div className={`sticky top-0 z-10 px-6 py-4 border-b ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${darkMode ? 'bg-red-600/20' : 'bg-red-50'}`}>
                    <i className={`ri-mail-settings-line text-xl ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
                  </div>
                  <div>
                    <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Email Notification Preferences</h2>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {enabledCount} of {emailPreferences.length} alerts enabled
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowEmailPreferences(false)}
                  className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                    darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                  }`}
                >
                  <i className="ri-close-line text-xl" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
              {/* Master Toggle */}
              <div className={`px-6 py-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${masterEmailEnabled ? 'bg-emerald-500' : darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                      <i className={`ri-mail-check-line text-2xl ${masterEmailEnabled ? 'text-white' : darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    </div>
                    <div>
                      <h3 className={`text-base font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Email Notifications</h3>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {masterEmailEnabled ? 'You will receive email alerts based on your preferences below' : 'All email notifications are currently disabled'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setMasterEmailEnabled(!masterEmailEnabled)}
                    className={`relative w-14 h-7 rounded-full transition-colors cursor-pointer ${
                      masterEmailEnabled ? 'bg-emerald-500' : darkMode ? 'bg-gray-600' : 'bg-gray-300'
                    }`}
                  >
                    <span className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                      masterEmailEnabled ? 'translate-x-8' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              </div>

              {/* Digest Settings */}
              {masterEmailEnabled && (
                <div className={`px-6 py-4 border-b ${darkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50/50'}`}>
                  <h4 className={`text-sm font-semibold mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <i className="ri-calendar-schedule-line mr-2" />
                    Digest Schedule
                  </h4>
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2">
                      <label className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Daily digest at:</label>
                      <select
                        value={digestTime}
                        onChange={(e) => setDigestTime(e.target.value)}
                        className={`px-3 py-1.5 rounded-lg text-sm border cursor-pointer ${
                          darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200 text-gray-900'
                        }`}
                      >
                        <option value="06:00">6:00 AM</option>
                        <option value="07:00">7:00 AM</option>
                        <option value="08:00">8:00 AM</option>
                        <option value="09:00">9:00 AM</option>
                        <option value="10:00">10:00 AM</option>
                        <option value="12:00">12:00 PM</option>
                        <option value="18:00">6:00 PM</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Weekly digest on:</label>
                      <select
                        value={digestDay}
                        onChange={(e) => setDigestDay(e.target.value)}
                        className={`px-3 py-1.5 rounded-lg text-sm border cursor-pointer ${
                          darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200 text-gray-900'
                        }`}
                      >
                        <option value="monday">Monday</option>
                        <option value="tuesday">Tuesday</option>
                        <option value="wednesday">Wednesday</option>
                        <option value="thursday">Thursday</option>
                        <option value="friday">Friday</option>
                        <option value="saturday">Saturday</option>
                        <option value="sunday">Sunday</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Preference Categories */}
              <div className={`px-6 py-4 ${!masterEmailEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
                {Object.entries(groupedPreferences).map(([category, prefs]) => {
                  const enabledInCategory = prefs.filter(p => p.enabled).length;
                  return (
                    <div key={category} className="mb-6 last:mb-0">
                      {/* Category Header */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getCategoryColor(category)}`}>
                            <i className={`${getCategoryIcon(category)} text-white text-sm`} />
                          </div>
                          <h4 className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{category}</h4>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
                            {enabledInCategory}/{prefs.length}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => enableAllInCategory(category)}
                            className={`text-xs px-2 py-1 rounded transition-colors cursor-pointer ${
                              darkMode ? 'text-emerald-400 hover:bg-emerald-500/20' : 'text-emerald-600 hover:bg-emerald-50'
                            }`}
                          >
                            Enable All
                          </button>
                          <button
                            onClick={() => disableAllInCategory(category)}
                            className={`text-xs px-2 py-1 rounded transition-colors cursor-pointer ${
                              darkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'
                            }`}
                          >
                            Disable All
                          </button>
                        </div>
                      </div>

                      {/* Preference Items */}
                      <div className={`rounded-lg border overflow-hidden ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        {prefs.map((pref, index) => (
                          <div
                            key={pref.id}
                            className={`flex items-center justify-between px-4 py-3 ${
                              index !== prefs.length - 1 ? (darkMode ? 'border-b border-gray-700' : 'border-b border-gray-100') : ''
                            } ${darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'} transition-colors`}
                          >
                            <div className="flex items-center gap-3 flex-1">
                              <button
                                onClick={() => toggleEmailPreference(pref.id)}
                                className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer flex-shrink-0 ${
                                  pref.enabled ? 'bg-emerald-500' : darkMode ? 'bg-gray-600' : 'bg-gray-300'
                                }`}
                              >
                                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                                  pref.enabled ? 'translate-x-5' : 'translate-x-0.5'
                                }`} />
                              </button>
                              <div className="min-w-0">
                                <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{pref.label}</p>
                                <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{pref.description}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                              <select
                                value={pref.frequency}
                                onChange={(e) => updateFrequency(pref.id, e.target.value as 'instant' | 'daily' | 'weekly' | 'never')}
                                disabled={!pref.enabled}
                                className={`px-2 py-1 rounded text-xs border cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200 text-gray-700'
                                }`}
                              >
                                <option value="instant">Instant</option>
                                <option value="daily">Daily Digest</option>
                                <option value="weekly">Weekly Digest</option>
                                <option value="never">Never</option>
                              </select>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className={`sticky bottom-0 px-6 py-4 border-t ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center justify-between">
                <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  <i className="ri-information-line mr-1" />
                  Changes are saved automatically
                </p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setEmailPreferences(prev => prev.map(p => ({ ...p, enabled: false })));
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                      darkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    Disable All
                  </button>
                  <button
                    onClick={() => setShowEmailPreferences(false)}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
