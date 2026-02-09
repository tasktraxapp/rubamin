
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../../../components/feature/Header';
import { Footer } from '../../../components/feature/Footer';
import { GalleryCarousel, GalleryCard, GalleryItemData } from '../../../components/feature/GalleryCarousel';

const SocialInitiativesPage: React.FC = () => {
  const [visibleCount, setVisibleCount] = useState(6);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedItem, setSelectedItem] = useState<GalleryItemData | null>(null);
  
  const subMenuItems = [
    { label: 'Social Initiatives', path: '/csr/social-initiatives' },
    { label: 'CSR', path: '/csr' },
    { label: 'DOT', path: '/csr/dot' },
  ];

  const categories = ['All', 'Education', 'Healthcare', 'Women Empowerment', 'Water & Sanitation', 'Environment', 'Sports & Youth'];
  const years = ['All', '2024', '2023'];

  const initiatives = [
    {
      icon: 'ri-graduation-cap-line',
      title: 'Education Programs',
      description: 'Comprehensive scholarship programs, school construction, and educational material donations supporting over 500 students annually.',
      image: 'https://readdy.ai/api/search-image?query=African%20children%20in%20bright%20classroom%20studying%20with%20books%20and%20educational%20materials%20modern%20school%20environment%20with%20happy%20students%20learning%20together%20community%20education%20program&width=600&height=400&seq=social-edu-001&orientation=landscape',
    },
    {
      icon: 'ri-heart-pulse-line',
      title: 'Healthcare Outreach',
      description: 'Free medical camps, mobile health clinics, and partnerships with local hospitals providing healthcare access to remote communities.',
      image: 'https://readdy.ai/api/search-image?query=medical%20professionals%20providing%20healthcare%20services%20in%20African%20community%20mobile%20clinic%20setting%20doctors%20and%20nurses%20helping%20patients%20in%20rural%20area%20health%20outreach%20program&width=600&height=400&seq=social-health-001&orientation=landscape',
    },
    {
      icon: 'ri-home-heart-line',
      title: 'Housing Development',
      description: 'Building affordable housing units and improving living conditions for families in surrounding communities.',
      image: 'https://readdy.ai/api/search-image?query=newly%20constructed%20affordable%20housing%20community%20in%20Africa%20modern%20simple%20homes%20with%20families%20outside%20community%20development%20project%20clean%20neighborhood&width=600&height=400&seq=social-housing-001&orientation=landscape',
    },
    {
      icon: 'ri-women-line',
      title: 'Women Empowerment',
      description: 'Skills training, microfinance support, and entrepreneurship programs empowering women to achieve financial independence.',
      image: 'https://readdy.ai/api/search-image?query=African%20women%20in%20vocational%20training%20workshop%20learning%20skills%20sewing%20tailoring%20crafts%20empowerment%20program%20bright%20indoor%20setting%20with%20equipment&width=600&height=400&seq=social-women-001&orientation=landscape',
    },
    {
      icon: 'ri-plant-line',
      title: 'Agricultural Support',
      description: 'Providing farming equipment, seeds, and training to local farmers to improve food security and livelihoods.',
      image: 'https://readdy.ai/api/search-image?query=African%20farmers%20in%20agricultural%20field%20with%20modern%20farming%20equipment%20training%20session%20community%20agricultural%20support%20program%20green%20crops%20healthy%20harvest&width=600&height=400&seq=social-agri-001&orientation=landscape',
    },
    {
      icon: 'ri-football-line',
      title: 'Youth Sports Programs',
      description: 'Sponsoring sports facilities, equipment, and youth leagues to promote healthy lifestyles and community engagement.',
      image: 'https://readdy.ai/api/search-image?query=African%20youth%20playing%20football%20soccer%20on%20community%20sports%20field%20with%20proper%20equipment%20uniforms%20youth%20sports%20program%20community%20engagement%20healthy%20lifestyle&width=600&height=400&seq=social-sports-001&orientation=landscape',
    },
  ];

  const galleryItems: GalleryItemData[] = [
    {
      title: 'School Supplies Distribution',
      date: '18-04-2024',
      location: 'Lubumbashi Primary School',
      category: 'Education',
      images: [
        { url: 'https://readdy.ai/api/search-image?query=company%20executives%20handing%20over%20educational%20materials%20to%20African%20school%20children%20ceremony%20community%20support%20program%20bright%20outdoor%20setting%20happy%20faces&width=800&height=600&seq=social-gal-001&orientation=landscape', caption: 'School supplies handover ceremony' },
        { url: 'https://readdy.ai/api/search-image?query=African%20children%20receiving%20new%20textbooks%20and%20notebooks%20education%20support%20program%20school%20distribution%20event%20happy%20students&width=800&height=600&seq=social-gal-001b&orientation=landscape', caption: 'Students receiving textbooks' },
      ],
    },
    {
      title: 'Free Medical Camp',
      date: '25-03-2024',
      location: 'Kipushi Community Center',
      category: 'Healthcare',
      images: [
        { url: 'https://readdy.ai/api/search-image?query=medical%20team%20providing%20free%20health%20checkup%20to%20African%20community%20members%20mobile%20clinic%20setting%20professional%20healthcare%20workers%20examining%20patients&width=800&height=600&seq=social-gal-002&orientation=landscape', caption: 'Medical checkup in progress' },
        { url: 'https://readdy.ai/api/search-image?query=doctor%20examining%20child%20at%20free%20medical%20camp%20African%20community%20healthcare%20outreach%20program%20professional%20medical%20care&width=800&height=600&seq=social-gal-002b&orientation=landscape', caption: 'Pediatric examination' },
        { url: 'https://readdy.ai/api/search-image?query=medicine%20distribution%20at%20free%20medical%20camp%20African%20community%20healthcare%20program%20pharmacy%20services&width=800&height=600&seq=social-gal-002c&orientation=landscape', caption: 'Medicine distribution' },
      ],
    },
    {
      title: 'Women Vocational Training',
      date: '12-03-2024',
      location: 'Lubumbashi Training Center',
      category: 'Women Empowerment',
      images: [
        { url: 'https://readdy.ai/api/search-image?query=African%20women%20in%20vocational%20training%20workshop%20learning%20sewing%20and%20tailoring%20skills%20empowerment%20program%20bright%20indoor%20setting%20with%20equipment&width=800&height=600&seq=social-gal-003&orientation=landscape', caption: 'Sewing training session' },
        { url: 'https://readdy.ai/api/search-image?query=women%20learning%20business%20skills%20at%20empowerment%20workshop%20African%20entrepreneurship%20training%20program%20professional%20instruction&width=800&height=600&seq=social-gal-003b&orientation=landscape', caption: 'Business skills workshop' },
      ],
    },
    {
      title: 'Clean Water Project Launch',
      date: '28-02-2024',
      location: 'Kasumbalesa Village',
      category: 'Water & Sanitation',
      images: [
        { url: 'https://readdy.ai/api/search-image?query=community%20water%20project%20inauguration%20clean%20water%20facility%20African%20village%20celebration%20happy%20community%20members%20gathering%20around%20new%20water%20pump&width=800&height=600&seq=social-gal-004&orientation=landscape', caption: 'Water project inauguration' },
        { url: 'https://readdy.ai/api/search-image?query=villagers%20collecting%20clean%20water%20from%20new%20community%20water%20point%20African%20village%20water%20access%20project%20happy%20families&width=800&height=600&seq=social-gal-004b&orientation=landscape', caption: 'Community using new water point' },
      ],
    },
    {
      title: 'Youth Football Tournament',
      date: '15-02-2024',
      location: 'Lubumbashi Sports Complex',
      category: 'Sports & Youth',
      images: [
        { url: 'https://readdy.ai/api/search-image?query=African%20youth%20playing%20football%20soccer%20on%20community%20sports%20field%20with%20proper%20equipment%20uniforms%20youth%20sports%20program%20community%20engagement%20healthy%20lifestyle&width=800&height=600&seq=social-gal-005&orientation=landscape', caption: 'Football tournament match' },
        { url: 'https://readdy.ai/api/search-image?query=youth%20football%20team%20receiving%20trophy%20at%20tournament%20award%20ceremony%20African%20sports%20program%20community%20celebration&width=800&height=600&seq=social-gal-005b&orientation=landscape', caption: 'Trophy presentation' },
        { url: 'https://readdy.ai/api/search-image?query=young%20football%20players%20posing%20for%20team%20photo%20after%20tournament%20African%20youth%20sports%20program%20community%20engagement&width=800&height=600&seq=social-gal-005c&orientation=landscape', caption: 'Team photo' },
      ],
    },
    {
      title: 'Agricultural Training Session',
      date: '05-02-2024',
      location: 'Fungurume Farming Area',
      category: 'Environment',
      images: [
        { url: 'https://readdy.ai/api/search-image?query=African%20farmers%20in%20agricultural%20field%20with%20modern%20farming%20equipment%20training%20session%20community%20agricultural%20support%20program%20green%20crops%20healthy%20harvest&width=800&height=600&seq=social-gal-006&orientation=landscape', caption: 'Agricultural training' },
      ],
    },
    {
      title: 'Housing Project Handover',
      date: '22-01-2024',
      location: 'Likasi Community',
      category: 'Women Empowerment',
      images: [
        { url: 'https://readdy.ai/api/search-image?query=newly%20constructed%20affordable%20housing%20community%20in%20Africa%20modern%20simple%20homes%20with%20families%20receiving%20keys%20community%20development%20project%20clean%20neighborhood%20celebration&width=800&height=600&seq=social-gal-007&orientation=landscape', caption: 'Housing handover ceremony' },
        { url: 'https://readdy.ai/api/search-image?query=happy%20family%20receiving%20keys%20to%20new%20home%20housing%20project%20African%20community%20development%20celebration&width=800&height=600&seq=social-gal-007b&orientation=landscape', caption: 'Family receiving keys' },
      ],
    },
    {
      title: 'Scholarship Award Ceremony',
      date: '10-01-2024',
      location: 'Lubumbashi Convention Hall',
      category: 'Education',
      images: [
        { url: 'https://readdy.ai/api/search-image?query=scholarship%20award%20ceremony%20African%20students%20receiving%20certificates%20and%20awards%20from%20company%20executives%20education%20support%20program%20formal%20indoor%20setting&width=800&height=600&seq=social-gal-008&orientation=landscape', caption: 'Scholarship award ceremony' },
      ],
    },
    {
      title: 'Health Awareness Campaign',
      date: '18-12-2023',
      location: 'Kolwezi Town Square',
      category: 'Healthcare',
      images: [
        { url: 'https://readdy.ai/api/search-image?query=health%20awareness%20campaign%20in%20African%20community%20with%20banners%20and%20medical%20staff%20educating%20villagers%20about%20hygiene%20and%20disease%20prevention%20outdoor%20gathering&width=800&height=600&seq=social-gal-009&orientation=landscape', caption: 'Health awareness campaign' },
        { url: 'https://readdy.ai/api/search-image?query=community%20members%20learning%20about%20health%20and%20hygiene%20at%20awareness%20event%20African%20village%20health%20education%20program&width=800&height=600&seq=social-gal-009b&orientation=landscape', caption: 'Health education session' },
      ],
    },
    {
      title: 'Tree Planting Initiative',
      date: '05-12-2023',
      location: 'Lubumbashi Green Zone',
      category: 'Environment',
      images: [
        { url: 'https://readdy.ai/api/search-image?query=community%20tree%20planting%20event%20African%20volunteers%20and%20company%20employees%20planting%20trees%20environmental%20conservation%20program%20green%20initiative%20outdoor%20activity&width=800&height=600&seq=social-gal-010&orientation=landscape', caption: 'Tree planting event' },
      ],
    },
    {
      title: 'Computer Lab Inauguration',
      date: '20-11-2023',
      location: 'Kipushi Secondary School',
      category: 'Education',
      images: [
        { url: 'https://readdy.ai/api/search-image?query=computer%20lab%20inauguration%20in%20African%20school%20with%20students%20and%20teachers%20new%20computers%20and%20equipment%20education%20technology%20support%20program%20modern%20classroom&width=800&height=600&seq=social-gal-011&orientation=landscape', caption: 'Computer lab inauguration' },
        { url: 'https://readdy.ai/api/search-image?query=students%20using%20new%20computers%20in%20school%20lab%20African%20education%20technology%20program%20digital%20literacy%20training&width=800&height=600&seq=social-gal-011b&orientation=landscape', caption: 'Students using computers' },
      ],
    },
    {
      title: 'Food Distribution Drive',
      date: '08-11-2023',
      location: 'Lubumbashi Relief Center',
      category: 'Healthcare',
      images: [
        { url: 'https://readdy.ai/api/search-image?query=food%20distribution%20drive%20African%20community%20members%20receiving%20food%20packages%20from%20volunteers%20humanitarian%20aid%20program%20organized%20distribution%20center&width=800&height=600&seq=social-gal-012&orientation=landscape', caption: 'Food distribution' },
      ],
    },
    {
      title: 'Microfinance Workshop',
      date: '25-10-2023',
      location: 'Likasi Business Center',
      category: 'Women Empowerment',
      images: [
        { url: 'https://readdy.ai/api/search-image?query=microfinance%20workshop%20African%20women%20entrepreneurs%20learning%20about%20small%20business%20loans%20and%20financial%20management%20empowerment%20program%20indoor%20training%20session&width=800&height=600&seq=social-gal-013&orientation=landscape', caption: 'Microfinance workshop' },
        { url: 'https://readdy.ai/api/search-image?query=women%20receiving%20microfinance%20certificates%20after%20completing%20business%20training%20African%20empowerment%20program%20graduation%20ceremony&width=800&height=600&seq=social-gal-013b&orientation=landscape', caption: 'Certificate presentation' },
      ],
    },
    {
      title: 'Sports Equipment Donation',
      date: '12-10-2023',
      location: 'Fungurume Youth Center',
      category: 'Sports & Youth',
      images: [
        { url: 'https://readdy.ai/api/search-image?query=sports%20equipment%20donation%20ceremony%20African%20youth%20receiving%20footballs%20and%20sports%20gear%20from%20company%20representatives%20community%20sports%20support%20program%20outdoor%20event&width=800&height=600&seq=social-gal-014&orientation=landscape', caption: 'Sports equipment donation' },
      ],
    },
    {
      title: 'Community Health Center Opening',
      date: '28-09-2023',
      location: 'Kasumbalesa Health Post',
      category: 'Healthcare',
      images: [
        { url: 'https://readdy.ai/api/search-image?query=community%20health%20center%20opening%20ceremony%20ribbon%20cutting%20African%20village%20new%20medical%20facility%20healthcare%20access%20program%20officials%20and%20community%20members%20celebrating&width=800&height=600&seq=social-gal-015&orientation=landscape', caption: 'Health center opening' },
        { url: 'https://readdy.ai/api/search-image?query=interior%20of%20new%20community%20health%20center%20with%20medical%20equipment%20African%20village%20healthcare%20facility%20modern%20medical%20services&width=800&height=600&seq=social-gal-015b&orientation=landscape', caption: 'Health center interior' },
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
            backgroundImage: 'url(https://readdy.ai/api/search-image?query=community%20volunteers%20helping%20African%20villagers%20with%20social%20development%20programs%20people%20working%20together%20building%20infrastructure%20education%20healthcare%20support%20bright%20sunny%20day%20positive%20atmosphere&width=1920&height=400&seq=social-hero-001&orientation=landscape)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50"></div>
        </div>

        <div className="relative h-full max-w-[1320px] mx-auto px-10 flex flex-col justify-end pb-16">
          <h1 className="text-5xl font-bold text-white mb-4" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
            Social Initiatives
          </h1>
          <p className="text-white text-xl font-light" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.3)' }}>
            Transforming lives through meaningful community programs
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
                  item.path === '/csr/social-initiatives'
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
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-sm uppercase tracking-[2px] text-[#DC2626] font-semibold mb-5">Community Development</p>
            <h2 className="text-5xl font-bold text-[#2C3E50] mb-8" style={{ fontFamily: 'Merriweather, serif' }}>
              Building a Better Future Together
            </h2>
            <p className="text-lg text-[#6C757D] leading-relaxed">
              Our social initiatives are designed to create sustainable, long-term positive impact in the communities where we operate. Through education, healthcare, housing, and empowerment programs, we are committed to improving lives and fostering inclusive growth.
            </p>
          </div>
        </div>
      </section>

      {/* Initiatives Grid */}
      <section className="py-24 bg-[#F8F9FA]">
        <div className="max-w-[1320px] mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-[2px] text-[#DC2626] font-semibold mb-5">Our Programs</p>
            <h2 className="text-5xl font-bold text-[#2C3E50]" style={{ fontFamily: 'Merriweather, serif' }}>
              Key Social Initiatives
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-8">
            {initiatives.map((initiative, index) => (
              <div key={index} className="bg-white rounded-3xl overflow-hidden hover:shadow-xl transition-all">
                <div className="h-48 overflow-hidden">
                  <img
                    src={initiative.image}
                    alt={initiative.title}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="p-8">
                  <div className="w-12 h-12 bg-[#FEF2F2] rounded-full flex items-center justify-center mb-4">
                    <i className={`${initiative.icon} text-2xl text-[#DC2626]`}></i>
                  </div>
                  <h3 className="text-xl font-bold text-[#2C3E50] mb-3">{initiative.title}</h3>
                  <p className="text-sm text-[#6C757D] leading-relaxed">{initiative.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Numbers */}
      <section className="py-24 bg-white">
        <div className="max-w-[1320px] mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-[2px] text-[#DC2626] font-semibold mb-5">Our Reach</p>
            <h2 className="text-5xl font-bold text-[#2C3E50]" style={{ fontFamily: 'Merriweather, serif' }}>
              Impact in Numbers
            </h2>
          </div>

          <div className="grid grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold text-[#DC2626] mb-3">15+</div>
              <p className="text-base text-[#6C757D]">Communities Served</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-[#DC2626] mb-3">3,500+</div>
              <p className="text-base text-[#6C757D]">Direct Beneficiaries</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-[#DC2626] mb-3">50+</div>
              <p className="text-base text-[#6C757D]">Active Programs</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-[#DC2626] mb-3">8</div>
              <p className="text-base text-[#6C757D]">Years of Service</p>
            </div>
          </div>
        </div>
      </section>

      {/* Photo Gallery */}
      <section className="py-24 bg-[#F8F9FA]">
        <div className="max-w-[1320px] mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-[2px] text-[#DC2626] font-semibold mb-5">Gallery</p>
            <h2 className="text-5xl font-bold text-[#2C3E50]" style={{ fontFamily: 'Merriweather, serif' }}>
              Moments of Impact
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

export default SocialInitiativesPage;
