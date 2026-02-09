import { useState, useEffect } from 'react';

interface Deadline {
  id: string;
  title: string;
  module: string;
  type: string;
  priority: string;
  status: string;
  dueDate: string;
  description: string;
  assignedTo: string;
  createdAt: string;
  items: number;
  reminderSent?: boolean;
}

type DeadlineSortField = 'title' | 'module' | 'priority' | 'status' | 'dueDate' | 'type';
type SortDirection = 'asc' | 'desc';

interface Props {
  darkMode: boolean;
}

const categoryModuleMap: Record<string, string> = {
  jobs: 'Jobs',
  resources: 'Resources',
  inquiries: 'Inquiries',
};

const categoryTypeMap: Record<string, string[]> = {
  jobs: ['Job Posting', 'Interview Deadline', 'Hiring Deadline'],
  resources: ['Resource Upload', 'Resource Review', 'Document Update'],
  inquiries: ['Inquiry Response', 'Follow-up Deadline', 'Escalation Deadline'],
};

const UserDeadlinesManagement = ({ darkMode }: Props) => {
  const [deadlines, setDeadlines] = useState<Deadline[]>([
    {
      id: 'DL-001',
      title: 'Submit Q4 Financial Report',
      module: 'Resources',
      type: 'Resource Upload',
      priority: 'High',
      status: 'Active',
      dueDate: '2025-01-15',
      description: 'Prepare and submit the quarterly financial report for Q4 2024',
      assignedTo: 'Finance Team',
      reminderSent: false,
      createdAt: '2024-12-01',
      items: 5
    },
    {
      id: 'DL-002',
      title: 'Review Job Applications for Plant Manager',
      module: 'Jobs',
      type: 'Interview Deadline',
      priority: 'High',
      status: 'Active',
      dueDate: '2025-01-18',
      description: 'Screen and shortlist candidates for Plant Manager position',
      assignedTo: 'HR Department',
      reminderSent: true,
      createdAt: '2024-12-05',
      items: 12
    },
    {
      id: 'DL-003',
      title: 'Respond to Environmental Compliance Inquiry',
      module: 'Inquiries',
      type: 'Inquiry Response',
      priority: 'High',
      status: 'Active',
      dueDate: '2025-01-20',
      description: 'Provide detailed response to regulatory inquiry about emissions',
      assignedTo: 'Compliance Team',
      reminderSent: false,
      createdAt: '2024-12-10',
      items: 3
    },
    {
      id: 'DL-004',
      title: 'Update Safety Certification Documents',
      module: 'Resources',
      type: 'Document Update',
      priority: 'Medium',
      status: 'Active',
      dueDate: '2025-01-25',
      description: 'Review and update all safety certification documents',
      assignedTo: 'Safety Officer',
      reminderSent: false,
      createdAt: '2024-12-12',
      items: 8
    },
    {
      id: 'DL-005',
      title: 'Finalize Hiring for Technical Positions',
      module: 'Jobs',
      type: 'Hiring Deadline',
      priority: 'Medium',
      status: 'Active',
      dueDate: '2025-01-28',
      description: 'Complete hiring process for 3 technical positions',
      assignedTo: 'HR Department',
      reminderSent: false,
      createdAt: '2024-12-15',
      items: 3
    },
    {
      id: 'DL-006',
      title: 'Follow-up on Partnership Inquiry',
      module: 'Inquiries',
      type: 'Follow-up Deadline',
      priority: 'Low',
      status: 'Active',
      dueDate: '2025-02-01',
      description: 'Schedule follow-up meeting with potential partner',
      assignedTo: 'Business Development',
      reminderSent: false,
      createdAt: '2024-12-18',
      items: 2
    },
    {
      id: 'DL-007',
      title: 'Submit Annual Sustainability Report',
      module: 'Resources',
      type: 'Resource Upload',
      priority: 'High',
      status: 'Completed',
      dueDate: '2024-12-31',
      description: 'Compile and submit the annual sustainability report',
      assignedTo: 'Sustainability Team',
      reminderSent: true,
      createdAt: '2024-11-01',
      items: 15
    },
    {
      id: 'DL-008',
      title: 'Complete Background Checks for New Hires',
      module: 'Jobs',
      type: 'Hiring Deadline',
      priority: 'Medium',
      status: 'Completed',
      dueDate: '2024-12-28',
      description: 'Finalize background verification for all new hires',
      assignedTo: 'HR Department',
      reminderSent: true,
      createdAt: '2024-11-15',
      items: 5
    }
  ]);

  const [activeTab, setActiveTab] = useState<'deadlines' | 'completed' | 'notifications'>('deadlines');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterModule, setFilterModule] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<DeadlineSortField>('dueDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSendReminderModal, setShowSendReminderModal] = useState(false);
  const [editingDeadline, setEditingDeadline] = useState<Deadline | null>(null);
  const [viewingDeadline, setViewingDeadline] = useState<Deadline | null>(null);
  const [reminderDeadline, setReminderDeadline] = useState<Deadline | null>(null);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    type: 'Job Posting',
    category: 'jobs',
    date: '',
    priority: 'Medium',
    status: 'Active',
    description: '',
    assignedTo: 'Self',
    details: '',
  });

  const [reminderEmail, setReminderEmail] = useState('');
  const [reminderMessage, setReminderMessage] = useState('');

  // Notification settings
  const [notifSettings, setNotifSettings] = useState({
    enableEmailNotifications: true,
    dueDateReminder7Days: true,
    dueDateReminder3Days: true,
    dueDateReminder1Day: true,
    dueDateReminderSameDay: true,
    overdueAlerts: true,
    urgentPriorityAlerts: true,
    statusChangeAlerts: true,
    completionNotify: false,
    newDeadlineAssigned: true,
    dailyDigest: false,
    weeklyReport: true,
    frequency: 'instant' as 'instant' | 'hourly' | 'daily',
    recipients: [
      { email: 'user@mopanicopper.com', name: 'Deadline Manager', enabled: true },
      { email: 'admin@mopanicopper.com', name: 'Admin Team', enabled: true },
    ],
    quietHoursEnabled: false,
    quietHoursStart: '22:00',
    quietHoursEnd: '07:00',
  });
  const [showAddRecipientModal, setShowAddRecipientModal] = useState(false);
  const [newRecipientEmail, setNewRecipientEmail] = useState('');
  const [newRecipientName, setNewRecipientName] = useState('');

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

  const activeDeadlines = deadlines.filter((d) => d.status !== 'Completed');
  const completedDeadlines = deadlines.filter((d) => d.status === 'Completed');

  const stats = [
    { label: 'Total Active', value: activeDeadlines.length, icon: 'ri-calendar-check-line', color: 'blue' },
    { label: 'Urgent', value: deadlines.filter((d) => d.priority === 'High' && d.status !== 'Completed').length, icon: 'ri-alarm-warning-line', color: 'red' },
    { label: 'Overdue', value: deadlines.filter((d) => calcDaysLeft(d.dueDate) < 0 && d.status !== 'Completed').length, icon: 'ri-time-line', color: 'orange' },
    { label: 'Completed', value: completedDeadlines.length, icon: 'ri-checkbox-circle-line', color: 'green' },
  ];

  const handleSort = (field: DeadlineSortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const getFilteredDeadlines = () => {
    const base = activeTab === 'completed' ? completedDeadlines : activeDeadlines;
    return base.filter((d) => {
      const matchesSearch =
        d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.module.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesModule = filterModule === 'All' || d.module === filterModule;
      const matchesPriority = filterPriority === 'All' || d.priority === filterPriority;
      const matchesStatus = filterStatus === 'All' || d.status === filterStatus;
      return matchesSearch && matchesModule && matchesPriority && matchesStatus;
    });
  };

  const getSortedDeadlines = () => {
    const filtered = getFilteredDeadlines();
    return [...filtered].sort((a, b) => {
      let aVal: string | number = '';
      let bVal: string | number = '';
      switch (sortField) {
        case 'title':
          aVal = a.title.toLowerCase();
          bVal = b.title.toLowerCase();
          break;
        case 'module':
          aVal = a.module.toLowerCase();
          bVal = b.module.toLowerCase();
          break;
        case 'priority': {
          const order: Record<string, number> = { High: 3, Medium: 2, Low: 1 };
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
        case 'type':
          aVal = a.type.toLowerCase();
          bVal = b.type.toLowerCase();
          break;
      }
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const sortedDeadlines = getSortedDeadlines();
  const totalPages = Math.ceil(sortedDeadlines.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDeadlines = sortedDeadlines.slice(startIndex, startIndex + itemsPerPage);

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
    const items = paginatedDeadlines.map((d) => d.id);
    setSelectedItems(selectedItems.length === items.length ? [] : items);
  };

  const handleSelectItem = (id: string) => {
    setSelectedItems((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const handleBulkDelete = () => {
    setDeadlines((prev) => prev.filter((d) => !selectedItems.includes(d.id)));
    setSelectedItems([]);
    setShowDeleteModal(false);
    showToastMessage(`${selectedItems.length} deadline(s) deleted successfully`);
  };

  const resetForm = () => {
    setFormData({ title: '', type: 'Job Posting', category: 'jobs', date: '', priority: 'Medium', status: 'Active', description: '', assignedTo: 'Self', details: '' });
  };

  const handleCreateDeadline = () => {
    if (!formData.title.trim() || !formData.date) {
      showToastMessage('Please fill in all required fields');
      return;
    }
    const newId = `DL-${String(deadlines.length + 1).padStart(3, '0')}`;
    const newDeadline: Deadline = {
      id: newId,
      title: formData.title,
      type: formData.type,
      module: categoryModuleMap[formData.category] || 'Jobs',
      dueDate: formData.date,
      priority: formData.priority,
      status: formData.status,
      description: formData.description,
      assignedTo: formData.assignedTo,
      createdAt: new Date().toISOString().split('T')[0],
      items: 0,
      reminderSent: false,
    };
    setDeadlines((prev) => [newDeadline, ...prev]);
    setShowCreateModal(false);
    resetForm();
    showToastMessage('Deadline created successfully');
  };

  const handleEditDeadline = () => {
    if (!editingDeadline || !formData.title.trim() || !formData.date) return;
    setDeadlines((prev) =>
      prev.map((d) =>
        d.id === editingDeadline.id
          ? {
              ...d,
              title: formData.title,
              type: formData.type,
              module: categoryModuleMap[formData.category] || d.module,
              dueDate: formData.date,
              priority: formData.priority,
              status: formData.status,
              assignedTo: formData.assignedTo,
              description: formData.description,
            }
          : d
      )
    );
    setShowEditModal(false);
    setEditingDeadline(null);
    resetForm();
    showToastMessage('Deadline updated successfully');
  };

  const openEditModal = (deadline: Deadline) => {
    setEditingDeadline(deadline);
    const category = Object.keys(categoryModuleMap).find(k => categoryModuleMap[k] === deadline.module) || 'jobs';
    setFormData({
      title: deadline.title,
      type: deadline.type,
      category,
      date: deadline.dueDate,
      priority: deadline.priority,
      status: deadline.status,
      assignedTo: deadline.assignedTo,
      description: deadline.description,
      details: '',
    });
    setShowEditModal(true);
  };

  const handleViewDeadline = (deadline: Deadline) => {
    setViewingDeadline(deadline);
    setShowViewModal(true);
  };

  const toggleStatus = (id: string) => {
    setDeadlines((prev) =>
      prev.map((d) => {
        if (d.id === id) {
          return { ...d, status: d.status === 'Active' ? 'Completed' : 'Active' };
        }
        return d;
      })
    );
  };

  const openSendReminderModal = (deadline: Deadline) => {
    const dLeft = calcDaysLeft(deadline.dueDate);
    setReminderDeadline(deadline);
    setReminderEmail(notifSettings.recipients[0]?.email || '');
    setReminderMessage(
      `Reminder: "${deadline.title}" is due in ${dLeft} day${dLeft !== 1 ? 's' : ''} (${new Date(deadline.dueDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}). Please complete all actions before the deadline.`
    );
    setShowSendReminderModal(true);
  };

  const handleSendReminder = () => {
    if (!reminderDeadline || !reminderEmail.trim()) {
      showToastMessage('Please enter a valid email');
      return;
    }
    setDeadlines((prev) =>
      prev.map((d) => (d.id === reminderDeadline.id ? { ...d, reminderSent: true } : d))
    );
    showToastMessage(`Reminder sent to ${reminderEmail}`);
    setShowSendReminderModal(false);
    setReminderDeadline(null);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const getPriorityBadge = (priority: string) => {
    const styles: Record<string, string> = {
      High: darkMode ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-50 text-orange-700',
      Medium: darkMode ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-50 text-yellow-700',
      Low: darkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-50 text-green-700',
    };
    const dots: Record<string, string> = { High: 'bg-orange-500', Medium: 'bg-yellow-500', Low: 'bg-green-500' };
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium capitalize ${styles[priority] || ''}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${dots[priority] || 'bg-gray-400'}`} />
        {priority}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      Active: darkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-50 text-blue-700',
      Completed: darkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-50 text-green-700',
    };
    const dots: Record<string, string> = { Active: 'bg-blue-500', Completed: 'bg-green-500' };
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${styles[status] || ''}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${dots[status] || 'bg-gray-400'}`} />
        {status}
      </span>
    );
  };

  const getModuleBadge = (module: string) => {
    const styles: Record<string, string> = {
      Jobs: darkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-50 text-blue-700',
      Resources: darkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-50 text-green-700',
      Inquiries: darkMode ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-50 text-purple-700',
    };
    const icons: Record<string, string> = {
      Jobs: 'ri-briefcase-line',
      Resources: 'ri-folder-line',
      Inquiries: 'ri-mail-line',
    };
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${styles[module] || ''}`}>
        <i className={icons[module] || 'ri-calendar-todo-line'} />
        {module}
      </span>
    );
  };

  const renderSortIcon = (field: DeadlineSortField) => {
    const isActive = sortField === field;
    return <i className={`ml-1 ${isActive ? (sortDirection === 'asc' ? 'ri-arrow-up-line' : 'ri-arrow-down-line') : 'ri-arrow-up-down-line opacity-40'}`} />;
  };

  const completedCount = completedDeadlines.length;

  const renderToggle = (enabled: boolean, onToggle: () => void) => (
    <button
      onClick={onToggle}
      className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer flex-shrink-0 ${enabled ? 'bg-red-600' : darkMode ? 'bg-gray-600' : 'bg-gray-300'}`}
    >
      <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${enabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
    </button>
  );

  const handleSaveNotifSettings = () => {
    showToastMessage('Notification settings saved successfully');
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
    const onSubmit = isEdit ? handleEditDeadline : handleCreateDeadline;
    const onClose = () => {
      if (isEdit) {
        setShowEditModal(false);
        setEditingDeadline(null);
      } else {
        setShowCreateModal(false);
      }
      resetForm();
    };
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
        <div className={darkMode ? "w-full max-w-xl rounded-xl my-8 bg-gray-800" : "w-full max-w-xl rounded-xl my-8 bg-white"}>
          <div className={`flex items-center justify-between p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'Merriweather, serif' }}>
              {isEdit ? 'Edit Deadline' : 'Create New Deadline'}
            </h3>
            <button onClick={onClose} className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}>
              <i className="ri-close-line text-xl" />
            </button>
          </div>
          <div className="p-6 space-y-4 max-h-[65vh] overflow-y-auto">
            <div>
              <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Title *</label>
              <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className={`w-full px-4 py-2.5 rounded-lg text-sm ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-red-600`} placeholder="Enter deadline title" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Module *</label>
                <select
                  value={formData.category}
                  onChange={(e) => {
                    const c = e.target.value;
                    setFormData({ ...formData, category: c, type: categoryTypeMap[c]?.[0] || 'Job Posting' });
                  }}
                  className={`w-full px-4 py-2.5 rounded-lg text-sm cursor-pointer ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-red-600`}
                >
                  <option value="jobs">Jobs Management</option>
                  <option value="resources">Resources Center</option>
                  <option value="inquiries">Inquiries</option>
                </select>
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-lg text-sm cursor-pointer ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-red-600`}
                >
                  {(categoryTypeMap[formData.category] || []).map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Due Date *</label>
                <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className={`w-full px-4 py-2.5 rounded-lg text-sm ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-red-600`} />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-lg text-sm cursor-pointer ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-red-600`}
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-lg text-sm cursor-pointer ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-red-600`}
                >
                  <option value="Active">Active</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Assigned To</label>
                <input type="text" value={formData.assignedTo} onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })} className={`w-full px-4 py-2.5 rounded-lg text-sm ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-red-600`} placeholder="e.g. Self, Team Member" />
              </div>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value.slice(0, 500) })}
                rows={3}
                maxLength={500}
                className={`w-full px-4 py-2.5 rounded-lg text-sm resize-none ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-red-600`}
                placeholder="Describe the deadline..."
              />
              <p className={`text-xs mt-1 text-right ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{formData.description.length}/500</p>
            </div>
          </div>
          <div className={`flex gap-3 p-6 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <button onClick={onClose} className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
              Cancel
            </button>
            <button
              onClick={onSubmit}
              disabled={!formData.title.trim() || !formData.date}
              className="flex-1 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isEdit ? 'Save Changes' : 'Create Deadline'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className={`text-xl sm:text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'Merriweather, serif' }}>
            Deadlines Management
          </h2>
          <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Track and manage deadlines for Jobs, Resources, and Inquiries
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
            New Deadline
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
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  stat.color === 'blue' ? (darkMode ? 'bg-blue-500/20' : 'bg-blue-50') :
                  stat.color === 'red' ? (darkMode ? 'bg-red-600/20' : 'bg-red-50') :
                  stat.color === 'orange' ? (darkMode ? 'bg-orange-500/20' : 'bg-orange-50') :
                  darkMode ? 'bg-green-500/20' : 'bg-green-50'
                }`}>
                  <i className={`${stat.icon} text-xl ${
                    stat.color === 'blue' ? (darkMode ? 'text-blue-400' : 'text-blue-600') :
                    stat.color === 'red' ? (darkMode ? 'text-red-400' : 'text-red-600') :
                    stat.color === 'orange' ? (darkMode ? 'text-orange-400' : 'text-orange-600') :
                    darkMode ? 'text-green-400' : 'text-green-600'
                  }`} />
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
                setActiveTab('deadlines');
                setSelectedItems([]);
                setFilterStatus('All');
                setFilterModule('All');
                setFilterPriority('All');
                setCurrentPage(1);
              }}
              className={`px-4 py-2.5 text-sm font-medium rounded-t-lg transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'deadlines'
                  ? darkMode ? 'bg-gray-700 text-white border border-b-0 border-gray-600' : 'bg-white text-gray-900 border border-b-0 border-gray-200 shadow-sm'
                  : darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700/50' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <i className="ri-calendar-todo-line mr-1.5" />
              Deadlines
              <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
                activeTab === 'deadlines' ? (darkMode ? 'bg-red-600/20 text-red-400' : 'bg-red-50 text-red-600') : darkMode ? 'bg-gray-600 text-gray-400' : 'bg-gray-100 text-gray-500'
              }`}>
                {activeDeadlines.length}
              </span>
            </button>
            <button
              onClick={() => {
                setActiveTab('completed');
                setSelectedItems([]);
                setFilterStatus('All');
                setFilterModule('All');
                setFilterPriority('All');
                setCurrentPage(1);
              }}
              className={`px-4 py-2.5 text-sm font-medium rounded-t-lg transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'completed'
                  ? darkMode ? 'bg-gray-700 text-white border border-b-0 border-gray-600' : 'bg-white text-gray-900 border border-b-0 border-gray-200 shadow-sm'
                  : darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700/50' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <i className="ri-checkbox-circle-line mr-1.5" />
              Completed
              {completedCount > 0 && (
                <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
                  activeTab === 'completed' ? (darkMode ? 'bg-green-600/20 text-green-400' : 'bg-green-50 text-green-600') : darkMode ? 'bg-gray-600 text-gray-400' : 'bg-gray-100 text-gray-500'
                }`}>
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
                  ? darkMode ? 'bg-gray-700 text-white border border-b-0 border-gray-600' : 'bg-white text-gray-900 border border-b-0 border-gray-200 shadow-sm'
                  : darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700/50' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <i className="ri-settings-3-line mr-1.5" />
              Notification Settings
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'notifications' ? (
          <div className="p-6 space-y-6">
            {/* Master Toggle */}
            <div className={`p-5 rounded-lg border ${darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${darkMode ? 'bg-red-600/20' : 'bg-red-50'}`}>
                    <i className={`ri-notification-3-line text-lg ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
                  </div>
                  <div>
                    <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Email Notifications</h4>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Receive deadline alerts via email</p>
                  </div>
                </div>
                {renderToggle(notifSettings.enableEmailNotifications, () =>
                  setNotifSettings((prev) => ({ ...prev, enableEmailNotifications: !prev.enableEmailNotifications }))
                )}
              </div>
            </div>

            {/* Notification Types */}
            <div>
              <h4 className={`text-sm font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Notification Types</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { key: 'dueDateReminder7Days', icon: 'ri-calendar-event-line', label: '7 Days Before', desc: 'Reminder 7 days before due date' },
                  { key: 'dueDateReminder3Days', icon: 'ri-calendar-check-line', label: '3 Days Before', desc: 'Reminder 3 days before due date' },
                  { key: 'dueDateReminder1Day', icon: 'ri-alarm-warning-line', label: '1 Day Before', desc: 'Reminder 1 day before due date' },
                  { key: 'dueDateReminderSameDay', icon: 'ri-time-line', label: 'Same Day', desc: 'Reminder on the due date' },
                  { key: 'overdueAlerts', icon: 'ri-error-warning-line', label: 'Overdue Alerts', desc: 'Alert when deadline is overdue' },
                  { key: 'urgentPriorityAlerts', icon: 'ri-fire-line', label: 'Urgent Priority', desc: 'Alert for urgent deadlines' },
                  { key: 'statusChangeAlerts', icon: 'ri-refresh-line', label: 'Status Changes', desc: 'Notify on status updates' },
                  { key: 'newDeadlineAssigned', icon: 'ri-add-circle-line', label: 'New Assignments', desc: 'Alert for new deadlines' },
                ].map((item) => (
                  <div key={item.key} className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-700/30 border-gray-600' : 'bg-white border-gray-200'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${darkMode ? 'bg-gray-600' : 'bg-gray-100'}`}>
                          <i className={`${item.icon} ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                        </div>
                        <div>
                          <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{item.label}</p>
                          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{item.desc}</p>
                        </div>
                      </div>
                      {renderToggle(notifSettings[item.key as keyof typeof notifSettings] as boolean, () =>
                        setNotifSettings((prev) => ({ ...prev, [item.key]: !prev[item.key as keyof typeof prev] }))
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Frequency */}
            <div>
              <h4 className={`text-sm font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Delivery Frequency</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { value: 'instant', icon: 'ri-flashlight-line', label: 'Instant', desc: 'Immediate notifications' },
                  { value: 'hourly', icon: 'ri-time-line', label: 'Hourly', desc: 'Batched every hour' },
                  { value: 'daily', icon: 'ri-calendar-line', label: 'Daily', desc: 'Once per day digest' },
                ].map((freq) => (
                  <button
                    key={freq.value}
                    onClick={() => setNotifSettings((prev) => ({ ...prev, frequency: freq.value as 'instant' | 'hourly' | 'daily' }))}
                    className={`p-4 rounded-lg border text-left transition-all cursor-pointer ${
                      notifSettings.frequency === freq.value
                        ? darkMode ? 'bg-red-600/20 border-red-600 ring-2 ring-red-600/50' : 'bg-red-50 border-red-600 ring-2 ring-red-600/30'
                        : darkMode ? 'bg-gray-700/30 border-gray-600 hover:border-gray-500' : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                        notifSettings.frequency === freq.value
                          ? darkMode ? 'bg-red-600/30' : 'bg-red-100'
                          : darkMode ? 'bg-gray-600' : 'bg-gray-100'
                      }`}>
                        <i className={`${freq.icon} ${
                          notifSettings.frequency === freq.value
                            ? darkMode ? 'text-red-400' : 'text-red-600'
                            : darkMode ? 'text-gray-300' : 'text-gray-600'
                        }`} />
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${
                          notifSettings.frequency === freq.value
                            ? darkMode ? 'text-red-400' : 'text-red-600'
                            : darkMode ? 'text-white' : 'text-gray-900'
                        }`}>{freq.label}</p>
                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{freq.desc}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quiet Hours */}
            <div className={`p-5 rounded-lg border ${darkMode ? 'bg-gray-700/30 border-gray-600' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${darkMode ? 'bg-gray-600' : 'bg-gray-100'}`}>
                    <i className={`ri-moon-line text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                  </div>
                  <div>
                    <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Quiet Hours</h4>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Pause notifications during specific hours</p>
                  </div>
                </div>
                {renderToggle(notifSettings.quietHoursEnabled, () =>
                  setNotifSettings((prev) => ({ ...prev, quietHoursEnabled: !prev.quietHoursEnabled }))
                )}
              </div>
              {notifSettings.quietHoursEnabled && (
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className={`block text-xs font-medium mb-1.5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Start Time</label>
                    <input
                      type="time"
                      value={notifSettings.quietHoursStart}
                      onChange={(e) => setNotifSettings((prev) => ({ ...prev, quietHoursStart: e.target.value }))}
                      className={`w-full px-3 py-2 rounded-lg text-sm ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-red-600`}
                    />
                  </div>
                  <div>
                    <label className={`block text-xs font-medium mb-1.5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>End Time</label>
                    <input
                      type="time"
                      value={notifSettings.quietHoursEnd}
                      onChange={(e) => setNotifSettings((prev) => ({ ...prev, quietHoursEnd: e.target.value }))}
                      className={`w-full px-3 py-2 rounded-lg text-sm ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-red-600`}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Email Recipients */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Email Recipients</h4>
                <button
                  onClick={() => setShowAddRecipientModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white hover:bg-red-700 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap"
                >
                  <i className="ri-add-line" />
                  Add Recipient
                </button>
              </div>
              <div className="space-y-2">
                {notifSettings.recipients.map((recipient, index) => (
                  <div key={index} className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-700/30 border-gray-600' : 'bg-white border-gray-200'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${darkMode ? 'bg-gray-600' : 'bg-gray-100'}`}>
                          <i className={`ri-mail-line ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                        </div>
                        <div>
                          <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{recipient.name}</p>
                          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{recipient.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {renderToggle(recipient.enabled, () => toggleRecipient(index))}
                        <button
                          onClick={() => handleRemoveRecipient(index)}
                          className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${darkMode ? 'hover:bg-gray-600 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
                        >
                          <i className="ri-delete-bin-line" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-4">
              <button
                onClick={handleSaveNotifSettings}
                className="px-6 py-2.5 bg-red-600 text-white hover:bg-red-700 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap"
              >
                <i className="ri-save-line mr-2" />
                Save Settings
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Filters and Controls */}
            <div className="p-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="relative w-full sm:w-64 flex-shrink-0">
                  <i className={`ri-search-line absolute left-3 top-1/2 -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Search deadlines..."
                    className={`w-full pl-10 pr-4 py-2 rounded-lg text-sm ${darkMode ? 'bg-gray-700 text-white border-gray-600 placeholder-gray-400' : 'bg-white text-gray-900 border-gray-300 placeholder-gray-500'} border focus:outline-none focus:ring-2 focus:ring-red-600`}
                  />
                </div>
                <select
                  value={filterModule}
                  onChange={(e) => {
                    setFilterModule(e.target.value);
                    setCurrentPage(1);
                  }}
                  className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm cursor-pointer ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-red-600`}
                >
                  <option value="All">All Modules</option>
                  <option value="Jobs">Jobs</option>
                  <option value="Resources">Resources</option>
                  <option value="Inquiries">Inquiries</option>
                </select>
                <select
                  value={filterPriority}
                  onChange={(e) => {
                    setFilterPriority(e.target.value);
                    setCurrentPage(1);
                  }}
                  className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm cursor-pointer ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-red-600`}
                >
                  <option value="All">All Priorities</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>

                {selectedItems.length > 0 && (
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <i className="ri-delete-bin-line" />
                    Delete ({selectedItems.length})
                  </button>
                )}

                <div className="flex items-center gap-3 sm:ml-auto self-end sm:self-auto">
                  <div className="flex items-center rounded-lg overflow-hidden border border-gray-300">
                    <button
                      onClick={() => setViewMode('list')}
                      className={`px-3 py-2 text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                        viewMode === 'list'
                          ? 'bg-red-600 text-white'
                          : 'bg-white text-black hover:bg-gray-100'
                      }`}
                    >
                      <i className="ri-list-check" />
                    </button>
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`px-3 py-2 text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                        viewMode === 'grid'
                          ? 'bg-red-600 text-white'
                          : 'bg-white text-black hover:bg-gray-100'
                      }`}
                    >
                      <i className="ri-grid-line" />
                    </button>
                  </div>
                  <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {sortedDeadlines.length} items
                  </span>
                </div>
              </div>
            </div>

            {/* Table or Grid View */}
            {viewMode === 'list' ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className={`border-y ${darkMode ? 'border-gray-700 bg-gray-700/50' : 'border-gray-200 bg-gray-50'}`}>
                    <tr>
                      <th className="px-4 py-3 text-left">
                        <input
                          type="checkbox"
                          checked={selectedItems.length === paginatedDeadlines.length && paginatedDeadlines.length > 0}
                          onChange={handleSelectAll}
                          className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-600 cursor-pointer"
                        />
                      </th>
                      <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} onClick={() => handleSort('title')}>
                        Title {renderSortIcon('title')}
                      </th>
                      <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} onClick={() => handleSort('module')}>
                        Module {renderSortIcon('module')}
                      </th>
                      <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} onClick={() => handleSort('priority')}>
                        Priority {renderSortIcon('priority')}
                      </th>
                      <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} onClick={() => handleSort('status')}>
                        Status {renderSortIcon('status')}
                      </th>
                      <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} onClick={() => handleSort('dueDate')}>
                        Due Date {renderSortIcon('dueDate')}
                      </th>
                      <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} onClick={() => handleSort('type')}>
                        Type {renderSortIcon('type')}
                      </th>
                      <th className={`px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                    {paginatedDeadlines.map((deadline) => {
                      const daysLeft = calcDaysLeft(deadline.dueDate);
                      const isUrgent = daysLeft <= 3 && daysLeft >= 0;
                      return (
                        <tr
                          key={deadline.id}
                          className={`${darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'} transition-colors cursor-pointer ${isUrgent ? 'border-l-4 border-l-red-600' : ''}`}
                          onClick={(e) => {
                            if ((e.target as HTMLElement).closest('button, input')) return;
                            handleViewDeadline(deadline);
                          }}
                        >
                          <td className="px-4 py-4">
                            <input
                              type="checkbox"
                              checked={selectedItems.includes(deadline.id)}
                              onChange={() => handleSelectItem(deadline.id)}
                              onClick={(e) => e.stopPropagation()}
                              className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-600 cursor-pointer"
                            />
                          </td>
                          <td className="px-4 py-4">
                            <div>
                              <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{deadline.title}</p>
                              <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{deadline.id}</p>
                            </div>
                          </td>
                          <td className="px-4 py-4">{getModuleBadge(deadline.module)}</td>
                          <td className="px-4 py-4">{getPriorityBadge(deadline.priority)}</td>
                          <td className="px-4 py-4">
                            <button onClick={(e) => { e.stopPropagation(); toggleStatus(deadline.id); }} className="cursor-pointer">
                              {getStatusBadge(deadline.status)}
                            </button>
                          </td>
                          <td className="px-4 py-4">
                            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>{formatDate(deadline.dueDate)}</p>
                            <p className={`text-xs ${daysLeft < 0 ? 'text-red-500' : darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                              {daysLeft < 0 ? `${Math.abs(daysLeft)} days overdue` : `${daysLeft} days left`}
                            </p>
                          </td>
                          <td className="px-4 py-4">
                            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{deadline.type}</p>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={(e) => { e.stopPropagation(); openEditModal(deadline); }}
                                className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${darkMode ? 'hover:bg-gray-600 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}
                                title="Edit"
                              >
                                <i className="ri-edit-line" />
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); setSelectedItems([deadline.id]); setShowDeleteModal(true); }}
                                className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${darkMode ? 'hover:bg-gray-600 text-red-400' : 'hover:bg-gray-100 text-red-600'}`}
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
              </div>
            ) : (
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {paginatedDeadlines.map((deadline) => {
                  const daysLeft = calcDaysLeft(deadline.dueDate);
                  const isUrgent = daysLeft <= 3 && daysLeft >= 0;
                  return (
                    <div
                      key={deadline.id}
                      className={`p-5 rounded-lg border transition-all cursor-pointer ${isUrgent ? 'border-l-4 border-l-red-600' : ''} ${darkMode ? 'bg-gray-700/30 border-gray-600 hover:bg-gray-700/50' : 'bg-white border-gray-200 hover:shadow-md'}`}
                      onClick={() => handleViewDeadline(deadline)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(deadline.id)}
                          onChange={() => handleSelectItem(deadline.id)}
                          onClick={(e) => e.stopPropagation()}
                          className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-600 cursor-pointer mt-1"
                        />
                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => { e.stopPropagation(); openEditModal(deadline); }}
                            className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${darkMode ? 'hover:bg-gray-600 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}
                          >
                            <i className="ri-edit-line" />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); setSelectedItems([deadline.id]); setShowDeleteModal(true); }}
                            className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${darkMode ? 'hover:bg-gray-600 text-red-400' : 'hover:bg-gray-100 text-red-600'}`}
                          >
                            <i className="ri-delete-bin-line" />
                          </button>
                        </div>
                      </div>
                      <h3 className={`text-base font-semibold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{deadline.title}</h3>
                      <p className={`text-xs mb-3 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{deadline.id}</p>
                      <p className={`text-sm mb-4 line-clamp-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{deadline.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {getModuleBadge(deadline.module)}
                        {getPriorityBadge(deadline.priority)}
                        <button onClick={(e) => { e.stopPropagation(); toggleStatus(deadline.id); }} className="cursor-pointer">
                          {getStatusBadge(deadline.status)}
                        </button>
                      </div>
                      <div className={`pt-4 border-t ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                        <div className="flex items-center justify-between text-sm">
                          <div>
                            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Due Date</p>
                            <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{formatDate(deadline.dueDate)}</p>
                          </div>
                          <div className="text-right">
                            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Time Left</p>
                            <p className={`font-medium ${daysLeft < 0 ? 'text-red-500' : darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {daysLeft < 0 ? `${Math.abs(daysLeft)}d overdue` : `${daysLeft} days`}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            <div className={`px-4 py-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Show</span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-sm cursor-pointer ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-red-600`}
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </select>
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, sortedDeadlines.length)} of {sortedDeadlines.length}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed ${darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'}`}
                  >
                    <i className="ri-arrow-left-s-line" />
                  </button>
                  {getPageNumbers().map((page, index) =>
                    typeof page === 'number' ? (
                      <button
                        key={index}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                          currentPage === page
                            ? darkMode ? 'bg-red-600/20 text-red-400' : 'bg-red-50 text-red-600'
                            : darkMode ? 'bg-gray-700/30 text-white hover:text-gray-100' : 'bg-gray-50 text-gray-700 hover:text-gray-900 border border-gray-300'
                        }`}
                      >
                        {page}
                      </button>
                    ) : (
                      <span key={index} className={`px-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        {page}
                      </span>
                    )
                  )}
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed ${darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'}`}
                  >
                    <i className="ri-arrow-right-s-line" />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modals */}
      {showCreateModal && renderFormModal(false)}
      {showEditModal && renderFormModal(true)}

      {/* View Modal */}
      {showViewModal && viewingDeadline && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-2xl rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className={`flex items-center justify-between p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'Merriweather, serif' }}>
                Deadline Details
              </h3>
              <button onClick={() => setShowViewModal(false)} className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}>
                <i className="ri-close-line text-xl" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h4 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{viewingDeadline.title}</h4>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{viewingDeadline.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className={`text-xs font-medium mb-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Module</p>
                  {getModuleBadge(viewingDeadline.module)}
                </div>
                <div>
                  <p className={`text-xs font-medium mb-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Type</p>
                  <p className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{viewingDeadline.type}</p>
                </div>
                <div>
                  <p className={`text-xs font-medium mb-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Priority</p>
                  {getPriorityBadge(viewingDeadline.priority)}
                </div>
                <div>
                  <p className={`text-xs font-medium mb-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Status</p>
                  {getStatusBadge(viewingDeadline.status)}
                </div>
                <div>
                  <p className={`text-xs font-medium mb-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Due Date</p>
                  <p className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{formatDate(viewingDeadline.dueDate)}</p>
                </div>
                <div>
                  <p className={`text-xs font-medium mb-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Assigned To</p>
                  <p className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{viewingDeadline.assignedTo}</p>
                </div>
              </div>
            </div>
            <div className={`flex gap-3 p-6 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <button onClick={() => setShowViewModal(false)} className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                Close
              </button>
              <button
                onClick={() => {
                  openEditModal(viewingDeadline);
                  setShowViewModal(false);
                }}
                className="flex-1 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors cursor-pointer whitespace-nowrap"
              >
                Edit Deadline
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-md rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className={`flex items-center justify-between p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'Merriweather, serif' }}>
                Confirm Delete
              </h3>
              <button onClick={() => setShowDeleteModal(false)} className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}>
                <i className="ri-close-line text-xl" />
              </button>
            </div>
            <div className="p-6">
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Are you sure you want to delete {selectedItems.length} deadline{selectedItems.length > 1 ? 's' : ''}? This action cannot be undone.
              </p>
            </div>
            <div className={`flex gap-3 p-6 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <button onClick={() => setShowDeleteModal(false)} className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                Cancel
              </button>
              <button onClick={handleBulkDelete} className="flex-1 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors cursor-pointer whitespace-nowrap">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Send Reminder Modal */}
      {showSendReminderModal && reminderDeadline && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-lg rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className={`flex items-center justify-between p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'Merriweather, serif' }}>
                Send Reminder
              </h3>
              <button onClick={() => setShowSendReminderModal(false)} className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}>
                <i className="ri-close-line text-xl" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Recipient Email</label>
                <input
                  type="email"
                  value={reminderEmail}
                  onChange={(e) => setReminderEmail(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-lg text-sm ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-red-600`}
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Message</label>
                <textarea
                  value={reminderMessage}
                  onChange={(e) => setReminderMessage(e.target.value.slice(0, 500))}
                  rows={5}
                  maxLength={500}
                  className={`w-full px-4 py-2.5 rounded-lg text-sm resize-none ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-red-600`}
                  placeholder="Enter reminder message..."
                />
                <p className={`text-xs mt-1 text-right ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{reminderMessage.length}/500</p>
              </div>
            </div>
            <div className={`flex gap-3 p-6 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <button onClick={() => setShowSendReminderModal(false)} className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                Cancel
              </button>
              <button onClick={handleSendReminder} className="flex-1 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors cursor-pointer whitespace-nowrap">
                <i className="ri-mail-send-line mr-2" />
                Send Reminder
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Recipient Modal */}
      {showAddRecipientModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-md rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className={`flex items-center justify-between p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'Merriweather, serif' }}>
                Add Recipient
              </h3>
              <button onClick={() => setShowAddRecipientModal(false)} className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}>
                <i className="ri-close-line text-xl" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Name</label>
                <input
                  type="text"
                  value={newRecipientName}
                  onChange={(e) => setNewRecipientName(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-lg text-sm ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-red-600`}
                  placeholder="Enter recipient name"
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email</label>
                <input
                  type="email"
                  value={newRecipientEmail}
                  onChange={(e) => setNewRecipientEmail(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-lg text-sm ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-red-600`}
                  placeholder="Enter email address"
                />
              </div>
            </div>
            <div className={`flex gap-3 p-6 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <button onClick={() => setShowAddRecipientModal(false)} className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                Cancel
              </button>
              <button
                onClick={handleAddRecipient}
                disabled={!newRecipientName.trim() || !newRecipientEmail.trim()}
                className="flex-1 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Recipient
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
          <div className={`px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
              <i className="ri-checkbox-circle-line text-green-500" />
            </div>
            <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{toastMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDeadlinesManagement;