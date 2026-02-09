import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  receivedAt: string;
  repliedAt?: string;
}

export default function InquiriesPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedInquiries, setSelectedInquiries] = useState<string[]>([]);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Sorting state
  const [sortColumn, setSortColumn] = useState<'name' | 'subject' | 'status' | 'receivedAt'>('receivedAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // View mode state
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn');
    if (!isLoggedIn) {
      navigate('/admin');
    }
  }, [navigate]);

  useEffect(() => {
    const saved = localStorage.getItem('adminDarkMode');
    if (saved) {
      setDarkMode(JSON.parse(saved));
    }
  }, []);

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

  const [inquiries, setInquiries] = useState<Inquiry[]>([
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@techcorp.com',
      phone: '+1 (555) 123-4567',
      company: 'TechCorp Industries',
      subject: 'Product Information',
      message: 'I am interested in learning more about your copper blister products. We are looking for a reliable supplier for our manufacturing operations. Could you please provide detailed specifications and pricing information?',
      status: 'new',
      receivedAt: '2024-01-20T10:30:00',
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.j@medicalplus.com',
      phone: '+1 (555) 234-5678',
      company: 'Medical Plus Healthcare',
      subject: 'Partnership Opportunity',
      message: 'We are a healthcare provider looking to establish a long-term partnership for medical gas supply. Our facilities require consistent and high-quality medical oxygen and nitrogen. Please contact us to discuss potential collaboration.',
      status: 'read',
      receivedAt: '2024-01-19T14:15:00',
    },
    {
      id: '3',
      name: 'Michael Chen',
      email: 'mchen@globalmanufacturing.com',
      phone: '+1 (555) 345-6789',
      company: 'Global Manufacturing Ltd',
      subject: 'General Inquiry',
      message: 'I visited your facility during the recent industry expo and was impressed by your operations. I would like to schedule a follow-up meeting to discuss potential business opportunities.',
      status: 'replied',
      receivedAt: '2024-01-18T09:45:00',
      repliedAt: '2024-01-18T16:30:00',
    },
    {
      id: '4',
      name: 'Emily Davis',
      email: 'emily.davis@university.edu',
      phone: '+1 (555) 456-7890',
      company: 'State University',
      subject: 'Career Inquiry',
      message: 'I am a final year engineering student interested in internship opportunities at RUBAMIN SARL. I have a strong background in metallurgical engineering and would love to contribute to your team.',
      status: 'new',
      receivedAt: '2024-01-20T08:00:00',
    },
    {
      id: '5',
      name: 'Robert Wilson',
      email: 'rwilson@industrialgas.com',
      phone: '+1 (555) 567-8901',
      company: 'Industrial Gas Solutions',
      subject: 'Technical Support',
      message: 'We recently purchased industrial gas equipment from your company and need technical assistance with the installation process. Please have your technical team contact us at the earliest.',
      status: 'read',
      receivedAt: '2024-01-17T11:20:00',
    },
    {
      id: '6',
      name: 'Lisa Anderson',
      email: 'l.anderson@constructco.com',
      phone: '+1 (555) 678-9012',
      company: 'ConstructCo Builders',
      subject: 'Product Information',
      message: 'We are expanding our construction operations and need bulk supply of industrial gases. Please send us your product catalog and bulk pricing details.',
      status: 'archived',
      receivedAt: '2024-01-10T15:45:00',
      repliedAt: '2024-01-11T10:00:00',
    },
    {
      id: '7',
      name: 'David Brown',
      email: 'dbrown@energysystems.com',
      phone: '+1 (555) 789-0123',
      company: 'Energy Systems Inc',
      subject: 'Partnership Opportunity',
      message: 'Our company specializes in renewable energy solutions. We believe there could be synergies between our organizations. Would you be open to exploring a strategic partnership?',
      status: 'new',
      receivedAt: '2024-01-20T16:00:00',
    },
  ]);

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
    { label: 'Dashboard', icon: 'ri-dashboard-3-line', path: '/admin/dashboard' },
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

  const statusCounts = {
    all: inquiries.length,
    new: inquiries.filter(i => i.status === 'new').length,
    read: inquiries.filter(i => i.status === 'read').length,
    replied: inquiries.filter(i => i.status === 'replied').length,
    archived: inquiries.filter(i => i.status === 'archived').length,
  };

  const subjects = ['all', 'General Inquiry', 'Product Information', 'Partnership Opportunity', 'Career Inquiry', 'Technical Support', 'Other'];

  const filteredInquiries = inquiries.filter(inquiry => {
    const matchesSearch = inquiry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         inquiry.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         inquiry.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         inquiry.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || inquiry.status === selectedStatus;
    const matchesSubject = selectedSubject === 'all' || inquiry.subject === selectedSubject;
    return matchesSearch && matchesStatus && matchesSubject;
  });

  // Sorting logic
  const sortedInquiries = [...filteredInquiries].sort((a, b) => {
    let compareValue = 0;
    
    switch (sortColumn) {
      case 'name':
        compareValue = a.name.localeCompare(b.name);
        break;
      case 'subject':
        compareValue = a.subject.localeCompare(b.subject);
        break;
      case 'status':
        compareValue = a.status.localeCompare(b.status);
        break;
      case 'receivedAt':
        compareValue = new Date(a.receivedAt).getTime() - new Date(b.receivedAt).getTime();
        break;
    }
    
    return sortDirection === 'asc' ? compareValue : -compareValue;
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedInquiries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedInquiries = sortedInquiries.slice(startIndex, endIndex);

  // Reset to page 1 when filters or sorting change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedStatus, selectedSubject, sortColumn, sortDirection]);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  const handleSelectAll = () => {
    if (selectedInquiries.length === paginatedInquiries.length) {
      setSelectedInquiries([]);
    } else {
      setSelectedInquiries(paginatedInquiries.map(i => i.id));
    }
  };

  const handleSelectInquiry = (id: string) => {
    if (selectedInquiries.includes(id)) {
      setSelectedInquiries(selectedInquiries.filter(i => i !== id));
    } else {
      setSelectedInquiries([...selectedInquiries, id]);
    }
  };

  const handleViewInquiry = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    setShowViewModal(true);
    if (inquiry.status === 'new') {
      setInquiries(prev => prev.map(i => i.id === inquiry.id ? { ...i, status: 'read' } : i));
    }
  };

  const handleReplyClick = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    setReplyMessage('');
    setShowReplyModal(true);
  };

  const handleSendReply = async () => {
    if (!selectedInquiry || !replyMessage.trim()) return;
    
    setIsSending(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setInquiries(prev => prev.map(i => 
      i.id === selectedInquiry.id 
        ? { ...i, status: 'replied', repliedAt: new Date().toISOString() } 
        : i
    ));
    
    setIsSending(false);
    setShowReplyModal(false);
    setReplyMessage('');
  };

  const handleDeleteClick = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (selectedInquiry) {
      setInquiries(prev => prev.filter(i => i.id !== selectedInquiry.id));
    }
    setShowDeleteModal(false);
    setSelectedInquiry(null);
  };

  const handleBulkArchive = () => {
    setInquiries(prev => prev.map(i => 
      selectedInquiries.includes(i.id) ? { ...i, status: 'archived' } : i
    ));
    setSelectedInquiries([]);
  };

  const handleBulkDelete = () => {
    setInquiries(prev => prev.filter(i => !selectedInquiries.includes(i.id)));
    setSelectedInquiries([]);
  };

  const handleMarkAsRead = (inquiry: Inquiry) => {
    setInquiries(prev => prev.map(i => 
      i.id === inquiry.id ? { ...i, status: 'read' } : i
    ));
  };

  const handleArchive = (inquiry: Inquiry) => {
    setInquiries(prev => prev.map(i => 
      i.id === inquiry.id ? { ...i, status: 'archived' } : i
    ));
  };

  const handleSort = (column: 'name' | 'subject' | 'status' | 'receivedAt') => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (column: 'name' | 'subject' | 'status' | 'receivedAt') => {
    if (sortColumn !== column) {
      return <i className={`ri-arrow-up-down-line text-xs ml-1 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />;
    }
    return sortDirection === 'asc' 
      ? <i className="ri-arrow-up-line text-xs ml-1" />
      : <i className="ri-arrow-down-line text-xs ml-1" />;
  };

  const getStatusBadge = (status: Inquiry['status']) => {
    const styles = {
      new: darkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-50 text-blue-700',
      read: darkMode ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-50 text-yellow-700',
      replied: darkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-50 text-green-700',
      archived: darkMode ? 'bg-gray-500/20 text-gray-400' : 'bg-gray-100 text-gray-600',
    };
    const dots = {
      new: 'bg-blue-500',
      read: 'bg-yellow-500',
      replied: 'bg-green-500',
      archived: 'bg-gray-400',
    };
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium capitalize ${styles[status]}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${dots[status]}`} />
        {status}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`min-h-screen flex ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Sidebar */}
      <aside className={`${sidebarCollapsed ? 'w-20' : 'w-64'} ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r flex flex-col fixed h-full transition-all duration-300 z-20`}>
        <div className={`p-5 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between`}>
          <Link to="/" className={`flex items-center gap-3 ${sidebarCollapsed ? 'justify-center' : ''}`}>
            <img
              src="https://static.readdy.ai/image/1b404af276821d98dfecb0eec592fbd4/2beca25c2dca50fd1a3109512ef52e33.png"
              alt="Logo"
              className="h-10 w-10 object-contain"
            />
            {!sidebarCollapsed && <span className={`text-xl font-bold tracking-wide ${darkMode ? 'text-white' : 'text-[#2C3E50]'}`}>RUBAMIN</span>}
          </Link>
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
                  placeholder="Search inquiries..."
                  className={`w-full pl-11 pr-4 py-2.5 ${darkMode ? 'bg-gray-700 text-white placeholder-gray-400 border-gray-600' : 'bg-gray-50 text-gray-900 placeholder-gray-500 border-gray-200'} border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all`}
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

              {/* Notifications */}
              <Link to="/admin/dashboard/notifications" className={`relative w-10 h-10 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}>
                <i className={`ri-notification-3-line text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
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
                  className={`w-10 h-10 rounded-lg flex items-center justify-center cursor-pointer overflow-hidden transition-all ${profileDropdownOpen ? 'ring-2 ring-red-600 ring-offset-2' : ''}`}
                  title={adminUser.name}
                >
                  <img 
                    src="https://readdy.ai/api/search-image?query=professional%20business%20person%20headshot%20portrait%20in%20formal%20attire%20with%20neutral%20background%20corporate%20style%20high%20quality%20photography%20clean%20simple%20background%20professional%20lighting%20confident%20expression&width=200&height=200&seq=admin-user-profile-pic&orientation=squarish"
                    alt={adminUser.name}
                    className="w-full h-full object-cover"
                  />
                </button>

                {profileDropdownOpen && (
                  <div className={`absolute right-0 top-full mt-2 w-56 rounded-lg shadow-lg border overflow-hidden z-50 ${
                    darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                  }`}>
                    {/* User Info Header */}
                    <div className={`px-4 py-3 border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                      <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{adminUser.name}</p>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{adminUser.email}</p>
                    </div>

                    {/* Menu Items */}
                    <div className="py-1">
                      <Link to="/admin/dashboard/profile" className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors cursor-pointer ${
                        darkMode 
                          ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}>
                        <i className="ri-user-line" />
                        My Profile
                      </Link>
                      <Link to="/admin/dashboard/settings" className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors cursor-pointer ${
                        darkMode 
                          ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}>
                        <i className="ri-settings-3-line" />
                        Account Settings
                      </Link>
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

        {/* Breadcrumb */}
        <div className={`px-8 py-3 border-b ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50/80 border-gray-200'}`}>
          <nav className="flex items-center gap-2 text-sm">
            <Link to="/" className={`flex items-center transition-colors cursor-pointer ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}>
              <i className="ri-home-4-line mr-1.5" />
              Home
            </Link>
            <i className={`ri-arrow-right-s-line ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
            <Link to="/admin/dashboard" className={`transition-colors cursor-pointer ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}>
              Dashboard
            </Link>
            <i className={`ri-arrow-right-s-line ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
            <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Inquiries</span>
          </nav>
        </div>

        {/* Page Content */}
        <div className="p-8">
          {/* Page Header + Stats Cards - Combined Container */}
          <div className={`rounded-lg border overflow-hidden mb-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            {/* Page Header */}
            <div className="p-6 pb-4">
              <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'Merriweather, serif' }}>
                Inquiries Management
              </h1>
              <p className={`mt-2 text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Manage and respond to contact form submissions
              </p>
            </div>

            {/* Stats Cards - No gap */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 px-6 pb-6">
              <div className={`rounded-lg p-6 border ${darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>New Inquiries</p>
                    <p className={`text-3xl font-bold mt-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{statusCounts.new}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${darkMode ? 'bg-red-600/20' : 'bg-red-50'}`}>
                    <i className={`ri-mail-unread-line text-xl ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
                  </div>
                </div>
              </div>
              <div className={`rounded-lg p-6 border ${darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Read</p>
                    <p className={`text-3xl font-bold mt-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{statusCounts.read}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${darkMode ? 'bg-yellow-500/20' : 'bg-yellow-50'}`}>
                    <i className={`ri-mail-open-line text-xl ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
                  </div>
                </div>
              </div>
              <div className={`rounded-lg p-6 border ${darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Replied</p>
                    <p className={`text-3xl font-bold mt-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{statusCounts.replied}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${darkMode ? 'bg-green-500/20' : 'bg-green-50'}`}>
                    <i className={`ri-reply-line text-xl ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                  </div>
                </div>
              </div>
              <div className={`rounded-lg p-6 border ${darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Archived</p>
                    <p className={`text-3xl font-bold mt-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{statusCounts.archived}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${darkMode ? 'bg-gray-500/20' : 'bg-gray-100'}`}>
                    <i className={`ri-inbox-archive-line text-xl ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters & Actions Bar */}
          <div className={`rounded-lg p-4 mb-6 border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="flex flex-wrap items-center gap-4">
              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <span className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Status:</span>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className={`px-3 py-2 rounded-lg text-sm border cursor-pointer ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-gray-50 border-gray-200 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-red-600`}
                >
                  <option value="all">All ({statusCounts.all})</option>
                  <option value="new">New ({statusCounts.new})</option>
                  <option value="read">Read ({statusCounts.read})</option>
                  <option value="replied">Replied ({statusCounts.replied})</option>
                  <option value="archived">Archived ({statusCounts.archived})</option>
                </select>
              </div>

              {/* Subject Filter */}
              <div className="flex items-center gap-2">
                <span className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Subject:</span>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className={`px-3 py-2 rounded-lg text-sm border cursor-pointer ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-gray-50 border-gray-200 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-red-600`}
                >
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>
                      {subject === 'all' ? 'All Subjects' : subject}
                    </option>
                  ))}
                </select>
              </div>

              {/* Bulk Actions */}
              {selectedInquiries.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {selectedInquiries.length} selected
                  </span>
                  <button 
                    onClick={handleBulkArchive}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                      darkMode 
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <i className="ri-inbox-archive-line mr-1" />
                    Archive
                  </button>
                  <button 
                    onClick={handleBulkDelete}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                      darkMode 
                        ? 'bg-red-600/20 text-red-400 hover:bg-red-600/30' 
                        : 'bg-red-50 text-red-600 hover:bg-red-100'
                    }`}
                  >
                    <i className="ri-delete-bin-line mr-1" />
                    Delete
                  </button>
                </div>
              )}

              {/* View Toggle & Item Count */}
              <div className="flex items-center gap-3 ml-auto">
                <div className={`flex items-center rounded-lg overflow-hidden border ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`w-10 h-9 flex items-center justify-center transition-colors cursor-pointer ${
                      viewMode === 'list'
                        ? 'bg-red-600 text-white'
                        : darkMode ? 'bg-gray-700 text-gray-400 hover:text-white' : 'bg-white text-gray-500 hover:text-gray-700'
                    }`}
                    title="List View"
                  >
                    <i className="ri-list-check text-lg" />
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`w-10 h-9 flex items-center justify-center transition-colors cursor-pointer ${
                      viewMode === 'grid'
                        ? 'bg-red-600 text-white'
                        : darkMode ? 'bg-gray-700 text-gray-400 hover:text-white' : 'bg-white text-gray-500 hover:text-gray-700'
                    }`}
                    title="Grid View"
                  >
                    <i className="ri-grid-fill text-lg" />
                  </button>
                </div>
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {sortedInquiries.length} items
                </span>
              </div>
            </div>
          </div>

          {/* Inquiries Table - List View */}
          {viewMode === 'list' ? (
          <div className={`rounded-lg border overflow-hidden ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                    <th className="px-4 py-4 text-left">
                      <input
                        type="checkbox"
                        checked={selectedInquiries.length === paginatedInquiries.length && paginatedInquiries.length > 0}
                        onChange={handleSelectAll}
                        className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-600/20 cursor-pointer"
                      />
                    </th>
                    <th 
                      className={`px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer select-none transition-colors ${
                        sortColumn === 'name' 
                          ? 'text-red-600' 
                          : darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'
                      }`}
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center">
                        Sender
                        {getSortIcon('name')}
                      </div>
                    </th>
                    <th 
                      className={`px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer select-none transition-colors ${
                        sortColumn === 'subject' 
                          ? 'text-red-600' 
                          : darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'
                      }`}
                      onClick={() => handleSort('subject')}
                    >
                      <div className="flex items-center">
                        Subject
                        {getSortIcon('subject')}
                      </div>
                    </th>
                    <th className={`px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider w-[150px] ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Message
                    </th>
                    <th 
                      className={`px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer select-none transition-colors ${
                        sortColumn === 'status' 
                          ? 'text-red-600' 
                          : darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'
                      }`}
                      onClick={() => handleSort('status')}
                    >
                      <div className="flex items-center">
                        Status
                        {getSortIcon('status')}
                      </div>
                    </th>
                    <th 
                      className={`px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer select-none transition-colors ${
                        sortColumn === 'receivedAt' 
                          ? 'text-red-600' 
                          : darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'
                      }`}
                      onClick={() => handleSort('receivedAt')}
                    >
                      <div className="flex items-center">
                        Received
                        {getSortIcon('receivedAt')}
                      </div>
                    </th>
                    <th className={`px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                  {paginatedInquiries.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-12 text-center">
                        <div className={`${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                          <i className="ri-inbox-line text-4xl mb-3 block" />
                          <p className="text-sm">No inquiries found</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedInquiries.map((inquiry) => (
                      <tr 
                        key={inquiry.id} 
                        className={`transition-colors cursor-pointer ${
                          darkMode 
                            ? 'hover:bg-gray-700/50' 
                            : 'hover:bg-gray-50'
                        } ${selectedInquiries.includes(inquiry.id) ? darkMode ? 'bg-gray-700/30' : 'bg-red-50/50' : ''}`}
                        style={inquiry.status === 'new' ? { borderLeft: '4px solid #DC2626' } : undefined}
                        onClick={() => handleViewInquiry(inquiry)}
                      >
                        <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={selectedInquiries.includes(inquiry.id)}
                            onChange={() => handleSelectInquiry(inquiry.id)}
                            className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-600/20 cursor-pointer"
                          />
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 ${
                              darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-100 text-gray-700'
                            }`}>
                              {inquiry.name.charAt(0)}
                            </div>
                            <div>
                              <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'} ${inquiry.status === 'new' ? 'font-semibold' : ''}`}>
                                {inquiry.name}
                              </p>
                              <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                {inquiry.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${
                            darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {inquiry.subject}
                          </span>
                        </td>
                        <td className="px-4 py-4 w-[150px] max-w-[150px]">
                          <p className={`text-sm truncate ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {inquiry.message}
                          </p>
                        </td>
                        <td className="px-4 py-4">
                          {getStatusBadge(inquiry.status)}
                        </td>
                        <td className="px-4 py-4">
                          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {formatDate(inquiry.receivedAt)}
                          </p>
                        </td>
                        <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleViewInquiry(inquiry)}
                              className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                                darkMode ? 'hover:bg-gray-700 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'
                              }`}
                              title="View"
                            >
                              <i className="ri-eye-line" />
                            </button>
                            <button
                              onClick={() => handleReplyClick(inquiry)}
                              className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                                darkMode ? 'hover:bg-green-600/20 text-gray-400 hover:text-green-400' : 'hover:bg-green-50 text-gray-500 hover:text-green-600'
                              }`}
                              title="Reply"
                            >
                              <i className="ri-reply-line" />
                            </button>
                            {inquiry.status !== 'archived' && (
                              <button
                                onClick={() => handleArchive(inquiry)}
                                className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                                  darkMode ? 'hover:bg-gray-700 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'
                                }`}
                                title="Archive"
                              >
                                <i className="ri-inbox-archive-line" />
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteClick(inquiry)}
                              className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                                darkMode ? 'hover:bg-red-600/20 text-gray-400 hover:text-red-400' : 'hover:bg-red-50 text-gray-500 hover:text-red-600'
                              }`}
                              title="Delete"
                            >
                              <i className="ri-delete-bin-line" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {sortedInquiries.length > 0 && (
              <div className={`px-4 py-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between flex-wrap gap-4`}>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Show</span>
                    <select
                      value={itemsPerPage}
                      onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                      className={`px-3 py-1.5 rounded-lg text-sm border cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-600 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-200'}`}
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>entries</span>
                  </div>
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Showing {startIndex + 1} to {Math.min(endIndex, sortedInquiries.length)} of {sortedInquiries.length} entries
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${darkMode ? 'text-gray-400 hover:bg-gray-700 hover:text-white' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'}`}
                  >
                    <i className="ri-skip-back-mini-line" />
                  </button>
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${darkMode ? 'text-gray-400 hover:bg-gray-700 hover:text-white' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'}`}
                  >
                    <i className="ri-arrow-left-s-line" />
                  </button>
                  {getPageNumbers().map((page, idx) => (
                    typeof page === 'string' ? (
                      <span key={`ellipsis-${idx}`} className={`w-8 h-8 flex items-center justify-center text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>...</span>
                    ) : (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors cursor-pointer ${currentPage === page ? 'bg-red-600 text-white' : darkMode ? 'text-gray-400 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
                      >
                        {page}
                      </button>
                    )
                  ))}
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${darkMode ? 'text-gray-400 hover:bg-gray-700 hover:text-white' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'}`}
                  >
                    <i className="ri-arrow-right-s-line" />
                  </button>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${darkMode ? 'text-gray-400 hover:bg-gray-700 hover:text-white' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'}`}
                  >
                    <i className="ri-skip-forward-mini-line" />
                  </button>
                </div>
              </div>
            )}
          </div>
          ) : (
          /* Grid View */
          <div className={`rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="p-4">
              {paginatedInquiries.length === 0 ? (
                <div className="py-12 text-center">
                  <div className={`${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    <i className="ri-inbox-line text-4xl mb-3 block" />
                    <p className="text-sm">No inquiries found</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {paginatedInquiries.map((inquiry) => (
                    <div
                      key={inquiry.id}
                      onClick={() => handleViewInquiry(inquiry)}
                      className={`rounded-lg border p-4 transition-all hover:shadow-lg cursor-pointer ${
                        inquiry.status === 'new'
                          ? darkMode 
                            ? 'bg-gray-700/50 border-l-4 border-l-red-600 border-t-gray-600 border-r-gray-600 border-b-gray-600 hover:border-t-gray-500 hover:border-r-gray-500 hover:border-b-gray-500' 
                            : 'bg-white border-l-4 border-l-red-600 border-t-gray-200 border-r-gray-200 border-b-gray-200 hover:border-t-gray-300 hover:border-r-gray-300 hover:border-b-gray-300'
                          : darkMode 
                            ? 'bg-gray-700/50 border-gray-600 hover:border-gray-500' 
                            : 'bg-white border-gray-200 hover:border-gray-300'
                      } ${selectedInquiries.includes(inquiry.id) ? 'ring-2 ring-red-600' : ''}`}
                    >
                      <div className="flex items-start justify-between mb-3" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selectedInquiries.includes(inquiry.id)}
                          onChange={() => handleSelectInquiry(inquiry.id)}
                          className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-600/20 cursor-pointer"
                        />
                        {getStatusBadge(inquiry.status)}
                      </div>

                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 ${
                          darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {inquiry.name.charAt(0)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className={`text-sm font-semibold truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {inquiry.name}
                          </p>
                          <p className={`text-xs truncate ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {inquiry.company}
                          </p>
                        </div>
                      </div>

                      <div className="mb-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mb-2 ${
                          darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-700'
                        }`}>
                          {inquiry.subject}
                        </span>
                        <p className={`text-xs line-clamp-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {inquiry.message}
                        </p>
                      </div>

                      <div className={`text-xs mb-3 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        {formatDate(inquiry.receivedAt)}
                      </div>

                      <div className={`flex items-center justify-center gap-1 pt-3 border-t ${darkMode ? 'border-gray-600' : 'border-gray-200'}`} onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleViewInquiry(inquiry)}
                          className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                            darkMode ? 'hover:bg-gray-600 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'
                          }`}
                          title="View"
                        >
                          <i className="ri-eye-line" />
                        </button>
                        <button
                          onClick={() => handleReplyClick(inquiry)}
                          className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                            darkMode ? 'hover:bg-green-600/20 text-gray-400 hover:text-green-400' : 'hover:bg-green-50 text-gray-500 hover:text-green-600'
                          }`}
                          title="Reply"
                        >
                          <i className="ri-reply-line" />
                        </button>
                        {inquiry.status !== 'archived' && (
                          <button
                            onClick={() => handleArchive(inquiry)}
                            className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                              darkMode ? 'hover:bg-gray-600 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'
                            }`}
                            title="Archive"
                          >
                            <i className="ri-inbox-archive-line" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteClick(inquiry)}
                          className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                            darkMode ? 'hover:bg-red-600/20 text-gray-400 hover:text-red-400' : 'hover:bg-red-50 text-gray-500 hover:text-red-600'
                          }`}
                          title="Delete"
                        >
                          <i className="ri-delete-bin-line" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Pagination for Grid View */}
            {sortedInquiries.length > 0 && (
              <div className={`px-4 py-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between flex-wrap gap-4`}>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Show</span>
                    <select
                      value={itemsPerPage}
                      onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                      className={`px-3 py-1.5 rounded-lg text-sm border cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-600 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-200'}`}
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>entries</span>
                  </div>
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Showing {startIndex + 1} to {Math.min(endIndex, sortedInquiries.length)} of {sortedInquiries.length} entries
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${darkMode ? 'text-gray-400 hover:bg-gray-700 hover:text-white' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'}`}
                  >
                    <i className="ri-skip-back-mini-line" />
                  </button>
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${darkMode ? 'text-gray-400 hover:bg-gray-700 hover:text-white' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'}`}
                  >
                    <i className="ri-arrow-left-s-line" />
                  </button>
                  {getPageNumbers().map((page, idx) => (
                    typeof page === 'string' ? (
                      <span key={`ellipsis-${idx}`} className={`w-8 h-8 flex items-center justify-center text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>...</span>
                    ) : (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors cursor-pointer ${currentPage === page ? 'bg-red-600 text-white' : darkMode ? 'text-gray-400 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
                      >
                        {page}
                      </button>
                    )
                  ))}
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${darkMode ? 'text-gray-400 hover:bg-gray-700 hover:text-white' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'}`}
                  >
                    <i className="ri-arrow-right-s-line" />
                  </button>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${darkMode ? 'text-gray-400 hover:bg-gray-700 hover:text-white' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'}`}
                  >
                    <i className="ri-skip-forward-mini-line" />
                  </button>
                </div>
              </div>
            )}
          </div>
          )}

        </div>
      </main>

      {/* View Inquiry Modal */}
      {showViewModal && selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowViewModal(false)} />
          <div className={`relative w-full max-w-2xl rounded-xl shadow-xl overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className={`px-6 py-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between`}>
              <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'Merriweather, serif' }}>
                Inquiry Details
              </h3>
              <button
                onClick={() => setShowViewModal(false)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                  darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                }`}
              >
                <i className="ri-close-line text-xl" />
              </button>
            </div>
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="flex items-start gap-4 mb-6">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold ${
                  darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                }`}>
                  {selectedInquiry.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <h4 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {selectedInquiry.name}
                  </h4>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {selectedInquiry.company}
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <a href={`mailto:${selectedInquiry.email}`} className={`text-sm flex items-center gap-1 ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}>
                      <i className="ri-mail-line" />
                      {selectedInquiry.email}
                    </a>
                    {selectedInquiry.phone && (
                      <a href={`tel:${selectedInquiry.phone}`} className={`text-sm flex items-center gap-1 ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}>
                        <i className="ri-phone-line" />
                        {selectedInquiry.phone}
                      </a>
                    )}
                  </div>
                </div>
                {getStatusBadge(selectedInquiry.status)}
              </div>

              <div className={`rounded-lg p-4 mb-4 ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs font-semibold uppercase ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Subject</span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-700'
                  }`}>
                    {selectedInquiry.subject}
                  </span>
                </div>
                <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {selectedInquiry.message}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className={darkMode ? 'text-gray-500' : 'text-gray-400'}>
                  Received: {formatDate(selectedInquiry.receivedAt)}
                </span>
                {selectedInquiry.repliedAt && (
                  <span className={darkMode ? 'text-green-400' : 'text-green-600'}>
                    Replied: {formatDate(selectedInquiry.repliedAt)}
                  </span>
                )}
              </div>
            </div>
            <div className={`px-6 py-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-end gap-3`}>
              {selectedInquiry.status === 'new' && (
                <button
                  onClick={() => {
                    handleMarkAsRead(selectedInquiry);
                    setShowViewModal(false);
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    darkMode 
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Mark as Read
                </button>
              )}
              <button
                onClick={() => {
                  setShowViewModal(false);
                  handleReplyClick(selectedInquiry);
                }}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-colors cursor-pointer whitespace-nowrap"
              >
                <i className="ri-reply-line mr-1" />
                Reply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reply Modal */}
      {showReplyModal && selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowReplyModal(false)} />
          <div className={`relative w-full max-w-xl rounded-xl shadow-xl overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className={`px-6 py-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between`}>
              <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'Merriweather, serif' }}>
                Reply to {selectedInquiry.name}
              </h3>
              <button
                onClick={() => setShowReplyModal(false)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                  darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                }`}
              >
                <i className="ri-close-line text-xl" />
              </button>
            </div>
            <div className="p-6">
              <div className={`rounded-lg p-3 mb-4 ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                <p className={`text-xs font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>To:</p>
                <p className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedInquiry.email}</p>
              </div>
              <div className="mb-4">
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Your Reply
                </label>
                <textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  rows={6}
                  maxLength={500}
                  placeholder="Type your reply message here..."
                  className={`w-full px-4 py-3 rounded-lg border text-sm resize-none ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
                  } focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent`}
                />
                <p className={`text-xs mt-1 text-right ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  {replyMessage.length}/500 characters
                </p>
              </div>
            </div>
            <div className={`px-6 py-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-end gap-3`}>
              <button
                onClick={() => setShowReplyModal(false)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  darkMode 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleSendReply}
                disabled={!replyMessage.trim() || isSending}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  !replyMessage.trim() || isSending
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-red-600 text-white hover:bg-red-700'
                }`}
              >
                {isSending ? (
                  <span className="flex items-center">
                    <i className="ri-loader-4-line animate-spin mr-2" />
                    Sending...
                  </span>
                ) : (
                  <>
                    <i className="ri-send-plane-line mr-1" />
                    Send Reply
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowDeleteModal(false)} />
          <div className={`relative w-full max-w-md rounded-xl p-6 shadow-xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="text-center">
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${darkMode ? 'bg-red-600/20' : 'bg-red-50'}`}>
                <i className={`ri-delete-bin-line text-3xl ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
              </div>
              <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'Merriweather, serif' }}>
                Delete Inquiry?
              </h3>
              <p className={`text-sm mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Are you sure you want to delete the inquiry from "<strong>{selectedInquiry.name}</strong>"? This action cannot be undone.
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    darkMode 
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-colors cursor-pointer whitespace-nowrap"
                >
                  Delete Inquiry
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}