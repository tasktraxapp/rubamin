import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

interface GalleryImage {
  id: string;
  url: string;
  caption: string;
}

interface GalleryItem {
  id: string;
  title: string;
  date: string;
  location: string;
  category: string;
  section: string;
  images: GalleryImage[];
  status: 'Published' | 'Draft';
  createdAt: string;
}

const GalleryManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('adminDarkMode');
    return saved ? JSON.parse(saved) : false;
  });

  const [activeSection, setActiveSection] = useState('Facilities');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [previewImages, setPreviewImages] = useState<GalleryImage[]>([]);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({ show: false, message: '', type: 'success' });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortColumn, setSortColumn] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  const sections = [
    { id: 'Facilities', label: 'Facilities', icon: 'ri-building-4-line', categories: ['All', 'Production', 'Laboratory', 'Operations', 'Storage', 'Environmental', 'Administrative'] },
    { id: 'Trainings', label: 'Trainings', icon: 'ri-presentation-line', categories: ['All', 'Safety', 'Technical', 'Quality', 'Environmental', 'Leadership'] },
    { id: 'Visits', label: 'Visits', icon: 'ri-user-star-line', categories: ['All', 'Government', 'Business', 'Educational', 'Audit', 'Community', 'Media'] },
    { id: 'Events', label: 'Events', icon: 'ri-calendar-event-line', categories: ['All', 'Corporate', 'Community', 'Training', 'Environmental'] },
    { id: 'Social Initiatives', label: 'Social Initiatives', icon: 'ri-heart-line', categories: ['All', 'Education', 'Healthcare', 'Women Empowerment', 'Water & Sanitation', 'Environment', 'Sports & Youth'] },
    { id: 'CSR', label: 'CSR', icon: 'ri-hand-heart-line', categories: ['All', 'Community Development', 'Education Support', 'Health Programs', 'Environmental Conservation', 'Livelihood', 'Infrastructure'] },
    { id: 'DOT', label: 'DOT Projects', icon: 'ri-funds-line', categories: ['All', 'Infrastructure', 'Education', 'Healthcare', 'Utilities', 'Agriculture'] },
  ];

  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([
    // Facilities
    { id: 'fac-001', title: 'Main Production Facility', date: '15-03-2024', location: 'Lubumbashi Industrial Zone', category: 'Production', section: 'Facilities', images: [{ id: 'img-001', url: 'https://readdy.ai/api/search-image?query=large%20scale%20industrial%20copper%20smelting%20facility%20interior%20with%20advanced%20machinery%20and%20equipment%20modern%20manufacturing%20plant%20with%20metallic%20structures%20and%20production%20lines%20professional%20industrial%20photography&width=800&height=600&seq=facility-001&orientation=landscape', caption: 'Main production hall overview' }, { id: 'img-002', url: 'https://readdy.ai/api/search-image?query=industrial%20copper%20smelting%20furnace%20with%20molten%20metal%20and%20workers%20in%20safety%20gear%20modern%20metallurgy%20facility%20professional%20heavy%20industry%20photography&width=800&height=600&seq=facility-001b&orientation=landscape', caption: 'Smelting furnace in operation' }], status: 'Published', createdAt: '2024-03-15' },
    { id: 'fac-002', title: 'Quality Control Laboratory', date: '22-02-2024', location: 'Lubumbashi Main Plant', category: 'Laboratory', section: 'Facilities', images: [{ id: 'img-003', url: 'https://readdy.ai/api/search-image?query=modern%20industrial%20laboratory%20with%20scientists%20in%20white%20coats%20conducting%20quality%20control%20tests%20on%20copper%20samples%20advanced%20testing%20equipment%20and%20clean%20sterile%20environment%20professional%20lab%20photography&width=800&height=600&seq=facility-002&orientation=landscape', caption: 'Quality control testing area' }], status: 'Published', createdAt: '2024-02-22' },
    { id: 'fac-003', title: 'Gas Production Unit', date: '10-01-2024', location: 'Lubumbashi Gas Facility', category: 'Production', section: 'Facilities', images: [{ id: 'img-004', url: 'https://readdy.ai/api/search-image?query=industrial%20gas%20production%20facility%20with%20large%20storage%20tanks%20and%20processing%20equipment%20modern%20gas%20manufacturing%20plant%20with%20pipes%20and%20control%20systems%20professional%20industrial%20photography&width=800&height=600&seq=facility-003&orientation=landscape', caption: 'Gas production overview' }], status: 'Published', createdAt: '2024-01-10' },
    { id: 'fac-004', title: 'Control Room', date: '18-11-2023', location: 'Lubumbashi Operations Center', category: 'Operations', section: 'Facilities', images: [{ id: 'img-005', url: 'https://readdy.ai/api/search-image?query=modern%20industrial%20control%20room%20with%20multiple%20monitors%20and%20control%20panels%20operators%20monitoring%20production%20processes%20advanced%20automation%20and%20monitoring%20systems%20professional%20technology%20environment&width=800&height=600&seq=facility-005&orientation=landscape', caption: 'Central control room' }], status: 'Published', createdAt: '2023-11-18' },
    { id: 'fac-005', title: 'Environmental Treatment Plant', date: '25-10-2023', location: 'Lubumbashi Environmental Facility', category: 'Environmental', section: 'Facilities', images: [{ id: 'img-006', url: 'https://readdy.ai/api/search-image?query=environmental%20water%20treatment%20facility%20with%20filtration%20systems%20and%20purification%20equipment%20modern%20wastewater%20treatment%20plant%20with%20clean%20technology%20representing%20environmental%20responsibility&width=800&height=600&seq=facility-006&orientation=landscape', caption: 'Water treatment facility' }], status: 'Draft', createdAt: '2023-10-25' },
    // Trainings
    { id: 'trn-001', title: 'Safety & Emergency Response Training', date: '12-03-2024', location: 'Lubumbashi Training Center', category: 'Safety', section: 'Trainings', images: [{ id: 'img-007', url: 'https://readdy.ai/api/search-image?query=industrial%20safety%20training%20session%20with%20workers%20in%20safety%20gear%20learning%20emergency%20response%20procedures%20instructor%20demonstrating%20safety%20equipment%20professional%20training%20environment&width=800&height=600&seq=training-001&orientation=landscape', caption: 'Emergency response demonstration' }, { id: 'img-008', url: 'https://readdy.ai/api/search-image?query=workers%20practicing%20emergency%20evacuation%20drill%20in%20industrial%20facility%20safety%20training%20exercise%20professional%20safety%20program&width=800&height=600&seq=training-001b&orientation=landscape', caption: 'Evacuation drill practice' }], status: 'Published', createdAt: '2024-03-12' },
    { id: 'trn-002', title: 'Technical Skills Development', date: '28-02-2024', location: 'Lubumbashi Technical Institute', category: 'Technical', section: 'Trainings', images: [{ id: 'img-009', url: 'https://readdy.ai/api/search-image?query=technical%20training%20workshop%20with%20engineers%20learning%20industrial%20equipment%20operation%20hands-on%20training%20with%20machinery%20professional%20development%20session&width=800&height=600&seq=training-002&orientation=landscape', caption: 'Technical skills workshop' }], status: 'Published', createdAt: '2024-02-28' },
    { id: 'trn-003', title: 'Leadership Development Program', date: '18-01-2024', location: 'Lubumbashi Corporate Office', category: 'Leadership', section: 'Trainings', images: [{ id: 'img-010', url: 'https://readdy.ai/api/search-image?query=leadership%20training%20workshop%20with%20managers%20and%20supervisors%20learning%20management%20skills%20professional%20development%20session%20conference%20room%20setting&width=800&height=600&seq=training-005&orientation=landscape', caption: 'Leadership workshop' }], status: 'Published', createdAt: '2024-01-18' },
    { id: 'trn-004', title: 'Quality Management Workshop', date: '15-02-2024', location: 'Lubumbashi Quality Center', category: 'Quality', section: 'Trainings', images: [{ id: 'img-011', url: 'https://readdy.ai/api/search-image?query=quality%20management%20training%20session%20with%20professionals%20in%20conference%20room%20learning%20quality%20control%20procedures%20presentation%20and%20group%20discussion&width=800&height=600&seq=training-003&orientation=landscape', caption: 'Quality management session' }], status: 'Draft', createdAt: '2024-02-15' },
    // Visits
    { id: 'vis-001', title: 'Government Delegation Visit', date: '20-03-2024', location: 'Lubumbashi Main Plant', category: 'Government', section: 'Visits', images: [{ id: 'img-012', url: 'https://readdy.ai/api/search-image?query=government%20officials%20visiting%20industrial%20facility%20with%20company%20executives%20tour%20of%20manufacturing%20plant%20formal%20delegation%20visit%20professional%20setting&width=800&height=600&seq=visit-001&orientation=landscape', caption: 'Welcome ceremony for government delegation' }, { id: 'img-013', url: 'https://readdy.ai/api/search-image?query=government%20officials%20touring%20production%20facility%20with%20company%20management%20industrial%20plant%20visit%20formal%20inspection%20professional%20setting&width=800&height=600&seq=visit-001b&orientation=landscape', caption: 'Production facility tour' }], status: 'Published', createdAt: '2024-03-20' },
    { id: 'vis-002', title: 'International Investors Tour', date: '08-03-2024', location: 'Lubumbashi Industrial Complex', category: 'Business', section: 'Visits', images: [{ id: 'img-014', url: 'https://readdy.ai/api/search-image?query=international%20business%20delegation%20touring%20industrial%20facility%20with%20executives%20investment%20tour%20professional%20meeting%20in%20manufacturing%20plant&width=800&height=600&seq=visit-002&orientation=landscape', caption: 'Investor facility tour' }], status: 'Published', createdAt: '2024-03-08' },
    { id: 'vis-003', title: 'University Students Educational Visit', date: '25-02-2024', location: 'Lubumbashi Production Facility', category: 'Educational', section: 'Visits', images: [{ id: 'img-015', url: 'https://readdy.ai/api/search-image?query=university%20students%20on%20educational%20tour%20of%20industrial%20facility%20with%20guide%20learning%20about%20manufacturing%20processes%20group%20of%20young%20people%20in%20safety%20gear&width=800&height=600&seq=visit-003&orientation=landscape', caption: 'Student facility tour' }], status: 'Published', createdAt: '2024-02-25' },
    { id: 'vis-004', title: 'Community Leaders Tour', date: '15-01-2024', location: 'Lubumbashi Operations Center', category: 'Community', section: 'Visits', images: [{ id: 'img-016', url: 'https://readdy.ai/api/search-image?query=community%20leaders%20visiting%20industrial%20facility%20with%20company%20executives%20community%20engagement%20tour%20local%20leaders%20learning%20about%20operations&width=800&height=600&seq=visit-006&orientation=landscape', caption: 'Community leaders tour' }], status: 'Draft', createdAt: '2024-01-15' },
    // Events
    { id: 'evt-001', title: 'Industry Innovation Summit 2024', date: '15-03-2024', location: 'Lubumbashi Convention Center', category: 'Corporate', section: 'Events', images: [{ id: 'img-017', url: 'https://readdy.ai/api/search-image?query=professional%20business%20conference%20with%20speakers%20on%20stage%20and%20audience%20in%20modern%20convention%20center%20corporate%20event%20with%20presentation%20screens%20and%20professional%20lighting%20representing%20industry%20summit&width=800&height=600&seq=event-001&orientation=landscape', caption: 'Summit main stage' }, { id: 'img-018', url: 'https://readdy.ai/api/search-image?query=business%20executives%20networking%20at%20corporate%20conference%20event%20professional%20gathering%20with%20attendees%20discussing%20industry%20trends&width=800&height=600&seq=event-001b&orientation=landscape', caption: 'Networking session' }], status: 'Published', createdAt: '2024-03-15' },
    { id: 'evt-002', title: 'Community Health Fair', date: '10-02-2024', location: 'Local Community Center', category: 'Community', section: 'Events', images: [{ id: 'img-019', url: 'https://readdy.ai/api/search-image?query=community%20health%20fair%20with%20medical%20professionals%20providing%20free%20health%20screening%20to%20African%20community%20members%20outdoor%20event%20with%20medical%20tents%20and%20happy%20people%20representing%20healthcare%20outreach&width=800&height=600&seq=event-003&orientation=landscape', caption: 'Health screening area' }], status: 'Published', createdAt: '2024-02-10' },
    { id: 'evt-003', title: 'Environmental Awareness Campaign', date: '05-04-2024', location: 'Multiple Locations', category: 'Environmental', section: 'Events', images: [{ id: 'img-020', url: 'https://readdy.ai/api/search-image?query=environmental%20awareness%20campaign%20with%20people%20planting%20trees%20and%20participating%20in%20green%20initiatives%20outdoor%20community%20event%20with%20environmental%20conservation%20activities%20representing%20sustainability%20efforts&width=800&height=600&seq=event-005&orientation=landscape', caption: 'Tree planting activity' }], status: 'Published', createdAt: '2024-04-05' },
    { id: 'evt-004', title: 'Safety Training Workshop', date: '20-01-2024', location: 'Training Center', category: 'Training', section: 'Events', images: [{ id: 'img-021', url: 'https://readdy.ai/api/search-image?query=industrial%20safety%20training%20workshop%20with%20instructor%20teaching%20workers%20in%20safety%20equipment%20classroom%20setting%20with%20safety%20posters%20and%20training%20materials%20representing%20workplace%20safety%20education&width=800&height=600&seq=event-004&orientation=landscape', caption: 'Safety training session' }], status: 'Draft', createdAt: '2024-01-20' },
    // Social Initiatives
    { id: 'soc-001', title: 'School Supplies Distribution', date: '18-04-2024', location: 'Lubumbashi Primary School', category: 'Education', section: 'Social Initiatives', images: [{ id: 'img-022', url: 'https://readdy.ai/api/search-image?query=company%20executives%20handing%20over%20educational%20materials%20to%20African%20school%20children%20ceremony%20community%20support%20program%20bright%20outdoor%20setting%20happy%20faces&width=800&height=600&seq=social-gal-001&orientation=landscape', caption: 'School supplies handover ceremony' }], status: 'Published', createdAt: '2024-04-18' },
    { id: 'soc-002', title: 'Free Medical Camp', date: '25-03-2024', location: 'Kipushi Community Center', category: 'Healthcare', section: 'Social Initiatives', images: [{ id: 'img-023', url: 'https://readdy.ai/api/search-image?query=medical%20team%20providing%20free%20health%20checkup%20to%20African%20community%20members%20mobile%20clinic%20setting%20professional%20healthcare%20workers%20examining%20patients&width=800&height=600&seq=social-gal-002&orientation=landscape', caption: 'Medical checkup in progress' }, { id: 'img-024', url: 'https://readdy.ai/api/search-image?query=doctor%20examining%20child%20at%20free%20medical%20camp%20African%20community%20healthcare%20outreach%20program%20professional%20medical%20care&width=800&height=600&seq=social-gal-002b&orientation=landscape', caption: 'Pediatric examination' }], status: 'Published', createdAt: '2024-03-25' },
    { id: 'soc-003', title: 'Women Vocational Training', date: '12-03-2024', location: 'Lubumbashi Training Center', category: 'Women Empowerment', section: 'Social Initiatives', images: [{ id: 'img-025', url: 'https://readdy.ai/api/search-image?query=African%20women%20in%20vocational%20training%20workshop%20learning%20sewing%20and%20tailoring%20skills%20empowerment%20program%20bright%20indoor%20setting%20with%20equipment&width=800&height=600&seq=social-gal-003&orientation=landscape', caption: 'Sewing training session' }], status: 'Published', createdAt: '2024-03-12' },
    { id: 'soc-004', title: 'Youth Football Tournament', date: '15-02-2024', location: 'Lubumbashi Sports Complex', category: 'Sports & Youth', section: 'Social Initiatives', images: [{ id: 'img-026', url: 'https://readdy.ai/api/search-image?query=African%20youth%20playing%20football%20soccer%20on%20community%20sports%20field%20with%20proper%20equipment%20uniforms%20youth%20sports%20program%20community%20engagement%20healthy%20lifestyle&width=800&height=600&seq=social-gal-005&orientation=landscape', caption: 'Football tournament match' }], status: 'Draft', createdAt: '2024-02-15' },
    // DOT Projects
    { id: 'dot-001', title: 'Primary School Construction', date: '20-04-2024', location: 'Lubumbashi Education Zone', category: 'Education', section: 'DOT', images: [{ id: 'img-027', url: 'https://readdy.ai/api/search-image?query=newly%20constructed%20primary%20school%20building%20in%20African%20village%20with%20children%20playing%20outside%20modern%20architecture%20community%20development%20project%20bright%20sunny%20day&width=800&height=600&seq=dot-gal-001&orientation=landscape', caption: 'New school building exterior' }, { id: 'img-028', url: 'https://readdy.ai/api/search-image?query=interior%20of%20new%20classroom%20in%20African%20school%20with%20desks%20and%20chairs%20modern%20education%20facility%20community%20development&width=800&height=600&seq=dot-gal-001b&orientation=landscape', caption: 'Classroom interior' }], status: 'Published', createdAt: '2024-04-20' },
    { id: 'dot-002', title: 'Health Center Equipment Delivery', date: '08-04-2024', location: 'Kipushi Medical District', category: 'Healthcare', section: 'DOT', images: [{ id: 'img-029', url: 'https://readdy.ai/api/search-image?query=community%20health%20center%20building%20in%20African%20village%20with%20medical%20staff%20receiving%20new%20equipment%20modern%20healthcare%20facility%20community%20development%20project&width=800&height=600&seq=dot-gal-002&orientation=landscape', caption: 'Equipment delivery' }], status: 'Published', createdAt: '2024-04-08' },
    { id: 'dot-003', title: 'Village Road Rehabilitation', date: '25-03-2024', location: 'Kasumbalesa Rural Area', category: 'Infrastructure', section: 'DOT', images: [{ id: 'img-030', url: 'https://readdy.ai/api/search-image?query=paved%20road%20construction%20in%20African%20rural%20area%20connecting%20villages%20infrastructure%20development%20project%20heavy%20machinery%20workers%20completing%20road&width=800&height=600&seq=dot-gal-003&orientation=landscape', caption: 'Road construction in progress' }], status: 'Published', createdAt: '2024-03-25' },
    { id: 'dot-004', title: 'Water Tower Installation', date: '12-03-2024', location: 'Fungurume Community', category: 'Utilities', section: 'DOT', images: [{ id: 'img-031', url: 'https://readdy.ai/api/search-image?query=water%20tower%20and%20distribution%20system%20in%20African%20community%20clean%20water%20project%20modern%20infrastructure%20villagers%20collecting%20water%20celebration&width=800&height=600&seq=dot-gal-004&orientation=landscape', caption: 'Water tower installation' }], status: 'Draft', createdAt: '2024-03-12' },
    // CSR
    { id: 'csr-001', title: 'Community Development Program Launch', date: '22-04-2024', location: 'Lubumbashi Community Center', category: 'Community Development', section: 'CSR', images: [{ id: 'img-032', url: 'https://readdy.ai/api/search-image?query=corporate%20social%20responsibility%20event%20with%20company%20executives%20and%20African%20community%20members%20launching%20development%20program%20outdoor%20ceremony%20with%20banners%20and%20happy%20people%20professional%20setting&width=800&height=600&seq=csr-gal-001&orientation=landscape', caption: 'Program launch ceremony' }, { id: 'img-033', url: 'https://readdy.ai/api/search-image?query=community%20members%20receiving%20certificates%20at%20CSR%20program%20launch%20event%20African%20village%20celebration%20corporate%20social%20responsibility&width=800&height=600&seq=csr-gal-001b&orientation=landscape', caption: 'Certificate distribution' }], status: 'Published', createdAt: '2024-04-22' },
    { id: 'csr-002', title: 'School Library Donation', date: '15-04-2024', location: 'Kipushi Secondary School', category: 'Education Support', section: 'CSR', images: [{ id: 'img-034', url: 'https://readdy.ai/api/search-image?query=company%20representatives%20donating%20books%20and%20educational%20materials%20to%20African%20school%20library%20students%20and%20teachers%20receiving%20donations%20bright%20indoor%20setting&width=800&height=600&seq=csr-gal-002&orientation=landscape', caption: 'Book donation ceremony' }], status: 'Published', createdAt: '2024-04-15' },
    { id: 'csr-003', title: 'Mobile Health Clinic Initiative', date: '08-04-2024', location: 'Rural Communities', category: 'Health Programs', section: 'CSR', images: [{ id: 'img-035', url: 'https://readdy.ai/api/search-image?query=mobile%20health%20clinic%20van%20providing%20medical%20services%20to%20African%20rural%20community%20doctors%20and%20nurses%20examining%20patients%20outdoor%20medical%20camp%20corporate%20social%20responsibility&width=800&height=600&seq=csr-gal-003&orientation=landscape', caption: 'Mobile clinic in action' }], status: 'Published', createdAt: '2024-04-08' },
    { id: 'csr-004', title: 'Tree Planting Campaign', date: '28-03-2024', location: 'Lubumbashi Green Belt', category: 'Environmental Conservation', section: 'CSR', images: [{ id: 'img-036', url: 'https://readdy.ai/api/search-image?query=corporate%20employees%20and%20community%20members%20planting%20trees%20together%20environmental%20conservation%20CSR%20activity%20green%20initiative%20outdoor%20event%20with%20seedlings&width=800&height=600&seq=csr-gal-004&orientation=landscape', caption: 'Tree planting activity' }], status: 'Published', createdAt: '2024-03-28' },
    { id: 'csr-005', title: 'Vocational Skills Training', date: '18-03-2024', location: 'Lubumbashi Skills Center', category: 'Livelihood', section: 'CSR', images: [{ id: 'img-037', url: 'https://readdy.ai/api/search-image?query=vocational%20training%20workshop%20with%20African%20youth%20learning%20technical%20skills%20welding%20carpentry%20electrical%20work%20CSR%20livelihood%20program%20professional%20training%20facility&width=800&height=600&seq=csr-gal-005&orientation=landscape', caption: 'Skills training session' }], status: 'Draft', createdAt: '2024-03-18' },
    { id: 'csr-006', title: 'Community Borehole Project', date: '10-03-2024', location: 'Kasumbalesa Village', category: 'Infrastructure', section: 'CSR', images: [{ id: 'img-038', url: 'https://readdy.ai/api/search-image?query=newly%20installed%20water%20borehole%20in%20African%20village%20with%20community%20members%20collecting%20clean%20water%20CSR%20infrastructure%20project%20celebration%20happy%20villagers&width=800&height=600&seq=csr-gal-006&orientation=landscape', caption: 'Borehole inauguration' }], status: 'Published', createdAt: '2024-03-10' },
  ]);

  const [formData, setFormData] = useState({
    title: '',
    date: '',
    location: '',
    category: '',
    section: activeSection,
    status: 'Draft' as 'Published' | 'Draft',
    images: [] as { url: string; caption: string }[],
  });

  const [isDragging, setIsDragging] = useState(false);
  const [uploadingImages, setUploadingImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    setSelectedCategory('All');
    setSelectedItems([]);
    setCurrentPage(1);
  }, [activeSection, selectedCategory, selectedStatus]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const generateBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs = [{ label: 'Home', path: '/', icon: 'ri-home-4-line' }];
    let currentPath = '';
    pathSegments.forEach((segment) => {
      currentPath += `/${segment}`;
      const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
      breadcrumbs.push({ label, path: currentPath, icon: '' });
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

  const currentSection = sections.find(s => s.id === activeSection);
  const categories = currentSection?.categories || ['All'];

  const filteredItems = galleryItems.filter(item => {
    const matchesSection = activeSection === 'All' || item.section === activeSection;
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || item.status === selectedStatus;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSection && matchesCategory && matchesStatus && matchesSearch;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (!sortColumn) return 0;
    let valA: string | number = '';
    let valB: string | number = '';
    switch (sortColumn) {
      case 'title':
        valA = a.title.toLowerCase();
        valB = b.title.toLowerCase();
        break;
      case 'section':
        valA = a.section.toLowerCase();
        valB = b.section.toLowerCase();
        break;
      case 'category':
        valA = a.category.toLowerCase();
        valB = b.category.toLowerCase();
        break;
      case 'date':
        valA = new Date(a.createdAt).getTime();
        valB = new Date(b.createdAt).getTime();
        break;
      case 'photos':
        valA = a.images.length;
        valB = b.images.length;
        break;
      case 'status':
        valA = a.status.toLowerCase();
        valB = b.status.toLowerCase();
        break;
      default:
        return 0;
    }
    if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
    if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination calculations
  const totalPages = Math.ceil(sortedItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = sortedItems.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedStatus, searchQuery]);

  const stats = {
    total: galleryItems.filter(i => i.section === activeSection).length,
    published: galleryItems.filter(i => i.section === activeSection && i.status === 'Published').length,
    draft: galleryItems.filter(i => i.section === activeSection && i.status === 'Draft').length,
    totalImages: galleryItems.filter(i => i.section === activeSection).reduce((acc, item) => acc + item.images.length, 0),
  };

  const handleSelectAll = () => {
    if (selectedItems.length === paginatedItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(paginatedItems.map(item => item.id));
    }
  };

  const handleSelectItem = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(i => i !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handleAddNew = () => {
    setFormData({
      title: '',
      date: new Date().toISOString().split('T')[0],
      location: '',
      category: categories[1] || '',
      section: activeSection,
      status: 'Draft',
      images: [{ url: '', caption: '' }],
    });
    setShowAddModal(true);
  };

  const handleEdit = (item: GalleryItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      date: item.createdAt,
      location: item.location,
      category: item.category,
      section: item.section,
      status: item.status,
      images: item.images.map(img => ({ url: img.url, caption: img.caption })),
    });
    setShowEditModal(true);
  };

  const handleDelete = () => {
    setGalleryItems(galleryItems.filter(item => !selectedItems.includes(item.id)));
    setSelectedItems([]);
    setShowDeleteConfirm(false);
    showToast(`${selectedItems.length} item(s) deleted successfully`, 'success');
  };

  const handleSaveNew = () => {
    const newItem: GalleryItem = {
      id: `${activeSection.toLowerCase().replace(' ', '-')}-${Date.now()}`,
      title: formData.title,
      date: new Date(formData.date).toLocaleDateString('en-GB').replace(/\//g, '-'),
      location: formData.location,
      category: formData.category,
      section: activeSection,
      images: formData.images.filter(img => img.url).map((img, idx) => ({
        id: `img-${Date.now()}-${idx}`,
        url: img.url,
        caption: img.caption,
      })),
      status: formData.status,
      createdAt: formData.date,
    };
    setGalleryItems([newItem, ...galleryItems]);
    setShowAddModal(false);
    showToast('Gallery item added successfully', 'success');
  };

  const handleSaveEdit = () => {
    if (!editingItem) return;
    setGalleryItems(galleryItems.map(item => {
      if (item.id === editingItem.id) {
        return {
          ...item,
          title: formData.title,
          date: new Date(formData.date).toLocaleDateString('en-GB').replace(/\//g, '-'),
          location: formData.location,
          category: formData.category,
          status: formData.status,
          images: formData.images.filter(img => img.url).map((img, idx) => ({
            id: `img-${Date.now()}-${idx}`,
            url: img.url,
            caption: img.caption,
          })),
          createdAt: formData.date,
        };
      }
      return item;
    }));
    setShowEditModal(false);
    setEditingItem(null);
    showToast('Gallery item updated successfully', 'success');
  };

  const handleAddImage = () => {
    setFormData({
      ...formData,
      images: [...formData.images, { url: '', caption: '' }],
    });
  };

  const handleRemoveImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  const handleImageChange = (index: number, field: 'url' | 'caption', value: string) => {
    const newImages = [...formData.images];
    newImages[index][field] = value;
    setFormData({ ...formData, images: newImages });
  };

  // Drag and drop handlers
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const processFiles = useCallback((files: FileList | null) => {
    if (!files) return;
    
    const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
    
    imageFiles.forEach((file) => {
      const reader = new FileReader();
      const tempId = `uploading-${Date.now()}-${Math.random()}`;
      
      setUploadingImages(prev => [...prev, tempId]);
      
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, { url: result, caption: file.name.replace(/\.[^/.]+$/, '') }],
        }));
        setUploadingImages(prev => prev.filter(id => id !== tempId));
      };
      
      reader.onerror = () => {
        setUploadingImages(prev => prev.filter(id => id !== tempId));
        showToast('Failed to load image', 'error');
      };
      
      reader.readAsDataURL(file);
    });
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    processFiles(files);
  }, [processFiles]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [processFiles]);

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const renderSortIcon = (column: string) => {
    if (sortColumn !== column) {
      return <i className={`ri-arrow-up-down-line text-xs ml-1.5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />;
    }
    return sortDirection === 'asc'
      ? <i className="ri-arrow-up-s-line text-sm ml-1 text-red-500" />
      : <i className="ri-arrow-down-s-line text-sm ml-1 text-red-500" />;
  };

  const openImagePreview = (images: GalleryImage[], startIndex: number = 0) => {
    setPreviewImages(images);
    setPreviewIndex(startIndex);
    setShowImagePreview(true);
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
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search gallery items..." className={`w-full pl-11 pr-4 py-2.5 ${darkMode ? 'bg-gray-700 text-white placeholder-gray-400 border-gray-600' : 'bg-gray-50 text-gray-900 placeholder-gray-500 border-gray-200'} border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600`} />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setDarkMode(!darkMode)} className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${darkMode ? 'hover:bg-gray-700 text-yellow-400' : 'hover:bg-gray-100 text-gray-500'}`}>
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
            {breadcrumbs.map((crumb, index) => (
              <div key={crumb.path} className="flex items-center gap-2">
                {index > 0 && <i className={`ri-arrow-right-s-line ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />}
                {index === breadcrumbs.length - 1 ? (
                  <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{crumb.label}</span>
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
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'Merriweather, serif' }}>Gallery Management</h1>
              <p className={`mt-2 text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Manage photos for Facilities, Trainings, Visits, Events, Social Initiatives & DOT</p>
            </div>
            <button onClick={handleAddNew} className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white hover:bg-red-700 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap">
              <i className="ri-add-line text-lg" />
              Add Gallery Item
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            <div className={`rounded-xl p-5 border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${darkMode ? 'bg-red-600/20' : 'bg-red-50'}`}>
                  <i className="ri-gallery-line text-xl text-red-600" />
                </div>
                <div>
                  <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stats.total}</p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Albums</p>
                </div>
              </div>
            </div>
            <div className={`rounded-xl p-5 border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${darkMode ? 'bg-green-600/20' : 'bg-green-50'}`}>
                  <i className="ri-check-double-line text-xl text-green-600" />
                </div>
                <div>
                  <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stats.published}</p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Published</p>
                </div>
              </div>
            </div>
            <div className={`rounded-xl p-5 border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${darkMode ? 'bg-yellow-600/20' : 'bg-yellow-50'}`}>
                  <i className="ri-draft-line text-xl text-yellow-600" />
                </div>
                <div>
                  <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stats.draft}</p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Drafts</p>
                </div>
              </div>
            </div>
            <div className={`rounded-xl p-5 border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${darkMode ? 'bg-blue-600/20' : 'bg-blue-50'}`}>
                  <i className="ri-image-2-line text-xl text-blue-600" />
                </div>
                <div>
                  <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stats.totalImages}</p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Photos</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs + Filters + Table Container */}
          <div className={`rounded-xl border overflow-hidden ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            {/* Dropdown Filters */}
            <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between flex-wrap gap-4`}>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Category:</span>
                  <select 
                    value={activeSection} 
                    onChange={(e) => { setActiveSection(e.target.value); setSelectedCategory('All'); }} 
                    className={`px-4 py-2 rounded-lg text-sm border cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-600 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-200'}`}
                  >
                    <option value="All">All Gallery ({galleryItems.length})</option>
                    {sections.map((section) => {
                      const count = galleryItems.filter(i => i.section === section.id).length;
                      return (
                        <option key={section.id} value={section.id}>{section.label} ({count})</option>
                      );
                    })}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Status:</span>
                  <select 
                    value={selectedStatus} 
                    onChange={(e) => setSelectedStatus(e.target.value)} 
                    className={`px-4 py-2 rounded-lg text-sm border cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-600 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-200'}`}
                  >
                    <option value="All">All Status</option>
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {selectedItems.length > 0 && (
                  <button onClick={() => setShowDeleteConfirm(true)} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors cursor-pointer whitespace-nowrap">
                    <i className="ri-delete-bin-line" />
                    Delete ({selectedItems.length})
                  </button>
                )}
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {sortedItems.length} items
                </span>
                {/* View Mode Toggle */}
                <div className={`flex items-center rounded-lg border ${darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'}`}>
                  <button
                    onClick={() => setViewMode('table')}
                    className={`w-9 h-9 flex items-center justify-center rounded-l-lg transition-colors cursor-pointer ${
                      viewMode === 'table'
                        ? 'bg-red-600 text-white'
                        : darkMode
                          ? 'text-gray-400 hover:text-white hover:bg-gray-600'
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                    }`}
                    title="Table View"
                  >
                    <i className="ri-list-check text-lg" />
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`w-9 h-9 flex items-center justify-center rounded-r-lg transition-colors cursor-pointer ${
                      viewMode === 'grid'
                        ? 'bg-red-600 text-white'
                        : darkMode
                          ? 'text-gray-400 hover:text-white hover:bg-gray-600'
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                    }`}
                    title="Grid View"
                  >
                    <i className="ri-grid-fill text-lg" />
                  </button>
                </div>
              </div>
            </div>

            {/* Gallery Table */}
            <div className="overflow-x-auto">
              {viewMode === 'table' ? (
                <>
                  <table className="w-full">
                    <thead>
                      <tr className={`${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                        <th className="w-12 px-4 py-4">
                          <input type="checkbox" checked={selectedItems.length === paginatedItems.length && paginatedItems.length > 0} onChange={handleSelectAll} className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-600 cursor-pointer" />
                        </th>
                        <th className={`px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Preview</th>
                        <th onClick={() => handleSort('title')} className={`px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer select-none hover:text-red-500 transition-colors ${darkMode ? 'text-gray-400' : 'text-gray-500'} ${sortColumn === 'title' ? '!text-red-500' : ''}`}>
                          <span className="inline-flex items-center">Title{renderSortIcon('title')}</span>
                        </th>
                        <th onClick={() => handleSort('section')} className={`px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer select-none hover:text-red-500 transition-colors ${darkMode ? 'text-gray-400' : 'text-gray-500'} ${sortColumn === 'section' ? '!text-red-500' : ''}`}>
                          <span className="inline-flex items-center">Section{renderSortIcon('section')}</span>
                        </th>
                        <th onClick={() => handleSort('category')} className={`px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer select-none hover:text-red-500 transition-colors ${darkMode ? 'text-gray-400' : 'text-gray-500'} ${sortColumn === 'category' ? '!text-red-500' : ''}`}>
                          <span className="inline-flex items-center">Category{renderSortIcon('category')}</span>
                        </th>
                        <th onClick={() => handleSort('date')} className={`px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer select-none hover:text-red-500 transition-colors ${darkMode ? 'text-gray-400' : 'text-gray-500'} ${sortColumn === 'date' ? '!text-red-500' : ''}`}>
                          <span className="inline-flex items-center">Date{renderSortIcon('date')}</span>
                        </th>
                        <th onClick={() => handleSort('photos')} className={`px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer select-none hover:text-red-500 transition-colors ${darkMode ? 'text-gray-400' : 'text-gray-500'} ${sortColumn === 'photos' ? '!text-red-500' : ''}`}>
                          <span className="inline-flex items-center">Photos{renderSortIcon('photos')}</span>
                        </th>
                        <th onClick={() => handleSort('status')} className={`px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer select-none hover:text-red-500 transition-colors ${darkMode ? 'text-gray-400' : 'text-gray-500'} ${sortColumn === 'status' ? '!text-red-500' : ''}`}>
                          <span className="inline-flex items-center">Status{renderSortIcon('status')}</span>
                        </th>
                        <th className={`px-4 py-4 text-right text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Actions</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-100'}`}>
                      {paginatedItems.map((item) => (
                        <tr key={item.id} className={`${darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'} transition-colors`}>
                          <td className="px-4 py-4">
                            <input type="checkbox" checked={selectedItems.includes(item.id)} onChange={() => handleSelectItem(item.id)} className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-600 cursor-pointer" />
                          </td>
                          <td className="px-4 py-4">
                            <div className="cursor-pointer" onClick={() => openImagePreview(item.images)}>
                              <div className="w-12 h-12 rounded-lg overflow-hidden border-2 border-white dark:border-gray-800 shadow-sm">
                                <img src={item.images[0]?.url} alt={item.images[0]?.caption} className="w-full h-full object-cover" />
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div>
                              <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{item.title}</p>
                              <p className={`text-xs mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{item.location}</p>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${darkMode ? 'bg-red-600/20 text-red-400' : 'bg-red-100 text-red-700'}`}>
                              {item.section}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                              {item.category}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{item.date}</span>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{item.images.length}</span>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${item.status === 'Published' ? darkMode ? 'bg-green-600/20 text-green-400' : 'bg-green-100 text-green-700' : darkMode ? 'bg-yellow-600/20 text-yellow-400' : 'bg-yellow-100 text-yellow-700'}`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <button onClick={() => openImagePreview(item.images)} className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${darkMode ? 'hover:bg-gray-700 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'}`} title="Preview">
                                <i className="ri-eye-line" />
                              </button>
                              <button onClick={() => handleEdit(item)} className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${darkMode ? 'hover:bg-gray-700 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'}`} title="Edit">
                                <i className="ri-edit-line" />
                              </button>
                              <button onClick={() => { setSelectedItems([item.id]); setShowDeleteConfirm(true); }} className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${darkMode ? 'hover:bg-red-600/20 text-gray-400 hover:text-red-400' : 'hover:bg-red-50 text-gray-500 hover:text-red-600'}`} title="Delete">
                                <i className="ri-delete-bin-line" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {sortedItems.length === 0 && (
                    <div className="py-16 text-center">
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                        <i className={`ri-image-line text-3xl ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                      </div>
                      <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>No gallery items found</h3>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Try adjusting your filters or add a new gallery item.</p>
                    </div>
                  )}
                </>
              ) : (
                /* Grid View */
                <div className="p-6">
                  {sortedItems.length === 0 ? (
                    <div className="py-16 text-center">
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                        <i className={`ri-image-line text-3xl ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                      </div>
                      <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>No gallery items found</h3>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Try adjusting your filters or add a new gallery item.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                      {paginatedItems.map((item) => (
                        <div
                          key={item.id}
                          className={`group rounded-xl overflow-hidden border transition-all hover:shadow-lg ${
                            darkMode ? 'bg-gray-700/50 border-gray-600 hover:border-gray-500' : 'bg-white border-gray-200 hover:border-gray-300'
                          } ${selectedItems.includes(item.id) ? 'ring-2 ring-red-600' : ''}`}
                        >
                          {/* Image Container */}
                          <div className="relative aspect-[4/3] overflow-hidden cursor-pointer" onClick={() => openImagePreview(item.images)}>
                            <img
                              src={item.images[0]?.url}
                              alt={item.title}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            {/* Overlay with actions */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={(e) => { e.stopPropagation(); openImagePreview(item.images); }}
                                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white/90 text-gray-800 hover:bg-white transition-colors cursor-pointer"
                                  title="Preview"
                                >
                                  <i className="ri-eye-line text-lg" />
                                </button>
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleEdit(item); }}
                                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white/90 text-gray-800 hover:bg-white transition-colors cursor-pointer"
                                  title="Edit"
                                >
                                  <i className="ri-edit-line text-lg" />
                                </button>
                                <button
                                  onClick={(e) => { e.stopPropagation(); setSelectedItems([item.id]); setShowDeleteConfirm(true); }}
                                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white/90 text-red-600 hover:bg-white transition-colors cursor-pointer"
                                  title="Delete"
                                >
                                  <i className="ri-delete-bin-line text-lg" />
                                </button>
                              </div>
                            </div>
                            {/* Photo count badge */}
                            <div className="absolute bottom-2 right-2 px-2 py-1 rounded-md bg-black/60 text-white text-xs font-medium flex items-center gap-1">
                              <i className="ri-image-line" />
                              {item.images.length}
                            </div>
                            {/* Checkbox */}
                            <div className="absolute top-2 left-2">
                              <input
                                type="checkbox"
                                checked={selectedItems.includes(item.id)}
                                onChange={(e) => { e.stopPropagation(); handleSelectItem(item.id); }}
                                className="w-5 h-5 rounded border-2 border-white bg-white/80 text-red-600 focus:ring-red-600 cursor-pointer"
                                onClick={(e) => e.stopPropagation()}
                              />
                            </div>
                            {/* Status badge */}
                            <div className="absolute top-2 right-2">
                              <span className={`px-2 py-1 rounded-md text-xs font-semibold ${
                                item.status === 'Published'
                                  ? 'bg-green-500 text-white'
                                  : 'bg-yellow-500 text-white'
                              }`}>
                                {item.status}
                              </span>
                            </div>
                          </div>
                          {/* Content */}
                          <div className="p-4">
                            <h3 className={`text-sm font-semibold mb-1 line-clamp-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {item.title}
                            </h3>
                            <p className={`text-xs mb-3 line-clamp-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              <i className="ri-map-pin-line mr-1" />
                              {item.location}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${darkMode ? 'bg-red-600/20 text-red-400' : 'bg-red-100 text-red-700'}`}>
                                  {item.section}
                                </span>
                              </div>
                              <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                {item.date}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Pagination */}
              {sortedItems.length > 0 && (
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
                      Showing {startIndex + 1} to {Math.min(endIndex, sortedItems.length)} of {sortedItems.length} entries
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                      className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}
                      title="First page"
                    >
                      <i className="ri-skip-back-mini-line" />
                    </button>
                    <button
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}
                      title="Previous page"
                    >
                      <i className="ri-arrow-left-s-line" />
                    </button>
                    {(() => {
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
                      return pages.map((page, idx) => (
                        typeof page === 'string' ? (
                          <span key={`ellipsis-${idx}`} className={`w-8 h-8 flex items-center justify-center text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>...</span>
                        ) : (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors cursor-pointer ${currentPage === page ? 'bg-red-600 text-white' : darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}
                          >
                            {page}
                          </button>
                        )
                      ));
                    })()}
                    <button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}
                      title="Next page"
                    >
                      <i className="ri-arrow-right-s-line" />
                    </button>
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages}
                      className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}
                      title="Last page"
                    >
                      <i className="ri-skip-forward-mini-line" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Add/Edit Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className={`sticky top-0 px-6 py-4 border-b ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} flex items-center justify-between`}>
              <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {showAddModal ? 'Add Gallery Item' : 'Edit Gallery Item'}
              </h2>
              <button onClick={() => { setShowAddModal(false); setShowEditModal(false); setEditingItem(null); }} className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}>
                <i className="ri-close-line text-xl" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Title *</label>
                <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className={`w-full px-4 py-2.5 rounded-lg border text-sm ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-red-600`} placeholder="Enter title" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Date *</label>
                  <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className={`w-full px-4 py-2.5 rounded-lg border text-sm ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-red-600`} />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Category *</label>
                  <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className={`w-full px-4 py-2.5 rounded-lg border text-sm cursor-pointer ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-red-600`}>
                    <option value="">Select category</option>
                    {categories.filter(c => c !== 'All').map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Location *</label>
                <input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className={`w-full px-4 py-2.5 rounded-lg border text-sm ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-red-600`} placeholder="Enter location" />
              </div>
              
              {/* Image Upload Section */}
              <div>
                <label className={`block text-sm font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Images *</label>
                
                {/* Drag and Drop Zone */}
                <div
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={handleBrowseClick}
                  className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
                    isDragging
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                      : darkMode
                        ? 'border-gray-600 hover:border-gray-500 hover:bg-gray-700/50'
                        : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                    isDragging
                      ? 'bg-red-100 dark:bg-red-900/40'
                      : darkMode
                        ? 'bg-gray-700'
                        : 'bg-gray-100'
                  }`}>
                    <i className={`ri-upload-cloud-2-line text-3xl ${
                      isDragging
                        ? 'text-red-500'
                        : darkMode
                          ? 'text-gray-400'
                          : 'text-gray-500'
                    }`} />
                  </div>
                  <p className={`text-base font-medium mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {isDragging ? 'Drop images here' : 'Drag & drop images here'}
                  </p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    or <span className="text-red-600 font-medium">browse files</span> from your computer
                  </p>
                  <p className={`text-xs mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    Supports: JPG, PNG, GIF, WebP (Max 10MB each)
                  </p>
                </div>

                {/* Uploading Indicator */}
                {uploadingImages.length > 0 && (
                  <div className={`mt-4 p-3 rounded-lg flex items-center gap-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                    <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Processing {uploadingImages.length} image(s)...
                    </span>
                  </div>
                )}

                {/* Image Previews */}
                {formData.images.length > 0 && (
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Uploaded Images ({formData.images.length})
                      </span>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleAddImage(); }}
                        className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700 cursor-pointer"
                      >
                        <i className="ri-add-line" />
                        Add URL
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {formData.images.map((img, index) => (
                        <div
                          key={index}
                          className={`relative group rounded-xl overflow-hidden border ${
                            darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'
                          }`}
                        >
                          {img.url ? (
                            <>
                              <div className="aspect-video relative">
                                <img
                                  src={img.url}
                                  alt={img.caption || `Image ${index + 1}`}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect fill="%23f3f4f6" width="100" height="100"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%239ca3af" font-size="12">Invalid URL</text></svg>';
                                  }}
                                />
                                {/* Overlay with actions */}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handleRemoveImage(index); }}
                                    className="w-10 h-10 flex items-center justify-center rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors cursor-pointer"
                                    title="Remove"
                                  >
                                    <i className="ri-delete-bin-line" />
                                  </button>
                                </div>
                                {/* Image number badge */}
                                <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-black/60 text-white text-xs font-medium flex items-center justify-center">
                                  {index + 1}
                                </div>
                              </div>
                              <div className="p-3">
                                <input
                                  type="text"
                                  value={img.caption}
                                  onChange={(e) => handleImageChange(index, 'caption', e.target.value)}
                                  onClick={(e) => e.stopPropagation()}
                                  className={`w-full px-3 py-2 rounded-lg border text-sm ${
                                    darkMode
                                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                  } focus:outline-none focus:ring-2 focus:ring-red-600`}
                                  placeholder="Add caption..."
                                />
                              </div>
                            </>
                          ) : (
                            <div className="p-4">
                              <div className="flex items-start gap-3">
                                <div className="flex-1 space-y-3">
                                  <input
                                    type="text"
                                    value={img.url}
                                    onChange={(e) => handleImageChange(index, 'url', e.target.value)}
                                    onClick={(e) => e.stopPropagation()}
                                    className={`w-full px-3 py-2 rounded-lg border text-sm ${
                                      darkMode
                                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                    } focus:outline-none focus:ring-2 focus:ring-red-600`}
                                    placeholder="Paste image URL..."
                                  />
                                  <input
                                    type="text"
                                    value={img.caption}
                                    onChange={(e) => handleImageChange(index, 'caption', e.target.value)}
                                    onClick={(e) => e.stopPropagation()}
                                    className={`w-full px-3 py-2 rounded-lg border text-sm ${
                                      darkMode
                                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                    } focus:outline-none focus:ring-2 focus:ring-red-600`}
                                    placeholder="Caption"
                                  />
                                </div>
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleRemoveImage(index); }}
                                  className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                                    darkMode
                                      ? 'hover:bg-red-600/20 text-gray-400 hover:text-red-400'
                                      : 'hover:bg-red-50 text-gray-500 hover:text-red-600'
                                  }`}
                                >
                                  <i className="ri-delete-bin-line" />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className={`sticky bottom-0 px-6 py-4 border-t ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} flex items-center justify-end gap-3`}>
              <button onClick={() => { setShowAddModal(false); setShowEditModal(false); setEditingItem(null); }} className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                Cancel
              </button>
              <button onClick={showAddModal ? handleSaveNew : handleSaveEdit} disabled={!formData.title || !formData.date || !formData.category || !formData.location || formData.images.filter(i => i.url).length === 0} className="px-5 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap">
                {showAddModal ? 'Add Item' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-md rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} p-6`}>
            <div className="text-center">
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${darkMode ? 'bg-red-600' : 'bg-red-100'}`}>
                <i className="ri-delete-bin-line text-3xl text-red-600" />
              </div>
              <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Delete Gallery Item(s)?</h3>
              <p className={`text-sm mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Are you sure you want to delete {selectedItems.length} item(s)? This action cannot be undone.
              </p>
              <div className="flex items-center justify-center gap-3">
                <button onClick={() => { setShowDeleteConfirm(false); setSelectedItems([]); }} className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                  Cancel
                </button>
                <button onClick={handleDelete} className="px-5 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors cursor-pointer whitespace-nowrap">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {showImagePreview && previewImages.length > 0 && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
          <button onClick={() => setShowImagePreview(false)} className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer">
            <i className="ri-close-line text-2xl" />
          </button>
          <button onClick={() => setPreviewIndex((previewIndex - 1 + previewImages.length) % previewImages.length)} className="absolute left-4 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer">
            <i className="ri-arrow-left-s-line text-2xl" />
          </button>
          <button onClick={() => setPreviewIndex((previewIndex + 1) % previewImages.length)} className="absolute right-4 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer">
            <i className="ri-arrow-right-s-line text-2xl" />
          </button>
          <div className="max-w-5xl max-h-[80vh] px-16">
            <img src={previewImages[previewIndex].url} alt={previewImages[previewIndex].caption} className="max-w-full max-h-[70vh] object-contain rounded-lg" />
            <p className="text-white text-center mt-4 text-lg">{previewImages[previewIndex].caption}</p>
            <p className="text-white/60 text-center mt-2 text-sm">{previewIndex + 1} / {previewImages.length}</p>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed bottom-6 right-6 px-5 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50 ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'} text-white`}>
          <i className={`${toast.type === 'success' ? 'ri-check-line' : 'ri-error-warning-line'} text-lg`} />
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}
    </div>
  );
};

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

export default GalleryManagement;
