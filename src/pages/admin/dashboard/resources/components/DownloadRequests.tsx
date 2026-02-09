import { useState } from 'react';

export interface DownloadRequest {
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

const mockDownloadRequests: DownloadRequest[] = [
  {
    id: 'DR-001',
    requesterName: 'Jean-Pierre Kabongo',
    company: 'Katanga Mining Corp',
    email: 'jpkabongo@katangamining.cd',
    phone: '+243 81 234 5678',
    resourceId: 'RES-001',
    resourceTitle: 'Annual Report 2023',
    resourceCategory: 'Reports',
    purpose: 'We require the annual report for our due diligence process as part of a potential partnership evaluation with RUBAMIN SARL.',
    status: 'new',
    requestedAt: '2024-03-22T14:30:00',
  },
  {
    id: 'DR-002',
    requesterName: 'Marie Tshilombo',
    company: 'EcoAudit International',
    email: 'mtshilombo@ecoaudit.org',
    phone: '+243 99 876 5432',
    resourceId: 'RES-006',
    resourceTitle: 'Environmental Policy',
    resourceCategory: 'Policies',
    purpose: 'Requesting the environmental policy document for our regional compliance benchmarking study across mining operations in the DRC.',
    status: 'new',
    requestedAt: '2024-03-22T10:15:00',
  },
  {
    id: 'DR-003',
    requesterName: 'Robert Mwanza',
    company: 'Lubumbashi Chamber of Commerce',
    email: 'rmwanza@lshichamber.cd',
    phone: '+243 82 345 6789',
    resourceId: 'RES-003',
    resourceTitle: 'Financial Statement Q4',
    resourceCategory: 'Financials Report',
    purpose: 'Needed for the annual economic review publication featuring top industrial contributors in the Haut-Katanga province.',
    status: 'reviewed',
    requestedAt: '2024-03-20T09:45:00',
  },
  {
    id: 'DR-004',
    requesterName: 'Dr. Amina Diallo',
    company: 'University of Lubumbashi',
    email: 'adiallo@alui.ac.cd',
    phone: '+243 97 654 3210',
    resourceId: 'RES-005',
    resourceTitle: 'Sustainability Report',
    resourceCategory: 'Reports',
    purpose: 'Academic research on corporate sustainability practices in the mining sector of Central Africa. The report will be cited in our upcoming journal publication.',
    status: 'approved',
    requestedAt: '2024-03-18T11:20:00',
    repliedAt: '2024-03-19T08:30:00',
  },
  {
    id: 'DR-005',
    requesterName: 'Patrick Lukusa',
    company: 'SafetyFirst Consulting',
    email: 'plukusa@safetyfirst.cd',
    phone: '+243 85 111 2233',
    resourceId: 'RES-002',
    resourceTitle: 'Safety Certificate',
    resourceCategory: 'Certifications',
    purpose: 'Verification of safety certifications for our client compliance audit report.',
    status: 'approved',
    requestedAt: '2024-03-15T16:00:00',
    repliedAt: '2024-03-16T10:00:00',
  },
  {
    id: 'DR-006',
    requesterName: 'Chen Wei',
    company: 'Global Metals Trading Ltd',
    email: 'cwei@globalmetals.com',
    phone: '+86 138 0013 8000',
    resourceId: 'RES-007',
    resourceTitle: 'Production Statistics 2023',
    resourceCategory: 'Statistics Report',
    purpose: 'Market analysis and trade volume assessment for copper production in the DRC region.',
    status: 'rejected',
    requestedAt: '2024-03-12T08:00:00',
    repliedAt: '2024-03-13T14:00:00',
  },
  {
    id: 'DR-007',
    requesterName: 'Emmanuel Tshisekedi',
    company: 'DRC Investment Authority',
    email: 'etshisekedi@drcinvest.gov.cd',
    phone: '+243 81 987 6543',
    resourceId: 'RES-004',
    resourceTitle: 'ISO 9001 Certificate',
    resourceCategory: 'Certifications',
    purpose: 'Required for the national industrial excellence awards nomination process.',
    status: 'archived',
    requestedAt: '2024-02-28T15:45:00',
    repliedAt: '2024-03-01T09:00:00',
  },
  {
    id: 'DR-008',
    requesterName: 'Sophie Mutombo',
    company: 'African Mining Weekly',
    email: 'smutombo@amweekly.com',
    phone: '+243 99 222 3344',
    resourceId: 'RES-011',
    resourceTitle: 'Mining Operations Report',
    resourceCategory: 'Reports',
    purpose: 'Feature article on leading mining operations in the Katanga region for our Q2 2024 special edition.',
    status: 'new',
    requestedAt: '2024-03-23T07:30:00',
  },
  {
    id: 'DR-009',
    requesterName: 'James Kalala',
    company: 'Haut-Katanga Provincial Govt',
    email: 'jkalala@hkatanga.gov.cd',
    phone: '+243 82 555 6677',
    resourceId: 'RES-010',
    resourceTitle: 'Health & Safety Policy',
    resourceCategory: 'Policies',
    purpose: 'Policy benchmarking for the new provincial industrial safety regulations framework.',
    status: 'reviewed',
    requestedAt: '2024-03-21T13:00:00',
  },
];

interface DownloadRequestsProps {
  darkMode: boolean;
  searchQuery: string;
}

const DownloadRequests = ({ darkMode, searchQuery }: DownloadRequestsProps) => {
  const [requests, setRequests] = useState<DownloadRequest[]>(mockDownloadRequests);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<DownloadRequest | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<keyof DownloadRequest | null>('requestedAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const statusCounts = {
    all: requests.length,
    new: requests.filter(r => r.status === 'new').length,
    reviewed: requests.filter(r => r.status === 'reviewed').length,
    approved: requests.filter(r => r.status === 'approved').length,
    rejected: requests.filter(r => r.status === 'rejected').length,
    archived: requests.filter(r => r.status === 'archived').length,
  };

  const categories = [
    'all',
    'Reports',
    'Certifications',
    'Financials Report',
    'Statistics Report',
    'Policies',
    'Contracts',
    'Affiliations',
    'Awards',
  ];

  const showToastMsg = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleSort = (field: keyof DownloadRequest) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const filteredRequests = requests.filter(r => {
    const matchesSearch =
      r.requesterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.resourceTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.purpose.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || r.status === selectedStatus;
    const matchesCategory = selectedCategory === 'all' || r.resourceCategory === selectedCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const sortedRequests = [...filteredRequests].sort((a, b) => {
    if (!sortField) return 0;
    const aVal = a[sortField] ?? '';
    const bVal = b[sortField] ?? '';
    const dir = sortDirection === 'asc' ? 1 : -1;
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return aVal.localeCompare(bVal) * dir;
    }
    return 0;
  });

  const totalPages = Math.ceil(sortedRequests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRequests = sortedRequests.slice(startIndex, startIndex + itemsPerPage);

  const handleSelectAll = () => {
    if (selectedItems.length === paginatedRequests.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(paginatedRequests.map(r => r.id));
    }
  };

  const handleSelectItem = (id: string) => {
    setSelectedItems(prev => (prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]));
  };

  const handleView = (req: DownloadRequest) => {
    setSelectedRequest(req);
    setShowViewModal(true);
    if (req.status === 'new') {
      setRequests(prev => prev.map(r => (r.id === req.id ? { ...r, status: 'reviewed' } : r)));
    }
  };

  const handleReplyClick = (req: DownloadRequest) => {
    setSelectedRequest(req);
    setReplyMessage('');
    setShowReplyModal(true);
  };

  const handleSendReply = async () => {
    if (!selectedRequest || !replyMessage.trim()) return;
    setIsSending(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRequests(prev =>
      prev.map(r =>
        r.id === selectedRequest.id ? { ...r, status: 'approved', repliedAt: new Date().toISOString() } : r,
      ),
    );
    setIsSending(false);
    setShowReplyModal(false);
    setReplyMessage('');
    showToastMsg('Reply sent & request approved');
  };

  const handleReject = (req: DownloadRequest) => {
    setRequests(prev =>
      prev.map(r => (r.id === req.id ? { ...r, status: 'rejected', repliedAt: new Date().toISOString() } : r)),
    );
    showToastMsg('Request rejected');
  };

  const handleArchive = (req: DownloadRequest) => {
    setRequests(prev => prev.map(r => (r.id === req.id ? { ...r, status: 'archived' } : r)));
    showToastMsg('Request archived');
  };

  const handleDeleteClick = (req: DownloadRequest) => {
    setSelectedRequest(req);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (selectedRequest) {
      setRequests(prev => prev.filter(r => r.id !== selectedRequest.id));
    }
    setShowDeleteModal(false);
    setSelectedRequest(null);
    showToastMsg('Request deleted');
  };

  const handleBulkArchive = () => {
    setRequests(prev =>
      prev.map(r => (selectedItems.includes(r.id) ? { ...r, status: 'archived' } : r)),
    );
    setSelectedItems([]);
    showToastMsg(`${selectedItems.length} request(s) archived`);
  };

  const handleBulkDelete = () => {
    setRequests(prev => prev.filter(r => !selectedItems.includes(r.id)));
    setSelectedItems([]);
    showToastMsg('Requests deleted');
  };

  const handleMarkAsReviewed = (req: DownloadRequest) => {
    setRequests(prev => prev.map(r => (r.id === req.id ? { ...r, status: 'reviewed' } : r)));
  };

  const getStatusBadge = (status: DownloadRequest['status']) => {
    const styles = {
      new: darkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-50 text-blue-700',
      reviewed: darkMode ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-50 text-yellow-700',
      approved: darkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-50 text-green-700',
      rejected: darkMode ? 'bg-red-500/20 text-red-400' : 'bg-red-50 text-red-700',
      archived: darkMode ? 'bg-gray-500/20 text-gray-400' : 'bg-gray-100 text-gray-600',
    };
    const dots = {
      new: 'bg-blue-500',
      reviewed: 'bg-yellow-500',
      approved: 'bg-green-500',
      rejected: 'bg-red-500',
      archived: 'bg-gray-400',
    };
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium capitalize ${styles[status]}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${dots[status]}`} />
        {status}
      </span>
    );
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const SortIcon = ({ field }: { field: keyof DownloadRequest }) => {
    if (sortField !== field) return <i className={`ri-arrow-up-down-line text-sm opacity-40`} />;
    return (
      <i
        className={`${
          sortDirection === 'asc' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'
        } text-sm text-red-600`}
      />
    );
  };

  return (
    <>
      {/* Filters - matching Jobs page style */}
      <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Status:</span>
              <select
                value={selectedStatus}
                onChange={e => {
                  setSelectedStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className={`px-3 py-2 rounded-lg text-sm cursor-pointer ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-200 text-gray-900'
                } border focus:outline-none focus:ring-2 focus:ring-red-600`}
              >
                <option value="all">All</option>
                <option value="new">New</option>
                <option value="reviewed">Reviewed</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {selectedItems.length > 0 && (
              <>
                <button
                  onClick={handleBulkArchive}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
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
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                    darkMode
                      ? 'bg-red-600/20 text-red-400 hover:bg-red-600/30'
                      : 'bg-red-50 text-red-600 hover:bg-red-100'
                  }`}
                >
                  <i className="ri-delete-bin-line mr-1" />
                  Delete ({selectedItems.length})
                </button>
              </>
            )}
            <div
              className={`flex items-center rounded-lg overflow-hidden border ${
                darkMode ? 'border-gray-600' : 'border-gray-200'
              }`}
            >
              <button
                onClick={() => setViewMode('list')}
                className={`w-10 h-9 flex items-center justify-center transition-colors cursor-pointer ${
                  viewMode === 'list' ? 'bg-red-600 text-white' : darkMode ? 'bg-gray-700 text-gray-400 hover:text-white' : 'bg-white text-gray-500 hover:text-gray-700'
                }`}
                title="List View"
              >
                <i className="ri-list-check text-lg" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`w-10 h-9 flex items-center justify-center transition-colors cursor-pointer ${
                  viewMode === 'grid' ? 'bg-red-600 text-white' : darkMode ? 'bg-gray-700 text-gray-400 hover:text-white' : 'bg-white text-gray-500 hover:text-gray-700'
                }`}
                title="Grid View"
              >
                <i className="ri-grid-fill text-lg" />
              </button>
            </div>
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{sortedRequests.length} items</span>
          </div>
        </div>
      </div>

      {/* List View */}
      {viewMode === 'list' ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}>
              <tr>
                <th className="px-4 py-4 text-left w-12">
                  <input
                    type="checkbox"
                    checked={selectedItems.length === paginatedRequests.length && paginatedRequests.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-600 cursor-pointer"
                  />
                </th>
                <th
                  onClick={() => handleSort('requesterName')}
                  className={`px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer transition-colors ${
                    sortField === 'requesterName' ? 'text-red-600' : darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    Requester <SortIcon field="requesterName" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('resourceTitle')}
                  className={`px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer transition-colors ${
                    sortField === 'resourceTitle' ? 'text-red-600' : darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    Resource <SortIcon field="resourceTitle" />
                  </div>
                </th>
                <th className={`px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider w-[150px] ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Purpose
                </th>
                <th
                  onClick={() => handleSort('status')}
                  className={`px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer transition-colors ${
                    sortField === 'status' ? 'text-red-600' : darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    Status <SortIcon field="status" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('requestedAt')}
                  className={`px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer transition-colors ${
                    sortField === 'requestedAt' ? 'text-red-600' : darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    Requested <SortIcon field="requestedAt" />
                  </div>
                </th>
                <th className={`px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
              {paginatedRequests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center">
                    <div className={darkMode ? 'text-gray-500' : 'text-gray-400'}>
                      <i className="ri-inbox-line text-4xl mb-3 block" />
                      <p className="text-sm">No download requests found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedRequests.map(req => (
                  <tr
                    key={req.id}
                    className={`transition-colors cursor-pointer ${
                      darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'
                    } ${selectedItems.includes(req.id) ? (darkMode ? 'bg-gray-700/30' : 'bg-red-50/50') : ''}`}
                    style={req.status === 'new' ? { borderLeft: '4px solid #DC2626' } : undefined}
                    onClick={() => handleView(req)}
                  >
                    <td className="px-4 py-4" onClick={e => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(req.id)}
                        onChange={() => handleSelectItem(req.id)}
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
                          {req.requesterName.charAt(0)}
                        </div>
                        <div>
                          <p
                            className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'} ${
                              req.status === 'new' ? 'font-semibold' : ''
                            }`}
                          >
                            {req.requesterName}
                          </p>
                          <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                            {req.company} &middot; {req.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div>
                        <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{req.resourceTitle}</p>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {req.resourceCategory}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 w-[150px] max-w-[150px]">
                      <p className={`text-sm truncate ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{req.purpose}</p>
                    </td>
                    <td className="px-4 py-4">{getStatusBadge(req.status)}</td>
                    <td className="px-4 py-4">
                      <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{formatDate(req.requestedAt)}</p>
                    </td>
                    <td className="px-4 py-4" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleView(req)}
                          className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                            darkMode ? 'hover:bg-gray-700 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                          }`}
                          title="View"
                        >
                          <i className="ri-eye-line" />
                        </button>
                        <button
                          onClick={() => handleReplyClick(req)}
                          className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                            darkMode ? 'hover:bg-green-600/20 text-gray-400 hover:text-green-400' : 'hover:bg-green-50 text-gray-500 hover:text-green-600'
                          }`}
                          title="Approve & Reply"
                        >
                          <i className="ri-reply-line" />
                        </button>
                        {req.status !== 'rejected' && req.status !== 'archived' && (
                          <button
                            onClick={() => handleReject(req)}
                            className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                              darkMode ? 'hover:bg-red-600/20 text-gray-400 hover:text-red-400' : 'hover:bg-red-50 text-gray-500 hover:text-red-600'
                            }`}
                            title="Reject"
                          >
                            <i className="ri-close-circle-line" />
                          </button>
                        )}
                        {req.status !== 'archived' && (
                          <button
                            onClick={() => handleArchive(req)}
                            className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                              darkMode ? 'hover:bg-gray-700 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                            }`}
                            title="Archive"
                          >
                            <i className="ri-inbox-archive-line" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteClick(req)}
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
      ) : (
        /* Grid View */
        <div className="p-4">
          {paginatedRequests.length === 0 ? (
            <div className="py-12 text-center">
              <div className={darkMode ? 'text-gray-500' : 'text-gray-400'}>
                <i className="ri-inbox-line text-4xl mb-3 block" />
                <p className="text-sm">No download requests found</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {paginatedRequests.map(req => (
                <div
                  key={req.id}
                  className={`rounded-lg border p-4 transition-all hover:shadow-lg cursor-pointer ${
                    darkMode ? 'bg-gray-700/50 border-gray-600 hover:border-gray-500' : 'bg-white border-gray-200 hover:border-gray-300'
                  } ${selectedItems.includes(req.id) ? 'ring-2 ring-red-600' : ''}`}
                  style={req.status === 'new' ? { borderLeft: '4px solid #DC2626' } : undefined}
                  onClick={() => handleView(req)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(req.id)}
                      onChange={() => handleSelectItem(req.id)}
                      onClick={e => e.stopPropagation()}
                      className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-600 cursor-pointer"
                    />
                    {getStatusBadge(req.status)}
                  </div>
                  <div className="flex justify-center mb-3">
                    <div
                      className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold ${
                        darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {req.requesterName.charAt(0)}
                    </div>
                  </div>
                  <h3
                    className={`text-sm font-semibold mb-1 text-center line-clamp-1 ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {req.requesterName}
                  </h3>
                  <p className={`text-xs text-center mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{req.company}</p>
                  <div
                    className={`text-xs px-2 py-1 rounded text-center mb-2 line-clamp-1 ${
                      darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {req.resourceTitle}
                  </div>
                  <p className={`text-xs line-clamp-2 mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{req.purpose}</p>
                  <div className={`text-xs mb-3 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    <i className="ri-calendar-line mr-1" />
                    {formatDate(req.requestedAt)}
                  </div>
                  <div
                    className={`flex items-center justify-center gap-1 pt-3 border-t ${
                      darkMode ? 'border-gray-600' : 'border-gray-200'
                    }`}
                    onClick={e => e.stopPropagation()}
                  >
                    <button
                      onClick={() => handleView(req)}
                      className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                        darkMode ? 'hover:bg-gray-600 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                      }`}
                      title="View"
                    >
                      <i className="ri-eye-line" />
                    </button>
                    <button
                      onClick={() => handleReplyClick(req)}
                      className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                        darkMode ? 'hover:bg-green-600/20 text-gray-400 hover:text-green-400' : 'hover:bg-green-50 text-gray-500 hover:text-green-600'
                      }`}
                      title="Approve"
                    >
                      <i className="ri-reply-line" />
                    </button>
                    {req.status !== 'archived' && (
                      <button
                        onClick={() => handleArchive(req)}
                        className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                          darkMode ? 'hover:bg-gray-600 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                        }`}
                        title="Archive"
                      >
                        <i className="ri-inbox-archive-line" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteClick(req)}
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
      )}

      {/* Pagination */}
      {sortedRequests.length > 0 && (
        <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-6 py-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Show</span>
              <select
                value={itemsPerPage}
                onChange={e => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg text-sm border cursor-pointer ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-red-600`}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>entries</span>
            </div>
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Showing {sortedRequests.length > 0 ? startIndex + 1 : 0} to{' '}
              {Math.min(startIndex + itemsPerPage, sortedRequests.length)} of {sortedRequests.length} entries
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm transition-colors ${
                currentPage === 1
                  ? darkMode
                    ? 'text-gray-600 cursor-not-allowed'
                    : 'text-gray-300 cursor-not-allowed'
                  : darkMode
                  ? 'text-gray-400 hover:bg-gray-700 hover:text-white cursor-pointer'
                  : 'text-gray-600 hover:bg-gray-100 cursor-pointer'
              }`}
            >
              <i className="ri-skip-back-mini-line text-lg" />
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm transition-colors ${
                currentPage === 1
                  ? darkMode
                    ? 'text-gray-600 cursor-not-allowed'
                    : 'text-gray-300 cursor-not-allowed'
                  : darkMode
                  ? 'text-gray-400 hover:bg-gray-700 hover:text-white cursor-pointer'
                  : 'text-gray-600 hover:bg-gray-100 cursor-pointer'
              }`}
            >
              <i className="ri-arrow-left-s-line text-lg" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                  page === currentPage ? 'bg-red-600 text-white' : darkMode ? 'text-gray-400 hover:bg-gray-700 hover:text-white cursor-pointer' : 'text-gray-600 hover:bg-gray-100 cursor-pointer'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm transition-colors ${
                currentPage === totalPages
                  ? darkMode
                    ? 'text-gray-600 cursor-not-allowed'
                    : 'text-gray-300 cursor-not-allowed'
                  : darkMode
                  ? 'text-gray-400 hover:bg-gray-700 hover:text-white cursor-pointer'
                  : 'text-gray-600 hover:bg-gray-100 cursor-pointer'
              }`}
            >
              <i className="ri-arrow-right-s-line text-lg" />
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm transition-colors ${
                currentPage === totalPages
                  ? darkMode
                    ? 'text-gray-600 cursor-not-allowed'
                    : 'text-gray-300 cursor-not-allowed'
                  : darkMode
                  ? 'text-gray-400 hover:bg-gray-700 hover:text-white cursor-pointer'
                  : 'text-gray-600 hover:bg-gray-100 cursor-pointer'
              }`}
            >
              <i className="ri-skip-forward-mini-line text-lg" />
            </button>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowViewModal(false)} />
          <div className={`relative w-full max-w-2xl rounded-xl shadow-xl overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className={`px-6 py-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between`}>
              <h3
                className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}
                style={{ fontFamily: 'Merriweather, serif' }}
              >
                Download Request Details
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
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                  {selectedRequest.requesterName.charAt(0)}
                </div>
                <div className="flex-1">
                  <h4 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedRequest.requesterName}</h4>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{selectedRequest.company}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <a
                      href={`mailto:${selectedRequest.email}`}
                      className={`text-sm flex items-center gap-1 ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
                    >
                      <i className="ri-mail-line" />
                      {selectedRequest.email}
                    </a>
                    <a
                      href={`tel:${selectedRequest.phone}`}
                      className={`text-sm flex items-center gap-1 ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
                    >
                      <i className="ri-phone-line" />
                      {selectedRequest.phone}
                    </a>
                  </div>
                </div>
                {getStatusBadge(selectedRequest.status)}
              </div>
              <div className={`rounded-lg p-4 mb-4 ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs font-semibold uppercase ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Requested Resource</span>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-700'}`}
                  >
                    {selectedRequest.resourceId}
                  </span>
                </div>
                <p className={`text-sm font-medium mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedRequest.resourceTitle}</p>
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-xs font-semibold uppercase ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Category</span>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-700'}`}
                  >
                    {selectedRequest.resourceCategory}
                  </span>
                </div>
                <div className={`border-t pt-3 ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                  <span className={`text-xs font-semibold uppercase block mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Purpose of Download</span>
                  <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{selectedRequest.purpose}</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className={darkMode ? 'text-gray-500' : 'text-gray-400'}>
                  Requested: {formatDate(selectedRequest.requestedAt)}
                </span>
                {selectedRequest.repliedAt && (
                  <span className={darkMode ? 'text-green-400' : 'text-green-600'}>
                    Replied: {formatDate(selectedRequest.repliedAt)}
                  </span>
                )}
              </div>
            </div>
            <div className={`px-6 py-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-end gap-3`}>
              {selectedRequest.status === 'new' && (
                <button
                  onClick={() => {
                    handleMarkAsReviewed(selectedRequest);
                    setShowViewModal(false);
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                    darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Mark as Reviewed
                </button>
              )}
              {selectedRequest.status !== 'rejected' && selectedRequest.status !== 'archived' && (
                <button
                  onClick={() => {
                    handleReject(selectedRequest);
                    setShowViewModal(false);
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                    darkMode ? 'bg-red-600/20 text-red-400 hover:bg-red-600/30' : 'bg-red-50 text-red-600 hover:bg-red-100'
                  }`}
                >
                  <i className="ri-close-circle-line mr-1" />
                  Reject
                </button>
              )}
              <button
                onClick={() => {
                  setShowViewModal(false);
                  handleReplyClick(selectedRequest);
                }}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-colors cursor-pointer whitespace-nowrap"
              >
                <i className="ri-reply-line mr-1" />
                Approve & Reply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reply Modal */}
      {showReplyModal && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowReplyModal(false)} />
          <div className={`relative w-full max-w-xl rounded-xl shadow-xl overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className={`px-6 py-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between`}>
              <h3
                className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}
                style={{ fontFamily: 'Merriweather, serif' }}
              >
                Approve & Reply to {selectedRequest.requesterName}
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
                <p className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {selectedRequest.requesterName} ({selectedRequest.email})
                </p>
                <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  Re: Download request for {selectedRequest.resourceTitle}
                </p>
              </div>
              <div className="mb-4">
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Your Reply</label>
                <textarea
                  value={replyMessage}
                  onChange={e => setReplyMessage(e.target.value)}
                  rows={6}
                  maxLength={500}
                  placeholder="Type your reply message here..."
                  className={`w-full px-4 py-3 rounded-lg border text-sm resize-none ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
                  } focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent`}
                />
                <p className={`text-xs mt-1 text-right ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{replyMessage.length}/500 characters</p>
              </div>
            </div>
            <div className={`px-6 py-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-end gap-3`}>
              <button
                onClick={() => setShowReplyModal(false)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
                    Approve & Send
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-md rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-red-100">
              <i className="ri-delete-bin-line text-2xl text-red-600" />
            </div>
            <h3 className={`text-xl font-bold text-center mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Delete Request?</h3>
            <p className={`text-sm text-center mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Are you sure you want to delete the request from "<strong>{selectedRequest.requesterName}</strong>"? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Cancel
              </button>
              <button onClick={confirmDelete} className="flex-1 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors cursor-pointer whitespace-nowrap">
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
    </>
  );
};

export default DownloadRequests;
