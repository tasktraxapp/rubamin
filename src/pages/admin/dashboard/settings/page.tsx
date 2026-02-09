import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import RolesPermissions from './components/RolesPermissions';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  avatar: string;
  lastLogin: string;
  createdAt: string;
  permissions: string[];
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
  color: string;
}

const SettingsPage = () => {
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

  // Settings state
  const [activeTab, setActiveTab] = useState<'users' | 'roles' | 'activity' | 'notifications'>('users');
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [showAddRoleModal, setShowAddRoleModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'user' | 'role'; id: string; name: string } | null>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [resetPasswordTarget, setResetPasswordTarget] = useState<User | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Invite form state
  const [inviteForm, setInviteForm] = useState({
    emails: '' as string,
    role: '',
    message: '',
    sendWelcome: true,
  });
  const [inviteEmails, setInviteEmails] = useState<string[]>([]);
  const [inviteEmailInput, setInviteEmailInput] = useState('');

  // Mock data
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'John Administrator',
      email: 'admin@rubamindrc.com',
      role: 'Super Admin',
      status: 'active',
      avatar: 'JA',
      lastLogin: '2024-01-15 09:30 AM',
      createdAt: '2023-01-01',
      permissions: ['all'],
    },
    {
      id: '2',
      name: 'Sarah Content',
      email: 'sarah.content@rubamindrc.com',
      role: 'Content Manager',
      status: 'active',
      avatar: 'SC',
      lastLogin: '2024-01-15 08:45 AM',
      createdAt: '2023-03-15',
      permissions: ['pages', 'media', 'resources', 'gallery'],
    },
    {
      id: '3',
      name: 'Michael HR',
      email: 'michael.hr@rubamindrc.com',
      role: 'HR Manager',
      status: 'active',
      avatar: 'MH',
      lastLogin: '2024-01-14 04:20 PM',
      createdAt: '2023-05-20',
      permissions: ['jobs', 'applications'],
    },
    {
      id: '4',
      name: 'Emily Media',
      email: 'emily.media@rubamindrc.com',
      role: 'Media Manager',
      status: 'active',
      avatar: 'EM',
      lastLogin: '2024-01-15 10:15 AM',
      createdAt: '2023-06-10',
      permissions: ['media', 'notices', 'tenders'],
    },
    {
      id: '5',
      name: 'David Resources',
      email: 'david.resources@rubamindrc.com',
      role: 'Resource Manager',
      status: 'inactive',
      avatar: 'DR',
      lastLogin: '2024-01-10 02:30 PM',
      createdAt: '2023-07-25',
      permissions: ['resources', 'reports', 'policies'],
    },
    {
      id: '6',
      name: 'Lisa Viewer',
      email: 'lisa.viewer@rubamindrc.com',
      role: 'Viewer',
      status: 'active',
      avatar: 'LV',
      lastLogin: '2024-01-15 11:00 AM',
      createdAt: '2023-09-01',
      permissions: ['view_only'],
    },
  ]);

  const roles = [
    {
      id: '1',
      name: 'Super Admin',
      description: 'Full access to everything including user management',
      permissions: ['all'],
      userCount: 1,
      color: 'bg-red-600',
    },
    {
      id: '2',
      name: 'Content Manager',
      description: 'Manage pages, media center, resources, and gallery',
      permissions: ['pages', 'media', 'resources', 'gallery'],
      userCount: 1,
      color: 'bg-emerald-600',
    },
    {
      id: '3',
      name: 'HR Manager',
      description: 'Manage job postings and applications',
      permissions: ['jobs', 'applications'],
      userCount: 1,
      color: 'bg-amber-600',
    },
    {
      id: '4',
      name: 'Media Manager',
      description: 'Manage notices and tenders',
      permissions: ['media', 'notices', 'tenders'],
      userCount: 1,
      color: 'bg-sky-600',
    },
    {
      id: '5',
      name: 'Resource Manager',
      description: 'Manage resources, reports, and policies',
      permissions: ['resources', 'reports', 'policies'],
      userCount: 1,
      color: 'bg-violet-600',
    },
    {
      id: '6',
      name: 'Viewer',
      description: 'Read-only access to assigned sections',
      permissions: ['view_only'],
      userCount: 1,
      color: 'bg-gray-600',
    },
  ];

  const activityLogs = [
    { id: '1', user: 'John Administrator', action: 'Created new user', target: 'Lisa Viewer', time: '2 hours ago', icon: 'ri-user-add-line' },
    { id: '2', user: 'Sarah Content', action: 'Updated page', target: 'Corporate Overview', time: '3 hours ago', icon: 'ri-edit-line' },
    { id: '3', user: 'Michael HR', action: 'Posted new job', target: 'Mining Engineer', time: '5 hours ago', icon: 'ri-briefcase-line' },
    { id: '4', user: 'Emily Media', action: 'Published notice', target: 'Annual Report 2024', time: '1 day ago', icon: 'ri-notification-line' },
    { id: '5', user: 'John Administrator', action: 'Changed role', target: 'David Resources', time: '2 days ago', icon: 'ri-shield-user-line' },
    { id: '6', user: 'Sarah Content', action: 'Uploaded media', target: 'Facilities Photos', time: '3 days ago', icon: 'ri-image-line' },
    { id: '7', user: 'John Administrator', action: 'Disabled user', target: 'David Resources', time: '3 days ago', icon: 'ri-user-unfollow-line' },
    { id: '8', user: 'Michael HR', action: 'Reviewed application', target: 'John Doe - Mining Engineer', time: '4 days ago', icon: 'ri-file-user-line' },
  ];

  const permissionsList = [
    { key: 'pages', label: 'Pages', icon: 'ri-file-list-3-line' },
    { key: 'media', label: 'Media', icon: 'ri-newspaper-line' },
    { key: 'jobs', label: 'Jobs', icon: 'ri-briefcase-line' },
    { key: 'gallery', label: 'Gallery', icon: 'ri-gallery-line' },
    { key: 'resources', label: 'Resources', icon: 'ri-folder-line' },
    { key: 'inquiries', label: 'Inquiries', icon: 'ri-mail-line' },
  ];

  const showToast = (message: string) => {
    setToastMessage(message);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  const handleAddInviteEmail = () => {
    const email = inviteEmailInput.trim();
    if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && !inviteEmails.includes(email)) {
      setInviteEmails([...inviteEmails, email]);
      setInviteEmailInput('');
    }
  };

  const handleRemoveInviteEmail = (email: string) => {
    setInviteEmails(inviteEmails.filter(e => e !== email));
  };

  const handleSendInvitations = () => {
    if (inviteEmails.length === 0 || !inviteForm.role) return;
    inviteEmails.forEach((email, idx) => {
      const name = email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      const newId = (users.length + idx + 1).toString();
      const newUserData: User = {
        id: newId,
        name,
        email,
        role: inviteForm.role,
        status: 'active',
        avatar: name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
        lastLogin: 'Never (Invited)',
        createdAt: new Date().toISOString().split('T')[0],
        permissions: roles.find(r => r.name === inviteForm.role)?.permissions || [],
      };
      setUsers(prev => [...prev, newUserData]);
    });
    showToast(`Invitation sent to ${inviteEmails.length} user${inviteEmails.length > 1 ? 's' : ''}`);
    setShowInviteModal(false);
    setInviteEmails([]);
    setInviteEmailInput('');
    setInviteForm({ emails: '', role: '', message: '', sendWelcome: true });
  };

  const handleResetPassword = () => {
    if (!resetPasswordTarget) return;
    showToast(`Password reset link sent to ${resetPasswordTarget.email}`);
    setShowResetPasswordModal(false);
    setResetPasswordTarget(null);
  };

  // New user form state
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: '',
    status: 'active' as 'active' | 'inactive',
    permissions: [] as string[],
  });

  // Email notification settings state
  const [notificationSettings, setNotificationSettings] = useState({
    downloadRequests: true,
    newInquiries: true,
    jobApplications: true,
    systemAlerts: true,
    weeklyDigest: false,
    instantAlerts: true,
    emailRecipients: ['admin@rubamindrc.com'],
  });
  const [newRecipientEmail, setNewRecipientEmail] = useState('');

  const handleAddRecipient = () => {
    const email = newRecipientEmail.trim();
    if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && !notificationSettings.emailRecipients.includes(email)) {
      setNotificationSettings({
        ...notificationSettings,
        emailRecipients: [...notificationSettings.emailRecipients, email],
      });
      setNewRecipientEmail('');
      showToast('Email recipient added');
    }
  };

  const handleRemoveRecipient = (email: string) => {
    setNotificationSettings({
      ...notificationSettings,
      emailRecipients: notificationSettings.emailRecipients.filter(e => e !== email),
    });
    showToast('Email recipient removed');
  };

  const handleSaveNotificationSettings = () => {
    showToast('Notification settings saved');
  };

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
    { label: 'Resources Center', icon: 'ri-folder-open-line', path: '/admin/dashboard/resources' },
    { label: 'Inquiries', icon: 'ri-mail-line', path: '/admin/dashboard/inquiries', badge: 8 },
    { label: 'Notifications', icon: 'ri-notification-3-line', path: '/admin/dashboard/notifications', badge: 4 },
    { label: 'Tasks', icon: 'ri-task-line', path: '/admin/dashboard/tasks', badge: 12 },
    { label: 'Deadlines', icon: 'ri-calendar-check-line', path: '/admin/dashboard/deadlines', badge: 11 },
    { label: 'Settings', icon: 'ri-settings-3-line', path: '/admin/dashboard/settings', active: true },
  ];

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(userSearchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map((u) => u.id));
    }
  };

  const handleSelectUser = (id: string) => {
    setSelectedUsers((prev) => (prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]));
  };

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email || !newUser.role) return; // basic validation
    const newId = (users.length + 1).toString();
    const newUserData: User = {
      id: newId,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: newUser.status,
      avatar: newUser.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2),
      lastLogin: 'Never',
      createdAt: new Date().toISOString().split('T')[0],
      permissions: newUser.permissions,
    };
    setUsers([...users, newUserData]);
    setShowAddUserModal(false);
    setNewUser({ name: '', email: '', role: '', status: 'active', permissions: [] });
  };

  const handleEditUser = () => {
    if (!editingUser) return;
    setUsers(users.map((u) => (u.id === editingUser.id ? editingUser : u)));
    setShowEditUserModal(false);
    setEditingUser(null);
  };

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter((u) => u.id !== id));
    setShowDeleteConfirm(false);
    setDeleteTarget(null);
  };

  const handleToggleStatus = (id: string) => {
    setUsers(
      users.map((u) =>
        u.id === id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u
      )
    );
  };

  const getRoleColor = (roleName: string) => {
    const role = roles.find((r) => r.name === roleName);
    return role?.color || 'bg-gray-600';
  };

  const menuItems = [
    { icon: 'ri-dashboard-line', label: 'Dashboard', path: '/admin/dashboard' },
    { icon: 'ri-file-list-line', label: 'Pages', path: '/admin/dashboard/pages' },
    { icon: 'ri-newspaper-line', label: 'Media', path: '/admin/dashboard/media-center', badge: 5 },
    { icon: 'ri-briefcase-line', label: 'Jobs', path: '/admin/dashboard/jobs', badge: 3 },
    { icon: 'ri-image-line', label: 'Gallery', path: '/admin/dashboard/gallery' },
    { icon: 'ri-folder-line', label: 'Resources Center', path: '/admin/dashboard/resources', badge: 7 },
    { icon: 'ri-mail-line', label: 'Inquiries', path: '/admin/dashboard/inquiries', badge: 8 },
    { icon: 'ri-notification-line', label: 'Notifications', path: '/admin/dashboard/notifications', badge: 4 },
    { icon: 'ri-task-line', label: 'Tasks', path: '/admin/dashboard/tasks', badge: 12 },
    { icon: 'ri-calendar-line', label: 'Deadlines', path: '/admin/dashboard/deadlines', badge: 11 },
    { icon: 'ri-settings-line', label: 'Settings', path: '/admin/dashboard/settings' },
  ];

  return (
    <div className={`min-h-screen flex ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Sidebar */}
      <aside
        className={`${sidebarCollapsed ? 'w-20' : 'w-64'} ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        } border-r flex flex-col fixed h-full transition-all duration-300 z-20`}
      >
        <div className={`p-5 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between`}>
          <Link to="/" className={`flex items-center gap-3 ${sidebarCollapsed ? 'justify-center' : ''}`}>
            <img
              src="https://static.readdy.ai/image/1b404af276821d98dfecb0eec592fbd4/2beca25c2dca50fd1a3109512ef52e33.png"
              alt="Logo"
              className="h-10 w-10 object-contain"
            />
            {!sidebarCollapsed && (
              <span className={`text-xl font-bold tracking-wide ${darkMode ? 'text-white' : 'text-[#2C3E50]'}`}>RUBAMIN</span>
            )}
          </Link>
          {!sidebarCollapsed && (
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className={`w-8 h-8 flex items-center justify-center rounded-lg ${
                darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
              } cursor-pointer transition-colors`}
            >
              <i className="ri-menu-fold-line text-lg" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
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
                          isActive ? 'bg-white text-red-600' : 'bg-red-600 text-white'
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
      <main className={`flex-1 ${sidebarCollapsed ? 'ml-20' : 'ml-64'} transition-all duration-300`}>
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
                  } border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600 transition-all`}
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all cursor-pointer ${
                  darkMode ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                }`}
                title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                <i className={`${darkMode ? 'ri-sun-line' : 'ri-moon-line'} text-lg`} />
              </button>
              <Link
                to="/admin/dashboard/notifications"
                className={`relative w-10 h-10 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                  darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
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
                  className={`w-10 h-10 rounded-lg flex items-center justify-center cursor-pointer overflow-hidden transition-all ${
                    profileDropdownOpen ? 'ring-2 ring-red-600 ring-offset-2' : ''
                  }`}
                  title={adminUser.name}
                >
                  <img 
                    src="https://readdy.ai/api/search-image?query=professional%20business%20person%20headshot%20portrait%20in%20formal%20attire%20with%20neutral%20background%20corporate%20style%20high%20quality%20photography%20clean%20simple%20background%20professional%20lighting%20confident%20expression&width=200&height=200&seq=admin-user-profile-pic&orientation=squarish"
                    alt={adminUser.name}
                    className="w-full h-full object-cover"
                  />
                </button>

                {profileDropdownOpen && (
                  <div
                    className={`absolute right-0 top-full mt-2 w-56 rounded-lg shadow-lg border overflow-hidden z-50 ${
                      darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className={`px-4 py-3 border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                      <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{adminUser.name}</p>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{adminUser.email}</p>
                    </div>
                    <div className="py-1">
                      <Link
                        to="/admin/dashboard/profile"
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors cursor-pointer ${
                          darkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-700 hover:bg-gray-50'
                        }`}
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        <i className="ri-user-line" />
                        My Profile
                      </Link>
                      <Link
                        to="/admin/dashboard/settings"
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors cursor-pointer ${
                          darkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-700 hover:bg-gray-50'
                        }`}
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        <i className="ri-settings-3-line" />
                        Account Settings
                      </Link>
                      <button
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors cursor-pointer ${
                          darkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-700 hover:bg-gray-50'
                        }`}
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        <i className="ri-lock-password-line" />
                        Change Password
                      </button>
                    </div>
                    <div className={`border-t py-1 ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                      <button
                        onClick={handleLogout}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors cursor-pointer ${
                          darkMode ? 'text-red-400 hover:bg-red-600/10' : 'text-red-600 hover:bg-red-50'
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
                {index > 0 && <i className={`ri-arrow-right-s-line ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />}
                {index === breadcrumbs.length - 1 ? (
                  <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {crumb.icon && <i className={`${crumb.icon} mr-1.5`} />}
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    to={crumb.path}
                    className={`flex items-center transition-colors cursor-pointer ${
                      darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-700 hover:text-gray-900'
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
                className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}
                style={{ fontFamily: 'Merriweather, serif' }}
              >
                Settings
              </h1>
              <p className={`mt-2 text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Manage users, roles, and permissions
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowInviteModal(true)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap border ${
                  darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <i className="ri-mail-send-line" />
                Invite Users
              </button>
              <button
                onClick={() => setShowAddUserModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white hover:bg-red-700 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap"
              >
                + Add User
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div
            className={`flex items-center gap-1 p-1 rounded-lg mb-6 w-fit ${
              darkMode ? 'bg-gray-800' : 'bg-gray-100'
            }`}
          >
            <button
              onClick={() => setActiveTab('users')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'users'
                  ? 'bg-red-600 text-white shadow-md'
                  : darkMode
                  ? 'text-gray-400 hover:text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <i className="ri-user-line" />
              Users
              <span
                className={`ml-1 px-2 py-0.5 text-xs rounded-full ${
                  activeTab === 'users' ? 'bg-white/20 text-white' : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'
                }`}
              >
                {users.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('roles')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'roles'
                  ? 'bg-red-600 text-white shadow-md'
                  : darkMode
                  ? 'text-gray-400 hover:text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <i className="ri-shield-user-line" />
              Roles
              <span
                className={`ml-1 px-2 py-0.5 text-xs rounded-full ${
                  activeTab === 'roles' ? 'bg-white/20 text-white' : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'
                }`}
              >
                {roles.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'notifications'
                  ? 'bg-red-600 text-white shadow-md'
                  : darkMode
                  ? 'text-gray-400 hover:text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <i className="ri-notification-3-line" />
              Notifications
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'activity'
                  ? 'bg-red-600 text-white shadow-md'
                  : darkMode
                  ? 'text-gray-400 hover:text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <i className="ri-history-line" />
              Activity Log
            </button>
          </div>

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div
              className={`rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
            >
              {/* Toolbar */}
              <div
                className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="relative flex-1 max-w-xs">
                      <i
                        className={`ri-search-line absolute left-3 top-1/2 -translate-y-1/2 ${
                          darkMode ? 'text-gray-500' : 'text-gray-400'
                        }`}
                      />
                      <input
                        type="text"
                        value={userSearchQuery}
                        onChange={(e) => setUserSearchQuery(e.target.value)}
                        placeholder="Search users..."
                        className={`w-full pl-10 pr-4 py-2 ${
                          darkMode
                            ? 'bg-gray-700 text-white placeholder-gray-400 border-gray-600'
                            : 'bg-gray-50 text-gray-900 placeholder-gray-500 border-gray-200'
                        } border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600`}
                      />
                    </div>
                    <select
                      value={roleFilter}
                      onChange={(e) => setRoleFilter(e.target.value)}
                      className={`px-4 py-2 ${
                        darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-200'
                      } border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600 cursor-pointer`}
                    >
                      <option value="all">All Roles</option>
                      {roles.map((role) => (
                        <option key={role.id} value={role.name}>
                          {role.name}
                        </option>
                      ))}
                    </select>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className={`px-4 py-2 ${
                        darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-200'
                      } border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600 cursor-pointer`}
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-3">
                      <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {filteredUsers.length} users
                      </span>
                      <div
                        className={`flex items-center rounded-lg border ${
                          darkMode ? 'border-gray-600' : 'border-gray-200'
                        }`}
                      >
                        <button
                          onClick={() => setViewMode('list')}
                          className={`w-9 h-9 flex items-center justify-center rounded-l-lg transition-colors cursor-pointer ${
                            viewMode === 'list' ? 'bg-red-600 text-white' : darkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'
                          }`}
                        >
                          <i className="ri-list-check text-lg" />
                        </button>
                        <button
                          onClick={() => setViewMode('grid')}
                          className={`w-9 h-9 flex items-center justify-center rounded-r-lg transition-colors cursor-pointer ${
                            viewMode === 'grid' ? 'bg-red-600 text-white' : darkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'
                          }`}
                        >
                          <i className="ri-grid-fill text-lg" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* List View */}
              {viewMode === 'list' && (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className={`${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                      <tr>
                        <th className="w-12 px-4 py-3">
                          <input
                            type="checkbox"
                            checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                            onChange={handleSelectAll}
                            className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-600 cursor-pointer"
                          />
                        </th>
                        <th
                          className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${
                            darkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}
                        >
                          User
                        </th>
                        <th
                          className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${
                            darkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}
                        >
                          Role
                        </th>
                        <th
                          className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${
                            darkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}
                        >
                          Status
                        </th>
                        <th
                          className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${
                            darkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}
                        >
                          Last Login
                        </th>
                        <th
                          className={`px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider ${
                            darkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                      {filteredUsers.map((user) => (
                        <tr
                          key={user.id}
                          className={`${darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'} transition-colors`}
                        >
                          <td className="px-4 py-4">
                            <input
                              type="checkbox"
                              checked={selectedUsers.includes(user.id)}
                              onChange={() => handleSelectUser(user.id)}
                              className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-600 cursor-pointer"
                            />
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold text-white ${getRoleColor(
                                  user.role
                                )}`}
                              >
                                {user.avatar}
                              </div>
                              <div>
                                <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{user.name}</p>
                                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium text-white ${getRoleColor(
                                user.role
                              )}`}
                            >
                              {user.role}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <button
                              onClick={() => handleToggleStatus(user.id)}
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer transition-colors ${
                                user.status === 'active'
                                  ? darkMode
                                    ? 'bg-green-500/20 text-green-400'
                                    : 'bg-green-50 text-green-600'
                                  : darkMode
                                  ? 'bg-gray-600 text-gray-400'
                                  : 'bg-gray-100 text-gray-500'
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  user.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                                }`}
                              />
                              {user.status === 'active' ? 'Active' : 'Inactive'}
                            </button>
                          </td>
                          <td className={`px-4 py-4 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{user.lastLogin}</td>
                          <td className="px-4 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => {
                                  setResetPasswordTarget(user);
                                  setShowResetPasswordModal(true);
                                }}
                                className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                                  darkMode ? 'hover:bg-gray-600 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                                }`}
                                title="Reset Password"
                              >
                                <i className="ri-key-line" />
                              </button>
                              <button
                                onClick={() => {
                                  setEditingUser(user);
                                  setShowEditUserModal(true);
                                }}
                                className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                                  darkMode ? 'hover:bg-gray-600 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                                }`}
                                title="Edit"
                              >
                                <i className="ri-edit-line" />
                              </button>
                              <button
                                onClick={() => {
                                  setDeleteTarget({ type: 'user', id: user.id, name: user.name });
                                  setShowDeleteConfirm(true);
                                }}
                                className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                                  darkMode ? 'hover:bg-red-600/20 text-red-400' : 'hover:bg-red-50 text-red-500'
                                }`}
                                title="Delete"
                              >
                                <i className="ri-delete-bin-line" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Grid View */}
              {viewMode === 'grid' && (
                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      className={`relative rounded-lg border p-4 transition-all hover:shadow-lg group ${
                        darkMode ? 'bg-gray-700/50 border-gray-600 hover:border-gray-500' : 'bg-white border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="absolute top-3 left-3">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.id)}
                          onChange={() => handleSelectUser(user.id)}
                          className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-600 cursor-pointer"
                        />
                      </div>
                      <div className="absolute top-3 right-3">
                        <button
                          onClick={() => handleToggleStatus(user.id)}
                          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium cursor-pointer transition-colors ${
                            user.status === 'active'
                              ? darkMode
                                ? 'bg-green-500/20 text-green-400'
                                : 'bg-green-50 text-green-600'
                              : darkMode
                              ? 'bg-gray-600 text-gray-400'
                              : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              user.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                            }`}
                          />
                          {user.status === 'active' ? 'Active' : 'Inactive'}
                        </button>
                      </div>
                      <div className="flex flex-col items-center pt-6 pb-4">
                        <div
                          className={`w-16 h-16 rounded-xl flex items-center justify-center text-xl font-bold text-white mb-3 ${getRoleColor(
                            user.role
                          )}`}
                        >
                          {user.avatar}
                        </div>
                        <h3 className={`text-sm font-semibold text-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>{user.name}</h3>
                        <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{user.email}</p>
                        <span
                          className={`mt-3 inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium text-white ${getRoleColor(
                            user.role
                          )}`}
                        >
                          {user.role}
                        </span>
                        <p className={`text-xs mt-3 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Last login: {user.lastLogin}</p>
                      </div>
                      <div
                        className={`absolute inset-0 bg-black/60 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2`}
                      >
                        <button
                          onClick={() => {
                            setResetPasswordTarget(user);
                            setShowResetPasswordModal(true);
                          }}
                          className="w-10 h-10 flex items-center justify-center bg-amber-500 rounded-lg text-white hover:bg-amber-600 transition-colors cursor-pointer"
                          title="Reset Password"
                        >
                          <i className="ri-key-line text-lg" />
                        </button>
                        <button
                          onClick={() => {
                            setEditingUser(user);
                            setShowEditUserModal(true);
                          }}
                          className="w-10 h-10 flex items-center justify-center bg-white rounded-lg text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <i className="ri-edit-line text-lg" />
                        </button>
                        <button
                          onClick={() => {
                            setDeleteTarget({ type: 'user', id: user.id, name: user.name });
                            setShowDeleteConfirm(true);
                          }}
                          className="w-10 h-10 flex items-center justify-center bg-red-600 rounded-lg text-white hover:bg-red-700 transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <i className="ri-delete-bin-line text-lg" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Roles Tab */}
          {activeTab === 'roles' && (
            <RolesPermissions darkMode={darkMode} />
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              {/* Email Alerts Section */}
              <div className={`rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${darkMode ? 'bg-red-600/20' : 'bg-red-50'}`}>
                      <i className={`ri-mail-line text-xl ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
                    </div>
                    <div>
                      <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Email Notifications</h3>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Configure email alerts for important events</p>
                    </div>
                  </div>
                </div>
                <div className="p-6 space-y-6">
                  {/* Notification Types */}
                  <div>
                    <h4 className={`text-sm font-semibold mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Alert Types</h4>
                    <div className="space-y-3">
                      {/* Download Requests */}
                      <label className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-colors ${
                        notificationSettings.downloadRequests
                          ? darkMode ? 'border-red-600 bg-red-600/10' : 'border-red-600 bg-red-50'
                          : darkMode ? 'border-gray-600 hover:border-gray-500' : 'border-gray-200 hover:border-gray-300'
                      }`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${darkMode ? 'bg-blue-500/20' : 'bg-blue-50'}`}>
                            <i className={`ri-download-line text-lg ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                          </div>
                          <div>
                            <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Download Requests</p>
                            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Get notified when someone requests to download resources</p>
                          </div>
                        </div>
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={notificationSettings.downloadRequests}
                            onChange={(e) => setNotificationSettings({ ...notificationSettings, downloadRequests: e.target.checked })}
                            className="sr-only"
                          />
                          <div className={`w-11 h-6 rounded-full transition-colors ${notificationSettings.downloadRequests ? 'bg-red-600' : darkMode ? 'bg-gray-600' : 'bg-gray-300'}`}>
                            <div className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform ${notificationSettings.downloadRequests ? 'translate-x-5' : 'translate-x-0.5'} mt-0.5`} />
                          </div>
                        </div>
                      </label>

                      {/* New Inquiries */}
                      <label className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-colors ${
                        notificationSettings.newInquiries
                          ? darkMode ? 'border-red-600 bg-red-600/10' : 'border-red-600 bg-red-50'
                          : darkMode ? 'border-gray-600 hover:border-gray-500' : 'border-gray-200 hover:border-gray-300'
                      }`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${darkMode ? 'bg-green-500/20' : 'bg-green-50'}`}>
                            <i className={`ri-mail-unread-line text-lg ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                          </div>
                          <div>
                            <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>New Inquiries</p>
                            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Get notified when new contact form submissions arrive</p>
                          </div>
                        </div>
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={notificationSettings.newInquiries}
                            onChange={(e) => setNotificationSettings({ ...notificationSettings, newInquiries: e.target.checked })}
                            className="sr-only"
                          />
                          <div className={`w-11 h-6 rounded-full transition-colors ${notificationSettings.newInquiries ? 'bg-red-600' : darkMode ? 'bg-gray-600' : 'bg-gray-300'}`}>
                            <div className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform ${notificationSettings.newInquiries ? 'translate-x-5' : 'translate-x-0.5'} mt-0.5`} />
                          </div>
                        </div>
                      </label>

                      {/* Job Applications */}
                      <label className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-colors ${
                        notificationSettings.jobApplications
                          ? darkMode ? 'border-red-600 bg-red-600/10' : 'border-red-600 bg-red-50'
                          : darkMode ? 'border-gray-600 hover:border-gray-500' : 'border-gray-200 hover:border-gray-300'
                      }`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${darkMode ? 'bg-amber-500/20' : 'bg-amber-50'}`}>
                            <i className={`ri-briefcase-line text-lg ${darkMode ? 'text-amber-400' : 'text-amber-600'}`} />
                          </div>
                          <div>
                            <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Job Applications</p>
                            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Get notified when candidates apply for job positions</p>
                          </div>
                        </div>
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={notificationSettings.jobApplications}
                            onChange={(e) => setNotificationSettings({ ...notificationSettings, jobApplications: e.target.checked })}
                            className="sr-only"
                          />
                          <div className={`w-11 h-6 rounded-full transition-colors ${notificationSettings.jobApplications ? 'bg-red-600' : darkMode ? 'bg-gray-600' : 'bg-gray-300'}`}>
                            <div className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform ${notificationSettings.jobApplications ? 'translate-x-5' : 'translate-x-0.5'} mt-0.5`} />
                          </div>
                        </div>
                      </label>

                      {/* System Alerts */}
                      <label className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-colors ${
                        notificationSettings.systemAlerts
                          ? darkMode ? 'border-red-600 bg-red-600/10' : 'border-red-600 bg-red-50'
                          : darkMode ? 'border-gray-600 hover:border-gray-500' : 'border-gray-200 hover:border-gray-300'
                      }`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${darkMode ? 'bg-red-500/20' : 'bg-red-50'}`}>
                            <i className={`ri-alarm-warning-line text-lg ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
                          </div>
                          <div>
                            <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>System Alerts</p>
                            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Get notified about security events and system issues</p>
                          </div>
                        </div>
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={notificationSettings.systemAlerts}
                            onChange={(e) => setNotificationSettings({ ...notificationSettings, systemAlerts: e.target.checked })}
                            className="sr-only"
                          />
                          <div className={`w-11 h-6 rounded-full transition-colors ${notificationSettings.systemAlerts ? 'bg-red-600' : darkMode ? 'bg-gray-600' : 'bg-gray-300'}`}>
                            <div className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform ${notificationSettings.systemAlerts ? 'translate-x-5' : 'translate-x-0.5'} mt-0.5`} />
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Delivery Preferences */}
                  <div className={`pt-6 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <h4 className={`text-sm font-semibold mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Delivery Preferences</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <label className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                        notificationSettings.instantAlerts
                          ? darkMode ? 'border-red-600 bg-red-600/10' : 'border-red-600 bg-red-50'
                          : darkMode ? 'border-gray-600 hover:border-gray-500' : 'border-gray-200 hover:border-gray-300'
                      }`}>
                        <input
                          type="checkbox"
                          checked={notificationSettings.instantAlerts}
                          onChange={(e) => setNotificationSettings({ ...notificationSettings, instantAlerts: e.target.checked })}
                          className="w-4 h-4 rounded text-red-600 focus:ring-red-600"
                        />
                        <div>
                          <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Instant Alerts</p>
                          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Receive emails immediately</p>
                        </div>
                      </label>
                      <label className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                        notificationSettings.weeklyDigest
                          ? darkMode ? 'border-red-600 bg-red-600/10' : 'border-red-600 bg-red-50'
                          : darkMode ? 'border-gray-600 hover:border-gray-500' : 'border-gray-200 hover:border-gray-300'
                      }`}>
                        <input
                          type="checkbox"
                          checked={notificationSettings.weeklyDigest}
                          onChange={(e) => setNotificationSettings({ ...notificationSettings, weeklyDigest: e.target.checked })}
                          className="w-4 h-4 rounded text-red-600 focus:ring-red-600"
                        />
                        <div>
                          <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Weekly Digest</p>
                          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Summary email every Monday</p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Email Recipients */}
                  <div className={`pt-6 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <h4 className={`text-sm font-semibold mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email Recipients</h4>
                    <p className={`text-xs mb-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Add email addresses that should receive notifications</p>
                    
                    {/* Current Recipients */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {notificationSettings.emailRecipients.map((email) => (
                        <span
                          key={email}
                          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm ${
                            darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          <i className="ri-mail-line text-xs" />
                          {email}
                          <button
                            onClick={() => handleRemoveRecipient(email)}
                            className={`w-5 h-5 flex items-center justify-center rounded-full transition-colors cursor-pointer ${
                              darkMode ? 'hover:bg-gray-600 text-gray-400 hover:text-white' : 'hover:bg-gray-200 text-gray-500 hover:text-gray-700'
                            }`}
                          >
                            <i className="ri-close-line text-sm" />
                          </button>
                        </span>
                      ))}
                    </div>

                    {/* Add New Recipient */}
                    <div className="flex gap-3">
                      <div className="relative flex-1">
                        <i className={`ri-mail-line absolute left-3 top-1/2 -translate-y-1/2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                        <input
                          type="email"
                          value={newRecipientEmail}
                          onChange={(e) => setNewRecipientEmail(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddRecipient(); } }}
                          placeholder="Enter email address..."
                          className={`w-full pl-10 pr-4 py-2.5 ${
                            darkMode
                              ? 'bg-gray-700 text-white placeholder-gray-400 border-gray-600'
                              : 'bg-gray-50 text-gray-900 placeholder-gray-500 border-gray-200'
                          } border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600`}
                        />
                      </div>
                      <button
                        onClick={handleAddRecipient}
                        className="px-4 py-2.5 bg-red-600 text-white hover:bg-red-700 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap"
                      >
                        <i className="ri-add-line mr-1" />
                        Add
                      </button>
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className={`p-6 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex justify-end`}>
                  <button
                    onClick={handleSaveNotificationSettings}
                    className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white hover:bg-red-700 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <i className="ri-save-line" />
                    Save Settings
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Activity Log Tab */}
          {activeTab === 'activity' && (
            <div
              className={`rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
            >
              <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Recent Activity</h3>
                <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Track all user actions and changes</p>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {activityLogs.map((log) => (
                  <div
                    key={log.id}
                    className={`p-4 flex items-start gap-4 ${darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'} transition-colors`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      <i className={`${log.icon} text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        <span className="font-medium">{log.user}</span>
                        <span className={`mx-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{log.action}</span>
                        <span className="font-medium">{log.target}</span>
                      </p>
                      <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{log.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-lg rounded-xl shadow-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between">
                <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Add New User</h2>
                <button
                  onClick={() => setShowAddUserModal(false)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                    darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                  }`}
                >
                  <i className="ri-close-line text-xl" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Full Name</label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  placeholder="Enter full name"
                  className={`w-full pl-4 py-2.5 ${darkMode ? 'bg-gray-700 text-white placeholder-gray-400 border-gray-600' : 'bg-gray-50 text-gray-900 placeholder-gray-500 border-gray-200'} border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email Address</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="Enter email address"
                  className={`w-full pl-4 py-2.5 ${darkMode ? 'bg-gray-700 text-white placeholder-gray-400 border-gray-600' : 'bg-gray-50 text-gray-900 placeholder-gray-500 border-gray-200'} border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className={`w-full pl-4 py-2.5 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-200'} border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600 cursor-pointer`}
                >
                  <option value="">Select a role</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.name}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Status</label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      checked={newUser.status === 'active'}
                      onChange={() => setNewUser({ ...newUser, status: 'active' })}
                      className="w-4 h-4 text-red-600 focus:ring-red-600"
                    />
                    <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Active</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      checked={newUser.status === 'inactive'}
                      onChange={() => setNewUser({ ...newUser, status: 'inactive' })}
                      className="w-4 h-4 text-red-600 focus:ring-red-600"
                    />
                    <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Inactive</span>
                  </label>
                </div>
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Permissions</label>
                <div className="grid grid-cols-2 gap-2">
                  {permissionsList.map((perm) => (
                    <label
                      key={perm.key}
                      className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                        newUser.permissions.includes(perm.key) ? 'border-red-600 bg-red-50 dark:bg-red-600/10' : darkMode ? 'border-gray-600 hover:border-gray-500' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={newUser.permissions.includes(perm.key)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewUser({ ...newUser, permissions: [...newUser.permissions, perm.key] });
                          } else {
                            setNewUser({ ...newUser, permissions: newUser.permissions.filter((p) => p !== perm.key) });
                          }
                        }}
                        className="w-4 h-4 rounded text-red-600 focus:ring-red-600"
                      />
                      <i className={`${perm.icon} ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{perm.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className={`p-6 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-end gap-3`}>
              <button
                onClick={() => {
                  setShowAddUserModal(false);
                  setNewUser({ name: '', email: '', role: '', status: 'active', permissions: [] });
                }}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleAddUser}
                disabled={!newUser.name || !newUser.email || !newUser.role}
                className="flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white hover:bg-red-700 rounded-lg text-sm font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                <i className="ri-send-plane-line" />
                Add User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditUserModal && editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-lg rounded-xl shadow-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between">
                <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Edit User</h2>
                <button
                  onClick={() => {
                    setShowEditUserModal(false);
                    setEditingUser(null);
                  }}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                    darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                  }`}
                >
                  <i className="ri-close-line text-xl" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Full Name</label>
                <input
                  type="text"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  className={`w-full px-4 py-2.5 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-200'} border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email Address</label>
                <input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  className={`w-full px-4 py-2.5 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-200'} border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Role</label>
                <select
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                  className={`w-full px-4 py-2.5 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-200'} border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600 cursor-pointer`}
                >
                  {roles.map((role) => (
                    <option key={role.id} value={role.name}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Status</label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="editStatus"
                      checked={editingUser.status === 'active'}
                      onChange={() => setEditingUser({ ...editingUser, status: 'active' })}
                      className="w-4 h-4 text-red-600 focus:ring-red-600"
                    />
                    <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Active</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="editStatus"
                      checked={editingUser.status === 'inactive'}
                      onChange={() => setEditingUser({ ...editingUser, status: 'inactive' })}
                      className="w-4 h-4 text-red-600 focus:ring-red-600"
                    />
                    <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Inactive</span>
                  </label>
                </div>
              </div>
            </div>
            <div className={`p-6 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-end gap-3`}>
              <button
                onClick={() => {
                  setShowEditUserModal(false);
                  setEditingUser(null);
                }}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Cancel
              </button>
              <button onClick={handleEditUser} className="px-4 py-2.5 bg-red-600 text-white hover:bg-red-700 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Role Modal */}
      {showAddRoleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-lg rounded-xl shadow-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between">
                <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Add New Role</h2>
                <button
                  onClick={() => setShowAddRoleModal(false)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                    darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                  }`}
                >
                  <i className="ri-close-line text-xl" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Role Name</label>
                <input
                  type="text"
                  placeholder="Enter role name"
                  className={`w-full px-4 py-2.5 ${darkMode ? 'bg-gray-700 text-white placeholder-gray-400 border-gray-600' : 'bg-gray-50 text-gray-900 placeholder-gray-500 border-gray-200'} border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Description</label>
                <textarea
                  placeholder="Describe the role's responsibilities"
                  rows={3}
                  className={`w-full px-4 py-2.5 ${darkMode ? 'bg-gray-700 text-white placeholder-gray-400 border-gray-600' : 'bg-gray-50 text-gray-900 placeholder-gray-500 border-gray-200'} border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600 resize-none`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Permissions</label>
                <div className="grid grid-cols-2 gap-2">
                  {permissionsList.map((perm) => (
                    <label
                      key={perm.key}
                      className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                        darkMode ? 'border-gray-600 hover:border-gray-500' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input type="checkbox" className="w-4 h-4 rounded text-red-600 focus:ring-red-600" />
                      <i className={`${perm.icon} ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{perm.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className={`p-6 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-end gap-3`}>
              <button
                onClick={() => setShowAddRoleModal(false)}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Cancel
              </button>
              <button className="px-4 py-2.5 bg-red-600 text-white hover:bg-red-700 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap">
                Create Role
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && deleteTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-md rounded-xl shadow-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="p-6 text-center">
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${darkMode ? 'bg-red-600/20' : 'bg-red-50'}`}>
                <i className={`ri-delete-bin-line text-3xl ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
              </div>
              <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Delete {deleteTarget.type === 'user' ? 'User' : 'Role'}?</h3>
              <p className={`text-sm mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Are you sure you want to delete <span className="font-semibold">{deleteTarget.name}</span>? This action cannot be undone.
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeleteTarget(null);
                  }}
                  className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteUser(deleteTarget.id)}
                  className="px-5 py-2.5 bg-red-600 text-white hover:bg-red-700 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Invite Users Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-lg rounded-xl shadow-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${darkMode ? 'bg-red-600/20' : 'bg-red-50'}`}>
                    <i className={`ri-mail-send-line text-xl ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
                  </div>
                  <div>
                    <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Invite Users</h2>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Send email invitations to new team members</p>
                  </div>
                </div>
                <button onClick={() => { setShowInviteModal(false); setInviteEmails([]); setInviteEmailInput(''); setInviteForm({ emails: '', role: '', message: '', sendWelcome: true }); }} className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}>
                  <i className="ri-close-line text-xl" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-5">
              {/* Email Input */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email Addresses</label>
                <div className={`min-h-[48px] p-2 flex flex-wrap gap-2 items-center ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} border rounded-lg`}>
                  {inviteEmails.map((email) => (
                    <span key={email} className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${darkMode ? 'bg-red-600/20 text-red-400' : 'bg-red-50 text-red-600'}`}>
                      {email}
                      <button
                        onClick={() => handleRemoveInviteEmail(email)}
                        className="cursor-pointer hover:text-red-800"
                      >
                        <i className="ri-close-line text-sm" />
                      </button>
                    </span>
                  ))}
                  <input
                    type="email"
                    value={inviteEmailInput}
                    onChange={(e) => setInviteEmailInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); handleAddInviteEmail(); } }}
                    placeholder={inviteEmails.length === 0 ? 'Enter email addresses...' : 'Add more...'}
                    className={`flex-1 min-w-[150px] px-2 py-1 bg-transparent text-sm outline-none ${darkMode ? 'text-white placeholder-gray-400 border-gray-600' : 'text-gray-900 placeholder-gray-500 border-gray-200'}`}
                  />
                </div>
                <p className={`text-xs mt-1.5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Press Enter or comma to add multiple emails</p>
              </div>

              {/* Role Selection */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Assign Role</label>
                <div className="grid grid-cols-2 gap-2">
                  {roles.map((role) => (
                    <button
                      key={role.id}
                      onClick={() => setInviteForm({ ...inviteForm, role: role.name })}
                      className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-all cursor-pointer ${
                        inviteForm.role === role.name
                          ? 'border-red-600 bg-red-50 dark:bg-red-600/10'
                          : darkMode
                          ? 'border-gray-600 hover:border-gray-500'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-md flex items-center justify-center ${role.color} flex-shrink-0`}>
                        <i className="ri-shield-user-line text-sm text-white" />
                      </div>
                      <div className="min-w-0">
                        <p className={`text-sm font-medium truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>{role.name}</p>
                        <p className={`text-xs truncate ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{role.userCount} user{role.userCount !== 1 ? 's' : ''}</p>
                      </div>
                      {inviteForm.role === role.name && (
                        <i className="ri-check-line text-red-600 ml-auto flex-shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Message */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Custom Message <span className={`font-normal ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>(optional)</span></label>
                <textarea
                  value={inviteForm.message}
                  onChange={(e) => setInviteForm({ ...inviteForm, message: e.target.value.slice(0, 500) })}
                  placeholder="Add a personal message to the invitation email..."
                  rows={3}
                  maxLength={500}
                  className={`w-full px-4 py-2.5 ${darkMode ? 'bg-gray-700 text-white placeholder-gray-400 border-gray-600' : 'bg-gray-50 text-gray-900 placeholder-gray-500 border-gray-200'} border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600 resize-none`}
                />
                <p className={`text-xs mt-1 text-right ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{inviteForm.message.length}/500</p>
              </div>

              {/* Options */}
              <label className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                <input
                  type="checkbox"
                  checked={inviteForm.sendWelcome}
                  onChange={(e) => setInviteForm({ ...inviteForm, sendWelcome: e.target.checked })}
                  className="w-4 h-4 rounded text-red-600 focus:ring-red-600"
                />
                <div>
                  <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Send welcome email</p>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Include login instructions and getting started guide</p>
                </div>
              </label>
            </div>
            <div className={`p-6 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between`}>
              <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                {inviteEmails.length > 0 ? `${inviteEmails.length} invitation${inviteEmails.length > 1 ? 's' : ''} ready` : 'No emails added'}
              </p>
              <div className="flex items-center gap-3">
                <button onClick={() => { setShowInviteModal(false); setInviteEmails([]); setInviteEmailInput(''); setInviteForm({ emails: '', role: '', message: '', sendWelcome: true }); }} className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                  Cancel
                </button>
                <button onClick={handleSendInvitations} disabled={inviteEmails.length === 0 || !inviteForm.role} className="flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white hover:bg-red-700 rounded-lg text-sm font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap">
                  <i className="ri-send-plane-line" />
                  Send Invitations
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {showResetPasswordModal && resetPasswordTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-md rounded-xl shadow-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="p-6 text-center">
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${darkMode ? 'bg-amber-600/20' : 'bg-amber-50'}`}>
                <i className={`ri-key-line text-3xl ${darkMode ? 'text-amber-400' : 'text-amber-600'}`} />
              </div>
              <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Reset Password</h3>
              <p className={`text-sm mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Send a password reset link to:
              </p>
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg mb-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <div className={`w-8 h-8 rounded-md flex items-center justify-center text-xs font-bold text-white ${getRoleColor(resetPasswordTarget.role)}`}>
                  {resetPasswordTarget.avatar}
                </div>
                <div className="text-left">
                  <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{resetPasswordTarget.name}</p>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{resetPasswordTarget.email}</p>
                </div>
              </div>
              <div className={`p-3 rounded-lg mb-6 text-left ${darkMode ? 'bg-gray-700/50' : 'bg-amber-50'}`}>
                <div className="flex items-start gap-2">
                  <i className={`ri-information-line text-sm mt-0.5 ${darkMode ? 'text-amber-400' : 'text-amber-600'}`} />
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-amber-700'}`}>
                    The user will receive an email with a secure link to create a new password. The link expires in 24 hours. Their current password will remain active until they set a new one.
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-center gap-3">
                <button onClick={() => { setShowResetPasswordModal(false); setResetPasswordTarget(null); }} className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                  Cancel
                </button>
                <button onClick={handleResetPassword} className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 text-white hover:bg-amber-600 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap">
                  <i className="ri-send-plane-line" />
                  Send Reset Link
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Toast */}
      <div className={`fixed top-6 right-6 z-[60] transition-all duration-300 ${showSuccessToast ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
        <div className="flex items-center gap-3 px-5 py-3.5 bg-emerald-600 text-white rounded-lg shadow-xl">
          <i className="ri-check-line text-lg" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
