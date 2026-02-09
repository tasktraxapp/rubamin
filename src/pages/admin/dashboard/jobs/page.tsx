import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface JobPosting {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract';
  experience: string;
  salary: string;
  description: string;
  requirements: string[];
  status: 'Active' | 'Closed' | 'Draft';
  postedDate: string;
  closingDate: string;
  applications: number;
}

interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  fullName: string;
  email: string;
  phone: string;
  experience: string;
  currentEmployer: string;
  expectedSalary: string;
  noticePeriod: string;
  coverLetter: string;
  documents: string[];
  status: 'New' | 'Reviewed' | 'Shortlisted' | 'Rejected' | 'Hired';
  appliedDate: string;
  repliedAt?: string;
}

type JobSortField = 'title' | 'department' | 'type' | 'postedDate' | 'closingDate' | 'status' | 'applications';
type ApplicationSortField = 'fullName' | 'jobTitle' | 'status' | 'appliedDate';
type SortDirection = 'asc' | 'desc';
type ViewMode = 'table' | 'grid';

const JobsManagement = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('adminDarkMode');
    return saved ? JSON.parse(saved) : false;
  });
  const [currentTime, setCurrentTime] = useState(new Date());
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'postings' | 'applications'>('applications');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [editingJob, setEditingJob] = useState<JobPosting | null>(null);
  const [viewingApplication, setViewingApplication] = useState<JobApplication | null>(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterDepartment, setFilterDepartment] = useState('All');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Sorting states
  const [jobSortField, setJobSortField] = useState<JobSortField>('postedDate');
  const [jobSortDirection, setJobSortDirection] = useState<SortDirection>('desc');
  const [appSortField, setAppSortField] = useState<ApplicationSortField>('appliedDate');
  const [appSortDirection, setAppSortDirection] = useState<SortDirection>('desc');
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [jobPostingsViewMode, setJobPostingsViewMode] = useState<ViewMode>('table');

  // Admin user data
  const adminUser = {
    name: 'Admin User',
    email: 'admin@rubamin.com'
  };

  // Form data state
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    location: '',
    type: 'Full-time',
    experience: '',
    salary: '',
    description: '',
    requirements: '',
    status: 'Draft',
    closingDate: '',
  });

  const [jobPostings, setJobPostings] = useState<JobPosting[]>([
    {
      id: 'JOB-001',
      title: 'Senior Metallurgical Engineer',
      department: 'Engineering',
      location: 'Lubumbashi, DRC',
      type: 'Full-time',
      experience: '5-7 years',
      salary: '$3,000 - $4,500/month',
      description: 'We are seeking an experienced Metallurgical Engineer to join our team.',
      requirements: ['Bachelor\'s degree in Metallurgical Engineering', '5+ years experience', 'Strong analytical skills'],
      status: 'Active',
      postedDate: '2024-03-01',
      closingDate: '2024-04-15',
      applications: 12,
    },
    {
      id: 'JOB-002',
      title: 'HSE Manager',
      department: 'Health & Safety',
      location: 'Lubumbashi, DRC',
      type: 'Full-time',
      experience: '7-10 years',
      salary: '$4,000 - $5,500/month',
      description: 'Lead our Health, Safety, and Environment department.',
      requirements: ['NEBOSH certification', '7+ years HSE experience', 'Mining industry background'],
      status: 'Active',
      postedDate: '2024-02-20',
      closingDate: '2024-04-01',
      applications: 8,
    },
    {
      id: 'JOB-003',
      title: 'Production Supervisor',
      department: 'Operations',
      location: 'Lubumbashi, DRC',
      type: 'Full-time',
      experience: '3-5 years',
      salary: '$2,500 - $3,500/month',
      description: 'Supervise daily production operations and team management.',
      requirements: ['Engineering degree', '3+ years supervisory experience', 'Leadership skills'],
      status: 'Active',
      postedDate: '2024-03-05',
      closingDate: '2024-04-20',
      applications: 15,
    },
    {
      id: 'JOB-004',
      title: 'Quality Control Analyst',
      department: 'Quality',
      location: 'Lubumbashi, DRC',
      type: 'Full-time',
      experience: '1-3 years',
      salary: '$1,800 - $2,500/month',
      description: 'Perform quality control tests and maintain quality standards.',
      requirements: ['Chemistry or related degree', 'Lab experience', 'Attention to detail'],
      status: 'Active',
      postedDate: '2024-03-10',
      closingDate: '2024-04-25',
      applications: 22,
    },
    {
      id: 'JOB-005',
      title: 'Maintenance Technician',
      department: 'Maintenance',
      location: 'Lubumbashi, DRC',
      type: 'Full-time',
      experience: '3-5 years',
      salary: '$2,000 - $3,000/month',
      description: 'Maintain and repair industrial equipment and machinery.',
      requirements: ['Technical diploma', 'Industrial maintenance experience', 'Electrical knowledge'],
      status: 'Closed',
      postedDate: '2024-01-15',
      closingDate: '2024-02-28',
      applications: 18,
    },
    {
      id: 'JOB-006',
      title: 'Environmental Specialist',
      department: 'Environment',
      location: 'Lubumbashi, DRC',
      type: 'Full-time',
      experience: '3-5 years',
      salary: '$2,500 - $3,500/month',
      description: 'Monitor environmental compliance and implement sustainability initiatives.',
      requirements: ['Environmental Science degree', 'EIA experience', 'Regulatory knowledge'],
      status: 'Draft',
      postedDate: '2024-03-15',
      closingDate: '2024-05-01',
      applications: 0,
    },
    {
      id: 'JOB-007',
      title: 'HR Business Partner',
      department: 'Human Resources',
      location: 'Lubumbashi, DRC',
      type: 'Full-time',
      experience: '5-7 years',
      salary: '$3,000 - $4,000/month',
      description: 'Partner with business units to deliver HR solutions.',
      requirements: ['HR degree', '5+ years HR experience', 'HRIS proficiency'],
      status: 'Active',
      postedDate: '2024-03-08',
      closingDate: '2024-04-22',
      applications: 9,
    },
    {
      id: 'JOB-008',
      title: 'Supply Chain Coordinator',
      department: 'Supply Chain',
      location: 'Lubumbashi, DRC',
      type: 'Full-time',
      experience: '3-5 years',
      salary: '$2,500 - $3,500/month',
      description: 'Coordinate supply chain activities and vendor management.',
      requirements: ['Supply Chain degree', 'Procurement experience', 'SAP knowledge'],
      status: 'Active',
      postedDate: '2024-03-12',
      closingDate: '2024-04-30',
      applications: 11,
    },
  ]);

  const [applications, setApplications] = useState<JobApplication[]>([
    {
      id: 'APP-001',
      jobId: 'JOB-001',
      jobTitle: 'Senior Metallurgical Engineer',
      fullName: 'Jean-Pierre Kabongo',
      email: 'jpkabongo@email.com',
      phone: '+243 812 345 678',
      experience: '5-7 years',
      currentEmployer: 'Glencore DRC',
      expectedSalary: '$4,000/month',
      noticePeriod: '1 month',
      coverLetter: 'I am excited to apply for the Senior Metallurgical Engineer position...',
      documents: ['CV_JPKabongo.pdf', 'Certificates.pdf'],
      status: 'New',
      appliedDate: '2024-03-15',
    },
    {
      id: 'APP-002',
      jobId: 'JOB-001',
      jobTitle: 'Senior Metallurgical Engineer',
      fullName: 'Marie Tshilombo',
      email: 'mtshilombo@email.com',
      phone: '+243 823 456 789',
      experience: '7-10 years',
      currentEmployer: 'Tenke Fungurume Mining',
      expectedSalary: '$4,500/month',
      noticePeriod: '2 months',
      coverLetter: 'With over 8 years of experience in metallurgical processes...',
      documents: ['Resume_MTshilombo.pdf', 'References.pdf'],
      status: 'Shortlisted',
      appliedDate: '2024-03-12',
    },
    {
      id: 'APP-003',
      jobId: 'JOB-002',
      jobTitle: 'HSE Manager',
      fullName: 'Patrick Mwamba',
      email: 'pmwamba@email.com',
      phone: '+243 834 567 890',
      experience: '10+ years',
      currentEmployer: 'Kamoa Copper',
      expectedSalary: '$5,500/month',
      noticePeriod: '3 months',
      coverLetter: 'As a certified NEBOSH professional with extensive mining experience...',
      documents: ['CV_PMwamba.pdf', 'NEBOSH_Certificate.pdf', 'References.pdf'],
      status: 'Reviewed',
      appliedDate: '2024-03-10',
    },
    {
      id: 'APP-004',
      jobId: 'JOB-003',
      jobTitle: 'Production Supervisor',
      fullName: 'Emmanuel Kasongo',
      email: 'ekasongo@email.com',
      phone: '+243 845 678 901',
      experience: '3-5 years',
      currentEmployer: 'Chemaf SARL',
      expectedSalary: '$3,000/month',
      noticePeriod: '1 month',
      coverLetter: 'I have successfully led production teams for the past 4 years...',
      documents: ['Resume_EKasongo.pdf'],
      status: 'New',
      appliedDate: '2024-03-18',
    },
    {
      id: 'APP-005',
      jobId: 'JOB-004',
      jobTitle: 'Quality Control Analyst',
      fullName: 'Grace Mutombo',
      email: 'gmutombo@email.com',
      phone: '+243 856 789 012',
      experience: '1-3 years',
      currentEmployer: 'Fresh Graduate',
      expectedSalary: '$2,000/month',
      noticePeriod: 'Immediate',
      coverLetter: 'As a recent Chemistry graduate with laboratory internship experience...',
      documents: ['CV_GMutombo.pdf', 'Degree_Certificate.pdf', 'Internship_Letter.pdf'],
      status: 'New',
      appliedDate: '2024-03-20',
    },
    {
      id: 'APP-006',
      jobId: 'JOB-005',
      jobTitle: 'Maintenance Technician',
      fullName: 'David Ilunga',
      email: 'dilunga@email.com',
      phone: '+243 867 890 123',
      experience: '3-5 years',
      currentEmployer: 'Sicomines',
      expectedSalary: '$2,800/month',
      noticePeriod: '15 days',
      coverLetter: 'I bring 4 years of hands-on experience in industrial maintenance...',
      documents: ['Resume_DIlunga.pdf', 'Technical_Certificates.pdf'],
      status: 'Hired',
      appliedDate: '2024-02-01',
    },
    {
      id: 'APP-007',
      jobId: 'JOB-007',
      jobTitle: 'HR Business Partner',
      fullName: 'Sophie Kalala',
      email: 'skalala@email.com',
      phone: '+243 878 901 234',
      experience: '5-7 years',
      currentEmployer: 'Ivanhoe Mines',
      expectedSalary: '$3,800/month',
      noticePeriod: '2 months',
      coverLetter: 'With my background in strategic HR and talent management...',
      documents: ['CV_SKalala.pdf', 'HR_Certifications.pdf'],
      status: 'Reviewed',
      appliedDate: '2024-03-14',
    },
    {
      id: 'APP-008',
      jobId: 'JOB-008',
      jobTitle: 'Supply Chain Coordinator',
      fullName: 'Robert Ngoy',
      email: 'rngoy@email.com',
      phone: '+243 889 012 345',
      experience: '3-5 years',
      currentEmployer: 'Boss Mining',
      expectedSalary: '$3,200/month',
      noticePeriod: '1 month',
      coverLetter: 'I have extensive experience in procurement and logistics...',
      documents: ['Resume_RNgoy.pdf', 'SAP_Certificate.pdf'],
      status: 'Rejected',
      appliedDate: '2024-03-16',
    },
  ]);

  const departments = ['All', 'Engineering', 'Health & Safety', 'Operations', 'Quality', 'Maintenance', 'Environment', 'Human Resources', 'Supply Chain'];
  const jobStatusOptions = ['All', 'Active', 'Closed', 'Draft'];
  const applicationStatusOptions = ['All', 'New', 'Reviewed', 'Shortlisted', 'Rejected', 'Hired'];

  const handleJobSort = (field: JobSortField) => {
    if (jobSortField === field) {
      setJobSortDirection(jobSortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setJobSortField(field);
      setJobSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const handleAppSort = (field: ApplicationSortField) => {
    if (appSortField === field) {
      setAppSortDirection(appSortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setAppSortField(field);
      setAppSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const filteredJobs = jobPostings.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'All' || job.status === filterStatus;
    const matchesDepartment = filterDepartment === 'All' || job.department === filterDepartment;
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const filteredApplications = applications.filter((app) => {
    const matchesSearch = app.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'All' || app.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Sort jobs
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    let aValue: string | number = '';
    let bValue: string | number = '';

    switch (jobSortField) {
      case 'title':
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
        break;
      case 'department':
        aValue = a.department.toLowerCase();
        bValue = b.department.toLowerCase();
        break;
      case 'type':
        aValue = a.type.toLowerCase();
        bValue = b.type.toLowerCase();
        break;
      case 'postedDate':
        aValue = new Date(a.postedDate).getTime();
        bValue = new Date(b.postedDate).getTime();
        break;
      case 'closingDate':
        aValue = new Date(a.closingDate).getTime();
        bValue = new Date(b.closingDate).getTime();
        break;
      case 'status':
        aValue = a.status.toLowerCase();
        bValue = b.status.toLowerCase();
        break;
      case 'applications':
        aValue = a.applications;
        bValue = b.applications;
        break;
    }

    if (aValue < bValue) return jobSortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return jobSortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Sort applications
  const sortedApplications = [...filteredApplications].sort((a, b) => {
    let aValue: string | number = '';
    let bValue: string | number = '';

    switch (appSortField) {
      case 'fullName':
        aValue = a.fullName.toLowerCase();
        bValue = b.fullName.toLowerCase();
        break;
      case 'jobTitle':
        aValue = a.jobTitle.toLowerCase();
        bValue = b.jobTitle.toLowerCase();
        break;
      case 'status':
        aValue = a.status.toLowerCase();
        bValue = b.status.toLowerCase();
        break;
      case 'appliedDate':
        aValue = new Date(a.appliedDate).getTime();
        bValue = new Date(b.appliedDate).getTime();
        break;
    }

    if (aValue < bValue) return appSortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return appSortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const currentItems = activeTab === 'postings' ? sortedJobs : sortedApplications;
  const totalPages = Math.ceil(currentItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedJobs = sortedJobs.slice(startIndex, endIndex);
  const paginatedApplications = sortedApplications.slice(startIndex, endIndex);

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
    const items = activeTab === 'postings' ? filteredJobs.map((j) => j.id) : filteredApplications.map((a) => a.id);
    setSelectedItems(selectedItems.length === items.length ? [] : items);
  };

  const handleSelectItem = (id: string) => {
    setSelectedItems((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
  };

  const handleDelete = () => {
    if (activeTab === 'postings') {
      setJobPostings((prev) => prev.filter((j) => !selectedItems.includes(j.id)));
    } else {
      setApplications((prev) => prev.filter((a) => !selectedItems.includes(a.id)));
    }
    setSelectedItems([]);
    setShowDeleteModal(false);
    showToastMessage(`${selectedItems.length} item(s) deleted successfully`);
  };

  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleCreateJob = () => {
    const newJob: JobPosting = {
      id: `JOB-${Date.now()}`,
      title: formData.title,
      department: formData.department,
      location: formData.location || 'Lubumbashi, DRC',
      type: formData.type as 'Full-time' | 'Part-time' | 'Contract',
      experience: formData.experience,
      salary: formData.salary,
      description: formData.description,
      requirements: formData.requirements.split('\n').filter((r) => r.trim()),
      status: formData.status as 'Active' | 'Closed' | 'Draft',
      postedDate: new Date().toISOString().split('T')[0],
      closingDate: formData.closingDate,
      applications: 0,
    };
    setJobPostings((prev) => [newJob, ...prev]);
    setShowCreateModal(false);
    resetForm();
    showToastMessage('Job posting created successfully');
  };

  const handleEditJob = () => {
    if (!editingJob) return;
    setJobPostings((prev) =>
      prev.map((j) =>
        j.id === editingJob.id
          ? {
              ...j,
              title: formData.title,
              department: formData.department,
              location: formData.location,
              type: formData.type as 'Full-time' | 'Part-time' | 'Contract',
              experience: formData.experience,
              salary: formData.salary,
              description: formData.description,
              requirements: formData.requirements.split('\n').filter((r) => r.trim()),
              status: formData.status as 'Active' | 'Closed' | 'Draft',
              closingDate: formData.closingDate,
            }
          : j
      )
    );
    setShowEditModal(false);
    setEditingJob(null);
    resetForm();
    showToastMessage('Job posting updated successfully');
  };

  const openEditModal = (job: JobPosting) => {
    setEditingJob(job);
    setFormData({
      title: job.title,
      department: job.department,
      location: job.location,
      type: job.type,
      experience: job.experience,
      salary: job.salary,
      description: job.description,
      requirements: job.requirements.join('\n'),
      status: job.status,
      closingDate: job.closingDate,
    });
    setShowEditModal(true);
  };

  const updateApplicationStatus = (appId: string, newStatus: JobApplication['status']) => {
    setApplications((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, status: newStatus } : a))
    );
    showToastMessage(`Application status updated to ${newStatus}`);
  };

  const handleReplyClick = (app: JobApplication) => {
    setViewingApplication(app);
    setReplyMessage('');
    setShowReplyModal(true);
  };

  const handleSendReply = async () => {
    if (!viewingApplication || !replyMessage.trim()) return;
    setIsSending(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setApplications((prev) =>
      prev.map((a) =>
        a.id === viewingApplication.id
          ? { ...a, status: 'Reviewed', repliedAt: new Date().toISOString() }
          : a
      )
    );
    setIsSending(false);
    setShowReplyModal(false);
    setReplyMessage('');
    showToastMessage('Reply sent successfully');
  };

  const handleArchiveApplication = (appId: string) => {
    setApplications((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, status: 'Rejected' } : a))
    );
    showToastMessage('Application archived');
  };

  const handleViewApplication = (app: JobApplication) => {
    setViewingApplication(app);
    setShowApplicationModal(true);
    if (app.status === 'New') {
      setApplications((prev) =>
        prev.map((a) => (a.id === app.id ? { ...a, status: 'Reviewed' } : a))
      );
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      department: '',
      location: '',
      type: 'Full-time',
      experience: '',
      salary: '',
      description: '',
      requirements: '',
      status: 'Draft',
      closingDate: '',
    });
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      Active: darkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-50 text-green-700',
      Closed: darkMode ? 'bg-red-500/20 text-red-400' : 'bg-red-50 text-red-600',
      Draft: darkMode ? 'bg-gray-500/20 text-gray-400' : 'bg-gray-100 text-gray-600',
      Shortlisted: darkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-50 text-green-700',
      Hired: darkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-50 text-green-700',
      Rejected: darkMode ? 'bg-red-500/20 text-red-400' : 'bg-red-50 text-red-600',
      New: darkMode ? 'bg-red-500/20 text-red-400' : 'bg-red-50 text-red-700',
      Reviewed: darkMode ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-50 text-yellow-700',
    };
    const dots: Record<string, string> = {
      Active: 'bg-green-500',
      Closed: 'bg-red-500',
      Draft: 'bg-gray-400',
      Shortlisted: 'bg-green-500',
      Hired: 'bg-green-500',
      Rejected: 'bg-red-500',
      New: 'bg-red-500',
      Reviewed: 'bg-yellow-500',
    };
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${styles[status] || (darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-100 text-gray-600')}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${dots[status] || 'bg-gray-400'}`} />
        {status}
      </span>
    );
  };

  const newApplicationsCount = applications.filter((a) => a.status === 'New').length;

  const sidebarItems = [
    { label: 'Dashboard', icon: 'ri-dashboard-3-line', path: '/admin/dashboard' },
    { label: 'Pages', icon: 'ri-file-list-3-line', path: '/admin/dashboard/pages' },
    { label: 'Media', icon: 'ri-newspaper-line', path: '/admin/dashboard/media-center', badge: 5 },
    { label: 'Jobs', icon: 'ri-briefcase-line', path: '/admin/dashboard/jobs', badge: 3, active: true },
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
    { label: 'Jobs', path: '/admin/dashboard/jobs' },
  ];

  const renderSortIcon = (field: JobSortField | ApplicationSortField, isJobTable: boolean) => {
    const isActive = isJobTable 
      ? jobSortField === field 
      : appSortField === field;
    const direction = isJobTable ? jobSortDirection : appSortDirection;

    return (
      <i className={`ml-1 ${
        isActive 
          ? direction === 'asc' 
            ? 'ri-arrow-up-line' 
            : 'ri-arrow-down-line'
          : 'ri-arrow-up-down-line opacity-40'
      }`} />
    );
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    navigate('/admin');
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
          {sidebarItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`relative flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${item.active ? 'bg-red-600 text-white shadow-md' : darkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'} ${sidebarCollapsed ? 'justify-center' : ''}`} 
              title={sidebarCollapsed ? item.label : ''}
            >
              <i className={`${item.icon} text-lg`} />
              {!sidebarCollapsed && (
                <>
                  <span className="flex-1">{item.label}</span>
                  {item.badge && item.badge > 0 && (
                    <span className={`min-w-5 h-5 flex items-center justify-center px-1.5 text-xs font-bold rounded-full ${
                      item.active 
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
          ))}
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
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search jobs, applications..." className={`w-full pl-11 pr-4 py-2.5 ${darkMode ? 'bg-gray-700 text-white placeholder-gray-400 border-gray-600' : 'bg-gray-50 text-gray-900 placeholder-gray-500 border-gray-200'} border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all`} />
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
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'Merriweather, serif' }}>
                Jobs Management
              </h1>
              <p className={`mt-2 text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Manage job postings and applications
              </p>
            </div>
            <button onClick={() => { resetForm(); setShowCreateModal(true); }} className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white hover:bg-red-700 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap">
              <i className="ri-add-line text-lg" />
              Post New Job
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-8">
            <div className={`rounded-lg p-6 border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Active Jobs</p>
                  <p className={`text-3xl font-bold mt-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {jobPostings.filter((j) => j.status === 'Active').length}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${darkMode ? 'bg-green-500/20' : 'bg-green-50'}`}>
                  <i className={`ri-briefcase-line text-xl ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                </div>
              </div>
            </div>

            <div className={`rounded-lg p-6 border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Applications</p>
                  <p className={`text-3xl font-bold mt-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {applications.length}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${darkMode ? 'bg-blue-500/20' : 'bg-blue-50'}`}>
                  <i className={`ri-file-user-line text-xl ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                </div>
              </div>
            </div>

            <div className={`rounded-lg p-6 border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>New Applications</p>
                  <p className={`text-3xl font-bold mt-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {applications.filter((a) => a.status === 'New').length}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${darkMode ? 'bg-red-600/20' : 'bg-red-50'}`}>
                  <i className={`ri-notification-badge-line text-xl ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
                </div>
              </div>
            </div>

            <div className={`rounded-lg p-6 border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Hired This Month</p>
                  <p className={`text-3xl font-bold mt-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {applications.filter((a) => a.status === 'Hired').length}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${darkMode ? 'bg-yellow-500/20' : 'bg-yellow-50'}`}>
                  <i className={`ri-user-star-line text-xl ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className={`rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            {/* Sub-Tabs */}
            <div className={`px-4 pt-3 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => { setActiveTab('postings'); setSelectedItems([]); setFilterStatus('All'); setCurrentPage(1); }}
                  className={`px-4 py-2.5 text-sm font-medium rounded-t-lg transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === 'postings'
                      ? darkMode ? 'bg-gray-700 text-white border border-b-0 border-gray-600' : 'bg-white text-gray-900 border border-b-0 border-gray-200 shadow-sm'
                      : darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700/50' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <i className="ri-file-edit-line mr-1.5" />
                  Job Postings
                  <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
                    activeTab === 'postings'
                      ? darkMode ? 'bg-red-600/20 text-red-400' : 'bg-red-50 text-red-600'
                      : darkMode ? 'bg-gray-600 text-gray-400' : 'bg-gray-100 text-gray-500'
                  }`}>{jobPostings.length}</span>
                </button>
                <button
                  onClick={() => { setActiveTab('applications'); setSelectedItems([]); setFilterStatus('All'); setCurrentPage(1); }}
                  className={`px-4 py-2.5 text-sm font-medium rounded-t-lg transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === 'applications'
                      ? darkMode ? 'bg-gray-700 text-white border border-b-0 border-gray-600' : 'bg-white text-gray-900 border border-b-0 border-gray-200 shadow-sm'
                      : darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700/50' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <i className="ri-mail-line mr-1.5" />
                  Applications
                  {newApplicationsCount > 0 && (
                    <span className="ml-2 min-w-5 h-5 inline-flex items-center justify-center px-1.5 text-xs font-bold rounded-full bg-red-600 text-white">{newApplicationsCount}</span>
                  )}
                </button>
              </div>
            </div>

            <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between flex-wrap gap-4`}>
              <div className="flex items-center gap-4">
                {activeTab === 'postings' && (
                  <div className="flex items-center gap-2">
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Department:</span>
                    <select value={filterDepartment} onChange={(e) => { setFilterDepartment(e.target.value); setCurrentPage(1); }} className={`px-4 py-2 rounded-lg text-sm cursor-pointer ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-200'} border focus:outline-none focus:ring-2 focus:ring-red-600`}>
                      {departments.map((dept) => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Status:</span>
                  <select 
                    value={filterStatus} 
                    onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }} 
                    className={`px-4 py-2 rounded-lg text-sm cursor-pointer ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-200'} border focus:outline-none focus:ring-2 focus:ring-red-600`}
                  >
                    {(activeTab === 'postings' ? jobStatusOptions : applicationStatusOptions).map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* View Toggle for both tabs */}
                <div className="flex items-center gap-1 border rounded-lg overflow-hidden" style={{ borderColor: darkMode ? '#374151' : '#E5E7EB' }}>
                  <button
                    onClick={() => activeTab === 'postings' ? setJobPostingsViewMode('table') : setViewMode('table')}
                    className={`px-3 py-2 text-sm font-medium transition-colors cursor-pointer ${
                      (activeTab === 'postings' ? jobPostingsViewMode : viewMode) === 'table'
                        ? 'bg-red-600 text-white'
                        : darkMode
                        ? 'bg-gray-800 text-gray-400 hover:text-white'
                        : 'bg-white text-gray-600 hover:text-gray-900'
                    }`}
                    title="Table View"
                  >
                    <i className="ri-list-check text-base" />
                  </button>
                  <button
                    onClick={() => activeTab === 'postings' ? setJobPostingsViewMode('grid') : setViewMode('grid')}
                    className={`px-3 py-2 text-sm font-medium transition-colors cursor-pointer ${
                      (activeTab === 'postings' ? jobPostingsViewMode : viewMode) === 'grid'
                        ? 'bg-red-600 text-white'
                        : darkMode
                        ? 'bg-gray-800 text-gray-400 hover:text-white'
                        : 'bg-white text-gray-600 hover:text-gray-900'
                    }`}
                    title="Grid View"
                  >
                    <i className="ri-grid-line text-base" />
                  </button>
                </div>
                {selectedItems.length > 0 && (
                  <button onClick={() => setShowDeleteModal(true)} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors cursor-pointer whitespace-nowrap">
                    <i className="ri-delete-bin-line" />
                    Delete ({selectedItems.length})
                  </button>
                )}
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {activeTab === 'postings' ? sortedJobs.length : sortedApplications.length} items
                </span>
              </div>
            </div>

            {/* Table/Grid Content */}
            {activeTab === 'postings' && jobPostingsViewMode === 'grid' ? (
              /* Job Postings Grid View */
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {paginatedJobs.map((job) => (
                    <div
                      key={job.id}
                      className={`relative rounded-lg border overflow-hidden transition-all group cursor-pointer ${
                        darkMode ? 'bg-gray-700 border-gray-600 hover:border-red-600' : 'bg-white border-gray-200 hover:border-red-600'
                      } ${selectedItems.includes(job.id) ? 'ring-2 ring-red-600' : ''}`}
                      onClick={() => openEditModal(job)}
                    >
                      {/* Checkbox */}
                      <div className="absolute top-3 left-3 z-10">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(job.id)}
                          onChange={() => handleSelectItem(job.id)}
                          className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-600 cursor-pointer"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>

                      {/* Status Badge */}
                      <div className="absolute top-3 right-3 z-10">
                        {getStatusBadge(job.status)}
                      </div>

                      {/* Card Content */}
                      <div className="p-6 pt-12">
                        {/* Icon */}
                        <div className="flex justify-center mb-4">
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl ${
                            darkMode ? 'bg-red-600/20 text-red-400' : 'bg-red-50 text-red-600'
                          }`}>
                            <i className="ri-briefcase-line" />
                          </div>
                        </div>

                        {/* Title */}
                        <h4 className={`text-center text-base font-semibold mb-1 line-clamp-2 ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {job.title}
                        </h4>

                        {/* Department */}
                        <p className={`text-center text-xs mb-3 ${
                          darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {job.department}
                        </p>

                        {/* Info Grid */}
                        <div className={`space-y-2 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          <div className="flex items-center gap-2">
                            <i className="ri-map-pin-line flex-shrink-0" />
                            <span className="truncate">{job.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <i className="ri-time-line flex-shrink-0" />
                            <span>{job.type}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <i className="ri-calendar-line flex-shrink-0" />
                            <span>Closes: {formatDate(job.closingDate)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <i className="ri-user-line flex-shrink-0" />
                            <span>{job.applications} applications</span>
                          </div>
                        </div>
                      </div>

                      {/* Hover Overlay with Actions */}
                      <div className={`absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity ${
                        darkMode ? 'bg-gray-900/90' : 'bg-black/80'
                      }`}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditModal(job);
                          }}
                          className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <i className="ri-pencil-line text-lg" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedItems([job.id]);
                            setShowDeleteModal(true);
                          }}
                          className="w-10 h-10 flex items-center justify-center rounded-lg bg-red-600/80 hover:bg-red-600 text-white transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <i className="ri-delete-bin-line text-lg" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredJobs.length === 0 && (
                  <div className="py-16 text-center">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      <i className={`ri-inbox-line text-3xl ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                    </div>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      No job postings found
                    </p>
                  </div>
                )}
              </div>
            ) : activeTab === 'applications' && viewMode === 'grid' ? (
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {paginatedApplications.map((app) => (
                    <div
                      key={app.id}
                      className={`relative rounded-lg border overflow-hidden transition-all group ${
                        darkMode ? 'bg-gray-700 border-gray-600 hover:border-red-600' : 'bg-white border-gray-200 hover:border-red-600'
                      }`}
                      style={app.status === 'New' ? { borderLeft: '4px solid #DC2626' } : undefined}
                      onClick={() => handleViewApplication(app)}
                    >
                      {/* Checkbox */}
                      <div className="absolute top-3 left-3 z-10">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(app.id)}
                          onChange={() => handleSelectItem(app.id)}
                          className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-600 cursor-pointer"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>

                      {/* Status Badge */}
                      <div className="absolute top-3 right-3 z-10">
                        {getStatusBadge(app.status)}
                      </div>

                      {/* Card Content */}
                      <div className="p-6 pt-12 cursor-pointer" onClick={() => handleViewApplication(app)}>
                        {/* Avatar */}
                        <div className="flex justify-center mb-4">
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold ${
                            darkMode ? 'bg-red-600/20 text-red-400' : 'bg-red-50 text-red-600'
                          }`}>
                            {app.fullName.charAt(0)}
                          </div>
                        </div>

                        {/* Name */}
                        <h4 className={`text-center text-base font-semibold mb-1 truncate ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {app.fullName}
                        </h4>

                        {/* Position */}
                        <p className={`text-center text-xs mb-3 truncate ${
                          darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {app.jobTitle}
                        </p>

                        {/* Info Grid */}
                        <div className={`space-y-2 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          <div className="flex items-center gap-2">
                            <i className="ri-mail-line flex-shrink-0" />
                            <span className="truncate">{app.email}</span>
                          </div>
                          {app.phone && (
                            <div className="flex items-center gap-2">
                              <i className="ri-phone-line flex-shrink-0" />
                              <span className="truncate">{app.phone}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <i className="ri-calendar-line flex-shrink-0" />
                            <span>{formatDate(app.appliedDate)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <i className="ri-briefcase-line flex-shrink-0" />
                            <span>{app.experience}</span>
                          </div>
                        </div>
                      </div>

                      {/* Hover Overlay with Actions */}
                      <div className={`absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity ${
                        darkMode ? 'bg-gray-900/90' : 'bg-black/80'
                      }`}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewApplication(app);
                          }}
                          className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                          title="View"
                        >
                          <i className="ri-eye-line text-lg" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReplyClick(app);
                          }}
                          className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                          title="Reply"
                        >
                          <i className="ri-reply-line text-lg" />
                        </button>
                        {app.status !== 'Rejected' && app.status !== 'Hired' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleArchiveApplication(app.id);
                            }}
                            className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                            title="Archive"
                          >
                            <i className="ri-inbox-archive-line text-lg" />
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedItems([app.id]);
                            setShowDeleteModal(true);
                          }}
                          className="w-10 h-10 flex items-center justify-center rounded-lg bg-red-600/80 hover:bg-red-600 text-white transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <i className="ri-delete-bin-line text-lg" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredApplications.length === 0 && (
                  <div className="py-16 text-center">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      <i className={`ri-inbox-line text-3xl ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                    </div>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      No applications found
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                {activeTab === 'postings' ? (
                  <table className="w-full">
                    <thead className={darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}>
                      <tr>
                        <th className="w-12 px-4 py-3">
                          <input 
                            type="checkbox" 
                            checked={selectedItems.length === filteredJobs.length && filteredJobs.length > 0}
                            onChange={handleSelectAll}
                            className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-600 cursor-pointer" 
                          />
                        </th>
                        <th 
                          onClick={() => handleJobSort('title')}
                          className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer transition-colors ${
                            jobSortField === 'title' 
                              ? 'text-red-600' 
                              : darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-700'
                          }`}
                        >
                          <div className="flex items-center">
                            Position
                            {renderSortIcon('title', true)}
                          </div>
                        </th>
                        <th 
                          onClick={() => handleJobSort('department')}
                          className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer transition-colors ${
                            jobSortField === 'department' 
                              ? 'text-red-600' 
                              : darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-700'
                          }`}
                        >
                          <div className="flex items-center">
                            Department
                            {renderSortIcon('department', true)}
                          </div>
                        </th>
                        <th 
                          onClick={() => handleJobSort('type')}
                          className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer transition-colors ${
                            jobSortField === 'type' 
                              ? 'text-red-600' 
                              : darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-700'
                          }`}
                        >
                          <div className="flex items-center">
                            Type
                            {renderSortIcon('type', true)}
                          </div>
                        </th>
                        <th 
                          onClick={() => handleJobSort('postedDate')}
                          className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer transition-colors ${
                            jobSortField === 'postedDate' 
                              ? 'text-red-600' 
                              : darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-700'
                          }`}
                        >
                          <div className="flex items-center">
                            Posted
                            {renderSortIcon('postedDate', true)}
                          </div>
                        </th>
                        <th 
                          onClick={() => handleJobSort('closingDate')}
                          className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer transition-colors ${
                            jobSortField === 'closingDate' 
                              ? 'text-red-600' 
                              : darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-700'
                          }`}
                        >
                          <div className="flex items-center">
                            Closing
                            {renderSortIcon('closingDate', true)}
                          </div>
                        </th>
                        <th 
                          onClick={() => handleJobSort('status')}
                          className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer transition-colors ${
                            jobSortField === 'status' 
                              ? 'text-red-600' 
                              : darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-700'
                          }`}
                        >
                          <div className="flex items-center">
                            Status
                            {renderSortIcon('status', true)}
                          </div>
                        </th>
                        <th 
                          onClick={() => handleJobSort('applications')}
                          className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer transition-colors ${
                            jobSortField === 'applications' 
                              ? 'text-red-600' 
                              : darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-700'
                          }`}
                        >
                          <div className="flex items-center">
                            Applications
                            {renderSortIcon('applications', true)}
                          </div>
                        </th>
                        <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Actions</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                      {paginatedJobs.map((job) => (
                        <tr 
                          key={job.id} 
                          className={`transition-colors cursor-pointer ${darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'}`}
                          onClick={() => openEditModal(job)}
                        >
                          <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                            <input 
                              type="checkbox" 
                              checked={selectedItems.includes(job.id)}
                              onChange={() => handleSelectItem(job.id)}
                              className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-600 cursor-pointer"
                            />
                          </td>
                          <td className="px-4 py-4">
                            <div>
                              <div className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{job.title}</div>
                              <div className={`text-xs mt-0.5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{job.location}</div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`text-sm text-gray-700 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{job.department}</span>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`text-sm text-gray-700 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{job.type}</span>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`text-sm text-gray-700 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{formatDate(job.postedDate)}</span>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`text-sm text-gray-700 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{formatDate(job.closingDate)}</span>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                              job.status === 'Active' ? (darkMode ? 'text-green-400' : 'text-green-700') :
                              job.status === 'Closed' ? (darkMode ? 'text-red-400' : 'text-red-700') :
                              (darkMode ? 'text-gray-400' : 'text-gray-600')
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                job.status === 'Active' ? 'bg-green-500' :
                                job.status === 'Closed' ? 'bg-red-500' :
                                'bg-gray-400'
                              }`}></span>
                              {job.status}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`text-sm font-semibold text-gray-900 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{job.applications}</span>
                          </td>
                          <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center gap-1">
                              <button 
                                onClick={() => openEditModal(job)}
                                className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${darkMode ? 'hover:bg-gray-700 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'}`}
                                title="Edit"
                              >
                                <i className="ri-pencil-line"></i>
                              </button>
                              <button 
                                onClick={() => {
                                  setSelectedItems([job.id]);
                                  setShowDeleteModal(true);
                                }}
                                className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${darkMode ? 'hover:bg-red-600/20 text-gray-400 hover:text-red-400' : 'hover:bg-red-50 text-gray-500 hover:text-red-600'}`}
                                title="Delete"
                              >
                                <i className="ri-delete-bin-line"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <table className="w-full">
                    <thead className={darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}>
                      <tr>
                        <th className="w-12 px-4 py-3">
                          <input type="checkbox" checked={selectedItems.length === filteredApplications.length && filteredApplications.length > 0} onChange={handleSelectAll} className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-600 cursor-pointer" />
                        </th>
                        <th 
                          onClick={() => handleAppSort('fullName')}
                          className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer transition-colors ${
                            appSortField === 'fullName' 
                              ? 'text-red-600' 
                              : darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-700'
                          }`}
                        >
                          <div className="flex items-center">
                            Applicant
                            {renderSortIcon('fullName', false)}
                          </div>
                        </th>
                        <th 
                          onClick={() => handleAppSort('jobTitle')}
                          className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer transition-colors ${
                            appSortField === 'jobTitle' 
                              ? 'text-red-600' 
                              : darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-700'
                          }`}
                        >
                          <div className="flex items-center">
                            Position
                            {renderSortIcon('jobTitle', false)}
                          </div>
                        </th>
                        <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider w-[150px] ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Cover Letter</th>
                        <th 
                          onClick={() => handleAppSort('status')}
                          className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer transition-colors ${
                            appSortField === 'status' 
                              ? 'text-red-600' 
                              : darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-700'
                          }`}
                        >
                          <div className="flex items-center">
                            Status
                            {renderSortIcon('status', false)}
                          </div>
                        </th>
                        <th 
                          onClick={() => handleAppSort('appliedDate')}
                          className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer transition-colors ${
                            appSortField === 'appliedDate' 
                              ? 'text-red-600' 
                              : darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-700'
                          }`}
                        >
                          <div className="flex items-center">
                            Applied
                            {renderSortIcon('appliedDate', false)}
                          </div>
                        </th>
                        <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Actions</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                      {paginatedApplications.map((app) => (
                        <tr 
                          key={app.id} 
                          className={`transition-colors cursor-pointer ${
                            darkMode 
                              ? 'hover:bg-gray-700/50' 
                              : 'hover:bg-gray-50'
                          }`}
                          style={app.status === 'New' ? { borderLeft: '4px solid #DC2626' } : undefined}
                          onClick={() => handleViewApplication(app)}
                        >
                          <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                            <input type="checkbox" checked={selectedItems.includes(app.id)} onChange={() => handleSelectItem(app.id)} className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-600 cursor-pointer" />
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-2xl font-semibold flex-shrink-0 ${
                                darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                              }`}>
                                {app.fullName.charAt(0)}
                              </div>
                              <div>
                                <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'} ${app.status === 'New' ? 'font-semibold' : ''}`}>{app.fullName}</p>
                                <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{app.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${
                              darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                            }`}>
                              {app.jobTitle}
                            </span>
                          </td>
                          <td className="px-4 py-4 w-[150px] max-w-[150px]">
                            <p className={`text-sm truncate ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              {app.coverLetter}
                            </p>
                          </td>
                          <td className="px-4 py-4">
                            {getStatusBadge(app.status)}
                          </td>
                          <td className={`px-4 py-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{formatDate(app.appliedDate)}</td>
                          <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center gap-1">
                              <button onClick={() => handleViewApplication(app)} className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${darkMode ? 'hover:bg-gray-700 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'}`} title="View">
                                <i className="ri-eye-line" />
                              </button>
                              <button onClick={() => handleReplyClick(app)} className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${darkMode ? 'hover:bg-green-600/20 text-gray-400 hover:text-green-400' : 'hover:bg-green-50 text-gray-500 hover:text-green-600'}`} title="Reply">
                                <i className="ri-reply-line" />
                              </button>
                              {app.status !== 'Rejected' && app.status !== 'Hired' && (
                                <button onClick={() => handleArchiveApplication(app.id)} className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${darkMode ? 'hover:bg-gray-700 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'}`} title="Archive">
                                  <i className="ri-inbox-archive-line" />
                                </button>
                              )}
                              <button onClick={() => { setSelectedItems([app.id]); setShowDeleteModal(true); }} className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${darkMode ? 'hover:bg-red-600/20 text-gray-400 hover:text-red-400' : 'hover:bg-red-50 text-gray-500 hover:text-red-600'}`} title="Delete">
                                <i className="ri-delete-bin-line" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {((activeTab === 'postings' && filteredJobs.length === 0) || (activeTab === 'applications' && filteredApplications.length === 0)) && (
                  <div className="py-16 text-center">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      <i className={`ri-inbox-line text-3xl ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                    </div>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      No {activeTab === 'postings' ? 'job postings' : 'applications'} found
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className={`px-6 py-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between`}>
                <div className="flex items-center gap-2">
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Show:</span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-sm cursor-pointer ${
                      darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-200'
                    } border focus:outline-none focus:ring-2 focus:ring-red-600`}
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Showing {startIndex + 1}-{Math.min(endIndex, currentItems.length)} of {currentItems.length}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                      currentPage === 1
                        ? darkMode
                          ? 'bg-gray-700 text-gray-600 cursor-not-allowed'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : darkMode
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <i className="ri-arrow-left-s-line" />
                  </button>

                  {getPageNumbers().map((page, index) =>
                    typeof page === 'number' ? (
                      <button
                        key={index}
                        onClick={() => setCurrentPage(page)}
                        className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                          currentPage === page
                            ? darkMode ? 'bg-red-600 text-white' : 'bg-white text-gray-900 shadow-sm'
                            : darkMode ? 'bg-gray-700 text-gray-400 hover:text-white'
                            : 'bg-gray-100 text-gray-700 hover:text-gray-900'
                        }`}
                      >
                        {page}
                      </button>
                    ) : (
                      <span key={index} className={`w-8 h-8 flex items-center justify-center ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        {page}
                      </span>
                    )
                  )}

                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                      currentPage === totalPages
                        ? darkMode
                          ? 'bg-gray-700 text-gray-600 cursor-not-allowed'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : darkMode
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <i className="ri-arrow-right-s-line" />
                  </button>
                </div>
              </div>
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
              <button onClick={() => { setShowDeleteModal(false); setSelectedItems([]); }} className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                Cancel
              </button>
              <button onClick={handleDelete} className="flex-1 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors cursor-pointer whitespace-nowrap">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Job Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className={`w-full max-w-2xl rounded-xl my-8 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className={`flex items-center justify-between p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Post New Job</h3>
              <button onClick={() => setShowCreateModal(false)} className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}>
                <i className="ri-close-line text-xl" />
              </button>
            </div>
            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Job Title *</label>
                  <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className={`w-full pl-4 py-2.5 rounded-lg text-sm ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent`} placeholder="e.g., Senior Metallurgical Engineer" />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Department *</label>
                  <select value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} className={`w-full px-4 py-2.5 rounded-lg text-sm cursor-pointer ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-red-600`}>
                    <option value="">Select department</option>
                    {departments.filter((d) => d !== 'All').map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Location</label>
                  <input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className={`w-full px-4 py-2.5 rounded-lg text-sm ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-red-600`} placeholder="Lubumbashi, DRC" />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Employment Type *</label>
                  <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className={`w-full px-4 py-2.5 rounded-lg text-sm cursor-pointer ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-red-600`}>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Experience Required *</label>
                  <select value={formData.experience} onChange={(e) => setFormData({ ...formData, experience: e.target.value })} className={`w-full px-4 py-2.5 rounded-lg text-sm cursor-pointer ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-red-600`}>
                    <option value="">Select experience</option>
                    <option value="0-1 years">0-1 years</option>
                    <option value="1-3 years">1-3 years</option>
                    <option value="3-5 years">3-5 years</option>
                    <option value="5-7 years">5-7 years</option>
                    <option value="7-10 years">7-10 years</option>
                    <option value="10+ years">10+ years</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Salary Range</label>
                  <input type="text" value={formData.salary} onChange={(e) => setFormData({ ...formData, salary: e.target.value })} className={`w-full px-4 py-2.5 rounded-lg text-sm ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-red-600`} placeholder="e.g., $3,000 - $4,500/month" />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Closing Date *</label>
                  <input type="date" value={formData.closingDate} onChange={(e) => setFormData({ ...formData, closingDate: e.target.value })} className={`w-full px-4 py-2.5 rounded-lg text-sm ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-red-600`} />
                </div>
                <div className="col-span-2">
                  <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Job Description *</label>
                  <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} maxLength={500} className={`w-full px-4 py-2.5 rounded-lg text-sm resize-none ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent`} placeholder="Describe the role and responsibilities..." />
                </div>
                <div className="col-span-2">
                  <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Requirements (one per line)</label>
                  <textarea value={formData.requirements} onChange={(e) => setFormData({ ...formData, requirements: e.target.value })} rows={4} maxLength={500} className={`w-full px-4 py-2.5 rounded-lg text-sm resize-none ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-red-600`} placeholder="Bachelor's degree in relevant field&#10;5+ years experience&#10;Strong communication skills" />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Status</label>
                  <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className={`w-full px-4 py-2.5 rounded-lg text-sm cursor-pointer ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-red-600`}>
                    <option value="Draft">Draft</option>
                    <option value="Active">Active</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>
            </div>
            <div className={`flex gap-3 p-6 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <button onClick={() => setShowCreateModal(false)} className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                Cancel
              </button>
              <button onClick={handleCreateJob} disabled={!formData.title || !formData.department || !formData.experience || !formData.closingDate || !formData.description} className="flex-1 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed">
                Create Job
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Job Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className={`w-full max-w-2xl rounded-xl my-8 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className={`flex items-center justify-between p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Edit Job Posting</h3>
              <button onClick={() => { setShowEditModal(false); setEditingJob(null); }} className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}>
                <i className="ri-close-line text-xl" />
              </button>
            </div>
            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Job Title *</label>
                  <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className={`w-full px-4 py-2.5 rounded-lg text-sm ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-red-600`} />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Department *</label>
                  <select value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} className={`w-full px-4 py-2.5 rounded-lg text-sm cursor-pointer ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-red-600`}>
                    {departments.filter((d) => d !== 'All').map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Location</label>
                  <input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className={`w-full px-4 py-2.5 rounded-lg text-sm ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-red-600`} />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Employment Type</label>
                  <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className={`w-full px-4 py-2.5 rounded-lg text-sm cursor-pointer ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-red-600`}>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Experience Required</label>
                  <select value={formData.experience} onChange={(e) => setFormData({ ...formData, experience: e.target.value })} className={`w-full px-4 py-2.5 rounded-lg text-sm cursor-pointer ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-red-600`}>
                    <option value="0-1 years">0-1 years</option>
                    <option value="1-3 years">1-3 years</option>
                    <option value="3-5 years">3-5 years</option>
                    <option value="5-7 years">5-7 years</option>
                    <option value="7-10 years">7-10 years</option>
                    <option value="10+ years">10+ years</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Salary Range</label>
                  <input type="text" value={formData.salary} onChange={(e) => setFormData({ ...formData, salary: e.target.value })} className={`w-full px-4 py-2.5 rounded-lg text-sm ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-red-600`} />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Closing Date</label>
                  <input type="date" value={formData.closingDate} onChange={(e) => setFormData({ ...formData, closingDate: e.target.value })} className={`w-full px-4 py-2.5 rounded-lg text-sm ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-red-600`} />
                </div>
                <div className="col-span-2">
                  <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Job Description</label>
                  <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} maxLength={500} className={`w-full px-4 py-2.5 rounded-lg text-sm resize-none ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'}`} />
                </div>
                <div className="col-span-2">
                  <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Requirements (one per line)</label>
                  <textarea value={formData.requirements} onChange={(e) => setFormData({ ...formData, requirements: e.target.value })} rows={4} maxLength={500} className={`w-full px-4 py-2.5 rounded-lg text-sm resize-none ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'}`} />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Status</label>
                  <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className={`w-full px-4 py-2.5 rounded-lg text-sm cursor-pointer ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-red-600`}>
                    <option value="Draft">Draft</option>
                    <option value="Active">Active</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>
            </div>
            <div className={`flex gap-3 p-6 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <button onClick={() => { setShowEditModal(false); setEditingJob(null); }} className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                Cancel
              </button>
              <button onClick={handleEditJob} className="flex-1 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors cursor-pointer whitespace-nowrap">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Application Detail Modal */}
      {showApplicationModal && viewingApplication && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className={`w-full max-w-2xl rounded-xl my-8 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className={`flex items-center justify-between p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div>
                <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Application Details</h3>
                <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{viewingApplication.id}</p>
              </div>
              <button onClick={() => { setShowApplicationModal(false); setViewingApplication(null); }} className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}>
                <i className="ri-close-line text-xl" />
              </button>
            </div>
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              <div className="flex items-start gap-4 mb-6">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold ${darkMode ? 'bg-red-600/20 text-red-400' : 'bg-red-50 text-red-600'}`}>
                  {viewingApplication.fullName.charAt(0)}
                </div>
                <div className="flex-1">
                  <h4 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{viewingApplication.fullName}</h4>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Applied for: {viewingApplication.jobTitle}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <a href={`mailto:${viewingApplication.email}`} className={`text-sm flex items-center gap-1 ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}>
                      <i className="ri-mail-line" />
                      {viewingApplication.email}
                    </a>
                    {viewingApplication.phone && (
                      <a href={`tel:${viewingApplication.phone}`} className={`text-sm flex items-center gap-1 ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}>
                        <i className="ri-phone-line" />
                        {viewingApplication.phone}
                      </a>
                    )}
                  </div>
                  <div className="mt-2">{getStatusBadge(viewingApplication.status)}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <p className={`text-xs font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Experience</p>
                  <p className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{viewingApplication.experience}</p>
                </div>
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <p className={`text-xs font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Current Employer</p>
                  <p className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{viewingApplication.currentEmployer || '-'}</p>
                </div>
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <p className={`text-xs font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Expected Salary</p>
                  <p className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{viewingApplication.expectedSalary || '-'}</p>
                </div>
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <p className={`text-xs font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Notice Period</p>
                  <p className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{viewingApplication.noticePeriod || '-'}</p>
                </div>
              </div>

              {viewingApplication.coverLetter && (
                <div className="mb-6">
                  <h5 className={`text-sm font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Cover Letter</h5>
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                    <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{viewingApplication.coverLetter}</p>
                  </div>
                </div>
              )}

              <div>
                <h5 className={`text-sm font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Attached Documents</h5>
                <div className="space-y-2">
                  {viewingApplication.documents.map((doc, index) => (
                    <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded flex items-center justify-center ${darkMode ? 'bg-red-600/20' : 'bg-red-50'}`}>
                          <i className={`ri-file-pdf-line ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
                        </div>
                        <span className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{doc}</span>
                      </div>
                      <button className={`text-sm font-medium cursor-pointer ${darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-700'}`}>
                        <i className="ri-download-line mr-1" />
                        Download
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className={`flex gap-3 p-6 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <select value={viewingApplication.status} onChange={(e) => { updateApplicationStatus(viewingApplication.id, e.target.value as JobApplication['status']); setViewingApplication({ ...viewingApplication, status: e.target.value as JobApplication['status'] }); }} className={`flex-1 px-4 py-2.5 rounded-lg text-sm cursor-pointer ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-700 border-gray-200'} border focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent`}>
                <option value="New">New</option>
                <option value="Reviewed">Reviewed</option>
                <option value="Shortlisted">Shortlisted</option>
                <option value="Rejected">Rejected</option>
                <option value="Hired">Hired</option>
              </select>
              <button
                onClick={() => {
                  setShowApplicationModal(false);
                  handleReplyClick(viewingApplication);
                }}
                className="px-5 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors cursor-pointer whitespace-nowrap"
              >
                <i className="ri-reply-line mr-1" />
                Reply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reply Modal */}
      {showReplyModal && viewingApplication && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowReplyModal(false)} />
          <div className={`relative w-full max-w-xl rounded-xl shadow-xl overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className={`px-6 py-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between`}>
              <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'Merriweather, serif' }}>
                Reply to {viewingApplication.fullName}
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
                <p className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{viewingApplication.email}</p>
              </div>
              <div className={`rounded-lg p-3 mb-4 ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                <p className={`text-xs font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Position Applied:</p>
                <p className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{viewingApplication.jobTitle}</p>
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

export default JobsManagement;