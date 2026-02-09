import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../../../components/feature/Header';
import { Footer } from '../../../components/feature/Footer';
import { GalleryCarousel, GalleryCard, GalleryItemData } from '../../../components/feature/GalleryCarousel';
import { BackToTop } from '../../../components/feature/BackToTop';

const TrainingsPage: React.FC = () => {
  const [visibleCount, setVisibleCount] = useState(6);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedItem, setSelectedItem] = useState<GalleryItemData | null>(null);
  
  const subMenuItems = [
    { label: 'Facilities', path: '/gallery/facilities' },
    { label: 'Trainings', path: '/gallery/trainings' },
    { label: 'Visits', path: '/gallery/visits' },
  ];

  const trainings: GalleryItemData[] = [
    {
      title: 'Safety & Emergency Response Training',
      date: '12-03-2024',
      location: 'Lubumbashi Training Center',
      category: 'Safety',
      images: [
        { url: 'https://readdy.ai/api/search-image?query=industrial%20safety%20training%20session%20with%20workers%20in%20safety%20gear%20learning%20emergency%20response%20procedures%20instructor%20demonstrating%20safety%20equipment%20professional%20training%20environment&width=800&height=600&seq=training-001&orientation=landscape', caption: 'Emergency response demonstration' },
        { url: 'https://readdy.ai/api/search-image?query=workers%20practicing%20emergency%20evacuation%20drill%20in%20industrial%20facility%20safety%20training%20exercise%20professional%20safety%20program&width=800&height=600&seq=training-001b&orientation=landscape', caption: 'Evacuation drill practice' },
        { url: 'https://readdy.ai/api/search-image?query=safety%20equipment%20demonstration%20with%20fire%20extinguisher%20training%20industrial%20workers%20learning%20fire%20safety%20professional%20training%20session&width=800&height=600&seq=training-001c&orientation=landscape', caption: 'Fire extinguisher training' },
      ],
    },
    {
      title: 'Technical Skills Development',
      date: '28-02-2024',
      location: 'Lubumbashi Technical Institute',
      category: 'Technical',
      images: [
        { url: 'https://readdy.ai/api/search-image?query=technical%20training%20workshop%20with%20engineers%20learning%20industrial%20equipment%20operation%20hands-on%20training%20with%20machinery%20professional%20development%20session&width=800&height=600&seq=training-002&orientation=landscape', caption: 'Technical skills workshop' },
        { url: 'https://readdy.ai/api/search-image?query=engineers%20learning%20equipment%20maintenance%20and%20repair%20in%20industrial%20training%20facility%20hands-on%20technical%20education%20professional%20development&width=800&height=600&seq=training-002b&orientation=landscape', caption: 'Equipment maintenance training' },
      ],
    },
    {
      title: 'Quality Management Workshop',
      date: '15-02-2024',
      location: 'Lubumbashi Quality Center',
      category: 'Quality',
      images: [
        { url: 'https://readdy.ai/api/search-image?query=quality%20management%20training%20session%20with%20professionals%20in%20conference%20room%20learning%20quality%20control%20procedures%20presentation%20and%20group%20discussion&width=800&height=600&seq=training-003&orientation=landscape', caption: 'Quality management session' },
      ],
    },
    {
      title: 'Environmental Compliance Training',
      date: '30-01-2024',
      location: 'Lubumbashi Environmental Office',
      category: 'Environmental',
      images: [
        { url: 'https://readdy.ai/api/search-image?query=environmental%20compliance%20training%20with%20workers%20learning%20environmental%20protection%20procedures%20sustainability%20training%20session%20professional%20setting&width=800&height=600&seq=training-004&orientation=landscape', caption: 'Environmental compliance training' },
        { url: 'https://readdy.ai/api/search-image?query=waste%20management%20training%20session%20with%20workers%20learning%20proper%20disposal%20procedures%20environmental%20protection%20education%20professional%20industrial%20setting&width=800&height=600&seq=training-004b&orientation=landscape', caption: 'Waste management procedures' },
      ],
    },
    {
      title: 'Leadership Development Program',
      date: '18-01-2024',
      location: 'Lubumbashi Corporate Office',
      category: 'Leadership',
      images: [
        { url: 'https://readdy.ai/api/search-image?query=leadership%20training%20workshop%20with%20managers%20and%20supervisors%20learning%20management%20skills%20professional%20development%20session%20conference%20room%20setting&width=800&height=600&seq=training-005&orientation=landscape', caption: 'Leadership workshop' },
        { url: 'https://readdy.ai/api/search-image?query=team%20building%20exercise%20during%20leadership%20training%20program%20managers%20participating%20in%20group%20activities%20professional%20development&width=800&height=600&seq=training-005b&orientation=landscape', caption: 'Team building exercise' },
        { url: 'https://readdy.ai/api/search-image?query=presentation%20skills%20training%20with%20manager%20practicing%20public%20speaking%20leadership%20development%20program%20professional%20setting&width=800&height=600&seq=training-005c&orientation=landscape', caption: 'Presentation skills practice' },
      ],
    },
    {
      title: 'Equipment Operation Certification',
      date: '08-12-2023',
      location: 'Lubumbashi Operations Center',
      category: 'Technical',
      images: [
        { url: 'https://readdy.ai/api/search-image?query=equipment%20operation%20training%20with%20workers%20learning%20to%20operate%20industrial%20machinery%20certification%20program%20hands-on%20practical%20training&width=800&height=600&seq=training-006&orientation=landscape', caption: 'Equipment operation training' },
      ],
    },
    {
      title: 'First Aid & Medical Response',
      date: '25-11-2023',
      location: 'Lubumbashi Medical Training Room',
      category: 'Safety',
      images: [
        { url: 'https://readdy.ai/api/search-image?query=first%20aid%20training%20session%20with%20workers%20learning%20CPR%20and%20emergency%20medical%20procedures%20instructor%20demonstrating%20life-saving%20techniques%20professional%20medical%20training&width=800&height=600&seq=training-007&orientation=landscape', caption: 'CPR training demonstration' },
        { url: 'https://readdy.ai/api/search-image?query=workers%20practicing%20bandaging%20and%20wound%20care%20during%20first%20aid%20training%20medical%20emergency%20response%20education%20professional%20setting&width=800&height=600&seq=training-007b&orientation=landscape', caption: 'Wound care practice' },
      ],
    },
    {
      title: 'Fire Safety & Prevention',
      date: '10-11-2023',
      location: 'Lubumbashi Fire Safety Center',
      category: 'Safety',
      images: [
        { url: 'https://readdy.ai/api/search-image?query=fire%20safety%20training%20with%20workers%20learning%20to%20use%20fire%20extinguishers%20practical%20fire%20drill%20session%20professional%20fire%20prevention%20training&width=800&height=600&seq=training-008&orientation=landscape', caption: 'Fire extinguisher training' },
      ],
    },
    {
      title: 'Process Optimization Training',
      date: '28-10-2023',
      location: 'Lubumbashi Process Center',
      category: 'Quality',
      images: [
        { url: 'https://readdy.ai/api/search-image?query=process%20optimization%20workshop%20with%20engineers%20analyzing%20production%20workflows%20lean%20manufacturing%20training%20session%20professional%20continuous%20improvement%20program&width=800&height=600&seq=training-009&orientation=landscape', caption: 'Process optimization workshop' },
        { url: 'https://readdy.ai/api/search-image?query=lean%20manufacturing%20training%20with%20team%20analyzing%20workflow%20diagrams%20continuous%20improvement%20education%20professional%20industrial%20setting&width=800&height=600&seq=training-009b&orientation=landscape', caption: 'Workflow analysis session' },
      ],
    },
    {
      title: 'Communication Skills Workshop',
      date: '15-10-2023',
      location: 'Lubumbashi Training Hall',
      category: 'Leadership',
      images: [
        { url: 'https://readdy.ai/api/search-image?query=communication%20skills%20training%20with%20employees%20practicing%20presentation%20and%20interpersonal%20skills%20professional%20development%20workshop%20interactive%20group%20session&width=800&height=600&seq=training-010&orientation=landscape', caption: 'Communication skills workshop' },
      ],
    },
    {
      title: 'Computer & IT Skills Training',
      date: '02-10-2023',
      location: 'Lubumbashi IT Training Lab',
      category: 'Technical',
      images: [
        { url: 'https://readdy.ai/api/search-image?query=computer%20training%20session%20with%20employees%20learning%20software%20and%20IT%20skills%20modern%20computer%20lab%20with%20multiple%20workstations%20professional%20technology%20training&width=800&height=600&seq=training-011&orientation=landscape', caption: 'IT skills training' },
        { url: 'https://readdy.ai/api/search-image?query=employees%20learning%20industrial%20software%20applications%20in%20computer%20lab%20professional%20IT%20training%20session%20modern%20technology%20education&width=800&height=600&seq=training-011b&orientation=landscape', caption: 'Software applications training' },
      ],
    },
    {
      title: 'Maintenance Best Practices',
      date: '18-09-2023',
      location: 'Lubumbashi Maintenance Center',
      category: 'Technical',
      images: [
        { url: 'https://readdy.ai/api/search-image?query=maintenance%20training%20workshop%20with%20technicians%20learning%20equipment%20repair%20and%20preventive%20maintenance%20hands-on%20technical%20training%20professional%20service%20skills%20development&width=800&height=600&seq=training-012&orientation=landscape', caption: 'Maintenance training workshop' },
      ],
    },
    {
      title: 'Customer Service Excellence',
      date: '05-09-2023',
      location: 'Lubumbashi Service Training Room',
      category: 'Leadership',
      images: [
        { url: 'https://readdy.ai/api/search-image?query=customer%20service%20training%20with%20staff%20learning%20communication%20and%20problem-solving%20skills%20professional%20service%20excellence%20workshop%20interactive%20role-playing%20session&width=800&height=600&seq=training-013&orientation=landscape', caption: 'Customer service training' },
      ],
    },
    {
      title: 'Hazardous Materials Handling',
      date: '22-08-2023',
      location: 'Lubumbashi Safety Training Facility',
      category: 'Safety',
      images: [
        { url: 'https://readdy.ai/api/search-image?query=hazardous%20materials%20handling%20training%20with%20workers%20in%20protective%20suits%20learning%20safe%20chemical%20handling%20procedures%20professional%20hazmat%20training%20session&width=800&height=600&seq=training-014&orientation=landscape', caption: 'Hazmat handling training' },
        { url: 'https://readdy.ai/api/search-image?query=chemical%20spill%20response%20training%20with%20workers%20practicing%20containment%20procedures%20hazardous%20materials%20safety%20education%20professional%20industrial%20setting&width=800&height=600&seq=training-014b&orientation=landscape', caption: 'Spill response practice' },
        { url: 'https://readdy.ai/api/search-image?query=proper%20PPE%20donning%20and%20doffing%20training%20for%20hazardous%20materials%20handling%20safety%20equipment%20education%20professional%20training&width=800&height=600&seq=training-014c&orientation=landscape', caption: 'PPE training' },
      ],
    },
    {
      title: 'Team Building & Collaboration',
      date: '08-08-2023',
      location: 'Lubumbashi Conference Center',
      category: 'Leadership',
      images: [
        { url: 'https://readdy.ai/api/search-image?query=team%20building%20workshop%20with%20employees%20participating%20in%20group%20activities%20collaborative%20training%20session%20professional%20team%20development%20program&width=800&height=600&seq=training-015&orientation=landscape', caption: 'Team building activities' },
      ],
    },
  ];

  const categories = ['All', 'Safety', 'Technical', 'Quality', 'Environmental', 'Leadership'];
  const years = ['All', '2024', '2023'];

  const filteredTrainings = useMemo(() => {
    return trainings.filter((item) => {
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const itemYear = item.date.split('-')[2];
      const matchesYear = selectedYear === 'All' || itemYear === selectedYear;
      return matchesCategory && matchesYear;
    });
  }, [selectedCategory, selectedYear]);

  const visibleTrainings = filteredTrainings.slice(0, visibleCount);
  const hasMore = visibleCount < filteredTrainings.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 6, filteredTrainings.length));
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
            backgroundImage: 'url(https://readdy.ai/api/search-image?query=professional%20training%20session%20in%20modern%20industrial%20facility%20with%20workers%20and%20instructors%20learning%20technical%20skills%20group%20training%20environment%20with%20equipment%20and%20presentations&width=1920&height=400&seq=trainings-hero-001&orientation=landscape)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50"></div>
        </div>

        <div className="relative h-full max-w-[1320px] mx-auto px-10 flex flex-col justify-end pb-16">
          <h1 className="text-5xl font-bold text-white mb-4" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
            Trainings
          </h1>
          <p className="text-white text-xl font-light" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.3)' }}>
            Empowering our workforce through continuous learning and development
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
                  item.path === '/gallery/trainings'
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
                Showing <span className="font-semibold text-[#2C3E50]">{visibleTrainings.length}</span> of{' '}
                <span className="font-semibold text-[#2C3E50]">{filteredTrainings.length}</span> items
              </p>
            </div>
          </div>

          {/* Gallery Grid */}
          {filteredTrainings.length > 0 ? (
            <div className="grid grid-cols-3 gap-6">
              {visibleTrainings.map((item, index) => (
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

export default TrainingsPage;
