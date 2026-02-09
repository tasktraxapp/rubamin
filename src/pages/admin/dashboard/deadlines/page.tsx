import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

interface Deadline {
  id: number;
  title: string;
  type: string;
  date: string;
  daysLeft: number;
  priority: string;
  status: string;
  description: string;
  assignedTo: string;
  department: string;
  details: string[];
  createdAt: string;
  updatedAt: string;
  reminderSent?: boolean;
  reminderDate?: string;
}

interface NotificationSettings {
  enabled: boolean;
  reminderDays: number[];
  emailRecipients: string[];
  notifyOnUrgent: boolean;
  notifyOnOverdue: boolean;
  dailyDigest: boolean;
  digestTime: string;
}

const initialDeadlines: Deadline[] = [
  {
    id: 1,
    title: 'Mining Equipment Tender',
    type: 'Tender',
    date: '2025-01-28',
    daysLeft: 3,
    priority: 'urgent',
    status: 'active',
    description: 'Procurement tender for heavy mining equipment including excavators and haul trucks.',
    assignedTo: 'Procurement Team',
    department: 'Procurement',
    details: ['Bid submission deadline', 'Technical evaluation pending', 'Budget: $2.5M allocated'],
    createdAt: 'Jan 10, 2025',
    updatedAt: 'Jan 22, 2025',
  },
  {
    id: 2,
    title: 'Senior Geologist Application',
    type: 'Job',
    date: '2025-01-30',
    daysLeft: 5,
    priority: 'high',
    status: 'active',
    description: 'Job posting for Senior Geologist position closing soon. 45 applications received.',
    assignedTo: 'HR Department',
    department: 'Human Resources',
    details: ['45 applications received', 'Shortlisting in progress', 'Interview panel confirmed'],
    createdAt: 'Jan 05, 2025',
    updatedAt: 'Jan 20, 2025',
  },
  {
    id: 3,
    title: 'Annual HSE Report Submission',
    type: 'Report',
    date: '2025-02-01',
    daysLeft: 7,
    priority: 'high',
    status: 'active',
    description: 'Annual Health, Safety & Environment report submission to regulatory authorities.',
    assignedTo: 'HSE Manager',
    department: 'HSE',
    details: ['Data collection 90% complete', 'Awaiting final incident statistics', 'Regulatory compliance required'],
    createdAt: 'Dec 15, 2024',
    updatedAt: 'Jan 18, 2025',
  },
  {
    id: 4,
    title: 'Transport Services Tender',
    type: 'Tender',
    date: '2025-02-05',
    daysLeft: 11,
    priority: 'medium',
    status: 'active',
    description: 'Tender for transportation and logistics services for mining operations.',
    assignedTo: 'Logistics Team',
    department: 'Operations',
    details: ['Pre-qualification completed', '8 vendors shortlisted', 'Site visits scheduled'],
    createdAt: 'Jan 02, 2025',
    updatedAt: 'Jan 15, 2025',
  },
  {
    id: 5,
    title: 'Electrical Engineer Position',
    type: 'Job',
    date: '2025-02-10',
    daysLeft: 16,
    priority: 'medium',
    status: 'active',
    description: 'Recruitment for Electrical Engineer to support plant maintenance operations.',
    assignedTo: 'HR Department',
    department: 'Human Resources',
    details: ['28 applications received', 'Technical test prepared', 'Salary range approved'],
    createdAt: 'Jan 08, 2025',
    updatedAt: 'Jan 19, 2025',
  },
  {
    id: 6,
    title: 'Q4 Financial Report',
    type: 'Report',
    date: '2025-02-15',
    daysLeft: 21,
    priority: 'low',
    status: 'active',
    description: 'Quarterly financial report for Q4 2024 to be submitted to board of directors.',
    assignedTo: 'Finance Team',
    department: 'Finance',
    details: ['Revenue analysis complete', 'Expense reconciliation ongoing', 'Audit review scheduled'],
    createdAt: 'Jan 01, 2025',
    updatedAt: 'Jan 14, 2025',
  },
  {
    id: 7,
    title: 'Safety Equipment Tender',
    type: 'Tender',
    date: '2025-02-18',
    daysLeft: 24,
    priority: 'medium',
    status: 'active',
    description: 'Procurement of personal protective equipment and safety gear for all departments.',
    assignedTo: 'HSE Team',
    department: 'HSE',
    details: ['Specifications finalized', 'Vendor list prepared', 'Budget: $150K approved'],
    createdAt: 'Jan 03, 2025',
    updatedAt: 'Jan 16, 2025',
  },
  {
    id: 8,
    title: 'Environmental Impact Report',
    type: 'Report',
    date: '2025-02-20',
    daysLeft: 26,
    priority: 'high',
    status: 'active',
    description: 'Annual environmental impact assessment report for regulatory submission.',
    assignedTo: 'Environmental Team',
    department: 'Sustainability',
    details: ['Field surveys completed', 'Lab results pending', 'Stakeholder consultation done'],
    createdAt: 'Dec 20, 2024',
    updatedAt: 'Jan 17, 2025',
  },
  {
    id: 9,
    title: 'Maintenance Technician Role',
    type: 'Job',
    date: '2025-02-25',
    daysLeft: 31,
    priority: 'low',
    status: 'active',
    description: 'Hiring maintenance technicians for plant equipment servicing.',
    assignedTo: 'HR Department',
    department: 'Human Resources',
    details: ['15 applications received', 'Skills assessment planned', 'Training program ready'],
    createdAt: 'Jan 12, 2025',
    updatedAt: 'Jan 21, 2025',
  },
  {
    id: 10,
    title: 'Production Statistics Report',
    type: 'Report',
    date: '2025-02-28',
    daysLeft: 34,
    priority: 'medium',
    status: 'active',
    description: 'Monthly production statistics and performance metrics report.',
    assignedTo: 'Operations Team',
    department: 'Operations',
    details: ['Data collection ongoing', 'KPI dashboard updated', 'Comparison analysis pending'],
    createdAt: 'Jan 06, 2025',
    updatedAt: 'Jan 20, 2025',
  },
  {
    id: 11,
    title: 'IT Infrastructure Upgrade Tender',
    type: 'Tender',
    date: '2025-03-05',
    daysLeft: 39,
    priority: 'medium',
    status: 'active',
    description: 'Tender for upgrading network infrastructure and server equipment across all sites.',
    assignedTo: 'IT Department',
    department: 'IT',
    details: ['Requirements document finalized', 'Vendor outreach started', 'Budget: $500K approved'],
    createdAt: 'Jan 15, 2025',
    updatedAt: 'Jan 22, 2025',
  },
  {
    id: 12,
    title: 'Community Engagement Report',
    type: 'Report',
    date: '2025-03-10',
    daysLeft: 44,
    priority: 'low',
    status: 'completed',
    description: 'Annual community engagement and CSR activities report for stakeholders.',
    assignedTo: 'CSR Team',
    department: 'CSR',
    details: ['All data compiled', 'Photos and testimonials collected', 'Draft reviewed by management'],
    createdAt: 'Dec 10, 2024',
    updatedAt: 'Jan 23, 2025',
  },
];

