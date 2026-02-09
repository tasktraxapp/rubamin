import { useState } from 'react';

interface Inquiry {
  id: string;
  senderName: string;
  senderEmail: string;
  phone: string;
  company: string;
  subject: string;
  category: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  receivedDate: string;
  repliedAt?: string;
}

interface Response {
  id: string;
  inquiryId: string;
  inquirySubject: string;
  senderName: string;
  senderEmail: string;
  replyMessage: string;
  sentBy: string;
  sentDate: string;
  status: 'sent' | 'delivered' | 'read';
}

const mockInquiries: Inquiry[] = [
  {
    id: 'INQ001',
    senderName: 'Jean-Pierre Mukendi',
    senderEmail: 'jp.mukendi@supplier.com',
    phone: '+243 81 234 5678',
    company: 'Katanga Mining Supplies',
    subject: 'Copper Blister Supply Inquiry',
    category: 'Product Information',
    message:
      'Good morning, I am writing on behalf of Katanga Mining Supplies to inquire about your copper blister products. We are interested in establishing a long-term supply agreement for our operations in Lubumbashi. Could you please provide detailed specifications, pricing structure, minimum order quantities, and delivery terms?',
    status: 'new',
    receivedDate: '2025-01-15T09:30:00',
  },
  {
    id: 'INQ002',
    senderName: 'Marie Kalala',
    senderEmail: 'm.kalala@hospital.cd',
    phone: '+243 99 876 5432',
    company: 'Clinique Ngaliema',
    subject: 'Medical Gas Delivery Schedule',
    category: 'Delivery & Logistics',
    message:
      'We need to adjust our medical oxygen delivery schedule for the next three months due to facility expansion. Can we increase our weekly delivery from 50 cylinders to 75 cylinders starting February 1st? Please confirm availability and any price adjustments.',
    status: 'replied',
    receivedDate: '2025-01-14T14:20:00',
    repliedAt: '2025-01-14T16:45:00',
  },
  {
    id: 'INQ003',
    senderName: 'Patrick Tshisekedi',
    senderEmail: 'p.tshisekedi@construction.cd',
    phone: '+243 82 345 6789',
    company: 'Congo Build Solutions',
    subject: 'Industrial Gas Bulk Order',
    category: 'Pricing & Quotation',
    message:
      'We are working on a major construction project in Kinshasa and require industrial gases (oxygen, acetylene, argon) for welding operations. Project duration is 8 months. Please provide a comprehensive quotation for bulk supply including cylinder rental, delivery, and technical support.',
    status: 'read',
    receivedDate: '2025-01-13T11:15:00',
  },
  {
    id: 'INQ004',
    senderName: 'Sophie Mbuyi',
    senderEmail: 's.mbuyi@university.cd',
    phone: '+243 97 654 3210',
    company: 'University of Kinshasa',
    subject: 'Partnership for Research Project',
    category: 'Partnership & Collaboration',
    message:
      'Our engineering department is conducting research on sustainable copper production methods. We would like to explore potential collaboration opportunities with Ruashi Mining. Could we schedule a meeting to discuss research partnership, facility visits, and data sharing possibilities?',
    status: 'new',
    receivedDate: '2025-01-12T10:00:00',
  },
  {
    id: 'INQ005',
    senderName: 'Emmanuel Kabila',
    senderEmail: 'e.kabila@media.cd',
    phone: '+243 81 987 6543',
    company: 'Radio Okapi',
    subject: 'Interview Request - CSR Initiatives',
    category: 'Media & Press',
    message:
      "I am a journalist with Radio Okapi preparing a feature story on corporate social responsibility in the mining sector. We would like to interview your CSR director about Ruashi Mining's community development programs, particularly the DOT initiative.",
    status: 'replied',
    receivedDate: '2025-01-11T15:30:00',
    repliedAt: '2025-01-11T17:00:00',
  },
  {
    id: 'INQ006',
    senderName: 'André Kasongo',
    senderEmail: 'a.kasongo@logistics.cd',
    phone: '+243 99 123 4567',
    company: 'TransCongo Logistics',
    subject: 'Transportation Services Proposal',
    category: 'Business Proposal',
    message:
      'We specialize in mining logistics and would like to submit a proposal for transporting copper products from your facility to Dar es Salaam port. We offer competitive rates, modern fleet, GPS tracking, and insurance coverage.',
    status: 'read',
    receivedDate: '2025-01-10T13:45:00',
  },
  {
    id: 'INQ007',
    senderName: 'Claudine Mwamba',
    senderEmail: 'c.mwamba@ngo.org',
    phone: '+243 82 456 7890',
    company: 'Environmental Watch DRC',
    subject: 'Environmental Impact Assessment Request',
    category: 'Compliance & Regulatory',
    message:
      'As part of our environmental monitoring program, we request access to your latest ESIA reports and water quality monitoring data for the Lubumbashi region.',
    status: 'new',
    receivedDate: '2025-01-09T09:00:00',
  },
  {
    id: 'INQ008',
    senderName: 'François Ilunga',
    senderEmail: 'f.ilunga@supplier.cd',
    phone: '+243 97 789 0123',
    company: 'Industrial Equipment DRC',
    subject: 'Equipment Maintenance Contract',
    category: 'Technical Support',
    message:
      'We provide maintenance services for industrial gas production equipment. Our team has 15 years of experience with similar facilities. We would like to discuss a comprehensive maintenance contract.',
    status: 'archived',
    receivedDate: '2025-01-08T14:30:00',
  },
  {
    id: 'INQ009',
    senderName: 'Beatrice Nkulu',
    senderEmail: 'b.nkulu@hospital.cd',
    phone: '+243 81 234 5678',
    company: 'Hôpital Général de Référence',
    subject: 'Emergency Medical Gas Supply',
    category: 'Product Information',
    message:
      'We are experiencing an urgent shortage of medical oxygen due to increased patient admissions. Can you provide emergency delivery of 100 cylinders within 48 hours?',
    status: 'replied',
    receivedDate: '2025-01-08T08:15:00',
    repliedAt: '2025-01-08T09:30:00',
  },
  {
    id: 'INQ010',
    senderName: 'Joseph Mutombo',
    senderEmail: 'j.mutombo@trading.cd',
    phone: '+243 99 345 6789',
    company: 'Central Africa Trading',
    subject: 'Export Documentation Requirements',
    category: 'Compliance & Regulatory',
    message:
      'We are interested in exporting your copper products to international markets. Please provide information about export documentation requirements, quality certificates, and customs procedures.',
    status: 'read',
    receivedDate: '2025-01-07T11:20:00',
  },
];

