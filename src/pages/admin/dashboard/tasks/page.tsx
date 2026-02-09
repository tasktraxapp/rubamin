import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

interface Task {
  id: number;
  title: string;
  category: string;
  priority: string;
  status: string;
  dueDate: string;
  assignedTo: string;
  department: string;
  description: string;
  pendingItems: number;
  details: string[];
  createdAt: string;
  updatedAt: string;
}

const initialTasks: Task[] = [
  {
    id: 1,
    title: 'Review job applications',
    category: 'hr',
    priority: 'high',
    status: 'in-progress',
    dueDate: '2025-01-20',
    assignedTo: 'HR Department',
    department: 'Human Resources',
    description: 'Review and shortlist candidates for open Mining Engineer and Accountant positions.',
    pendingItems: 5,
    details: [
      '5 new applications received',
      'Mining Engineer: 3 applicants',
      'Accountant: 2 applicants',
      'Screening deadline approaching',
    ],
    createdAt: 'Jan 10, 2025',
    updatedAt: 'Jan 18, 2025',
  },
  {
    id: 2,
    title: 'Approve pending notices',
    category: 'content',
    priority: 'medium',
    status: 'pending',
    dueDate: '2025-01-22',
    assignedTo: 'Admin',
    department: 'Administration',
    description: 'Review and approve draft notices before publication on the website.',
    pendingItems: 3,
    details: [
      'Annual Report notice draft',
      'Board meeting announcement',
      'Holiday schedule update',
    ],
    createdAt: 'Jan 12, 2025',
    updatedAt: 'Jan 17, 2025',
  },
  {
    id: 3,
    title: 'Update financial reports',
    category: 'finance',
    priority: 'high',
    status: 'overdue',
    dueDate: '2025-01-18',
    assignedTo: 'Finance Team',
    department: 'Finance',
    description: 'Upload and publish the Q4 2024 financial statements and annual summary.',
    pendingItems: 1,
    details: [
      'Q4 2024 statement pending upload',
      'Annual summary needs review',
      'Audit report attachment required',
    ],
    createdAt: 'Jan 05, 2025',
    updatedAt: 'Jan 16, 2025',
  },
  {
    id: 4,
    title: 'Respond to inquiries',
    category: 'communication',
    priority: 'medium',
    status: 'in-progress',
    dueDate: '2025-01-21',
    assignedTo: 'Admin',
    department: 'Administration',
    description: 'Reply to pending contact form submissions and partnership inquiries.',
    pendingItems: 8,
    details: [
      '3 partnership requests',
      '2 media inquiries',
      '2 general questions',
      '1 complaint to address',
    ],
    createdAt: 'Jan 08, 2025',
    updatedAt: 'Jan 19, 2025',
  },
  {
    id: 5,
    title: 'Update gallery photos',
    category: 'content',
    priority: 'low',
    status: 'pending',
    dueDate: '2025-01-25',
    assignedTo: 'Media Team',
    department: 'Communications',
    description: 'Upload new facility and event photos to the gallery section.',
    pendingItems: 4,
    details: [
      'New facility photos from site visit',
      'Training event coverage',
      'CSR activity documentation',
      'Optimize existing image sizes',
    ],
    createdAt: 'Jan 14, 2025',
    updatedAt: 'Jan 18, 2025',
  },
  {
    id: 6,
    title: 'Review tender submissions',
    category: 'procurement',
    priority: 'high',
    status: 'in-progress',
    dueDate: '2025-01-19',
    assignedTo: 'Procurement',
    department: 'Procurement',
    description: 'Evaluate submitted tender documents for equipment procurement.',
    pendingItems: 6,
    details: [
      '6 bids received for equipment tender',
      'Technical evaluation pending',
      'Financial comparison needed',
      'Committee review scheduled',
    ],
    createdAt: 'Jan 06, 2025',
    updatedAt: 'Jan 17, 2025',
  },
  {
    id: 7,
    title: 'Update HSE policies',
    category: 'compliance',
    priority: 'medium',
    status: 'pending',
    dueDate: '2025-01-28',
    assignedTo: 'HSE Manager',
    department: 'HSE',
    description:
      'Revise health and safety guidelines to meet new regulatory requirements.',
    pendingItems: 2,
    details: [
      'New ZEMA regulations to incorporate',
      'Emergency procedure updates',
      'PPE policy revision needed',
    ],
    createdAt: 'Jan 10, 2025',
    updatedAt: 'Jan 15, 2025',
  },
  {
    id: 8,
    title: 'Publish press release',
    category: 'communication',
    priority: 'low',
    status: 'pending',
    dueDate: '2025-01-30',
    assignedTo: 'PR Team',
    department: 'Communications',
    description:
      'Finalize and distribute the Q1 2025 expansion announcement press release.',
    pendingItems: 1,
    details: [
      'Draft approved by management',
      'Media distribution list ready',
      'Social media posts prepared',
    ],
    createdAt: 'Jan 12, 2025',
    updatedAt: 'Jan 18, 2025',
  },
  {
    id: 9,
    title: 'Renew SSL certificate',
    category: 'technical',
    priority: 'high',
    status: 'overdue',
    dueDate: '2025-01-17',
    assignedTo: 'IT Team',
    department: 'IT',
    description:
      'Renew the website SSL certificate before expiration to maintain security.',
    pendingItems: 1,
    details: [
      'Certificate expires in 2 days',
      'Vendor contacted for renewal',
      'DNS verification required',
    ],
    createdAt: 'Jan 05, 2025',
    updatedAt: 'Jan 16, 2025',
  },
  {
    id: 10,
    title: 'Schedule board meeting',
    category: 'admin',
    priority: 'medium',
    status: 'pending',
    dueDate: '2025-01-24',
    assignedTo: 'Admin',
    department: 'Administration',
    description: 'Coordinate and schedule the Q1 board meeting with all directors.',
    pendingItems: 1,
    details: [
      'Send calendar invites',
      'Prepare agenda document',
      'Book conference room',
      'Arrange catering',
    ],
    createdAt: 'Jan 11, 2025',
    updatedAt: 'Jan 17, 2025',
  },
  {
    id: 11,
    title: 'Audit user permissions',
    category: 'technical',
    priority: 'low',
    status: 'pending',
    dueDate: '2025-02-01',
    assignedTo: 'IT Team',
    department: 'IT',
    description:
      'Review and update user access permissions across all admin modules.',
    pendingItems: 3,
    details: [
      '3 new users need role assignment',
      'Remove access for departed staff',
      'Review admin privilege levels',
    ],
    createdAt: 'Jan 15, 2025',
    updatedAt: 'Jan 19, 2025',
  },
  {
    id: 12,
    title: 'Update certifications page',
    category: 'content',
    priority: 'medium',
    status: 'in-progress',
    dueDate: '2025-01-26',
    assignedTo: 'Quality Team',
    department: 'Quality',
    description:
      'Add newly received ISO certifications and update expiry dates.',
    pendingItems: 2,
    details: [
      'ISO 14001:2015 certificate to add',
      'ISO 9001 renewal date update',
      'Upload scanned certificates',
    ],
    createdAt: 'Jan 09, 2025',
    updatedAt: 'Jan 18, 2025',
  },
  {
    id: 13,
    title: 'Prepare training materials',
    category: 'hr',
    priority: 'medium',
    status: 'pending',
    dueDate: '2025-01-29',
    assignedTo: 'HR Department',
    department: 'Human Resources',
    description:
      'Develop onboarding materials for new employee orientation program.',
    pendingItems: 4,
    details: [
      'Company handbook update',
      'Safety training slides',
      'IT systems guide',
      'Department introduction videos',
    ],
    createdAt: 'Jan 13, 2025',
    updatedAt: 'Jan 17, 2025',
  },
  {
    id: 14,
    title: 'Vendor contract renewal',
    category: 'procurement',
    priority: 'high',
    status: 'in-progress',
    dueDate: '2025-01-23',
    assignedTo: 'Procurement',
    department: 'Procurement',
    description:
      'Negotiate and finalize contract renewals with key suppliers.',
    pendingItems: 3,
    details: [
      'Fuel supplier contract expiring',
      'Equipment maintenance agreement',
      'Security services renewal',
    ],
    createdAt: 'Jan 07, 2025',
    updatedAt: 'Jan 19, 2025',
  },
  {
    id: 15,
    title: 'Complete compliance audit',
    category: 'compliance',
    priority: 'high',
    status: 'completed',
    dueDate: '2025-01-15',
    assignedTo: 'Compliance Team',
    department: 'Legal',
    description:
      'Conduct quarterly compliance audit and submit report to management.',
    pendingItems: 0,
    details: [
      'All departments reviewed',
      'No major findings',
      'Report submitted to board',
      'Follow-up actions documented',
    ],
    createdAt: 'Jan 02, 2025',
    updatedAt: 'Jan 15, 2025',
  },
];

