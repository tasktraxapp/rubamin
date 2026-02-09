
import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

interface PageSection {
  id: string;
  type: 'hero' | 'text' | 'image' | 'gallery' | 'cta' | 'features' | 'team' | 'contact';
  content: Record<string, unknown>;
}

const PageEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isNewPage = !id || id === 'new';
  
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('adminDarkMode');
    return saved ? JSON.parse(saved) : false;
  });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'seo' | 'settings'>('content');
  const [showAddSectionModal, setShowAddSectionModal] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  // Page data state
  const [pageTitle, setPageTitle] = useState('');
  const [pageSlug, setPageSlug] = useState('');
  const [pageCategory, setPageCategory] = useState('company');
  const [pageStatus, setPageStatus] = useState<'published' | 'draft'>('draft');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [metaKeywords, setMetaKeywords] = useState('');
  const [sections, setSections] = useState<PageSection[]>([]);
  const [editorContent, setEditorContent] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('paragraph');

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn');
    if (!isLoggedIn) {
      navigate('/admin');
    }
  }, [navigate]);

  useEffect(() => {
    // Load page data if editing existing page
    if (!isNewPage) {
      // Mock data for demo
      const mockPages: Record<string, { title: string; slug: string; category: string; status: 'published' | 'draft'; content: string; metaTitle: string; metaDescription: string; metaKeywords: string }> = {
        '1': {
          title: 'Corporate Overview',
          slug: '/company/corporate-overview',
          category: 'company',
          status: 'published',
          content: '<h2>About RUBAMIN SARL</h2><p>RUBAMIN SARL is a leading mining and industrial company based in the Democratic Republic of Congo. We specialize in copper production and industrial gas manufacturing, contributing to the economic development of the region.</p><h3>Our History</h3><p>Founded with a vision to become a premier mining company in Central Africa, RUBAMIN has grown to become one of the most respected names in the industry. Our commitment to excellence, safety, and sustainability has been the cornerstone of our success.</p><h3>Our Operations</h3><p>We operate state-of-the-art facilities that produce high-quality copper blister and various industrial gases. Our operations are designed to meet international standards while minimizing environmental impact.</p>',
          metaTitle: 'Corporate Overview | RUBAMIN SARL',
          metaDescription: 'Learn about RUBAMIN SARL, a leading mining and industrial company in DRC specializing in copper production and industrial gas manufacturing.',
          metaKeywords: 'RUBAMIN, mining, copper, DRC, industrial gas'
        },
        '2': {
          title: 'Vision & Mission',
          slug: '/company/vision-mission',
          category: 'company',
          status: 'published',
          content: '<h2>Our Vision</h2><p>To be the leading sustainable mining and industrial company in Central Africa, setting benchmarks for operational excellence, environmental stewardship, and community development.</p><h2>Our Mission</h2><p>To responsibly extract and process mineral resources while creating value for our stakeholders, protecting the environment, and contributing to the socio-economic development of our host communities.</p>',
          metaTitle: 'Vision & Mission | RUBAMIN SARL',
          metaDescription: 'Discover RUBAMIN SARL vision and mission for sustainable mining and industrial operations in the Democratic Republic of Congo.',
          metaKeywords: 'vision, mission, RUBAMIN, sustainable mining'
        }
      };

      const pageData = mockPages[id || '1'];
      if (pageData) {
        setPageTitle(pageData.title);
        setPageSlug(pageData.slug);
        setPageCategory(pageData.category);
        setPageStatus(pageData.status);
        setEditorContent(pageData.content);
        setMetaTitle(pageData.metaTitle);
        setMetaDescription(pageData.metaDescription);
        setMetaKeywords(pageData.metaKeywords);
      }
    }
  }, [id, isNewPage]);

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

  const handleSave = (publish = false) => {
    setIsSaving(true);
    if (publish) {
      setPageStatus('published');
    }
    
    setTimeout(() => {
      setIsSaving(false);
      setShowSavedToast(true);
      setTimeout(() => setShowSavedToast(false), 3000);
    }, 1500);
  };

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const handleFormatChange = (format: string) => {
    setSelectedFormat(format);
    switch (format) {
      case 'heading1':
        execCommand('formatBlock', 'h1');
        break;
      case 'heading2':
        execCommand('formatBlock', 'h2');
        break;
      case 'heading3':
        execCommand('formatBlock', 'h3');
        break;
      case 'paragraph':
        execCommand('formatBlock', 'p');
        break;
      case 'quote':
        execCommand('formatBlock', 'blockquote');
        break;
    }
  };

  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      execCommand('createLink', url);
    }
  };

  const insertImage = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      execCommand('insertImage', url);
    }
  };

  const sidebarItems = [
    { label: 'Dashboard', icon: 'ri-dashboard-3-line', path: '/admin/dashboard' },
    { label: 'Pages', icon: 'ri-file-list-3-line', path: '/admin/dashboard/pages', active: true },
    { label: 'Media Library', icon: 'ri-image-line', path: '/admin/dashboard/media-library' },
    { label: 'Media Center', icon: 'ri-newspaper-line', path: '/admin/dashboard/media-center' },
    { label: 'Jobs', icon: 'ri-briefcase-line', path: '/admin/dashboard/jobs' },
    { label: 'Gallery', icon: 'ri-gallery-line', path: '/admin/dashboard/gallery' },
    { label: 'Resources', icon: 'ri-folder-line', path: '/admin/dashboard/resources' },
    { label: 'Inquiries', icon: 'ri-mail-line', path: '/admin/dashboard/inquiries' },
  ];

  const sectionTypes = [
    { type: 'hero', label: 'Hero Section', icon: 'ri-layout-top-line', description: 'Large banner with title and CTA' },
    { type: 'text', label: 'Text Block', icon: 'ri-text', description: 'Rich text content section' },
    { type: 'image', label: 'Image Section', icon: 'ri-image-line', description: 'Full-width or contained image' },
    { type: 'gallery', label: 'Image Gallery', icon: 'ri-gallery-line', description: 'Grid of multiple images' },
    { type: 'features', label: 'Features Grid', icon: 'ri-layout-grid-line', description: 'Feature cards with icons' },
    { type: 'cta', label: 'Call to Action', icon: 'ri-megaphone-line', description: 'Promotional banner section' },
    { type: 'team', label: 'Team Members', icon: 'ri-team-line', description: 'Team member profiles' },
    { type: 'contact', label: 'Contact Form', icon: 'ri-mail-send-line', description: 'Contact information form' },
  ];

  const categories = [
    { id: 'company', label: 'Company' },
    { id: 'products', label: 'Products' },
    { id: 'sustainability', label: 'Sustainability' },
    { id: 'csr', label: 'CSR' },
    { id: 'media', label: 'Media' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'resources', label: 'Resources' },
    { id: 'other', label: 'Other' },
  ];

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
          {sidebarItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                item.active
                  ? 'bg-red-600 text-white shadow-md'
                  : darkMode
                    ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              } ${sidebarCollapsed ? 'justify-center' : ''}`}
            >
              <i className={`${item.icon} text-lg`} />
              {!sidebarCollapsed && item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 ${sidebarCollapsed ? 'ml-20' : 'ml-64'} transition-all duration-300`}>
        {/* Top Header */}
        <header className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b px-6 py-3 sticky top-0 z-10`}>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link
                to="/admin/dashboard/pages"
                className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                  darkMode 
                    ? 'hover:bg-gray-700 text-gray-400' 
                    : 'hover:bg-gray-100 text-gray-500'
                }`}
              >
                <i className="ri-arrow-left-line text-xl" />
              </Link>
              <div>
                <h1 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {isNewPage ? 'Create New Page' : `Edit: ${pageTitle}`}
                </h1>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {pageSlug || 'Set page URL slug'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Status Badge */}
              <span className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                pageStatus === 'published'
                  ? darkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-50 text-green-700'
                  : darkMode ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-50 text-yellow-700'
              }`}>
                {pageStatus === 'published' ? 'Published' : 'Draft'}
              </span>

              {/* Preview Button */}
              <button className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                darkMode 
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}>
                <i className="ri-eye-line mr-2" />
                Preview
              </button>

              {/* Save Draft */}
              <button
                onClick={() => handleSave(false)}
                disabled={isSaving}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  darkMode 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {isSaving ? (
                  <span className="flex items-center gap-2">
                    <i className="ri-loader-4-line animate-spin" />
                    Saving...
                  </span>
                ) : (
                  <>
                    <i className="ri-save-line mr-2" />
                    Save Draft
                  </>
                )}
              </button>

              {/* Publish Button */}
              <button
                onClick={() => handleSave(true)}
                disabled={isSaving}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-colors cursor-pointer whitespace-nowrap"
              >
                <i className="ri-upload-cloud-line mr-2" />
                {pageStatus === 'published' ? 'Update' : 'Publish'}
              </button>

              {/* Dark Mode Toggle */}
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

              {/* Profile */}
              <div className="relative" ref={profileDropdownRef}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className={`w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center cursor-pointer hover:bg-red-700 transition-all`}
                >
                  <span className="text-sm font-bold text-white">{adminUser.name.charAt(0)}</span>
                </button>

                {profileDropdownOpen && (
                  <div className={`absolute right-0 top-full mt-2 w-56 rounded-lg shadow-lg border overflow-hidden z-50 ${
                    darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                  }`}>
                    <div className={`px-4 py-3 border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                      <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{adminUser.name}</p>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{adminUser.email}</p>
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

        {/* Editor Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Editor Area */}
            <div className="lg:col-span-3 space-y-6">
              {/* Page Title Input */}
              <div className={`rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <input
                  type="text"
                  value={pageTitle}
                  onChange={(e) => setPageTitle(e.target.value)}
                  placeholder="Enter page title..."
                  className={`w-full px-6 py-4 text-2xl font-bold bg-transparent border-none focus:outline-none ${
                    darkMode ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'
                  }`}
                  style={{ fontFamily: 'Merriweather, serif' }}
                />
              </div>

              {/* Tabs */}
              <div className={`rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <div className={`flex border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  {[
                    { id: 'content', label: 'Content', icon: 'ri-edit-line' },
                    { id: 'seo', label: 'SEO Settings', icon: 'ri-search-line' },
                    { id: 'settings', label: 'Page Settings', icon: 'ri-settings-3-line' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as 'content' | 'seo' | 'settings')}
                      className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors cursor-pointer border-b-2 -mb-px ${
                        activeTab === tab.id
                          ? 'border-red-600 text-red-600'
                          : darkMode
                            ? 'border-transparent text-gray-400 hover:text-white'
                            : 'border-transparent text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      <i className={tab.icon} />
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Content Tab */}
                {activeTab === 'content' && (
                  <div className="p-6">
                    {/* Editor Toolbar */}
                    <div className={`flex flex-wrap items-center gap-1 p-2 rounded-lg mb-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      {/* Format Dropdown */}
                      <select
                        value={selectedFormat}
                        onChange={(e) => handleFormatChange(e.target.value)}
                        className={`px-3 py-2 rounded-md text-sm border-none cursor-pointer ${
                          darkMode 
                            ? 'bg-gray-600 text-white' 
                            : 'bg-white text-gray-900'
                        } focus:outline-none focus:ring-2 focus:ring-red-600`}
                      >
                        <option value="paragraph">Paragraph</option>
                        <option value="heading1">Heading 1</option>
                        <option value="heading2">Heading 2</option>
                        <option value="heading3">Heading 3</option>
                        <option value="quote">Quote</option>
                      </select>

                      <div className={`w-px h-6 mx-2 ${darkMode ? 'bg-gray-600' : 'bg-gray-300'}`} />

                      {/* Text Formatting */}
                      <button
                        onClick={() => execCommand('bold')}
                        className={`w-9 h-9 flex items-center justify-center rounded-md transition-colors cursor-pointer ${
                          darkMode ? 'hover:bg-gray-600 text-gray-300' : 'hover:bg-white text-gray-700'
                        }`}
                        title="Bold"
                      >
                        <i className="ri-bold text-lg" />
                      </button>
                      <button
                        onClick={() => execCommand('italic')}
                        className={`w-9 h-9 flex items-center justify-center rounded-md transition-colors cursor-pointer ${
                          darkMode ? 'hover:bg-gray-600 text-gray-300' : 'hover:bg-white text-gray-700'
                        }`}
                        title="Italic"
                      >
                        <i className="ri-italic text-lg" />
                      </button>
                      <button
                        onClick={() => execCommand('underline')}
                        className={`w-9 h-9 flex items-center justify-center rounded-md transition-colors cursor-pointer ${
                          darkMode ? 'hover:bg-gray-600 text-gray-300' : 'hover:bg-white text-gray-700'
                        }`}
                        title="Underline"
                      >
                        <i className="ri-underline text-lg" />
                      </button>
                      <button
                        onClick={() => execCommand('strikeThrough')}
                        className={`w-9 h-9 flex items-center justify-center rounded-md transition-colors cursor-pointer ${
                          darkMode ? 'hover:bg-gray-600 text-gray-300' : 'hover:bg-white text-gray-700'
                        }`}
                        title="Strikethrough"
                      >
                        <i className="ri-strikethrough text-lg" />
                      </button>

                      <div className={`w-px h-6 mx-2 ${darkMode ? 'bg-gray-600' : 'bg-gray-300'}`} />

                      {/* Alignment */}
                      <button
                        onClick={() => execCommand('justifyLeft')}
                        className={`w-9 h-9 flex items-center justify-center rounded-md transition-colors cursor-pointer ${
                          darkMode ? 'hover:bg-gray-600 text-gray-300' : 'hover:bg-white text-gray-700'
                        }`}
                        title="Align Left"
                      >
                        <i className="ri-align-left text-lg" />
                      </button>
                      <button
                        onClick={() => execCommand('justifyCenter')}
                        className={`w-9 h-9 flex items-center justify-center rounded-md transition-colors cursor-pointer ${
                          darkMode ? 'hover:bg-gray-600 text-gray-300' : 'hover:bg-white text-gray-700'
                        }`}
                        title="Align Center"
                      >
                        <i className="ri-align-center text-lg" />
                      </button>
                      <button
                        onClick={() => execCommand('justifyRight')}
                        className={`w-9 h-9 flex items-center justify-center rounded-md transition-colors cursor-pointer ${
                          darkMode ? 'hover:bg-gray-600 text-gray-300' : 'hover:bg-white text-gray-700'
                        }`}
                        title="Align Right"
                      >
                        <i className="ri-align-right text-lg" />
                      </button>

                      <div className={`w-px h-6 mx-2 ${darkMode ? 'bg-gray-600' : 'bg-gray-300'}`} />

                      {/* Lists */}
                      <button
                        onClick={() => execCommand('insertUnorderedList')}
                        className={`w-9 h-9 flex items-center justify-center rounded-md transition-colors cursor-pointer ${
                          darkMode ? 'hover:bg-gray-600 text-gray-300' : 'hover:bg-white text-gray-700'
                        }`}
                        title="Bullet List"
                      >
                        <i className="ri-list-unordered text-lg" />
                      </button>
                      <button
                        onClick={() => execCommand('insertOrderedList')}
                        className={`w-9 h-9 flex items-center justify-center rounded-md transition-colors cursor-pointer ${
                          darkMode ? 'hover:bg-gray-600 text-gray-300' : 'hover:bg-white text-gray-700'
                        }`}
                        title="Numbered List"
                      >
                        <i className="ri-list-ordered text-lg" />
                      </button>

                      <div className={`w-px h-6 mx-2 ${darkMode ? 'bg-gray-600' : 'bg-gray-300'}`} />

                      {/* Insert */}
                      <button
                        onClick={insertLink}
                        className={`w-9 h-9 flex items-center justify-center rounded-md transition-colors cursor-pointer ${
                          darkMode ? 'hover:bg-gray-600 text-gray-300' : 'hover:bg-white text-gray-700'
                        }`}
                        title="Insert Link"
                      >
                        <i className="ri-link text-lg" />
                      </button>
                      <button
                        onClick={insertImage}
                        className={`w-9 h-9 flex items-center justify-center rounded-md transition-colors cursor-pointer ${
                          darkMode ? 'hover:bg-gray-600 text-gray-300' : 'hover:bg-white text-gray-700'
                        }`}
                        title="Insert Image"
                      >
                        <i className="ri-image-add-line text-lg" />
                      </button>
                      <button
                        onClick={() => execCommand('insertHorizontalRule')}
                        className={`w-9 h-9 flex items-center justify-center rounded-md transition-colors cursor-pointer ${
                          darkMode ? 'hover:bg-gray-600 text-gray-300' : 'hover:bg-white text-gray-700'
                        }`}
                        title="Horizontal Line"
                      >
                        <i className="ri-separator text-lg" />
                      </button>

                      <div className={`w-px h-6 mx-2 ${darkMode ? 'bg-gray-600' : 'bg-gray-300'}`} />

                      {/* Undo/Redo */}
                      <button
                        onClick={() => execCommand('undo')}
                        className={`w-9 h-9 flex items-center justify-center rounded-md transition-colors cursor-pointer ${
                          darkMode ? 'hover:bg-gray-600 text-gray-300' : 'hover:bg-white text-gray-700'
                        }`}
                        title="Undo"
                      >
                        <i className="ri-arrow-go-back-line text-lg" />
                      </button>
                      <button
                        onClick={() => execCommand('redo')}
                        className={`w-9 h-9 flex items-center justify-center rounded-md transition-colors cursor-pointer ${
                          darkMode ? 'hover:bg-gray-600 text-gray-300' : 'hover:bg-white text-gray-700'
                        }`}
                        title="Redo"
                      >
                        <i className="ri-arrow-go-forward-line text-lg" />
                      </button>
                    </div>

                    {/* Content Editor */}
                    <div
                      ref={editorRef}
                      contentEditable
                      dangerouslySetInnerHTML={{ __html: editorContent }}
                      onInput={(e) => setEditorContent(e.currentTarget.innerHTML)}
                      className={`min-h-[500px] p-6 rounded-lg border focus:outline-none focus:ring-2 focus:ring-red-600 prose max-w-none ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-gray-100 prose-invert' 
                          : 'bg-white border-gray-200 text-gray-900'
                      }`}
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    />

                    {/* Add Section Button */}
                    <button
                      onClick={() => setShowAddSectionModal(true)}
                      className={`w-full mt-4 py-4 rounded-lg border-2 border-dashed transition-colors cursor-pointer flex items-center justify-center gap-2 ${
                        darkMode 
                          ? 'border-gray-600 text-gray-400 hover:border-red-600 hover:text-red-400' 
                          : 'border-gray-300 text-gray-500 hover:border-red-600 hover:text-red-600'
                      }`}
                    >
                      <i className="ri-add-circle-line text-xl" />
                      Add Content Section
                    </button>
                  </div>
                )}

                {/* SEO Tab */}
                {activeTab === 'seo' && (
                  <div className="p-6 space-y-6">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Meta Title
                      </label>
                      <input
                        type="text"
                        value={metaTitle}
                        onChange={(e) => setMetaTitle(e.target.value)}
                        placeholder="Enter meta title..."
                        className={`w-full px-4 py-3 rounded-lg border text-sm ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' 
                            : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                        } focus:outline-none focus:ring-2 focus:ring-red-600`}
                      />
                      <p className={`mt-1 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        {metaTitle.length}/60 characters
                      </p>
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Meta Description
                      </label>
                      <textarea
                        value={metaDescription}
                        onChange={(e) => setMetaDescription(e.target.value)}
                        placeholder="Enter meta description..."
                        rows={3}
                        maxLength={500}
                        className={`w-full px-4 py-3 rounded-lg border text-sm resize-none ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' 
                            : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                        } focus:outline-none focus:ring-2 focus:ring-red-600`}
                      />
                      <p className={`mt-1 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        {metaDescription.length}/160 characters recommended
                      </p>
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Meta Keywords
                      </label>
                      <input
                        type="text"
                        value={metaKeywords}
                        onChange={(e) => setMetaKeywords(e.target.value)}
                        placeholder="keyword1, keyword2, keyword3..."
                        className={`w-full px-4 py-3 rounded-lg border text-sm ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' 
                            : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                        } focus:outline-none focus:ring-2 focus:ring-red-600`}
                      />
                      <p className={`mt-1 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        Separate keywords with commas
                      </p>
                    </div>

                    {/* SEO Preview */}
                    <div className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                      <p className={`text-xs font-medium mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Search Engine Preview
                      </p>
                      <div className="space-y-1">
                        <p className="text-lg text-[#1a0dab] hover:underline cursor-pointer">
                          {metaTitle || pageTitle || 'Page Title'}
                        </p>
                        <p className="text-sm text-green-700">
                          https://rubamindrc.com{pageSlug || '/page-url'}
                        </p>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {metaDescription || 'Add a meta description to improve your search engine visibility...'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Settings Tab */}
                {activeTab === 'settings' && (
                  <div className="p-6 space-y-6">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Page URL Slug
                      </label>
                      <div className="flex items-center">
                        <span className={`px-4 py-3 rounded-l-lg border border-r-0 text-sm ${
                          darkMode 
                            ? 'bg-gray-600 border-gray-600 text-gray-400' 
                            : 'bg-gray-100 border-gray-200 text-gray-500'
                        }`}>
                          rubamindrc.com
                        </span>
                        <input
                          type="text"
                          value={pageSlug}
                          onChange={(e) => setPageSlug(e.target.value)}
                          placeholder="/page-url"
                          className={`flex-1 px-4 py-3 rounded-r-lg border text-sm ${
                            darkMode 
                              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' 
                              : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                          } focus:outline-none focus:ring-2 focus:ring-red-600`}
                        />
                      </div>
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Category
                      </label>
                      <select
                        value={pageCategory}
                        onChange={(e) => setPageCategory(e.target.value)}
                        className={`w-full px-4 py-3 rounded-lg border text-sm cursor-pointer ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-gray-50 border-gray-200 text-gray-900'
                        } focus:outline-none focus:ring-2 focus:ring-red-600`}
                      >
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Page Status
                      </label>
                      <div className="flex items-center gap-4">
                        <label className={`flex items-center gap-2 cursor-pointer ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          <input
                            type="radio"
                            name="status"
                            checked={pageStatus === 'draft'}
                            onChange={() => setPageStatus('draft')}
                            className="w-4 h-4 text-red-600 focus:ring-red-600"
                          />
                          <span className="text-sm">Draft</span>
                        </label>
                        <label className={`flex items-center gap-2 cursor-pointer ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          <input
                            type="radio"
                            name="status"
                            checked={pageStatus === 'published'}
                            onChange={() => setPageStatus('published')}
                            className="w-4 h-4 text-red-600 focus:ring-red-600"
                          />
                          <span className="text-sm">Published</span>
                        </label>
                      </div>
                    </div>

                    {/* Danger Zone */}
                    <div className={`p-4 rounded-lg border ${darkMode ? 'border-red-600/30 bg-red-600/10' : 'border-red-200 bg-red-50'}`}>
                      <h3 className={`text-sm font-semibold mb-2 ${darkMode ? 'text-red-400' : 'text-red-700'}`}>
                        Danger Zone
                      </h3>
                      <p className={`text-xs mb-3 ${darkMode ? 'text-red-400/70' : 'text-red-600/70'}`}>
                        Once you delete a page, there is no going back. Please be certain.
                      </p>
                      <button className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                        darkMode 
                          ? 'bg-red-600/20 text-red-400 hover:bg-red-600/30' 
                          : 'bg-red-100 text-red-600 hover:bg-red-200'
                      }`}>
                        <i className="ri-delete-bin-line mr-2" />
                        Delete Page
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar Panel */}
            <div className="space-y-6">
              {/* Page Info */}
              <div className={`rounded-lg border p-5 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <h3 className={`text-sm font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Page Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Status</span>
                    <span className={`text-xs font-medium px-2 py-1 rounded ${
                      pageStatus === 'published'
                        ? darkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-50 text-green-700'
                        : darkMode ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-50 text-yellow-700'
                    }`}>
                      {pageStatus}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Category</span>
                    <span className={`text-xs font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {categories.find(c => c.id === pageCategory)?.label}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Author</span>
                    <span className={`text-xs font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {adminUser.name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Last Modified</span>
                    <span className={`text-xs font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {new Date().toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Featured Image */}
              <div className={`rounded-lg border p-5 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <h3 className={`text-sm font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Featured Image
                </h3>
                <div className={`aspect-video rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors ${
                  darkMode 
                    ? 'border-gray-600 hover:border-red-600' 
                    : 'border-gray-300 hover:border-red-600'
                }`}>
                  <i className={`ri-image-add-line text-3xl mb-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                  <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    Click to upload
                  </p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className={`rounded-lg border p-5 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <h3 className={`text-sm font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  <button className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors cursor-pointer ${
                    darkMode 
                      ? 'hover:bg-gray-700 text-gray-300' 
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}>
                    <i className="ri-file-copy-line" />
                    Duplicate Page
                  </button>
                  <button className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors cursor-pointer ${
                    darkMode 
                      ? 'hover:bg-gray-700 text-gray-300' 
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}>
                    <i className="ri-history-line" />
                    View Revisions
                  </button>
                  <button className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors cursor-pointer ${
                    darkMode 
                      ? 'hover:bg-gray-700 text-gray-300' 
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}>
                    <i className="ri-code-line" />
                    View HTML
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Add Section Modal */}
      {showAddSectionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowAddSectionModal(false)} />
          <div className={`relative w-full max-w-2xl rounded-xl shadow-xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className={`flex items-center justify-between px-6 py-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'Merriweather, serif' }}>
                Add Content Section
              </h3>
              <button
                onClick={() => setShowAddSectionModal(false)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                  darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                }`}
              >
                <i className="ri-close-line text-xl" />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                {sectionTypes.map((section) => (
                  <button
                    key={section.type}
                    onClick={() => {
                      setSections([...sections, { id: Date.now().toString(), type: section.type as PageSection['type'], content: {} }]);
                      setShowAddSectionModal(false);
                    }}
                    className={`flex items-start gap-4 p-4 rounded-lg border transition-all cursor-pointer text-left ${
                      darkMode 
                        ? 'border-gray-700 hover:border-red-600 hover:bg-gray-700/50' 
                        : 'border-gray-200 hover:border-red-600 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      darkMode ? 'bg-gray-700' : 'bg-gray-100'
                    }`}>
                      <i className={`${section.icon} text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {section.label}
                      </p>
                      <p className={`text-xs mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {section.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Saved Toast */}
      {showSavedToast && (
        <div className="fixed bottom-6 right-6 z-50">
          <div className={`flex items-center gap-3 px-5 py-3 rounded-lg shadow-lg ${
            darkMode ? 'bg-green-600' : 'bg-green-500'
          } text-white`}>
            <i className="ri-check-line text-xl" />
            <span className="text-sm font-medium">Page saved successfully!</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PageEditor;
