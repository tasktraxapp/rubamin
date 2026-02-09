import { useState } from 'react';

interface UserJobsManagementProps {
  darkMode: boolean;
}

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

export default function UserJobsManagement({ darkMode }: UserJobsManagementProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'postings' | 'applications' | 'notifications'>('postings');
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
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const [jobSortField, setJobSortField] = useState<JobSortField>('postedDate');
  const [jobSortDirection, setJobSortDirection] = useState<SortDirection>('desc');
  const [appSortField, setAppSortField] = useState<ApplicationSortField>('appliedDate');
  const [appSortDirection, setAppSortDirection] = useState<SortDirection>('desc');

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

  // Notification settings state
  const [notifSettings, setNotifSettings] = useState({
    enableEmailNotifications: true,
    newApplicationAlert: true,
    applicationStatusChange: true,
    dailyDigest: false,
    weeklyReport: true,
    shortlistAlert: true,
    closingDateReminder: true,
    bulkApplicationAlert: true,
    bulkThreshold: 5,
    frequency: 'instant' as 'instant' | 'hourly' | 'daily',
    recipients: [
      { email: 'hr.manager@rubamin.com', name: 'HR Manager', enabled: true },
      { email: 'ops.manager@rubamin.com', name: 'Operations Manager', enabled: true },
      { email: 'recruitment@rubamin.com', name: 'Recruitment Team', enabled: false },
    ],
    quietHoursEnabled: false,
    quietHoursStart: '22:00',
    quietHoursEnd: '07:00',
  });
  const [showAddRecipientModal, setShowAddRecipientModal] = useState(false);
  const [newRecipientEmail, setNewRecipientEmail] = useState('');
  const [newRecipientName, setNewRecipientName] = useState('');
  const [notifSaved, setNotifSaved] = useState(false);

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
      requirements: ["Bachelor's degree in Metallurgical Engineering", '5+ years experience', 'Strong analytical skills'],
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
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'All' || job.status === filterStatus;
    const matchesDepartment = filterDepartment === 'All' || job.department === filterDepartment;
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'All' || app.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

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
    setSelectedItems((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
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
    await new Promise((resolve) => setTimeout(resolve, 1500));
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
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${
          styles[status] ||
          (darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-100 text-gray-600')
        }`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${dots[status] || 'bg-gray-400'}`} />
        {status}
      </span>
    );
  };

  const newApplicationsCount = applications.filter((a) => a.status === 'New').length;

  const renderSortIcon = (field: JobSortField | ApplicationSortField, isJobTable: boolean) => {
    const isActive = isJobTable ? jobSortField === field : appSortField === field;
    const direction = isJobTable ? jobSortDirection : appSortDirection;
    return (
      <i
        className={`ml-1 ${
          isActive
            ? direction === 'asc'
              ? 'ri-arrow-up-line'
              : 'ri-arrow-down-line'
            : 'ri-arrow-up-down-line opacity-40'
        }`}
      />
    );
  };

  const handleSaveNotifSettings = () => {
    setNotifSaved(true);
    showToastMessage('Notification settings saved successfully');
    setTimeout(() => setNotifSaved(false), 2000);
  };

  const handleAddRecipient = () => {
    if (!newRecipientEmail.trim() || !newRecipientName.trim()) return;
    setNotifSettings((prev) => ({
      ...prev,
      recipients: [
        ...prev.recipients,
        { email: newRecipientEmail.trim(), name: newRecipientName.trim(), enabled: true },
      ],
    }));
    setNewRecipientEmail('');
    setNewRecipientName('');
    setShowAddRecipientModal(false);
    showToastMessage('Recipient added successfully');
  };

  const handleRemoveRecipient = (index: number) => {
    setNotifSettings((prev) => ({
      ...prev,
      recipients: prev.recipients.filter((_, i) => i !== index),
    }));
  };

  const toggleRecipient = (index: number) => {
    setNotifSettings((prev) => ({
      ...prev,
      recipients: prev.recipients.map((r, i) =>
        i === index ? { ...r, enabled: !r.enabled } : r
      ),
    }));
  };

  const stats = [
    { label: 'Active Jobs', value: jobPostings.filter((j) => j.status === 'Active').length, icon: 'ri-briefcase-line', color: 'green' },
    { label: 'Total Applications', value: applications.length, icon: 'ri-file-user-line', color: 'blue' },
    { label: 'New Applications', value: applications.filter((a) => a.status === 'New').length, icon: 'ri-notification-badge-line', color: 'red' },
    { label: 'Hired This Month', value: applications.filter((a) => a.status === 'Hired').length, icon: 'ri-user-star-line', color: 'yellow' },
  ];

  const renderToggle = (enabled: boolean, onToggle: () => void) => (
    <button
      onClick={onToggle}
      className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer flex-shrink-0 ${
        enabled ? 'bg-red-600' : darkMode ? 'bg-gray-600' : 'bg-gray-300'
      }`}
    >
      <span
        className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
          enabled ? 'translate-x-5' : 'translate-x-0.5'
        }`}
      />
    </button>
  );

  const renderNotificationSettings = () => (
    <div className="p-6 space-y-8">
      {/* Master Toggle */}
      <div
        className={`flex items-center justify-between p-5 rounded-lg border ${
          darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'
        }`}
      >
        <div className="flex items-center gap-4">
          <div
            className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              darkMode ? 'bg-red-600/20' : 'bg-red-50'
            }`}
          >
            <i className={`ri-mail-settings-line text-xl ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
          </div>
          <div>
            <h3 className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Email Notifications</h3>
            <p className={`text-xs mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Receive email alerts for job application activities</p>
          </div>
        </div>
        <button
          onClick={() =>
            setNotifSettings((prev) => ({
              ...prev,
              enableEmailNotifications: !prev.enableEmailNotifications,
            }))
          }
          className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer ${
            notifSettings.enableEmailNotifications ? 'bg-red-600' : darkMode ? 'bg-gray-600' : 'bg-gray-300'
          }`}
        >
          <span
            className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
              notifSettings.enableEmailNotifications ? 'translate-x-6' : 'translate-x-0.5'
            }`}
          />
        </button>
      </div>

      {notifSettings.enableEmailNotifications && (
        <>
          {/* Alert Types */}
          <div>
            <h4
              className={`text-sm font-semibold mb-4 flex items-center gap-2 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}
            >
              <i className="ri-notification-3-line" /> Alert Types
            </h4>
            <div
              className={`rounded-lg border divide-y ${
                darkMode
                  ? 'bg-gray-800 border-gray-700 divide-gray-700'
                  : 'bg-white border-gray-200 divide-gray-100'
              }`}
            >
              {[
                {
                  key: 'newApplicationAlert',
                  icon: 'ri-user-add-line',
                  label: 'New Application Received',
                  desc: 'Get notified when someone applies to your job postings',
                  color: 'green',
                },
                {
                  key: 'applicationStatusChange',
                  icon: 'ri-exchange-line',
                  label: 'Application Status Changes',
                  desc: 'Alerts when application status is updated (reviewed, shortlisted, etc.)',
                  color: 'yellow',
                },
                {
                  key: 'shortlistAlert',
                  icon: 'ri-star-line',
                  label: 'Shortlist Notifications',
                  desc: 'Notify when an applicant is shortlisted or hired',
                  color: 'red',
                },
                {
                  key: 'closingDateReminder',
                  icon: 'ri-calendar-event-line',
                  label: 'Closing Date Reminders',
                  desc: 'Reminder 3 days before a job posting closes',
                  color: 'orange',
                },
                {
                  key: 'bulkApplicationAlert',
                  icon: 'ri-group-line',
                  label: 'Bulk Application Alert',
                  desc: `Notify when a job receives ${notifSettings.bulkThreshold}+ applications in a day`,
                  color: 'teal',
                },
              ].map((item) => {
                const colorMap: Record<string, { bg: string; text: string }> = {
                  green: { bg: darkMode ? 'bg-green-500/15' : 'bg-green-50', text: darkMode ? 'text-green-400' : 'text-green-600' },
                  yellow: { bg: darkMode ? 'bg-yellow-500/15' : 'bg-yellow-50', text: darkMode ? 'text-yellow-400' : 'text-yellow-600' },
                  red: { bg: darkMode ? 'bg-red-500/15' : 'bg-red-50', text: darkMode ? 'text-red-400' : 'text-red-600' },
                  orange: { bg: darkMode ? 'bg-orange-500/15' : 'bg-orange-50', text: darkMode ? 'text-orange-400' : 'text-orange-600' },
                  teal: { bg: darkMode ? 'bg-teal-500/15' : 'bg-teal-50', text: darkMode ? 'text-teal-400' : 'text-teal-600' },
                };
                const c = colorMap[item.color] || colorMap.teal;
                return (
                  <div
                    key={item.key}
                    className={`flex items-center justify-between px-5 py-4 transition-colors ${
                      darkMode ? 'hover:bg-gray-700/30' : 'hover:bg-gray-50/50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${c.bg}`}>
                        <i className={`${item.icon} text-base ${c.text}`} />
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{item.label}</p>
                        <p className={`text-xs mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{item.desc}</p>
                      </div>
                    </div>
                    {renderToggle(
                      (notifSettings as any)[item.key],
                      () =>
                        setNotifSettings((prev) => ({
                          ...prev,
                          [item.key]: !(prev as any)[item.key],
                        }))
                    )}
                  </div>
                );
              })}
              {notifSettings.bulkApplicationAlert && (
                <div className={`px-5 py-4 ${darkMode ? 'bg-gray-700/20' : 'bg-gray-50/50'}`}>
                  <div className="flex items-center gap-3 pl-13">
                    <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Threshold:</span>
                    <select
                      value={notifSettings.bulkThreshold}
                      onChange={(e) =>
                        setNotifSettings((prev) => ({
                          ...prev,
                          bulkThreshold: parseInt(e.target.value),
                        }))
                      }
                      className={`px-3 py-1.5 rounded-md text-xs cursor-pointer ${
                        darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-200'
                      } border focus:outline-none focus:ring-2 focus:ring-red-600`}
                    >
                      {[3, 5, 10, 15, 20, 25].map((n) => (
                        <option key={n} value={n}>
                          {n} applications/day
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Summary Reports */}
          <div>
            <h4
              className={`text-sm font-semibold mb-4 flex items-center gap-2 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}
            >
              <i className="ri-bar-chart-2-line" /> Summary Reports
            </h4>
            <div
              className={`rounded-lg border divide-y ${
                darkMode ? 'bg-gray-800 border-gray-700 divide-gray-700' : 'bg-white border-gray-200 divide-gray-100'
              }`}
            >
              {[
                {
                  key: 'dailyDigest',
                  icon: 'ri-sun-line',
                  label: 'Daily Digest',
                  desc: 'Receive a daily summary of all application activities at 8:00 AM',
                },
                {
                  key: 'weeklyReport',
                  icon: 'ri-calendar-line',
                  label: 'Weekly Report',
                  desc: 'Get a comprehensive weekly recruitment report every Monday',
                },
              ].map((item) => (
                <div
                  key={item.key}
                  className={`flex items-center justify-between px-5 py-4 transition-colors ${
                    darkMode ? 'hover:bg-gray-700/30' : 'hover:bg-gray-50/50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                        darkMode ? 'bg-gray-700' : 'bg-gray-100'
                      }`}
                    >
                      <i className={`${item.icon} text-base ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{item.label}</p>
                      <p className={`text-xs mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{item.desc}</p>
                    </div>
                  </div>
                  {renderToggle(
                    (notifSettings as any)[item.key],
                    () =>
                      setNotifSettings((prev) => ({
                        ...prev,
                        [item.key]: !(prev as any)[item.key],
                      }))
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Frequency */}
          <div>
            <h4
              className={`text-sm font-semibold mb-4 flex items-center gap-2 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}
            >
              <i className="ri-time-line" /> Delivery Frequency
            </h4>
            <div
              className={`rounded-lg border p-5 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
            >
              <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                  { value: 'instant', label: 'Instant', desc: 'Real-time alerts', icon: 'ri-flashlight-line' },
                  { value: 'hourly', label: 'Hourly', desc: 'Batched every hour', icon: 'ri-timer-line' },
                  { value: 'daily', label: 'Daily', desc: 'Once per day at 8 AM', icon: 'ri-calendar-check-line' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() =>
                      setNotifSettings((prev) => ({
                        ...prev,
                        frequency: opt.value as any,
                      }))
                    }
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
                      <span
                        className={`text-sm font-semibold ${
                          notifSettings.frequency === opt.value
                            ? darkMode
                              ? 'text-red-400'
                              : 'text-red-600'
                            : darkMode
                            ? 'text-white'
                            : 'text-gray-900'
                        }`}
                      >
                        {opt.label}
                      </span>
                    </div>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{opt.desc}</p>
                  </button>
                ))}
              </div>
              <div
                className={`flex items-center justify-between pt-4 border-t ${
                  darkMode ? 'border-gray-700' : 'border-gray-200'
                }`}
              >
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
                        onChange={(e) =>
                          setNotifSettings((prev) => ({
                            ...prev,
                            quietHoursStart: e.target.value,
                          }))
                        }
                        className={`px-2 py-1 rounded-md text-xs ${
                          darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-200'
                        } border focus:outline-none focus:ring-1 focus:ring-red-600`}
                      />
                      <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>to</span>
                      <input
                        type="time"
                        value={notifSettings.quietHoursEnd}
                        onChange={(e) =>
                          setNotifSettings((prev) => ({
                            ...prev,
                            quietHoursEnd: e.target.value,
                          }))
                        }
                        className={`px-2 py-1 rounded-md text-xs ${
                          darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-200'
                        } border focus:outline-none focus:ring-1 focus:ring-red-600`}
                      />
                    </div>
                  )}
                  {renderToggle(notifSettings.quietHoursEnabled, () =>
                    setNotifSettings((prev) => ({
                      ...prev,
                      quietHoursEnabled: !prev.quietHoursEnabled,
                    }))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Email Recipients */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4
                className={`text-sm font-semibold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}
              >
                <i className="ri-group-line" /> Email Recipients
              </h4>
              <button
                onClick={() => setShowAddRecipientModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors cursor-pointer whitespace-nowrap"
              >
                <i className="ri-add-line" /> Add Recipient
              </button>
            </div>
            <div
              className={`rounded-lg border divide-y ${
                darkMode ? 'bg-gray-800 border-gray-700 divide-gray-700' : 'bg-white border-gray-200 divide-gray-100'
              }`}
            >
              {notifSettings.recipients.map((recipient, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between px-5 py-4 transition-colors ${
                    darkMode ? 'hover:bg-gray-700/30' : 'hover:bg-gray-50/50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-9 h-9 rounded flex items-center justify-center text-sm font-semibold flex-shrink-0 ${
                        recipient.enabled
                          ? darkMode
                            ? 'bg-red-600/20 text-red-400'
                            : 'bg-red-50 text-red-600'
                          : darkMode
                          ? 'bg-gray-700 text-gray-500'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {recipient.name.charAt(0)}
                    </div>
                    <div>
                      <p
                        className={`text-sm font-medium ${
                          recipient.enabled
                            ? darkMode
                              ? 'text-white'
                              : 'text-gray-900'
                            : darkMode
                            ? 'text-gray-500'
                            : 'text-gray-400'
                        }`}
                      >
                        {recipient.name}
                      </p>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{recipient.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {renderToggle(recipient.enabled, () => toggleRecipient(index))}
                    <button
                      onClick={() => handleRemoveRecipient(index)}
                      className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                        darkMode ? 'hover:bg-red-600/20 text-gray-500 hover:text-red-400' : 'hover:bg-red-50 text-gray-400 hover:text-red-600'
                      }`}
                      title="Remove"
                    >
                      <i className="ri-delete-bin-line text-sm" />
                    </button>
                  </div>
                </div>
              ))}
              {notifSettings.recipients.length === 0 && (
                <div className="py-10 text-center">
                  <div
                    className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${
                      darkMode ? 'bg-gray-700' : 'bg-gray-100'
                    }`}
                  >
                    <i className={`ri-mail-add-line text-xl ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                  </div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No recipients added yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Save Button */}
          <div
            className={`flex items-center justify-between pt-6 border-t ${
              darkMode ? 'border-gray-700' : 'border-gray-200'
            }`}
          >
            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              <i className="ri-information-line mr-1" />Changes will take effect immediately after saving
            </p>
            <button
              onClick={handleSaveNotifSettings}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
                notifSaved ? 'bg-green-600 text-white' : 'bg-red-600 text-white hover:bg-red-700'
              }`}
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
            Jobs Management
          </h2>
          <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Manage job postings and review applications
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowCreateModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white hover:bg-red-700 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap self-start sm:self-auto"
        >
          <i className="ri-add-line text-lg" />
          Post New Job
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className={`p-5 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{stat.label}</p>
                <p className={`text-2xl font-bold mt-1 ${darkMode ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'Merriweather, serif' }}>{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                stat.color === 'green' ? (darkMode ? 'bg-green-500/20' : 'bg-green-50') :
                stat.color === 'blue' ? (darkMode ? 'bg-blue-500/20' : 'bg-blue-50') :
                stat.color === 'red' ? (darkMode ? 'bg-red-600/20' : 'bg-red-50') :
                (darkMode ? 'bg-yellow-500/20' : 'bg-yellow-50')
              }`}>
                <i className={`${stat.icon} text-xl ${
                  stat.color === 'green' ? (darkMode ? 'text-green-400' : 'text-green-600') :
                  stat.color === 'blue' ? (darkMode ? 'text-blue-400' : 'text-blue-600') :
                  stat.color === 'red' ? (darkMode ? 'text-red-400' : 'text-red-600') :
                  (darkMode ? 'text-yellow-400' : 'text-yellow-600')
                }`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className={`rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        {/* Tabs */}
        <div className={`px-4 pt-3 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} overflow-x-auto`}>
          <div className="flex items-center gap-1 min-w-max">
            <button
              onClick={() => {
                setActiveTab('postings');
                setSelectedItems([]);
                setFilterStatus('All');
                setCurrentPage(1);
              }}
              className={`px-4 py-2.5 text-sm font-medium rounded-t-lg transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'postings'
                  ? darkMode
                    ? 'bg-gray-700 text-white border border-b-0 border-gray-600'
                    : 'bg-white text-gray-900 border border-b-0 border-gray-200 shadow-sm'
                  : darkMode
                  ? 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <i className="ri-file-edit-line mr-1.5" />
              Job Postings
              <span
                className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
                  activeTab === 'postings'
                    ? darkMode
                      ? 'bg-red-600/20 text-red-400'
                      : 'bg-red-50 text-red-600'
                    : darkMode
                    ? 'bg-gray-600 text-gray-400'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                {jobPostings.length}
              </span>
            </button>
            <button
              onClick={() => {
                setActiveTab('applications');
                setSelectedItems([]);
                setFilterStatus('All');
                setCurrentPage(1);
              }}
              className={`px-4 py-2.5 text-sm font-medium rounded-t-lg transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'applications'
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
              {newApplicationsCount > 0 && (
                <span className="ml-2 min-w-5 h-5 inline-flex items-center justify-center px-1.5 text-xs font-bold rounded-full bg-red-600 text-white">
                  {newApplicationsCount}
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

        {activeTab === 'notifications' ? renderNotificationSettings() : (
          <>
            {/* Filters */}
            <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex flex-col sm:flex-row sm:items-center justify-between gap-3`}>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="relative">
                  <i className={`ri-search-line absolute left-3 top-1/2 -translate-y-1/2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className={`w-full sm:w-64 pl-10 pr-4 py-2 rounded-lg border text-sm ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500'} focus:outline-none focus:ring-2 focus:ring-red-600`}
                  />
                </div>
                <div className="flex items-center gap-3">
                  {activeTab === 'postings' && (
                    <select
                      value={filterDepartment}
                      onChange={(e) => {
                        setFilterDepartment(e.target.value);
                        setCurrentPage(1);
                      }}
                      className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm cursor-pointer ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-200'} border focus:outline-none focus:ring-2 focus:ring-red-600`}
                    >
                      {departments.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept === 'All' ? 'All Departments' : dept}
                        </option>
                      ))}
                    </select>
                  )}
                  <select
                    value={filterStatus}
                    onChange={(e) => {
                      setFilterStatus(e.target.value);
                      setCurrentPage(1);
                    }}
                    className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm cursor-pointer ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-200'} border focus:outline-none focus:ring-2 focus:ring-red-600`}
                  >
                    {(activeTab === 'postings' ? jobStatusOptions : applicationStatusOptions).map((status) => (
                      <option key={status} value={status}>
                        {status === 'All' ? 'All Status' : status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-3 self-end sm:self-auto">
                {selectedItems.length > 0 && (
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <i className="ri-delete-bin-line" />
                    Delete ({selectedItems.length})
                  </button>
                )}
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {activeTab === 'postings' ? sortedJobs.length : sortedApplications.length} items
                </span>
              </div>
            </div>

            {/* Table Content */}
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
                      {(['title', 'department', 'type', 'closingDate', 'status', 'applications'] as JobSortField[]).map((field) => {
                        const labels: Record<string, string> = { title: 'Position', department: 'Department', type: 'Type', closingDate: 'Closing', status: 'Status', applications: 'Apps' };
                        return (
                          <th
                            key={field}
                            onClick={() => handleJobSort(field)}
                            className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer transition-colors ${
                              jobSortField === field ? 'text-red-600' : darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-700'
                            }`}
                          >
                            <div className="flex items-center">
                              {labels[field]}
                              {renderSortIcon(field, true)}
                            </div>
                          </th>
                        );
                      })}
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
                        <td className={`px-4 py-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{job.department}</td>
                        <td className={`px-4 py-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{job.type}</td>
                        <td className={`px-4 py-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{formatDate(job.closingDate)}</td>
                        <td className="px-4 py-4">{getStatusBadge(job.status)}</td>
                        <td className={`px-4 py-4 text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{job.applications}</td>
                        <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => openEditModal(job)}
                              className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                                darkMode ? 'hover:bg-gray-700 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                              }`}
                              title="Edit"
                            >
                              <i className="ri-pencil-line" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedItems([job.id]);
                                setShowDeleteModal(true);
                              }}
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
              ) : (
                <table className="w-full">
                  <thead className={darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}>
                    <tr>
                      <th className="w-12 px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedItems.length === filteredApplications.length && filteredApplications.length > 0}
                          onChange={handleSelectAll}
                          className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-600 cursor-pointer"
                        />
                      </th>
                      <th
                        onClick={() => handleAppSort('fullName')}
                        className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer transition-colors ${
                          appSortField === 'fullName' ? 'text-red-600' : darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-700'
                        }`}
                      >
                        <div className="flex items-center">
                          Applicant{renderSortIcon('fullName', false)}
                        </div>
                      </th>
                      <th
                        onClick={() => handleAppSort('jobTitle')}
                        className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer transition-colors ${
                          appSortField === 'jobTitle' ? 'text-red-600' : darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-700'
                        }`}
                      >
                        <div className="flex items-center">
                          Position{renderSortIcon('jobTitle', false)}
                        </div>
                      </th>
                      <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Cover Letter</th>
                      <th
                        onClick={() => handleAppSort('status')}
                        className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer transition-colors ${
                          appSortField === 'status' ? 'text-red-600' : darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-700'
                        }`}
                      >
                        <div className="flex items-center">
                          Status{renderSortIcon('status', false)}
                        </div>
                      </th>
                      <th
                        onClick={() => handleAppSort('appliedDate')}
                        className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer transition-colors ${
                          appSortField === 'appliedDate' ? 'text-red-600' : darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-700'
                        }`}
                      >
                        <div className="flex items-center">
                          Applied{renderSortIcon('appliedDate', false)}
                        </div>
                      </th>
                      <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                    {paginatedApplications.map((app) => (
                      <tr
                        key={app.id}
                        className={`transition-colors cursor-pointer ${darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'}`}
                        style={app.status === 'New' ? { borderLeft: '4px solid #DC2626' } : undefined}
                        onClick={() => handleViewApplication(app)}
                      >
                        <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(app.id)}
                            onChange={() => handleSelectItem(app.id)}
                            className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-600 cursor-pointer"
                          />
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 ${
                                darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {app.fullName.charAt(0)}
                            </div>
                            <div>
                              <p
                                className={`text-sm font-medium ${
                                  darkMode ? 'text-white' : 'text-gray-900'
                                } ${app.status === 'New' ? 'font-semibold' : ''}`}
                              >
                                {app.fullName}
                              </p>
                              <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{app.email}</p>

                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${
                              darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {app.jobTitle}
                          </span>
                        </td>
                        <td className="px-4 py-4 max-w-[150px]">
                          <p className={`text-sm truncate ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{app.coverLetter}</p>
                        </td>
                        <td className="px-4 py-4">{getStatusBadge(app.status)}</td>
                        <td className={`px-4 py-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{formatDate(app.appliedDate)}</td>
                        <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleViewApplication(app)}
                              className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                                darkMode ? 'hover:bg-gray-700 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                              }`}
                              title="View"
                            >
                              <i className="ri-eye-line" />
                            </button>
                            <button
                              onClick={() => handleReplyClick(app)}
                              className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                                darkMode ? 'hover:bg-green-600/20 text-gray-400 hover:text-green-400' : 'hover:bg-green-50 text-gray-500 hover:text-green-600'
                              }`}
                              title="Reply"
                            >
                              <i className="ri-reply-line" />
                            </button>
                            {app.status !== 'Rejected' && app.status !== 'Hired' && (
                              <button
                                onClick={() => handleArchiveApplication(app.id)}
                                className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                                  darkMode ? 'hover:bg-gray-700 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                                }`}
                                title="Archive"
                              >
                                <i className="ri-inbox-archive-line" />
                              </button>
                            )}
                            <button
                              onClick={() => {
                                setSelectedItems([app.id]);
                                setShowDeleteModal(true);
                              }}
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className={`px-4 sm:px-6 py-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex flex-col sm:flex-row items-center justify-between gap-3`}>
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Showing {startIndex + 1}-{Math.min(endIndex, currentItems.length)} of {currentItems.length}
                </span>
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
                          currentPage === page ? 'bg-red-600 text-white' : darkMode ? 'bg-gray-700 text-gray-400 hover:text-white' : 'bg-gray-100 text-gray-700 hover:text-gray-900'
                        }`}
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
          </>
        )}
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-md rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-red-100">
              <i className="ri-delete-bin-line text-2xl text-red-600" />
            </div>
            <h3 className={`text-xl font-bold text-center mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Delete {selectedItems.length} item(s)?</h3>
            <p className={`text-sm text-center mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedItems([]);
                }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
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
              <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'Merriweather, serif' }}>Post New Job</h3>
              <button onClick={() => setShowCreateModal(false)} className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}><i className="ri-close-line text-xl" /></button>
            </div>
            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Job Title *</label>
                  <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className={`w-full px-4 py-2.5 rounded-lg text-sm ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent`} placeholder="e.g., Senior Metallurgical Engineer" />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Department *</label>
                  <select value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} className={`w-full px-4 py-2.5 rounded-lg text-sm cursor-pointer ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-red-600`}>
                    <option value="">Select department</option>
                    {departments.filter((d) => d !== 'All').map((dept) => (<option key={dept} value={dept}>{dept}</option>))}
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Location</label>
                  <input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className={`w-full px-4 py-2.5 rounded-lg text-sm ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-red-600`} placeholder="Lubumbashi, DRC" />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Employment Type *</label>
                  <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className={`w-full px-4 py-2.5 rounded-lg text-sm cursor-pointer ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-red-600`}>
                    <option value="Full-time">Full-time</option><option value="Part-time">Part-time</option><option value="Contract">Contract</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Experience Required *</label>
                  <select value={formData.experience} onChange={(e) => setFormData({ ...formData, experience: e.target.value })} className={`w-full px-4 py-2.5 rounded-lg text-sm cursor-pointer ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-red-600`}>
                    <option value="">Select experience</option><option value="0-1 years">0-1 years</option><option value="1-3 years">1-3 years</option><option value="3-5 years">3-5 years</option><option value="5-7 years">5-7 years</option><option value="7-10 years">7-10 years</option><option value="10+ years">10+ years</option>
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
                  <textarea value={formData.requirements} onChange={(e) => setFormData({ ...formData, requirements: e.target.value })} rows={4} maxLength={500} className={`w-full px-4 py-2.5 rounded-lg text-sm resize-none ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-red-600`} placeholder={"Bachelor's degree in relevant field\n5+ years experience\nStrong communication skills"} />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Status</label>
                  <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className={`w-full px-4 py-2.5 rounded-lg text-sm cursor-pointer ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-red-600`}>
                    <option value="Draft">Draft</option><option value="Active">Active</option><option value="Closed">Closed</option>
                  </select>
                </div>
              </div>
            </div>
            <div className={`flex gap-3 p-6 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <button onClick={() => setShowCreateModal(false)} className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>Cancel</button>
              <button onClick={handleCreateJob} disabled={!formData.title || !formData.department || !formData.experience || !formData.closingDate || !formData.description} className="flex-1 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed">Create Job</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Job Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className={`w-full max-w-2xl rounded-xl my-8 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className={`flex items-center justify-between p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'Merriweather, serif' }}>Edit Job Posting</h3>
              <button onClick={() => { setShowEditModal(false); setEditingJob(null); }} className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}><i className="ri-close-line text-xl" /></button>
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
                    {departments.filter((d) => d !== 'All').map((dept) => (<option key={dept} value={dept}>{dept}</option>))}
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Location</label>
                  <input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className={`w-full px-4 py-2.5 rounded-lg text-sm ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-red-600`} />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Employment Type</label>
                  <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className={`w-full px-4 py-2.5 rounded-lg text-sm cursor-pointer ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-red-600`}>
                    <option value="Full-time">Full-time</option><option value="Part-time">Part-time</option><option value="Contract">Contract</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Experience Required</label>
                  <select value={formData.experience} onChange={(e) => setFormData({ ...formData, experience: e.target.value })} className={`w-full px-4 py-2.5 rounded-lg text-sm cursor-pointer ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-red-600`}>
                    <option value="0-1 years">0-1 years</option><option value="1-3 years">1-3 years</option><option value="3-5 years">3-5 years</option><option value="5-7 years">5-7 years</option><option value="7-10 years">7-10 years</option><option value="10+ years">10+ years</option>
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
                  <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} maxLength={500} className={`w-full px-4 py-2.5 rounded-lg text-sm resize-none ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'} border focus:outline-none focus:ring-2 focus:ring-red-600`} />
                </div>
                <div className="col-span-2">
                  <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Requirements (one per line)</label>
                  <textarea value={formData.requirements} onChange={(e) => setFormData({ ...formData, requirements: e.target.value })} rows={4} maxLength={500} className={`w-full px-4 py-2.5 rounded-lg text-sm resize-none ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'} border focus:outline-none focus:ring-2 focus:ring-red-600`} />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Status</label>
                  <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className={`w-full px-4 py-2.5 rounded-lg text-sm cursor-pointer ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-red-600`}>
                    <option value="Draft">Draft</option><option value="Active">Active</option><option value="Closed">Closed</option>
                  </select>
                </div>
              </div>
            </div>
            <div className={`flex gap-3 p-6 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <button onClick={() => { setShowEditModal(false); setEditingJob(null); }} className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>Cancel</button>
              <button onClick={handleEditJob} className="flex-1 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors cursor-pointer whitespace-nowrap">Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}