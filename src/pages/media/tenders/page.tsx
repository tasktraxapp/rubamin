import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../../../components/feature/Header';
import { Footer } from '../../../components/feature/Footer';
import { BackToTop } from '../../../components/feature/BackToTop';

const TendersPage: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedTender, setSelectedTender] = useState<string | null>(null);
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

  const subMenuItems = [
    { label: 'Notices', path: '/media/notices' },
    { label: 'Tenders', path: '/media/tenders' },
  ];

  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-');
    return `${day}-${month}-${year}`;
  };

  const tenders = [
    {
      id: 'T-2024-001',
      title: 'Supply and Installation of New Oxygen Compressor',
      postingDate: '2024-03-15',
      closingDate: '2024-04-15',
      location: 'Lubumbashi',
      status: 'Open',
      category: 'Equipment',
      description: 'Tender for supply and installation of advanced oxygen compressor for industrial gas production facility.',
    },
    {
      id: 'T-2024-002',
      title: 'Transportation Services Contract',
      postingDate: '2024-03-10',
      closingDate: '2024-04-10',
      location: 'Lubumbashi',
      status: 'Open',
      category: 'Services',
      description: 'Three-year contract for transportation of raw materials and finished products.',
    },
    {
      id: 'T-2024-003',
      title: 'IT Infrastructure Upgrade',
      postingDate: '2024-03-05',
      closingDate: '2024-04-05',
      location: 'Lubumbashi',
      status: 'Open',
      category: 'IT',
      description: 'Comprehensive IT infrastructure upgrade including servers, networking, and security systems.',
    },
    {
      id: 'T-2024-004',
      title: 'Safety Equipment Supply',
      postingDate: '2024-02-28',
      closingDate: '2024-03-28',
      location: 'Lubumbashi',
      status: 'Open',
      category: 'Equipment',
      description: 'Supply of personal protective equipment and safety gear for all production facilities.',
    },
    {
      id: 'T-2024-005',
      title: 'Environmental Monitoring Services',
      postingDate: '2024-02-20',
      closingDate: '2024-03-20',
      location: 'Lubumbashi',
      status: 'Open',
      category: 'Services',
      description: 'Annual contract for environmental monitoring and compliance reporting services.',
    },
    {
      id: 'T-2023-015',
      title: 'Facility Maintenance Services',
      postingDate: '2023-11-15',
      closingDate: '2023-12-31',
      location: 'Lubumbashi',
      status: 'Closed',
      category: 'Services',
      description: 'Annual maintenance contract for production facilities and equipment.',
    },
    {
      id: 'T-2023-014',
      title: 'Laboratory Equipment Supply',
      postingDate: '2023-11-01',
      closingDate: '2023-12-15',
      location: 'Lubumbashi',
      status: 'Closed',
      category: 'Equipment',
      description: 'Supply of advanced laboratory testing equipment for quality control department.',
    },
    {
      id: 'T-2023-013',
      title: 'Security Services Contract',
      postingDate: '2023-10-15',
      closingDate: '2023-11-30',
      location: 'Lubumbashi',
      status: 'Closed',
      category: 'Services',
      description: 'Two-year contract for comprehensive security services at all company facilities.',
    },
  ];

  const handleRequestDownload = (tenderId: string) => {
    setSelectedTender(tenderId);
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
      formBody.append('tenderId', selectedTender || '');

      await fetch('https://readdy.ai/api/form/d62eup0v3sjav1bavii0', {
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
            backgroundImage: 'url(https://readdy.ai/api/search-image?query=professional%20business%20tender%20documents%20and%20contracts%20on%20modern%20desk%20with%20laptop%20and%20official%20papers%20representing%20corporate%20procurement%20and%20bidding%20process%20clean%20organized%20business%20environment&width=1920&height=400&seq=tenders-hero-001&orientation=landscape)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50"></div>
        </div>

        <div className="relative h-full max-w-[1320px] mx-auto px-10 flex flex-col justify-end pb-12">
          <h1 className="text-5xl font-bold text-white mb-4" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
            Active Tenders
          </h1>
          <p className="text-white text-xl font-light" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.3)' }}>
            Current procurement opportunities and bidding information
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
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
                  item.path === '/media/tenders'
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

      {/* Tenders Content */}
      <section className="py-24 bg-[#F8F9FA]">
        <div className="max-w-[1320px] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-[#2C3E50]" style={{ fontFamily: 'Merriweather, serif' }}>
              Procurement Opportunities
            </h2>
            <p className="text-lg text-[#6C757D] mt-4">
              Explore current tender opportunities and submit your proposals
            </p>
          </div>

          <div className="space-y-6">
            {tenders.map((tender, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 hover:shadow-lg transition-all border border-gray-100">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <span className="text-sm font-semibold text-[#2C3E50]">{tender.id}</span>
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          tender.status === 'Open'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {tender.status}
                      </span>
                      <span className="px-3 py-1 bg-gray-100 text-[#6C757D] text-xs font-medium rounded-full">
                        {tender.category}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-[#2C3E50] mb-3">{tender.title}</h3>
                    <div className="flex items-center flex-wrap gap-x-6 gap-y-2 text-sm text-[#6C757D]">
                      <div className="flex items-center">
                        <i className="ri-calendar-line mr-2 text-[#DC2626]"></i>
                        <span>Posting Date: {formatDate(tender.postingDate)}</span>
                      </div>
                      <div className="flex items-center">
                        <i className="ri-calendar-check-line mr-2 text-[#DC2626]"></i>
                        <span>Closing: {formatDate(tender.closingDate)}</span>
                      </div>
                      <div className="flex items-center">
                        <i className="ri-map-pin-line mr-2 text-[#DC2626]"></i>
                        <span>Location: {tender.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 ml-6">
                    <button className="px-4 py-2 text-sm font-medium text-[#2C3E50] border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap">
                      View
                    </button>
                    {tender.status === 'Open' && (
                      <button
                        onClick={() => handleRequestDownload(tender.id)}
                        className="px-4 py-2 bg-[#DC2626] text-white text-sm font-medium rounded-lg hover:bg-[#B91C1C] transition-colors cursor-pointer whitespace-nowrap flex items-center"
                      >
                        <i className="ri-download-line mr-2"></i>
                        Request Download
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
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
                <p className="text-[#6C757D]">You will receive the tender document via email shortly.</p>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-bold text-[#2C3E50] mb-2">Request Tender Document</h3>
                <p className="text-sm text-[#6C757D] mb-6">
                  Tender ID: <span className="font-semibold">{selectedTender}</span>
                </p>

                <form id="tender-request-form" data-readdy-form onSubmit={handleSubmit} className="space-y-4">
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
                    className="w-full py-3 bg-[#DC2626] text-white font-medium rounded-lg hover:bg-[#B91C1C] transition-colors cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Request'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      <BackToTop />
      <Footer />
    </div>
  );
};

export default TendersPage;
