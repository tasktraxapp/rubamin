import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import TopVisitedPages from './components/TopVisitedPages';
import UpcomingDeadlines from './components/UpcomingDeadlines';
import PageViewsChart from './components/PageViewsChart';
import SecurityAuditLog from './components/SecurityAuditLog';
import BackupManagement from './components/BackupManagement';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const [hoveredMenuItem, setHoveredMenuItem] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('adminDarkMode');
    return saved ? JSON.parse(saved) : false;
  });

  // Activity Modal State
  const [selectedActivity, setSelectedActivity] = useState<{
    action: string;
    item: string;
    user: string;
    time: string;
    icon: string;
    type: string;
    description: string;
    ipAddress: string;
    browser: string;
    location: string;
    details: string[];
  } | null>(null);

  // Task Modal State
  const [selectedTask, setSelectedTask] = useState<{
    task: string;
    count: number;
    priority: string;
    icon: string;
    category: string;
    assignedTo: string;
    dueDate: string;
    description: string;
    status: string;
    details: string[];
  } | null>(null);

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

  // Generate breadcrumbs from current path
  const generateBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs = [{ label: 'Home', path: '/', icon: 'ri-home-4-line' }];
    
    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
      breadcrumbs.push({ 
        label, 
        path: currentPath,
        icon: index === pathSegments.length - 1 ? '' : ''
      });
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

  const stats = [
    { label: 'Total Pages', value: '34', icon: 'ri-file-list-3-line', change: '+2', trend: 'up' },
    { label: 'Active Jobs', value: '8', icon: 'ri-briefcase-line', change: '+3', trend: 'up' },
    { label: 'New Inquiries', value: '23', icon: 'ri-mail-line', change: '+5', trend: 'up' },
    { label: 'Site Visitors', value: '1,247', icon: 'ri-user-line', change: '+12%', trend: 'up' },
  ];

  const recentActivities = [
    { 
      action: 'Page Updated', 
      item: 'Corporate Overview', 
      user: 'Admin', 
      time: '2h ago', 
      icon: 'ri-edit-line', 
      type: 'update',
      description: 'Updated the Corporate Overview page with new company information and leadership details.',
      ipAddress: '192.168.1.105',
      browser: 'Chrome 120.0 on Windows',
      location: 'Lusaka, Zambia',
      details: ['Modified hero section content', 'Updated company statistics', 'Added new team member photos']
    },
    { 
      action: 'Notice Added', 
      item: 'Annual Report 2024', 
      user: 'Admin', 
      time: '5h ago', 
      icon: 'ri-notification-line', 
      type: 'create',
      description: 'Published the Annual Report 2024 notice for stakeholders and public access.',
      ipAddress: '192.168.1.105',
      browser: 'Chrome 120.0 on Windows',
      location: 'Lusaka, Zambia',
      details: ['Uploaded PDF document (2.4 MB)', 'Set publication date', 'Enabled public visibility']
    },
    { 
      action: 'Job Posted', 
      item: 'Mining Engineer', 
      user: 'HR', 
      time: '1d ago', 
      icon: 'ri-briefcase-line', 
      type: 'create',
      description: 'Created a new job posting for Mining Engineer position with full job description.',
      ipAddress: '192.168.1.112',
      browser: 'Firefox 121.0 on Windows',
      location: 'Lusaka, Zambia',
      details: ['Set application deadline: Jan 30, 2025', 'Added 12 requirements', 'Enabled online applications']
    },
    { 
      action: 'Gallery Updated', 
      item: 'Facilities Photos', 
      user: 'Admin', 
      time: '2d ago', 
      icon: 'ri-image-line', 
      type: 'update',
      description: 'Added new facility photos to the gallery showcasing recent infrastructure upgrades.',
      ipAddress: '192.168.1.105',
      browser: 'Chrome 120.0 on Windows',
      location: 'Lusaka, Zambia',
      details: ['Uploaded 15 new images', 'Optimized image sizes', 'Updated gallery categories']
    },
    { 
      action: 'User Login', 
      item: 'Dashboard Access', 
      user: 'Finance', 
      time: '2d ago', 
      icon: 'ri-login-box-line', 
      type: 'login',
      description: 'Finance department user successfully logged into the admin dashboard.',
      ipAddress: '192.168.1.118',
      browser: 'Edge 120.0 on Windows',
      location: 'Lusaka, Zambia',
      details: ['Two-factor authentication verified', 'Session duration: 2h 15m', 'Accessed financial reports']
    },
    { 
      action: 'Document Uploaded', 
      item: 'Q3 Financial Statement', 
      user: 'Finance', 
      time: '3d ago', 
      icon: 'ri-file-upload-line', 
      type: 'upload',
      description: 'Uploaded the Q3 2024 Financial Statement document for review and publication.',
      ipAddress: '192.168.1.118',
      browser: 'Edge 120.0 on Windows',
      location: 'Lusaka, Zambia',
      details: ['File size: 1.8 MB', 'Format: PDF', 'Pending approval for publication']
    },
    { 
      action: 'Tender Published', 
      item: 'Equipment Procurement', 
      user: 'Procurement', 
      time: '3d ago', 
      icon: 'ri-auction-line', 
      type: 'create',
      description: 'Published new tender for mining equipment procurement with detailed specifications.',
      ipAddress: '192.168.1.125',
      browser: 'Chrome 120.0 on Windows',
      location: 'Lusaka, Zambia',
      details: ['Closing date: Feb 15, 2025', 'Estimated value: $2.5M', 'Open to international bidders']
    },
    { 
      action: 'Inquiry Responded', 
      item: 'Partnership Request', 
      user: 'Admin', 
      time: '4d ago', 
      icon: 'ri-mail-send-line', 
      type: 'response',
      description: 'Responded to a partnership inquiry from an international mining company.',
      ipAddress: '192.168.1.105',
      browser: 'Chrome 120.0 on Windows',
      location: 'Lusaka, Zambia',
      details: ['Response sent via email', 'Attached company brochure', 'Scheduled follow-up meeting']
    },
    { 
      action: 'Policy Updated', 
      item: 'HSE Guidelines 2024', 
      user: 'HSE Manager', 
      time: '4d ago', 
      icon: 'ri-shield-check-line', 
      type: 'update',
      description: 'Updated Health, Safety & Environment guidelines with new regulatory compliance requirements.',
      ipAddress: '192.168.1.130',
      browser: 'Chrome 120.0 on Windows',
      location: 'Lusaka, Zambia',
      details: ['Added 5 new safety protocols', 'Updated emergency procedures', 'Revised PPE requirements']
    },
    { 
      action: 'Certificate Added', 
      item: 'ISO 14001:2015', 
      user: 'Quality', 
      time: '5d ago', 
      icon: 'ri-award-line', 
      type: 'create',
      description: 'Added new ISO 14001:2015 Environmental Management certification to the resources section.',
      ipAddress: '192.168.1.135',
      browser: 'Firefox 121.0 on Windows',
      location: 'Lusaka, Zambia',
      details: ['Certificate valid until: Dec 2027', 'Uploaded certificate scan', 'Updated certifications page']
    },
    { 
      action: 'Media Published', 
      item: 'Press Release - Expansion', 
      user: 'PR Team', 
      time: '5d ago', 
      icon: 'ri-newspaper-line', 
      type: 'create',
      description: 'Published press release announcing the company expansion plans for 2025.',
      ipAddress: '192.168.1.140',
      browser: 'Safari 17.0 on macOS',
      location: 'Lusaka, Zambia',
      details: ['Distributed to 25 media outlets', 'Published on social media', 'Added to media archive']
    },
    { 
      action: 'Job Closed', 
      item: 'Accountant Position', 
      user: 'HR', 
      time: '6d ago', 
      icon: 'ri-checkbox-circle-line', 
      type: 'update',
      description: 'Closed the Accountant position job posting after successful candidate selection.',
      ipAddress: '192.168.1.112',
      browser: 'Firefox 121.0 on Windows',
      location: 'Lusaka, Zambia',
      details: ['Received 45 applications', 'Shortlisted 8 candidates', 'Position filled successfully']
    },
  ];

  // Recent Activities filtering and pagination state
  const [activityUserFilter, setActivityUserFilter] = useState('all');
  const [activityTypeFilter, setActivityTypeFilter] = useState('all');
  const [activityPage, setActivityPage] = useState(1);
  const activitiesPerPage = 4;

  const uniqueUsers = ['all', ...Array.from(new Set(recentActivities.map(a => a.user)))];
  const activityTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'create', label: 'Created' },
    { value: 'update', label: 'Updated' },
    { value: 'upload', label: 'Uploaded' },
    { value: 'login', label: 'Login' },
    { value: 'response', label: 'Response' },
  ];

  const filteredActivities = recentActivities.filter(activity => {
    const userMatch = activityUserFilter === 'all' || activity.user === activityUserFilter;
    const typeMatch = activityTypeFilter === 'all' || activity.type === activityTypeFilter;
    return userMatch && typeMatch;
  });

  const totalActivityPages = Math.ceil(filteredActivities.length / activitiesPerPage);
  const paginatedActivities = filteredActivities.slice(
    (activityPage - 1) * activitiesPerPage,
    activityPage * activitiesPerPage
  );

  // Reset page when filters change
  const handleUserFilterChange = (value: string) => {
    setActivityUserFilter(value);
    setActivityPage(1);
  };

  const handleTypeFilterChange = (value: string) => {
    setActivityTypeFilter(value);
    setActivityPage(1);
  };

  const quickActions = [
    { label: 'Add Page', icon: 'ri-add-circle-line', path: '/admin/dashboard/pages' },
    { label: 'Upload Media', icon: 'ri-upload-cloud-line', path: '/admin/dashboard/gallery' },
    { label: 'Post Job', icon: 'ri-briefcase-line', path: '/admin/dashboard/jobs' },
    { label: 'New Notice', icon: 'ri-notification-line', path: '/admin/dashboard/media-center' },
    { label: 'New Tender', icon: 'ri-auction-line', path: '/admin/dashboard/media-center' },
    { label: 'New Report', icon: 'ri-file-chart-line', path: '/admin/dashboard/resources' },
  ];

  const menuItems = [
    { icon: 'ri-dashboard-line', label: 'Dashboard', path: '/admin/dashboard' },
    { icon: 'ri-file-list-line', label: 'Pages', path: '/admin/dashboard/pages' },
    { icon: 'ri-newspaper-line', label: 'Media', path: '/admin/dashboard/media-center' },
    { icon: 'ri-briefcase-line', label: 'Jobs', path: '/admin/dashboard/jobs' },
    { icon: 'ri-image-line', label: 'Gallery', path: '/admin/dashboard/gallery' },
    { icon: 'ri-folder-line', label: 'Resources Center', path: '/admin/dashboard/resources' },
    { icon: 'ri-mail-line', label: 'Inquiries', path: '/admin/dashboard/inquiries' },
    { icon: 'ri-notification-line', label: 'Notifications', path: '/admin/dashboard/notifications' },
    { icon: 'ri-task-line', label: 'Tasks', path: '/admin/dashboard/tasks' },
    { icon: 'ri-calendar-line', label: 'Deadlines', path: '/admin/dashboard/deadlines' },
    { icon: 'ri-settings-line', label: 'Settings', path: '/admin/dashboard/settings' },
  ];

  const sidebarItems = [
    { label: 'Dashboard', icon: 'ri-dashboard-3-line', path: '/admin/dashboard', active: true },
    { label: 'Pages', icon: 'ri-file-list-3-line', path: '/admin/dashboard/pages' },
    { label: 'Media', icon: 'ri-newspaper-line', path: '/admin/dashboard/media-center', badge: 5 },
    { label: 'Jobs', icon: 'ri-briefcase-line', path: '/admin/dashboard/jobs', badge: 3 },
    { label: 'Gallery', icon: 'ri-gallery-line', path: '/admin/dashboard/gallery' },
    { label: 'Resources Center', icon: 'ri-folder-line', path: '/admin/dashboard/resources', badge: 3 },
    { label: 'Inquiries', icon: 'ri-mail-line', path: '/admin/dashboard/inquiries', badge: 8 },
    { label: 'Notifications', icon: 'ri-notification-3-line', path: '/admin/dashboard/notifications', badge: 4 },
    { label: 'Tasks', icon: 'ri-task-line', path: '/admin/dashboard/tasks', badge: 12 },
    { label: 'Deadlines', icon: 'ri-calendar-todo-line', path: '/admin/dashboard/deadlines', badge: 11 },
    { label: 'Settings', icon: 'ri-settings-3-line', path: '/admin/dashboard/settings' },
  ];

  const pendingTasks = [
    { task: 'Review job applications', count: 5, priority: 'high', icon: 'ri-user-search-line', category: 'hr', assignedTo: 'HR Department', dueDate: 'Jan 20, 2025', description: 'Review and shortlist candidates for open Mining Engineer and Accountant positions.', status: 'In Progress', details: ['5 new applications received', 'Mining Engineer: 3 applicants', 'Accountant: 2 applicants', 'Screening deadline approaching'] },
    { task: 'Approve pending notices', count: 3, priority: 'medium', icon: 'ri-notification-line', category: 'content', assignedTo: 'Admin', dueDate: 'Jan 22, 2025', description: 'Review and approve draft notices before publication on the website.', status: 'Pending', details: ['Annual Report notice draft', 'Board meeting announcement', 'Holiday schedule update'] },
    { task: 'Update financial reports', count: 1, priority: 'high', icon: 'ri-file-chart-line', category: 'finance', assignedTo: 'Finance Team', dueDate: 'Jan 18, 2025', description: 'Upload and publish the Q4 2024 financial statements and annual summary.', status: 'Overdue', details: ['Q4 2024 statement pending upload', 'Annual summary needs review', 'Audit report attachment required'] },
    { task: 'Respond to inquiries', count: 8, priority: 'medium', icon: 'ri-mail-line', category: 'communication', assignedTo: 'Admin', dueDate: 'Jan 21, 2025', description: 'Reply to pending contact form submissions and partnership inquiries.', status: 'In Progress', details: ['3 partnership requests', '2 media inquiries', '2 general questions', '1 complaint to address'] },
    { task: 'Update gallery photos', count: 4, priority: 'low', icon: 'ri-image-line', category: 'content', assignedTo: 'Media Team', dueDate: 'Jan 25, 2025', description: 'Upload new facility and event photos to the gallery section.', status: 'Pending', details: ['New facility photos from site visit', 'Training event coverage', 'CSR activity documentation', 'Optimize existing image sizes'] },
    { task: 'Review tender submissions', count: 6, priority: 'high', icon: 'ri-auction-line', category: 'procurement', assignedTo: 'Procurement', dueDate: 'Jan 19, 2025', description: 'Evaluate submitted tender documents for equipment procurement.', status: 'In Progress', details: ['6 bids received for equipment tender', 'Technical evaluation pending', 'Financial comparison needed', 'Committee review scheduled'] },
    { task: 'Update HSE policies', count: 2, priority: 'medium', icon: 'ri-shield-check-line', category: 'compliance', assignedTo: 'HSE Manager', dueDate: 'Jan 28, 2025', description: 'Revise health and safety guidelines to meet new regulatory requirements.', status: 'Pending', details: ['New ZEMA regulations to incorporate', 'Emergency procedure updates', 'PPE policy revision needed'] },
    { task: 'Publish press release', count: 1, priority: 'low', icon: 'ri-newspaper-line', category: 'communication', assignedTo: 'PR Team', dueDate: 'Jan 30, 2025', description: 'Finalize and distribute the Q1 2025 expansion announcement press release.', status: 'Pending', details: ['Draft approved by management', 'Media distribution list ready', 'Social media posts prepared'] },
    { task: 'Renew SSL certificate', count: 1, priority: 'high', icon: 'ri-lock-line', category: 'technical', assignedTo: 'IT Team', dueDate: 'Jan 17, 2025', description: 'Renew the website SSL certificate before expiration to maintain security.', status: 'Overdue', details: ['Certificate expires in 2 days', 'Vendor contacted for renewal', 'DNS verification required'] },
    { task: 'Schedule board meeting', count: 1, priority: 'medium', icon: 'ri-calendar-event-line', category: 'admin', assignedTo: 'Admin', dueDate: 'Jan 24, 2025', description: 'Coordinate and schedule the Q1 board meeting with all directors.', status: 'Pending', details: ['Send calendar invites', 'Prepare agenda document', 'Book conference room', 'Arrange catering'] },
    { task: 'Audit user permissions', count: 3, priority: 'low', icon: 'ri-user-settings-line', category: 'technical', assignedTo: 'IT Team', dueDate: 'Feb 1, 2025', description: 'Review and update user access permissions across all admin modules.', status: 'Pending', details: ['3 new users need role assignment', 'Remove access for departed staff', 'Review admin privilege levels'] },
    { task: 'Update certifications page', count: 2, priority: 'medium', icon: 'ri-award-line', category: 'content', assignedTo: 'Quality Team', dueDate: 'Jan 26, 2025', description: 'Add newly received ISO certifications and update expiry dates.', status: 'In Progress', details: ['ISO 14001:2015 certificate to add', 'ISO 9001 renewal date update', 'Upload scanned certificates'] },
  ];

  // Pending Tasks filtering and pagination state
  const [taskPriorityFilter, setTaskPriorityFilter] = useState('all');
  const [taskCategoryFilter, setTaskCategoryFilter] = useState('all');
  const [taskPage, setTaskPage] = useState(1);
  const tasksPerPage = 4;

  const taskPriorities = [
    { value: 'all', label: 'All Priorities' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' },
  ];

  const taskCategories = [
    { value: 'all', label: 'All Categories' },
    { value: 'hr', label: 'HR' },
    { value: 'content', label: 'Content' },
    { value: 'finance', label: 'Finance' },
    { value: 'communication', label: 'Communication' },
    { value: 'procurement', label: 'Procurement' },
    { value: 'compliance', label: 'Compliance' },
    { value: 'technical', label: 'Technical' },
    { value: 'admin', label: 'Admin' },
  ];

  const filteredTasks = pendingTasks.filter(task => {
    const priorityMatch = taskPriorityFilter === 'all' || task.priority === taskPriorityFilter;
    const categoryMatch = taskCategoryFilter === 'all' || task.category === taskCategoryFilter;
    return priorityMatch && categoryMatch;
  });

  const totalTaskPages = Math.ceil(filteredTasks.length / tasksPerPage);
  const paginatedTasks = filteredTasks.slice(
    (taskPage - 1) * tasksPerPage,
    taskPage * tasksPerPage
  );

  const handleTaskPriorityFilterChange = (value: string) => {
    setTaskPriorityFilter(value);
    setTaskPage(1);
  };

  const handleTaskCategoryFilterChange = (value: string) => {
    setTaskCategoryFilter(value);
    setTaskPage(1);
  };

  const trafficData = [
    { source: 'Direct', value: 39, color: 'bg-red-600' },
    { source: 'Search', value: 29, color: 'bg-gray-700' },
    { source: 'Social', value: 20, color: 'bg-gray-500' },
    { source: 'Referral', value: 12, color: 'bg-gray-400' },
  ];

  const contentSections = [
    { name: 'Company', pages: 5, icon: 'ri-building-line' },
    { name: 'Products', pages: 4, icon: 'ri-box-3-line' },
    { name: 'Sustainability', pages: 3, icon: 'ri-leaf-line' },
    { name: 'CSR', pages: 2, icon: 'ri-heart-line' },
    { name: 'Media', pages: 4, icon: 'ri-newspaper-line' },
    { name: 'Resources', pages: 9, icon: 'ri-folder-line' },
  ];

  return (
    <div className={`min-h-screen flex ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Sidebar */}
      <aside className={`${sidebarCollapsed ? 'w-20' : 'w-64'} ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r flex flex-col fixed h-full transition-all duration-300 z-20`}>
        {/* Logo */}
        <div className={`p-5 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between`}>
          <button 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className={`flex items-center gap-3 ${sidebarCollapsed ? 'justify-center' : ''} cursor-pointer`}
            title={sidebarCollapsed ? 'Expand sidebar' : ''}
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

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {sidebarItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <div key={item.path} className="relative">
                <Link
                  to={item.path}
                  onClick={() => {
                    if (sidebarCollapsed) {
                      setSidebarCollapsed(false);
                    }
                  }}
                  onMouseEnter={() => sidebarCollapsed && setHoveredMenuItem(item.path)}
                  onMouseLeave={() => setHoveredMenuItem(null)}
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
                          isActive 
                            ? 'bg-white text-red-600' 
                            : 'bg-red-600 text-white'
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
                {/* Tooltip for collapsed sidebar */}
                {sidebarCollapsed && hoveredMenuItem === item.path && (
                  <div className={`absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-2 rounded-lg shadow-lg whitespace-nowrap z-50 ${
                    darkMode ? 'bg-gray-700 text-white' : 'bg-gray-900 text-white'
                  }`}>
                    <div className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 rotate-45 ${
                      darkMode ? 'bg-gray-700' : 'bg-gray-900'
                    }`} />
                    <span className="text-sm font-medium">{item.label}</span>
                    {item.badge && item.badge > 0 && (
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
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-600 rounded-full" />
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
                      <button className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors cursor-pointer ${
                        darkMode 
                          ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}>
                        <i className="ri-user-line" />
                        My Profile
                      </button>
                      <button className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors cursor-pointer ${
                        darkMode 
                          ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}>
                        <i className="ri-settings-3-line" />
                        Account Settings
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
        </header>

        {/* Breadcrumb Navigation */}
        <div className={`px-8 py-3 border-b ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50/80 border-gray-200'}`}>
          <nav className="flex items-center gap-2 text-sm">
            {breadcrumbs.map((crumb, index) => (
              <div key={crumb.path} className="flex items-center gap-2">
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
        <div className="p-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'Merriweather, serif' }}>
              Welcome back, {adminUser.name.split(' ')[0]}
            </h1>
            <p className={`mt-2 text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Here's an overview of your website performance and activities.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className={`rounded-lg p-6 border hover:shadow-lg transition-all duration-300 cursor-pointer ${
                  darkMode 
                    ? 'bg-gray-800 border-gray-700' 
                    : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          darkMode 
                            ? 'bg-red-600/20' 
                            : 'bg-red-50'
                        }`}>
                    <i className="ri-user-line text-lg" />
                  </div>
                  <span className={`text-xs font-semibold ${stat.trend === 'up' ? darkMode ? 'text-green-400 bg-green-500/20' : 'text-green-600 bg-green-50' : darkMode ? 'text-red-400 bg-red-500/20' : 'text-red-600 bg-red-50'} px-2.5 py-1 rounded-md flex items-center gap-0.5`}>
                    <i className={`${stat.trend === 'up' ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'}`} />
                    {stat.change}
                  </span>
                </div>
                <h3 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'Merriweather, serif' }}>{stat.value}</h3>
                <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Quick Actions */}
            <div className={`rounded-lg p-6 border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <h2 className={`text-lg font-bold mb-5 ${darkMode ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'Merriweather, serif' }}>
                Quick Actions
              </h2>
              <div className="space-y-3">
                {quickActions.map((action, index) => (
                  <Link
                    key={index}
                    to={action.path}
                    className={`flex items-center gap-4 p-4 rounded-lg transition-all duration-300 cursor-pointer ${
                      darkMode 
                        ? 'bg-gray-700 hover:bg-gray-600' 
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${darkMode ? 'bg-red-600/20' : 'bg-red-50'}`}>
                      <i className={`${action.icon} text-lg ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
                    </div>
                    <span className={`text-sm font-medium flex-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{action.label}</span>
                    <i className={`ri-arrow-right-s-line ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  </Link>
                ))}
              </div>
            </div>

            {/* Pending Tasks */}
            <div className={`lg:col-span-2 rounded-lg p-6 border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'Merriweather, serif' }}>
                  Pending Tasks
                </h2>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-semibold px-3 py-1.5 rounded-md ${darkMode ? 'text-gray-400 bg-gray-700' : 'text-gray-600 bg-gray-100'}`}>
                    {filteredTasks.reduce((acc, t) => acc + t.count, 0)} items
                  </span>
                  <Link 
                    to="/admin/dashboard/tasks"
                    className={`text-sm font-medium flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      darkMode 
                        ? 'text-red-400 hover:bg-red-600/10' 
                        : 'text-red-600 hover:bg-red-50'
                    }`}
                  >
                    View All
                    <i className="ri-arrow-right-line" />
                  </Link>
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-3 mb-4">
                <div className="relative">
                  <select
                    value={taskPriorityFilter}
                    onChange={(e) => handleTaskPriorityFilterChange(e.target.value)}
                    className={`appearance-none pl-3 pr-8 py-2 text-sm rounded-lg border cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-600 ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-gray-50 border-gray-200 text-gray-900'
                    }`}
                  >
                    {taskPriorities.map(p => (
                      <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                  </select>
                  <i className={`ri-arrow-down-s-line absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                </div>
                <div className="relative">
                  <select
                    value={taskCategoryFilter}
                    onChange={(e) => handleTaskCategoryFilterChange(e.target.value)}
                    className={`appearance-none pl-3 pr-8 py-2 text-sm rounded-lg border cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-600 ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-gray-50 border-gray-200 text-gray-900'
                    }`}
                  >
                    {taskCategories.map(c => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                  <i className={`ri-arrow-down-s-line absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                </div>
                {(taskPriorityFilter !== 'all' || taskCategoryFilter !== 'all') && (
                  <button
                    onClick={() => {
                      setTaskPriorityFilter('all');
                      setTaskCategoryFilter('all');
                      setTaskPage(1);
                    }}
                    className={`text-sm px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                      darkMode 
                        ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <i className="ri-close-line mr-1" />
                    Clear
                  </button>
                )}
              </div>

              {/* Tasks List */}
              <div className="space-y-3">
                {paginatedTasks.length > 0 ? (
                  paginatedTasks.map((task, index) => (
                    <div 
                      key={index} 
                      onClick={() => setSelectedTask(task)}
                      className={`flex items-center gap-4 p-4 rounded-lg transition-all cursor-pointer border group ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 hover:border-gray-500' 
                          : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        task.priority === 'high' 
                          ? darkMode ? 'bg-red-600/20' : 'bg-red-50' 
                          : task.priority === 'medium'
                            ? darkMode ? 'bg-yellow-600/20' : 'bg-yellow-50'
                            : darkMode ? 'bg-gray-600' : 'bg-gray-200'
                      }`}>
                        <i className={`${task.icon} text-lg ${
                          task.priority === 'high' 
                            ? darkMode ? 'text-red-400' : 'text-red-600' 
                            : task.priority === 'medium'
                              ? darkMode ? 'text-yellow-400' : 'text-yellow-600'
                              : darkMode ? 'text-gray-300' : 'text-gray-600'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{task.task}</p>
                        <p className={`text-xs mt-0.5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{task.count} pending items • {task.assignedTo}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-md capitalize ${
                          task.priority === 'high'
                            ? darkMode ? 'bg-red-600/20 text-red-400' : 'bg-red-50 text-red-600'
                            : task.priority === 'medium'
                              ? darkMode ? 'bg-yellow-600/20 text-yellow-400' : 'bg-yellow-50 text-yellow-600'
                              : darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-100 text-gray-500'
                        }`}>
                          {task.priority}
                        </span>
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${
                          task.status === 'Overdue'
                            ? darkMode ? 'bg-red-600/20 text-red-400' : 'bg-red-50 text-red-600'
                            : task.status === 'In Progress'
                              ? darkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-50 text-blue-600'
                              : darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-100 text-gray-500'
                        }`}>
                          {task.status}
                        </span>
                        <i className={`ri-arrow-right-s-line opacity-0 group-hover:opacity-100 transition-opacity ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <i className="ri-inbox-line text-3xl mb-2" />
                    <p className="text-sm">No tasks match your filters</p>
                  </div>
                )}
              </div>

              {/* Pagination */}
              {filteredTasks.length > tasksPerPage && (
                <div className={`flex items-center justify-between mt-4 pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Showing {((taskPage - 1) * tasksPerPage) + 1}-{Math.min(taskPage * tasksPerPage, filteredTasks.length)} of {filteredTasks.length}
                  </p>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setTaskPage(p => Math.max(1, p - 1))}
                      disabled={taskPage === 1}
                      className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                        darkMode 
                          ? 'hover:bg-gray-700 text-gray-400' 
                          : 'hover:bg-gray-200 text-gray-500'
                      }`}
                    >
                      <i className="ri-arrow-left-s-line" />
                    </button>
                    {Array.from({ length: totalTaskPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setTaskPage(page)}
                        className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                          taskPage === page
                            ? 'bg-red-600 text-white'
                            : darkMode 
                              ? 'hover:bg-gray-700 text-gray-400' 
                              : 'hover:bg-gray-200 text-gray-600'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => setTaskPage(p => Math.min(totalTaskPages, p + 1))}
                      disabled={taskPage === totalTaskPages}
                      className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                        darkMode 
                          ? 'hover:bg-gray-700 text-gray-400' 
                          : 'hover:bg-gray-200 text-gray-600'
                      }`}
                    >
                      <i className="ri-arrow-right-s-line" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Content Sections */}
          <div className={`rounded-lg p-6 border mb-8 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <h2 className={`text-lg font-bold mb-5 ${darkMode ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'Merriweather, serif' }}>
              Content Overview
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {contentSections.map((section, index) => (
                <div 
                  key={index} 
                  className={`p-5 rounded-lg transition-all cursor-pointer text-center border ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 hover:border-red-600' 
                      : 'bg-gray-50 border-gray-200 hover:border-red-600'
                  }`}
                >
                  <div className={`w-12 h-12 mx-auto mb-3 rounded-lg flex items-center justify-center ${darkMode ? 'bg-gray-600' : 'bg-white'}`}>
                    <i className={`${section.icon} text-xl ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} />
                  </div>
                  <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{section.name}</p>
                  <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{section.pages} pages</p>
                </div>
              ))}
            </div>
          </div>

          {/* Page Views & Top Visited Pages */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <PageViewsChart darkMode={darkMode} />
            <TopVisitedPages darkMode={darkMode} />
          </div>

          {/* Security Audit Log & Backup Management */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SecurityAuditLog darkMode={darkMode} />
            <BackupManagement darkMode={darkMode} />
          </div>
        </div>
      </main>

      {/* Activity Details Modal */}
      {selectedActivity && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setSelectedActivity(null)}
        >
          <div 
            className={`w-full max-w-lg rounded-xl shadow-2xl overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className={`px-6 py-4 border-b ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  selectedActivity.type === 'create' 
                    ? darkMode ? 'bg-green-600/20' : 'bg-green-50'
                    : selectedActivity.type === 'update'
                      ? darkMode ? 'bg-blue-600/20' : 'bg-blue-50'
                      : selectedActivity.type === 'login'
                        ? darkMode ? 'bg-purple-600/20' : 'bg-purple-50'
                        : selectedActivity.type === 'upload'
                          ? darkMode ? 'bg-orange-600/20' : 'bg-orange-50'
                          : darkMode ? 'bg-gray-700/30 border-gray-700' : 'bg-gray-50 border-gray-200'}`}
                >
                  <i className={`${selectedTask.icon} text-lg ${
                    selectedTask.priority === 'high' 
                      ? darkMode ? 'text-red-400' : 'text-red-600'
                      : selectedTask.priority === 'medium'
                        ? darkMode ? 'text-yellow-400' : 'text-yellow-600'
                        : darkMode ? 'text-gray-300' : 'text-gray-600'
                  }`} />
                </div>
                <div>
                  <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'Merriweather, serif' }}>
                    Task Details
                  </h3>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Due: {selectedTask.dueDate}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedTask(null)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                  darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-gray-500'
                }`}
              >
                <i className="ri-close-line text-xl" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-5 space-y-5 max-h-[60vh] overflow-y-auto">
              {/* Priority & Status Badges */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-md capitalize ${
                    selectedTask.priority === 'high'
                      ? darkMode ? 'bg-red-600/20 text-red-400' : 'bg-red-50 text-red-600'
                      : selectedTask.priority === 'medium'
                        ? darkMode ? 'bg-yellow-600/20 text-yellow-400' : 'bg-yellow-50 text-yellow-600'
                        : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {selectedTask.priority} priority
                  </span>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${
                    selectedTask.status === 'Overdue'
                      ? darkMode ? 'bg-red-600/20 text-red-400' : 'bg-red-50 text-red-600'
                      : selectedTask.status === 'In Progress'
                        ? darkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-50 text-blue-600'
                        : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {selectedTask.status}
                  </span>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-md capitalize ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                    {selectedTask.category}
                  </span>
                </div>
                <h4 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {selectedTask.task}
                </h4>
                <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {selectedTask.count} pending items
                </p>
              </div>

              {/* Description */}
              <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {selectedTask.description}
                </p>
              </div>

              {/* Details List */}
              <div>
                <h5 className={`text-sm font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Task Breakdown
                </h5>
                <ul className="space-y-2">
                  {selectedTask.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <i className={`ri-checkbox-blank-circle-line text-sm mt-0.5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                      <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Meta Information */}
              <div className={`grid grid-cols-2 gap-4 p-4 rounded-lg border ${darkMode ? 'bg-gray-700/30 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                <div>
                  <p className={`text-xs font-medium mb-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Assigned To</p>
                  <p className={`text-sm font-semibold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    <span className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {selectedTask.assignedTo.charAt(0)}
                    </span>
                    {selectedTask.assignedTo}
                  </p>
                </div>
                <div>
                  <p className={`text-xs font-medium mb-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Due Date</p>
                  <p className={`text-sm font-semibold ${
                    selectedTask.status === 'Overdue' 
                      ? darkMode ? 'text-red-400' : 'text-red-600' 
                      : darkMode ? 'text-white' : 'text-gray-900'
                  }`}>{selectedTask.dueDate}</p>
                </div>
                <div>
                  <p className={`text-xs font-medium mb-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Category</p>
                  <p className={`text-sm capitalize ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{selectedTask.category}</p>
                </div>
                <div>
                  <p className={`text-xs font-medium mb-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Pending Items</p>
                  <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedTask.count}</p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className={`px-6 py-4 border-t flex items-center justify-end gap-3 ${darkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50'}`}>
              <button
                onClick={() => setSelectedTask(null)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  darkMode 
                    ? 'text-gray-300 hover:bg-gray-700' 
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                Close
              </button>
              <button
                onClick={() => setSelectedTask(null)}
                className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer whitespace-nowrap"
              >
                Mark as Complete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
