
import React from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../../../components/feature/Header';
import { Footer } from '../../../components/feature/Footer';
import { BackToTop } from '../../../components/feature/BackToTop';

const NoticesPage: React.FC = () => {
  const subMenuItems = [
    { label: 'Notices', path: '/media/notices' },
    { label: 'Tenders', path: '/media/tenders' },
  ];

  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-');
    return `${day}-${month}-${year}`;
  };

  const notices = [
    {
      date: '2024-01-15',
      title: 'Annual General Meeting Announcement',
      description: 'Notice of Annual General Meeting scheduled for February 28, 2024. All shareholders are invited to attend.',
      category: 'Corporate',
    },
    {
      date: '2024-01-10',
      title: 'New Environmental Certification Achieved',
      description: 'RUBAMIN SARL has successfully obtained ISO 14001:2015 Environmental Management System certification.',
      category: 'Achievement',
    },
    {
      date: '2023-12-20',
      title: 'Production Facility Expansion Update',
      description: 'Phase 2 of our facility expansion project is now complete, increasing production capacity by 30%.',
      category: 'Operations',
    },
    {
      date: '2023-12-05',
      title: 'Holiday Schedule Notice',
      description: 'Office closure schedule for the holiday season. Emergency contact information provided.',
      category: 'General',
    },
    {
      date: '2023-11-28',
      title: 'Safety Excellence Award',
      description: 'Company recognized for achieving 1000 days without workplace incidents.',
      category: 'Achievement',
    },
    {
      date: '2023-11-15',
      title: 'New Quality Management System Implementation',
      description: 'Implementation of ISO 9001:2015 Quality Management System across all production facilities.',
      category: 'Operations',
    },
    {
      date: '2023-11-01',
      title: 'Community Development Initiative Launch',
      description: 'Launch of new community development program focusing on education and healthcare in local communities.',
      category: 'CSR',
    },
    {
      date: '2023-10-20',
      title: 'Export Achievement Milestone',
      description: 'Company reaches milestone of 50,000 tons of copper blister exported to international markets.',
      category: 'Achievement',
    },
  ];

  const handleDownload = (noticeTitle: string) => {
    // Simulate download
    const link = document.createElement('a');
    link.href = '#';
    link.download = `${noticeTitle.replace(/\s+/g, '_')}.pdf`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[400px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://readdy.ai/api/search-image?query=modern%20corporate%20announcement%20board%20with%20official%20notices%20and%20documents%20professional%20business%20communication%20center%20with%20organized%20information%20displays%20representing%20company%20notices%20and%20official%20announcements&width=1920&height=400&seq=notices-hero-001&orientation=landscape)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50"></div>
        </div>

        <div className="relative h-full max-w-[1320px] mx-auto px-10 flex flex-col justify-end pb-12">
          <h1 className="text-5xl font-bold text-white mb-4" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
            Company Notices
          </h1>
          <p className="text-white text-xl font-light" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.3)' }}>
            Official announcements and important updates
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
                  item.path === '/media/notices'
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

      {/* Notices Content */}
      <section className="py-24 bg-[#F8F9FA]">
        <div className="max-w-[1320px] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-[#2C3E50]" style={{ fontFamily: 'Merriweather, serif' }}>
              Official Notices
            </h2>
            <p className="text-lg text-[#6C757D] mt-4">
              Stay informed with our latest company announcements and updates
            </p>
          </div>

          <div className="space-y-6">
            {notices.map((notice, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 hover:shadow-lg transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-3">
                      <span className="text-sm text-[#DC2626] font-semibold">{formatDate(notice.date)}</span>
                      <span className="px-3 py-1 bg-[#FEF2F2] text-[#DC2626] text-xs font-medium rounded-full">
                        {notice.category}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-[#2C3E50] mb-3">{notice.title}</h3>
                    <p className="text-base text-[#6C757D] leading-relaxed">{notice.description}</p>
                  </div>
                  <button
                    onClick={() => handleDownload(notice.title)}
                    className="ml-6 px-5 py-2.5 bg-[#DC2626] text-white text-sm font-medium rounded-lg hover:bg-[#B91C1C] transition-colors cursor-pointer whitespace-nowrap flex items-center"
                  >
                    <i className="ri-download-line mr-2"></i>
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <BackToTop />
    </div>
  );
};

export default NoticesPage;