const TasksManagementPage = () => {
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

  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [taskSearch, setTaskSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modal states
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    category: 'admin',
    priority: 'medium',
    status: 'pending',
    dueDate: '',
    assignedTo: '',
    department: '',
    description: '',
    pendingItems: 1,
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
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node)
      ) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () =>
      document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const adminUser = JSON.parse(
    sessionStorage.getItem('adminUser') ||
      '{"name": "Admin", "email": "admin@rubamindrc.com"}',
  );

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
    const diff = Math.ceil(
      (target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
    );
    return diff;
  };

  // Stats calculations
  const activeCount = tasks.filter((t) => t.status !== 'completed').length;
  const highPriorityCount = tasks.filter(
    (t) => t.priority === 'high' && t.status !== 'completed',
  ).length;
  const overdueCount = tasks.filter((t) => t.status === 'overdue').length;
  const completedCount = tasks.filter((t) => t.status === 'completed')
    .length;
  const inProgressCount = tasks.filter((t) => t.status === 'in-progress')
    .length;

  const openCreateModal = () => {
    setIsEditing(false);
    setFormData({
      title: '',
      category: 'admin',
      priority: 'medium',
      status: 'pending',
      dueDate: '',
      assignedTo: '',
      department: '',
      description: '',
      pendingItems: 1,
      details: '',
    });
    setShowFormModal(true);
  };

  const openEditModal = (task: Task) => {
    setIsEditing(true);
    setSelectedTask(task);
    setFormData({
      title: task.title,
      category: task.category,
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate,
      assignedTo: task.assignedTo,
      department: task.department,
      description: task.description,
      pendingItems: task.pendingItems,
      details: task.details.join('\n'),
    });
    setShowFormModal(true);
  };

  const openDetailModal = (task: Task) => {
    setSelectedTask(task);
    setShowDetailModal(true);
  };

  const openDeleteModal = (task: Task) => {
    setSelectedTask(task);
    setShowDeleteModal(true);
  };

  const handleFormSubmit = () => {
    if (
      !formData.title.trim() ||
      !formData.dueDate ||
      !formData.assignedTo.trim() ||
      !formData.department.trim()
    ) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }

    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });

    if (isEditing && selectedTask) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === selectedTask.id
            ? {
                ...t,
                title: formData.title,
                category: formData.category,
                priority: formData.priority,
                status: formData.status,
                dueDate: formData.dueDate,
                assignedTo: formData.assignedTo,
                department: formData.department,
                description: formData.description,
                pendingItems: formData.pendingItems,
                details: formData.details
                  .split('\n')
                  .filter((line) => line.trim()),
                updatedAt: dateStr,
              }
            : t,
        ),
      );
      showToast('Task updated successfully!', 'success');
    } else {
      const newTask: Task = {
        id: Math.max(...tasks.map((t) => t.id), 0) + 1,
        title: formData.title,
        category: formData.category,
        priority: formData.priority,
        status: formData.status,
        dueDate: formData.dueDate,
        assignedTo: formData.assignedTo,
        department: formData.department,
        description: formData.description,
        pendingItems: formData.pendingItems,
        details: formData.details
          .split('\n')
          .filter((line) => line.trim()),
        createdAt: dateStr,
        updatedAt: dateStr,
      };
      setTasks((prev) => [newTask, ...prev]);
      showToast('Task created successfully!', 'success');
    }
    setShowFormModal(false);
  };

  const handleDelete = () => {
    if (selectedTask) {
      setTasks((prev) => prev.filter((t) => t.id !== selectedTask.id));
      showToast('Task deleted successfully!', 'success');
      setShowDeleteModal(false);
      setSelectedTask(null);
    }
  };

  const toggleStatus = (id: number) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const statusOrder = ['pending', 'in-progress', 'completed'];
          const currentIndex = statusOrder.indexOf(
            t.status === 'overdue' ? 'pending' : t.status,
          );
          const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length];
          return { ...t, status: nextStatus };
        }
        return t;
      }),
    );
  };

  const markAsComplete = (id: number) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status: 'completed', pendingItems: 0 } : t,
      ),
    );
    showToast('Task marked as complete!', 'success');
  };

  const filteredTasks = tasks.filter((t) => {
    const categoryMatch =
      categoryFilter === 'all' || t.category === categoryFilter;
    const priorityMatch =
      priorityFilter === 'all' || t.priority === priorityFilter;
    const statusMatch = statusFilter === 'all' || t.status === statusFilter;
    const searchMatch =
      taskSearch === '' ||
      t.title.toLowerCase().includes(taskSearch.toLowerCase()) ||
      t.assignedTo.toLowerCase().includes(taskSearch.toLowerCase()) ||
      t.department.toLowerCase().includes(taskSearch.toLowerCase());
    return categoryMatch && priorityMatch && statusMatch && searchMatch;
  });

  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);
  const paginatedTasks = filteredTasks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const resetFilters = () => {
    setCategoryFilter('all');
    setPriorityFilter('all');
    setStatusFilter('all');
    setTaskSearch('');
    setCurrentPage(1);
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'high':
        return darkMode
          ? 'text-red-400 bg-red-600/20'
          : 'text-red-600 bg-red-50';
      case 'medium':
        return darkMode
          ? 'text-yellow-400 bg-yellow-500/20'
          : 'text-yellow-600 bg-yellow-50';
      default:
        return darkMode
          ? 'text-green-400 bg-green-500/20'
          : 'text-green-600 bg-green-50';
    }
  };

  const getCategoryStyle = (category: string) => {
    const styles: Record<string, string> = {
      hr: darkMode
        ? 'bg-purple-500/20 text-purple-400'
        : 'bg-purple-50 text-purple-600',
      content: darkMode
        ? 'bg-blue-500/20 text-blue-400'
        : 'bg-blue-50 text-blue-600',
      finance: darkMode
        ? 'bg-emerald-500/20 text-emerald-400'
        : 'bg-emerald-50 text-emerald-600',
      communication: darkMode
        ? 'bg-cyan-500/20 text-cyan-400'
        : 'bg-cyan-50 text-cyan-600',
      procurement: darkMode
        ? 'bg-orange-500/20 text-orange-400'
        : 'bg-orange-50 text-orange-600',
      compliance: darkMode
        ? 'bg-rose-500/20 text-rose-400'
        : 'bg-rose-50 text-rose-600',
      technical: darkMode
        ? 'bg-indigo-500/20 text-indigo-400'
        : 'bg-indigo-50 text-indigo-600',
      admin: darkMode
        ? 'bg-gray-500/20 text-gray-400'
        : 'bg-gray-100 text-gray-600',
    };
    return styles[category] || styles.admin;
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      hr: 'ri-user-search-line',
      content: 'ri-file-text-line',
      finance: 'ri-money-dollar-circle-line',
      communication: 'ri-mail-line',
      procurement: 'ri-shopping-cart-line',
      compliance: 'ri-shield-check-line',
      technical: 'ri-code-line',
      admin: 'ri-settings-3-line',
    };
    return icons[category] || 'ri-task-line';
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'completed':
        return darkMode
          ? 'text-green-400 bg-green-500/20'
          : 'text-green-600 bg-green-50';
      case 'in-progress':
        return darkMode
          ? 'text-blue-400 bg-blue-500/20'
          : 'text-blue-600 bg-blue-50';
      case 'overdue':
        return darkMode
          ? 'text-red-400 bg-red-600/20'
          : 'text-red-600 bg-red-50';
      default:
        return darkMode
          ? 'text-gray-400 bg-gray-600'
          : 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'in-progress':
        return 'In Progress';
      case 'overdue':
        return 'Overdue';
      case 'completed':
        return 'Completed';
      default:
        return 'Pending';
    }
  };

  const sidebarItems = [
    { icon: 'ri-dashboard-3-line', label: 'Dashboard', path: '/admin/dashboard' },
    { icon: 'ri-file-list-3-line', label: 'Pages', path: '/admin/dashboard/pages' },
    { icon: 'ri-newspaper-line', label: 'Media', path: '/admin/dashboard/media-center', badge: 5 },
    { icon: 'ri-briefcase-line', label: 'Jobs', path: '/admin/dashboard/jobs', badge: 3 },
    { icon: 'ri-gallery-line', label: 'Gallery', path: '/admin/dashboard/gallery' },
    { icon: 'ri-folder-line', label: 'Resources Center', path: '/admin/dashboard/resources', badge: 7 },
    { icon: 'ri-mail-line', label: 'Inquiries', path: '/admin/dashboard/inquiries', badge: 8 },
    { icon: 'ri-notification-3-line', label: 'Notifications', path: '/admin/dashboard/notifications', badge: 4 },
    { icon: 'ri-task-line', label: 'Tasks', path: '/admin/dashboard/tasks', badge: 12 },
    { icon: 'ri-calendar-todo-line', label: 'Deadlines', path: '/admin/dashboard/deadlines', badge: 11 },
    { icon: 'ri-settings-3-line', label: 'Settings', path: '/admin/dashboard/settings' },
  ];

  const breadcrumbs = [
    { label: 'Home', path: '/', icon: 'ri-home-4-line' },
    { label: 'Admin', path: '/admin' },
    { label: 'Dashboard', path: '/admin/dashboard' },
    { label: 'Tasks', path: '/admin/dashboard/tasks' },
  ];

  const categories = [
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

  return (
    <div
      className={`min-h-screen flex ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}
    >
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-6 right-6 z-[100] animate-slide-in">
          <div
            className={`flex items-center gap-3 px-5 py-3.5 rounded-lg shadow-xl border ${
              toast.type === 'success'
                ? darkMode
                  ? 'bg-green-900/90 border-green-700 text-green-200'
                  : 'bg-green-50 border-green-200 text-green-800'
                : darkMode
                ? 'bg-red-900/90 border-red-700 text-red-200'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            <i
              className={`${
                toast.type === 'success'
                  ? 'ri-checkbox-circle-fill'
                  : 'ri-error-warning-fill'
              } text-lg`}
            />
            <span className="text-sm font-medium">{toast.message}</span>
            <button
              onClick={() => setToast(null)}
              className="ml-2 cursor-pointer opacity-70 hover:opacity-100"
            >
              <i className="ri-close-line" />
            </button>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside
        className={`${
          sidebarCollapsed ? 'w-20' : 'w-64'
        } ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r flex flex-col fixed h-full transition-all duration-300 z-20`}
      >
        <div
          className={`p-5 border-b ${
            darkMode ? 'border-gray-700' : 'border-gray-200'
          } flex items-center justify-between`}
        >
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className={`flex items-center gap-3 ${
              sidebarCollapsed ? 'justify-center' : ''
            } cursor-pointer`}
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
          </button>
          {!sidebarCollapsed && (
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className={`w-8 h-8 flex items-center justify-center rounded-lg ${
                darkMode
                  ? 'hover:bg-gray-700 text-gray-400'
                  : 'hover:bg-gray-200 text-gray-500'
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
                title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                <i
                  className={`${
                    darkMode ? 'ri-sun-line' : 'ri-moon-line'
                  } text-lg`}
                />
              </button>
              <Link
                to="/admin/dashboard/notifications"
                className={`relative w-10 h-10 flex items-center justify-center rounded-lg cursor-pointer ${
                  darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                }`}>
                <i className="ri-notification-3-line text-lg" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-600 rounded-full" />
              </Link>
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
                        onClick={() => setProfileDropdownOpen(false)}
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
                        onClick={() => setProfileDropdownOpen(false)}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors cursor-pointer ${
                          darkMode
                            ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <i className="ri-settings-3-line" />
                        Account Settings
                      </Link>
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
                Tasks Management
              </h1>
              <p
                className={`mt-2 text-base ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                Create, assign, and track tasks across all departments
              </p>
            </div>
            <button
              onClick={openCreateModal}
              className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white hover:bg-red-700 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap shadow-md"
            >
              <i className="ri-add-line text-lg" />
              New Task
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
            {[
              {
                label: 'Total Active',
                value: activeCount,
                icon: 'ri-task-line',
                color: darkMode ? 'text-blue-400 bg-blue-500/20' : 'text-blue-600 bg-blue-50',
              },
              {
                label: 'High Priority',
                value: highPriorityCount,
                icon: 'ri-alarm-warning-line',
                color: darkMode ? 'text-red-400 bg-red-600/20' : 'text-red-600 bg-red-50',
              },
              {
                label: 'In Progress',
                value: inProgressCount,
                icon: 'ri-loader-4-line',
                color: darkMode ? 'text-yellow-400 bg-yellow-500/20' : 'text-yellow-600 bg-yellow-50',
              },
              {
                label: 'Overdue',
                value: overdueCount,
                icon: 'ri-time-line',
                color: darkMode ? 'text-orange-400 bg-orange-500/20' : 'text-orange-600 bg-orange-50',
              },
              {
                label: 'Completed',
                value: completedCount,
                icon: 'ri-checkbox-circle-line',
                color: darkMode ? 'text-green-400 bg-green-500/20' : 'text-green-600 bg-green-50',
              },
            ].map((stat, i) => (
              <div
                key={i}
                className={`rounded-lg p-5 border ${
                  darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color}`}>
                    <i className={`${stat.icon} text-xl`} />
                  </div>
                  <div>
                    <p
                      className={`text-2xl font-bold ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}
                      style={{ fontFamily: 'Merriweather, serif' }}
                    >
                      {stat.value}
                    </p>
                    <p
                      className={`text-sm ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}
                    >
                      {stat.label}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Filters Card */}
          <div
            className={`rounded-lg p-6 border mb-6 ${
              darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}
          >
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <i
                    className={`ri-search-line absolute left-3 top-1/2 -translate-y-1/2 ${
                      darkMode ? 'text-gray-500' : 'text-gray-400'
                    }`}
                  />
                  <input
                    type="text"
                    value={taskSearch}
                    onChange={(e) => {
                      setTaskSearch(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Search tasks..."
                    className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-red-600 ${
                      darkMode
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                        : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500'
                    }`}
                  />
                </div>
              </div>
              <div className="relative">
                <select
                  value={categoryFilter}
                  onChange={(e) => {
                    setCategoryFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className={`appearance-none pl-3 pr-10 py-2.5 text-sm rounded-lg border cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-600 ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                  }`}
                >
                  {categories.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
                <i
                  className={`ri-arrow-down-s-line absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}
                />
              </div>
              <div className="relative">
                <select
                  value={priorityFilter}
                  onChange={(e) => {
                    setPriorityFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className={`appearance-none pl-3 pr-10 py-2.5 text-sm rounded-lg border cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-600 ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                  }`}
                >
                  <option value="all">All Priorities</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
                <i
                  className={`ri-arrow-down-s-line absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}
                />
              </div>
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className={`appearance-none pl-3 pr-10 py-2.5 text-sm rounded-lg border cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-600 ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                  }`}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="overdue">Overdue</option>
                  <option value="completed">Completed</option>
                </select>
                <i
                  className={`ri-arrow-down-s-line absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}
                />
              </div>
              {(categoryFilter !== 'all' ||
                priorityFilter !== 'all' ||
                statusFilter !== 'all' ||
                taskSearch !== '') && (
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
            <div
              className={`mt-4 pt-4 border-t ${
                darkMode ? 'border-gray-700' : 'border-gray-200'
              }`}
            >
              <p
                className={`text-sm ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}
              >
                Showing{' '}
                <span
                  className={`font-semibold ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {filteredTasks.length}
                </span>{' '}
                tasks
              </p>
            </div>
          </div>

          {/* Tasks Table */}
          <div
            className={`rounded-lg border overflow-hidden ${
              darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}
          >
            <div
              className={`grid grid-cols-12 gap-4 px-6 py-4 text-xs font-semibold uppercase tracking-wider border-b ${
                darkMode ? 'bg-gray-700/50 border-gray-700 text-gray-400' : 'bg-gray-50 border-gray-200 text-gray-500'
              }`}
            >
              <div className="col-span-3">Task</div>
              <div className="col-span-1">Category</div>
              <div className="col-span-2">Assigned To</div>
              <div className="col-span-1">Priority</div>
              <div className="col-span-1">Status</div>
              <div className="col-span-2">Due Date</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            <div className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
              {paginatedTasks.length > 0 ? (
                paginatedTasks.map((task) => {
                  const daysLeft = calcDaysLeft(task.dueDate);
                  return (
                    <div
                      key={task.id}
                      className={`grid grid-cols-12 gap-4 px-6 py-4 items-center transition-colors ${
                        darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'
                      } ${
                        task.status === 'overdue' ||
                        (daysLeft < 0 && task.status !== 'completed')
                          ? 'border-l-4 border-l-red-500'
                          : ''
                      }`}
                    >
                      <div className="col-span-3 flex items-center gap-3 min-w-0">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getCategoryStyle(
                            task.category,
                          )}`}
                        >
                          <i className={`${getCategoryIcon(task.category)} text-lg`} />
                        </div>
                        <div className="min-w-0">
                          <button
                            onClick={() => openDetailModal(task)}
                            className={`text-sm font-medium truncate block text-left cursor-pointer hover:underline ${
                              darkMode ? 'text-white' : 'text-gray-900'
                            }`}
                          >
                            {task.title}
                          </button>
                          <p
                            className={`text-xs truncate ${
                              darkMode ? 'text-gray-400' : 'text-gray-500'
                            }`}
                          >
                            {task.pendingItems} pending items
                          </p>
                        </div>
                      </div>
                      <div className="col-span-1">
                        <span
                          className={`text-xs px-2 py-1 rounded-md font-medium capitalize ${getCategoryStyle(
                            task.category,
                          )}`}
                        >
                          {task.category}
                        </span>
                      </div>
                      <div className="col-span-2">
                        <span
                          className={`text-sm ${
                            darkMode ? 'text-gray-300' : 'text-gray-700'
                          }`}
                        >
                          {task.assignedTo}
                        </span>
                      </div>
                      <div className="col-span-1">
                        <span
                          className={`text-xs px-2 py-1 rounded-md font-semibold capitalize ${getPriorityStyle(
                            task.priority,
                          )}`}
                        >
                          {task.priority}
                        </span>
                      </div>
                      <div className="col-span-1">
                        <button
                          onClick={() => toggleStatus(task.id)}
                          className="cursor-pointer"
                        >
                          <span
                            className={`text-xs px-2 py-1 rounded-md font-medium ${getStatusStyle(
                              task.status,
                            )}`}
                          >
                            {getStatusLabel(task.status)}
                          </span>
                        </button>
                      </div>
                      <div className="col-span-2">
                        <p
                          className={`text-sm ${
                            darkMode ? 'text-gray-300' : 'text-gray-700'
                          }`}
                        >
                          {new Date(task.dueDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                        <p
                          className={`text-xs font-semibold ${
                            task.status === 'completed'
                              ? darkMode
                                ? 'text-green-400'
                                : 'text-green-600'
                              : daysLeft < 0
                              ? darkMode
                                ? 'text-red-400'
                                : 'text-red-600'
                              : daysLeft <= 3
                              ? darkMode
                                ? 'text-orange-400'
                                : 'text-orange-600'
                              : darkMode
                              ? 'text-gray-400'
                              : 'text-gray-500'
                          }`}
                        >
                          {task.status === 'completed'
                            ? 'Completed'
                            : daysLeft < 0
                            ? `${Math.abs(daysLeft)}d overdue`
                            : `${daysLeft}d left`}
                        </p>
                      </div>
                      <div className="col-span-2 flex items-center justify-end gap-2">
                        {task.status !== 'completed' && (
                          <button
                            onClick={() => markAsComplete(task.id)}
                            className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                              darkMode
                                ? 'hover:bg-green-600/20 text-gray-400 hover:text-green-400'
                                : 'hover:bg-green-50 text-gray-500 hover:text-green-600'
                            }`}
                            title="Mark Complete"
                          >
                            <i className="ri-checkbox-circle-line" />
                          </button>
                        )}
                        <button
                          onClick={() => openDetailModal(task)}
                          className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                            darkMode
                              ? 'hover:bg-gray-600 text-gray-400 hover:text-white'
                              : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'
                          }`}
                          title="View Details"
                        >
                          <i className="ri-eye-line" />
                        </button>
                        <button
                          onClick={() => openEditModal(task)}
                          className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                            darkMode
                              ? 'hover:bg-gray-600 text-gray-400 hover:text-white'
                              : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'
                          }`}
                          title="Edit"
                        >
                          <i className="ri-edit-line" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(task)}
                          className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                            darkMode
                              ? 'hover:bg-red-600/20 text-gray-400 hover:text-red-400'
                              : 'hover:bg-red-50 text-gray-500 hover:text-red-600'
                          }`}
                          title="Delete"
                        >
                          <i className="ri-delete-bin-line" />
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div
                  className={`text-center py-16 ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}
                >
                  <i className="ri-task-line text-5xl mb-4 block" />
                  <p className="text-lg font-medium">No tasks found</p>
                  <p className="text-sm mt-1">Try adjusting your filters or create a new task</p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {filteredTasks.length > itemsPerPage && (
              <div
                className={`flex items-center justify-between px-6 py-4 border-t ${
                  darkMode ? 'border-gray-700' : 'border-gray-200'
                }`}
              >
                <p
                  className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
                >
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to{' '}
                  {Math.min(currentPage * itemsPerPage, filteredTasks.length)} of{' '}
                  {filteredTasks.length}
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
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className={`w-9 h-9 flex items-center justify-center rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                      darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
                    }`}
                  >
                    <i className="ri-arrow-left-s-line" />
                  </button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) pageNum = i + 1;
                    else if (currentPage <= 3) pageNum = i + 1;
                    else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                    else pageNum = currentPage - 2 + i;
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
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
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

      {/* Create / Edit Modal */}
      {showFormModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setShowFormModal(false)}
        >
          <div
            className={`w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={`px-6 py-4 border-b flex items-center justify-between ${
                darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    darkMode ? 'bg-red-600/20' : 'bg-red-50'
                  }`}
                >
                  <i
                    className={`${
                      isEditing ? 'ri-edit-line' : 'ri-add-line'
                    } text-lg ${darkMode ? 'text-red-400' : 'text-red-600'}`}
                  />
                </div>
                <h3
                  className={`text-lg font-bold ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}
                  style={{ fontFamily: 'Merriweather, serif' }}
                >
                  {isEditing ? 'Edit Task' : 'Create New Task'}
                </h3>
              </div>
              <button
                onClick={() => setShowFormModal(false)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                  darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-gray-500'
                }`}
              >
                <i className="ri-close-line text-xl" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-5 max-h-[65vh] overflow-y-auto">
              <div>
                <label
                  className={`block text-sm font-medium mb-1.5 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter task title"
                  className={`w-full px-4 py-2.5 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-red-600 ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    className={`block text-sm font-medium mb-1.5 ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    Category
                  </label>
                  <div className="relative">
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className={`w-full appearance-none px-4 py-2.5 text-sm rounded-lg border cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-600 ${
                        darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                      }`}
                    >
                      <option value="hr">HR</option>
                      <option value="content">Content</option>
                      <option value="finance">Finance</option>
                      <option value="communication">Communication</option>
                      <option value="procurement">Procurement</option>
                      <option value="compliance">Compliance</option>
                      <option value="technical">Technical</option>
                      <option value="admin">Admin</option>
                    </select>
                    <i
                      className={`ri-arrow-down-s-line absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}
                    />
                  </div>
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium mb-1.5 ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    Priority
                  </label>
                  <div className="relative">
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      className={`w-full appearance-none px-4 py-2.5 text-sm rounded-lg border cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-600 ${
                        darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                      }`}
                    >
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                    <i
                      className={`ri-arrow-down-s-line absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    className={`block text-sm font-medium mb-1.5 ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    Due Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className={`w-full px-4 py-2.5 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-red-600 ${
                      darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                    }`}
                  />
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium mb-1.5 ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    Status
                  </label>
                  <div className="relative">
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className={`w-full appearance-none px-4 py-2.5 text-sm rounded-lg border cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-600 ${
                        darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="overdue">Overdue</option>
                      <option value="completed">Completed</option>
                    </select>
                    <i
                      className={`ri-arrow-down-s-line absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    className={`block text-sm font-medium mb-1.5 ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    Assigned To <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.assignedTo}
                    onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                    placeholder="e.g. HR Department"
                    className={`w-full px-4 py-2.5 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-red-600 ${
                      darkMode
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                        : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500'
                    }`}
                  />
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium mb-1.5 ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    Department <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    placeholder="e.g. Human Resources"
                    className={`w-full px-4 py-2.5 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-red-600 ${
                      darkMode
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                        : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-1.5 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  Pending Items Count
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.pendingItems}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      pendingItems: parseInt(e.target.value) || 0,
                    })
                  }
                  className={`w-full px-4 py-2.5 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-red-600 ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                  }`}
                />
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-1.5 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      description: e.target.value.slice(0, 500),
                    })
                  }
                  placeholder="Describe the task..."
                  rows={3}
                  maxLength={500}
                  className={`w-full px-4 py-2.5 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-red-600 resize-none ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500'
                  }`}
                />
                <p
                  className={`text-xs mt-1 text-right ${
                    darkMode ? 'text-gray-500' : 'text-gray-400'
                  }`}
                >
                  {formData.description.length}/500
                </p>
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-1.5 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  Details / Subtasks{' '}
                  <span
                    className={`font-normal ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}
                  >
                    (one per line)
                  </span>
                </label>
                <textarea
                  value={formData.details}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      details: e.target.value.slice(0, 500),
                    })
                  }
                  placeholder="Enter details, one per line..."
                  rows={3}
                  maxLength={500}
                  className={`w-full px-4 py-2.5 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-red-600 resize-none ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500'
                  }`}
                />
                <p
                  className={`text-xs mt-1 text-right ${
                    darkMode ? 'text-gray-500' : 'text-gray-400'
                  }`}
                >
                  {formData.details.length}/500
                </p>
              </div>
            </div>

            <div
              className={`px-6 py-4 border-t flex items-center justify-end gap-3 ${
                darkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50'
              }`}
            >
              <button
                onClick={() => setShowFormModal(false)}
                className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleFormSubmit}
                className="px-5 py-2.5 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer whitespace-nowrap shadow-md"
              >
                <i
                  className={`${
                    isEditing ? 'ri-save-line' : 'ri-add-line'
                  } mr-1.5`}
                />
                {isEditing ? 'Save Changes' : 'Create Task'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedTask && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setShowDetailModal(false)}
        >
          <div
            className={`w-full max-w-lg rounded-xl shadow-2xl overflow-hidden ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={`px-6 py-4 border-b flex items-center justify-between ${
                darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${getCategoryStyle(
                    selectedTask.category,
                  )}`}
                >
                  <i className={`${getCategoryIcon(selectedTask.category)} text-lg`} />
                </div>
                <div>
                  <h3
                    className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}
                    style={{ fontFamily: 'Merriweather, serif' }}
                  >
                    Task Details
                  </h3>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Created: {selectedTask.createdAt}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                  darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-gray-500'
                }`}
              >
                <i className="ri-close-line text-xl" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-5 max-h-[60vh] overflow-y-auto">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-md capitalize ${getCategoryStyle(
                    selectedTask.category,
                  )}`}
                >
                  {selectedTask.category}
                </span>
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-md capitalize ${getPriorityStyle(
                    selectedTask.priority,
                  )}`}
                >
                  {selectedTask.priority} Priority
                </span>
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-md ${getStatusStyle(
                    selectedTask.status,
                  )}`}
                >
                  {getStatusLabel(selectedTask.status)}
                </span>
              </div>

              <div>
                <h4
                  className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}
                >
                  {selectedTask.title}
                </h4>
                <p
                  className={`text-sm mt-1 flex items-center gap-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}
                >
                  <i className="ri-stack-line" />
                  {selectedTask.pendingItems} pending items
                </p>
              </div>

              <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                <p
                  className={`text-sm leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                >
                  {selectedTask.description}
                </p>
              </div>

              {selectedTask.details.length > 0 && (
                <div>
                  <h5
                    className={`text-sm font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}
                  >
                    Task Breakdown
                  </h5>
                  <ul className="space-y-2">
                    {selectedTask.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <i
                          className={`ri-checkbox-blank-circle-line text-sm mt-0.5 ${
                            darkMode ? 'text-gray-500' : 'text-gray-400'
                          }`}
                        />
                        <span
                          className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                        >
                          {detail}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div
                className={`grid grid-cols-2 gap-4 p-4 rounded-lg border ${
                  darkMode ? 'bg-gray-700/30 border-gray-700' : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div>
                  <p className={`text-xs font-medium mb-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    Assigned To
                  </p>
                  <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {selectedTask.assignedTo}
                  </p>
                </div>
                <div>
                  <p className={`text-xs font-medium mb-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    Department
                  </p>
                  <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {selectedTask.department}
                  </p>
                </div>
                <div>
                  <p className={`text-xs font-medium mb-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    Due Date
                  </p>
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {new Date(selectedTask.dueDate).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <div>
                  <p className={`text-xs font-medium mb-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    Last Updated
                  </p>
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {selectedTask.updatedAt}
                  </p>
                </div>
              </div>
            </div>

            <div
              className={`px-6 py-4 border-t flex items-center justify-end gap-3 ${
                darkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50'
              }`}
            >
              <button
                onClick={() => setShowDetailModal(false)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                Close
              </button>
              {selectedTask.status !== 'completed' && (
                <button
                  onClick={() => {
                    markAsComplete(selectedTask.id);
                    setShowDetailModal(false);
                  }}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap border ${
                    darkMode
                      ? 'border-green-600 text-green-400 hover:bg-green-600/20'
                      : 'border-green-600 text-green-600 hover:bg-green-50'
                  }`}
                >
                  <i className="ri-checkbox-circle-line mr-1.5" />
                  Mark Complete
                </button>
              )}
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  openEditModal(selectedTask);
                }}
                className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer whitespace-nowrap"
              >
                <i className="ri-edit-line mr-1.5" />
                Edit Task
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedTask && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setShowDeleteModal(false)}
        >
          <div
            className={`w-full max-w-md rounded-xl shadow-2xl overflow-hidden ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-6 text-center">
              <div
                className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                  darkMode ? 'bg-red-600/20' : 'bg-red-50'
                }`}
              >
                <i
                  className={`ri-delete-bin-line text-3xl ${
                    darkMode ? 'text-red-400' : 'text-red-600'
                  }`}
                />
              </div>
              <h3
                className={`text-lg font-bold mb-2 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}
                style={{ fontFamily: 'Merriweather, serif' }}
              >
                Delete Task
              </h3>
              <p
                className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}
              >
                Are you sure you want to delete{' '}
                <strong className={darkMode ? 'text-white' : 'text-gray-900'}>
                  {selectedTask.title}
                </strong>
                ? This action cannot be undone.
              </p>
            </div>
            <div
              className={`px-6 py-4 border-t flex items-center justify-center gap-3 ${
                darkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50'
              }`}
            >
              <button
                onClick={() => setShowDeleteModal(false)}
                className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-5 py-2.5 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer whitespace-nowrap"
              >
                <i className="ri-delete-bin-line mr-1.5" />
                Delete
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

export default TasksManagementPage;
