
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../../../components/feature/Header';
import { Footer } from '../../../components/feature/Footer';
import { GalleryCarousel, GalleryCard, GalleryItemData } from '../../../components/feature/GalleryCarousel';

const DOTPage: React.FC = () => {
  const [visibleCount, setVisibleCount] = useState(6);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedItem, setSelectedItem] = useState<GalleryItemData | null>(null);
  
  const subMenuItems = [
    { label: 'Social Initiatives', path: '/csr/social-initiatives' },
    { label: 'CSR', path: '/csr' },
    { label: 'DOT', path: '/csr/dot' },
  ];

  const categories = ['All', 'Infrastructure', 'Education', 'Healthcare', 'Utilities', 'Agriculture'];
  const years = ['All', '2024', '2023'];

  const dotProjects = [
    {
      year: '2024',
      amount: '$450,000',
      projects: [
        'Construction of 2 primary schools in Lubumbashi region',
        'Medical equipment donation to 3 community health centers',
        'Road rehabilitation connecting 5 villages',
      ],
    },
    {
      year: '2023',
      amount: '$380,000',
      projects: [
        'Water supply system for 8 communities',
        'Vocational training center establishment',
        'Agricultural equipment for 200 farming families',
      ],
    },
    {
      year: '2022',
      amount: '$320,000',
      projects: [
        'Electrification of 4 rural villages',
        'Scholarship program for 150 students',
        'Community market construction',
      ],
    },
  ];

  const impactAreas = [
    {
      icon: 'ri-building-line',
      title: 'Infrastructure',
      description: 'Roads, bridges, and public facilities improving connectivity and access to services.',
      percentage: '35%',
    },
    {
      icon: 'ri-graduation-cap-line',
      title: 'Education',
      description: 'Schools, scholarships, and educational materials supporting community learning.',
      percentage: '30%',
    },
    {
      icon: 'ri-hospital-line',
      title: 'Healthcare',
      description: 'Medical facilities, equipment, and health programs for community wellbeing.',
      percentage: '20%',
    },
    {
      icon: 'ri-water-flash-line',
      title: 'Utilities',
      description: 'Water supply, electricity, and sanitation projects for basic needs.',
      percentage: '15%',
    },
  ];

  const galleryItems: GalleryItemData[] = [
    {
      title: 'Primary School Construction',
      date: '20-04-2024',
      location: 'Lubumbashi Education Zone',
      category: 'Education',
      images: [
        { url: 'https://readdy.ai/api/search-image?query=newly%20constructed%20primary%20school%20building%20in%20African%20village%20with%20children%20playing%20outside%20modern%20architecture%20community%20development%20project%20bright%20sunny%20day&width=800&height=600&seq=dot-gal-001&orientation=landscape', caption: 'New school building exterior' },
        { url: 'https://readdy.ai/api/search-image?query=interior%20of%20new%20classroom%20in%20African%20school%20with%20desks%20and%20chairs%20modern%20education%20facility%20community%20development&width=800&height=600&seq=dot-gal-001b&orientation=landscape', caption: 'Classroom interior' },
        { url: 'https://readdy.ai/api/search-image?query=school%20inauguration%20ceremony%20with%20children%20and%20officials%20ribbon%20cutting%20African%20community%20education%20project%20celebration&width=800&height=600&seq=dot-gal-001c&orientation=landscape', caption: 'Inauguration ceremony' },
      ],
    },
    {
      title: 'Health Center Equipment Delivery',
      date: '08-04-2024',
      location: 'Kipushi Medical District',
      category: 'Healthcare',
      images: [
        { url: 'https://readdy.ai/api/search-image?query=community%20health%20center%20building%20in%20African%20village%20with%20medical%20staff%20receiving%20new%20equipment%20modern%20healthcare%20facility%20community%20development%20project&width=800&height=600&seq=dot-gal-002&orientation=landscape', caption: 'Equipment delivery' },
        { url: 'https://readdy.ai/api/search-image?query=new%20medical%20equipment%20being%20installed%20in%20African%20health%20center%20diagnostic%20machines%20healthcare%20improvement%20project&width=800&height=600&seq=dot-gal-002b&orientation=landscape', caption: 'Equipment installation' },
      ],
    },
    {
      title: 'Village Road Rehabilitation',
      date: '25-03-2024',
      location: 'Kasumbalesa Rural Area',
      category: 'Infrastructure',
      images: [
        { url: 'https://readdy.ai/api/search-image?query=paved%20road%20construction%20in%20African%20rural%20area%20connecting%20villages%20infrastructure%20development%20project%20heavy%20machinery%20workers%20completing%20road&width=800&height=600&seq=dot-gal-003&orientation=landscape', caption: 'Road construction in progress' },
        { url: 'https://readdy.ai/api/search-image?query=completed%20paved%20road%20in%20African%20village%20infrastructure%20development%20project%20connecting%20communities%20improved%20transportation&width=800&height=600&seq=dot-gal-003b&orientation=landscape', caption: 'Completed road section' },
      ],
    },
    {
      title: 'Water Tower Installation',
      date: '12-03-2024',
      location: 'Fungurume Community',
      category: 'Utilities',
      images: [
        { url: 'https://readdy.ai/api/search-image?query=water%20tower%20and%20distribution%20system%20in%20African%20community%20clean%20water%20project%20modern%20infrastructure%20villagers%20collecting%20water%20celebration&width=800&height=600&seq=dot-gal-004&orientation=landscape', caption: 'Water tower installation' },
        { url: 'https://readdy.ai/api/search-image?query=community%20members%20celebrating%20new%20water%20supply%20system%20African%20village%20clean%20water%20access%20project%20happy%20villagers&width=800&height=600&seq=dot-gal-004b&orientation=landscape', caption: 'Community celebration' },
        { url: 'https://readdy.ai/api/search-image?query=water%20distribution%20point%20with%20villagers%20collecting%20clean%20water%20African%20community%20water%20project%20success&width=800&height=600&seq=dot-gal-004c&orientation=landscape', caption: 'Water distribution point' },
      ],
    },
    {
      title: 'Solar Panel Project',
      date: '28-02-2024',
      location: 'Likasi Village',
      category: 'Utilities',
      images: [
        { url: 'https://readdy.ai/api/search-image?query=solar%20panel%20installation%20in%20African%20village%20electrification%20project%20renewable%20energy%20community%20development%20workers%20installing%20panels%20on%20rooftops&width=800&height=600&seq=dot-gal-005&orientation=landscape', caption: 'Solar panel installation' },
      ],
    },
    {
      title: 'Community Market Opening',
      date: '15-02-2024',
      location: 'Kolwezi Town Center',
      category: 'Infrastructure',
      images: [
        { url: 'https://readdy.ai/api/search-image?query=community%20market%20building%20in%20African%20village%20with%20vendors%20and%20shoppers%20modern%20marketplace%20infrastructure%20development%20project%20ribbon%20cutting%20ceremony&width=800&height=600&seq=dot-gal-006&orientation=landscape', caption: 'Market opening ceremony' },
        { url: 'https://readdy.ai/api/search-image?query=vendors%20selling%20goods%20in%20new%20community%20market%20African%20village%20economic%20development%20project%20busy%20marketplace&width=800&height=600&seq=dot-gal-006b&orientation=landscape', caption: 'Market in operation' },
      ],
    },
    {
      title: 'Bridge Construction Completion',
      date: '02-02-2024',
      location: 'Lubumbashi River Crossing',
      category: 'Infrastructure',
      images: [
        { url: 'https://readdy.ai/api/search-image?query=newly%20constructed%20bridge%20over%20river%20in%20African%20rural%20area%20infrastructure%20development%20project%20connecting%20communities%20modern%20engineering&width=800&height=600&seq=dot-gal-007&orientation=landscape', caption: 'Completed bridge' },
      ],
    },
    {
      title: 'Vocational Training Center',
      date: '20-01-2024',
      location: 'Kipushi Skills Hub',
      category: 'Education',
      images: [
        { url: 'https://readdy.ai/api/search-image?query=vocational%20training%20center%20building%20in%20African%20community%20with%20students%20outside%20modern%20education%20facility%20skills%20development%20program%20inauguration&width=800&height=600&seq=dot-gal-008&orientation=landscape', caption: 'Training center exterior' },
        { url: 'https://readdy.ai/api/search-image?query=students%20learning%20practical%20skills%20in%20vocational%20training%20center%20African%20youth%20education%20program%20workshop%20setting&width=800&height=600&seq=dot-gal-008b&orientation=landscape', caption: 'Skills training in progress' },
      ],
    },
    {
      title: 'Agricultural Equipment Distribution',
      date: '08-01-2024',
      location: 'Fungurume Farming Zone',
      category: 'Agriculture',
      images: [
        { url: 'https://readdy.ai/api/search-image?query=agricultural%20equipment%20distribution%20ceremony%20African%20farmers%20receiving%20tractors%20and%20tools%20community%20development%20program%20outdoor%20event%20celebration&width=800&height=600&seq=dot-gal-009&orientation=landscape', caption: 'Equipment distribution' },
        { url: 'https://readdy.ai/api/search-image?query=farmers%20using%20new%20agricultural%20equipment%20in%20field%20African%20community%20farming%20support%20program%20modern%20machinery&width=800&height=600&seq=dot-gal-009b&orientation=landscape', caption: 'Equipment in use' },
      ],
    },
    {
      title: 'Sanitation Facility Construction',
      date: '18-12-2023',
      location: 'Kasumbalesa Public Area',
      category: 'Utilities',
      images: [
        { url: 'https://readdy.ai/api/search-image?query=public%20sanitation%20facility%20construction%20in%20African%20village%20modern%20toilets%20and%20washing%20stations%20community%20hygiene%20project%20infrastructure%20development&width=800&height=600&seq=dot-gal-010&orientation=landscape', caption: 'Sanitation facility construction' },
      ],
    },
    {
      title: 'Community Hall Inauguration',
      date: '05-12-2023',
      location: 'Likasi Town Square',
      category: 'Infrastructure',
      images: [
        { url: 'https://readdy.ai/api/search-image?query=community%20hall%20building%20inauguration%20in%20African%20village%20modern%20multipurpose%20facility%20ribbon%20cutting%20ceremony%20officials%20and%20community%20members%20celebrating&width=800&height=600&seq=dot-gal-011&orientation=landscape', caption: 'Community hall inauguration' },
        { url: 'https://readdy.ai/api/search-image?query=interior%20of%20new%20community%20hall%20with%20seating%20and%20stage%20African%20village%20multipurpose%20facility%20modern%20design&width=800&height=600&seq=dot-gal-011b&orientation=landscape', caption: 'Hall interior' },
      ],
    },
    {
      title: 'Street Lighting Installation',
      date: '22-11-2023',
      location: 'Kolwezi Main Road',
      category: 'Utilities',
      images: [
        { url: 'https://readdy.ai/api/search-image?query=street%20lighting%20installation%20in%20African%20town%20solar%20powered%20lights%20along%20main%20road%20infrastructure%20development%20project%20workers%20installing%20poles%20evening%20setting&width=800&height=600&seq=dot-gal-012&orientation=landscape', caption: 'Street lighting installation' },
      ],
    },
    {
      title: 'Classroom Furniture Delivery',
      date: '10-11-2023',
      location: 'Lubumbashi Secondary School',
      category: 'Education',
      images: [
        { url: 'https://readdy.ai/api/search-image?query=classroom%20furniture%20delivery%20African%20school%20receiving%20new%20desks%20and%20chairs%20education%20support%20program%20students%20and%20teachers%20celebrating%20modern%20equipment&width=800&height=600&seq=dot-gal-013&orientation=landscape', caption: 'Furniture delivery' },
        { url: 'https://readdy.ai/api/search-image?query=students%20sitting%20at%20new%20desks%20in%20African%20school%20classroom%20education%20improvement%20project%20modern%20furniture&width=800&height=600&seq=dot-gal-013b&orientation=landscape', caption: 'Students using new furniture' },
      ],
    },
    {
      title: 'Borehole Drilling Project',
      date: '28-10-2023',
      location: 'Kipushi Rural Community',
      category: 'Utilities',
      images: [
        { url: 'https://readdy.ai/api/search-image?query=borehole%20drilling%20project%20in%20African%20village%20clean%20water%20access%20drilling%20equipment%20workers%20community%20members%20watching%20water%20infrastructure%20development&width=800&height=600&seq=dot-gal-014&orientation=landscape', caption: 'Borehole drilling' },
        { url: 'https://readdy.ai/api/search-image?query=completed%20borehole%20with%20hand%20pump%20African%20village%20clean%20water%20project%20community%20members%20collecting%20water%20celebration&width=800&height=600&seq=dot-gal-014b&orientation=landscape', caption: 'Completed borehole' },
      ],
    },
    {
      title: 'Medical Equipment Handover',
      date: '15-10-2023',
      location: 'Fungurume Health Post',
      category: 'Healthcare',
      images: [
        { url: 'https://readdy.ai/api/search-image?query=medical%20equipment%20handover%20ceremony%20African%20health%20center%20receiving%20new%20diagnostic%20equipment%20healthcare%20support%20program%20officials%20and%20medical%20staff&width=800&height=600&seq=dot-gal-015&orientation=landscape', caption: 'Equipment handover ceremony' },
      ],
    },
  ];

  const filteredGallery = galleryItems.filter((item) => {
    const itemYear = item.date.split('-')[2];
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesYear = selectedYear === 'All' || itemYear === selectedYear;
    return matchesCategory && matchesYear;
  });

  const visibleGallery = filteredGallery.slice(0, visibleCount);
  const hasMore = visibleCount < filteredGallery.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 6, filteredGallery.length));
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
            backgroundImage: 'url(https://readdy.ai/api/search-image?query=corporate%20executives%20presenting%20large%20donation%20check%20to%20African%20community%20leaders%20official%20ceremony%20community%20development%20fund%20handover%20professional%20setting%20with%20company%20banners%20and%20community%20members%20celebrating&width=1920&height=400&seq=dot-hero-001&orientation=landscape)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50"></div>
        </div>

        <div className="relative h-full max-w-[1320px] mx-auto px-10 flex flex-col justify-end pb-16">
          <h1 className="text-5xl font-bold text-white mb-4" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
            DOT - Dotation to Community
          </h1>
          <p className="text-white text-xl font-light" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.3)' }}>
            0.3% of yearly turnover dedicated to community development
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
                  item.path === '/csr/dot'
                    ? 'bg-[#DC2626] text-white'
                    : 'bg-gray-100 text-[#2C3E50]'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-24 bg-white">
        <div className="max-w-[1320px] mx-auto px-6">
          <div className="grid grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-sm uppercase tracking-[2px] text-[#DC2626] font-semibold mb-5">Our Commitment</p>
              <h2 className="text-5xl font-bold text-[#2C3E50] mb-8" style={{ fontFamily: 'Merriweather, serif' }}>
                What is DOT?
              </h2>
              <p className="text-lg text-[#6C757D] leading-relaxed mb-6">
                DOT (Dotation to Community) is RUBAMIN SARL&apos;s flagship community investment program. We allocate <strong>0.3% of our annual turnover</strong> directly to community development projects, ensuring sustainable and meaningful impact in the regions where we operate.
              </p>
              <p className="text-lg text-[#6C757D] leading-relaxed mb-8">
                This commitment goes beyond regulatory requirements—it reflects our belief that business success and community prosperity are interconnected. Through transparent allocation and community-driven project selection, we ensure every contribution creates lasting value.
              </p>
              <div className="bg-[#FEF2F2] rounded-2xl p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                    <i className="ri-funds-line text-3xl text-[#DC2626]"></i>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-[#DC2626]">$1.5M+</div>
                    <p className="text-sm text-[#6C757D]">Total DOT contributions since inception</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <img
                src="https://readdy.ai/api/search-image?query=aerial%20view%20of%20newly%20constructed%20community%20infrastructure%20in%20African%20village%20including%20school%20buildings%20roads%20and%20water%20facilities%20modern%20development%20project%20clean%20organized%20layout%20showing%20community%20progress&width=700&height=600&seq=dot-intro-001&orientation=landscape"
                alt="DOT Projects"
                className="w-full h-full object-cover rounded-2xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Allocation Breakdown */}
      <section className="py-24 bg-[#F8F9FA]">
        <div className="max-w-[1320px] mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-[2px] text-[#DC2626] font-semibold mb-5">Fund Allocation</p>
            <h2 className="text-5xl font-bold text-[#2C3E50]" style={{ fontFamily: 'Merriweather, serif' }}>
              How DOT Funds Are Used
            </h2>
          </div>

          <div className="grid grid-cols-4 gap-8">
            {impactAreas.map((area, index) => (
              <div key={index} className="bg-white rounded-3xl p-8 text-center hover:shadow-xl transition-all">
                <div className="w-20 h-20 bg-[#FEF2F2] rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className={`${area.icon} text-4xl text-[#DC2626]`}></i>
                </div>
                <div className="text-4xl font-bold text-[#DC2626] mb-2">{area.percentage}</div>
                <h3 className="text-xl font-bold text-[#2C3E50] mb-3">{area.title}</h3>
                <p className="text-sm text-[#6C757D] leading-relaxed">{area.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Annual Contributions */}
      <section className="py-24 bg-white">
        <div className="max-w-[1320px] mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-[2px] text-[#DC2626] font-semibold mb-5">Transparency</p>
            <h2 className="text-5xl font-bold text-[#2C3E50]" style={{ fontFamily: 'Merriweather, serif' }}>
              Annual DOT Contributions
            </h2>
          </div>

          <div className="space-y-8">
            {dotProjects.map((yearData, index) => (
              <div key={index} className="bg-[#F8F9FA] rounded-3xl p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-3xl font-bold text-[#2C3E50]">{yearData.year}</h3>
                    <p className="text-sm text-[#6C757D]">Annual DOT Contribution</p>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold text-[#DC2626]">{yearData.amount}</div>
                    <p className="text-sm text-[#6C757D]">Total Allocated</p>
                  </div>
                </div>
                <div className="border-t border-gray-200 pt-6">
                  <h4 className="font-semibold text-[#2C3E50] mb-4">Key Projects Funded:</h4>
                  <ul className="grid grid-cols-3 gap-4">
                    {yearData.projects.map((project, pIndex) => (
                      <li key={pIndex} className="flex items-start">
                        <i className="ri-check-double-line text-[#DC2626] text-lg mr-2 mt-0.5"></i>
                        <span className="text-sm text-[#6C757D]">{project}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Photo Gallery */}
      <section className="py-24 bg-[#F8F9FA]">
        <div className="max-w-[1320px] mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-[2px] text-[#DC2626] font-semibold mb-5">Gallery</p>
            <h2 className="text-5xl font-bold text-[#2C3E50]" style={{ fontFamily: 'Merriweather, serif' }}>
              DOT Projects in Action
            </h2>
          </div>

          {/* Filter Section */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-10 bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-[#2C3E50]">Category:</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    handleFilterChange();
                  }}
                  className="px-4 py-2 bg-gray-100 border-0 rounded-lg text-sm text-[#2C3E50] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#DC2626]"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-[#2C3E50]">Year:</label>
                <select
                  value={selectedYear}
                  onChange={(e) => {
                    setSelectedYear(e.target.value);
                    handleFilterChange();
                  }}
                  className="px-4 py-2 bg-gray-100 border-0 rounded-lg text-sm text-[#2C3E50] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#DC2626]"
                >
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="text-sm text-[#6C757D]">
              Showing <span className="font-semibold text-[#2C3E50]">{visibleGallery.length}</span> of{' '}
              <span className="font-semibold text-[#2C3E50]">{filteredGallery.length}</span> items
            </div>
          </div>

          {filteredGallery.length > 0 ? (
            <div className="grid grid-cols-3 gap-6">
              {visibleGallery.map((item, index) => (
                <GalleryCard
                  key={index}
                  item={item}
                  onClick={() => setSelectedItem(item)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-image-line text-3xl text-gray-400"></i>
              </div>
              <h3 className="text-xl font-semibold text-[#2C3E50] mb-2">No Items Found</h3>
              <p className="text-[#6C757D]">Try adjusting your filters to see more gallery items.</p>
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

      {/* Governance */}
      <section className="py-24 bg-white">
        <div className="max-w-[1320px] mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-sm uppercase tracking-[2px] text-[#DC2626] font-semibold mb-5">Governance</p>
            <h2 className="text-5xl font-bold text-[#2C3E50] mb-8" style={{ fontFamily: 'Merriweather, serif' }}>
              Transparent &amp; Accountable
            </h2>
            <p className="text-lg text-[#6C757D] leading-relaxed mb-12">
              Our DOT program is governed by a joint committee comprising company representatives and community leaders. All projects are selected through community consultation, and fund utilization is audited annually to ensure transparency and accountability.
            </p>
            <div className="grid grid-cols-3 gap-8">
              <div className="bg-[#F8F9FA] rounded-2xl p-6">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-team-line text-2xl text-[#DC2626]"></i>
                </div>
                <h4 className="font-bold text-[#2C3E50] mb-2">Joint Committee</h4>
                <p className="text-sm text-[#6C757D]">Community and company representatives oversee fund allocation</p>
              </div>
              <div className="bg-[#F8F9FA] rounded-2xl p-6">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-file-search-line text-2xl text-[#DC2626]"></i>
                </div>
                <h4 className="font-bold text-[#2C3E50] mb-2">Annual Audit</h4>
                <p className="text-sm text-[#6C757D]">Independent auditors verify fund utilization and project completion</p>
              </div>
              <div className="bg-[#F8F9FA] rounded-2xl p-6">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-megaphone-line text-2xl text-[#DC2626]"></i>
                </div>
                <h4 className="font-bold text-[#2C3E50] mb-2">Public Reports</h4>
                <p className="text-sm text-[#6C757D]">Annual DOT reports published for community transparency</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Carousel Modal */}
      {selectedItem && (
        <GalleryCarousel
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}

      <Footer />
    </div>
  );
};

export default DOTPage;
