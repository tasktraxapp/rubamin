import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../../../components/feature/Header';
import { Footer } from '../../../components/feature/Footer';
import { GalleryCarousel, GalleryCard, GalleryItemData } from '../../../components/feature/GalleryCarousel';
import { BackToTop } from '../../../components/feature/BackToTop';

const VisitsPage: React.FC = () => {
  const [visibleCount, setVisibleCount] = useState(6);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedItem, setSelectedItem] = useState<GalleryItemData | null>(null);
  
  const subMenuItems = [
    { label: 'Facilities', path: '/gallery/facilities' },
    { label: 'Trainings', path: '/gallery/trainings' },
    { label: 'Visits', path: '/gallery/visits' },
  ];

  const visits: GalleryItemData[] = [
    {
      title: 'Government Delegation Visit',
      date: '20-03-2024',
      location: 'Lubumbashi Main Plant',
      category: 'Government',
      images: [
        { url: 'https://readdy.ai/api/search-image?query=government%20officials%20visiting%20industrial%20facility%20with%20company%20executives%20tour%20of%20manufacturing%20plant%20formal%20delegation%20visit%20professional%20setting&width=800&height=600&seq=visit-001&orientation=landscape', caption: 'Welcome ceremony for government delegation' },
        { url: 'https://readdy.ai/api/search-image?query=government%20officials%20touring%20production%20facility%20with%20company%20management%20industrial%20plant%20visit%20formal%20inspection%20professional%20setting&width=800&height=600&seq=visit-001b&orientation=landscape', caption: 'Production facility tour' },
        { url: 'https://readdy.ai/api/search-image?query=government%20delegation%20meeting%20with%20company%20executives%20in%20conference%20room%20formal%20discussion%20industrial%20partnership%20professional%20setting&width=800&height=600&seq=visit-001c&orientation=landscape', caption: 'Meeting with executives' },
      ],
    },
    {
      title: 'International Investors Tour',
      date: '08-03-2024',
      location: 'Lubumbashi Industrial Complex',
      category: 'Business',
      images: [
        { url: 'https://readdy.ai/api/search-image?query=international%20business%20delegation%20touring%20industrial%20facility%20with%20executives%20investment%20tour%20professional%20meeting%20in%20manufacturing%20plant&width=800&height=600&seq=visit-002&orientation=landscape', caption: 'Investor facility tour' },
        { url: 'https://readdy.ai/api/search-image?query=business%20presentation%20to%20international%20investors%20in%20modern%20conference%20room%20investment%20opportunity%20discussion%20professional%20corporate%20setting&width=800&height=600&seq=visit-002b&orientation=landscape', caption: 'Investment presentation' },
      ],
    },
    {
      title: 'University Students Educational Visit',
      date: '25-02-2024',
      location: 'Lubumbashi Production Facility',
      category: 'Educational',
      images: [
        { url: 'https://readdy.ai/api/search-image?query=university%20students%20on%20educational%20tour%20of%20industrial%20facility%20with%20guide%20learning%20about%20manufacturing%20processes%20group%20of%20young%20people%20in%20safety%20gear&width=800&height=600&seq=visit-003&orientation=landscape', caption: 'Student facility tour' },
        { url: 'https://readdy.ai/api/search-image?query=engineering%20students%20learning%20about%20industrial%20processes%20in%20manufacturing%20plant%20educational%20visit%20with%20instructor%20explaining%20equipment&width=800&height=600&seq=visit-003b&orientation=landscape', caption: 'Learning about processes' },
        { url: 'https://readdy.ai/api/search-image?query=students%20asking%20questions%20during%20industrial%20facility%20tour%20educational%20engagement%20with%20company%20engineers%20professional%20learning%20environment&width=800&height=600&seq=visit-003c&orientation=landscape', caption: 'Q&A session with engineers' },
      ],
    },
    {
      title: 'Industry Partners Meeting',
      date: '12-02-2024',
      location: 'Lubumbashi Conference Center',
      category: 'Business',
      images: [
        { url: 'https://readdy.ai/api/search-image?query=business%20partners%20meeting%20in%20industrial%20facility%20conference%20room%20professional%20discussion%20with%20executives%20partnership%20meeting%20formal%20setting&width=800&height=600&seq=visit-004&orientation=landscape', caption: 'Partnership meeting' },
      ],
    },
    {
      title: 'Environmental Audit Team Visit',
      date: '29-01-2024',
      location: 'Lubumbashi Environmental Facility',
      category: 'Audit',
      images: [
        { url: 'https://readdy.ai/api/search-image?query=environmental%20auditors%20inspecting%20industrial%20facility%20with%20company%20representatives%20audit%20team%20reviewing%20environmental%20compliance%20professional%20inspection&width=800&height=600&seq=visit-005&orientation=landscape', caption: 'Environmental audit inspection' },
        { url: 'https://readdy.ai/api/search-image?query=auditors%20reviewing%20environmental%20documentation%20and%20records%20compliance%20verification%20professional%20audit%20process%20industrial%20setting&width=800&height=600&seq=visit-005b&orientation=landscape', caption: 'Documentation review' },
      ],
    },
    {
      title: 'Community Leaders Tour',
      date: '15-01-2024',
      location: 'Lubumbashi Operations Center',
      category: 'Community',
      images: [
        { url: 'https://readdy.ai/api/search-image?query=community%20leaders%20visiting%20industrial%20facility%20with%20company%20executives%20community%20engagement%20tour%20local%20leaders%20learning%20about%20operations&width=800&height=600&seq=visit-006&orientation=landscape', caption: 'Community leaders tour' },
        { url: 'https://readdy.ai/api/search-image?query=company%20presenting%20CSR%20initiatives%20to%20community%20leaders%20meeting%20about%20social%20responsibility%20programs%20professional%20community%20engagement&width=800&height=600&seq=visit-006b&orientation=landscape', caption: 'CSR presentation' },
      ],
    },
    {
      title: 'Media & Press Tour',
      date: '05-01-2024',
      location: 'Lubumbashi Main Facility',
      category: 'Media',
      images: [
        { url: 'https://readdy.ai/api/search-image?query=journalists%20and%20media%20representatives%20touring%20industrial%20facility%20with%20cameras%20and%20recording%20equipment%20press%20visit%20professional%20media%20coverage&width=800&height=600&seq=visit-007&orientation=landscape', caption: 'Media facility tour' },
        { url: 'https://readdy.ai/api/search-image?query=press%20conference%20with%20company%20executives%20answering%20journalist%20questions%20media%20event%20professional%20corporate%20communication&width=800&height=600&seq=visit-007b&orientation=landscape', caption: 'Press conference' },
        { url: 'https://readdy.ai/api/search-image?query=journalist%20interviewing%20company%20CEO%20in%20industrial%20facility%20media%20coverage%20professional%20corporate%20interview&width=800&height=600&seq=visit-007c&orientation=landscape', caption: 'Executive interview' },
      ],
    },
    {
      title: 'Technical Experts Consultation',
      date: '22-12-2023',
      location: 'Lubumbashi Technical Center',
      category: 'Business',
      images: [
        { url: 'https://readdy.ai/api/search-image?query=technical%20experts%20and%20consultants%20inspecting%20industrial%20equipment%20professional%20consultation%20visit%20engineers%20reviewing%20technical%20specifications&width=800&height=600&seq=visit-008&orientation=landscape', caption: 'Technical consultation' },
      ],
    },
    {
      title: 'Safety Inspectors Audit',
      date: '10-12-2023',
      location: 'Lubumbashi Safety Department',
      category: 'Audit',
      images: [
        { url: 'https://readdy.ai/api/search-image?query=safety%20inspectors%20conducting%20facility%20audit%20with%20checklists%20reviewing%20safety%20protocols%20and%20equipment%20professional%20safety%20compliance%20inspection&width=800&height=600&seq=visit-009&orientation=landscape', caption: 'Safety inspection' },
        { url: 'https://readdy.ai/api/search-image?query=safety%20auditors%20reviewing%20emergency%20equipment%20and%20procedures%20compliance%20verification%20professional%20safety%20audit%20industrial%20facility&width=800&height=600&seq=visit-009b&orientation=landscape', caption: 'Emergency equipment review' },
      ],
    },
    {
      title: 'Trade Association Delegation',
      date: '28-11-2023',
      location: 'Lubumbashi Corporate Office',
      category: 'Business',
      images: [
        { url: 'https://readdy.ai/api/search-image?query=trade%20association%20members%20visiting%20industrial%20facility%20professional%20industry%20delegation%20meeting%20with%20executives%20formal%20business%20visit&width=800&height=600&seq=visit-010&orientation=landscape', caption: 'Trade association visit' },
      ],
    },
    {
      title: 'Supplier Partnership Meeting',
      date: '15-11-2023',
      location: 'Lubumbashi Procurement Center',
      category: 'Business',
      images: [
        { url: 'https://readdy.ai/api/search-image?query=suppliers%20and%20vendors%20meeting%20with%20procurement%20team%20professional%20partnership%20discussion%20business%20collaboration%20meeting&width=800&height=600&seq=visit-011&orientation=landscape', caption: 'Supplier meeting' },
        { url: 'https://readdy.ai/api/search-image?query=contract%20signing%20ceremony%20between%20company%20and%20supplier%20business%20partnership%20agreement%20professional%20corporate%20event&width=800&height=600&seq=visit-011b&orientation=landscape', caption: 'Partnership agreement signing' },
      ],
    },
    {
      title: 'Quality Certification Audit',
      date: '02-11-2023',
      location: 'Lubumbashi Quality Assurance Lab',
      category: 'Audit',
      images: [
        { url: 'https://readdy.ai/api/search-image?query=quality%20certification%20auditors%20inspecting%20laboratory%20and%20testing%20procedures%20ISO%20audit%20team%20reviewing%20quality%20management%20systems%20professional%20certification%20process&width=800&height=600&seq=visit-012&orientation=landscape', caption: 'ISO certification audit' },
      ],
    },
    {
      title: 'School Children Educational Tour',
      date: '20-10-2023',
      location: 'Lubumbashi Visitor Center',
      category: 'Educational',
      images: [
        { url: 'https://readdy.ai/api/search-image?query=school%20children%20on%20educational%20field%20trip%20to%20industrial%20facility%20with%20teachers%20young%20students%20learning%20about%20manufacturing%20professional%20educational%20outreach%20program&width=800&height=600&seq=visit-013&orientation=landscape', caption: 'School children tour' },
        { url: 'https://readdy.ai/api/search-image?query=children%20watching%20educational%20presentation%20about%20industrial%20processes%20school%20field%20trip%20learning%20experience%20professional%20educational%20program&width=800&height=600&seq=visit-013b&orientation=landscape', caption: 'Educational presentation' },
      ],
    },
    {
      title: 'Foreign Diplomats Visit',
      date: '08-10-2023',
      location: 'Lubumbashi International Relations Office',
      category: 'Government',
      images: [
        { url: 'https://readdy.ai/api/search-image?query=foreign%20diplomats%20and%20ambassadors%20visiting%20industrial%20facility%20formal%20diplomatic%20visit%20with%20company%20leadership%20professional%20international%20relations&width=800&height=600&seq=visit-014&orientation=landscape', caption: 'Diplomatic visit' },
        { url: 'https://readdy.ai/api/search-image?query=diplomatic%20delegation%20receiving%20company%20presentation%20about%20operations%20international%20business%20relations%20professional%20corporate%20diplomacy&width=800&height=600&seq=visit-014b&orientation=landscape', caption: 'Operations presentation' },
        { url: 'https://readdy.ai/api/search-image?query=gift%20exchange%20ceremony%20between%20company%20executives%20and%20foreign%20diplomats%20formal%20diplomatic%20protocol%20professional%20international%20relations&width=800&height=600&seq=visit-014c&orientation=landscape', caption: 'Gift exchange ceremony' },
      ],
    },
    {
      title: 'NGO Representatives Tour',
      date: '25-09-2023',
      location: 'Lubumbashi CSR Department',
      category: 'Community',
      images: [
        { url: 'https://readdy.ai/api/search-image?query=NGO%20representatives%20visiting%20industrial%20facility%20discussing%20social%20responsibility%20programs%20community%20organization%20leaders%20meeting%20with%20company%20executives&width=800&height=600&seq=visit-015&orientation=landscape', caption: 'NGO representatives tour' },
      ],
    },
  ];

  const categories = ['All', 'Government', 'Business', 'Educational', 'Audit', 'Community', 'Media'];
  const years = ['All', '2024', '2023'];

  const filteredVisits = useMemo(() => {
    return visits.filter((item) => {
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const itemYear = item.date.split('-')[2];
      const matchesYear = selectedYear === 'All' || itemYear === selectedYear;
      return matchesCategory && matchesYear;
    });
  }, [selectedCategory, selectedYear]);

  const visibleVisits = filteredVisits.slice(0, visibleCount);
  const hasMore = visibleCount < filteredVisits.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 6, filteredVisits.length));
  };

  const handleFilterChange = () => {
    setVisibleCount(6);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[400px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://readdy.ai/api/search-image?query=professional%20delegation%20visiting%20modern%20industrial%20facility%20with%20executives%20and%20officials%20tour%20of%20manufacturing%20plant%20formal%20visit%20with%20group%20of%20people&width=1920&height=400&seq=visits-hero-001&orientation=landscape)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50"></div>
        </div>

        <div className="relative h-full max-w-[1320px] mx-auto px-10 flex flex-col justify-end pb-16">
          <h1 className="text-5xl font-bold text-white mb-4" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
            Visits
          </h1>
          <p className="text-white text-xl font-light" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.3)' }}>
            Welcoming stakeholders and partners to our facilities
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
                  item.path === '/gallery/visits'
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

      {/* Gallery Grid */}
      <section className="py-24 bg-[#F8F9FA]">
        <div className="max-w-[1320px] mx-auto px-6">
          {/* Filter Section */}
          <div className="mb-10 bg-white rounded-xl p-6 shadow-sm">
            <div className="flex flex-wrap items-center gap-6">
              {/* Category Filter */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-[#6B7280]">
                  <div className="w-5 h-5 flex items-center justify-center">
                    <i className="ri-filter-3-line text-lg"></i>
                  </div>
                  <span className="text-sm font-medium">Category:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => {
                        setSelectedCategory(category);
                        handleFilterChange();
                      }}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
                        selectedCategory === category
                          ? 'bg-[#DC2626] text-white'
                          : 'bg-gray-100 text-[#2C3E50] hover:bg-gray-200'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="hidden lg:block w-px h-8 bg-gray-200"></div>

              {/* Year Filter */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-[#6B7280]">
                  <div className="w-5 h-5 flex items-center justify-center">
                    <i className="ri-calendar-line text-lg"></i>
                  </div>
                  <span className="text-sm font-medium">Year:</span>
                </div>
                <div className="flex gap-2">
                  {years.map((year) => (
                    <button
                      key={year}
                      onClick={() => {
                        setSelectedYear(year);
                        handleFilterChange();
                      }}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
                        selectedYear === year
                          ? 'bg-[#DC2626] text-white'
                          : 'bg-gray-100 text-[#2C3E50] hover:bg-gray-200'
                      }`}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results Count */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-sm text-[#6B7280]">
                Showing <span className="font-semibold text-[#2C3E50]">{visibleVisits.length}</span> of{' '}
                <span className="font-semibold text-[#2C3E50]">{filteredVisits.length}</span> items
              </p>
            </div>
          </div>

          {/* Gallery Grid */}
          {filteredVisits.length > 0 ? (
            <div className="grid grid-cols-3 gap-6">
              {visibleVisits.map((item, index) => (
                <GalleryCard
                  key={index}
                  item={item}
                  onClick={() => setSelectedItem(item)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4 bg-gray-100 rounded-full">
                <i className="ri-image-line text-3xl text-gray-400"></i>
              </div>
              <h3 className="text-lg font-semibold text-[#2C3E50] mb-2">No items found</h3>
              <p className="text-[#6B7280]">Try adjusting your filters to see more results.</p>
            </div>
          )}

          {/* Load More Button */}
          {hasMore && (
            <div className="flex justify-center mt-12">
              <button
                onClick={handleLoadMore}
                className="px-8 py-3 bg-[#DC2626] text-white rounded-full font-medium hover:bg-[#B91C1C] transition-colors cursor-pointer whitespace-nowrap flex items-center gap-2"
              >
                <span>Load More</span>
                <div className="w-5 h-5 flex items-center justify-center">
                  <i className="ri-arrow-down-line text-lg"></i>
                </div>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Carousel Modal */}
      {selectedItem && (
        <GalleryCarousel
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}

      <BackToTop />
      <Footer />
    </div>
  );
};

export default VisitsPage;