const mockResponses: Response[] = [
  {
    id: 'RES001',
    inquiryId: 'INQ002',
    inquirySubject: 'Medical Gas Delivery Schedule',
    senderName: 'Marie Kalala',
    senderEmail: 'm.kalala@hospital.cd',
    replyMessage:
      'Dear Marie, Thank you for your inquiry. We can accommodate the increased delivery schedule starting February 1st. The price per cylinder will remain the same under your existing contract. Our logistics team will contact you within 24 hours to finalize the updated delivery schedule.',
    sentBy: 'John Doe',
    sentDate: '2025-01-14T16:45:00',
    status: 'read',
  },
  {
    id: 'RES002',
    inquiryId: 'INQ005',
    inquirySubject: 'Interview Request - CSR Initiatives',
    senderName: 'Emmanuel Kabila',
    senderEmail: 'e.kabila@media.cd',
    replyMessage:
      'Dear Emmanuel, Thank you for your interest in our CSR initiatives. Our Communications Director will be happy to arrange an interview. Please contact our media relations team at media@rubamindrc.com to schedule a convenient time.',
    sentBy: 'Sarah Mukendi',
    sentDate: '2025-01-11T17:00:00',
    status: 'delivered',
  },
  {
    id: 'RES003',
    inquiryId: 'INQ009',
    inquirySubject: 'Emergency Medical Gas Supply',
    senderName: 'Beatrice Nkulu',
    senderEmail: 'b.nkulu@hospital.cd',
    replyMessage:
      'Dear Beatrice, We understand the urgency of your situation. We can deliver 100 medical oxygen cylinders within 24 hours. Our emergency response team will contact you immediately to arrange delivery. No additional charges for expedited service in medical emergencies.',
    sentBy: 'David Kabongo',
    sentDate: '2025-01-08T09:30:00',
    status: 'read',
  },
];

