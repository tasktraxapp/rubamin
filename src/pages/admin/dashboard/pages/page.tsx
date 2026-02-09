import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

interface PageItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  status: 'published' | 'draft';
  lastModified: string;
  author: string;
}

type SortField = 'title' | 'category' | 'status' | 'lastModified';
type SortOrder = 'asc' | 'desc';

const PagesManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('adminDarkMode');
    return saved ? JSON.parse(saved) : false;
  });
  const [currentTime, setCurrentTime] = useState(new Date());
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPages, setSelectedPages] = useState<string[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [pageToDelete, setPageToDelete] = useState<PageItem | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>('lastModified');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [previewPage, setPreviewPage] = useState<PageItem | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' } | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const ITEMS_PER_PAGE = 10;
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

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

  const categories = [
    { id: 'all', label: 'All Pages', count: 32 },
    { id: 'home', label: 'Home', count: 1 },
    { id: 'company', label: 'Company', count: 5 },
    { id: 'products', label: 'Products', count: 3 },
    { id: 'sustainability', label: 'Sustainability', count: 2 },
    { id: 'csr', label: 'CSR', count: 2 },
    { id: 'media', label: 'Media', count: 3 },
    { id: 'gallery', label: 'Gallery', count: 4 },
    { id: 'resources', label: 'Resources', count: 9 },
    { id: 'other', label: 'Other', count: 3 },
  ];

  const [pages, setPages] = useState<PageItem[]>([
    // Home
    { id: '1', title: 'Home', slug: '/', category: 'home', status: 'published', lastModified: '2024-01-20', author: 'Admin' },
    // Company
    { id: '2', title: 'Corporate Overview', slug: '/company/corporate-overview', category: 'company', status: 'published', lastModified: '2024-01-15', author: 'Admin' },
    { id: '3', title: 'Vision & Mission', slug: '/company/vision-mission', category: 'company', status: 'published', lastModified: '2024-01-14', author: 'Admin' },
    { id: '4', title: 'Shareholders', slug: '/company/shareholders', category: 'company', status: 'published', lastModified: '2024-01-13', author: 'Admin' },
    { id: '5', title: 'Core Team', slug: '/company/core-team', category: 'company', status: 'published', lastModified: '2024-01-12', author: 'Admin' },
    { id: '6', title: 'Corporate Governance', slug: '/company/corporate-governance', category: 'company', status: 'published', lastModified: '2024-01-11', author: 'Admin' },
    // Products
    { id: '7', title: 'Copper Blister', slug: '/products/copper-blister', category: 'products', status: 'published', lastModified: '2024-01-10', author: 'Admin' },
    { id: '8', title: 'Industrial Gas', slug: '/products/industrial-gas', category: 'products', status: 'published', lastModified: '2024-01-09', author: 'Admin' },
    { id: '9', title: 'Medical Gas', slug: '/products/medical-gas', category: 'products', status: 'published', lastModified: '2024-01-08', author: 'Admin' },
    // Sustainability
    { id: '10', title: 'HSE Policy', slug: '/sustainability/hse', category: 'sustainability', status: 'published', lastModified: '2024-01-07', author: 'Admin' },
    { id: '11', title: 'ESIA & EMP', slug: '/sustainability/esia-emp', category: 'sustainability', status: 'published', lastModified: '2024-01-06', author: 'Admin' },
    // CSR
    { id: '12', title: 'Social Initiatives', slug: '/csr/social-initiatives', category: 'csr', status: 'published', lastModified: '2024-01-05', author: 'Admin' },
    { id: '13', title: 'DOT Program', slug: '/csr/dot', category: 'csr', status: 'published', lastModified: '2024-01-04', author: 'Admin' },
    // Media
    { id: '14', title: 'Media Center', slug: '/media', category: 'media', status: 'published', lastModified: '2024-01-03', author: 'Admin' },
    { id: '15', title: 'Notices', slug: '/media/notices', category: 'media', status: 'published', lastModified: '2024-01-02', author: 'Admin' },
    { id: '16', title: 'Tenders', slug: '/media/tenders', category: 'media', status: 'published', lastModified: '2024-01-01', author: 'Admin' },
    // Gallery
    { id: '17', title: 'Gallery', slug: '/gallery', category: 'gallery', status: 'published', lastModified: '2024-01-18', author: 'Admin' },
    { id: '18', title: 'Facilities', slug: '/gallery/facilities', category: 'gallery', status: 'published', lastModified: '2024-01-17', author: 'Admin' },
    { id: '19', title: 'Trainings', slug: '/gallery/trainings', category: 'gallery', status: 'published', lastModified: '2024-01-16', author: 'Admin' },
    { id: '20', title: 'Visits', slug: '/gallery/visits', category: 'gallery', status: 'published', lastModified: '2024-01-15', author: 'Admin' },
    // Resources
    { id: '21', title: 'Resources', slug: '/resources', category: 'resources', status: 'published', lastModified: '2024-01-19', author: 'Admin' },
    { id: '22', title: 'Statistics Report', slug: '/resources/statistics-report', category: 'resources', status: 'published', lastModified: '2024-01-18', author: 'Admin' },
    { id: '23', title: 'Financials Report', slug: '/resources/financials-report', category: 'resources', status: 'published', lastModified: '2024-01-17', author: 'Admin' },
    { id: '24', title: 'Contracts', slug: '/resources/contracts', category: 'resources', status: 'published', lastModified: '2024-01-16', author: 'Admin' },
    { id: '25', title: 'Reports', slug: '/resources/reports', category: 'resources', status: 'published', lastModified: '2024-01-15', author: 'Admin' },
    { id: '26', title: 'Policies', slug: '/resources/policies', category: 'resources', status: 'published', lastModified: '2024-01-14', author: 'Admin' },
    { id: '27', title: 'Certifications', slug: '/resources/certifications', category: 'resources', status: 'published', lastModified: '2024-01-13', author: 'Admin' },
    { id: '28', title: 'Affiliations', slug: '/resources/affiliations', category: 'resources', status: 'published', lastModified: '2024-01-12', author: 'Admin' },
    { id: '29', title: 'Awards', slug: '/resources/awards', category: 'resources', status: 'published', lastModified: '2024-01-11', author: 'Admin' },
    // Other
    { id: '30', title: 'Jobs', slug: '/jobs', category: 'other', status: 'published', lastModified: '2024-01-10', author: 'Admin' },
    { id: '31', title: 'Contact', slug: '/contact', category: 'other', status: 'published', lastModified: '2024-01-09', author: 'Admin' },
    { id: '32', title: 'Webmail', slug: '/webmail', category: 'other', status: 'published', lastModified: '2024-01-08', author: 'Admin' },
  ]);

  const handleToggleStatus = (pageId: string) => {
    setPages(prev => prev.map(p => {
      if (p.id === pageId) {
        const newStatus = p.status === 'published' ? 'draft' : 'published';
        setToastMessage({
          text: `"${p.title}" ${newStatus === 'published' ? 'published' : 'unpublished'} successfully`,
          type: newStatus === 'published' ? 'success' : 'info',
        });
        return { ...p, status: newStatus, lastModified: new Date().toISOString().split('T')[0] };
      }
      return p;
    }));
  };

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

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

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  };

  const filteredPages = pages.filter(page => {
    const matchesSearch = page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         page.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || page.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || page.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const sortedPages = [...filteredPages].sort((a, b) => {
    let aValue: string | number = '';
    let bValue: string | number = '';

    switch (sortField) {
      case 'title':
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
        break;
      case 'category':
        aValue = a.category.toLowerCase();
        bValue = b.category.toLowerCase();
        break;
      case 'status':
        aValue = a.status.toLowerCase();
        bValue = b.status.toLowerCase();
        break;
      case 'lastModified':
        aValue = new Date(a.lastModified).getTime();
        bValue = new Date(b.lastModified).getTime();
        break;
    }

    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedPages.length / ITEMS_PER_PAGE);
  const paginatedPages = sortedPages.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedStatus]);

  const handleSelectAll = () => {
    if (selectedPages.length === paginatedPages.length && paginatedPages.length > 0) {
      setSelectedPages([]);
    } else {
      setSelectedPages(paginatedPages.map(p => p.id));
    }
  };

  const handleSelectPage = (id: string) => {
    if (selectedPages.includes(id)) {
      setSelectedPages(selectedPages.filter(p => p !== id));
    } else {
      setSelectedPages([...selectedPages, id]);
    }
  };

  const handleDeleteClick = (page: PageItem) => {
    setPageToDelete(page);
    setShowDeleteModal(true);
  };

  const handlePreview = (page: PageItem) => {
    setPreviewPage(page);
    setPreviewLoading(true);
    setPreviewDevice('desktop');
  };

  const closePreview = () => {
    setPreviewPage(null);
    setPreviewLoading(false);
  };

  const getPreviewWidth = () => {
    switch (previewDevice) {
      case 'mobile': return 'max-w-[375px]';
      case 'tablet': return 'max-w-[768px]';
      default: return 'max-w-full';
    }
  };

  const confirmDelete = () => {
    // Handle delete logic here
    setShowDeleteModal(false);
    setPageToDelete(null);
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
                className={`relative flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
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
            {/* Search Bar */}
            <div className="flex-1 max-w-xl">
              <div className="relative">
                <i className={`ri-search-line absolute left-4 top-1/2 -translate-y-1/2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search pages..."
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
            <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Pages</span>
          </nav>
        </div>

        {/* Page Content */}
        <div className="p-8">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'Merriweather, serif' }}>
                Pages Management
              </h1>
              <p className={`mt-2 text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Manage and edit your website pages content
              </p>
            </div>
            <Link
              to="/admin/dashboard/pages/new"
              className="flex items-center gap-2 px-5 py-3 bg-red-600 text-white hover:bg-red-700 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap shadow-lg hover:shadow-xl"
            >
              <i className="ri-add-line text-lg" />
              Add New Page
            </Link>
          </div>

          {/* Stats Badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {/* Total Pages */}
            <div className={`flex items-center gap-4 p-4 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className={`w-12 h-12 flex items-center justify-center rounded-lg ${darkMode ? 'bg-red-600/20' : 'bg-red-50'}`}>
                <i className={`ri-file-list-3-line text-xl ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
              </div>
              <div>
                <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{pages.length}</p>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Pages</p>
              </div>
            </div>

            {/* Published */}
            <div className={`flex items-center gap-4 p-4 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className={`w-12 h-12 flex items-center justify-center rounded-lg ${darkMode ? 'bg-green-600/20' : 'bg-green-50'}`}>
                <i className={`ri-checkbox-multiple-line text-xl ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
              </div>
              <div>
                <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{pages.filter(p => p.status === 'published').length}</p>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Published</p>
              </div>
            </div>

            {/* Drafts */}
            <div className={`flex items-center gap-4 p-4 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className={`w-12 h-12 flex items-center justify-center rounded-lg ${darkMode ? 'bg-yellow-600/20' : 'bg-yellow-50'}`}>
                <i className={`ri-draft-line text-xl ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
              </div>
              <div>
                <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{pages.filter(p => p.status === 'draft').length}</p>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Drafts</p>
              </div>
            </div>

            {/* Categories */}
            <div className={`flex items-center gap-4 p-4 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className={`w-12 h-12 flex items-center justify-center rounded-lg ${darkMode ? 'bg-blue-600/20' : 'bg-blue-50'}`}>
                <i className={`ri-folder-3-line text-xl ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              </div>
              <div>
                <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{categories.length - 1}</p>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Categories</p>
              </div>
            </div>
          </div>

          {/* Filters & Actions Bar */}
          <div className={`rounded-lg p-4 mb-6 border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="flex flex-wrap items-center gap-4">
              {/* Category Filter */}
              <div className="flex items-center gap-2">
                <span className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Category:</span>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className={`px-3 py-2 rounded-lg text-sm border cursor-pointer ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-gray-50 border-gray-200 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-red-600`}
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.label} ({cat.count})</option>
                  ))}
                </select>
              </div>

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
                  <option value="all">All Status</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>

              {/* Bulk Actions */}
              {selectedPages.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {selectedPages.length} selected
                  </span>
                  <button className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    darkMode 
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}>
                    <i className="ri-checkbox-circle-line mr-1" />
                    Publish
                  </button>
                  <button className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    darkMode 
                      ? 'bg-red-600/20 text-red-400 hover:bg-red-600/30' 
                      : 'bg-red-50 text-red-600 hover:bg-red-100'
                  }`}>
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
                  {sortedPages.length} items
                </span>
              </div>
            </div>
          </div>

          {/* Pages Table - List View */}
          {viewMode === 'list' ? (
          <div className={`rounded-lg border overflow-hidden ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                    <th className="px-4 py-4 text-left">
                      <input
                        type="checkbox"
                        checked={selectedPages.length === paginatedPages.length && paginatedPages.length > 0}
                        onChange={handleSelectAll}
                        className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-600/20 cursor-pointer"
                      />
                    </th>
                    <th 
                      onClick={() => handleSort('title')}
                      className={`px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer select-none transition-colors ${
                        sortField === 'title' 
                          ? 'text-red-600' 
                          : darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        Page Title
                        <i className={`text-sm ${
                          sortField === 'title' 
                            ? sortOrder === 'asc' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'
                            : 'ri-arrow-up-down-line opacity-40'
                        }`} />
                      </div>
                    </th>
                    <th 
                      onClick={() => handleSort('category')}
                      className={`px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer select-none transition-colors ${
                        sortField === 'category' 
                          ? 'text-red-600' 
                          : darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        Category
                        <i className={`text-sm ${
                          sortField === 'category' 
                            ? sortOrder === 'asc' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'
                            : 'ri-arrow-up-down-line opacity-40'
                        }`} />
                      </div>
                    </th>
                    <th 
                      onClick={() => handleSort('status')}
                      className={`px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer select-none transition-colors ${
                        sortField === 'status' 
                          ? 'text-red-600' 
                          : darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        Status
                        <i className={`text-sm ${
                          sortField === 'status' 
                            ? sortOrder === 'asc' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'
                            : 'ri-arrow-up-down-line opacity-40'
                        }`} />
                      </div>
                    </th>
                    <th 
                      onClick={() => handleSort('lastModified')}
                      className={`px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer select-none transition-colors ${
                        sortField === 'lastModified' 
                          ? 'text-red-600' 
                          : darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        Last Modified
                        <i className={`text-sm ${
                          sortField === 'lastModified' 
                            ? sortOrder === 'asc' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'
                            : 'ri-arrow-up-down-line opacity-40'
                        }`} />
                      </div>
                    </th>
                    <th className={`px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                  {paginatedPages.map((page) => (
                    <tr 
                      key={page.id} 
                      className={`transition-colors ${
                        darkMode 
                          ? 'hover:bg-gray-700/50' 
                          : 'hover:bg-gray-50'
                      } ${selectedPages.includes(page.id) ? darkMode ? 'bg-gray-700/30' : 'bg-red-50/50' : ''}`}
                    >
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selectedPages.includes(page.id)}
                          onChange={() => handleSelectPage(page.id)}
                          className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-600/20 cursor-pointer"
                        />
                      </td>
                      <td className="px-4 py-4">
                        <div>
                          <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {page.title}
                          </p>
                          <p className={`text-xs mt-0.5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                            {page.slug}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium capitalize ${
                          darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {page.category}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleToggleStatus(page.id)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                              page.status === 'published'
                                ? 'bg-green-500 focus:ring-green-500'
                                : darkMode ? 'bg-gray-600 focus:ring-gray-500' : 'bg-gray-300 focus:ring-gray-400'
                            } ${darkMode ? 'focus:ring-offset-gray-800' : 'focus:ring-offset-white'}`}
                            title={page.status === 'published' ? 'Click to unpublish' : 'Click to publish'}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
                                page.status === 'published' ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                          <span className={`text-xs font-medium capitalize ${
                            page.status === 'published'
                              ? darkMode ? 'text-green-400' : 'text-green-700'
                              : darkMode ? 'text-yellow-400' : 'text-yellow-700'
                          }`}>
                            {page.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div>
                          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {new Date(page.lastModified).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })}
                          </p>
                          <p className={`text-xs mt-0.5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                            by {page.author}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handlePreview(page)}
                            className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                              darkMode 
                                ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                                : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'
                            }`}
                            title="Quick Preview"
                          >
                            <i className="ri-eye-line" />
                          </button>
                          <Link
                            to={`/admin/dashboard/pages/edit/${page.id}`}
                            className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                              darkMode 
                                ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                                : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'
                            }`}
                            title="Edit"
                          >
                            <i className="ri-edit-line" />
                          </Link>
                          <Link
                            to={page.slug}
                            target="_blank"
                            className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                              darkMode ? 'hover:bg-red-600/20 text-gray-400 hover:text-red-400' : 'hover:bg-red-50 text-gray-500 hover:text-red-600'
                            }`}
                            title="Open in New Tab"
                          >
                            <i className="ri-external-link-line" />
                          </Link>
                          <button
                            onClick={() => handleDeleteClick(page)}
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
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className={`px-4 py-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between">
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Showing {sortedPages.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, sortedPages.length)} of {sortedPages.length} pages
                </p>
                {totalPages > 1 && (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === 1
                          ? darkMode ? 'bg-gray-700/50 text-gray-600 cursor-not-allowed' : 'bg-gray-50 text-gray-300 cursor-not-allowed'
                          : darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 cursor-pointer' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 cursor-pointer'
                      }`}
                    >
                      <i className="ri-arrow-left-s-line" />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                          pageNum === currentPage
                            ? 'bg-red-600 text-white'
                            : darkMode
                              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === totalPages
                          ? darkMode ? 'bg-gray-700/50 text-gray-600 cursor-not-allowed' : 'bg-gray-50 text-gray-300 cursor-not-allowed'
                          : darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 cursor-pointer' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 cursor-pointer'
                      }`}
                    >
                      <i className="ri-arrow-right-s-line" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          ) : (
          /* Pages Grid View */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
            {paginatedPages.map((page) => (
              <div
                key={page.id}
                className={`rounded-lg border p-4 transition-all hover:shadow-lg ${
                  darkMode ? 'bg-gray-800 border-gray-700 hover:border-gray-600' : 'bg-white border-gray-200 hover:border-gray-300'
                } ${selectedPages.includes(page.id) ? darkMode ? 'ring-2 ring-red-600' : 'ring-2 ring-red-600' : ''}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <input
                    type="checkbox"
                    checked={selectedPages.includes(page.id)}
                    onChange={() => handleSelectPage(page.id)}
                    className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-600/20 cursor-pointer mt-1"
                  />
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleToggleStatus(page.id)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 cursor-pointer focus:outline-none ${
                        page.status === 'published'
                          ? 'bg-green-500'
                          : darkMode ? 'bg-gray-600' : 'bg-gray-300'
                      }`}
                      title={page.status === 'published' ? 'Click to unpublish' : 'Click to publish'}
                    >
                      <span
                        className={`inline-block h-3 w-3 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
                          page.status === 'published' ? 'translate-x-5' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                <div className="mb-3">
                  <div className={`w-full h-24 rounded-lg flex items-center justify-center mb-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <i className={`ri-file-text-line text-3xl ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                  </div>
                  <h3 className={`text-sm font-semibold mb-1 truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {page.title}
                  </h3>
                  <p className={`text-xs truncate ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    {page.slug}
                  </p>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize ${
                    darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {page.category}
                  </span>
                  <span className={`text-xs font-medium capitalize ${
                    page.status === 'published'
                      ? darkMode ? 'text-green-400' : 'text-green-700'
                      : darkMode ? 'text-yellow-400' : 'text-yellow-700'
                  }`}>
                    {page.status}
                  </span>
                </div>

                <div className={`text-xs mb-3 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  Modified: {new Date(page.lastModified).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>

                <div className={`flex items-center justify-between pt-3 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <button
                    onClick={() => handlePreview(page)}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                      darkMode ? 'hover:bg-gray-700 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'
                    }`}
                    title="Quick Preview"
                  >
                    <i className="ri-eye-line" />
                  </button>
                  <Link
                    to={`/admin/dashboard/pages/edit/${page.id}`}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                      darkMode ? 'hover:bg-gray-700 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'
                    }`}
                    title="Edit"
                  >
                    <i className="ri-edit-line" />
                  </Link>
                  <Link
                    to={page.slug}
                    target="_blank"
                    className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                      darkMode ? 'hover:bg-red-600/20 text-gray-400 hover:text-red-400' : 'hover:bg-red-50 text-gray-500 hover:text-red-600'
                    }`}
                    title="Open in New Tab"
                  >
                    <i className="ri-external-link-line" />
                  </Link>
                  <button
                    onClick={() => handleDeleteClick(page)}
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

          {/* Pagination for Grid View */}
          {viewMode === 'grid' && totalPages > 1 && (
            <div className={`rounded-lg border p-4 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center justify-between">
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Showing {sortedPages.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, sortedPages.length)} of {sortedPages.length} pages
                </p>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === 1
                        ? darkMode ? 'bg-gray-700/50 text-gray-600 cursor-not-allowed' : 'bg-gray-50 text-gray-300 cursor-not-allowed'
                        : darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 cursor-pointer' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 cursor-pointer'
                    }`}
                  >
                    <i className="ri-arrow-left-s-line" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                        pageNum === currentPage
                          ? 'bg-red-600 text-white'
                          : darkMode
                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === totalPages
                        ? darkMode ? 'bg-gray-700/50 text-gray-600 cursor-not-allowed' : 'bg-gray-50 text-gray-300 cursor-not-allowed'
                        : darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 cursor-pointer' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 cursor-pointer'
                    }`}
                  >
                    <i className="ri-arrow-right-s-line" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && pageToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowDeleteModal(false)} />
          <div className={`relative w-full max-w-md rounded-xl p-6 shadow-xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="text-center">
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${darkMode ? 'bg-red-600/20' : 'bg-red-50'}`}>
                <i className={`ri-delete-bin-line text-3xl ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
              </div>
              <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'Merriweather, serif' }}>
                Delete Page?
              </h3>
              <p className={`text-sm mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Are you sure you want to delete "<strong>{pageToDelete.title}</strong>"? This action cannot be undone.
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
                  className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-colors cursor-pointer"
                >
                  Delete Page
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Preview Panel */}
      {previewPage && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closePreview} />
          <div 
            className={`relative ml-auto w-full max-w-4xl h-full flex flex-col shadow-2xl animate-slide-in-right ${
              darkMode ? 'bg-gray-900' : 'bg-white'
            }`}
            style={{ animation: 'slideInRight 0.3s ease-out' }}
          >
            {/* Preview Header */}
            <div className={`flex items-center justify-between px-6 py-4 border-b shrink-0 ${
              darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
            }`}>
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-9 h-9 flex items-center justify-center rounded-lg shrink-0 ${
                  darkMode ? 'bg-red-600/20' : 'bg-red-50'
                }`}>
                  <i className={`ri-eye-line text-lg ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
                </div>
                <div className="min-w-0">
                  <h3 className={`text-sm font-semibold truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {previewPage.title}
                  </h3>
                  <p className={`text-xs truncate ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    {previewPage.slug}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {/* Device Switcher */}
                <div className={`flex items-center rounded-lg p-1 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  <button
                    onClick={() => setPreviewDevice('desktop')}
                    className={`w-8 h-8 flex items-center justify-center rounded-md text-sm transition-all cursor-pointer ${
                      previewDevice === 'desktop'
                        ? 'bg-red-600 text-white shadow-sm'
                        : darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
                    }`}
                    title="Desktop"
                  >
                    <i className="ri-computer-line" />
                  </button>
                  <button
                    onClick={() => setPreviewDevice('tablet')}
                    className={`w-8 h-8 flex items-center justify-center rounded-md text-sm transition-all cursor-pointer ${
                      previewDevice === 'tablet'
                        ? 'bg-red-600 text-white shadow-sm'
                        : darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
                    }`}
                    title="Tablet"
                  >
                    <i className="ri-tablet-line" />
                  </button>
                  <button
                    onClick={() => setPreviewDevice('mobile')}
                    className={`w-8 h-8 flex items-center justify-center rounded-md text-sm transition-all cursor-pointer ${
                      previewDevice === 'mobile'
                        ? 'bg-red-600 text-white shadow-sm'
                        : darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
                    }`}
                    title="Mobile"
                  >
                    <i className="ri-smartphone-line" />
                  </button>
                </div>

                {/* Status Badge */}
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium ${
                  previewPage.status === 'published'
                    ? darkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-50 text-green-700'
                    : darkMode ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-50 text-yellow-700'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    previewPage.status === 'published' ? 'bg-green-500' : 'bg-yellow-500'
                  }`} />
                  {previewPage.status}
                </span>

                {/* Actions */}
                <Link
                  to={`/admin/dashboard/pages/edit/${previewPage.id}`}
                  className="flex items-center gap-1.5 px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap"
                >
                  <i className="ri-edit-line text-sm" />
                  Edit
                </Link>
                <Link
                  to={previewPage.slug}
                  target="_blank"
                  className={`w-9 h-9 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                    darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
                  }`}
                  title="Open in New Tab"
                >
                  <i className="ri-external-link-line text-sm" />
                </Link>
                <button
                  onClick={closePreview}
                  className={`w-9 h-9 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                    darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
                  }`}
                  title="Close Preview"
                >
                  <i className="ri-close-line text-lg" />
                </button>
              </div>
            </div>

            {/* Preview Info Bar */}
            <div className={`flex items-center gap-4 px-6 py-2.5 border-b text-xs shrink-0 ${
              darkMode ? 'border-gray-700/50 bg-gray-800/50 text-gray-500' : 'border-gray-100 bg-gray-50/50 text-gray-400'
            }`}>
              <span className="flex items-center gap-1.5">
                <i className="ri-folder-line" />
                {previewPage.category}
              </span>
              <span className="flex items-center gap-1.5">
                <i className="ri-calendar-line" />
                Modified {new Date(previewPage.lastModified).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
              <span className="flex items-center gap-1.5">
                <i className="ri-user-line" />
                {previewPage.author}
              </span>
            </div>

            {/* Preview Content */}
            <div className={`flex-1 overflow-hidden flex justify-center ${
              darkMode ? 'bg-gray-950' : 'bg-gray-100'
            } ${previewDevice !== 'desktop' ? 'p-6' : ''}`}>
              <div className={`w-full h-full ${getPreviewWidth()} ${
                previewDevice !== 'desktop' ? 'rounded-xl overflow-hidden shadow-xl border' : ''
              } ${previewDevice !== 'desktop' ? (darkMode ? 'border-gray-700' : 'border-gray-300') : ''} transition-all duration-300 relative`}>
                {previewLoading && (
                  <div className={`absolute inset-0 flex flex-col items-center justify-center z-10 ${
                    darkMode ? 'bg-gray-950' : 'bg-gray-100'
                  }`}>
                    <div className="w-10 h-10 border-3 border-red-600 border-t-transparent rounded-full animate-spin mb-3" />
                    <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Loading preview...</p>
                  </div>
                )}
                <iframe
                  src={`${window.location.origin}${__BASE_PATH__}${previewPage.slug === '/' ? '' : previewPage.slug}`}
                  className="w-full h-full bg-white"
                  title={`Preview: ${previewPage.title}`}
                  onLoad={() => setPreviewLoading(false)}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[60] animate-toast-in">
          <div className={`flex items-center gap-3 px-5 py-3.5 rounded-lg shadow-xl border ${
            toastMessage.type === 'success'
              ? darkMode ? 'bg-gray-800 border-green-500/30 text-green-400' : 'bg-white border-green-200 text-green-700'
              : darkMode ? 'bg-gray-800 border-yellow-500/30 text-yellow-400' : 'bg-white border-yellow-200 text-yellow-700'
          }`}>
            <div className={`w-8 h-8 flex items-center justify-center rounded-full shrink-0 ${
              toastMessage.type === 'success'
                ? darkMode ? 'bg-green-500/20' : 'bg-green-50'
                : darkMode ? 'bg-yellow-500/20' : 'bg-yellow-50'
            }`}>
              <i className={`${toastMessage.type === 'success' ? 'ri-checkbox-circle-fill' : 'ri-information-fill'} text-lg`} />
            </div>
            <p className="text-sm font-medium">{toastMessage.text}</p>
            <button
              onClick={() => setToastMessage(null)}
              className={`w-6 h-6 flex items-center justify-center rounded-full ml-2 transition-colors cursor-pointer ${
                darkMode ? 'hover:bg-gray-700 text-gray-500' : 'hover:bg-gray-100 text-gray-400'
              }`}
            >
              <i className="ri-close-line text-sm" />
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes toastIn {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-toast-in {
          animation: toastIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default PagesManagement;
