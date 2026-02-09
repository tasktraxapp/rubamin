import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

type ContentType = 'notices' | 'tenders';
type TenderSubTab = 'postings' | 'applications';

interface Notice {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  status: 'Published' | 'Draft';
  downloads: number;
}

interface TenderPosting {
  id: string;
  title: string;
  referenceNo: string;
  category: string;
  description: string;
  requirements: string;
  budget: string;
  publishDate: string;
  closingDate: string;
  status: 'Published' | 'Draft' | 'Closed';
  applications: number;
}

interface TenderApplication {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  tenderRef: string;
  tenderTitle: string;
  category: string;
  proposal: string;
  status: 'new' | 'reviewed' | 'shortlisted' | 'rejected' | 'archived';
  submittedAt: string;
  repliedAt?: string;
}

const MediaCenterManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('adminDarkMode');
    return saved ? JSON.parse(saved) : false;
  });
  const [currentTime, setCurrentTime] = useState(new Date());
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // ---- Tab state (single source of truth) ----
  const [activeTab, setActiveTab] = useState<ContentType>('notices');
  const [tenderSubTab, setTenderSubTab] = useState<TenderSubTab>('postings');

  // ---- View mode states ----
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [tenderPostingsViewMode, setTenderPostingsViewMode] = useState<'list' | 'grid'>('list');
  const [tenderAppsViewMode, setTenderAppsViewMode] = useState<'list' | 'grid'>('list');

  // ---- Selection & modal state ----
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Notice | null>(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');
  const [tenderPostingFilterStatus, setTenderPostingFilterStatus] = useState('All');
  const [selectedTenderStatus, setSelectedTenderStatus] = useState('all');

  // ---- Toast state ----
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // ---- Profile dropdown ----
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // ---- Form data for notices ----
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    date: '',
    status: 'Draft' as const,
  });

  // ---- Mock data ----
  const [notices, setNotices] = useState<Notice[]>([
    {
      id: 'N-001',
      title: 'Annual General Meeting Announcement',
      description:
        'Notice of Annual General Meeting scheduled for February 28, 2024.',
      category: 'Corporate',
      date: '2024-01-15',
      status: 'Published',
      downloads: 45,
    },
    {
      id: 'N-002',
      title: 'New Environmental Certification Achieved',
      description:
        'RUBAMIN SARL has successfully obtained ISO 14001:2015 certification.',
      category: 'Achievement',
      date: '2024-01-10',
      status: 'Published',
      downloads: 32,
    },
    {
      id: 'N-003',
      title: 'Production Facility Expansion Update',
      description:
        'Phase 2 of our facility expansion project is now complete.',
      category: 'Operations',
      date: '2023-12-20',
      status: 'Published',
      downloads: 28,
    },
    {
      id: 'N-004',
      title: 'Holiday Schedule Notice',
      description: 'Office closure schedule for the holiday season.',
      category: 'General',
      date: '2023-12-05',
      status: 'Published',
      downloads: 56,
    },
    {
      id: 'N-005',
      title: 'Safety Excellence Award',
      description:
        'Company recognized for achieving 1000 days without incidents.',
      category: 'Achievement',
      date: '2023-11-28',
      status: 'Published',
      downloads: 41,
    },
    {
      id: 'N-006',
      title: 'Q1 2024 Performance Report',
      description:
        'Draft quarterly performance report for internal review.',
      category: 'Corporate',
      date: '2024-02-01',
      status: 'Draft',
      downloads: 0,
    },
  ]);

  const [tenderPostings, setTenderPostings] = useState<TenderPosting[]>([
    {
      id: 'T-2024-001',
      title: 'Supply and Installation of New Oxygen Compressor',
      referenceNo: 'T-2024-001',
      category: 'Equipment',
      description:
        'RUBAMIN SARL invites qualified suppliers to submit proposals for the supply and installation of a new industrial oxygen compressor system for our Lubumbashi facility.',
      requirements:
        'Minimum 10 years experience in industrial gas equipment\nISO 9001 certified\nAbility to provide 3‑year warranty\nOn‑site installation and commissioning',
      budget: '$150,000 - $250,000',
      publishDate: '2024-03-01',
      closingDate: '2024-04-15',
      status: 'Published',
      applications: 3,
    },
    {
      id: 'T-2024-002',
      title: 'Transportation Services Contract',
      referenceNo: 'T-2024-002',
      category: 'Services',
      description:
        'Seeking a reliable logistics partner for material transportation between Lubumbashi and Kolwezi operations. Contract duration: 2 years with option to extend.',
      requirements:
        'Fleet of minimum 15 heavy‑duty trucks\nGPS tracking capability\nValid transport licenses\nInsurance coverage',
      budget: '$500,000/year',
      publishDate: '2024-03-05',
      closingDate: '2024-04-10',
      status: 'Published',
      applications: 1,
    },
    // Additional tender postings omitted for brevity
  ]);

  const [tenderApplications, setTenderApplications] = useState<TenderApplication[]>([
    {
      id: 'TA-001',
      companyName: 'Atlas Engineering Ltd',
      contactPerson: 'James Mwamba',
      email: 'james.m@atlaseng.com',
      phone: '+243 81 234 5678',
      tenderRef: 'T-2024-001',
      tenderTitle: 'Supply and Installation of New Oxygen Compressor',
      category: 'Equipment',
      proposal:
        'We propose a Kaeser BSD 72 compressor with full installation and a 3‑year warranty.',
      status: 'new',
      submittedAt: '2024-03-20T10:30:00',
    },
    {
      id: 'TA-002',
      companyName: 'TransCongo Logistics',
      contactPerson: 'Marie Kabila',
      email: 'mkabila@transcongo.cd',
      phone: '+243 99 876 5432',
      tenderRef: 'T-2024-002',
      tenderTitle: 'Transportation Services Contract',
      category: 'Services',
      proposal:
        'We propose a fleet of 20 heavy‑duty trucks with GPS tracking and dedicated route management.',
      status: 'reviewed',
      submittedAt: '2024-03-18T14:15:00',
    },
    // Additional applications omitted for brevity
  ]);

  // ---- Miscellaneous UI helpers ----
  const adminUser = JSON.parse(
    sessionStorage.getItem('adminUser') ||
      '{"name":"Admin","email":"admin@rubamindrc.com"}'
  );

  const breadcrumbs = [
    { label: 'Home', path: '/', icon: 'ri-home-4-line' },
    { label: 'Admin', path: '/admin' },
    { label: 'Dashboard', path: '/admin/dashboard' },
    { label: 'Media', path: '/admin/dashboard/media-center' },
  ];

  // ---- Effects ----
  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn');
    if (!isLoggedIn) navigate('/admin');
  }, [navigate]);

  useEffect(() => {
    localStorage.setItem('adminDarkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(e.target as Node)
      ) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ---- Action handlers ----
  const handleLogout = () => {
    sessionStorage.removeItem('adminLoggedIn');
    sessionStorage.removeItem('adminUser');
    navigate('/admin');
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      date: '',
      status: 'Draft',
    });
  };

  const showToastMessage = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleCreateNotice = () => {
    const newId = `N-${Date.now()}`;
    setNotices((prev) => [
      ...prev,
      {
        id: newId,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        date: formData.date,
        status: formData.status,
        downloads: 0,
      },
    ]);
    setShowCreateModal(false);
    resetForm();
    showToastMessage('Notice created successfully');
  };

  const handleEditNotice = () => {
    if (!editingItem) return;
    setNotices((prev) =>
      prev.map((n) =>
        n.id === editingItem.id
          ? {
              ...n,
              title: formData.title,
              description: formData.description,
              category: formData.category,
              date: formData.date,
              status: formData.status,
            }
          : n
      )
    );
    setShowEditModal(false);
    setEditingItem(null);
    resetForm();
    showToastMessage('Notice updated successfully');
  };

  const handleDeleteNotices = () => {
    setNotices((prev) => prev.filter((n) => !selectedItems.includes(n.id)));
    setSelectedItems([]);
    setShowDeleteModal(false);
    showToastMessage('Selected notice(s) deleted');
  };

  const handleSelectAll = () => {
    const ids =
      activeTab === 'notices'
        ? paginatedNotices.map((n) => n.id)
        : activeTab === 'tenders' && tenderSubTab === 'postings'
        ? paginatedTenderPostings.map((p) => p.id)
        : paginatedTenderApps.map((a) => a.id);
    setSelectedItems(
      selectedItems.length === ids.length ? [] : ids
    );
  };

  const handleSelectItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // ---- Sorting logic ----
  const [noticeSortField, setNoticeSortField] = useState<keyof Notice>('date');
  const [noticeSortDir, setNoticeSortDir] = useState<'asc' | 'desc'>('desc');

  const handleNoticeSort = (field: keyof Notice) => {
    if (noticeSortField === field) {
      setNoticeSortDir(noticeSortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setNoticeSortField(field);
      setNoticeSortDir('asc');
    }
    setCurrentPage(1);
  };

  const sortedNotices = [...notices]
    .filter((n) => {
      const matchesSearch = n.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesStatus =
        filterStatus === 'All' || n.status === filterStatus;
      const matchesCategory =
        filterCategory === 'All' || n.category === filterCategory;
      return matchesSearch && matchesStatus && matchesCategory;
    })
    .sort((a, b) => {
      const aVal = a[noticeSortField];
      const bVal = b[noticeSortField];
      const mult = noticeSortDir === 'asc' ? 1 : -1;
      if (typeof aVal === 'string' && typeof bVal === 'string')
        return aVal.localeCompare(bVal) * mult;
      if (typeof aVal === 'number' && typeof bVal === 'number')
        return (aVal - bVal) * mult;
      return 0;
    });

  const sortedTenderPostings = [...tenderPostings].filter((p) => {
    const matchesStatus =
      tenderPostingFilterStatus === 'All' || p.status === tenderPostingFilterStatus;
    return matchesStatus;
  });

  const sortedTenderApps = [...tenderApplications].filter((a) => {
    const matchesStatus =
      selectedTenderStatus === 'all' || a.status === selectedTenderStatus;
    return matchesStatus;
  });

  // ---- Pagination ----
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const getPaginated = <T,>(items: T[]): T[] => {
    const start = (currentPage - 1) * itemsPerPage;
    return items.slice(start, start + itemsPerPage);
  };

  const paginatedNotices = getPaginated(sortedNotices);
  const paginatedTenderPostings = getPaginated(sortedTenderPostings);
  const paginatedTenderApps = getPaginated(sortedTenderApps);

  // ---- Render helpers ----
  const getStatusOptions = () => {
    if (activeTab === 'notices')
      return ['All', 'Published', 'Draft'];
    if (activeTab === 'tenders' && tenderSubTab === 'postings')
      return ['All', 'Published', 'Draft', 'Closed'];
    return ['all', 'new', 'reviewed', 'shortlisted', 'rejected', 'archived'];
  };

  // ==== MAIN RETURN ====
  return (
    <div className={`min-h-screen flex ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Sidebar */}
      <aside
        className={`${
          sidebarCollapsed ? 'w-20' : 'w-64'
        } ${darkMode ? 'bg-gray-800' : 'bg-white'} border-r flex flex-col fixed h-full transition-all duration-300 z-20`}
      >
        {/* Logo */}
        <div className={`p-5 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between`}>
          <Link to="/" className={`flex items-center gap-3 ${sidebarCollapsed ? 'justify-center' : ''}`}>
            <img src="https://static.readdy.ai/image/1b404af276821d98dfecb0eec592fbd4/2beca25c2dca50fd1a3109512ef52e33.png" alt="Logo" className="h-10 w-10 object-contain" />
            {!sidebarCollapsed && <span className={`text-xl font-bold tracking-wide ${darkMode ? 'text-white' : 'text-[#2C3E50]'}`}>RUBAMIN</span>}
          </Link>
          {!sidebarCollapsed && (
            <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className={`w-8 h-8 flex items-center justify-center rounded-lg ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'} cursor-pointer transition-colors`}>
              <i className="ri-menu-fold-line text-lg" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <Link to="/admin/dashboard" className={`relative flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${darkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'} ${sidebarCollapsed ? 'justify-center' : ''}`} title={sidebarCollapsed ? 'Dashboard' : ''}>
            <i className="ri-dashboard-3-line text-lg" />
            {!sidebarCollapsed && <span className="flex-1">Dashboard</span>}
          </Link>
          <Link to="/admin/dashboard/pages" className={`relative flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${darkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'} ${sidebarCollapsed ? 'justify-center' : ''}`} title={sidebarCollapsed ? 'Pages' : ''}>
            <i className="ri-file-list-3-line text-lg" />
            {!sidebarCollapsed && <span className="flex-1">Pages</span>}
          </Link>
          <Link to="/admin/dashboard/media-center" className={`relative flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all bg-red-600 text-white shadow-md ${sidebarCollapsed ? 'justify-center' : ''}`} title={sidebarCollapsed ? 'Media' : ''}>
            <i className="ri-newspaper-line text-lg" />
            {!sidebarCollapsed && (
              <>
                <span className="flex-1">Media</span>
                <span className="min-w-5 h-5 flex items-center justify-center px-1.5 text-xs font-bold rounded-full bg-white text-red-600">5</span>
              </>
            )}
            {sidebarCollapsed && <span className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full" />}
          </Link>
          <Link to="/admin/dashboard/jobs" className={`relative flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${darkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'} ${sidebarCollapsed ? 'justify-center' : ''}`} title={sidebarCollapsed ? 'Jobs' : ''}>
            <i className="ri-briefcase-line text-lg" />
            {!sidebarCollapsed && (
              <>
                <span className="flex-1">Jobs</span>
                <span className="min-w-5 h-5 flex items-center justify-center px-1.5 text-xs font-bold rounded-full bg-red-600 text-white">3</span>
              </>
            )}
            {sidebarCollapsed && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />}
          </Link>
          <Link to="/admin/dashboard/gallery" className={`relative flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${darkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'} ${sidebarCollapsed ? 'justify-center' : ''}`} title={sidebarCollapsed ? 'Gallery' : ''}>
            <i className="ri-gallery-line text-lg" />
            {!sidebarCollapsed && <span className="flex-1">Gallery</span>}
          </Link>
          <Link to="/admin/dashboard/resources" className={`relative flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${darkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'} ${sidebarCollapsed ? 'justify-center' : ''}`} title={sidebarCollapsed ? 'Resources Center' : ''}>
            <i className="ri-folder-line text-lg" />
            {!sidebarCollapsed && (
              <>
                <span className="flex-1">Resources Center</span>
                <span className="min-w-5 h-5 flex items-center justify-center px-1.5 text-xs font-bold rounded-full bg-red-600 text-white">3</span>
              </>
            )}
            {sidebarCollapsed && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />}
          </Link>
          <Link to="/admin/dashboard/inquiries" className={`relative flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${darkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'} ${sidebarCollapsed ? 'justify-center' : ''}`} title={sidebarCollapsed ? 'Inquiries' : ''}>
            <i className="ri-mail-line text-lg" />
            {!sidebarCollapsed && (
              <>
                <span className="flex-1">Inquiries</span>
                <span className="min-w-5 h-5 flex items-center justify-center px-1.5 text-xs font-bold rounded-full bg-red-600 text-white">8</span>
              </>
            )}
            {sidebarCollapsed && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />}
          </Link>
          <Link to="/admin/dashboard/notifications" className={`relative flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${darkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'} ${sidebarCollapsed ? 'justify-center' : ''}`} title={sidebarCollapsed ? 'Notifications' : ''}>
            <i className="ri-notification-3-line text-lg" />
            {!sidebarCollapsed && (
              <>
                <span className="flex-1">Notifications</span>
                <span className="min-w-5 h-5 flex items-center justify-center px-1.5 text-xs font-bold rounded-full bg-red-600 text-white">4</span>
              </>
            )}
            {sidebarCollapsed && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />}
          </Link>
          <Link to="/admin/dashboard/tasks" className={`relative flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${darkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'} ${sidebarCollapsed ? 'justify-center' : ''}`} title={sidebarCollapsed ? 'Tasks' : ''}>
            <i className="ri-task-line text-lg" />
            {!sidebarCollapsed && (
              <>
                <span className="flex-1">Tasks</span>
                <span className="min-w-5 h-5 flex items-center justify-center px-1.5 text-xs font-bold rounded-full bg-red-600 text-white">12</span>
              </>
            )}
            {sidebarCollapsed && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />}
          </Link>
          <Link to="/admin/dashboard/deadlines" className={`relative flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${darkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'} ${sidebarCollapsed ? 'justify-center' : ''}`} title={sidebarCollapsed ? 'Deadlines' : ''}>
            <i className="ri-calendar-todo-line text-lg" />
            {!sidebarCollapsed && (
              <>
                <span className="flex-1">Deadlines</span>
                <span className="min-w-5 h-5 flex items-center justify-center px-1.5 text-xs font-bold rounded-full bg-red-600 text-white">11</span>
              </>
            )}
            {sidebarCollapsed && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />}
          </Link>
          <Link to="/admin/dashboard/settings" className={`relative flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${darkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'} ${sidebarCollapsed ? 'justify-center' : ''}`} title={sidebarCollapsed ? 'Settings' : ''}>
            <i className="ri-settings-3-line text-lg" />
            {!sidebarCollapsed && <span className="flex-1">Settings</span>}
          </Link>
        </nav>
      </aside>

      {/* Main area */}
      <main
        className={`flex-1 ${sidebarCollapsed ? 'ml-20' : 'ml-64'} transition-all duration-300`}
      >
        {/* Header */}
        <header
          className={`${
            darkMode ? 'bg-gray-800' : 'bg-white'
          } border-b px-8 py-4 sticky top-0 z-10 flex items-center justify-between`}
        >
          <div className="flex items-center justify-between gap-4 w-full">
            {/* Search Bar */}
            <div className="flex-1 max-w-xl">
              <div className="relative">
                <i className={`ri-search-line absolute left-4 top-1/2 -translate-y-1/2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search notices, tenders..."
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
        <div
          className={`px-8 py-3 border-b ${
            darkMode ? 'bg-gray-800/50' : 'bg-gray-50/80'
          }`}
        >
          <nav className="flex items-center gap-2 text-sm">
            {breadcrumbs.map((crumb, i) => (
              <div key={crumb.path} className="flex items-center gap-2">
                {i > 0 && (
                  <i
                    className={`ri-arrow-right-s-line ${
                      darkMode ? 'text-gray-600' : 'text-gray-400'
                    }`}
                  />
                )}
                {i === breadcrumbs.length - 1 ? (
                  <span
                    className={`font-medium ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    to={crumb.path}
                    className={`flex items-center transition-colors ${
                      darkMode
                        ? 'text-gray-400 hover:text-white'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    {crumb.icon && (
                      <i className={`${crumb.icon} mr-1.5`} />
                    )}
                    {crumb.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Page content */}
        <div className="p-8">
          {/* Page title */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1
                className={`text-3xl font-bold ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}
                style={{ fontFamily: 'Merriweather, serif' }}
              >
                Media Center
              </h1>
              <p
                className={`mt-2 text-base ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                Manage notices and tender applications
              </p>
            </div>
            <button
              onClick={() => {
                resetForm();
                setShowCreateModal(true);
              }}
              className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium whitespace-nowrap"
            >
              <i className="ri-add-line text-lg" />
              Add Notice
            </button>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-8">
            {/* Card 1 – Total Notices */}
            <div
              className={`rounded-lg p-6 border ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className={`text-sm ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}
                  >
                    Total Notices
                  </p>
                  <p
                    className={`text-3xl font-bold mt-1 ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {notices.length}
                  </p>
                </div>
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    darkMode ? 'bg-green-500/20' : 'bg-green-50'
                  }`}
                >
                  <i
                    className={`ri-notification-line text-xl ${
                      darkMode ? 'text-green-400' : 'text-green-600'
                    }`}
                  />
                </div>
              </div>
            </div>
            {/* Card 2 – Tender Postings */}
            <div
              className={`rounded-lg p-6 border ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className={`text-sm ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}
                  >
                    Tender Postings
                  </p>
                  <p
                    className={`text-3xl font-bold mt-1 ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {tenderPostings.length}
                  </p>
                </div>
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    darkMode ? 'bg-blue-500/20' : 'bg-blue-50'
                  }`}
                >
                  <i
                    className={`ri-file-list-3-line text-xl ${
                      darkMode ? 'text-blue-400' : 'text-blue-600'
                    }`}
                  />
                </div>
              </div>
            </div>
            {/* Card 3 – New Applications */}
            <div
              className={`rounded-lg p-6 border ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className={`text-sm ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}
                  >
                    New Applications
                  </p>
                  <p
                    className={`text-3xl font-bold mt-1 ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {
                      tenderApplications.filter((a) => a.status === 'new')
                        .length
                    }
                  </p>
                </div>
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    darkMode ? 'bg-red-600/20' : 'bg-red-50'
                  }`}
                >
                  <i
                    className={`ri-notification-badge-line text-xl ${
                      darkMode ? 'text-red-400' : 'text-red-600'
                    }`}
                  />
                </div>
              </div>
            </div>
            {/* Card 4 – Shortlisted */}
            <div
              className={`rounded-lg p-6 border ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className={`text-sm ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}
                  >
                    Shortlisted
                  </p>
                  <p
                    className={`text-3xl font-bold mt-1 ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {
                      tenderApplications.filter(
                        (a) => a.status === 'shortlisted'
                      ).length
                    }
                  </p>
                </div>
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    darkMode ? 'bg-yellow-500/20' : 'bg-yellow-50'
                  }`}
                >
                  <i
                    className={`ri-user-star-line text-xl ${
                      darkMode ? 'text-yellow-400' : 'text-yellow-600'
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Main card (tabs & content) */}
          <div
            className={`rounded-lg border ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            {/* Primary tabs */}
            <div className={`px-4 pt-3 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setActiveTab('notices');
                    setSelectedItems([]);
                    setFilterStatus('All');
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap ${
                    activeTab === 'notices'
                      ? darkMode
                        ? 'bg-gray-700 text-white border border-b-0 border-gray-600'
                        : 'bg-white text-gray-900 border border-b-0 border-gray-200 shadow-sm'
                      : darkMode
                      ? 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <i className="ri-notification-line mr-1.5" />
                  Notices
                  <span
                    className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
                      activeTab === 'notices'
                        ? darkMode
                          ? 'bg-red-600/20 text-red-400'
                          : 'bg-red-50 text-red-600'
                        : darkMode
                        ? 'bg-gray-600 text-gray-400'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {notices.length}
                  </span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('tenders');
                    setSelectedItems([]);
                    setFilterStatus('All');
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap ${
                    activeTab === 'tenders'
                      ? darkMode
                        ? 'bg-gray-700 text-white border border-b-0 border-gray-600'
                        : 'bg-white text-gray-900 border border-b-0 border-gray-200 shadow-sm'
                      : darkMode
                      ? 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <i className="ri-file-list-3-line mr-1.5" />
                  Tenders
                  <span
                    className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
                      activeTab === 'tenders'
                        ? darkMode
                          ? 'bg-red-600/20 text-red-400'
                          : 'bg-red-50 text-red-600'
                        : darkMode
                        ? 'bg-gray-600 text-gray-400'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {tenderApplications.length}
                  </span>
                </button>
              </div>
            </div>

            {/* Secondary tabs (only when Tenders selected) */}
            {activeTab === 'tenders' && (
              <div className={`px-4 pt-3 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setTenderSubTab('postings');
                      setSelectedItems([]);
                      setFilterStatus('All');
                      setCurrentPage(1);
                    }}
                    className={`px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap ${
                      tenderSubTab === 'postings'
                        ? darkMode
                          ? 'bg-gray-700 text-white border border-b-0 border-gray-600'
                          : 'bg-white text-gray-900 border border-b-0 border-gray-200 shadow-sm'
                        : darkMode
                        ? 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <i className="ri-file-edit-line mr-1.5" />
                    Tender Postings
                    <span
                      className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
                        tenderSubTab === 'postings'
                          ? darkMode
                            ? 'bg-red-600/20 text-red-400'
                            : 'bg-red-50 text-red-600'
                          : darkMode
                          ? 'bg-gray-600 text-gray-400'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {tenderPostings.length}
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      setTenderSubTab('applications');
                      setSelectedItems([]);
                      setFilterStatus('All');
                      setCurrentPage(1);
                    }}
                    className={`px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap ${
                      tenderSubTab === 'applications'
                        ? darkMode
                          ? 'bg-gray-700 text-white border border-b-0 border-gray-600'
                          : 'bg-white text-gray-900 border border-b-0 border-gray-200 shadow-sm'
                        : darkMode
                        ? 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <i className="ri-mail-line mr-1.5" />
                    Applications
                    {tenderApplications.filter((a) => a.status === 'new')
                      .length > 0 && (
                      <span className="ml-2 min-w-5 h-5 inline-flex items-center justify-center px-1.5 text-xs font-bold rounded-full bg-red-600 text-white">
                        {
                          tenderApplications.filter(
                            (a) => a.status === 'new'
                          ).length
                        }
                      </span>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Filter bar */}
            <div
              className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex flex-wrap items-center justify-between gap-4`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`text-sm ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  Status:
                </span>
                <select
                  value={
                    activeTab === 'notices'
                      ? filterStatus
                      : activeTab === 'tenders' && tenderSubTab === 'postings'
                      ? tenderPostingFilterStatus
                      : selectedTenderStatus
                  }
                  onChange={(e) => {
                    if (activeTab === 'notices') setFilterStatus(e.target.value);
                    else if (
                      activeTab === 'tenders' &&
                      tenderSubTab === 'postings'
                    )
                      setTenderPostingFilterStatus(e.target.value);
                    else setSelectedTenderStatus(e.target.value);
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-2 rounded-lg text-sm cursor-pointer border focus:outline-none focus:ring-2 focus:ring-red-600 ${
                    darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-200'
                  }`}
                >
                  {getStatusOptions().map((s) => (
                    <option key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-3">
                {/* View toggle */}
                <div
                  className="flex items-center gap-1 border rounded-lg overflow-hidden"
                  style={{
                    borderColor: darkMode ? '#374151' : '#E5E7EB',
                  }}
                >
                  <button
                    onClick={() => {
                      if (activeTab === 'notices') setViewMode('list');
                      else if (tenderSubTab === 'postings')
                        setTenderPostingsViewMode('list');
                      else setTenderAppsViewMode('list');
                    }}
                    className={`px-3 py-2 text-sm font-medium transition-colors ${
                      (activeTab === 'notices'
                        ? viewMode
                        : tenderSubTab === 'postings'
                        ? tenderPostingsViewMode
                        : tenderAppsViewMode) === 'list'
                        ? darkMode
                          ? 'bg-red-600 text-white'
                          : 'bg-red-600 text-white'
                        : darkMode
                        ? 'bg-gray-800 text-gray-400 hover:text-white'
                        : 'bg-white text-gray-600 hover:text-gray-900'
                    }`}
                    title="List view"
                  >
                    <i className="ri-list-check text-base" />
                  </button>
                  <button
                    onClick={() => {
                      if (activeTab === 'notices') setViewMode('grid');
                      else if (tenderSubTab === 'postings')
                        setTenderPostingsViewMode('grid');
                      else setTenderAppsViewMode('grid');
                    }}
                    className={`px-3 py-2 text-sm font-medium transition-colors ${
                      (activeTab === 'notices'
                        ? viewMode
                        : tenderSubTab === 'postings'
                        ? tenderPostingsViewMode
                        : tenderAppsViewMode) === 'grid'
                        ? darkMode
                          ? 'bg-red-600 text-white'
                          : 'bg-red-600 text-white'
                        : darkMode
                        ? 'bg-gray-800 text-gray-400 hover:text-white'
                        : 'bg-white text-gray-600 hover:text-gray-900'
                    }`}
                    title="Grid view"
                  >
                    <i className="ri-grid-line text-base" />
                  </button>
                </div>

                {/* Bulk delete button */}
                {selectedItems.length > 0 && (
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium whitespace-nowrap"
                  >
                    <i className="ri-delete-bin-line" />
                    Delete ({selectedItems.length})
                  </button>
                )}

                <span
                  className={`text-sm ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  {activeTab === 'notices'
                    ? sortedNotices.length
                    : tenderSubTab === 'postings'
                    ? sortedTenderPostings.length
                    : sortedTenderApps.length}{' '}
                  items
                </span>
              </div>
            </div>

            {/* Content tables / grids */}
            {activeTab === 'notices' && (
              <>
                {/* List view */}
                {viewMode === 'list' && (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead
                        className={darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}
                      >
                        <tr>
                          <th className="w-12 px-4 py-3">
                            <input
                              type="checkbox"
                              checked={
                                selectedItems.length ===
                                  paginatedNotices.length &&
                                paginatedNotices.length > 0
                              }
                              onChange={handleSelectAll}
                              className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-600/20 cursor-pointer"
                            />
                          </th>
                          <th
                            onClick={() => handleNoticeSort('title')}
                            className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer transition-colors ${
                              noticeSortField === 'title'
                                ? 'text-red-600'
                                : darkMode
                                ? 'text-gray-400 hover:text-gray-300'
                                : 'text-gray-600 hover:text-gray-700'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              Title
                              <i
                                className={`${
                                  noticeSortField === 'title'
                                    ? noticeSortDir === 'asc'
                                      ? 'ri-arrow-up-line'
                                      : 'ri-arrow-down-line'
                                    : 'ri-arrow-up-down-line'
                                } text-sm ${
                                  noticeSortField === 'title' ? '' : 'opacity-40'
                                }`}
                              />
                            </div>
                          </th>
                          <th
                            onClick={() => handleNoticeSort('category')}
                            className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer transition-colors ${
                              noticeSortField === 'category'
                                ? 'text-red-600'
                                : darkMode
                                ? 'text-gray-400 hover:text-gray-300'
                                : 'text-gray-600 hover:text-gray-700'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              Category
                              <i
                                className={`${
                                  noticeSortField === 'category'
                                    ? noticeSortDir === 'asc'
                                      ? 'ri-arrow-up-line'
                                      : 'ri-arrow-down-line'
                                    : 'ri-arrow-up-down-line'
                                } text-sm ${
                                  noticeSortField === 'category' ? '' : 'opacity-40'
                                }`}
                              />
                            </div>
                          </th>
                          <th
                            onClick={() => handleNoticeSort('date')}
                            className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer transition-colors ${
                              noticeSortField === 'date'
                                ? 'text-red-600'
                                : darkMode
                                ? 'text-gray-400 hover:text-gray-300'
                                : 'text-gray-600 hover:text-gray-700'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              Date
                              <i
                                className={`${
                                  noticeSortField === 'date'
                                    ? noticeSortDir === 'asc'
                                      ? 'ri-arrow-up-line'
                                      : 'ri-arrow-down-line'
                                    : 'ri-arrow-up-down-line'
                                } text-sm ${
                                  noticeSortField === 'date' ? '' : 'opacity-40'
                                }`}
                              />
                            </div>
                          </th>
                          <th
                            onClick={() => handleNoticeSort('status')}
                            className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer transition-colors ${
                              noticeSortField === 'status'
                                ? 'text-red-600'
                                : darkMode
                                ? 'text-gray-400 hover:text-gray-300'
                                : 'text-gray-600 hover:text-gray-700'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              Status
                              <i
                                className={`${
                                  noticeSortField === 'status'
                                    ? noticeSortDir === 'asc'
                                      ? 'ri-arrow-up-line'
                                      : 'ri-arrow-down-line'
                                    : 'ri-arrow-up-down-line'
                                } text-sm ${
                                  noticeSortField === 'status' ? '' : 'opacity-40'
                                }`}
                              />
                            </div>
                          </th>
                          <th
                            onClick={() => handleNoticeSort('downloads')}
                            className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer transition-colors ${
                              noticeSortField === 'downloads'
                                ? 'text-red-600'
                                : darkMode
                                ? 'text-gray-400 hover:text-gray-300'
                                : 'text-gray-600 hover:text-gray-700'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              Downloads
                              <i
                                className={`${
                                  noticeSortField === 'downloads'
                                    ? noticeSortDir === 'asc'
                                      ? 'ri-arrow-up-line'
                                      : 'ri-arrow-down-line'
                                    : 'ri-arrow-up-down-line'
                                } text-sm ${
                                  noticeSortField === 'downloads' ? '' : 'opacity-40'
                                }`}
                              />
                            </div>
                          </th>
                          <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Actions</th>
                        </tr>
                      </thead>
                      <tbody
                        className={`divide-y ${
                          darkMode ? 'divide-gray-700' : 'divide-gray-200'
                        }`}
                      >
                        {paginatedNotices.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="px-4 py-12 text-center">
                              <div
                                className={`${
                                  darkMode ? 'text-gray-500' : 'text-gray-400'
                                }`}
                              >
                                <i className="ri-inbox-line text-4xl mb-3 block" />
                                <p className="text-sm">No notices found</p>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          paginatedNotices.map((notice) => (
                            <tr
                              key={notice.id}
                              className={`${
                                darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'
                              } transition-colors cursor-pointer`}
                              onClick={() => {
                                setEditingItem(notice);
                                setFormData({
                                  title: notice.title,
                                  description: notice.description,
                                  category: notice.category,
                                  date: notice.date,
                                  status: notice.status,
                                });
                                setShowEditModal(true);
                              }}
                            >
                              <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                                <input
                                  type="checkbox"
                                  checked={selectedItems.includes(notice.id)}
                                  onChange={() => handleSelectItem(notice.id)}
                                  className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-600/20 cursor-pointer"
                                />
                              </td>
                              <td className="px-4 py-4">
                                <div>
                                  <div className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{notice.title}</div>
                                  <div className={`text-xs mt-0.5 line-clamp-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{notice.description}</div>
                                </div>
                              </td>
                              <td className="px-4 py-4">
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                                  {notice.category}
                                </span>
                              </td>
                              <td className="px-4 py-4">
                                <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                  {new Date(notice.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                </span>
                              </td>
                              <td className="px-4 py-4">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${
                                  notice.status === 'Published'
                                    ? darkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-50 text-green-700'
                                    : darkMode ? 'bg-gray-500/20 text-gray-400' : 'bg-gray-100 text-gray-600'
                                }`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${notice.status === 'Published' ? 'bg-green-500' : 'bg-gray-400'}`} />
                                  {notice.status}
                                </span>
                              </td>
                              <td className="px-4 py-4">
                                <span className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{notice.downloads}</span>
                              </td>
                              <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => {
                                      setEditingItem(notice);
                                      setFormData({
                                        title: notice.title,
                                        description: notice.description,
                                        category: notice.category,
                                        date: notice.date,
                                        status: notice.status,
                                      });
                                      setShowEditModal(true);
                                    }}
                                    className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${darkMode ? 'hover:bg-gray-700 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'}`}
                                    title="Edit"
                                  >
                                    <i className="ri-pencil-line" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      setSelectedItems([notice.id]);
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
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
                {/* Grid view could be added here */}
              </>
            )}

            {/* Tenders - Postings */}
            {activeTab === 'tenders' && tenderSubTab === 'postings' && (
              <>
                {tenderPostingsViewMode === 'list' && (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className={darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}>
                        <tr>
                          <th className="w-12 px-4 py-3">
                            <input
                              type="checkbox"
                              checked={selectedItems.length === paginatedTenderPostings.length && paginatedTenderPostings.length > 0}
                              onChange={handleSelectAll}
                              className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-600/20 cursor-pointer"
                            />
                          </th>
                          <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Reference</th>
                          <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Title</th>
                          <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Category</th>
                          <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Budget</th>
                          <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Closing Date</th>
                          <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Status</th>
                          <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Applications</th>
                          <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Actions</th>
                        </tr>
                      </thead>
                      <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                        {paginatedTenderPostings.length === 0 ? (
                          <tr>
                            <td colSpan={9} className="px-4 py-12 text-center">
                              <div className={`${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                <i className="ri-inbox-line text-4xl mb-3 block" />
                                <p className="text-sm">No tender postings found</p>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          paginatedTenderPostings.map((tender) => (
                            <tr key={tender.id} className={`${darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'} transition-colors`}>
                              <td className="px-4 py-4">
                                <input
                                  type="checkbox"
                                  checked={selectedItems.includes(tender.id)}
                                  onChange={() => handleSelectItem(tender.id)}
                                  className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-600/20 cursor-pointer"
                                />
                              </td>
                              <td className="px-4 py-4">
                                <span className={`text-sm font-mono font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{tender.referenceNo}</span>
                              </td>
                              <td className="px-4 py-4">
                                <div>
                                  <div className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{tender.title}</div>
                                  <div className={`text-xs mt-0.5 line-clamp-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{tender.description}</div>
                                </div>
                              </td>
                              <td className="px-4 py-4">
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                                  {tender.category}
                                </span>
                              </td>
                              <td className="px-4 py-4">
                                <span className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{tender.budget}</span>
                              </td>
                              <td className="px-4 py-4">
                                <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                  {new Date(tender.closingDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                </span>
                              </td>
                              <td className="px-4 py-4">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${
                                  tender.status === 'Published'
                                    ? darkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-50 text-green-700'
                                    : tender.status === 'Closed'
                                    ? darkMode ? 'bg-red-500/20 text-red-400' : 'bg-red-50 text-red-700'
                                    : darkMode ? 'bg-gray-500/20 text-gray-400' : 'bg-gray-100 text-gray-600'
                                }`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${tender.status === 'Published' ? 'bg-green-500' : tender.status === 'Closed' ? 'bg-red-500' : 'bg-gray-400'}`} />
                                  {tender.status}
                                </span>
                              </td>
                              <td className="px-4 py-4">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold ${darkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-50 text-blue-700'}`}>
                                  <i className="ri-mail-line" />
                                  {tender.applications}
                                </span>
                              </td>
                              <td className="px-4 py-4">
                                <div className="flex items-center gap-1">
                                  <button className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${darkMode ? 'hover:bg-gray-700 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'}`} title="Edit">
                                    <i className="ri-pencil-line" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      setSelectedItems([tender.id]);
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
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}

            {/* Tenders - Applications */}
            {activeTab === 'tenders' && tenderSubTab === 'applications' && (
              <>
                {tenderAppsViewMode === 'list' && (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className={darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}>
                        <tr>
                          <th className="w-12 px-4 py-3">
                            <input
                              type="checkbox"
                              checked={selectedItems.length === paginatedTenderApps.length && paginatedTenderApps.length > 0}
                              onChange={handleSelectAll}
                              className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-600/20 cursor-pointer"
                            />
                          </th>
                          <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Company</th>
                          <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Contact</th>
                          <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Tender</th>
                          <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Category</th>
                          <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Submitted</th>
                          <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Status</th>
                          <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Actions</th>
                        </tr>
                      </thead>
                      <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                        {paginatedTenderApps.length === 0 ? (
                          <tr>
                            <td colSpan={8} className="px-4 py-12 text-center">
                              <div className={`${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                <i className="ri-inbox-line text-4xl mb-3 block" />
                                <p className="text-sm">No applications found</p>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          paginatedTenderApps.map((app) => (
                            <tr key={app.id} className={`${app.status === 'new' ? 'border-l-4 border-red-500' : ''} ${darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'} transition-colors`}>
                              <td className="px-4 py-4">
                                <input
                                  type="checkbox"
                                  checked={selectedItems.includes(app.id)}
                                  onChange={() => handleSelectItem(app.id)}
                                  className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-600/20 cursor-pointer"
                                />
                              </td>
                              <td className="px-4 py-4">
                                <div>
                                  <div className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{app.companyName}</div>
                                  <div className={`text-xs mt-0.5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{app.contactPerson}</div>
                                </div>
                              </td>
                              <td className="px-4 py-4">
                                <div>
                                  <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{app.email}</div>
                                  <div className={`text-xs mt-0.5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{app.phone}</div>
                                </div>
                              </td>
                              <td className="px-4 py-4">
                                <div>
                                  <div className={`text-sm font-mono font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{app.tenderRef}</div>
                                  <div className={`text-xs mt-0.5 line-clamp-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{app.tenderTitle}</div>
                                </div>
                              </td>
                              <td className="px-4 py-4">
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                                  {app.category}
                                </span>
                              </td>
                              <td className="px-4 py-4">
                                <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                  {new Date(app.submittedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                </span>
                              </td>
                              <td className="px-4 py-4">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${
                                  app.status === 'new'
                                    ? darkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-50 text-blue-700'
                                    : app.status === 'reviewed'
                                    ? darkMode ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-50 text-yellow-700'
                                    : app.status === 'shortlisted'
                                    ? darkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-50 text-green-700'
                                    : app.status === 'rejected'
                                    ? darkMode ? 'bg-red-500/20 text-red-400' : 'bg-red-50 text-red-700'
                                    : darkMode ? 'bg-gray-500/20 text-gray-400' : 'bg-gray-100 text-gray-600'
                                }`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${
                                    app.status === 'new' ? 'bg-blue-500' :
                                    app.status === 'reviewed' ? 'bg-yellow-500' :
                                    app.status === 'shortlisted' ? 'bg-green-500' :
                                    app.status === 'rejected' ? 'bg-red-500' : 'bg-gray-400'
                                  }`} />
                                  {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                                </span>
                              </td>
                              <td className="px-4 py-4">
                                <div className="flex items-center gap-1">
                                  <button className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${darkMode ? 'hover:bg-gray-700 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'}`} title="View">
                                    <i className="ri-eye-line" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      setSelectedItems([app.id]);
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
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div
            className={`w-full max-w-md rounded-xl p-6 ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-red-100">
              <i className="ri-delete-bin-line text-2xl text-red-600" />
            </div>
            <h3
              className={`text-xl font-bold text-center mb-2 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}
            >
              Delete {selectedItems.length} item(s)?
            </h3>
            <p
              className={`text-sm text-center mb-6 ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedItems([]);
                }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium ${
                  darkMode
                    ? 'bg-gray-700 text-white hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteNotices}
                className="flex-1 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create notice modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div
            className={`w-full max-w-lg rounded-xl ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            <div
              className={`flex items-center justify-between p-6 border-b ${
                darkMode ? 'border-gray-700' : 'border-gray-200'
              }`}
            >
              <h3
                className={`text-xl font-bold ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}
              >
                Add New Notice
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
                  darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                }`}
              >
                <i className="ri-close-line text-xl" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {/* Form fields (title, description, category, date, status) */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className={`w-full rounded-lg px-3 py-2.5 text-sm ${
                    darkMode ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900'
                  } border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-600`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  className={`w-full rounded-lg px-3 py-2.5 text-sm ${
                    darkMode ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900'
                  } border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-600`}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className={`w-full rounded-lg px-3 py-2.5 text-sm ${
                      darkMode ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900'
                    } border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-600`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    className={`w-full rounded-lg px-3 py-2.5 text-sm ${
                      darkMode ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900'
                    } border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-600`}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as 'Published' | 'Draft',
                    })
                  }
                  className={`w-full rounded-lg px-3 py-2.5 text-sm ${
                    darkMode ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900'
                  } border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-600`}
                >
                  <option value="Published">Published</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>
            </div>
            <div
              className={`flex gap-3 p-6 border-t ${
                darkMode ? 'border-gray-700' : 'border-gray-200'
              }`}
            >
              <button
                onClick={() => setShowCreateModal(false)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium ${
                  darkMode
                    ? 'bg-gray-700 text-white hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateNotice}
                disabled={
                  !formData.title ||
                  !formData.description ||
                  !formData.category ||
                  !formData.date
                }
                className="flex-1 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit notice modal – implementation similar to create modal (omitted for brevity) */}

      {/* Toast notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
          <div
            className={`flex items-center gap-3 px-5 py-3 rounded-lg shadow-lg ${
              darkMode ? 'bg-gray-700 text-white' : 'bg-gray-900 text-white'
            }`}
          >
            <i className="ri-check-line text-green-400" />
            <span className="text-sm">{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaCenterManagement;