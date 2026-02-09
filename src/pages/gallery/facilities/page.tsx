import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../../../components/feature/Header';
import { Footer } from '../../../components/feature/Footer';
import { GalleryCarousel, GalleryCard, GalleryItemData } from '../../../components/feature/GalleryCarousel';
import { BackToTop } from '../../../components/feature/BackToTop';

const FacilitiesPage: React.FC = () => {
  const [visibleCount, setVisibleCount] = useState(6);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedItem, setSelectedItem] = useState<GalleryItemData | null>(null);
  
  const subMenuItems = [
    { label: 'Facilities', path: '/gallery/facilities' },
    { label: 'Trainings', path: '/gallery/trainings' },
    { label: 'Visits', path: '/gallery/visits' },
  ];

  const facilities: GalleryItemData[] = [
    {
      title: 'Main Production Facility',
      date: '15-03-2024',
      location: 'Lubumbashi Industrial Zone',
      category: 'Production',
      images: [
        { url: 'https://readdy.ai/api/search-image?query=large%20scale%20industrial%20copper%20smelting%20facility%20interior%20with%20advanced%20machinery%20and%20equipment%20modern%20manufacturing%20plant%20with%20metallic%20structures%20and%20production%20lines%20professional%20industrial%20photography&width=800&height=600&seq=facility-001&orientation=landscape', caption: 'Main production hall overview' },
        { url: 'https://readdy.ai/api/search-image?query=industrial%20copper%20smelting%20furnace%20with%20molten%20metal%20and%20workers%20in%20safety%20gear%20modern%20metallurgy%20facility%20professional%20heavy%20industry%20photography&width=800&height=600&seq=facility-001b&orientation=landscape', caption: 'Smelting furnace in operation' },
        { url: 'https://readdy.ai/api/search-image?query=industrial%20conveyor%20belt%20system%20transporting%20copper%20ore%20in%20manufacturing%20plant%20modern%20automated%20production%20line%20professional%20factory%20photography&width=800&height=600&seq=facility-001c&orientation=landscape', caption: 'Automated conveyor system' },
      ],
    },
    {
      title: 'Quality Control Laboratory',
      date: '22-02-2024',
      location: 'Lubumbashi Main Plant',
      category: 'Laboratory',
      images: [
        { url: 'https://readdy.ai/api/search-image?query=modern%20industrial%20laboratory%20with%20scientists%20in%20white%20coats%20conducting%20quality%20control%20tests%20on%20copper%20samples%20advanced%20testing%20equipment%20and%20clean%20sterile%20environment%20professional%20lab%20photography&width=800&height=600&seq=facility-002&orientation=landscape', caption: 'Quality control testing area' },
        { url: 'https://readdy.ai/api/search-image?query=laboratory%20technician%20analyzing%20metal%20samples%20with%20spectrometer%20equipment%20modern%20industrial%20testing%20facility%20professional%20scientific%20photography&width=800&height=600&seq=facility-002b&orientation=landscape', caption: 'Spectrometer analysis' },
      ],
    },
    {
      title: 'Gas Production Unit',
      date: '10-01-2024',
      location: 'Lubumbashi Gas Facility',
      category: 'Production',
      images: [
        { url: 'https://readdy.ai/api/search-image?query=industrial%20gas%20production%20facility%20with%20large%20storage%20tanks%20and%20processing%20equipment%20modern%20gas%20manufacturing%20plant%20with%20pipes%20and%20control%20systems%20professional%20industrial%20photography&width=800&height=600&seq=facility-003&orientation=landscape', caption: 'Gas production overview' },
        { url: 'https://readdy.ai/api/search-image?query=industrial%20gas%20storage%20tanks%20with%20pressure%20gauges%20and%20safety%20valves%20modern%20gas%20facility%20infrastructure%20professional%20industrial%20photography&width=800&height=600&seq=facility-003b&orientation=landscape', caption: 'Storage tank area' },
        { url: 'https://readdy.ai/api/search-image?query=gas%20compression%20equipment%20with%20pipes%20and%20control%20panels%20industrial%20gas%20processing%20facility%20professional%20factory%20photography&width=800&height=600&seq=facility-003c&orientation=landscape', caption: 'Compression equipment' },
      ],
    },
    {
      title: 'Warehouse & Storage',
      date: '05-12-2023',
      location: 'Lubumbashi Logistics Center',
      category: 'Storage',
      images: [
        { url: 'https://readdy.ai/api/search-image?query=organized%20industrial%20warehouse%20with%20copper%20products%20and%20gas%20cylinders%20neatly%20stored%20modern%20storage%20facility%20with%20inventory%20management%20systems%20clean%20organized%20space&width=800&height=600&seq=facility-004&orientation=landscape', caption: 'Main warehouse area' },
      ],
    },
    {
      title: 'Control Room',
      date: '18-11-2023',
      location: 'Lubumbashi Operations Center',
      category: 'Operations',
      images: [
        { url: 'https://readdy.ai/api/search-image?query=modern%20industrial%20control%20room%20with%20multiple%20monitors%20and%20control%20panels%20operators%20monitoring%20production%20processes%20advanced%20automation%20and%20monitoring%20systems%20professional%20technology%20environment&width=800&height=600&seq=facility-005&orientation=landscape', caption: 'Central control room' },
        { url: 'https://readdy.ai/api/search-image?query=industrial%20SCADA%20system%20displays%20showing%20production%20data%20and%20process%20monitoring%20modern%20control%20room%20technology%20professional%20automation%20photography&width=800&height=600&seq=facility-005b&orientation=landscape', caption: 'SCADA monitoring system' },
      ],
    },
    {
      title: 'Environmental Treatment Plant',
      date: '25-10-2023',
      location: 'Lubumbashi Environmental Facility',
      category: 'Environmental',
      images: [
        { url: 'https://readdy.ai/api/search-image?query=environmental%20water%20treatment%20facility%20with%20filtration%20systems%20and%20purification%20equipment%20modern%20wastewater%20treatment%20plant%20with%20clean%20technology%20representing%20environmental%20responsibility&width=800&height=600&seq=facility-006&orientation=landscape', caption: 'Water treatment facility' },
        { url: 'https://readdy.ai/api/search-image?query=industrial%20air%20filtration%20system%20with%20scrubbers%20and%20emission%20control%20equipment%20environmental%20protection%20technology%20professional%20industrial%20photography&width=800&height=600&seq=facility-006b&orientation=landscape', caption: 'Air filtration system' },
        { url: 'https://readdy.ai/api/search-image?query=settling%20ponds%20for%20industrial%20wastewater%20treatment%20environmental%20management%20facility%20professional%20environmental%20photography&width=800&height=600&seq=facility-006c&orientation=landscape', caption: 'Settling ponds' },
      ],
    },
    {
      title: 'Smelting Operations Area',
      date: '12-10-2023',
      location: 'Lubumbashi Smelter Complex',
      category: 'Production',
      images: [
        { url: 'https://readdy.ai/api/search-image?query=copper%20smelting%20operations%20with%20molten%20metal%20and%20furnaces%20industrial%20metallurgy%20facility%20with%20high%20temperature%20equipment%20professional%20heavy%20industry%20photography&width=800&height=600&seq=facility-007&orientation=landscape', caption: 'Smelting operations' },
      ],
    },
    {
      title: 'Research & Development Center',
      date: '28-09-2023',
      location: 'Lubumbashi Innovation Hub',
      category: 'Laboratory',
      images: [
        { url: 'https://readdy.ai/api/search-image?query=modern research and development laboratory with scientists working on innovative projects advanced R&D facility with testing equipment and prototypes professional technology environment&width=800&height=600&seq=facility-008&orientation=landscape', caption: 'R&D laboratory' },
        { url: 'https://readdy.ai/api/search-image?query=scientists conducting metallurgical research with advanced equipment modern industrial R&D facility professional scientific photography&width=800&height=600&seq=facility-008b&orientation=landscape', caption: 'Metallurgical research' },
      ],
    },
    {
      title: 'Power Generation Station',
      date: '15-09-2023',
      location: 'Lubumbashi Energy Complex',
      category: 'Operations',
      images: [
        { url: 'https://readdy.ai/api/search-image?query=industrial%20power%20generation%20facility%20with%20turbines%20and%20electrical%20equipment%20modern%20energy%20station%20with%20control%20systems%20professional%20utility%20infrastructure%20photography&width=800&height=600&seq=facility-009&orientation=landscape', caption: 'Power generation facility' },
      ],
    },
    {
      title: 'Medical Gas Filling Station',
      date: '02-09-2023',
      location: 'Lubumbashi Medical Gas Unit',
      category: 'Production',
      images: [
        { url: 'https://readdy.ai/api/search-image?query=medical%20gas%20cylinder%20filling%20station%20with%20clean%20room%20environment%20workers%20in%20protective%20gear%20filling%20oxygen%20cylinders%20professional%20pharmaceutical%20grade%20facility&width=800&height=600&seq=facility-010&orientation=landscape', caption: 'Medical gas filling area' },
        { url: 'https://readdy.ai/api/search-image?query=quality%20testing%20of%20medical%20oxygen%20cylinders%20in%20clean%20room%20environment%20pharmaceutical%20grade%20gas%20production%20professional%20industrial%20photography&width=800&height=600&seq=facility-010b&orientation=landscape', caption: 'Quality testing area' },
      ],
    },
    {
      title: 'Maintenance Workshop',
      date: '20-08-2023',
      location: 'Lubumbashi Service Center',
      category: 'Operations',
      images: [
        { url: 'https://readdy.ai/api/search-image?query=industrial%20maintenance%20workshop%20with%20technicians%20repairing%20equipment%20modern%20service%20facility%20with%20tools%20and%20machinery%20professional%20maintenance%20operations&width=800&height=600&seq=facility-011&orientation=landscape', caption: 'Maintenance workshop' },
      ],
    },
    {
      title: 'Administrative Building',
      date: '08-08-2023',
      location: 'Lubumbashi Corporate Campus',
      category: 'Administrative',
      images: [
        { url: 'https://readdy.ai/api/search-image?query=modern%20corporate%20office%20building%20with%20glass%20facade%20professional%20business%20headquarters%20contemporary%20architecture%20with%20landscaping&width=800&height=600&seq=facility-012&orientation=landscape', caption: 'Administrative building exterior' },
        { url: 'https://readdy.ai/api/search-image?query=modern%20corporate%20office%20interior%20with%20open%20workspace%20and%20meeting%20rooms%20professional%20business%20environment%20contemporary%20design&width=800&height=600&seq=facility-012b&orientation=landscape', caption: 'Office interior' },
      ],
    },
    {
      title: 'Safety Equipment Storage',
      date: '25-07-2023',
      location: 'Lubumbashi Safety Center',
      category: 'Storage',
      images: [
        { url: 'https://readdy.ai/api/search-image?query=organized%20safety%20equipment%20storage%20room%20with%20protective%20gear%20and%20emergency%20supplies%20industrial%20safety%20facility%20with%20helmets%20gloves%20and%20safety%20equipment%20neatly%20arranged&width=800&height=600&seq=facility-013&orientation=landscape', caption: 'Safety equipment storage' },
      ],
    },
    {
      title: 'Loading & Dispatch Area',
      date: '12-07-2023',
      location: 'Lubumbashi Distribution Center',
      category: 'Storage',
      images: [
        { url: 'https://readdy.ai/api/search-image?query=industrial%20loading%20dock%20with%20trucks%20and%20forklifts%20dispatch%20area%20with%20products%20ready%20for%20shipment%20modern%20logistics%20operations%20professional%20distribution%20facility&width=800&height=600&seq=facility-014&orientation=landscape', caption: 'Loading dock area' },
        { url: 'https://readdy.ai/api/search-image?query=forklift%20loading%20copper%20products%20onto%20truck%20at%20industrial%20dispatch%20area%20logistics%20operations%20professional%20warehouse%20photography&width=800&height=600&seq=facility-014b&orientation=landscape', caption: 'Product loading' },
      ],
    },
    {
      title: 'Cafeteria & Recreation Area',
      date: '30-06-2023',
      location: 'Lubumbashi Employee Center',
      category: 'Administrative',
      images: [
        { url: 'https://readdy.ai/api/search-image?query=modern%20employee%20cafeteria%20with%20dining%20tables%20and%20comfortable%20seating%20industrial%20facility%20break%20room%20with%20clean%20bright%20environment%20professional%20workplace%20amenities&width=800&height=600&seq=facility-015&orientation=landscape', caption: 'Employee cafeteria' },
      ],
    },
  ];

  const categories = ['All', 'Production', 'Laboratory', 'Operations', 'Storage', 'Environmental', 'Administrative'];
  const years = ['All', '2024', '2023'];

  const filteredFacilities = useMemo(() => {
    return facilities.filter((item) => {
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const itemYear = item.date.split('-')[2];
      const matchesYear = selectedYear === 'All' || itemYear === selectedYear;
      return matchesCategory && matchesYear;
    });
  }, [selectedCategory, selectedYear]);

  const visibleFacilities = filteredFacilities.slice(0, visibleCount);
  const hasMore = visibleCount < filteredFacilities.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 6, filteredFacilities.length));
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
            backgroundImage: 'url(https://readdy.ai/api/search-image?query=modern%20industrial%20manufacturing%20facility%20exterior%20with%20large%20production%20buildings%20and%20infrastructure%20aerial%20view%20of%20copper%20smelting%20plant%20with%20clean%20environment%20representing%20state-of-the-art%20facilities&width=1920&height=400&seq=facilities-hero-001&orientation=landscape)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50"></div>
        </div>

        <div className="relative h-full max-w-[1320px] mx-auto px-10 flex flex-col justify-end pb-16">
          <h1 className="text-5xl font-bold text-white mb-4" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
            Facilities
          </h1>
          <p className="text-white text-xl font-light" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.3)' }}>
            Explore our world-class production and operational facilities
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
                  item.path === '/gallery/facilities'
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
                Showing <span className="font-semibold text-[#2C3E50]">{visibleFacilities.length}</span> of{' '}
                <span className="font-semibold text-[#2C3E50]">{filteredFacilities.length}</span> items
              </p>
            </div>
          </div>

          {/* Gallery Grid */}
          {filteredFacilities.length > 0 ? (
            <div className="grid grid-cols-3 gap-6">
              {visibleFacilities.map((item, index) => (
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

export default FacilitiesPage;