export default function UserInquiriesManagement() {
  const [activeTab, setActiveTab] = useState<'inquiries' | 'responses' | 'settings'>('inquiries');
  const [inquiries, setInquiries] = useState<Inquiry[]>(mockInquiries);
  const [responses] = useState<Response[]>(mockResponses);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortColumn, setSortColumn] = useState<'senderName' | 'subject' | 'status' | 'receivedDate'>(
    'receivedDate',
  );
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedInquiries, setSelectedInquiries] = useState<string[]>([]);
  const [viewInquiry, setViewInquiry] = useState<Inquiry | null>(null);
  const [replyInquiry, setReplyInquiry] = useState<Inquiry | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Inquiry | null>(null);

  // Notification settings state
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    newInquiry: true,
    inquiryReplied: true,
    urgentInquiry: true,
    weeklyDigest: false,
    dailySummary: true,
    deliveryFrequency: 'instant' as 'instant' | 'hourly' | 'daily',
    quietHoursEnabled: false,
    quietHoursStart: '22:00',
    quietHoursEnd: '07:00',
    emailRecipients: ['john.doe@rubamindrc.com'],
  });
  const [newRecipient, setNewRecipient] = useState('');

  const categories = [
    'Product Information',
    'Delivery & Logistics',
    'Pricing & Quotation',
    'Partnership & Collaboration',
    'Media & Press',
    'Business Proposal',
    'Compliance & Regulatory',
    'Technical Support',
  ];

  const stats = {
    total: inquiries.length,
    new: inquiries.filter((i) => i.status === 'new').length,
    read: inquiries.filter((i) => i.status === 'read').length,
    replied: inquiries.filter((i) => i.status === 'replied').length,
    archived: inquiries.filter((i) => i.status === 'archived').length,
    totalResponses: responses.length,
  };

  // Filter and sort inquiries
  const filteredInquiries = inquiries
    .filter((inquiry) => {
      const matchesSearch =
        inquiry.senderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inquiry.senderEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inquiry.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inquiry.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inquiry.message.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || inquiry.status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || inquiry.category === categoryFilter;
      return matchesSearch && matchesStatus && matchesCategory;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortColumn) {
        case 'senderName':
          comparison = a.senderName.localeCompare(b.senderName);
          break;
        case 'subject':
          comparison = a.subject.localeCompare(b.subject);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'receivedDate':
          comparison = new Date(a.receivedDate).getTime() - new Date(b.receivedDate).getTime();
          break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

  const totalPages = Math.ceil(filteredInquiries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedInquiries = filteredInquiries.slice(startIndex, endIndex);

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

  const handleSort = (column: 'senderName' | 'subject' | 'status' | 'receivedDate') => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (column: 'senderName' | 'subject' | 'status' | 'receivedDate') => {
    if (sortColumn !== column) {
      return <i className="ri-arrow-up-down-line text-xs ml-1 text-gray-400" />;
    }
    return sortDirection === 'asc' ? (
      <i className="ri-arrow-up-line text-xs ml-1" />
    ) : (
      <i className="ri-arrow-down-line text-xs ml-1" />
    );
  };

  const handleSelectAll = () => {
    if (selectedInquiries.length === paginatedInquiries.length) {
      setSelectedInquiries([]);
    } else {
      setSelectedInquiries(paginatedInquiries.map((i) => i.id));
    }
  };

  const handleSelectInquiry = (id: string) => {
    setSelectedInquiries((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleMarkAsRead = (id: string) => {
    setInquiries((prev) =>
      prev.map((inquiry) =>
        inquiry.id === id && inquiry.status === 'new' ? { ...inquiry, status: 'read' } : inquiry,
      ),
    );
  };

  const handleArchive = (id: string) => {
    setInquiries((prev) =>
      prev.map((inquiry) => (inquiry.id === id ? { ...inquiry, status: 'archived' } : inquiry)),
    );
  };

  const handleBulkArchive = () => {
    setInquiries((prev) =>
      prev.map((inquiry) =>
        selectedInquiries.includes(inquiry.id) ? { ...inquiry, status: 'archived' } : inquiry,
      ),
    );
    setSelectedInquiries([]);
  };

  const handleDeleteClick = (inquiry: Inquiry) => {
    setDeleteTarget(inquiry);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      setInquiries((prev) => prev.filter((inquiry) => inquiry.id !== deleteTarget.id));
    }
    setShowDeleteModal(false);
    setDeleteTarget(null);
  };

  const handleBulkDelete = () => {
    setInquiries((prev) => prev.filter((inquiry) => !selectedInquiries.includes(inquiry.id)));
    setSelectedInquiries([]);
  };

  const handleViewInquiry = (inquiry: Inquiry) => {
    setViewInquiry(inquiry);
    if (inquiry.status === 'new') {
      handleMarkAsRead(inquiry.id);
    }
  };

  const handleSendReply = async () => {
    if (!replyInquiry || !replyMessage.trim()) return;

    setIsSending(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setInquiries((prev) =>
      prev.map((inquiry) =>
        inquiry.id === replyInquiry.id
          ? { ...inquiry, status: 'replied', repliedAt: new Date().toISOString() }
          : inquiry,
      ),
    );

    setIsSending(false);
    setReplyMessage('');
    setReplyInquiry(null);
  };

  const handleAddRecipient = () => {
    if (
      newRecipient &&
      newRecipient.includes('@') &&
      !notificationSettings.emailRecipients.includes(newRecipient)
    ) {
      setNotificationSettings((prev) => ({
        ...prev,
        emailRecipients: [...prev.emailRecipients, newRecipient],
      }));
      setNewRecipient('');
    }
  };

  const handleRemoveRecipient = (email: string) => {
    setNotificationSettings((prev) => ({
      ...prev,
      emailRecipients: prev.emailRecipients.filter((e) => e !== email),
    }));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      new: 'bg-blue-50 text-blue-700',
      read: 'bg-yellow-50 text-yellow-700',
      replied: 'bg-green-50 text-green-700',
      archived: 'bg-gray-100 text-gray-600',
      sent: 'bg-blue-50 text-blue-700',
      delivered: 'bg-yellow-50 text-yellow-700',
    };
    const dots: Record<string, string> = {
      new: 'bg-blue-500',
      read: 'bg-yellow-500',
      replied: 'bg-green-500',
      archived: 'bg-gray-400',
      sent: 'bg-blue-500',
      delivered: 'bg-yellow-500',
    };
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium capitalize ${
          styles[status] || 'bg-gray-100 text-gray-600'
        }`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${dots[status] || 'bg-gray-400'}`} />
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header with Title */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-4 sm:p-6 pb-4">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900" style={{ fontFamily: 'Merriweather, serif' }}>
            Inquiries Management
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage and respond to contact form submissions and customer inquiries
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 px-4 sm:px-6 pb-4 sm:pb-6">
          <div className="rounded-lg p-4 border bg-gray-50 border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">New Inquiries</p>
                <p className="text-2xl font-bold mt-1 text-gray-900">{stats.new}</p>
              </div>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-red-50">
                <i className="ri-mail-unread-line text-lg text-red-600" />
              </div>
            </div>
          </div>
          <div className="rounded-lg p-4 border bg-gray-50 border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Read</p>
                <p className="text-2xl font-bold mt-1 text-gray-900">{stats.read}</p>
              </div>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-yellow-50">
                <i className="ri-mail-open-line text-lg text-yellow-600" />
              </div>
            </div>
          </div>
          <div className="rounded-lg p-4 border bg-gray-50 border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Replied</p>
                <p className="text-2xl font-bold mt-1 text-gray-900">{stats.replied}</p>
              </div>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-green-50">
                <i className="ri-reply-line text-lg text-green-600" />
              </div>
            </div>
          </div>
          <div className="rounded-lg p-4 border bg-gray-50 border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Archived</p>
                <p className="text-2xl font-bold mt-1 text-gray-900">{stats.archived}</p>
              </div>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gray-100">
                <i className="ri-inbox-archive-line text-lg text-gray-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200 overflow-x-auto">
          <nav className="flex -mb-px min-w-max">
            <button
              onClick={() => setActiveTab('inquiries')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'inquiries'
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <i className="ri-mail-line mr-2" />
              Inquiries
              {stats.new > 0 && (
                <span className="ml-2 px-2 py-0.5 text-xs font-bold rounded-full bg-red-600 text-white">
                  {stats.new}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('responses')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'responses'
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <i className="ri-reply-all-line mr-2" />
              Sent Responses
              <span className="ml-2 px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
                {stats.totalResponses}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'settings'
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <i className="ri-notification-3-line mr-2" />
              Notification Settings
            </button>
          </nav>
        </div>

        {/* Inquiries Tab */}
        {activeTab === 'inquiries' && (
          <div>
            {/* Filters Bar */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 sm:gap-4">
                {/* Search */}
                <div className="relative flex-1 min-w-[200px] max-w-md">
                  <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search inquiries..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  />
                </div>

                {/* Status Filter */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-600 hidden sm:inline">Status:</span>
                  <select
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="px-3 py-2 rounded-lg text-sm border border-gray-200 bg-gray-50 text-gray-900 cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-600"
                  >
                    <option value="all">All ({stats.total})</option>
                    <option value="new">New ({stats.new})</option>
                    <option value="read">Read ({stats.read})</option>
                    <option value="replied">Replied ({stats.replied})</option>
                    <option value="archived">Archived ({stats.archived})</option>
                  </select>
                </div>

                {/* Category Filter */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-600 hidden sm:inline">Category:</span>
                  <select
                    value={categoryFilter}
                    onChange={(e) => {
                      setCategoryFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="px-3 py-2 rounded-lg text-sm border border-gray-200 bg-gray-50 text-gray-900 cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-600"
                  >
                    <option value="all">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Bulk Actions */}
                {selectedInquiries.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">{selectedInquiries.length} selected</span>
                    <button
                      onClick={handleBulkArchive}
                      className="px-3 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <i className="ri-inbox-archive-line mr-1" />
                      Archive
                    </button>
                    <button
                      onClick={handleBulkDelete}
                      className="px-3 py-2 rounded-lg text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <i className="ri-delete-bin-line mr-1" />
                      Delete
                    </button>
                  </div>
                )}

                {/* View Toggle & Count */}
                <div className="flex items-center gap-3 sm:ml-auto">
                  <div className="flex items-center rounded-lg overflow-hidden border border-gray-200">
                    <button
                      onClick={() => setViewMode('list')}
                      className={`w-10 h-9 flex items-center justify-center transition-colors cursor-pointer ${
                        viewMode === 'list' ? 'bg-red-600 text-white' : 'bg-white text-gray-500 hover:text-gray-700'
                      }`}
                      title="List View"
                    >
                      <i className="ri-list-check text-lg" />
                    </button>
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`w-10 h-9 flex items-center justify-center transition-colors cursor-pointer ${
                        viewMode === 'grid' ? 'bg-red-600 text-white' : 'bg-white text-gray-500 hover:text-gray-700'
                      }`}
                      title="Grid View"
                    >
                      <i className="ri-grid-fill text-lg" />
                    </button>
                  </div>
                  <span className="text-sm text-gray-600 hidden sm:inline">{filteredInquiries.length} items</span>
                </div>
              </div>
            </div>

            {/* List View */}
            {viewMode === 'list' ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-4 text-left">
                        <input
                          type="checkbox"
                          checked={
                            selectedInquiries.length === paginatedInquiries.length &&
                            paginatedInquiries.length > 0
                          }
                          onChange={handleSelectAll}
                          className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-600/20 cursor-pointer"
                        />
                      </th>
                      <th
                        className={`px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer select-none transition-colors ${
                          sortColumn === 'senderName' ? 'text-red-600' : 'text-gray-600 hover:text-gray-900'
                        }`}
                        onClick={() => handleSort('senderName')}
                      >
                        <div className="flex items-center">
                          Sender
                          {getSortIcon('senderName')}
                        </div>
                      </th>
                      <th
                        className={`px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer select-none transition-colors ${
                          sortColumn === 'subject' ? 'text-red-600' : 'text-gray-600 hover:text-gray-900'
                        }`}
                        onClick={() => handleSort('subject')}
                      >
                        <div className="flex items-center">
                          Subject
                          {getSortIcon('subject')}
                        </div>
                      </th>
                      <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 w-[150px]">
                        Message
                      </th>
                      <th
                        className={`px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer select-none transition-colors ${
                          sortColumn === 'status' ? 'text-red-600' : 'text-gray-600 hover:text-gray-900'
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
                          sortColumn === 'receivedDate' ? 'text-red-600' : 'text-gray-600 hover:text-gray-900'
                        }`}
                        onClick={() => handleSort('receivedDate')}
                      >
                        <div className="flex items-center">
                          Received
                          {getSortIcon('receivedDate')}
                        </div>
                      </th>
                      <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {paginatedInquiries.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-12 text-center">
                          <div className="text-gray-400">
                            <i className="ri-inbox-line text-4xl mb-3 block" />
                            <p className="text-sm">No inquiries found</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      paginatedInquiries.map((inquiry) => (
                        <tr
                          key={inquiry.id}
                          className={`transition-colors cursor-pointer hover:bg-gray-50 ${
                            selectedInquiries.includes(inquiry.id) ? 'bg-red-50/50' : ''
                          }`}
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
                              <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 bg-gray-100 text-gray-700">
                                {inquiry.senderName.charAt(0)}
                              </div>
                              <div>
                                <p
                                  className={`text-sm font-medium text-gray-900 ${
                                    inquiry.status === 'new' ? 'font-semibold' : ''
                                  }`}
                                >
                                  {inquiry.senderName}
                                </p>
                                <p className="text-xs text-gray-400">{inquiry.senderEmail}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                              {inquiry.subject}
                            </span>
                          </td>
                          <td className="px-4 py-4 w-[150px] max-w-[150px]">
                            <p className="text-sm truncate text-gray-600">{inquiry.message}</p>
                          </td>
                          <td className="px-4 py-4">{getStatusBadge(inquiry.status)}</td>
                          <td className="px-4 py-4">
                            <p className="text-sm text-gray-700">{formatDate(inquiry.receivedDate)}</p>
                          </td>
                          <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleViewInquiry(inquiry)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer hover:bg-gray-100 text-gray-500 hover:text-gray-900"
                                title="View"
                              >
                                <i className="ri-eye-line" />
                              </button>
                              <button
                                onClick={() => setReplyInquiry(inquiry)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer hover:bg-green-50 text-gray-500 hover:text-green-600"
                                title="Reply"
                              >
                                <i className="ri-reply-line" />
                              </button>
                              {inquiry.status !== 'archived' && (
                                <button
                                  onClick={() => handleArchive(inquiry.id)}
                                  className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer hover:bg-gray-100 text-gray-500 hover:text-gray-900"
                                  title="Archive"
                                >
                                  <i className="ri-inbox-archive-line" />
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteClick(inquiry)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer hover:bg-red-50 text-gray-500 hover:text-red-600"
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
                {paginatedInquiries.length === 0 ? (
                  <div className="py-12 text-center">
                    <div className="text-gray-400">
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
                            ? 'bg-white border-l-4 border-l-red-600 border-t-gray-200 border-r-gray-200 border-b-gray-200 hover:border-t-gray-300 hover:border-r-gray-300 hover:border-b-gray-300'
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
                          <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 bg-gray-100 text-gray-700">
                            {inquiry.senderName.charAt(0)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold truncate text-gray-900">{inquiry.senderName}</p>
                            <p className="text-xs truncate text-gray-500">{inquiry.company}</p>
                          </div>
                        </div>

                        <div className="mb-3">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mb-2 bg-gray-200 text-gray-700">
                            {inquiry.subject}
                          </span>
                          <p className="text-xs line-clamp-2 text-gray-500">{inquiry.message}</p>
                        </div>

                        <div className="text-xs mb-3 text-gray-400">{formatDate(inquiry.receivedDate)}</div>

                        <div className="flex items-center justify-center gap-1 pt-3 border-t border-gray-200" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => handleViewInquiry(inquiry)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer hover:bg-gray-100 text-gray-500 hover:text-gray-900"
                            title="View"
                          >
                            <i className="ri-eye-line" />
                          </button>
                          <button
                            onClick={() => setReplyInquiry(inquiry)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer hover:bg-green-50 text-gray-500 hover:text-green-600"
                            title="Reply"
                          >
                            <i className="ri-reply-line" />
                          </button>
                          {inquiry.status !== 'archived' && (
                            <button
                              onClick={() => handleArchive(inquiry.id)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer hover:bg-gray-100 text-gray-500 hover:text-gray-900"
                              title="Archive"
                            >
                              <i className="ri-inbox-archive-line" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteClick(inquiry)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer hover:bg-red-50 text-gray-500 hover:text-red-600"
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
            {filteredInquiries.length > 0 && (
              <div className="px-4 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-sm transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                    >
                      <i className="ri-skip-back-mini-line" />
                    </button>
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-sm transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                    >
                      <i className="ri-arrow-left-s-line" />
                    </button>
                    {getPageNumbers().map((page, idx) =>
                      typeof page === 'string' ? (
                        <span key={`ellipsis-${idx}`} className="w-8 h-8 flex items-center justify-center text-sm text-gray-400">
                          ...
                        </span>
                      ) : (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                            currentPage === page ? 'bg-red-600 text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                          }`}
                        >
                          {page}
                        </button>
                      ),
                    )}
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages || totalPages === 0}
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-sm transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                    >
                      <i className="ri-arrow-right-s-line" />
                    </button>
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages || totalPages === 0}
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-sm transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                    >
                      <i className="ri-skip-forward-mini-line" />
                    </button>
                  </div>
                  <span className="text-sm text-gray-600 hidden sm:inline">
                    Showing {startIndex + 1} to {Math.min(endIndex, filteredInquiries.length)} of{' '}
                    {filteredInquiries.length} entries
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Responses Tab */}
        {activeTab === 'responses' && (
          <div className="p-6">
            <div className="space-y-4">
              {responses.length === 0 ? (
                <div className="py-12 text-center">
                  <div className="text-gray-400">
                    <i className="ri-reply-all-line text-4xl mb-3 block" />
                    <p className="text-sm">No responses sent yet</p>
                  </div>
                </div>
              ) : (
                responses.map((response) => (
                  <div
                    key={response.id}
                    className="rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold bg-green-100 text-green-700">
                          <i className="ri-reply-line" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">Re: {response.inquirySubject}</p>
                          <p className="text-xs text-gray-500">
                            To: {response.senderName} ({response.senderEmail})
                          </p>
                        </div>
                      </div>
                      {getStatusBadge(response.status)}
                    </div>
                    <p className="text-sm text-gray-700 mb-3 line-clamp-2">{response.replyMessage}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Sent by: {response.sentBy}</span>
                      <span>{formatDate(response.sentDate)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Notification Settings Tab */}
        {activeTab === 'settings' && (
          <div className="p-4 sm:p-6 space-y-6">
            {/* Master Toggle */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-red-100">
                  <i className="ri-mail-settings-line text-lg text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Email Notifications</p>
                  <p className="text-xs text-gray-500">Receive email alerts for inquiry activities</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationSettings.emailNotifications}
                  onChange={(e) => setNotificationSettings((prev) => ({ ...prev, emailNotifications: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
              </label>
            </div>

            {notificationSettings.emailNotifications && (
              <>
                {/* Alert Types */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                    <h3 className="text-sm font-semibold text-gray-900">Alert Types</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Choose which events trigger email notifications</p>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {[
                      { key: 'newInquiry', label: 'New Inquiry Received', desc: 'Get notified when a new inquiry is submitted', icon: 'ri-mail-add-line' },
                      { key: 'inquiryReplied', label: 'Inquiry Replied', desc: 'Get notified when a reply is sent', icon: 'ri-reply-line' },
                      { key: 'urgentInquiry', label: 'Urgent Inquiries', desc: 'Get notified for high-priority inquiries', icon: 'ri-alarm-warning-line' },
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-100">
                            <i className={`${item.icon} text-gray-600`} />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{item.label}</p>
                            <p className="text-xs text-gray-500">{item.desc}</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notificationSettings[item.key as keyof typeof notificationSettings] as boolean}
                            onChange={(e) => setNotificationSettings((prev) => ({ ...prev, [item.key]: e.target.checked }))}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Summary Reports */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                    <h3 className="text-sm font-semibold text-gray-900">Summary Reports</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Receive periodic summary emails</p>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {[
                      { key: 'dailySummary', label: 'Daily Summary', desc: 'Receive a daily digest of all inquiry activities', icon: 'ri-calendar-line' },
                      { key: 'weeklyDigest', label: 'Weekly Report', desc: 'Receive a weekly summary report', icon: 'ri-calendar-2-line' },
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-100">
                            <i className={`${item.icon} text-gray-600`} />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{item.label}</p>
                            <p className="text-xs text-gray-500">{item.desc}</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notificationSettings[item.key as keyof typeof notificationSettings] as boolean}
                            onChange={(e) => setNotificationSettings((prev) => ({ ...prev, [item.key]: e.target.checked }))}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery Frequency */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                    <h3 className="text-sm font-semibold text-gray-900">Delivery Frequency</h3>
                    <p className="text-xs text-gray-500 mt-0.5">How often should we send notifications?</p>
                  </div>
                  <div className="p-4">
                    <div className="flex flex-col sm:flex-row flex-wrap gap-3">
                      {[
                        { value: 'instant', label: 'Instant', icon: 'ri-flashlight-line' },
                        { value: 'hourly', label: 'Hourly', icon: 'ri-time-line' },
                        { value: 'daily', label: 'Daily', icon: 'ri-calendar-line' },
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() =>
                            setNotificationSettings((prev) => ({ ...prev, deliveryFrequency: option.value as any }))
                          }
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                            notificationSettings.deliveryFrequency === option.value
                              ? 'bg-red-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          <i className={option.icon} />
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Quiet Hours */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">Quiet Hours</h3>
                      <p className="text-xs text-gray-500 mt-0.5">Pause notifications during specific hours</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificationSettings.quietHoursEnabled}
                        onChange={(e) =>
                          setNotificationSettings((prev) => ({ ...prev, quietHoursEnabled: e.target.checked }))
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                    </label>
                  </div>
                  {notificationSettings.quietHoursEnabled && (
                    <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                      <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-600 hidden sm:inline">From:</label>
                        <input
                          type="time"
                          value={notificationSettings.quietHoursStart}
                          onChange={(e) =>
                            setNotificationSettings((prev) => ({ ...prev, quietHoursStart: e.target.value }))
                          }
                          className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-600"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-600 hidden sm:inline">To:</label>
                        <input
                          type="time"
                          value={notificationSettings.quietHoursEnd}
                          onChange={(e) =>
                            setNotificationSettings((prev) => ({ ...prev, quietHoursEnd: e.target.value }))
                          }
                          className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-600"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Email Recipients */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                    <h3 className="text-sm font-semibold text-gray-900">Email Recipients</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Manage who receives notification emails</p>
                  </div>
                  <div className="p-4">
                    <div className="flex gap-2 mb-4">
                      <input
                        type="email"
                        value={newRecipient}
                        onChange={(e) => setNewRecipient(e.target.value)}
                        placeholder="Enter email address"
                        className="flex-1 px-4 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-600"
                      />
                      <button
                        onClick={handleAddRecipient}
                        className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer whitespace-nowrap"
                      >
                        <i className="ri-add-line mr-1" />
                        Add
                      </button>
                    </div>
                    <div className="space-y-2">
                      {notificationSettings.emailRecipients.map((email) => (
                        <div key={email} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <i className="ri-mail-line text-gray-400" />
                            <span className="text-sm text-gray-700">{email}</span>
                          </div>
                          <button
                            onClick={() => handleRemoveRecipient(email)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          >
                            <i className="ri-close-line" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* View Inquiry Modal */}
      {viewInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setViewInquiry(null)} />
          <div className="relative w-full max-w-2xl rounded-xl shadow-xl overflow-hidden bg-white">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900" style={{ fontFamily: 'Merriweather, serif' }}>
                Inquiry Details
              </h3>
              <button
                onClick={() => setViewInquiry(null)}
                className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer hover:bg-gray-100 text-gray-500"
              >
                <i className="ri-close-line text-xl" />
              </button>
            </div>
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold bg-gray-100 text-gray-700">
                  {viewInquiry.senderName.charAt(0)}
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900">{viewInquiry.senderName}</h4>
                  <p className="text-sm text-gray-500">{viewInquiry.company}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <a href={`mailto:${viewInquiry.senderEmail}`} className="text-sm flex items-center gap-1 text-red-600 hover:text-red-700">
                      <i className="ri-mail-line" />
                      {viewInquiry.senderEmail}
                    </a>
                    {viewInquiry.phone && (
                      <a href={`tel:${viewInquiry.phone}`} className="text-sm flex items-center gap-1 text-red-600 hover:text-red-700">
                        <i className="ri-phone-line" />
                        {viewInquiry.phone}
                      </a>
                    )}
                  </div>
                </div>
                {getStatusBadge(viewInquiry.status)}
              </div>

              <div className="rounded-lg p-4 mb-4 bg-gray-50">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-semibold uppercase text-gray-500">Subject</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-200 text-gray-700">{viewInquiry.subject}</span>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-semibold uppercase text-gray-500">Category</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700">{viewInquiry.category}</span>
                </div>
                <p className="text-sm leading-relaxed text-gray-700">{viewInquiry.message}</p>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">Received: {formatDate(viewInquiry.receivedDate)}</span>
                {viewInquiry.repliedAt && <span className="text-green-600">Replied: {formatDate(viewInquiry.repliedAt)}</span>}
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
              {viewInquiry.status === 'new' && (
                <button
                  onClick={() => {
                    handleMarkAsRead(viewInquiry.id);
                    setViewInquiry(null);
                  }}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer bg-gray-100 text-gray-700 hover:bg-gray-200 whitespace-nowrap"
                >
                  Mark as Read
                </button>
              )}
              <button
                onClick={() => {
                  setReplyInquiry(viewInquiry);
                  setViewInquiry(null);
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
      {replyInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setReplyInquiry(null)} />
          <div className="relative w-full max-w-xl rounded-xl shadow-xl overflow-hidden bg-white">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900" style={{ fontFamily: 'Merriweather, serif' }}>
                Reply to {replyInquiry.senderName}
              </h3>
              <button
                onClick={() => {
                  setReplyInquiry(null);
                  setReplyMessage('');
                }}
                className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer hover:bg-gray-100 text-gray-500"
              >
                <i className="ri-close-line text-xl" />
              </button>
            </div>
            <div className="p-6">
              <div className="rounded-lg p-3 mb-4 bg-gray-50">
                <p className="text-xs font-medium mb-1 text-gray-500">To:</p>
                <p className="text-sm text-gray-900">{replyInquiry.senderEmail}</p>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-700">Your Reply</label>
                <textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  rows={6}
                  maxLength={500}
                  placeholder="Type your reply message here..."
                  className="w-full px-4 py-3 rounded-lg border text-sm resize-none bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                />
                <p className="text-xs mt-1 text-right text-gray-400">{replyMessage.length}/500 characters</p>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setReplyInquiry(null);
                  setReplyMessage('');
                }}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer bg-gray-100 text-gray-700 hover:bg-gray-200 whitespace-nowrap"
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
      {showDeleteModal && deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowDeleteModal(false)} />
          <div className="relative w-full max-w-md rounded-xl p-6 shadow-xl bg-white">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-red-50">
                <i className="ri-delete-bin-line text-3xl text-red-600" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900" style={{ fontFamily: 'Merriweather, serif' }}>
                Delete Inquiry?
              </h3>
              <p className="text-sm mb-6 text-gray-600">
                Are you sure you want to delete the inquiry from "<strong>{deleteTarget.senderName}</strong>"? This
                action cannot be undone.
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer bg-gray-100 text-gray-700 hover:bg-gray-200 whitespace-nowrap"
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
