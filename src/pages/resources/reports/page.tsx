import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../../../components/feature/Header';
import { Footer } from '../../../components/feature/Footer';

const ReportsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedResource, setSelectedResource] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const itemsPerPage = 6;

  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`;
  };

  const subMenuItems = [
    { label: 'All Resources', path: '/resources' },
    { label: 'Statistics Report', path: '/resources/statistics-report' },
    { label: 'Financials Report', path: '/resources/financials-report' },
    { label: 'Contracts', path: '/resources/contracts' },
    { label: 'Reports', path: '/resources/reports' },
    { label: 'Policies', path: '/resources/policies' },
    { label: 'Certifications', path: '/resources/certifications' },
    { label: 'Affiliations', path: '/resources/affiliations' },
    { label: 'Awards', path: '/resources/awards' },
  ];

  const resources = [
    {
      title: 'Sustainability Report 2023',
      category: 'Reports',
      type: 'PDF',
      size: '3.2 MB',
      date: '2023-12-15',
      icon: 'ri-file-paper-line',
    },
    {
      title: 'HSE Performance Report',
      category: 'Reports',
      type: 'PDF',
      size: '2.1 MB',
      date: '2023-11-20',
      icon: 'ri-file-paper-line',
    },
    {
      title: 'Environmental Impact Assessment',
      category: 'Reports',
      type: 'PDF',
      size: '2.8 MB',
      date: '2023-10-30',
      icon: 'ri-file-paper-line',
    },
    {
      title: 'Corporate Social Responsibility Report',
      category: 'Reports',
      type: 'PDF',
      size: '2.5 MB',
      date: '2023-09-25',
      icon: 'ri-file-paper-line',
    },
    {
      title: 'Quality Assurance Report Q3',
      category: 'Reports',
      type: 'PDF',
      size: '1.7 MB',
      date: '2023-10-15',
      icon: 'ri-file-paper-line',
    },
    {
      title: 'Operational Excellence Report',
      category: 'Reports',
      type: 'PDF',
      size: '2.3 MB',
      date: '2023-08-20',
      icon: 'ri-file-paper-line',
    },
    {
      title: 'Annual Compliance Report',
      category: 'Reports',
      type: 'PDF',
      size: '1.9 MB',
      date: '2023-07-15',
      icon: 'ri-file-paper-line',
    },
    {
      title: 'Risk Assessment Report',
      category: 'Reports',
      type: 'PDF',
      size: '2.0 MB',
      date: '2023-06-28',
      icon: 'ri-file-paper-line',
    },
  ];

  const filteredResources = useMemo(() => {
    return resources.filter((resource) => {
      const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [searchQuery]);

  const totalPages = Math.ceil(filteredResources.length / itemsPerPage);

  const paginatedResources = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredResources.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredResources, currentPage]);

  const clearFilters = () => {
    setSearchQuery('');
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
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

  useMemo(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handleRequestDownload = (resourceTitle: string) => {
    setSelectedResource(resourceTitle);
    setShowModal(true);
    setSubmitSuccess(false);
    setFormData({
      companyName: '',
      contactPerson: '',
      email: '',
      phone: '',
      address: '',
    });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required';
    if (!formData.contactPerson.trim()) newErrors.contactPerson = 'Contact person is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const formBody = new URLSearchParams();
      formBody.append('companyName', formData.companyName);
      formBody.append('contactPerson', formData.contactPerson);
      formBody.append('email', formData.email);
      formBody.append('phone', formData.phone);
      formBody.append('address', formData.address);
      formBody.append('resourceTitle', selectedResource || '');

      await fetch('https://readdy.ai/api/form/d62gsrg0h9ov63emh7h0', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formBody.toString(),
      });

      setSubmitSuccess(true);
      setTimeout(() => {
        setShowModal(false);
        setSubmitSuccess(false);
      }, 2000);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[400px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://readdy.ai/api/search-image?query=corporate%20business%20reports%20and%20documentation%20professional%20report%20folders%20with%20charts%20and%20analysis%20sustainability%20reports%20on%20desk%20modern%20office%20setting%20with%20organized%20documents&width=1920&height=400&seq=reports-hero-001&orientation=landscape)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50"></div>
        </div>

        <div className="relative h-full max-w-[1320px] mx-auto px-10 flex flex-col justify-end pb-12">
          <h1 className="text-5xl font-bold text-white mb-4" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
            Reports
          </h1>
          <p className="text-white text-xl font-light" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.3)' }}>
            Comprehensive corporate and sustainability reports
          </p>
        </div>
      </section>

      {/* Sub Navigation Pills */}
      <section className="py-6 bg-white border-b border-gray-100">
        <div className="max-w-[1320px] mx-auto px-6">
          <div className="flex items-center justify-center flex-wrap gap-3">
            {subMenuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
                  item.path === '/resources/reports'
                    ? 'bg-[#DC2626] text-white'
                    : 'bg-gray-100 text-[#2C3E50] hover:bg-gray-200'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-white border-b border-gray-100">
        <div className="max-w-[1320px] mx-auto px-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[300px]">
              <i className="ri-search-line absolute left-4 top-1/2 -translate-y-1/2 text-[#6C757D]"></i>
              <input
                type="text"
                placeholder="Search reports..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-[#F8F9FA] border border-gray-200 rounded-xl text-sm text-[#2C3E50] placeholder-[#6C757D] focus:outline-none focus:border-[#DC2626] focus:ring-1 focus:ring-[#DC2626] transition-all"
              />
            </div>

            {searchQuery && (
              <button
                onClick={clearFilters}
                className="px-4 py-3 text-sm text-[#DC2626] font-medium hover:bg-[#FEF2F2] rounded-xl transition-all cursor-pointer whitespace-nowrap"
              >
                <i className="ri-close-line mr-1"></i>
                Clear Search
              </button>
            )}
          </div>

          <div className="mt-4 text-sm text-[#6C757D]">
            Showing {filteredResources.length} of {resources.length} reports
          </div>
        </div>
      </section>

      {/* Resources List - Horizontal View */}
      <section className="py-16 bg-[#F8F9FA]">
        <div className="max-w-[1320px] mx-auto px-6">
          {filteredResources.length > 0 ? (
            <>
              <div className="flex flex-col gap-4">
                {paginatedResources.map((resource, index) => (
                  <div key={index} className="bg-white rounded-2xl p-6 hover:shadow-lg transition-all border border-gray-100 flex items-center gap-6">
                    <div className="w-14 h-14 bg-[#FEF2F2] rounded-full flex items-center justify-center flex-shrink-0">
                      <i className={`${resource.icon} text-2xl text-[#DC2626]`}></i>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-[#2C3E50] truncate">
                        {resource.title}
                      </h3>
                      <p className="text-sm text-[#DC2626] font-medium">{resource.category}</p>
                    </div>

                    <span className="px-3 py-1 bg-[#F8F9FA] text-[#6C757D] text-xs font-medium rounded-full flex-shrink-0">
                      {resource.type}
                    </span>

                    <div className="flex items-center text-sm text-[#6C757D] flex-shrink-0 w-28">
                      <i className="ri-calendar-line mr-2"></i>
                      {formatDate(resource.date)}
                    </div>

                    <div className="flex items-center text-sm text-[#6C757D] flex-shrink-0 w-20">
                      <i className="ri-file-line mr-2"></i>
                      {resource.size}
                    </div>

                    <div className="flex items-center space-x-3 flex-shrink-0">
                      <button className="px-4 py-2 text-sm font-medium text-[#2C3E50] border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap">
                        View
                      </button>
                      <button
                        onClick={() => handleRequestDownload(resource.title)}
                        className="px-4 py-2 bg-[#DC2626] text-white text-sm font-medium rounded-lg cursor-pointer whitespace-nowrap flex items-center"
                      >
                        <i className="ri-download-line mr-2"></i>
                        Request Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all cursor-pointer ${
                      currentPage === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-[#2C3E50] hover:bg-[#FEF2F2] hover:text-[#DC2626]'
                    }`}
                  >
                    <i className="ri-arrow-left-s-line text-xl"></i>
                  </button>

                  {getPageNumbers().map((page, index) => (
                    <button
                      key={index}
                      onClick={() => typeof page === 'number' && handlePageChange(page)}
                      disabled={page === '...'}
                      className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-all ${
                        page === '...'
                          ? 'bg-transparent text-[#6C757D] cursor-default'
                          : page === currentPage
                          ? 'bg-[#DC2626] text-white cursor-pointer'
                          : 'bg-white text-[#2C3E50] hover:bg-gray-100 cursor-pointer'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all cursor-pointer ${
                      currentPage === totalPages
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-[#2C3E50] hover:bg-[#FEF2F2] hover:text-[#DC2626]'
                    }`}
                  >
                    <i className="ri-arrow-right-s-line text-xl"></i>
                  </button>
                </div>
              )}

              {totalPages > 1 && (
                <div className="text-center mt-4 text-sm text-[#6C757D]">
                  Page {currentPage} of {totalPages}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-[#FEF2F2] rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="ri-file-search-line text-4xl text-[#DC2626]"></i>
              </div>
              <h3 className="text-xl font-bold text-[#2C3E50] mb-2">No resources found</h3>
              <p className="text-[#6C757D] mb-6">Try adjusting your search or filter criteria</p>
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-[#DC2626] text-white text-sm font-medium rounded-lg cursor-pointer whitespace-nowrap"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Request Download Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-8 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <i className="ri-close-line text-2xl"></i>
            </button>

            {submitSuccess ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-check-line text-3xl text-green-600"></i>
                </div>
                <h3 className="text-2xl font-bold text-[#2C3E50] mb-2">Request Submitted!</h3>
                <p className="text-[#6C757D]">You will receive the resource document via email shortly.</p>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-bold text-[#2C3E50] mb-2">Request Resource Download</h3>
                <p className="text-sm text-[#6C757D] mb-6">
                  Resource: <span className="font-semibold">{selectedResource}</span>
                </p>

                <form id="reports-request-form" data-readdy-form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#2C3E50] mb-1">
                      Company Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#DC2626] ${
                        errors.companyName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter company name"
                    />
                    {errors.companyName && <p className="text-red-500 text-xs mt-1">{errors.companyName}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#2C3E50] mb-1">
                      Contact Person <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="contactPerson"
                      value={formData.contactPerson}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#DC2626] ${
                        errors.contactPerson ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter contact person name"
                    />
                    {errors.contactPerson && <p className="text-red-500 text-xs mt-1">{errors.contactPerson}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#2C3E50] mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#DC2626] ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter email address"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#2C3E50] mb-1">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#DC2626] ${
                        errors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter phone number"
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#2C3E50] mb-1">
                      Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows={3}
                      maxLength={500}
                      className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#DC2626] resize-none ${
                        errors.address ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter company address"
                    />
                    {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-[#DC2626] text-white font-medium rounded-lg cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Request'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ReportsPage;