const DeadlinesManagementPage = () => {
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

  const [deadlines, setDeadlines] = useState<Deadline[]>(initialDeadlines);
  const [typeFilter, setTypeFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deadlineSearch, setDeadlineSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modal states
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDeadline, setSelectedDeadline] = useState<Deadline | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Notification states
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);
  const [showSendReminderModal, setShowSendReminderModal] = useState(false);
  const [reminderDeadline, setReminderDeadline] = useState<Deadline | null>(null);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(() => {
    const saved = localStorage.getItem('deadlineNotificationSettings');
    return saved ? JSON.parse(saved) : {
      enabled: true,
      reminderDays: [1, 3, 7],
      emailRecipients: ['admin@rubamindrc.com', 'manager@rubamindrc.com'],
      notifyOnUrgent: true,
      notifyOnOverdue: true,
      dailyDigest: false,
      digestTime: '09:00',
    };
  });
  const [newRecipient, setNewRecipient] = useState('');
  const [reminderEmail, setReminderEmail] = useState('');
  const [reminderMessage, setReminderMessage] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    type: 'Tender',
    date: '',
    priority: 'medium',
    status: 'active',
    description: '',
    assignedTo: '',
    department: '',
    details: '',
  });

  // Toast state
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);

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
    localStorage.setItem('deadlineNotificationSettings', JSON.stringify(notificationSettings));
  }, [notificationSettings]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const adminUser = JSON.parse(sessionStorage.getItem('adminUser') || '{"name": "Admin", "email": "admin@rubamindrc.com"}');

  const handleLogout = () => {
    sessionStorage.removeItem('adminLoggedIn');
    sessionStorage.removeItem('adminUser');
    navigate('/admin');
  };

  const showToast = (message: string, type: string) => {
    setToast({ message, type });
  };

  const calcDaysLeft = (dateStr: string) => {
    const target = new Date(dateStr);
    const now = new Date();
    const diff = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  // Calculate pending reminders
  const pendingReminders = deadlines.filter(d => 
    d.status === 'active' && 
    !d.reminderSent && 
    notificationSettings.reminderDays.some(days => d.daysLeft <= days)
  ).length;

  // Open send reminder modal
  const openSendReminderModal = (deadline: Deadline) => {
    setReminderDeadline(deadline);
    setReminderEmail(notificationSettings.emailRecipients[0] || '');
    setReminderMessage(`Reminder: "${deadline.title}" is due in ${deadline.daysLeft} day${deadline.daysLeft !== 1 ? 's' : ''} (${new Date(deadline.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}). Please ensure all necessary actions are completed before the deadline.`);
    setShowSendReminderModal(true);
  };

  // Send reminder
  const handleSendReminder = () => {
    if (!reminderDeadline || !reminderEmail.trim()) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }

    setDeadlines(prev =>
      prev.map(d =>
        d.id === reminderDeadline.id
          ? { ...d, reminderSent: true, reminderDate: new Date().toISOString() }
          : d
      )
    );

    showToast(`Reminder sent to ${reminderEmail} for "${reminderDeadline.title}"`, 'success');
    setShowSendReminderModal(false);
    setReminderDeadline(null);
  };

  // Send bulk reminders
  const handleSendBulkReminders = () => {
    const urgentDeadlines = deadlines.filter(d => 
      d.status === 'active' && 
      !d.reminderSent && 
      d.daysLeft <= 7
    );

    if (urgentDeadlines.length === 0) {
      showToast('No pending reminders to send.', 'error');
      return;
    }

    setDeadlines(prev =>
      prev.map(d =>
        urgentDeadlines.find(ud => ud.id === d.id)
          ? { ...d, reminderSent: true, reminderDate: new Date().toISOString() }
          : d
      )
    );

    showToast(`${urgentDeadlines.length} reminder(s) sent successfully!`, 'success');
  };

  // Add email recipient
  const addRecipient = () => {
    if (!newRecipient.trim() || !newRecipient.includes('@')) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }
    if (notificationSettings.emailRecipients.includes(newRecipient.trim())) {
      showToast('This email is already in the list.', 'error');
      return;
    }
    setNotificationSettings(prev => ({
      ...prev,
      emailRecipients: [...prev.emailRecipients, newRecipient.trim()],
    }));
    setNewRecipient('');
    showToast('Recipient added successfully!', 'success');
  };

  // Remove email recipient
  const removeRecipient = (email: string) => {
    setNotificationSettings(prev => ({
      ...prev,
      emailRecipients: prev.emailRecipients.filter(e => e !== email),
    }));
  };

  // Toggle reminder day
  const toggleReminderDay = (day: number) => {
    setNotificationSettings(prev => ({
      ...prev,
      reminderDays: prev.reminderDays.includes(day)
        ? prev.reminderDays.filter(d => d !== day)
        : [...prev.reminderDays, day].sort((a, b) => a - b),
    }));
  };

  const openCreateModal = () => {
    setIsEditing(false);
    setFormData({
      title: '',
      type: 'Tender',
      date: '',
      priority: 'medium',
      status: 'active',
      description: '',
      assignedTo: '',
      department: '',
      details: '',
    });
    setShowFormModal(true);
  };

  const openEditModal = (deadline: Deadline) => {
    setIsEditing(true);
    setSelectedDeadline(deadline);
    setFormData({
      title: deadline.title,
      type: deadline.type,
      date: deadline.date,
      priority: deadline.priority,
      status: deadline.status,
      description: deadline.description,
      assignedTo: deadline.assignedTo,
      department: deadline.department,
      details: deadline.details.join('\n'),
    });
    setShowFormModal(true);
  };

  const openDetailModal = (deadline: Deadline) => {
    setSelectedDeadline(deadline);
    setShowDetailModal(true);
  };

  const openDeleteModal = (deadline: Deadline) => {
    setSelectedDeadline(deadline);
    setShowDeleteModal(true);
  };

  const handleFormSubmit = () => {
    if (!formData.title.trim() || !formData.date || !formData.assignedTo.trim() || !formData.department.trim()) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }

    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });

    if (isEditing && selectedDeadline) {
      setDeadlines(prev =>
        prev.map(d =>
          d.id === selectedDeadline.id
            ? {
                ...d,
                title: formData.title,
                type: formData.type,
                date: formData.date,
                daysLeft: calcDaysLeft(formData.date),
                priority: formData.priority,
                status: formData.status,
                description: formData.description,
                assignedTo: formData.assignedTo,
                department: formData.department,
                details: formData.details.split('\n').filter(line => line.trim()),
                updatedAt: dateStr,
              }
            : d
        )
      );
      showToast('Deadline updated successfully!', 'success');
    } else {
      const newDeadline: Deadline = {
        id: Math.max(...deadlines.map(d => d.id), 0) + 1,
        title: formData.title,
        type: formData.type,
        date: formData.date,
        daysLeft: calcDaysLeft(formData.date),
        priority: formData.priority,
        status: formData.status,
        description: formData.description,
        assignedTo: formData.assignedTo,
        department: formData.department,
        details: formData.details.split('\n').filter(line => line.trim()),
        createdAt: dateStr,
        updatedAt: dateStr,
      };
      setDeadlines(prev => [newDeadline, ...prev]);
      showToast('Deadline created successfully!', 'success');
    }
    setShowFormModal(false);
  };

  const handleDelete = () => {
    if (selectedDeadline) {
      setDeadlines(prev => prev.filter(d => d.id !== selectedDeadline.id));
      showToast('Deadline deleted successfully!', 'success');
      setShowDeleteModal(false);
      setSelectedDeadline(null);
    }
  };

  const toggleStatus = (id: number) => {
    setDeadlines(prev =>
      prev.map(d =>
        d.id === id
          ? { ...d, status: d.status === 'active' ? 'completed' : 'active' }
          : d
      )
    );
  };

  const filteredDeadlines = deadlines.filter(d => {
    const typeMatch = typeFilter === 'all' || d.type === typeFilter;
    const priorityMatch = priorityFilter === 'all' || d.priority === priorityFilter;
    const statusMatch = statusFilter === 'all' || d.status === statusFilter;
    const searchMatch =
      deadlineSearch === '' ||
      d.title.toLowerCase().includes(deadlineSearch.toLowerCase()) ||
      d.assignedTo.toLowerCase().includes(deadlineSearch.toLowerCase()) ||
      d.department.toLowerCase().includes(deadlineSearch.toLowerCase());
    return typeMatch && priorityMatch && statusMatch && searchMatch;
  });

  const totalPages = Math.ceil(filteredDeadlines.length / itemsPerPage);
  const paginatedDeadlines = filteredDeadlines.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const resetFilters = () => {
    setTypeFilter('all');
    setPriorityFilter('all');
    setStatusFilter('all');
    setDeadlineSearch('');
    setCurrentPage(1);
  };

  const urgentCount = deadlines.filter(d => d.priority === 'urgent' && d.status === 'active').length;
  const overdueCount = deadlines.filter(d => d.daysLeft < 0 && d.status === 'active').length;
  const activeCount = deadlines.filter(d => d.status === 'active').length;
  const completedCount = deadlines.filter(d => d.status === 'completed').length;

  // ... existing code ...

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'urgent': return darkMode ? 'text-red-400 bg-red-600/20' : 'text-red-600 bg-red-50';
      case 'high': return darkMode ? 'text-orange-400 bg-orange-500/20' : 'text-orange-600 bg-orange-50';
      case 'medium': return darkMode ? 'text-yellow-400 bg-yellow-500/20' : 'text-yellow-600 bg-yellow-50';
      default: return darkMode ? 'text-green-400 bg-green-500/20' : 'text-green-600 bg-green-50';
    }
  };

  const getTypeStyle = (type: string) => {
    switch (type) {
      case 'Tender': return darkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-50 text-blue-600';
      case 'Job': return darkMode ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-50 text-purple-600';
      case 'Report': return darkMode ? 'bg-teal-500/20 text-teal-400' : 'bg-teal-50 text-teal-600';
      default: return darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-100 text-gray-600';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Tender': return 'ri-auction-line';
      case 'Job': return 'ri-briefcase-line';
      case 'Report': return 'ri-file-chart-line';
      default: return 'ri-calendar-line';
    }
  };

  const getStatusStyle = (status: string) => {
    return status === 'completed'
      ? darkMode ? 'text-green-400 bg-green-500/20' : 'text-green-600 bg-green-50'
      : darkMode ? 'text-blue-400 bg-blue-500/20' : 'text-blue-600 bg-blue-50';
  };

  const sidebarItems = [
    { label: 'Dashboard', icon: 'ri-dashboard-3-line', path: '/admin/dashboard' },
    { label: 'Pages', icon: 'ri-file-list-3-line', path: '/admin/dashboard/pages' },
    { label: 'Media Center', icon: 'ri-newspaper-line', path: '/admin/dashboard/media-center', badge: 5 },
    { label: 'Jobs', icon: 'ri-briefcase-line', path: '/admin/dashboard/jobs', badge: 3 },
    { label: 'Gallery', icon: 'ri-gallery-line', path: '/admin/dashboard/gallery' },
    { label: 'Resources Center', icon: 'ri-folder-line', path: '/admin/dashboard/resources', badge: 7 },
    { label: 'Inquiries', icon: 'ri-mail-line', path: '/admin/dashboard/inquiries', badge: 8 },
    { label: 'Notifications', icon: 'ri-notification-3-line', path: '/admin/dashboard/notifications', badge: 4 },
    { label: 'Tasks', icon: 'ri-task-line', path: '/admin/dashboard/tasks', badge: 12 },
    { label: 'Deadlines', icon: 'ri-calendar-todo-line', path: '/admin/dashboard/deadlines', badge: activeCount },
    { label: 'Settings', icon: 'ri-settings-3-line', path: '/admin/dashboard/settings' },
  ];

  const breadcrumbs = [
    { label: 'Home', path: '/', icon: 'ri-home-4-line' },
    { label: 'Admin', path: '/admin' },
    { label: 'Dashboard', path: '/admin/dashboard' },
    { label: 'Deadlines', path: '/admin/dashboard/deadlines' },
  ];

  return (
    <div className={`min-h-screen flex ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-6 right-6 z-[100] animate-slide-in">
          <div className={`flex items-center gap-3 px-5 py-3.5 rounded-lg shadow-xl border ${
            toast.type === 'success'
              ? darkMode ? 'bg-green-900/90 border-green-700 text-green-200' : 'bg-green-50 border-green-200 text-green-800'
              : darkMode ? 'bg-red-900/90 border-red-700 text-red-200' : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            <i className={`${toast.type === 'success' ? 'ri-checkbox-circle-fill' : 'ri-error-warning-fill'} text-lg`} />
            <span className="text-sm font-medium">{toast.message}</span>
            <button onClick={() => setToast(null)} className="ml-2 cursor-pointer opacity-70 hover:opacity-100">
              <i className="ri-close-line" />
            </button>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside className={`${sidebarCollapsed ? 'w-20' : 'w-64'} ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r flex flex-col fixed h-full transition-all duration-300 z-20`}>
        <div className={`p-5 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between`}>
          <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className={`flex items-center gap-3 ${sidebarCollapsed ? 'justify-center' : ''} cursor-pointer`}>
            <img src="https://static.readdy.ai/image/1b404af276821d98dfecb0eec592fbd4/2beca25c2dca50fd1a3109512ef52e33.png" alt="Logo" className="h-10 w-10 object-contain" />
            {!sidebarCollapsed && <span className={`text-xl font-bold tracking-wide ${darkMode ? 'text-white' : 'text-[#2C3E50]'}`}>RUBAMIN</span>}
          </button>
          {!sidebarCollapsed && (
            <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className={`w-8 h-8 flex items-center justify-center rounded-lg ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'} cursor-pointer transition-colors`}>
              <i className="ri-menu-fold-line text-lg" />
            </button>
          )}
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {sidebarItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all relative ${isActive ? 'bg-red-600 text-white shadow-md' : darkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'} ${sidebarCollapsed ? 'justify-center' : ''}`} title={sidebarCollapsed ? item.label : ''}>
                <i className={`${item.icon} text-lg`} />
                {!sidebarCollapsed && (
                  <>
                    <span className="flex-1">{item.label}</span>
                    {item.badge && item.badge > 0 && (
                      <span className={`min-w-5 h-5 flex items-center justify-center px-1.5 text-xs font-bold rounded-full ${isActive ? 'bg-white text-red-600' : 'bg-red-600 text-white'}`}>{item.badge}</span>
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
            <div className="flex-1 max-w-xl">
              <div className="relative">
                <i className={`ri-search-line absolute left-4 top-1/2 -translate-y-1/2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search pages, media, jobs..." className={`w-full pl-11 pr-4 py-2.5 ${darkMode ? 'bg-gray-700 text-white placeholder-gray-400 border-gray-600' : 'bg-gray-50 text-gray-900 placeholder-gray-500 border-gray-200'} border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all`} />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setDarkMode(!darkMode)} 
                className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all cursor-pointer ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}
                title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                <i className={`${darkMode ? 'ri-sun-line' : 'ri-moon-line'} text-lg`} />
              </button>
              <Link to="/admin/dashboard/notifications" className={`relative w-10 h-10 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}>
                <i className={`ri-notification-3-line text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-600 rounded-full" />
              </Link>
              <div className={`hidden md:flex flex-col items-end px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <p className={`text-xs font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{currentTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
              <Link to="/" target="_blank" className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white hover:bg-red-700 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap">
                <i className="ri-external-link-line" />
                View Site
              </Link>
              <div className="relative" ref={profileDropdownRef}>
                <button onClick={() => setProfileDropdownOpen(!profileDropdownOpen)} className={`w-10 h-10 rounded-lg flex items-center justify-center cursor-pointer overflow-hidden transition-all ${profileDropdownOpen ? 'ring-2 ring-red-600 ring-offset-2' : ''}`}>
                  <img 
                    src="https://readdy.ai/api/search-image?query=professional%20business%20person%20headshot%20portrait%20in%20formal%20attire%20with%20neutral%20background%20corporate%20style%20high%20quality%20photography%20clean%20simple%20background%20professional%20lighting%20confident%20expression&width=200&height=200&seq=admin-user-profile-pic&orientation=squarish"
                    alt={adminUser.name}
                    className="w-full h-full object-cover"
                  />
                </button>
                {profileDropdownOpen && (
                  <div className={`absolute right-0 top-full mt-2 w-56 rounded-lg shadow-lg border overflow-hidden z-50 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <div className={`px-4 py-3 border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                      <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{adminUser.name}</p>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{adminUser.email}</p>
                    </div>
                    <div className="py-1">
                      <Link to="/admin/dashboard/profile" className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors cursor-pointer ${darkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-700 hover:bg-gray-50'}`}>
                        <i className="ri-user-line" />
                        My Profile
                      </Link>
                      <Link to="/admin/dashboard/settings" className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors cursor-pointer ${darkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-700 hover:bg-gray-50'}`}>
                        <i className="ri-settings-3-line" />
                        Account Settings
                      </Link>
                      <button className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors cursor-pointer ${darkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-700 hover:bg-gray-50'}`}>
                        <i className="ri-lock-password-line" />
                        Change Password
                      </button>
                    </div>
                    <div className={`border-t py-1 ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                      <button onClick={handleLogout} className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors cursor-pointer ${darkMode ? 'text-red-400 hover:bg-red-600/10' : 'text-red-600 hover:bg-red-50'}`}>
                        <i className="ri-logout-box-line" />Sign Out
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
                  <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{crumb.icon && <i className={`${crumb.icon} mr-1.5`} />}{crumb.label}</span>
                ) : (
                  <Link to={crumb.path} className={`flex items-center transition-colors cursor-pointer ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}>{crumb.icon && <i className={`${crumb.icon} mr-1.5`} />}{crumb.label}</Link>
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
                Deadlines Management
              </h1>
              <p className={`mt-2 text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Create, track, and manage all upcoming deadlines across departments
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowNotificationSettings(true)}
                className={`relative flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap border ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600' 
                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <i className="ri-mail-settings-line text-lg" />
                Email Reminders
                {pendingReminders > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 flex items-center justify-center px-1.5 text-xs font-bold rounded-full bg-red-600 text-white">
                    {pendingReminders}
                  </span>
                )}
              </button>
              <button
                onClick={openCreateModal}
                className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white hover:bg-red-700 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap shadow-md"
              >
                <i className="ri-add-line text-lg" />
                New Deadline
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
            {[
              { label: 'Total Active', value: activeCount, icon: 'ri-calendar-check-line', color: darkMode ? 'text-blue-400 bg-blue-500/20' : 'text-blue-600 bg-blue-50' },
              { label: 'Urgent', value: urgentCount, icon: 'ri-alarm-warning-line', color: darkMode ? 'text-red-400 bg-red-600/20' : 'text-red-600 bg-red-50' },
              { label: 'Overdue', value: overdueCount, icon: 'ri-time-line', color: darkMode ? 'text-orange-400 bg-orange-500/20' : 'text-orange-600 bg-orange-50' },
              { label: 'Completed', value: completedCount, icon: 'ri-checkbox-circle-line', color: darkMode ? 'text-green-400 bg-green-500/20' : 'text-green-600 bg-green-50' },
              { label: 'Pending Reminders', value: pendingReminders, icon: 'ri-mail-send-line', color: darkMode ? 'text-purple-400 bg-purple-500/20' : 'text-purple-600 bg-purple-50' },
            ].map((stat, i) => (
              <div key={i} className={`rounded-lg p-5 border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color}`}>
                    <i className={`${stat.icon} text-xl`} />
                  </div>
                  <div>
                    <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'Merriweather, serif' }}>{stat.value}</p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Filters Card */}
          <div className={`rounded-lg p-6 border mb-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <i className={`ri-search-line absolute left-3 top-1/2 -translate-y-1/2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                  <input type="text" value={deadlineSearch} onChange={(e) => { setDeadlineSearch(e.target.value); setCurrentPage(1); }} placeholder="Search deadlines..." className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-red-600 ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500'}`} />
                </div>
              </div>
              <div className="relative">
                <select value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setCurrentPage(1); }} className={`appearance-none pl-3 pr-10 py-2.5 text-sm rounded-lg border cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-600 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}>
                  <option value="all">All Types</option>
                  <option value="Tender">Tender</option>
                  <option value="Job">Job</option>
                  <option value="Report">Report</option>
                </select>
                <i className={`ri-arrow-down-s-line absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              </div>
              <div className="relative">
                <select value={priorityFilter} onChange={(e) => { setPriorityFilter(e.target.value); setCurrentPage(1); }} className={`appearance-none pl-3 pr-10 py-2.5 text-sm rounded-lg border cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-600 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}>
                  <option value="all">All Priorities</option>
                  <option value="urgent">Urgent</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
                <i className={`ri-arrow-down-s-line absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              </div>
              <div className="relative">
                <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }} className={`appearance-none pl-3 pr-10 py-2.5 text-sm rounded-lg border cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-600 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}>
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                </select>
                <i className={`ri-arrow-down-s-line absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              </div>
              {(typeFilter !== 'all' || priorityFilter !== 'all' || statusFilter !== 'all' || deadlineSearch !== '') && (
                <button onClick={resetFilters} className={`flex items-center gap-1.5 px-4 py-2.5 text-sm rounded-lg transition-colors cursor-pointer ${darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}>
                  <i className="ri-close-line" />Clear All
                </button>
              )}
            </div>
            <div className={`mt-4 pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Showing <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{filteredDeadlines.length}</span> deadlines
              </p>
            </div>
          </div>

          {/* Deadlines Table */}
          <div className={`rounded-lg border overflow-hidden ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className={`grid grid-cols-12 gap-4 px-6 py-4 text-xs font-semibold uppercase tracking-wider border-b ${darkMode ? 'bg-gray-700/50 border-gray-700 text-gray-400' : 'bg-gray-50 border-gray-200 text-gray-500'}`}>
              <div className="col-span-3">Deadline</div>
              <div className="col-span-1">Type</div>
              <div className="col-span-2">Assigned To</div>
              <div className="col-span-1">Priority</div>
              <div className="col-span-1">Status</div>
              <div className="col-span-2">Due Date</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            <div className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
              {paginatedDeadlines.length > 0 ? (
                paginatedDeadlines.map((deadline) => (
                  <div
                    key={deadline.id}
                    className={`grid grid-cols-12 gap-4 px-6 py-4 items-center transition-colors ${
                      darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'
                    } ${deadline.daysLeft <= 3 && deadline.status === 'active' ? 'border-l-4 border-l-red-500' : ''}`}
                  >
                    <div className="col-span-3 flex items-center gap-3 min-w-0">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                        <i className={`${getTypeIcon(deadline.type)} text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                      </div>
                      <div className="min-w-0">
                        <button onClick={() => openDetailModal(deadline)} className={`text-sm font-medium truncate block text-left cursor-pointer hover:underline ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {deadline.title}
                        </button>
                        <p className={`text-xs truncate ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{deadline.department}</p>
                      </div>
                    </div>
                    <div className="col-span-1">
                      <span className={`text-xs px-2 py-1 rounded-md font-medium ${getTypeStyle(deadline.type)}`}>{deadline.type}</span>
                    </div>
                    <div className="col-span-2">
                      <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{deadline.assignedTo}</span>
                    </div>
                    <div className="col-span-1">
                      <span className={`text-xs px-2 py-1 rounded-md font-semibold capitalize ${getPriorityStyle(deadline.priority)}`}>{deadline.priority}</span>
                    </div>
                    <div className="col-span-1">
                      <button onClick={() => toggleStatus(deadline.id)} className="cursor-pointer">
                        <span className={`text-xs px-2 py-1 rounded-md font-medium capitalize ${getStatusStyle(deadline.status)}`}>{deadline.status}</span>
                      </button>
                    </div>
                    <div className="col-span-2">
                      <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {new Date(deadline.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                      <p className={`text-xs font-semibold ${
                        deadline.daysLeft <= 3 ? darkMode ? 'text-red-400' : 'text-red-600'
                          : deadline.daysLeft <= 7 ? darkMode ? 'text-orange-400' : 'text-orange-600'
                          : darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {deadline.daysLeft < 0 ? `${Math.abs(deadline.daysLeft)}d overdue` : `${deadline.daysLeft}d left`}
                      </p>
                    </div>
                    <div className="col-span-2 flex items-center justify-end gap-2">
                      <button 
                        onClick={() => openSendReminderModal(deadline)} 
                        className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                          deadline.reminderSent 
                            ? darkMode ? 'text-green-400 bg-green-500/20' : 'text-green-600 bg-green-50'
                            : darkMode ? 'hover:bg-gray-600 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'
                        }`} 
                        title={deadline.reminderSent ? 'Reminder Sent' : 'Send Reminder'}
                      >
                        <i className={deadline.reminderSent ? 'ri-mail-check-line' : 'ri-mail-send-line'} />
                      </button>
                      <button onClick={() => openDetailModal(deadline)} className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${darkMode ? 'hover:bg-gray-600 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'}`} title="View Details">
                        <i className="ri-eye-line" />
                      </button>
                      <button onClick={() => openEditModal(deadline)} className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${darkMode ? 'hover:bg-gray-600 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'}`} title="Edit">
                        <i className="ri-edit-line" />
                      </button>
                      <button onClick={() => openDeleteModal(deadline)} className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${darkMode ? 'hover:bg-red-600/20 text-gray-400 hover:text-red-400' : 'hover:bg-red-50 text-gray-500 hover:text-red-600'}`} title="Delete">
                        <i className="ri-delete-bin-line" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className={`text-center py-16 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <i className="ri-calendar-line text-5xl mb-4 block" />
                  <p className="text-lg font-medium">No deadlines found</p>
                  <p className="text-sm mt-1">Try adjusting your filters or create a new deadline</p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {filteredDeadlines.length > itemsPerPage && (
              <div className={`flex items-center justify-between px-6 py-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredDeadlines.length)} of {filteredDeadlines.length}
                </p>
                <div className="flex items-center gap-2">
                  <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className={`w-9 h-9 flex items-center justify-center rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}>
                    <i className="ri-skip-back-line" />
                  </button>
                  <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className={`w-9 h-9 flex items-center justify-center rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}>
                    <i className="ri-arrow-left-s-line" />
                  </button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) pageNum = i + 1;
                    else if (currentPage <= 3) pageNum = i + 1;
                    else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                    else pageNum = currentPage - 2 + i;
                    return (
                      <button key={pageNum} onClick={() => setCurrentPage(pageNum)} className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors cursor-pointer ${currentPage === pageNum ? 'bg-red-600 text-white' : darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}>{pageNum}</button>
                    );
                  })}
                  <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className={`w-9 h-9 flex items-center justify-center rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}>
                    <i className="ri-arrow-right-s-line" />
                  </button>
                  <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} className={`w-9 h-9 flex items-center justify-center rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}>
                    <i className="ri-skip-forward-line" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Create / Edit Modal */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowFormModal(false)}>
          <div className={`w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`} onClick={(e) => e.stopPropagation()}>
            <div className={`px-6 py-4 border-b flex items-center justify-between ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${darkMode ? 'bg-red-600/20' : 'bg-red-50'}`}>
                  <i className={`${isEditing ? 'ri-edit-line' : 'ri-add-line'} text-lg ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
                </div>
                <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'Merriweather, serif' }}>
                  {isEditing ? 'Edit Deadline' : 'Create New Deadline'}
                </h3>
              </div>
              <button onClick={() => setShowFormModal(false)} className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-gray-500'}`}>
                <i className="ri-close-line text-xl" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-5 max-h-[65vh] overflow-y-auto">
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Title <span className="text-red-500">*</span></label>
                <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Enter deadline title" className={`w-full px-4 py-2.5 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-red-600 ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500'}`} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Type</label>
                  <div className="relative">
                    <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className={`w-full appearance-none px-4 py-2.5 text-sm rounded-lg border cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-600 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}>
                      <option value="Tender">Tender</option>
                      <option value="Job">Job</option>
                      <option value="Report">Report</option>
                    </select>
                    <i className={`ri-arrow-down-s-line absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  </div>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Priority</label>
                  <div className="relative">
                    <select value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value })} className={`w-full appearance-none px-4 py-2.5 text-sm rounded-lg border cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-600 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}>
                      <option value="urgent">Urgent</option>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                    <i className={`ri-arrow-down-s-line absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Due Date <span className="text-red-500">*</span></label>
                  <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className={`w-full px-4 py-2.5 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-red-600 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`} />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Status</label>
                  <div className="relative">
                    <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className={`w-full appearance-none px-4 py-2.5 text-sm rounded-lg border cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-600 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}>
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                    </select>
                    <i className={`ri-arrow-down-s-line absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Assigned To <span className="text-red-500">*</span></label>
                  <input type="text" value={formData.assignedTo} onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })} placeholder="e.g. HR Department" className={`w-full px-4 py-2.5 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-red-600 ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500'}`} />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Department <span className="text-red-500">*</span></label>
                  <input type="text" value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} placeholder="e.g. Operations" className={`w-full px-4 py-2.5 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-red-600 ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500'}`} />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value.slice(0, 500) })} placeholder="Describe the deadline..." rows={3} maxLength={500} className={`w-full px-4 py-2.5 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-red-600 resize-none ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500'}`} />
                <p className={`text-xs mt-1 text-right ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{formData.description.length}/500</p>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Notes / Details <span className={`font-normal ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>(one per line)</span></label>
                <textarea value={formData.details} onChange={(e) => setFormData({ ...formData, details: e.target.value.slice(0, 500) })} placeholder="Enter notes, one per line..." rows={3} maxLength={500} className={`w-full px-4 py-2.5 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-red-600 resize-none ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500'}`} />
                <p className={`text-xs mt-1 text-right ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{formData.details.length}/500</p>
              </div>
            </div>

            <div className={`px-6 py-4 border-t flex items-center justify-end gap-3 ${darkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50'}`}>
              <button onClick={() => setShowFormModal(false)} className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-200'}`}>Cancel</button>
              <button onClick={handleFormSubmit} className="px-5 py-2.5 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer whitespace-nowrap shadow-md">
                <i className={`${isEditing ? 'ri-save-line' : 'ri-add-line'} mr-1.5`} />
                {isEditing ? 'Save Changes' : 'Create Deadline'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedDeadline && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowDetailModal(false)}>
          <div className={`w-full max-w-lg rounded-xl shadow-2xl overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`} onClick={(e) => e.stopPropagation()}>
            <div className={`px-6 py-4 border-b flex items-center justify-between ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getTypeStyle(selectedDeadline.type)}`}>
                  <i className={`${getTypeIcon(selectedDeadline.type)} text-lg`} />
                </div>
                <div>
                  <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'Merriweather, serif' }}>Deadline Details</h3>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Created: {selectedDeadline.createdAt}</p>
                </div>
              </div>
              <button onClick={() => setShowDetailModal(false)} className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-gray-500'}`}>
                <i className="ri-close-line text-xl" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-5 max-h-[60vh] overflow-y-auto">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${getTypeStyle(selectedDeadline.type)}`}>{selectedDeadline.type}</span>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-md capitalize ${getPriorityStyle(selectedDeadline.priority)}`}>{selectedDeadline.priority} Priority</span>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-md capitalize ${getStatusStyle(selectedDeadline.status)}`}>{selectedDeadline.status}</span>
                {selectedDeadline.reminderSent && (
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${darkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-50 text-green-600'}`}>
                    <i className="ri-mail-check-line mr-1" />Reminder Sent
                  </span>
                )}
              </div>

              <div>
                <h4 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedDeadline.title}</h4>
                <p className={`text-sm mt-1 flex items-center gap-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <i className="ri-time-line" />
                  {selectedDeadline.daysLeft < 0 ? `${Math.abs(selectedDeadline.daysLeft)} days overdue` : `${selectedDeadline.daysLeft} days remaining`}
                </p>
              </div>

              <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{selectedDeadline.description}</p>
              </div>

              {selectedDeadline.details.length > 0 && (
                <div>
                  <h5 className={`text-sm font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Notes & Details</h5>
                  <ul className="space-y-2">
                    {selectedDeadline.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <i className={`ri-checkbox-circle-fill text-sm mt-0.5 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                        <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className={`grid grid-cols-2 gap-4 p-4 rounded-lg border ${darkMode ? 'bg-gray-700/30 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                <div>
                  <p className={`text-xs font-medium mb-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Assigned To</p>
                  <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedDeadline.assignedTo}</p>
                </div>
                <div>
                  <p className={`text-xs font-medium mb-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Department</p>
                  <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedDeadline.department}</p>
                </div>
                <div>
                  <p className={`text-xs font-medium mb-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Due Date</p>
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{new Date(selectedDeadline.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                </div>
                <div>
                  <p className={`text-xs font-medium mb-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Last Updated</p>
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{selectedDeadline.updatedAt}</p>
                </div>
              </div>
            </div>

            <div className={`px-6 py-4 border-t flex items-center justify-end gap-3 ${darkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50'}`}>
              <button onClick={() => setShowDetailModal(false)} className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-200'}`}>Close</button>
              <button onClick={() => { setShowDetailModal(false); openSendReminderModal(selectedDeadline); }} className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap border ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-200 text-gray-700 hover:bg-gray-100'}`}>
                <i className="ri-mail-send-line mr-1.5" />Send Reminder
              </button>
              <button onClick={() => { setShowDetailModal(false); openEditModal(selectedDeadline); }} className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer whitespace-nowrap">
                <i className="ri-edit-line mr-1.5" />Edit Deadline
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedDeadline && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)}>
          <div className={`w-full max-w-md rounded-xl shadow-2xl overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`} onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-6 text-center">
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${darkMode ? 'bg-red-600' : 'bg-red-50'}`}>
                <i className={`ri-delete-bin-line text-3xl ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
              </div>
              <h3 className={`text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'Merriweather, serif' }}>Delete Deadline</h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Are you sure you want to delete <strong className={darkMode ? 'text-white' : 'text-gray-900'}>{selectedDeadline.title}</strong>? This action cannot be undone.
              </p>
            </div>
            <div className={`px-6 py-4 border-t flex items-center justify-center gap-3 ${darkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50'}`}>
              <button onClick={() => setShowDeleteModal(false)} className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${darkMode ? 'text-gray-300 hover:bg-gray-700 bg-gray-700/50' : 'text-gray-700 hover:bg-gray-200 bg-gray-100'}`}>Cancel</button>
              <button onClick={handleDelete} className="px-5 py-2.5 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer whitespace-nowrap">
                <i className="ri-delete-bin-line mr-1.5" />Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Email Notification Settings Modal */}
      {showNotificationSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowNotificationSettings(false)}>
          <div className={`w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`} onClick={(e) => e.stopPropagation()}>
            <div className={`px-6 py-4 border-b flex items-center justify-between ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${darkMode ? 'bg-purple-500/20' : 'bg-purple-50'}`}>
                  <i className={`ri-mail-settings-line text-lg ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                </div>
                <div>
                  <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'Merriweather, serif' }}>
                    Email Notification Settings
                  </h3>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Configure deadline reminder notifications</p>
                </div>
              </div>
              <button onClick={() => setShowNotificationSettings(false)} className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-gray-500'}`}>
                <i className="ri-close-line text-xl" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-6 max-h-[65vh] overflow-y-auto">
              {/* Enable Notifications Toggle */}
              <div className={`flex items-center justify-between p-4 rounded-lg border ${darkMode ? 'bg-gray-700/50 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${notificationSettings.enabled ? darkMode ? 'bg-green-500/20' : 'bg-green-50' : darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                    <i className={`ri-mail-line text-lg ${notificationSettings.enabled ? darkMode ? 'text-green-400' : 'text-green-600' : darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Email Notifications</p>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Receive email reminders for upcoming deadlines</p>
                  </div>
                </div>
                <button
                  onClick={() => setNotificationSettings(prev => ({ ...prev, enabled: !prev.enabled }))}
                  className={`relative w-10 h-6 rounded-full transition-colors cursor-pointer ${notificationSettings.enabled ? 'bg-green-500' : darkMode ? 'bg-gray-600' : 'bg-gray-300'}`}
                >
                  <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${notificationSettings.enabled ? 'left-7' : 'left-1'}`} />
                </button>
              </div>

              {/* Reminder Timing */}
              <div>
                <h4 className={`text-sm font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  <i className="ri-time-line mr-2" />
                  Reminder Timing
                </h4>
                <p className={`text-xs mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Select when to send reminder emails before deadlines</p>
                <div className="flex flex-wrap gap-2">
                  {[1, 3, 5, 7, 14, 30].map(day => (
                    <button
                      key={day}
                      onClick={() => toggleReminderDay(day)}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                        notificationSettings.reminderDays.includes(day)
                          ? 'bg-red-600'
                          : darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {day} day{day !== 1 ? 's' : ''} before
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <h4 className={`text-sm font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  <i className="ri-flashlight-line mr-2" />
                  Quick Actions
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleSendBulkReminders}
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all cursor-pointer border ${
                      darkMode ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600' : 'bg-white border-gray-200 text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <i className="ri-send-plane-line" />
                    Send All Pending ({pendingReminders})
                  </button>
                  <button
                    onClick={() => {
                      setDeadlines(prev => prev.map(d => ({ ...d, reminderSent: false, reminderDate: undefined })));
                      showToast('All reminder statuses have been reset.', 'success');
                    }}
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all cursor-pointer border ${
                      darkMode ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600' : 'bg-white border-gray-200 text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <i className="ri-refresh-line" />
                    Reset All Reminders
                  </button>
                </div>
              </div>

              {/* Notification Preferences */}
              <div>
                <h4 className={`text-sm font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  <i className="ri-settings-3-line mr-2" />
                  Notification Preferences
                </h4>
                <div className="space-y-3">
                  {[
                    { key: 'notifyOnUrgent', label: 'Urgent deadline alerts', desc: 'Get notified immediately for urgent priority deadlines', icon: 'ri-alarm-warning-line' },
                    { key: 'notifyOnOverdue', label: 'Overdue notifications', desc: 'Receive alerts when deadlines become overdue', icon: 'ri-error-warning-line' },
                    { key: 'dailyDigest', label: 'Daily digest email', desc: 'Receive a summary of all upcoming deadlines each morning', icon: 'ri-calendar-line' },
                  ].map(pref => (
                    <div key={pref.key} className={`flex items-center justify-between p-3 rounded-lg border ${darkMode ? 'bg-gray-700/30 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                      <div className="flex items-center gap-3">
                        <i className={`${pref.icon} text-lg ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        <div>
                          <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{pref.label}</p>
                          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{pref.desc}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setNotificationSettings(prev => ({ ...prev, [pref.key]: !(prev as Record<string, boolean | number[] | string[] | string>)[pref.key] }))}
                        className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${(notificationSettings as Record<string, boolean | number[] | string[] | string>)[pref.key] ? 'bg-red-600' : darkMode ? 'bg-gray-600' : 'bg-gray-300'}`}
                      >
                        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${(notificationSettings as Record<string, boolean | number[] | string[] | string>)[pref.key] ? 'left-5' : 'left-0.5'}`} />
                      </button>
                    </div>
                  ))}
                </div>

                {notificationSettings.dailyDigest && (
                  <div className={`mt-3 p-3 rounded-lg border ${darkMode ? 'bg-gray-700/30 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Digest delivery time</label>
                    <input
                      type="time"
                      value={notificationSettings.digestTime}
                      onChange={(e) => setNotificationSettings(prev => ({ ...prev, digestTime: e.target.value }))}
                      className={`px-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-red-600 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                    />
                  </div>
                )}
              </div>

              {/* Email Recipients */}
              <div>
                <h4 className={`text-sm font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  <i className="ri-group-line mr-2" />
                  Email Recipients
                </h4>
                <p className={`text-xs mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Add email addresses to receive deadline reminders</p>
                
                <div className="flex gap-2 mb-3">
                  <input
                    type="email"
                    value={newRecipient}
                    onChange={(e) => setNewRecipient(e.target.value)}
                    placeholder="Enter email address"
                    className={`flex-1 px-4 py-2.5 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-red-600 ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500'}`}
                    onKeyDown={(e) => e.key === 'Enter' && addRecipient()}
                  />
                  <button
                    onClick={addRecipient}
                    className="px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer whitespace-nowrap text-sm font-medium"
                  >
                    <i className="ri-add-line mr-1" />
                    Add
                  </button>
                </div>

                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {notificationSettings.emailRecipients.length > 0 ? (
                    notificationSettings.emailRecipients.map((email, idx) => (
                      <div key={idx} className={`flex items-center justify-between px-3 py-2.5 rounded-lg border ${darkMode ? 'bg-gray-700/50 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                        <div className="flex items-center gap-2">
                          <i className={`ri-mail-line ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                          <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{email}</span>
                        </div>
                        <button
                          onClick={() => removeRecipient(email)}
                          className={`w-7 h-7 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${darkMode ? 'hover:bg-red-600/20 text-gray-400 hover:text-red-400' : 'hover:bg-red-50 text-gray-500 hover:text-red-600'}`}
                        >
                          <i className="ri-close-line" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className={`text-center py-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      <i className="ri-mail-line text-2xl mb-2 block" />
                      <p className="text-sm">No recipients added yet</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className={`px-6 py-4 border-t flex items-center justify-between ${darkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50'}`}>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <i className="ri-information-line mr-1" />
                Settings are saved automatically
              </p>
              <button onClick={() => setShowNotificationSettings(false)} className="px-5 py-2.5 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer whitespace-nowrap">
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Send Reminder Modal */}
      {showSendReminderModal && reminderDeadline && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowSendReminderModal(false)}>
          <div className={`w-full max-w-lg rounded-xl shadow-2xl overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`} onClick={(e) => e.stopPropagation()}>
            <div className={`px-6 py-4 border-b flex items-center justify-between ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${darkMode ? 'bg-blue-500/20' : 'bg-blue-50'}`}>
                  <i className={`ri-mail-send-line text-lg ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                </div>
                <div>
                  <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'Merriweather, serif' }}>
                    Send Reminder
                  </h3>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Send email notification for this deadline</p>
                </div>
              </div>
              <button onClick={() => setShowSendReminderModal(false)} className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-gray-500'}`}>
                <i className="ri-close-line text-xl" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-5">
              <div className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-700/50 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center gap-3 mb-2">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-md ${getTypeStyle(reminderDeadline.type)}`}>{reminderDeadline.type}</span>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-md capitalize ${getPriorityStyle(reminderDeadline.priority)}`}>{reminderDeadline.priority}</span>
                </div>
                <h4 className={`text-base font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{reminderDeadline.title}</h4>
                <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Due: {new Date(reminderDeadline.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} ({reminderDeadline.daysLeft} days left)
                </p>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Send to <span className="text-red-500">*</span>
                </label>
                {notificationSettings.emailRecipients.length > 0 && (
                  <div className="relative mb-2">
                    <select
                      value={reminderEmail}
                      onChange={(e) => setReminderEmail(e.target.value)}
                      className={`w-full appearance-none px-4 py-2.5 text-sm rounded-lg border cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-600 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                    >
                      {notificationSettings.emailRecipients.map(email => (
                        <option key={email} value={email}>{email}</option>
                      ))}
                    </select>
                    <i className={`ri-arrow-down-s-line absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  </div>
                )}
                <p className={`text-xs mb-1.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Or enter a custom email:
                </p>
                <input
                  type="email"
                  value={reminderEmail}
                  onChange={(e) => setReminderEmail(e.target.value)}
                  placeholder="custom@email.com"
                  className={`w-full px-4 py-2.5 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-red-600 ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500'}`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Message</label>
                <textarea
                  value={reminderMessage}
                  onChange={(e) => setReminderMessage(e.target.value.slice(0, 500))}
                  rows={4}
                  maxLength={500}
                  className={`w-full px-4 py-2.5 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-red-600 resize-none ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500'}`}
                />
                <p className={`text-xs mt-1 text-right ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{reminderMessage.length}/500</p>
              </div>
            </div>

            <div className={`px-6 py-4 border-t flex items-center justify-end gap-3 ${darkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50'}`}>
              <button onClick={() => setShowSendReminderModal(false)} className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-200'}`}>Cancel</button>
              <button onClick={handleSendReminder} className="px-5 py-2.5 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer whitespace-nowrap shadow-md">
                <i className="ri-send-plane-line mr-1.5" />
                Send Reminder
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slide-in {
          from { opacity: 0; transform: translateY(-12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-in { animation: slide-in 0.3s ease-out; }
      `}</style>
    </div>
  );
};

export default DeadlinesManagementPage;
