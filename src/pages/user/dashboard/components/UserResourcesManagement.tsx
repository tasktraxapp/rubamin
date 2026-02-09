
import { useState } from 'react';

interface UserResourcesManagementProps {
  darkMode: boolean;
}

interface Resource {
  id: string;
  title: string;
  category: string;
  date: string;
  size: string;
  downloads: number;
  status: 'Published' | 'Draft' | 'Archived';
  description: string;
}

interface DownloadRequest {
  id: string;
  requesterName: string;
  company: string;
  email: string;
  phone: string;
  resourceId: string;
  resourceTitle: string;
  resourceCategory: string;
  purpose: string;
  status: 'new' | 'reviewed' | 'approved' | 'rejected' | 'archived';
  requestedAt: string;
  repliedAt?: string;
}

type ResourceSortField = 'title' | 'category' | 'status' | 'date' | 'size' | 'downloads';
type RequestSortField = 'requesterName' | 'resourceTitle' | 'status' | 'requestedAt';
type SortDirection = 'asc' | 'desc';

export default function UserResourcesManagement({ darkMode }: UserResourcesManagementProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'resources' | 'requests' | 'notifications'>('resources');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [viewingRequest, setViewingRequest] = useState<DownloadRequest | null>(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const [resourceSortField, setResourceSortField] = useState<ResourceSortField>('date');
  const [resourceSortDirection, setResourceSortDirection] = useState<SortDirection>('desc');
  const [requestSortField, setRequestSortField] = useState<RequestSortField>('requestedAt');
  const [requestSortDirection, setRequestSortDirection] = useState<SortDirection>('desc');

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    status: 'Draft',
    file: null as File | null,
  });

  // Notification settings state
  const [notifSettings, setNotifSettings] = useState({
    enableEmailNotifications: true,
    newDownloadRequest: true,
    requestStatusChange: true,
    dailyDigest: false,
    weeklyReport: true,
    resourceDownloaded: true,
    lowStorageAlert: true,
    bulkRequestAlert: true,
    bulkThreshold: 5,
    frequency: 'instant' as 'instant' | 'hourly' | 'daily',
    recipients: [
      { email: 'resources@rubamin.com', name: 'Resources Manager', enabled: true },
      { email: 'admin@rubamin.com', name: 'Admin Team', enabled: true },
      { email: 'compliance@rubamin.com', name: 'Compliance Officer', enabled: false },
    ],
    quietHoursEnabled: false,
    quietHoursStart: '22:00',
    quietHoursEnd: '07:00',
  });
  const [showAddRecipientModal, setShowAddRecipientModal] = useState(false);
  const [newRecipientEmail, setNewRecipientEmail] = useState('');
  const [newRecipientName, setNewRecipientName] = useState('');
  const [notifSaved, setNotifSaved] = useState(false);

  const [resources, setResources] = useState<Resource[]>([
    { id: 'RES-001', title: 'Annual Report 2023', category: 'Reports', date: '2024-03-15', size: '2.5 MB', downloads: 145, status: 'Published', description: 'Comprehensive annual report covering all business operations.' },
    { id: 'RES-002', title: 'Safety Certificate', category: 'Certifications', date: '2024-03-10', size: '1.2 MB', downloads: 89, status: 'Published', description: 'ISO 45001 Safety Management certification.' },
    { id: 'RES-003', title: 'Financial Statement Q4', category: 'Financials Report', date: '2024-03-05', size: '3.1 MB', downloads: 234, status: 'Published', description: 'Q4 2023 financial statements and analysis.' },
    { id: 'RES-004', title: 'ISO 9001 Certificate', category: 'Certifications', date: '2024-02-28', size: '0.8 MB', downloads: 156, status: 'Published', description: 'Quality Management System certification.' },
    { id: 'RES-005', title: 'Sustainability Report', category: 'Reports', date: '2024-02-20', size: '4.2 MB', downloads: 198, status: 'Draft', description: 'Environmental and social sustainability initiatives.' },
    { id: 'RES-006', title: 'Environmental Policy', category: 'Policies', date: '2024-02-15', size: '1.5 MB', downloads: 67, status: 'Published', description: 'Company environmental protection policies.' },
    { id: 'RES-007', title: 'Production Statistics 2023', category: 'Statistics Report', date: '2024-02-10', size: '2.8 MB', downloads: 112, status: 'Published', description: 'Annual production data and statistics.' },
    { id: 'RES-008', title: 'Quality Assurance Certificate', category: 'Certifications', date: '2024-02-05', size: '1.1 MB', downloads: 78, status: 'Published', description: 'Quality assurance certification document.' },
    { id: 'RES-009', title: 'Quarterly Financial Report Q3', category: 'Financials Report', date: '2024-01-25', size: '2.9 MB', downloads: 189, status: 'Draft', description: 'Q3 2023 financial performance report.' },
    { id: 'RES-010', title: 'Health & Safety Policy', category: 'Policies', date: '2024-01-20', size: '1.7 MB', downloads: 92, status: 'Published', description: 'Workplace health and safety guidelines.' },
    { id: 'RES-011', title: 'Mining Operations Report', category: 'Reports', date: '2024-01-15', size: '3.5 MB', downloads: 167, status: 'Published', description: 'Detailed mining operations analysis.' },
    { id: 'RES-012', title: 'Export Statistics 2023', category: 'Statistics Report', date: '2024-01-10', size: '2.2 MB', downloads: 134, status: 'Published', description: 'Export volumes and destinations data.' },
    { id: 'RES-013', title: 'Supply Contract 2024', category: 'Contracts', date: '2024-01-05', size: '1.8 MB', downloads: 56, status: 'Archived', description: 'Annual supply agreement documentation.' },
    { id: 'RES-014', title: 'Mining Association Membership', category: 'Affiliations', date: '2023-12-20', size: '0.5 MB', downloads: 34, status: 'Published', description: 'Industry association membership certificate.' },
    { id: 'RES-015', title: 'Excellence Award 2023', category: 'Awards', date: '2023-12-15', size: '0.9 MB', downloads: 87, status: 'Published', description: 'Industry excellence recognition award.' },
  ]);

  const [downloadRequests, setDownloadRequests] = useState<DownloadRequest[]>([
    { id: 'DR-001', requesterName: 'Jean-Pierre Kabongo', company: 'Katanga Mining Corp', email: 'jpkabongo@katangamining.cd', phone: '+243 81 234 5678', resourceId: 'RES-001', resourceTitle: 'Annual Report 2023', resourceCategory: 'Reports', purpose: 'We require the annual report for our due diligence process as part of a potential partnership evaluation.', status: 'new', requestedAt: '2024-03-22T14:30:00' },
    { id: 'DR-002', requesterName: 'Marie Tshilombo', company: 'EcoAudit International', email: 'mtshilombo@ecoaudit.org', phone: '+243 99 876 5432', resourceId: 'RES-006', resourceTitle: 'Environmental Policy', resourceCategory: 'Policies', purpose: 'Requesting the environmental policy document for our regional compliance benchmarking study.', status: 'new', requestedAt: '2024-03-22T10:15:00' },
    { id: 'DR-003', requesterName: 'Robert Mwanza', company: 'Lubumbashi Chamber of Commerce', email: 'rmwanza@lshichamber.cd', phone: '+243 82 345 6789', resourceId: 'RES-003', resourceTitle: 'Financial Statement Q4', resourceCategory: 'Financials Report', purpose: 'Needed for the annual economic review publication featuring top industrial contributors.', status: 'reviewed', requestedAt: '2024-03-20T09:45:00' },
    { id: 'DR-004', requesterName: 'Dr. Amina Diallo', company: 'University of Lubumbashi', email: 'adiallo@alui.ac.cd', phone: '+243 97 654 3210', resourceId: 'RES-005', resourceTitle: 'Sustainability Report', resourceCategory: 'Reports', purpose: 'Academic research on corporate sustainability practices in the mining sector.', status: 'approved', requestedAt: '2024-03-18T11:20:00', repliedAt: '2024-03-19T08:30:00' },
    { id: 'DR-005', requesterName: 'Patrick Lukusa', company: 'SafetyFirst Consulting', email: 'plukusa@safetyfirst.cd', phone: '+243 85 111 2233', resourceId: 'RES-002', resourceTitle: 'Safety Certificate', resourceCategory: 'Certifications', purpose: 'Verification of safety certifications for our client compliance audit report.', status: 'approved', requestedAt: '2024-03-15T16:00:00', repliedAt: '2024-03-16T10:00:00' },
    { id: 'DR-006', requesterName: 'Chen Wei', company: 'Global Metals Trading Ltd', email: 'cwei@globalmetals.com', phone: '+86 138 0013 8000', resourceId: 'RES-007', resourceTitle: 'Production Statistics 2023', resourceCategory: 'Statistics Report', purpose: 'Market analysis and trade volume assessment for copper production.', status: 'rejected', requestedAt: '2024-03-12T08:00:00', repliedAt: '2024-03-13T14:00:00' },
    { id: 'DR-007', requesterName: 'Sophie Mutombo', company: 'African Mining Weekly', email: 'smutombo@amweekly.com', phone: '+243 99 222 3344', resourceId: 'RES-011', resourceTitle: 'Mining Operations Report', resourceCategory: 'Reports', purpose: 'Feature article on leading mining operations in the Katanga region.', status: 'new', requestedAt: '2024-03-23T07:30:00' },
  ]);

  const categories = ['All', 'Reports', 'Certifications', 'Financials Report', 'Statistics Report', 'Policies', 'Contracts', 'Affiliations', 'Awards'];
  const resourceStatusOptions = ['All', 'Published', 'Draft', 'Archived'];
  const requestStatusOptions = ['All', 'new', 'reviewed', 'approved', 'rejected', 'archived'];

  const handleResourceSort = (field: ResourceSortField) => {
    if (resourceSortField === field) {
      setResourceSortDirection(resourceSortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setResourceSortField(field);
      setResourceSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const handleRequestSort = (field: RequestSortField) => {
    if (requestSortField === field) {
      setRequestSortDirection(requestSortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setRequestSortField(field);
      setRequestSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'All' || resource.status === filterStatus;
    const matchesCategory = filterCategory === 'All' || resource.category === filterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const filteredRequests = downloadRequests.filter((req) => {
    const matchesSearch =
      req.requesterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.resourceTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'All' || req.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const sortedResources = [...filteredResources].sort((a, b) => {
    let aValue: string | number = '';
    let bValue: string | number = '';
    switch (resourceSortField) {
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
      case 'date':
        aValue = new Date(a.date).getTime();
        bValue = new Date(b.date).getTime();
        break;
      case 'size':
        aValue = parseFloat(a.size.replace(' MB', ''));
        bValue = parseFloat(b.size.replace(' MB', ''));
        break;
      case 'downloads':
        aValue = a.downloads;
        bValue = b.downloads;
        break;
    }
    if (aValue < bValue) return resourceSortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return resourceSortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const sortedRequests = [...filteredRequests].sort((a, b) => {
    let aValue: string | number = '';
    let bValue: string | number = '';
    switch (requestSortField) {
      case 'requesterName':
        aValue = a.requesterName.toLowerCase();
        bValue = b.requesterName.toLowerCase();
        break;
      case 'resourceTitle':
        aValue = a.resourceTitle.toLowerCase();
        bValue = b.resourceTitle.toLowerCase();
        break;
      case 'status':
        aValue = a.status.toLowerCase();
        bValue = b.status.toLowerCase();
        break;
      case 'requestedAt':
        aValue = new Date(a.requestedAt).getTime();
        bValue = new Date(b.requestedAt).getTime();
        break;
    }
    if (aValue < bValue) return requestSortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return requestSortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const currentItems = activeTab === 'resources' ? sortedResources : sortedRequests;
  const totalPages = Math.ceil(currentItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedResources = sortedResources.slice(startIndex, endIndex);
  const paginatedRequests = sortedRequests.slice(startIndex, endIndex);

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
    const items = activeTab === 'resources' ? filteredResources.map((r) => r.id) : filteredRequests.map((r) => r.id);
    setSelectedItems(selectedItems.length === items.length ? [] : items);
  };

  const handleSelectItem = (id: string) => {
    setSelectedItems((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const handleDelete = () => {
    if (activeTab === 'resources') {
      setResources((prev) => prev.filter((r) => !selectedItems.includes(r.id)));
    } else {
      setDownloadRequests((prev) => prev.filter((r) => !selectedItems.includes(r.id)));
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

  const handleCreateResource = () => {
    const newResource: Resource = {
      id: `RES-${Date.now()}`,
      title: formData.title,
      category: formData.category,
      date: new Date().toISOString().split('T')[0],
      size: formData.file ? `${(formData.file.size / (1024 * 1024)).toFixed(1)} MB` : '0.5 MB',
      downloads: 0,
      status: formData.status as 'Published' | 'Draft' | 'Archived',
      description: formData.description,
    };
    setResources((prev) => [newResource, ...prev]);
    setShowCreateModal(false);
    resetForm();
    showToastMessage('Resource uploaded successfully');
  };

  const handleEditResource = () => {
    if (!editingResource) return;
    setResources((prev) =>
      prev.map((r) =>
        r.id === editingResource.id
          ? { ...r, title: formData.title, category: formData.category, description: formData.description, status: formData.status as 'Published' | 'Draft' | 'Archived' }
          : r
      )
    );
    setShowEditModal(false);
    setEditingResource(null);
    resetForm();
    showToastMessage('Resource updated successfully');
  };

  const openEditModal = (resource: Resource) => {
    setEditingResource(resource);
    setFormData({ title: resource.title, category: resource.category, description: resource.description, status: resource.status, file: null });
    setShowEditModal(true);
  };

  const handleViewRequest = (req: DownloadRequest) => {
    setViewingRequest(req);
    setShowViewModal(true);
    if (req.status === 'new') {
      setDownloadRequests((prev) => prev.map((r) => (r.id === req.id ? { ...r, status: 'reviewed' } : r)));
    }
  };

  const handleReplyClick = (req: DownloadRequest) => {
    setViewingRequest(req);
    setReplyMessage('');
    setShowReplyModal(true);
  };

  const handleSendReply = async () => {
    if (!viewingRequest || !replyMessage.trim()) return;
    setIsSending(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setDownloadRequests((prev) =>
      prev.map((r) => (r.id === viewingRequest.id ? { ...r, status: 'approved', repliedAt: new Date().toISOString() } : r))
    );
    setIsSending(false);
    setShowReplyModal(false);
    setShowViewModal(false);
    setReplyMessage('');
    showToastMessage('Reply sent & request approved');
  };

  const handleRejectRequest = (req: DownloadRequest) => {
    setDownloadRequests((prev) =>
      prev.map((r) => (r.id === req.id ? { ...r, status: 'rejected', repliedAt: new Date().toISOString() } : r))
    );
    showToastMessage('Request rejected');
  };

  const handleArchiveRequest = (req: DownloadRequest) => {
    setDownloadRequests((prev) => prev.map((r) => (r.id === req.id ? { ...r, status: 'archived' } : r)));
    showToastMessage('Request archived');
  };

  const resetForm = () => {
    setFormData({ title: '', category: '', description: '', status: 'Draft', file: null });
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const formatDateTime = (dateStr: string) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const getResourceStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      Published: darkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-50 text-green-700',
      Draft: darkMode ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-50 text-yellow-700',
      Archived: darkMode ? 'bg-gray-500/20 text-gray-400' : 'bg-gray-100 text-gray-600',
    };
    const dots: Record<string, string> = { Published: 'bg-green-500', Draft: 'bg-yellow-500', Archived: 'bg-gray-400' };
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

  const getRequestStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      new: darkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-50 text-blue-700',
      reviewed: darkMode ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-50 text-yellow-700',
      approved: darkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-50 text-green-700',
      rejected: darkMode ? 'bg-red-500/20 text-red-400' : 'bg-red-50 text-red-700',
      archived: darkMode ? 'bg-gray-500/20 text-gray-400' : 'bg-gray-100 text-gray-600',
    };
    const dots: Record<string, string> = {
      new: 'bg-blue-500',
      reviewed: 'bg-yellow-500',
      approved: 'bg-green-500',
      rejected: 'bg-red-500',
      archived: 'bg-gray-400',
    };
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium capitalize ${
          styles[status] ||
          (darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-100 text-gray-600')
        }`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${dots[status] || 'bg-gray-400'}`} />
        {status}
      </span>
    );
  };

  const newRequestsCount = downloadRequests.filter((r) => r.status === 'new').length;

  const renderSortIcon = (field: ResourceSortField | RequestSortField, isResourceTable: boolean) => {
    const isActive = isResourceTable ? resourceSortField === field : requestSortField === field;
    const direction = isResourceTable ? resourceSortDirection : requestSortDirection;
    return (
      <i
        className={`ml-1 ${
          isActive ? (direction === 'asc' ? 'ri-arrow-up-line' : 'ri-arrow-down-line') : 'ri-arrow-up-down-line opacity-40'
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

  const stats = [
    { label: 'Total Resources', value: resources.length, icon: 'ri-folder-line', color: 'blue' },
    { label: 'Published', value: resources.filter((r) => r.status === 'Published').length, icon: 'ri-check-double-line', color: 'green' },
    { label: 'Total Downloads', value: resources.reduce((sum, r) => sum + r.downloads, 0), icon: 'ri-download-line', color: 'red' },
    { label: 'Pending Requests', value: downloadRequests.filter((r) => r.status === 'new' || r.status === 'reviewed').length, icon: 'ri-time-line', color: 'yellow' },
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
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${darkMode ? 'bg-red-600/20' : 'bg-red-50'}`}>
            <i className={`ri-mail-settings-line text-xl ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
          </div>
          <div>
            <h3 className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Email Notifications</h3>
            <p className={`text-xs mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Receive email alerts for resource activities</p>
          </div>
        </div>
        <button
          onClick={() => setNotifSettings((prev) => ({ ...prev, enableEmailNotifications: !prev.enableEmailNotifications }))}
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
            <h4 className={`text-sm font-semibold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              <i className="ri-notification-3-line" /> Alert Types
            </h4>
            <div
              className={`rounded-lg border divide-y ${
                darkMode ? 'bg-gray-800 border-gray-700 divide-gray-700' : 'bg-white border-gray-200 divide-gray-100'
              }`}
            >
              {[
                { key: 'newDownloadRequest', icon: 'ri-download-cloud-line', label: 'New Download Request', desc: 'Get notified when someone requests to download a resource', color: 'green' },
                { key: 'requestStatusChange', icon: 'ri-exchange-line', label: 'Request Status Changes', desc: 'Alerts when request status is updated', color: 'yellow' },
                { key: 'resourceDownloaded', icon: 'ri-file-download-line', label: 'Resource Downloaded', desc: 'Notify when a resource is downloaded', color: 'blue' },
                { key: 'lowStorageAlert', icon: 'ri-hard-drive-2-line', label: 'Low Storage Alert', desc: 'Alert when storage capacity is running low', color: 'red' },
                { key: 'bulkRequestAlert', icon: 'ri-group-line', label: 'Bulk Request Alert', desc: `Notify when ${notifSettings.bulkThreshold}+ requests received in a day`, color: 'teal' },
              ].map((item) => {
                const colorMap: Record<string, { bg: string; text: string }> = {
                  green: { bg: darkMode ? 'bg-green-500/15' : 'bg-green-50', text: darkMode ? 'text-green-400' : 'text-green-600' },
                  yellow: { bg: darkMode ? 'bg-yellow-500/15' : 'bg-yellow-50', text: darkMode ? 'text-yellow-400' : 'text-yellow-600' },
                  blue: { bg: darkMode ? 'bg-blue-500/15' : 'bg-blue-50', text: darkMode ? 'text-blue-400' : 'text-blue-600' },
                  red: { bg: darkMode ? 'bg-red-500/15' : 'bg-red-50', text: darkMode ? 'text-red-400' : 'text-red-600' },
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
            <div
              className={`rounded-lg border divide-y ${
                darkMode ? 'bg-gray-800 border-gray-700 divide-gray-700' : 'bg-white border-gray-200 divide-gray-100'
              }`}
            >
              {[
                { key: 'dailyDigest', icon: 'ri-sun-line', label: 'Daily Digest', desc: 'Receive a daily summary of all resource activities at 8:00 AM' },
                { key: 'weeklyReport', icon: 'ri-calendar-line', label: 'Weekly Report', desc: 'Get a comprehensive weekly resources report every Monday' },
              ].map((item) => (
                <div
                  key={item.key}
                  className={`flex items-center justify-between px-5 py-4 transition-colors ${
                    darkMode ? 'hover:bg-gray-700/30' : 'hover:bg-gray-50/50'
                  }`}
                >
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
            <div
              className={`rounded-lg border p-5 ${
                darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}
            >
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
                        className={`px-2 py-1 rounded-md text-xs ${
                          darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-200'
                        } border focus:outline-none focus:ring-1 focus:ring-red-600`}
                      />
                      <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>to</span>
                      <input
                        type="time"
                        value={notifSettings.quietHoursEnd}
                        onChange={(e) => setNotifSettings((prev) => ({ ...prev, quietHoursEnd: e.target.value }))}
                        className={`px-2 py-1 rounded-md text-xs ${
                          darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-200'
                        } border focus:outline-none focus:ring-1 focus:ring-red-600`}
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
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors whitespace-nowrap"
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
                  <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
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
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
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
            Resources Management
          </h2>
          <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Manage company resources, documents and download requests
          </p>
        </div>
        {activeTab === 'resources' && (
          <button
            onClick={() => {
              resetForm();
              setShowCreateModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white hover:bg-red-700 rounded-lg text-sm font-medium whitespace-nowrap self-start sm:self-auto"
          >
            <i className="ri-upload-2-line text-lg" />
            Upload Resource
          </button>
        )}
      </div>

      {/* Stats */}
      {activeTab === 'resources' && (
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
                    stat.color === 'blue'
                      ? darkMode
                        ? 'bg-blue-500/20'
                        : 'bg-blue-50'
                      : stat.color === 'green'
                      ? darkMode
                        ? 'bg-green-500/20'
                        : 'bg-green-50'
                      : stat.color === 'red'
                      ? darkMode
                        ? 'bg-red-600/20'
                        : 'bg-red-50'
                      : darkMode
                      ? 'bg-yellow-500/20'
                      : 'bg-yellow-50'
                  }`}
                >
                  <i
                    className={`${stat.icon} text-xl ${
                      stat.color === 'blue'
                        ? darkMode
                          ? 'text-blue-400'
                          : 'text-blue-600'
                        : stat.color === 'green'
                        ? darkMode
                          ? 'text-green-400'
                          : 'text-green-600'
                        : stat.color === 'red'
                        ? darkMode
                          ? 'text-red-400'
                          : 'text-red-600'
                        : darkMode
                        ? 'text-yellow-400'
                        : 'text-yellow-600'
                    }`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Main Content */}
      <div className={`rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        {/* Tabs */}
        <div className={`px-4 pt-3 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} overflow-x-auto`}>
          <div className="flex items-center gap-1 min-w-max">
            <button
              onClick={() => {
                setActiveTab('resources');
                setSelectedItems([]);
                setFilterStatus('All');
                setFilterCategory('All');
                setCurrentPage(1);
              }}
              className={`px-4 py-2.5 text-sm font-medium rounded-t-lg transition-all whitespace-nowrap ${
                activeTab === 'resources'
                  ? darkMode
                    ? 'bg-gray-700 text-white border border-b-0 border-gray-600'
                    : 'bg-white text-gray-900 border border-b-0 border-gray-200 shadow-sm'
                  : darkMode
                  ? 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <i className="ri-folder-line mr-1.5" />
              Resources
              <span
                className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
                  activeTab === 'resources'
                    ? darkMode
                      ? 'bg-red-600/20 text-red-400'
                      : 'bg-red-50 text-red-600'
                    : darkMode
                    ? 'bg-gray-600 text-gray-400'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                {resources.length}
              </span>
            </button>
            <button
              onClick={() => {
                setActiveTab('requests');
                setSelectedItems([]);
                setFilterStatus('All');
                setCurrentPage(1);
              }}
              className={`px-4 py-2.5 text-sm font-medium rounded-t-lg transition-all whitespace-nowrap ${
                activeTab === 'requests'
                  ? darkMode
                    ? 'bg-gray-700 text-white border border-b-0 border-gray-600'
                    : 'bg-white text-gray-900 border border-b-0 border-gray-200 shadow-sm'
                  : darkMode
                  ? 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <i className="ri-download-line mr-1.5" />
              Download Requests
              {newRequestsCount > 0 && (
                <span className="ml-2 min-w-5 h-5 inline-flex items-center justify-center px-1.5 text-xs font-bold rounded-full bg-red-600 text-white">
                  {newRequestsCount}
                </span>
              )}
            </button>
            <button
              onClick={() => {
                setActiveTab('notifications');
                setSelectedItems([]);
              }}
              className={`px-4 py-2.5 text-sm font-medium rounded-t-lg transition-all whitespace-nowrap ${
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
            <div
              className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex flex-col sm:flex-row sm:items-center justify-between gap-3`}
            >
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="relative">
                  <i className={`ri-search-line absolute left-3 top-1/2 -translate-y-1/2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className={`w-full sm:w-64 pl-10 pr-4 py-2 rounded-lg border text-sm ${
                      darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500'
                    } focus:outline-none focus:ring-2 focus:ring-red-600`}
                  />
                </div>
                <div className="flex items-center gap-3">
                  {activeTab === 'resources' && (
                    <select
                      value={filterCategory}
                      onChange={(e) => {
                        setFilterCategory(e.target.value);
                        setCurrentPage(1);
                      }}
                      className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm cursor-pointer ${
                        darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-200'
                      } border focus:outline-none focus:ring-2 focus:ring-red-600`}
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat === 'All' ? 'All Categories' : cat}
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
                    className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm cursor-pointer ${
                      darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-200'
                    } border focus:outline-none focus:ring-2 focus:ring-red-600`}
                  >
                    {(activeTab === 'resources' ? resourceStatusOptions : requestStatusOptions).map((status) => (
                      <option key={status} value={status}>
                        {status === 'All' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {selectedItems.length > 0 && (
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 whitespace-nowrap"
                  >
                    <i className="ri-delete-bin-line" />
                    Delete ({selectedItems.length})
                  </button>
                )}
                {activeTab === 'resources' && (
                  <div className={`flex items-center rounded-lg overflow-hidden border ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`w-10 h-9 flex items-center justify-center ${viewMode === 'list' ? 'bg-red-600 text-white' : darkMode ? 'bg-gray-700 text-gray-400 hover:text-white' : 'bg-white text-gray-500 hover:text-gray-700'}`}
                      title="List View"
                    >
                      <i className="ri-list-check text-lg" />
                    </button>
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`w-10 h-9 flex items-center justify-center ${viewMode === 'grid' ? 'bg-red-600 text-white' : darkMode ? 'bg-gray-700 text-gray-400 hover:text-white' : 'bg-white text-gray-500 hover:text-gray-700'}`}
                      title="Grid View"
                    >
                      <i className="ri-grid-fill text-lg" />
                    </button>
                  </div>
                )}
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {activeTab === 'resources' ? sortedResources.length : sortedRequests.length} items
                </span>
              </div>
            </div>

            {/* Table Content */}
            <div className="overflow-x-auto">
              {activeTab === 'resources' ? (
                viewMode === 'list' ? (
                  <table className="w-full">
                    <thead className={darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}>
                      <tr>
                        <th className="w-12 px-4 py-3">
                          <input
                            type="checkbox"
                            checked={selectedItems.length === filteredResources.length && filteredResources.length > 0}
                            onChange={handleSelectAll}
                            className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-600 cursor-pointer"
                          />
                        </th>
                        {(['title', 'category', 'status', 'date', 'size', 'downloads'] as ResourceSortField[]).map((field) => {
                          const labels: Record<string, string> = {
                            title: 'Title',
                            category: 'Category',
                            status: 'Status',
                            date: 'Date',
                            size: 'Size',
                            downloads: 'Downloads',
                          };
                          return (
                            <th
                              key={field}
                              onClick={() => handleResourceSort(field)}
                              className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer ${
                                resourceSortField === field ? 'text-red-600' : darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-700'
                              }`}
                            >
                              <div className="flex items-center">
                                {labels[field]}
                                {renderSortIcon(field, true)}
                              </div>
                            </th>
                          );
                        })}
                        <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                      {paginatedResources.map((resource) => (
                        <tr
                          key={resource.id}
                          className={`transition-colors cursor-pointer ${darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'}`}
                          onClick={() => openEditModal(resource)}
                        >
                          <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              checked={selectedItems.includes(resource.id)}
                              onChange={() => handleSelectItem(resource.id)}
                              className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-600 cursor-pointer"
                            />
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${darkMode ? 'bg-red-600/20' : 'bg-red-50'}`}>
                                <i className={`ri-file-pdf-line ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
                              </div>
                              <div>
                                <div className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{resource.title}</div>
                                <div className={`text-xs mt-0.5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{resource.id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`text-xs px-2.5 py-1 rounded-full ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>{resource.category}</span>
                          </td>
                          <td className="px-4 py-4">{getResourceStatusBadge(resource.status)}</td>
                          <td className={`px-4 py-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{formatDate(resource.date)}</td>
                          <td className={`px-4 py-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{resource.size}</td>
                          <td className={`px-4 py-4 text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{resource.downloads}</td>
                          <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center gap-1">
                              <button
                                className={`w-8 h-8 flex items-center justify-center rounded-lg ${darkMode ? 'hover:bg-gray-700 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'}`}
                                title="Download"
                              >
                                <i className="ri-download-line" />
                              </button>
                              <button
                                onClick={() => openEditModal(resource)}
                                className={`w-8 h-8 flex items-center justify-center rounded-lg ${darkMode ? 'hover:bg-gray-700 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'}`}
                                title="Edit"
                              >
                                <i className="ri-pencil-line" />
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedItems([resource.id]);
                                  setShowDeleteModal(true);
                                }}
                                className={`w-8 h-8 flex items-center justify-center rounded-lg ${darkMode ? 'hover:bg-red-600/20 text-gray-400 hover:text-red-400' : 'hover:bg-red-50 text-gray-500 hover:text-red-600'}`}
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
                  <div className="p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {paginatedResources.map((resource) => (
                        <div
                          key={resource.id}
                          className={`rounded-lg border p-4 transition-all hover:shadow-lg ${darkMode ? 'bg-gray-700/50 border-gray-600 hover:border-gray-500' : 'bg-white border-gray-200 hover:border-gray-300'} ${
                            selectedItems.includes(resource.id) ? 'ring-2 ring-red-600' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <input
                              type="checkbox"
                              checked={selectedItems.includes(resource.id)}
                              onChange={() => handleSelectItem(resource.id)}
                              className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-600 cursor-pointer"
                            />
                            {getResourceStatusBadge(resource.status)}
                          </div>
                          <div className={`w-full h-20 rounded-lg flex items-center justify-center mb-3 ${darkMode ? 'bg-gray-600' : 'bg-red-50'}`}>
                            <i className={`ri-file-pdf-line text-3xl ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
                          </div>
                          <h3 className={`text-sm font-semibold mb-1 line-clamp-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{resource.title}</h3>
                          <div className="flex items-center justify-between mb-2">
                            <span className={`text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>{resource.category}</span>
                            <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{resource.size}</span>
                          </div>
                          <div className={`flex items-center justify-between text-xs mb-3 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                            <span>{formatDate(resource.date)}</span>
                            <span className="flex items-center gap-1">
                              <i className="ri-download-line" />
                              {resource.downloads}
                            </span>
                          </div>
                          <div className={`flex items-center justify-center gap-1 pt-3 border-t ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                            <button
                              className={`w-8 h-8 flex items-center justify-center rounded-lg ${darkMode ? 'hover:bg-gray-600 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'}`}
                              title="Download"
                            >
                              <i className="ri-download-line" />
                            </button>
                            <button
                              onClick={() => openEditModal(resource)}
                              className={`w-8 h-8 flex items-center justify-center rounded-lg ${darkMode ? 'hover:bg-gray-600 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'}`}
                              title="Edit"
                            >
                              <i className="ri-pencil-line" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedItems([resource.id]);
                                setShowDeleteModal(true);
                              }}
                              className={`w-8 h-8 flex items-center justify-center rounded-lg ${darkMode ? 'hover:bg-red-600/20 text-gray-400 hover:text-red-400' : 'hover:bg-red-50 text-gray-500 hover:text-red-600'}`}
                              title="Delete"
                            >
                              <i className="ri-delete-bin-line" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              ) : (
                <table className="w-full">
                  <thead className={darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}>
                    <tr>
                      <th className="w-12 px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedItems.length === filteredRequests.length && filteredRequests.length > 0}
                          onChange={handleSelectAll}
                          className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-600 cursor-pointer"
                        />
                      </th>
                      <th
                        onClick={() => handleRequestSort('requesterName')}
                        className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer ${
                          requestSortField === 'requesterName' ? 'text-red-600' : darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-700'
                        }`}
                      >
                        <div className="flex items-center">
                          Requester
                          {renderSortIcon('requesterName', false)}
                        </div>
                      </th>
                      <th
                        onClick={() => handleRequestSort('resourceTitle')}
                        className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer ${
                          requestSortField === 'resourceTitle' ? 'text-red-600' : darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-700'
                        }`}
                      >
                        <div className="flex items-center">
                          Resource
                          {renderSortIcon('resourceTitle', false)}
                        </div>
                      </th>
                      <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider w-[150px] ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Purpose</th>
                      <th
                        onClick={() => handleRequestSort('status')}
                        className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer ${
                          requestSortField === 'status' ? 'text-red-600' : darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-700'
                        }`}
                      >
                        <div className="flex items-center">
                          Status
                          {renderSortIcon('status', false)}
                        </div>
                      </th>
                      <th
                        onClick={() => handleRequestSort('requestedAt')}
                        className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer ${
                          requestSortField === 'requestedAt' ? 'text-red-600' : darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-700'
                        }`}
                      >
                        <div className="flex items-center">
                          Requested
                          {renderSortIcon('requestedAt', false)}
                        </div>
                      </th>
                      <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                    {paginatedRequests.map((req) => (
                      <tr
                        key={req.id}
                        className={`transition-colors cursor-pointer ${darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'}`}
                        style={req.status === 'new' ? { borderLeft: '4px solid #DC2626' } : undefined}
                        onClick={() => handleViewRequest(req)}
                      >
                        <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(req.id)}
                            onChange={() => handleSelectItem(req.id)}
                            className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-600 cursor-pointer"
                          />
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                              {req.requesterName.charAt(0)}
                            </div>
                            <div>
                              <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'} ${req.status === 'new' ? 'font-semibold' : ''}`}>
                                {req.requesterName}
                              </p>
                              <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{req.company}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div>
                            <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{req.resourceTitle}</p>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>{req.resourceCategory}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 max-w-[150px]">
                          <p className={`text-sm truncate ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{req.purpose}</p>
                        </td>
                        <td className="px-4 py-4">{getRequestStatusBadge(req.status)}</td>
                        <td className={`px-4 py-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{formatDateTime(req.requestedAt)}</td>
                        <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleViewRequest(req)}
                              className={`w-8 h-8 flex items-center justify-center rounded-lg ${darkMode ? 'hover:bg-gray-700 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'}`}
                              title="View"
                            >
                              <i className="ri-eye-line" />
                            </button>
                            <button
                              onClick={() => handleReplyClick(req)}
                              className={`w-8 h-8 flex items-center justify-center rounded-lg ${darkMode ? 'hover:bg-green-600/20 text-gray-400 hover:text-green-400' : 'hover:bg-green-50 text-gray-500 hover:text-green-600'}`}
                              title="Approve & Reply"
                            >
                              <i className="ri-reply-line" />
                            </button>
                            {req.status !== 'rejected' && req.status !== 'archived' && (
                              <button
                                onClick={() => handleRejectRequest(req)}
                                className={`w-8 h-8 flex items-center justify-center rounded-lg ${darkMode ? 'hover:bg-red-600/20 text-gray-400 hover:text-red-400' : 'hover:bg-red-50 text-gray-500 hover:text-red-600'}`}
                                title="Reject"
                              >
                                <i className="ri-close-circle-line" />
                              </button>
                            )}
                            {req.status !== 'archived' && (
                              <button
                                onClick={() => handleArchiveRequest(req)}
                                className={`w-8 h-8 flex items-center justify-center rounded-lg ${darkMode ? 'hover:bg-gray-700 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'}`}
                                title="Archive"
                              >
                                <i className="ri-inbox-archive-line" />
                              </button>
                            )}
                            <button
                              onClick={() => {
                                setSelectedItems([req.id]);
                                setShowDeleteModal(true);
                              }}
                              className={`w-8 h-8 flex items-center justify-center rounded-lg ${darkMode ? 'hover:bg-red-600/20 text-gray-400 hover:text-red-400' : 'hover:bg-red-50 text-gray-500 hover:text-red-600'}`}
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

              {((activeTab === 'resources' && filteredResources.length === 0) || (activeTab === 'requests' && filteredRequests.length === 0)) && (
                <div className="py-16 text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <i className={`ri-inbox-line text-3xl ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                  </div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>No {activeTab === 'resources' ? 'resources' : 'download requests'} found</p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div
                className={`px-4 sm:px-6 py-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex flex-col sm:flex-row items-center justify-between gap-3`}
              >
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className={`w-8 h-8 flex items-center justify-center rounded-lg ${currentPage === 1 ? (darkMode ? 'bg-gray-700 text-gray-600 cursor-not-allowed' : 'bg-gray-100 text-gray-400 cursor-not-allowed') : darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                      <i className="ri-arrow-left-s-line" />
                    </button>
                    {getPageNumbers().map((page, index) =>
                      typeof page === 'number' ? (
                        <button
                          key={index}
                          onClick={() => setCurrentPage(page)}
                          className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium ${currentPage === page ? 'bg-red-600 text-white' : darkMode ? 'bg-gray-700 text-gray-400 hover:text-white' : 'bg-gray-100 text-gray-700 hover:text-gray-900'}`}
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
                      className={`w-8 h-8 flex items-center justify-center rounded-lg ${currentPage === totalPages ? (darkMode ? 'bg-gray-700 text-gray-600 cursor-not-allowed' : 'bg-gray-100 text-gray-400 cursor-not-allowed') : darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                      <i className="ri-arrow-right-s-line" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Show</span>
                    <select
                      value={itemsPerPage}
                      onChange={(e) => {
                        setItemsPerPage(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-sm border cursor-pointer ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                    </select>
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>entries</span>
                  </div>
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Showing {startIndex + 1}-{Math.min(endIndex, currentItems.length)} of {currentItems.length}
                  </span>
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
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                Cancel
              </button>
              <button onClick={handleDelete} className="flex-1 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Resource Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className={`w-full max-w-xl rounded-xl my-8 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className={`flex items-center justify-between p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'Merriweather, serif' }}>
                Upload New Resource
              </h3>
              <button onClick={() => setShowCreateModal(false)} className={`w-8 h-8 flex items-center justify-center rounded-lg ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}>
                <i className="ri-close-line text-xl" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-lg text-sm ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-red-600`}
                  placeholder="e.g., Annual Report 2024"
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-lg text-sm ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-red-600`}
                >
                  <option value="">Select category</option>
                  {categories.filter((c) => c !== 'All').map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  maxLength={500}
                  className={`w-full px-4 py-2.5 rounded-lg text-sm resize-none ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-red-600`}
                  placeholder="Brief description of the resource..."
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>File</label>
                <div className={`border-2 border-dashed rounded-lg p-6 text-center ${darkMode ? 'border-gray-600 hover:border-gray-500' : 'border-gray-300 hover:border-gray-400'} transition-colors cursor-pointer`}>
                  <i className={`ri-upload-cloud-line text-3xl mb-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Click to upload or drag and drop</p>
                  <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>PDF, DOC, XLS up to 10MB</p>
                </div>
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-lg text-sm ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-red-600`}
                >
                  <option value="Draft">Draft</option>
                  <option value="Published">Published</option>
                </select>
              </div>
            </div>
            <div className={`flex gap-3 p-6 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <button onClick={() => setShowCreateModal(false)} className={`flex-1 py-2.5 rounded-lg text-sm font-medium ${darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                Cancel
              </button>
              <button
                onClick={handleCreateResource}
                disabled={!formData.title || !formData.category}
                className="flex-1 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Upload Resource
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Resource Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className={`w-full max-w-xl rounded-xl my-8 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className={`flex items-center justify-between p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'Merriweather, serif' }}>
                Edit Resource
              </h3>
              <button onClick={() => { setShowEditModal(false); setEditingResource(null); }} className={`w-8 h-8 flex items-center justify-center rounded-lg ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}>
                <i className="ri-close-line text-xl" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-lg text-sm ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-red-600`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-lg text-sm ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-red-600`}
                >
                  {categories.filter((c) => c !== 'All').map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  maxLength={500}
                  className={`w-full px-4 py-2.5 rounded-lg text-sm resize-none ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-red-600`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-lg text-sm ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-red-600`}
                >
                  <option value="Draft">Draft</option>
                  <option value="Published">Published</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>
            </div>
            <div className={`flex gap-3 p-6 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <button
                onClick={() => { setShowEditModal(false); setEditingResource(null); }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium ${darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                Cancel
              </button>
              <button onClick={handleEditResource} className="flex-1 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Request Modal */}
      {showViewModal && viewingRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowViewModal(false)} />
          <div className={`relative w-full max-w-2xl rounded-xl shadow-xl overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className={`px-6 py-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between`}>
              <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'Merriweather, serif' }}>
                Download Request Details
              </h3>
              <button onClick={() => setShowViewModal(false)} className={`w-8 h-8 flex items-center justify-center rounded-lg ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}>
                <i className="ri-close-line text-xl" />
              </button>
            </div>
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="flex items-start gap-4 mb-6">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>{viewingRequest.requesterName.charAt(0)}</div>
                <div className="flex-1">
                  <h4 className={`text-lg font-semibold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{viewingRequest.requesterName}</h4>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{viewingRequest.company}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <a href={`mailto:${viewingRequest.email}`} className={`text-sm flex items-center gap-1 ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}>
                      <i className="ri-mail-line" />
                      {viewingRequest.email}
                    </a>
                    <a href={`tel:${viewingRequest.phone}`} className={`text-sm flex items-center gap-1 ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}>
                      <i className="ri-phone-line" />
                      {viewingRequest.phone}
                    </a>
                  </div>
                </div>
                {getRequestStatusBadge(viewingRequest.status)}
              </div>
              <div className={`rounded-lg p-4 mb-4 ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs font-semibold uppercase ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Requested Resource</span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>{viewingRequest.resourceId}</span>
                </div>
                <p className={`text-sm font-medium mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{viewingRequest.resourceTitle}</p>
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-xs font-semibold uppercase ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Category</span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>{viewingRequest.resourceCategory}</span>
                </div>
                <div className={`border-t pt-3 ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                  <span className={`text-xs font-semibold uppercase block mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Purpose of Download</span>
                  <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{viewingRequest.purpose}</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className={darkMode ? 'text-gray-500' : 'text-gray-400'}>Requested: {formatDateTime(viewingRequest.requestedAt)}</span>
                {viewingRequest.repliedAt && <span className={darkMode ? 'text-green-400' : 'text-green-600'}>Replied: {formatDateTime(viewingRequest.repliedAt)}</span>}
              </div>
            </div>
            <div className={`px-6 py-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-end gap-3`}>
              {viewingRequest.status !== 'rejected' && viewingRequest.status !== 'archived' && (
                <button
                  onClick={() => {
                    handleRejectRequest(viewingRequest);
                    setShowViewModal(false);
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${darkMode ? 'bg-red-600/20 text-red-400 hover:bg-red-600/30' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}
                >
                  <i className="ri-close-circle-line mr-1" />
                  Reject
                </button>
              )}
              <button
                onClick={() => {
                  setShowViewModal(false);
                  handleReplyClick(viewingRequest);
                }}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700"
              >
                <i className="ri-reply-line mr-1" />
                Approve & Reply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reply Modal */}
      {showReplyModal && viewingRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowReplyModal(false)} />
          <div className={`relative w-full max-w-xl rounded-xl shadow-xl overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className={`px-6 py-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between`}>
              <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'Merriweather, serif' }}>
                Approve & Reply to {viewingRequest.requesterName}
              </h3>
              <button onClick={() => setShowReplyModal(false)} className={`w-8 h-8 flex items-center justify-center rounded-lg ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}>
                <i className="ri-close-line text-xl" />
              </button>
            </div>
            <div className="p-6">
              <div className={`rounded-lg p-3 mb-4 ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                <p className={`text-xs font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>To:</p>
                <p className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{viewingRequest.requesterName} ({viewingRequest.email})</p>
                <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Re: Download request for {viewingRequest.resourceTitle}</p>
              </div>
              <div className="mb-4">
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Your Reply</label>
                <textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  rows={6}
                  maxLength={500}
                  placeholder="Type your reply message here..."
                  className={`w-full px-4 py-3 rounded-lg border text-sm resize-none ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'} focus:outline-none focus:ring-2 focus:ring-red-600`}
                />
                <p className={`text-xs mt-1 text-right ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{replyMessage.length}/500 characters</p>
              </div>
            </div>
            <div className={`px-6 py-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-end gap-3`}>
              <button onClick={() => setShowReplyModal(false)} className={`px-4 py-2 rounded-lg text-sm font-medium ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                Cancel
              </button>
              <button
                onClick={handleSendReply}
                disabled={!replyMessage.trim() || isSending}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${!replyMessage.trim() || isSending ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-red-600 text-white hover:bg-red-700'}`}
              >
                {isSending ? (
                  <span className="flex items-center">
                    <i className="ri-loader-4-line animate-spin mr-2" />
                    Sending...
                  </span>
                ) : (
                  <>
                    <i className="ri-send-plane-line mr-1" />
                    Approve & Send
                  </>
                )}
              </button>
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
              <button onClick={() => setShowAddRecipientModal(false)} className={`flex-1 py-2.5 rounded-lg text-sm font-medium ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                Cancel
              </button>
              <button
                onClick={handleAddRecipient}
                disabled={!newRecipientEmail.trim() || !newRecipientName.trim()}
                className="flex-1 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
}
