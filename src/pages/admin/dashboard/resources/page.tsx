import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import DownloadRequests from './components/DownloadRequests';

// Pagination component - moved outside to prevent recreation on every render
const PaginationControls = ({ 
  currentPage, 
  totalPages, 
  totalItems,
  startIndex,
  endIndex,
  itemsPerPage,
  onPageChange, 
  onItemsPerPageChange,
  darkMode
}: {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  startIndex: number;
  endIndex: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (items: number) => void;
  darkMode: boolean;
}) => {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-6 py-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex items-center gap-2">
          <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Show</span>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              const newValue = Number(e.target.value);
              onItemsPerPageChange(newValue);
            }}
            className={`px-3 py-1.5 rounded-lg text-sm border cursor-pointer ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-red-600`}
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
          Showing {totalItems > 0 ? startIndex + 1 : 0} to {Math.min(endIndex, totalItems)} of {totalItems} entries
        </span>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm transition-colors ${
            currentPage === 1
              ? darkMode ? 'text-gray-600 cursor-not-allowed' : 'text-gray-300 cursor-not-allowed'
              : darkMode ? 'text-gray-400 hover:bg-gray-700 hover:text-white cursor-pointer' : 'text-gray-600 hover:bg-gray-100 cursor-pointer'
          }`}
          title="First page"
        >
          <i className="ri-skip-back-mini-line text-lg" />
        </button>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm transition-colors ${
            currentPage === 1
              ? darkMode ? 'text-gray-600 cursor-not-allowed' : 'text-gray-300 cursor-not-allowed'
              : darkMode ? 'text-gray-400 hover:bg-gray-700 hover:text-white cursor-pointer' : 'text-gray-600 hover:bg-gray-100 cursor-pointer'
          }`}
          title="Previous page"
        >
          <i className="ri-arrow-left-s-line text-lg" />
        </button>

        {getPageNumbers().map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === 'number' && onPageChange(page)}
            disabled={page === '...'}
            className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
              page === currentPage
                ? 'bg-red-600 text-white'
                : page === '...'
                  ? darkMode ? 'text-gray-500 cursor-default' : 'text-gray-400 cursor-default'
                  : darkMode ? 'text-gray-400 hover:bg-gray-700 hover:text-white cursor-pointer' : 'text-gray-600 hover:bg-gray-100 cursor-pointer'
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm transition-colors ${
            currentPage === totalPages
              ? darkMode ? 'text-gray-600 cursor-not-allowed' : 'text-gray-300 cursor-not-allowed'
              : darkMode ? 'text-gray-400 hover:bg-gray-700 hover:text-white cursor-pointer' : 'text-gray-600 hover:bg-gray-100 cursor-pointer'
          }`}
          title="Next page"
        >
          <i className="ri-arrow-right-s-line text-lg" />
        </button>
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm transition-colors ${
            currentPage === totalPages
              ? darkMode ? 'text-gray-600 cursor-not-allowed' : 'text-gray-300 cursor-not-allowed'
              : darkMode ? 'text-gray-400 hover:bg-gray-700 hover:text-white cursor-pointer' : 'text-gray-600 hover:bg-gray-100 cursor-pointer'
          }`}
          title="Last page"
        >
          <i className="ri-skip-forward-mini-line text-lg" />
        </button>
      </div>
    </div>
  );
};

const ResourcesManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('adminDarkMode');
    return saved ? JSON.parse(saved) : false;
  });
  const [currentTime, setCurrentTime] = useState(new Date());
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [filterCategory, setFilterCategory] = useState('All Resources');
  const [filterStatus, setFilterStatus] = useState('All Status');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortColumn, setSortColumn] = useState<'title' | 'category' | 'status' | 'date' | 'size' | 'downloads'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [activeTab, setActiveTab] = useState<'resources' | 'requests'>('resources');
  const newRequestsCount = 3;

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn');
    if (!isLoggedIn) {
      navigate('/admin');
    }
  }, [navigate]);

  useEffect(() => {
    localStorage.setItem('adminDarkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const adminUser = JSON.parse(
    sessionStorage.getItem('adminUser') || '{"name": "Admin", "email": "admin@rubamindrc.com"}'
  );

  const handleLogout = () => {
    sessionStorage.removeItem('adminLoggedIn');
    sessionStorage.removeItem('adminUser');
    navigate('/admin');
  };

  const [resources] = useState([
    { id: 'RES-001', title: 'Annual Report 2023', category: 'Reports', date: '2024-03-15', size: '2.5 MB', downloads: 145, status: 'Published' },
    { id: 'RES-002', title: 'Safety Certificate', category: 'Certifications', date: '2024-03-10', size: '1.2 MB', downloads: 89, status: 'Published' },
    { id: 'RES-003', title: 'Financial Statement Q4', category: 'Financials Report', date: '2024-03-05', size: '3.1 MB', downloads: 234, status: 'Published' },
    { id: 'RES-004', title: 'ISO 9001 Certificate', category: 'Certifications', date: '2024-02-28', size: '0.8 MB', downloads: 156, status: 'Published' },
    { id: 'RES-005', title: 'Sustainability Report', category: 'Reports', date: '2024-02-20', size: '4.2 MB', downloads: 198, status: 'Draft' },
    { id: 'RES-006', title: 'Environmental Policy', category: 'Policies', date: '2024-02-15', size: '1.5 MB', downloads: 67, status: 'Published' },
    { id: 'RES-007', title: 'Production Statistics 2023', category: 'Statistics Report', date: '2024-02-10', size: '2.8 MB', downloads: 112, status: 'Published' },
    { id: 'RES-008', title: 'Quality Assurance Certificate', category: 'Certifications', date: '2024-02-05', size: '1.1 MB', downloads: 78, status: 'Published' },
    { id: 'RES-009', title: 'Quarterly Financial Report Q3', category: 'Financials Report', date: '2024-01-25', size: '2.9 MB', downloads: 189, status: 'Draft' },
    { id: 'RES-010', title: 'Health & Safety Policy', category: 'Policies', date: '2024-01-20', size: '1.7 MB', downloads: 92, status: 'Published' },
    { id: 'RES-011', title: 'Mining Operations Report', category: 'Reports', date: '2024-01-15', size: '3.5 MB', downloads: 167, status: 'Published' },
    { id: 'RES-012', title: 'Export Statistics 2023', category: 'Statistics Report', date: '2024-01-10', size: '2.2 MB', downloads: 134, status: 'Published' },
    { id: 'RES-013', title: 'Supply Contract 2024', category: 'Contracts', date: '2024-01-05', size: '1.8 MB', downloads: 56, status: 'Archived' },
    { id: 'RES-014', title: 'Mining Association Membership', category: 'Affiliations', date: '2023-12-20', size: '0.5 MB', downloads: 34, status: 'Published' },
    { id: 'RES-015', title: 'Excellence Award 2023', category: 'Awards', date: '2023-12-15', size: '0.9 MB', downloads: 87, status: 'Published' },
    { id: 'RES-016', title: 'Vendor Agreement', category: 'Contracts', date: '2023-12-10', size: '2.1 MB', downloads: 45, status: 'Published' },
    { id: 'RES-017', title: 'Industry Federation Certificate', category: 'Affiliations', date: '2023-12-05', size: '0.6 MB', downloads: 29, status: 'Published' },
    { id: 'RES-018', title: 'Best Employer Award 2023', category: 'Awards', date: '2023-11-28', size: '0.7 MB', downloads: 63, status: 'Archived' },
  ]);

  const categoryOptions = [
    'All Resources',
    'Statistics Report',
    'Financials Report',
    'Contracts',
    'Reports',
    'Policies',
    'Certifications',
    'Affiliations',
    'Awards'
  ];

  const statusOptions = ['All Status', 'Published', 'Draft', 'Archived'];

  const handleSort = (column: 'title' | 'category' | 'status' | 'date' | 'size' | 'downloads') => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const filteredResources = resources.filter((resource) => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'All Resources' || resource.category === filterCategory;
    const matchesStatus = filterStatus === 'All Status' || resource.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const sortedResources = [...filteredResources].sort((a, b) => {
    let compareValue = 0;

    switch (sortColumn) {
      case 'title':
        compareValue = a.title.localeCompare(b.title);
        break;
      case 'category':
        compareValue = a.category.localeCompare(b.category);
        break;
      case 'status':
        compareValue = a.status.localeCompare(b.status);
        break;
      case 'date':
        compareValue = new Date(a.date).getTime() - new Date(b.date).getTime();
        break;
      case 'size':
        const sizeA = parseFloat(a.size.replace(' MB', ''));
        const sizeB = parseFloat(b.size.replace(' MB', ''));
        compareValue = sizeA - sizeB;
        break;
      case 'downloads':
        compareValue = a.downloads - b.downloads;
        break;
    }

    return sortDirection === 'asc' ? compareValue : -compareValue;
  });

  const totalPages = Math.ceil(sortedResources.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedResources = sortedResources.slice(startIndex, endIndex);

  const handleSelectAll = () => {
    const items = filteredResources.map((r) => r.id);
    setSelectedItems(selectedItems.length === items.length ? [] : items);
  };

  const handleSelectItem = (id: string) => {
    setSelectedItems((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
  };

  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

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

  const breadcrumbs = [
    { label: 'Home', path: '/', icon: 'ri-home-4-line' },
    { label: 'Admin', path: '/admin' },
    { label: 'Dashboard', path: '/admin/dashboard' },
    { label: 'Resources Center', path: '/admin/dashboard/resources' },
  ];

  const SortIcon = ({ column }: { column: 'title' | 'category' | 'status' | 'date' | 'size' | 'downloads' }) => {
    if (sortColumn !== column) {
      return <i className={`ri-arrow-up-down-line text-sm ${darkMode ? 'text-gray-600' : 'text-gray-400'} opacity-50`} />;
    }
    return (
      <i className={`${sortDirection === 'asc' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'} text-sm text-red-600`} />
    );
  };

  return (
    <div className={`min-h-screen flex ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Sidebar */}
      <aside className={`${sidebarCollapsed ? 'w-20' : 'w-64'} ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r flex flex-col fixed h-full transition-all duration-300 z-20`}>
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

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {sidebarItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-red-600 text-white shadow-md'
                    : darkMode
                      ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                } ${sidebarCollapsed ? 'justify-center' : ''}`}
                title={darkMode ? item.label : ''}
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
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search resources..." className={`w-full pl-11 pr-4 py-2.5 ${darkMode ? 'bg-gray-700 text-white placeholder-gray-400 border-gray-600' : 'bg-gray-50 text-gray-900 placeholder-gray-500 border-gray-200'} border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600`} />
              </div>
            </div>

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

              <Link to="/" target="_blank" className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white hover:bg-red-700 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap">
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
                  <Link to={crumb.path} className={`flex items-center transition-colors cursor-pointer ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}>
                    {crumb.icon && <i className={`${crumb.icon} mr-1.5`} />}
                    {crumb.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'Merriweather, serif' }}>
                Resources Management
              </h1>
              <p className={`mt-2 text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Manage company resources, documents and download requests
              </p>
            </div>
            {activeTab === 'resources' && (
            <button className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white hover:bg-red-700 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap">
              <i className="ri-upload-2-line text-lg" />
              Upload Resource
            </button>
            )}
          </div>

          {/* Stats Cards - only show for resources tab */}
          {activeTab === 'resources' && (
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-6">
            <div className={`rounded-lg p-6 border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Resources</p>
                  <p className={`text-3xl font-bold mt-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {resources.length}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${darkMode ? 'bg-blue-500/20' : 'bg-blue-50'}`}>
                  <i className={`ri-folder-line text-xl ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                </div>
              </div>
            </div>

            <div className={`rounded-lg p-6 border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Reports</p>
                  <p className={`text-3xl font-bold mt-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {resources.filter(r => r.category === 'Reports').length}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${darkMode ? 'bg-green-500/20' : 'bg-green-50'}`}>
                  <i className={`ri-file-text-line text-xl ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                </div>
              </div>
            </div>

            <div className={`rounded-lg p-6 border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Certifications</p>
                  <p className={`text-3xl font-bold mt-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {resources.filter(r => r.category === 'Certifications').length}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${darkMode ? 'bg-yellow-500/20' : 'bg-yellow-50'}`}>
                  <i className={`ri-award-line text-xl ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
                </div>
              </div>
            </div>

            <div className={`rounded-lg p-6 border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Downloads</p>
                  <p className={`text-3xl font-bold mt-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {resources.reduce((sum, r) => sum + r.downloads, 0)}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${darkMode ? 'bg-red-600/20' : 'bg-red-50'}`}>
                  <i className={`ri-download-line text-xl ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
                </div>
              </div>
            </div>
          </div>
          )}

          {/* Content Card */}
          <div className={`rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>

            {/* Tabs - inside card like Jobs page */}
            <div className={`px-4 pt-3 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => { setActiveTab('resources'); setSelectedItems([]); setSearchQuery(''); setCurrentPage(1); }}
                  className={`px-4 py-2.5 text-sm font-medium rounded-t-lg transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === 'resources'
                      ? darkMode ? 'bg-gray-700 text-white border border-b-0 border-gray-600' : 'bg-white text-gray-900 border border-b-0 border-gray-200 shadow-sm'
                      : darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700/50' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <i className="ri-folder-line mr-1.5" />
                  Resources
                  <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
                    activeTab === 'resources'
                      ? darkMode ? 'bg-red-600/20 text-red-400' : 'bg-red-50 text-red-600'
                      : darkMode ? 'bg-gray-600 text-gray-400' : 'bg-gray-100 text-gray-500'
                  }`}>{resources.length}</span>
                </button>
                <button
                  onClick={() => { setActiveTab('requests'); setSelectedItems([]); setSearchQuery(''); setCurrentPage(1); }}
                  className={`px-4 py-2.5 text-sm font-medium rounded-t-lg transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === 'requests'
                      ? darkMode ? 'bg-gray-700 text-white border border-b-0 border-gray-600' : 'bg-white text-gray-900 border border-b-0 border-gray-200 shadow-sm'
                      : darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700/50' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <i className="ri-download-line mr-1.5" />
                  Download Requests
                  {newRequestsCount > 0 && (
                    <span className="ml-2 min-w-5 h-5 inline-flex items-center justify-center px-1.5 text-xs font-bold rounded-full bg-red-600 text-white">{newRequestsCount}</span>
                  )}
                </button>
              </div>
            </div>

            {/* Resources Tab Content */}
            {activeTab === 'resources' && (
            <>
            {/* Filters - matching Jobs page style */}
            <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between flex-wrap gap-4`}>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Status:</span>
                  <select 
                    value={filterStatus} 
                    onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }} 
                    className={`px-3 py-2 rounded-lg text-sm cursor-pointer ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-200'} border focus:outline-none focus:ring-2 focus:ring-red-600`}
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {selectedItems.length > 0 && (
                  <button onClick={() => setShowDeleteModal(true)} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors cursor-pointer whitespace-nowrap">
                    <i className="ri-delete-bin-line" />
                    Delete ({selectedItems.length})
                  </button>
                )}
                {/* View Toggle */}
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
                  {filteredResources.length} items
                </span>
              </div>
            </div>

            {/* Table - List View */}
            {viewMode === 'list' ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}>
                  <tr>
                    <th className="w-12 px-4 py-3">
                      <input type="checkbox" checked={selectedItems.length === filteredResources.length && filteredResources.length > 0} onChange={handleSelectAll} className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-600 cursor-pointer" />
                    </th>
                    <th 
                      onClick={() => handleSort('title')}
                      className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer select-none transition-colors ${
                        sortColumn === 'title' 
                          ? 'text-red-600' 
                          : darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        Title
                        <SortIcon column="title" />
                      </div>
                    </th>
                    <th 
                      onClick={() => handleSort('category')}
                      className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer select-none transition-colors ${
                        sortColumn === 'category' 
                          ? 'text-red-600' 
                          : darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        Category
                        <SortIcon column="category" />
                      </div>
                    </th>
                    <th 
                      onClick={() => handleSort('status')}
                      className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer select-none transition-colors ${
                        sortColumn === 'status' 
                          ? 'text-red-600' 
                          : darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        Status
                        <SortIcon column="status" />
                      </div>
                    </th>
                    <th 
                      onClick={() => handleSort('date')}
                      className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer select-none transition-colors ${
                        sortColumn === 'date' 
                          ? 'text-red-600' 
                          : darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        Date
                        <SortIcon column="date" />
                      </div>
                    </th>
                    <th 
                      onClick={() => handleSort('size')}
                      className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer select-none transition-colors ${
                        sortColumn === 'size' 
                          ? 'text-red-600' 
                          : darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        Size
                        <SortIcon column="size" />
                      </div>
                    </th>
                    <th 
                      onClick={() => handleSort('downloads')}
                      className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer select-none transition-colors ${
                        sortColumn === 'downloads' 
                          ? 'text-red-600' 
                          : darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        Downloads
                        <SortIcon column="downloads" />
                      </div>
                    </th>
                    <th className={`px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Actions</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                  {paginatedResources.map((resource) => (
                    <tr key={resource.id} className={`${darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'} transition-colors`}>
                      <td className="px-4 py-4">
                        <input type="checkbox" checked={selectedItems.includes(resource.id)} onChange={() => handleSelectItem(resource.id)} className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-600 cursor-pointer" />
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${darkMode ? 'bg-red-600/20' : 'bg-red-50'}`}>
                            <i className={`ri-file-pdf-line ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
                          </div>
                          <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{resource.title}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`text-xs px-2.5 py-1 rounded-full ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>{resource.category}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`text-xs px-2.5 py-1 rounded-full ${
                          resource.status === 'Published' 
                            ? 'bg-green-100 text-green-700' 
                            : resource.status === 'Draft'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {resource.status}
                        </span>
                      </td>
                      <td className={`px-4 py-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{resource.date}</td>
                      <td className={`px-4 py-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{resource.size}</td>
                      <td className={`px-4 py-4 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{resource.downloads}</td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${darkMode ? 'hover:bg-gray-700 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'}`} title="View">
                            <i className="ri-eye-line" />
                          </button>
                          <button className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${darkMode ? 'hover:bg-gray-700 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'}`} title="Download">
                            <i className="ri-download-line" />
                          </button>
                          <button className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${darkMode ? 'hover:bg-gray-700 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'}`} title="Edit">
                            <i className="ri-edit-line" />
                          </button>
                          <button onClick={() => { setSelectedItems([resource.id]); setShowDeleteModal(true); }} className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${darkMode ? 'hover:bg-red-600/20 text-gray-400 hover:text-red-400' : 'hover:bg-red-50 text-gray-500 hover:text-red-600'}`} title="Delete">
                            <i className="ri-delete-bin-line" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Empty State - List View */}
              {viewMode === 'list' && filteredResources.length === 0 && (
                <div className="py-16 text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <i className={`ri-inbox-line text-3xl ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                  </div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>No resources found</p>
                </div>
              )}

              {/* Pagination */}
              {filteredResources.length > 0 && (
                <PaginationControls
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={sortedResources.length}
                  startIndex={startIndex}
                  endIndex={endIndex}
                  itemsPerPage={itemsPerPage}
                  onPageChange={setCurrentPage}
                  onItemsPerPageChange={(items) => { setItemsPerPage(items); setCurrentPage(1); }}
                  darkMode={darkMode}
                />
              )}
            </div>
            ) : (
            /* Grid View */
            <div className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {paginatedResources.map((resource) => (
                  <div
                    key={resource.id}
                    className={`rounded-lg border p-4 transition-all hover:shadow-lg ${
                      darkMode ? 'bg-gray-700/50 border-gray-600 hover:border-gray-500' : 'bg-white border-gray-200 hover:border-gray-300'
                    } ${selectedItems.includes(resource.id) ? 'ring-2 ring-red-600' : ''}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(resource.id)}
                        onChange={() => handleSelectItem(resource.id)}
                        className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-600 cursor-pointer"
                      />
                      <span className={`text-xs px-2 py-1 rounded ${
                        resource.status === 'Published' 
                          ? 'bg-green-100 text-green-700' 
                          : resource.status === 'Draft'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {resource.status}
                      </span>
                    </div>

                    <div className={`w-full h-20 rounded-lg flex items-center justify-center mb-3 ${darkMode ? 'bg-gray-600' : 'bg-red-50'}`}>
                      <i className={`ri-file-pdf-line text-3xl ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
                    </div>

                    <h3 className={`text-sm font-semibold mb-1 line-clamp-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {resource.title}
                    </h3>

                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                        {resource.category}
                      </span>
                      <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {resource.size}
                      </span>
                    </div>

                    <div className={`flex items-center justify-between text-xs mb-3 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      <span>{resource.date}</span>
                      <span className="flex items-center gap-1">
                        <i className="ri-download-line" />
                        {resource.downloads}
                      </span>
                    </div>

                    <div className={`flex items-center justify-center gap-1 pt-3 border-t ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                      <button className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${darkMode ? 'hover:bg-gray-600 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'}`} title="View">
                        <i className="ri-eye-line" />
                      </button>
                      <button className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${darkMode ? 'hover:bg-gray-600 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'}`} title="Download">
                        <i className="ri-download-line" />
                      </button>
                      <button className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${darkMode ? 'hover:bg-gray-600 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'}`} title="Edit">
                        <i className="ri-edit-line" />
                      </button>
                      <button onClick={() => { setSelectedItems([resource.id]); setShowDeleteModal(true); }} className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${darkMode ? 'hover:bg-red-600/20 text-gray-400 hover:text-red-400' : 'hover:bg-red-50 text-gray-500 hover:text-red-600'}`} title="Delete">
                        <i className="ri-delete-bin-line" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Empty State - List View */}
              {viewMode === 'list' && filteredResources.length === 0 && (
                <div className="py-16 text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <i className={`ri-inbox-line text-3xl ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                  </div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>No resources found</p>
                </div>
              )}

              {/* Pagination */}
              {filteredResources.length > 0 && (
                <PaginationControls
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={sortedResources.length}
                  startIndex={startIndex}
                  endIndex={endIndex}
                  itemsPerPage={itemsPerPage}
                  onPageChange={setCurrentPage}
                  onItemsPerPageChange={(items) => { setItemsPerPage(items); setCurrentPage(1); }}
                  darkMode={darkMode}
                />
              )}
            </div>
            )}
            </>
            )}

            {/* Download Requests Tab Content */}
            {activeTab === 'requests' && (
              <DownloadRequests darkMode={darkMode} searchQuery={searchQuery} />
            )}

          </div>
        </div>
      </main>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-md rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-red-100">
              <i className="ri-delete-bin-line text-2xl text-red-600" />
            </div>
            <h3 className={`text-xl font-bold text-center mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Delete {selectedItems.length} item(s)?
            </h3>
            <p className={`text-sm text-center mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => { setShowDeleteModal(false); setSelectedItems([]); }} className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                Cancel
              </button>
              <button onClick={() => { setShowDeleteModal(false); setSelectedItems([]); showToastMessage('Items deleted successfully'); }} className="flex-1 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors cursor-pointer whitespace-nowrap">
                Delete
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

export default ResourcesManagement;