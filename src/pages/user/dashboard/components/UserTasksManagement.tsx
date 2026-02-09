import { useState, useEffect } from 'react';

interface Task {
  id: string;
  title: string;
  category: string;
  priority: string;
  status: string;
  dueDate: string;
  assignedTo: string;
  relatedModule: string;
  description: string;
  pendingItems: number;
  details: string[];
  createdAt: string;
  updatedAt: string;
}

type TaskSortField = 'title' | 'module' | 'priority' | 'status' | 'dueDate' | 'pendingItems';
type SortDirection = 'asc' | 'desc';

interface Props {
  darkMode: boolean;
}

const UserTasksManagement = ({ darkMode }: Props) => {
  const [activeTab, setActiveTab] = useState<'tasks' | 'completed' | 'notifications'>('tasks');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<TaskSortField>('dueDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [viewingTask, setViewingTask] = useState<Task | null>(null);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    category: 'jobs',
    priority: 'medium',
    status: 'pending',
    dueDate: '',
    assignedTo: 'Self',
    description: '',
    details: '',
  });

  // Notification settings
  const [notifSettings, setNotifSettings] = useState({
    enableEmailNotifications: true,
    dueDateReminder3Days: true,
    dueDateReminder1Day: true,
    dueDateReminderSameDay: true,
    overdueAlerts: true,
    highPriorityAlerts: true,
    statusChangeAlerts: true,
    taskCompletionNotify: false,
    newTaskAssigned: true,
    dailyDigest: false,
    weeklyReport: true,
    frequency: 'instant' as 'instant' | 'hourly' | 'daily',
    recipients: [
      { email: 'user@mopanicopper.com', name: 'Task Manager', enabled: true },
      { email: 'admin@mopanicopper.com', name: 'Admin Team', enabled: true },
    ],
    quietHoursEnabled: false,
    quietHoursStart: '22:00',
    quietHoursEnd: '07:00',
  });
  const [showAddRecipientModal, setShowAddRecipientModal] = useState(false);
  const [newRecipientEmail, setNewRecipientEmail] = useState('');
  const [newRecipientName, setNewRecipientName] = useState('');
  const [notifSaved, setNotifSaved] = useState(false);

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 'TSK-001',
      title: 'Review new job applications for Mining Engineer',
      category: 'jobs',
      priority: 'high',
      status: 'in-progress',
      dueDate: '2025-01-22',
      assignedTo: 'Self',
      relatedModule: 'Jobs Management',
      description:
        'Screen and shortlist candidates who applied for the Mining Engineer position. Review qualifications, experience, and cover letters.',
      pendingItems: 5,
      details: [
        '3 new applications received today',
        'Check qualification certificates',
        'Schedule interviews for shortlisted candidates',
        'Update application status in system',
        'Send acknowledgment emails',
      ],
      createdAt: 'Jan 10, 2025',
      updatedAt: 'Jan 19, 2025',
    },
    {
      id: 'TSK-002',
      title: 'Update job posting for Accountant position',
      category: 'jobs',
      priority: 'medium',
      status: 'pending',
      dueDate: '2025-01-24',
      assignedTo: 'Self',
      relatedModule: 'Jobs Management',
      description:
        'Revise the Accountant job posting with updated salary range and requirements as per HR directive.',
      pendingItems: 3,
      details: [
        'Update salary range to reflect new budget',
        'Add CPA certification as preferred qualification',
        'Extend application deadline by 2 weeks',
      ],
      createdAt: 'Jan 12, 2025',
      updatedAt: 'Jan 18, 2025',
    },
    {
      id: 'TSK-003',
      title: 'Close expired job listings',
      category: 'jobs',
      priority: 'low',
      status: 'pending',
      dueDate: '2025-01-25',
      assignedTo: 'Self',
      relatedModule: 'Jobs Management',
      description:
        'Review and close all job postings that have passed their application deadline.',
      pendingItems: 4,
      details: [
        'Security Guard posting - expired Jan 15',
        'Lab Technician posting - expired Jan 10',
        'Driver posting - expired Jan 12',
        'Archive closed listings',
      ],
      createdAt: 'Jan 14, 2025',
      updatedAt: 'Jan 17, 2025',
    },
    {
      id: 'TSK-004',
      title: 'Schedule interviews for Plant Supervisor candidates',
      category: 'jobs',
      priority: 'high',
      status: 'overdue',
      dueDate: '2025-01-18',
      assignedTo: 'Self',
      relatedModule: 'Jobs Management',
      description:
        'Coordinate interview schedules with department heads for the 4 shortlisted Plant Supervisor candidates.',
      pendingItems: 4,
      details: [
        'Confirm availability of interview panel',
        'Book conference room for 4 sessions',
        'Send interview invitations to candidates',
        'Prepare evaluation forms',
      ],
      createdAt: 'Jan 08, 2025',
      updatedAt: 'Jan 16, 2025',
    },
    {
      id: 'TSK-005',
      title: 'Upload Q4 2024 financial statements',
      category: 'resources',
      priority: 'high',
      status: 'in-progress',
      dueDate: '2025-01-20',
      assignedTo: 'Self',
      relatedModule: 'Resources Center',
      description:
        'Upload and publish the Q4 2024 financial statements to the Resources Center for stakeholder access.',
      pendingItems: 2,
      details: [
        'Convert financial statements to PDF format',
        'Upload to Resources Center with proper categorization',
      ],
      createdAt: 'Jan 05, 2025',
      updatedAt: 'Jan 19, 2025',
    },
    {
      id: 'TSK-006',
      title: 'Review pending download requests',
      category: 'resources',
      priority: 'medium',
      status: 'in-progress',
      dueDate: '2025-01-21',
      assignedTo: 'Self',
      relatedModule: 'Resources Center',
      description:
        'Process and approve or reject pending download requests for restricted documents.',
      pendingItems: 7,
      details: [
        '3 requests for annual report',
        '2 requests for environmental audit',
        '1 request for safety manual',
        '1 request for procurement policy',
        'Verify requester credentials',
        'Send approval/rejection notifications',
        'Log all decisions in audit trail',
      ],
      createdAt: 'Jan 09, 2025',
      updatedAt: 'Jan 19, 2025',
    },
    {
      id: 'TSK-007',
      title: 'Update company policies documents',
      category: 'resources',
      priority: 'medium',
      status: 'pending',
      dueDate: '2025-01-28',
      assignedTo: 'Self',
      relatedModule: 'Resources Center',
      description:
        'Replace outdated policy documents with the latest approved versions from management.',
      pendingItems: 3,
      details: [
        'HSE Policy v3.2 - replace v3.0',
        'Anti-Corruption Policy - new document',
        'Employee Handbook 2025 edition',
      ],
      createdAt: 'Jan 11, 2025',
      updatedAt: 'Jan 17, 2025',
    },
    {
      id: 'TSK-008',
      title: 'Archive expired certifications',
      category: 'resources',
      priority: 'low',
      status: 'pending',
      dueDate: '2025-01-30',
      assignedTo: 'Self',
      relatedModule: 'Resources Center',
      description:
        'Move expired certification documents to the archive section and update status labels.',
      pendingItems: 2,
      details: [
        'ISO 9001:2015 - expired Dec 2024',
        'Mining License renewal pending - archive old copy',
      ],
      createdAt: 'Jan 13, 2025',
      updatedAt: 'Jan 18, 2025',
    },
    {
      id: 'TSK-009',
      title: 'Respond to partnership inquiry from Vedanta',
      category: 'inquiries',
      priority: 'high',
      status: 'in-progress',
      dueDate: '2025-01-21',
      assignedTo: 'Self',
      relatedModule: 'Inquiries',
      description:
        'Draft and send a detailed response to Vedanta Resources regarding their partnership proposal for copper processing.',
      pendingItems: 2,
      details: [
        'Review partnership proposal document',
        'Draft response with management input',
      ],
      createdAt: 'Jan 07, 2025',
      updatedAt: 'Jan 19, 2025',
    },
    {
      id: 'TSK-010',
      title: 'Address community complaint about dust emissions',
      category: 'inquiries',
      priority: 'high',
      status: 'overdue',
      dueDate: '2025-01-17',
      assignedTo: 'Self',
      relatedModule: 'Inquiries',
      description:
        'Investigate and respond to the community complaint regarding dust emissions from the processing plant.',
      pendingItems: 3,
      details: [
        'Coordinate with HSE team for site inspection',
        'Prepare mitigation measures report',
        'Draft formal response to community leader',
      ],
      createdAt: 'Jan 06, 2025',
      updatedAt: 'Jan 16, 2025',
    },
    {
      id: 'TSK-011',
      title: 'Reply to media inquiry about expansion plans',
      category: 'inquiries',
      priority: 'medium',
      status: 'pending',
      dueDate: '2025-01-23',
      assignedTo: 'Self',
      relatedModule: 'Inquiries',
      description:
        'Prepare an official response to the Zambia Daily Mail inquiry about the company expansion plans.',
      pendingItems: 2,
      details: [
        'Get approved talking points from management',
        'Draft press-ready response',
      ],
      createdAt: 'Jan 10, 2025',
      updatedAt: 'Jan 18, 2025',
    },
    {
      id: 'TSK-012',
      title: 'Follow up on unanswered general inquiries',
      category: 'inquiries',
      priority: 'low',
      status: 'pending',
      dueDate: '2025-01-26',
      assignedTo: 'Self',
      relatedModule: 'Inquiries',
      description:
        'Review and respond to all general inquiries that have been pending for more than 5 business days.',
      pendingItems: 6,
      details: [
        '2 supplier inquiries about procurement process',
        '1 student internship request',
        '1 site visit request from university',
        '1 product pricing inquiry',
        '1 CSR collaboration proposal',
      ],
      createdAt: 'Jan 12, 2025',
      updatedAt: 'Jan 17, 2025',
    },
    {
      id: 'TSK-013',
      title: 'Prepare onboarding documents for new hires',
      category: 'jobs',
      priority: 'medium',
      status: 'in-progress',
      dueDate: '2025-01-27',
      assignedTo: 'Self',
      relatedModule: 'Jobs Management',
      description:
        'Compile and organize onboarding packages for the 3 new employees starting in February.',
      pendingItems: 5,
      details: [
        'Employment contracts - 3 copies',
        'Company handbook distribution',
        'IT access request forms',
        'Safety induction schedule',
        'Department orientation plan',
      ],
      createdAt: 'Jan 15, 2025',
      updatedAt: 'Jan 19, 2025',
    },
    {
      id: 'TSK-014',
      title: 'Upload new ISO 14001 certification',
      category: 'resources',
      priority: 'high',
      status: 'completed',
      dueDate: '2025-01-15',
      assignedTo: 'Self',
      relatedModule: 'Resources Center',
      description:
        'Upload the newly received ISO 14001:2015 environmental management certification to the Resources Center.',
      pendingItems: 0,
      details: [
        'Certificate scanned and uploaded',
        'Category and tags updated',
        'Notification sent to stakeholders',
      ],
      createdAt: 'Jan 03, 2025',
      updatedAt: 'Jan 15, 2025',
    },
    {
      id: 'TSK-015',
      title: 'Resolve urgent supplier inquiry about payment',
      category: 'inquiries',
      priority: 'high',
      status: 'completed',
      dueDate: '2025-01-16',
      assignedTo: 'Self',
      relatedModule: 'Inquiries',
      description:
        'Respond to Kansanshi Mining supplier inquiry regarding delayed payment for equipment delivery.',
      pendingItems: 0,
      details: [
        'Payment status verified with finance',
        'Response sent with payment timeline',
        'Follow-up scheduled for Jan 20',
      ],
      createdAt: 'Jan 04, 2025',
      updatedAt: 'Jan 16, 2025',
    },
  ]);

  const categoryModuleMap: Record<string, string> = {
    jobs: 'Jobs Management',
    resources: 'Resources Center',
    inquiries: 'Inquiries',
  };

  const categories = ['All', 'jobs', 'resources', 'inquiries'];
  const priorities = ['All', 'high', 'medium', 'low'];
  const statuses = ['All', 'pending', 'in-progress', 'overdue', 'completed'];

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
  };

  const calcDaysLeft = (dateStr: string) => {
    const target = new Date(dateStr);
    const now = new Date();
    return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  };

  const activeTasks = tasks.filter((t) => t.status !== 'completed');
  const completedTasks = tasks.filter((t) => t.status === 'completed');

  const stats = [
    { label: 'Total Active', value: activeTasks.length, icon: 'ri-task-line', color: 'blue' },
    {
      label: 'High Priority',
      value: tasks.filter((t) => t.priority === 'high' && t.status !== 'completed').length,
      icon: 'ri-alarm-warning-line',
      color: 'red',
    },
    { label: 'In Progress', value: tasks.filter((t) => t.status === 'in-progress').length, icon: 'ri-loader-4-line', color: 'yellow' },
    { label: 'Overdue', value: tasks.filter((t) => t.status === 'overdue').length, icon: 'ri-time-line', color: 'orange' },
  ];

  const handleSort = (field: TaskSortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const getFilteredTasks = () => {
    const baseTasks = activeTab === 'completed' ? completedTasks : activeTasks;
    return baseTasks.filter((t) => {
      const matchesSearch =
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.relatedModule.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategory === 'All' || t.category === filterCategory;
      const matchesPriority = filterPriority === 'All' || t.priority === filterPriority;
      const matchesStatus = filterStatus === 'All' || t.status === filterStatus;
      return matchesSearch && matchesCategory && matchesPriority && matchesStatus;
    });
  };

  const getSortedTasks = () => {
    const filtered = getFilteredTasks();
    return [...filtered].sort((a, b) => {
      let aVal: string | number = '';
      let bVal: string | number = '';
      switch (sortField) {
        case 'title':
          aVal = a.title.toLowerCase();
          bVal = b.title.toLowerCase();
          break;
        case 'module':
          aVal = a.relatedModule.toLowerCase();
          bVal = b.relatedModule.toLowerCase();
          break;
        case 'priority': {
          const order: Record<string, number> = { high: 3, medium: 2, low: 1 };
          aVal = order[a.priority] || 0;
          bVal = order[b.priority] || 0;
          break;
        }
        case 'status':
          aVal = a.status;
          bVal = b.status;
          break;
        case 'dueDate':
          aVal = new Date(a.dueDate).getTime();
          bVal = new Date(b.dueDate).getTime();
          break;
        case 'pendingItems':
          aVal = a.pendingItems;
          bVal = b.pendingItems;
          break;
      }
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const sortedTasks = getSortedTasks();
  const totalPages = Math.ceil(sortedTasks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTasks = sortedTasks.slice(startIndex, startIndex + itemsPerPage);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  const handleSelectAll = () => {
    const items = getFilteredTasks().map((t) => t.id);
    setSelectedItems(selectedItems.length === items.length ? [] : items);
  };

  const handleSelectItem = (id: string) => {
    setSelectedItems((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const handleDelete = () => {
    setTasks((prev) => prev.filter((t) => !selectedItems.includes(t.id)));
    setSelectedItems([]);
    setShowDeleteModal(false);
    showToastMessage(`${selectedItems.length} task(s) deleted successfully`);
  };

  const resetForm = () => {
    setFormData({ title: '', category: 'jobs', priority: 'medium', status: 'pending', dueDate: '', assignedTo: 'Self', description: '', details: '' });
  };

  const handleCreateTask = () => {
    if (!formData.title.trim() || !formData.dueDate) {
      showToastMessage('Please fill in all required fields');
      return;
    }
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
    const newTask: Task = {
      id: `TSK-${Date.now()}`,
      title: formData.title,
      category: formData.category,
      priority: formData.priority,
      status: formData.status,
      dueDate: formData.dueDate,
      assignedTo: formData.assignedTo,
      relatedModule: categoryModuleMap[formData.category] || 'Jobs Management',
      description: formData.description,
      pendingItems: formData.details.split('\n').filter((l) => l.trim()).length,
      details: formData.details.split('\n').filter((l) => l.trim()),
      createdAt: dateStr,
      updatedAt: dateStr,
    };
    setTasks((prev) => [newTask, ...prev]);
    setShowCreateModal(false);
    resetForm();
    showToastMessage('Task created successfully');
  };

  const handleEditTask = () => {
    if (!editingTask || !formData.title.trim() || !formData.dueDate) return;
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
    setTasks((prev) =>
      prev.map((t) =>
        t.id === editingTask.id
          ? {
              ...t,
              title: formData.title,
              category: formData.category,
              priority: formData.priority,
              status: formData.status,
              dueDate: formData.dueDate,
              assignedTo: formData.assignedTo,
              relatedModule: categoryModuleMap[formData.category] || t.relatedModule,
              description: formData.description,
              pendingItems:
                formData.status === 'completed' ? 0 : formData.details.split('\n').filter((l) => l.trim()).length,
              details: formData.details.split('\n').filter((l) => l.trim()),
              updatedAt: dateStr,
            }
          : t
      )
    );
    setShowEditModal(false);
    setEditingTask(null);
    resetForm();
    showToastMessage('Task updated successfully');
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      category: task.category,
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate,
      assignedTo: task.assignedTo,
      description: task.description,
      details: task.details.join('\n'),
    });
    setShowEditModal(true);
  };

  const handleViewTask = (task: Task) => {
    setViewingTask(task);
    setShowViewModal(true);
  };

  const markAsComplete = (task: Task) => {
    setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, status: 'completed', pendingItems: 0 } : t)));
    showToastMessage('Task marked as complete');
  };

  const toggleStatus = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const statusOrder = ['pending', 'in-progress', 'completed'];
          const currentIndex = statusOrder.indexOf(t.status === 'overdue' ? 'pending' : t.status);
          const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length];
          return { ...t, status: nextStatus, pendingItems: nextStatus === 'completed' ? 0 : t.pendingItems };
        }
        return t;
      })
    );
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const getCategoryLabel = (cat: string) => {
    const labels: Record<string, string> = { jobs: 'Jobs', resources: 'Resources', inquiries: 'Inquiries' };
    return labels[cat] || cat;
  };

  const getCategoryIcon = (cat: string) => {
    const icons: Record<string, string> = { jobs: 'ri-briefcase-line', resources: 'ri-folder-line', inquiries: 'ri-mail-line' };
    return icons[cat] || 'ri-task-line';
  };

  const getCategoryStyle = (cat: string) => {
    const styles: Record<string, string> = {
      jobs: darkMode ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-50 text-amber-700',
      resources: darkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-50 text-emerald-700',
      inquiries: darkMode ? 'bg-cyan-500/20 text-cyan-400' : 'bg-cyan-50 text-cyan-700',
    };
    return styles[cat] || (darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-100 text-gray-600');
  };

  const getPriorityBadge = (priority: string) => {
    const styles: Record<string, string> = {
      high: darkMode ? 'bg-red-500/20 text-red-400' : 'bg-red-50 text-red-700',
      medium: darkMode ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-50 text-yellow-700',
      low: darkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-50 text-green-700',
    };
    const dots: Record<string, string> = { high: 'bg-red-500', medium: 'bg-yellow-500', low: 'bg-green-500' };
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium capitalize ${styles[priority] || ''}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${dots[priority] || 'bg-gray-400'}`} />
        {priority}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: darkMode ? 'bg-gray-500/20 text-gray-400' : 'bg-gray-100 text-gray-600',
      'in-progress': darkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-50 text-blue-700',
      overdue: darkMode ? 'bg-red-500/20 text-red-400' : 'bg-red-50 text-red-700',
      completed: darkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-50 text-green-700',
    };
    const dots: Record<string, string> = { pending: 'bg-gray-400', 'in-progress': 'bg-blue-500', overdue: 'bg-red-500', completed: 'bg-green-500' };
    const labels: Record<string, string> = { pending: 'Pending', 'in-progress': 'In Progress', overdue: 'Overdue', completed: 'Completed' };
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${styles[status] || ''}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${dots[status] || 'bg-gray-400'}`} />
        {labels[status] || status}
      </span>
    );
  };

  const renderSortIcon = (field: TaskSortField) => {
    const isActive = sortField === field;
    return <i className={`ml-1 ${isActive ? (sortDirection === 'asc' ? 'ri-arrow-up-line' : 'ri-arrow-down-line') : 'ri-arrow-up-down-line opacity-40'}`} />;
  };

  const completedCount = completedTasks.length;

  const renderToggle = (enabled: boolean, onToggle: () => void) => (
    <button
      onClick={onToggle}
      className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer flex-shrink-0 ${enabled ? 'bg-red-600' : darkMode ? 'bg-gray-600' : 'bg-gray-300'}`}
    >
      <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${enabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
    </button>
  );

  const handleSaveNotifSettings = () => {
    setNotifSaved(true);
    showToastMessage('Notification settings saved successfully');
    setTimeout(() => setNotifSaved(false), 2000);
  };

  const handleAddRecipient = () => {
    if (!newRecipientEmail.trim() || !newRecipientName.trim()) return;
    setNotifSettings((prev) => ({
      ...prev,
      recipients: [...prev.recipients, { email: newRecipientEmail.trim(), name: newRecipientName.trim(), enabled: true }],
    }));
    setNewRecipientEmail('');
    setNewRecipientName('');
    setShowAddRecipientModal(false);
    showToastMessage('Recipient added successfully');
  };

  const handleRemoveRecipient = (index: number) => {
    setNotifSettings((prev) => ({ ...prev, recipients: prev.recipients.filter((_, i) => i !== index) }));
  };

  const toggleRecipient = (index: number) => {
    setNotifSettings((prev) => ({
      ...prev,
      recipients: prev.recipients.map((r, i) => (i === index ? { ...r, enabled: !r.enabled } : r)),
    }));
  };

  const renderFormModal = (isEdit: boolean) => {
    const onSubmit = isEdit ? handleEditTask : handleCreateTask;
    const onClose = () => {
      if (isEdit) {
        setShowEditModal(false);
        setEditingTask(null);
      } else {
        setShowCreateModal(false);
      }
      resetForm();
    };
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
        <div className={`w-full max-w-xl rounded-xl my-8 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className={`flex items-center justify-between p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'Merriweather, serif' }}>
              {isEdit ? 'Edit Task' : 'Create New Task'}
            </h3>
            <button onClick={onClose} className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}>
              <i className="ri-close-line text-xl" />
            </button>
          </div>
          <div className="p-6 space-y-4 max-h-[65vh] overflow-y-auto">
            <div>
              <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className={`w-full px-4 py-2.5 rounded-lg text-sm ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-red-600`}
                placeholder="Enter task title"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Module *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-lg text-sm cursor-pointer ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-red-600`}
                >
                  <option value="jobs">Jobs Management</option>
                  <option value="resources">Resources Center</option>
                  <option value="inquiries">Inquiries</option>
                </select>
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-lg text-sm cursor-pointer ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-red-600`}
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Due Date *</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-lg text-sm ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-red-600`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-lg text-sm cursor-pointer ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-red-600`}
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="overdue">Overdue</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Assigned To</label>
              <input
                type="text"
                value={formData.assignedTo}
                onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                className={`w-full px-4 py-2.5 rounded-lg text-sm ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-red-600`}
                placeholder="e.g. Self, Team Member"
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value.slice(0, 500) })}
                rows={3}
                maxLength={500}
                className={`w-full px-4 py-2.5 rounded-lg text-sm resize-none ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-red-600`}
                placeholder="Describe the task..."
              />
              <p className={`text-xs mt-1 text-right ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{formData.description.length}/500</p>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Subtasks <span className={`font-normal ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>(one per line)</span></label>
              <textarea
                value={formData.details}
                onChange={(e) => setFormData({ ...formData, details: e.target.value.slice(0, 500) })}
                rows={3}
                maxLength={500}
                className={`w-full px-4 py-2.5 rounded-lg text-sm resize-none ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-red-600`}
                placeholder="Enter subtasks, one per line..."
              />
              <p className={`text-xs mt-1 text-right ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{formData.details.length}/500</p>
            </div>
          </div>
          <div className={`flex gap-3 p-6 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <button onClick={onClose} className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
              Cancel
            </button>
            <button
              onClick={onSubmit}
              disabled={!formData.title.trim() || !formData.dueDate}
              className="flex-1 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isEdit ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderNotificationSettings = () => (
    <div className="p-6 space-y-8">
      {/* Master Toggle */}
      <div className={`flex items-center justify-between p-5 rounded-lg border ${darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${darkMode ? 'bg-red-600/20' : 'bg-red-50'}`}>
            <i className={`ri-mail-settings-line text-xl ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
          </div>
          <div>
            <h3 className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Email Notifications</h3>
            <p className={`text-xs mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Receive email alerts for task activities and due dates</p>
          </div>
        </div>
        <button
          onClick={() => setNotifSettings((prev) => ({ ...prev, enableEmailNotifications: !prev.enableEmailNotifications }))}
          className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer flex-shrink-0 ${notifSettings.enableEmailNotifications ? 'bg-red-600' : darkMode ? 'bg-gray-600' : 'bg-gray-300'}`}
        >
          <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${notifSettings.enableEmailNotifications ? 'translate-x-6' : 'translate-x-0.5'}`} />
        </button>
      </div>

      {notifSettings.enableEmailNotifications && (
        <>
          {/* Due Date Reminders */}
          <div>
            <h4 className={`text-sm font-semibold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              <i className="ri-calendar-check-line" /> Due Date Reminders
            </h4>
            <div className={`rounded-lg border divide-y ${darkMode ? 'bg-gray-800 border-gray-700 divide-gray-700' : 'bg-white border-gray-200 divide-gray-100'}`}>
              {[
                { key: 'dueDateReminder3Days', icon: 'ri-calendar-event-line', label: '3 Days Before Due', desc: 'Get notified 3 days before a task is due', color: 'green' },
                { key: 'dueDateReminder1Day', icon: 'ri-calendar-todo-line', label: '1 Day Before Due', desc: 'Get notified 1 day before a task is due', color: 'yellow' },
                { key: 'dueDateReminderSameDay', icon: 'ri-calendar-check-line', label: 'On Due Date', desc: 'Get notified on the day a task is due', color: 'red' },
                { key: 'overdueAlerts', icon: 'ri-error-warning-line', label: 'Overdue Alerts', desc: 'Get notified when a task becomes overdue', color: 'red' },
              ].map((item) => {
                const colorMap: Record<string, { bg: string; text: string }> = {
                  green: { bg: darkMode ? 'bg-green-500/15' : 'bg-green-50', text: darkMode ? 'text-green-400' : 'text-green-600' },
                  yellow: { bg: darkMode ? 'bg-yellow-500/15' : 'bg-yellow-50', text: darkMode ? 'text-yellow-400' : 'text-yellow-600' },
                  red: { bg: darkMode ? 'bg-red-500/15' : 'bg-red-50', text: darkMode ? 'text-red-400' : 'text-red-600' },
                };
                const c = colorMap[item.color] || colorMap.green;
                return (
                  <div key={item.key} className={`flex items-center justify-between px-5 py-4 transition-colors ${darkMode ? 'hover:bg-gray-700/30' : 'hover:bg-gray-50/50'}`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${c.bg}`}>
                        <i className={`${item.icon} text-base ${c.text}`} />
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{item.label}</p>
                        <p className={`text-xs mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{item.desc}</p>
                      </div>
                    </div>
                    {renderToggle((notifSettings as any)[item.key], () =>
                      setNotifSettings((prev) => ({ ...prev, [item.key]: !(prev as any)[item.key] }))
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Task Activity Alerts */}
          <div>
            <h4 className={`text-sm font-semibold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              <i className="ri-notification-3-line" /> Task Activity Alerts
            </h4>
            <div className={`rounded-lg border divide-y ${darkMode ? 'bg-gray-800 border-gray-700 divide-gray-700' : 'bg-white border-gray-200 divide-gray-100'}`}>
              {[
                { key: 'highPriorityAlerts', icon: 'ri-alarm-warning-line', label: 'High Priority Tasks', desc: 'Get immediate alerts for high priority task updates', color: 'red' },
                { key: 'statusChangeAlerts', icon: 'ri-exchange-line', label: 'Status Changes', desc: 'Get notified when task status changes', color: 'blue' },
                { key: 'taskCompletionNotify', icon: 'ri-checkbox-circle-line', label: 'Task Completion', desc: 'Get notified when tasks are marked complete', color: 'green' },
                { key: 'newTaskAssigned', icon: 'ri-user-add-line', label: 'New Task Assigned', desc: 'Get notified when a new task is assigned to you', color: 'teal' },
              ].map((item) => {
                const colorMap: Record<string, { bg: string; text: string }> = {
                  red: { bg: darkMode ? 'bg-red-500/15' : 'bg-red-50', text: darkMode ? 'text-red-400' : 'text-red-600' },
                  blue: { bg: darkMode ? 'bg-blue-500/15' : 'bg-blue-50', text: darkMode ? 'text-blue-400' : 'text-blue-600' },
                  green: { bg: darkMode ? 'bg-green-500/15' : 'bg-green-50', text: darkMode ? 'text-green-400' : 'text-green-600' },
                  teal: { bg: darkMode ? 'bg-teal-500/15' : 'bg-teal-50', text: darkMode ? 'text-teal-400' : 'text-teal-600' },
                };
                const c = colorMap[item.color] || colorMap.teal;
                return (
                  <div key={item.key} className={`flex items-center justify-between px-5 py-4 transition-colors ${darkMode ? 'hover:bg-gray-700/30' : 'hover:bg-gray-50/50'}`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${c.bg}`}>
                        <i className={`${item.icon} text-base ${c.text}`} />
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{item.label}</p>
                        <p className={`text-xs mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{item.desc}</p>
                      </div>
                    </div>
                    {renderToggle((notifSettings as any)[item.key], () =>
                      setNotifSettings((prev) => ({ ...prev, [item.key]: !(prev as any)[item.key] }))
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Summary Reports */}
          <div>
            <h4 className={`text-sm font-semibold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              <i className="ri-bar-chart-2-line" /> Summary Reports
            </h4>
            <div className={`rounded-lg border divide-y ${darkMode ? 'bg-gray-800 border-gray-700 divide-gray-700' : 'bg-white border-gray-200 divide-gray-100'}`}>
              {[
                { key: 'dailyDigest', icon: 'ri-sun-line', label: 'Daily Task Digest', desc: 'Receive a daily summary of pending and upcoming tasks at 8:00 AM' },
                { key: 'weeklyReport', icon: 'ri-calendar-line', label: 'Weekly Task Report', desc: 'Get a comprehensive weekly task progress report every Monday' },
              ].map((item) => (
                <div key={item.key} className={`flex items-center justify-between px-5 py-4 transition-colors ${darkMode ? 'hover:bg-gray-700/30' : 'hover:bg-gray-50/50'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      <i className={`${item.icon} text-base ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{item.label}</p>
                      <p className={`text-xs mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{item.desc}</p>
                    </div>
                  </div>
                  {renderToggle((notifSettings as any)[item.key], () =>
                    setNotifSettings((prev) => ({ ...prev, [item.key]: !(prev as any)[item.key] }))
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Frequency */}
          <div>
            <h4 className={`text-sm font-semibold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              <i className="ri-time-line" /> Delivery Frequency
            </h4>
            <div className={`rounded-lg border p-5 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                  { value: 'instant', label: 'Instant', desc: 'Real-time alerts', icon: 'ri-flashlight-line' },
                  { value: 'hourly', label: 'Hourly', desc: 'Batched every hour', icon: 'ri-timer-line' },
                  { value: 'daily', label: 'Daily', desc: 'Once per day at 8 AM', icon: 'ri-calendar-check-line' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setNotifSettings((prev) => ({ ...prev, frequency: opt.value as any }))}
                    className={`p-4 rounded-lg border-2 text-left transition-all cursor-pointer ${
                      notifSettings.frequency === opt.value
                        ? 'border-red-600 ' + (darkMode ? 'bg-red-600/10' : 'bg-red-50')
                        : darkMode
                        ? 'border-gray-600 hover:border-gray-500 bg-gray-700/50'
                        : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <i className={`${opt.icon} text-base ${notifSettings.frequency === opt.value ? 'text-red-600' : darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      <span className={`text-sm font-semibold ${notifSettings.frequency === opt.value ? (darkMode ? 'text-red-400' : 'text-red-600') : darkMode ? 'text-white' : 'text-gray-900'}`}>{opt.label}</span>
                    </div>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{opt.desc}</p>
                  </button>
                ))}
              </div>
              <div className={`flex items-center justify-between pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center gap-3">
                  <i className={`ri-moon-line ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <div>
                    <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Quiet Hours</p>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Pause notifications during off-hours</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {notifSettings.quietHoursEnabled && (
                    <div className="flex items-center gap-2">
                      <input
                        type="time"
                        value={notifSettings.quietHoursStart}
                        onChange={(e) => setNotifSettings((prev) => ({ ...prev, quietHoursStart: e.target.value }))}
                        className={`px-2 py-1 rounded-md text-xs ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-200'} border focus:outline-none focus:ring-1 focus:ring-red-600`}
                      />
                      <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>to</span>
                      <input
                        type="time"
                        value={notifSettings.quietHoursEnd}
                        onChange={(e) => setNotifSettings((prev) => ({ ...prev, quietHoursEnd: e.target.value }))}
                        className={`px-2 py-1 rounded-md text-xs ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-200'} border focus:outline-none focus:ring-1 focus:ring-red-600`}
                      />
                    </div>
                  )}
                  {renderToggle(notifSettings.quietHoursEnabled, () =>
                    setNotifSettings((prev) => ({ ...prev, quietHoursEnabled: !prev.quietHoursEnabled }))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Email Recipients */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className={`text-sm font-semibold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <i className="ri-group-line" /> Email Recipients
              </h4>
              <button
                onClick={() => setShowAddRecipientModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors cursor-pointer whitespace-nowrap"
              >
                <i className="ri-add-line" /> Add Recipient
              </button>
            </div>
            <div className={`rounded-lg border divide-y ${darkMode ? 'bg-gray-800 border-gray-700 divide-gray-700' : 'bg-white border-gray-200 divide-gray-100'}`}>
              {notifSettings.recipients.map((recipient, index) => (
                <div key={index} className={`flex items-center justify-between px-5 py-4 transition-colors ${darkMode ? 'hover:bg-gray-700/30' : 'hover:bg-gray-50/50'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-9 h-9 rounded flex items-center justify-center text-sm font-semibold flex-shrink-0 ${recipient.enabled ? (darkMode ? 'bg-red-600/20 text-red-400' : 'bg-red-50 text-red-600') : darkMode ? 'bg-gray-700 text-gray-500' : 'bg-gray-100 text-gray-400'}`}>
                      {recipient.name.charAt(0)}
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${recipient.enabled ? (darkMode ? 'text-white' : 'text-gray-900') : darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{recipient.name}</p>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{recipient.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {renderToggle(recipient.enabled, () => toggleRecipient(index))}
                    <button
                      onClick={() => handleRemoveRecipient(index)}
                      className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${darkMode ? 'hover:bg-red-600/20 text-gray-500 hover:text-red-400' : 'hover:bg-red-50 text-gray-400 hover:text-red-600'}`}
                      title="Remove"
                    >
                      <i className="ri-delete-bin-line text-sm" />
                    </button>
                  </div>
                </div>
              ))}
              {notifSettings.recipients.length === 0 && (
                <div className="py-10 text-center">
                  <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <i className={`ri-mail-add-line text-xl ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                  </div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No recipients added yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Save Button */}
          <div className={`flex items-center justify-between pt-6 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              <i className="ri-information-line mr-1" />Changes will take effect immediately after saving
            </p>
            <button
              onClick={handleSaveNotifSettings}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${notifSaved ? 'bg-green-600 text-white' : 'bg-red-600 text-white hover:bg-red-700'}`}
            >
              {notifSaved ? (
                <>
                  <i className="ri-check-line" /> Saved
                </>
              ) : (
                <>
                  <i className="ri-save-line" /> Save Settings
                </>
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className={`text-xl sm:text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'Merriweather, serif' }}>
            Tasks Management
          </h2>
          <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Track and manage tasks related to Jobs, Resources, and Inquiries
          </p>
        </div>
        {activeTab !== 'notifications' && (
          <button
            onClick={() => {
              resetForm();
              setShowCreateModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white hover:bg-red-700 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap self-start sm:self-auto"
          >
            <i className="ri-add-line text-lg" />
            New Task
          </button>
        )}
      </div>

      {/* Stats */}
      {activeTab !== 'notifications' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className={`p-5 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{stat.label}</p>
                  <p className={`text-2xl font-bold mt-1 ${darkMode ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'Merriweather, serif' }}>
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    stat.color === 'blue' ? (darkMode ? 'bg-blue-500/20' : 'bg-blue-50') : stat.color === 'red' ? (darkMode ? 'bg-red-600/20' : 'bg-red-50') : stat.color === 'yellow' ? (darkMode ? 'bg-yellow-500/20' : 'bg-yellow-50') : darkMode ? 'bg-orange-500/20' : 'bg-orange-50'
                  }`}
                >
                  <i
                    className={`${stat.icon} text-xl ${
                      stat.color === 'blue' ? (darkMode ? 'text-blue-400' : 'text-blue-600') : stat.color === 'red' ? (darkMode ? 'text-red-400' : 'text-red-600') : stat.color === 'yellow' ? (darkMode ? 'text-yellow-400' : 'text-yellow-600') : darkMode ? 'text-orange-400' : 'text-orange-600'
                    }`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Main Content Card */}
      <div className={`rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        {/* Tabs */}
        <div className={`px-4 pt-3 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} overflow-x-auto`}>
          <div className="flex items-center gap-1 min-w-max">
            <button
              onClick={() => {
                setActiveTab('tasks');
                setSelectedItems([]);
                setFilterStatus('All');
                setFilterCategory('All');
                setFilterPriority('All');
                setCurrentPage(1);
              }}
              className={`px-4 py-2.5 text-sm font-medium rounded-t-lg transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'tasks'
                  ? darkMode
                    ? 'bg-gray-700 text-white border border-b-0 border-gray-600'
                    : 'bg-white text-gray-900 border border-b-0 border-gray-200 shadow-sm'
                  : darkMode
                  ? 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <i className="ri-task-line mr-1.5" />
              Tasks
              <span
                className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
                  activeTab === 'tasks' ? (darkMode ? 'bg-red-600/20 text-red-400' : 'bg-red-50 text-red-600') : darkMode ? 'bg-gray-600 text-gray-400' : 'bg-gray-100 text-gray-500'
                }`}
              >
                {activeTasks.length}
              </span>
            </button>
            <button
              onClick={() => {
                setActiveTab('completed');
                setSelectedItems([]);
                setFilterStatus('All');
                setFilterCategory('All');
                setFilterPriority('All');
                setCurrentPage(1);
              }}
              className={`px-4 py-2.5 text-sm font-medium rounded-t-lg transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'completed'
                  ? darkMode
                    ? 'bg-gray-700 text-white border border-b-0 border-gray-600'
                    : 'bg-white text-gray-900 border border-b-0 border-gray-200 shadow-sm'
                  : darkMode
                  ? 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <i className="ri-checkbox-circle-line mr-1.5" />
              Completed
              {completedCount > 0 && (
                <span
                  className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
                    activeTab === 'completed' ? (darkMode ? 'bg-green-600/20 text-green-400' : 'bg-green-50 text-green-600') : darkMode ? 'bg-gray-600 text-gray-400' : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {completedCount}
                </span>
              )}
            </button>
            <button
              onClick={() => {
                setActiveTab('notifications');
                setSelectedItems([]);
              }}
              className={`px-4 py-2.5 text-sm font-medium rounded-t-lg transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'notifications'
                  ? darkMode
                    ? 'bg-gray-700 text-white border border-b-0 border-gray-600'
                    : 'bg-white text-gray-900 border border-b-0 border-gray-200 shadow-sm'
                  : darkMode
                  ? 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <i className="ri-settings-3-line mr-1.5" />
              Notification Settings
            </button>
          </div>
        </div>

        {activeTab === 'notifications' ? (
          renderNotificationSettings()
        ) : (
          <>
            {/* Filters */}
            <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex flex-col sm:flex-row sm:items-center justify-between gap-3`}>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="relative">
                  <i className={`ri-search-line absolute left-3 top-1/2 -translate-y-1/2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Search..."
                    className={`w-full sm:w-64 pl-10 pr-4 py-2 rounded-lg border text-sm ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500'} focus:outline-none focus:ring-2 focus:ring-red-600`}
                  />
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <select
                    value={filterCategory}
                    onChange={(e) => {
                      setFilterCategory(e.target.value);
                      setCurrentPage(1);
                    }}
                    className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm cursor-pointer ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-red-600`}
                  >
                    <option value="All">All Modules</option>
                    <option value="jobs">Jobs Management</option>
                    <option value="resources">Resources Center</option>
                    <option value="inquiries">Inquiries</option>
                  </select>
                  {activeTab === 'tasks' && (
                    <select
                      value={filterStatus}
                      onChange={(e) => {
                        setFilterStatus(e.target.value);
                        setCurrentPage(1);
                      }}
                      className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm cursor-pointer ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-red-600`}
                    >
                      <option value="All">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="overdue">Overdue</option>
                    </select>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3 self-end sm:self-auto">
                {selectedItems.length > 0 && (
                  <button onClick={() => setShowDeleteModal(true)} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors cursor-pointer whitespace-nowrap">
                    <i className="ri-delete-bin-line" />
                    Delete ({selectedItems.length})
                  </button>
                )}
                <div className="flex items-center rounded-lg overflow-hidden border border-gray-300">
                  <button
                    onClick={() => setViewMode('list')}
                    className={`w-10 h-9 flex items-center justify-center transition-colors cursor-pointer ${viewMode === 'list' ? 'bg-red-600 text-white' : 'bg-white text-black hover:bg-gray-100'}`}
                    title="List View"
                  >
                    <i className="ri-list-check text-lg" />
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`w-10 h-9 flex items-center justify-center transition-colors cursor-pointer ${viewMode === 'grid' ? 'bg-red-600 text-white' : 'bg-white text-black hover:bg-gray-100'}`}
                    title="Grid View"
                  >
                    <i className="ri-grid-fill text-lg" />
                  </button>
                </div>
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{sortedTasks.length} items</span>
              </div>
            </div>

            {/* Table / Grid Content */}
            <div className="overflow-x-auto">
              {viewMode === 'list' ? (
                <table className="w-full">
                  <thead className={darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}>
                    <tr>
                      <th className="w-12 px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedItems.length === getFilteredTasks().length && getFilteredTasks().length > 0}
                          onChange={handleSelectAll}
                          className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-600 cursor-pointer"
                        />
                      </th>
                      {[
                        { field: 'title' as TaskSortField, label: 'Title' },
                        { field: 'module' as TaskSortField, label: 'Module' },
                        { field: 'priority' as TaskSortField, label: 'Priority' },
                        { field: 'status' as TaskSortField, label: 'Status' },
                        { field: 'dueDate' as TaskSortField, label: 'Due Date' },
                        { field: 'pendingItems' as TaskSortField, label: 'Items' },
                      ].map((col) => (
                        <th
                          key={col.field}
                          onClick={() => handleSort(col.field)}
                          className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer transition-colors ${sortField === col.field ? 'text-red-600' : darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-700'}`}
                        >
                          <div className="flex items-center">{col.label}{renderSortIcon(col.field)}</div>
                        </th>
                      ))}
                      <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                    {paginatedTasks.map((task) => {
                      const daysLeft = calcDaysLeft(task.dueDate);
                      const isUrgent = task.status === 'overdue' || (daysLeft < 0 && task.status !== 'completed');
                      return (
                        <tr
                          key={task.id}
                          className={`transition-colors cursor-pointer ${darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'}`}
                          style={isUrgent ? { borderLeft: '4px solid #DC2626' } : undefined}
                          onClick={() => handleViewTask(task)}
                        >
                          <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              checked={selectedItems.includes(task.id)}
                              onChange={() => handleSelectItem(task.id)}
                              className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-600 cursor-pointer"
                            />
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getCategoryStyle(task.category)}`}>
                                <i className={`${getCategoryIcon(task.category)}`} />
                              </div>
                              <div>
                                <div className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-gray-900'} ${isUrgent ? 'font-bold' : ''}`}>{task.title}</div>
                                <div className={`text-xs mt-0.5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{task.id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`text-xs px-2.5 py-1 rounded-full ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>{getCategoryLabel(task.category)}</span>
                          </td>
                          <td className="px-4 py-4">{getPriorityBadge(task.priority)}</td>
                          <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                            <button onClick={() => toggleStatus(task.id)} className="cursor-pointer">{getStatusBadge(task.status)}</button>
                          </td>
                          <td className="px-4 py-4">
                            <div>
                              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{formatDate(task.dueDate)}</p>
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
                                  ? 'Done'
                                  : daysLeft < 0
                                  ? `${Math.abs(daysLeft)}d overdue`
                                  : `${daysLeft}d left`}
                              </p>
                            </div>
                          </td>
                          <td className={`px-4 py-4 text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{task.pendingItems}</td>
                          <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center gap-1">
                              {task.status !== 'completed' && (
                                <button
                                  onClick={() => markAsComplete(task)}
                                  className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${darkMode ? 'hover:bg-green-600/20 text-gray-400 hover:text-green-400' : 'hover:bg-green-50 text-gray-500 hover:text-green-600'}`}
                                  title="Complete"
                                >
                                  <i className="ri-checkbox-circle-line" />
                                </button>
                              )}
                              <button
                                onClick={() => handleViewTask(task)}
                                className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${darkMode ? 'hover:bg-gray-700 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'}`}
                                title="View"
                              >
                                <i className="ri-eye-line" />
                              </button>
                              <button
                                onClick={() => openEditModal(task)}
                                className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${darkMode ? 'hover:bg-gray-700 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'}`}
                                title="Edit"
                              >
                                <i className="ri-pencil-line" />
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedItems([task.id]);
                                  setShowDeleteModal(true);
                                }}
                                className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${darkMode ? 'hover:bg-red-600/20 text-gray-400 hover:text-red-400' : 'hover:bg-red-50 text-gray-500 hover:text-red-600'}`}
                                title="Delete"
                              >
                                <i className="ri-delete-bin-line" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <div className="p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {paginatedTasks.map((task) => {
                      const daysLeft = calcDaysLeft(task.dueDate);
                      const isUrgent = task.status === 'overdue' || (daysLeft < 0 && task.status !== 'completed');
                      return (
                        <div
                          key={task.id}
                          className={`rounded-lg border p-4 transition-all hover:shadow-lg cursor-pointer ${darkMode ? 'bg-gray-700/50 border-gray-600 hover:border-gray-500' : 'bg-white border-gray-200 hover:border-gray-300'} ${selectedItems.includes(task.id) ? 'ring-2 ring-red-600' : ''} ${isUrgent ? 'border-l-4 border-l-red-500' : ''}`}
                          onClick={() => handleViewTask(task)}
                        >
                          <div className="flex items-start justify-between mb-3" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              checked={selectedItems.includes(task.id)}
                              onChange={() => handleSelectItem(task.id)}
                              className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-600 cursor-pointer"
                            />
                            {getPriorityBadge(task.priority)}
                          </div>
                          <div className={`w-full h-16 rounded-lg flex items-center justify-center mb-3 ${getCategoryStyle(task.category)}`}>
                            <i className={`${getCategoryIcon(task.category)} text-2xl`} />
                          </div>
                          <h3 className={`text-sm font-semibold mb-1 line-clamp-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{task.title}</h3>
                          <div className="flex items-center justify-between mb-2">
                            <span className={`text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>{getCategoryLabel(task.category)}</span>
                            {getStatusBadge(task.status)}
                          </div>
                          <div className={`flex items-center justify-between text-xs mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            <span>{formatDate(task.dueDate)}</span>
                            <span className="flex items-center gap-1"><i className="ri-list-check" />{task.pendingItems} items</span>
                          </div>
                          <div className={`flex items-center justify-center gap-1 pt-3 border-t ${darkMode ? 'border-gray-600' : 'border-gray-200'}`} onClick={(e) => e.stopPropagation()}>
                            {task.status !== 'completed' && (
                              <button
                                onClick={() => markAsComplete(task)}
                                className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${darkMode ? 'hover:bg-green-600/20 text-gray-400 hover:text-green-400' : 'hover:bg-green-50 text-gray-500 hover:text-green-600'}`}
                                title="Complete"
                              >
                                <i className="ri-checkbox-circle-line" />
                              </button>
                            )}
                            <button
                              onClick={() => openEditModal(task)}
                              className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${darkMode ? 'hover:bg-gray-600 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'}`}
                              title="Edit"
                            >
                              <i className="ri-pencil-line" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedItems([task.id]);
                                setShowDeleteModal(true);
                              }}
                              className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${darkMode ? 'hover:bg-red-600/20 text-gray-400 hover:text-red-400' : 'hover:bg-red-50 text-gray-500 hover:text-red-600'}`}
                              title="Delete"
                            >
                              <i className="ri-delete-bin-line" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {sortedTasks.length === 0 && (
                <div className="py-16 text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <i className={`ri-task-line text-3xl ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                  </div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>No tasks found</p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className={`px-4 sm:px-6 py-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex flex-col sm:flex-row items-center justify-between gap-3`}>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${currentPage === 1 ? (darkMode ? 'bg-gray-700 text-gray-600 cursor-not-allowed' : 'bg-gray-100 text-gray-400 cursor-not-allowed') : darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                      <i className="ri-arrow-left-s-line" />
                    </button>
                    {getPageNumbers().map((page, index) =>
                      typeof page === 'number' ? (
                        <button
                          key={index}
                          onClick={() => setCurrentPage(page)}
                          className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors cursor-pointer ${currentPage === page ? 'bg-red-600 text-white' : darkMode ? 'bg-gray-700 text-gray-400 hover:text-white' : 'bg-gray-100 text-gray-700 hover:text-gray-900'}`}
                        >
                          {page}
                        </button>
                      ) : (
                        <span key={index} className={`w-8 h-8 flex items-center justify-center ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{page}</span>
                      )
                    )}
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${currentPage === totalPages ? (darkMode ? 'bg-gray-700 text-gray-600 cursor-not-allowed' : 'bg-gray-100 text-gray-400 cursor-not-allowed') : darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                      <i className="ri-arrow-right-s-line" />
                    </button>
                  </div>
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, sortedTasks.length)} of {sortedTasks.length}</span>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && renderFormModal(false)}

      {/* Edit Modal */}
      {showEditModal && renderFormModal(true)}

      {/* View Task Modal */}
      {showViewModal && viewingTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowViewModal(false)} />
          <div className={`relative w-full max-w-2xl rounded-xl shadow-xl overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className={`px-6 py-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between`}>
              <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'Merriweather, serif' }}>Task Details</h3>
              <button onClick={() => setShowViewModal(false)} className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}>
                <i className="ri-close-line text-xl" />
              </button>
            </div>
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="flex items-center gap-2 flex-wrap mb-4">
                <span className={`text-xs px-2.5 py-1 rounded-full ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>{viewingTask.id}</span>
                <span className={`text-xs px-2.5 py-1 rounded-md ${getCategoryStyle(viewingTask.category)}`}>{getCategoryLabel(viewingTask.category)}</span>
                {getPriorityBadge(viewingTask.priority)}
                {getStatusBadge(viewingTask.status)}
              </div>

              <h4 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{viewingTask.title}</h4>
              <p className={`text-sm mb-4 flex items-center gap-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <i className="ri-stack-line" /> {viewingTask.pendingItems} pending items &middot; {viewingTask.relatedModule}
              </p>

              <div className={`rounded-lg p-4 mb-4 ${darkMode ? 'bg-gray-700/50 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{viewingTask.description}</p>
              </div>

              {viewingTask.details.length > 0 && (
                <div className="mb-4">
                  <h5 className={`text-sm font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Subtasks / Checklist</h5>
                  <ul className="space-y-2">
                    {viewingTask.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <i className={`ri-checkbox-blank-circle-line text-sm mt-0.5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                        <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className={`grid grid-cols-2 gap-4 p-4 rounded-lg border ${darkMode ? 'bg-gray-700/30 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                <div>
                  <p className={`text-xs font-medium mb-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Assigned To</p>
                  <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{viewingTask.assignedTo}</p>
                </div>
                <div>
                  <p className={`text-xs font-medium mb-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Module</p>
                  <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{viewingTask.relatedModule}</p>
                </div>
                <div>
                  <p className={`text-xs font-medium mb-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Due Date</p>
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{formatDate(viewingTask.dueDate)}</p>
                </div>
                <div>
                  <p className={`text-xs font-medium mb-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Last Updated</p>
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{viewingTask.updatedAt}</p>
                </div>
              </div>
            </div>
            <div className={`px-6 py-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-end gap-3`}>
              {viewingTask.status !== 'completed' && (
                <button
                  onClick={() => {
                    markAsComplete(viewingTask);
                    setShowViewModal(false);
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap border ${darkMode ? 'border-green-600 text-green-400 hover:bg-green-600/20' : 'border-green-600 text-green-600 hover:bg-green-50'}`}
                >
                  <i className="ri-checkbox-circle-line mr-1.5" />Mark Complete
                </button>
              )}
              <button
                onClick={() => {
                  setShowViewModal(false);
                  openEditModal(viewingTask);
                }}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-colors cursor-pointer whitespace-nowrap"
              >
                <i className="ri-pencil-line mr-1.5" />Edit Task
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-md rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-red-100"><i className="ri-delete-bin-line text-2xl text-red-600" /></div>
            <h3 className={`text-xl font-bold text-center mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Delete {selectedItems.length} task(s)?</h3>
            <p className={`text-sm text-center mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => { setShowDeleteModal(false); setSelectedItems([]); }} className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>Cancel</button>
              <button onClick={handleDelete} className="flex-1 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors cursor-pointer whitespace-nowrap">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Recipient Modal */}
      {showAddRecipientModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-md rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Add Email Recipient</h3>
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Name</label>
                <input
                  type="text"
                  value={newRecipientName}
                  onChange={(e) => setNewRecipientName(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-lg text-sm ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-red-600`}
                  placeholder="e.g., John Doe"
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email</label>
                <input
                  type="email"
                  value={newRecipientEmail}
                  onChange={(e) => setNewRecipientEmail(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-lg text-sm ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-red-600`}
                  placeholder="e.g., john@example.com"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowAddRecipientModal(false)} className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>Cancel</button>
              <button
                onClick={handleAddRecipient}
                disabled={!newRecipientEmail.trim() || !newRecipientName.trim()}
                className="flex-1 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Recipient
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
          <div className={`flex items-center gap-3 px-5 py-3 rounded-lg shadow-lg ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-900 text-white'}`}>
            <i className="ri-check-line text-green-400" />
            <span className="text-sm">{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTasksManagement;
