import React from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../../components/feature/Header';
import { Footer } from '../../components/feature/Footer';
import { Button } from '../../components/base/Button';
import { BackToTop } from '../../components/feature/BackToTop';
import StatsCounter from './components/StatsCounter';

const HomePage: React.FC = () => {

  const certifications = [
    { name: 'ISO 9001:2015', description: 'Quality Management', icon: 'ri-award-line' },
    { name: 'ISO 14001:2015', description: 'Environmental Management', icon: 'ri-leaf-line' },
    { name: 'ISO 45001:2018', description: 'Occupational Health & Safety', icon: 'ri-shield-check-line' },
    { name: 'ISO 17025', description: 'Laboratory Competence', icon: 'ri-flask-line' },
  ];

  const affiliations = [
    { name: 'Chamber of Mines DRC', icon: 'ri-government-line' },
    { name: 'FEC Katanga', icon: 'ri-building-4-line' },
    { name: 'ITRI / ITSCI', icon: 'ri-global-line' },
    { name: 'Copper Mark', icon: 'ri-copper-coin-line' },
    { name: 'EITI', icon: 'ri-hand-heart-line' },
    { name: 'ICA Member', icon: 'ri-links-line' },
  ];

  const products = [
    {
      image: 'https://readdy.ai/api/search-image?query=copper%20blister%20ingots%20stacked%20neatly%20in%20industrial%20warehouse%20with%20warm%20metallic%20copper%20tones%20and%20clean%20simple%20background%20professional%20product%20photography%20of%20refined%20copper%20metal%20with%20smooth%20surface%20texture%20and%20reddish%20golden%20color&width=600&height=400&seq=home-prod-copper-001&orientation=landscape',
      title: 'Copper Blister',
      purity: '98.5% - 99.5% Purity',
      description: 'Premium copper blister produced using advanced smelting technology, serving as essential raw material for refineries and manufacturers worldwide.',
      features: ['ISO 9001:2015 Certified', '50,000+ Tons Annual Capacity', 'Global Export Standards'],
      link: '/products/copper-blister',
    },
    {
      image: 'https://readdy.ai/api/search-image?query=industrial%20gas%20cylinders%20and%20storage%20tanks%20in%20modern%20facility%20with%20steel%20containers%20and%20piping%20systems%20clean%20organized%20industrial%20gas%20production%20plant%20with%20metallic%20silver%20tones%20and%20professional%20lighting%20simple%20background&width=600&height=400&seq=home-prod-indgas-001&orientation=landscape',
      title: 'Industrial Gas',
      purity: 'High-Purity Grade',
      description: 'Comprehensive industrial gas supply including oxygen, nitrogen, argon, and specialty gases for construction, manufacturing, and energy sectors.',
      features: ['Oxygen, Nitrogen & Argon', 'Bulk & Cylinder Supply', 'On-Site Generation'],
      link: '/products/industrial-gas',
    },
    {
      image: 'https://readdy.ai/api/search-image?query=medical%20grade%20gas%20cylinders%20in%20hospital%20supply%20room%20with%20clean%20white%20and%20green%20color%20scheme%20sterile%20medical%20environment%20with%20oxygen%20tanks%20and%20medical%20equipment%20professional%20healthcare%20facility%20simple%20background&width=600&height=400&seq=home-prod-medgas-001&orientation=landscape',
      title: 'Medical Gas',
      purity: 'Pharmacopoeia Grade',
      description: 'Certified medical-grade gases meeting international healthcare standards, supplied to hospitals and medical facilities across the region.',
      features: ['WHO Standards Compliant', 'Hospital Pipeline Systems', '24/7 Emergency Supply'],
      link: '/products/medical-gas',
    },
  ];

  const hseHighlights = [
    {
      icon: 'ri-shield-check-line',
      title: 'Safety First',
      stat: 'Zero',
      statLabel: 'Harm Target',
      description: 'Comprehensive safety protocols and training programs ensuring a zero-harm workplace culture across all operations.',
    },
    {
      icon: 'ri-heart-pulse-line',
      title: 'Health & Wellbeing',
      stat: 'ISO 45001',
      statLabel: 'Certified',
      description: 'Employee health programs, regular medical checkups, and wellness initiatives promoting physical and mental health.',
    },
    {
      icon: 'ri-leaf-line',
      title: 'Environmental Protection',
      stat: '50%',
      statLabel: 'Emission Reduction',
      description: 'Advanced emission control systems, waste management, and resource conservation practices minimizing environmental impact.',
    },
  ];

  const dotImpactAreas = [
    { icon: 'ri-building-line', title: 'Infrastructure', percentage: '35%', description: 'Roads, bridges, and public facilities' },
    { icon: 'ri-graduation-cap-line', title: 'Education', percentage: '30%', description: 'Schools, scholarships, and training' },
    { icon: 'ri-hospital-line', title: 'Healthcare', percentage: '20%', description: 'Medical facilities and equipment' },
    { icon: 'ri-water-flash-line', title: 'Utilities', percentage: '15%', description: 'Water, electricity, and sanitation' },
  ];

  const socialInitiatives = [
    { icon: 'ri-graduation-cap-line', title: 'Education', description: 'Scholarships and school construction supporting 500+ students annually' },
    { icon: 'ri-heart-pulse-line', title: 'Healthcare', description: 'Free medical camps and mobile clinics for remote communities' },
    { icon: 'ri-women-line', title: 'Women Empowerment', description: 'Skills training and microfinance for financial independence' },
    { icon: 'ri-plant-line', title: 'Agriculture', description: 'Farming equipment and training improving food security' },
    { icon: 'ri-home-heart-line', title: 'Housing', description: 'Affordable housing improving living conditions for families' },
    { icon: 'ri-football-line', title: 'Youth & Sports', description: 'Sports facilities and leagues promoting healthy lifestyles' },
  ];

  const csrPillars = [
    {
      icon: 'ri-hand-heart-line',
      title: 'Community Development',
      description: 'Building sustainable communities through infrastructure, education, and healthcare investments.',
      stat: '$2M+',
      statLabel: 'Invested',
    },
    {
      icon: 'ri-leaf-line',
      title: 'Environmental Stewardship',
      description: 'Protecting natural resources through responsible mining practices and ecosystem restoration.',
      stat: '10K+',
      statLabel: 'Trees Planted',
    },
    {
      icon: 'ri-user-heart-line',
      title: 'Employee Welfare',
      description: 'Ensuring fair wages, safe working conditions, and professional development opportunities.',
      stat: '500+',
      statLabel: 'Employees',
    },
    {
      icon: 'ri-government-line',
      title: 'Ethical Governance',
      description: 'Maintaining transparency, accountability, and compliance with international standards.',
      stat: '100%',
      statLabel: 'Compliance',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[500px] sm:h-[550px] lg:h-[650px] overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://readdy.ai/api/search-image?query=modern%20industrial%20copper%20smelting%20facility%20with%20advanced%20manufacturing%20equipment%20and%20metallic%20structures%20professional%20industrial%20photography%20showing%20large%20scale%20production%20operations%20with%20warm%20copper%20tones%20and%20industrial%20blue%20lighting%20wide%20angle%20view%20of%20factory%20floor%20with%20sophisticated%20machinery%20and%20clean%20organized%20workspace%20representing%20excellence%20in%20metal%20production&width=1920&height=650&seq=hero-bg-001&orientation=landscape)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-transparent"></div>
        </div>

        {/* Hero Content */}
        <div className="relative h-full max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-10 flex flex-col justify-end pb-8 sm:pb-10 lg:pb-12">
          {/* Main Headline */}
          <div className="max-w-[700px]">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4 sm:mb-6" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
              Leading Industrial<br />Excellence Forward
            </h1>
            <p className="text-white text-base sm:text-lg lg:text-xl font-light leading-relaxed mb-6 sm:mb-8 max-w-[500px] lg:max-w-none" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.3)' }}>
              Delivering premium copper products and industrial gas solutions with unwavering commitment to quality and sustainability.
            </p>
          </div>
        </div>
      </section>

      {/* Animated Statistics Counter */}
      <StatsCounter />

      {/* Pioneering Excellence Section - Light Grey Background */}
      <section className="bg-[#F8F9FA] py-12 sm:py-16 lg:py-28">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-16 items-center">
            {/* Left Column */}
            <div className="lg:col-span-3 order-2 lg:order-1">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#2C3E50] leading-tight mb-6 sm:mb-8" style={{ fontFamily: 'Merriweather, serif' }}>
                Pioneering Excellence in Industrial Manufacturing
              </h2>
              <p className="text-base sm:text-lg text-[#6C757D] leading-relaxed mb-6 sm:mb-8">
                With decades of experience and cutting-edge technology, we deliver superior copper products and industrial gas solutions that power industries worldwide. Our commitment to quality, safety, and sustainability sets us apart as a trusted partner in industrial excellence.
              </p>
              <ul className="space-y-3 sm:space-y-4 mb-8 sm:mb-12">
                <li className="flex items-start">
                  <i className="ri-check-line text-[#DC2626] text-lg sm:text-xl mr-3 mt-0.5 sm:mt-1"></i>
                  <span className="text-sm sm:text-base text-[#2C3E50]"><strong>Advanced Technology:</strong> State-of the art facilities with latest manufacturing innovations</span>
                </li>
                <li className="flex items-start">
                  <i className="ri-check-line text-[#DC2626] text-lg sm:text-xl mr-3 mt-0.5 sm:mt-1"></i>
                  <span className="text-sm sm:text-base text-[#2C3E50]"><strong>Quality Assurance:</strong> Rigorous testing and international certification standards</span>
                </li>
                <li className="flex items-start">
                  <i className="ri-check-line text-[#DC2626] text-lg sm:text-xl mr-3 mt-0.5 sm:mt-1"></i>
                  <span className="text-sm sm:text-base text-[#2C3E50]"><strong>Sustainable Practices:</strong> Environmental responsibility at every stage of production</span>
                </li>
                <li className="flex items-start">
                  <i className="ri-check-line text-[#DC2626] text-lg sm:text-xl mr-3 mt-0.5 sm:mt-1"></i>
                  <span className="text-sm sm:text-base text-[#2C3E50]"><strong>Expert Team:</strong> Highly skilled professionals dedicated to excellence</span>
                </li>
              </ul>
              <Link to="/company/corporate-overview" className="inline-flex items-center px-8 py-3.5 bg-[#DC2626] text-white rounded-full font-semibold hover:bg-[#B91C1C] transition-all duration-300 cursor-pointer whitespace-nowrap">
                <span>Explore Company</span>
                <i className="ri-arrow-right-line ml-2"></i>
              </Link>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-2 order-1 lg:order-2">
              <img
                src="https://readdy.ai/api/search-image?query=professional%20industrial%20team%20working%20in%20modern%20copper%20manufacturing%20facility%20with%20engineers%20and%20technicians%20in%20safety%20equipment%20inspecting%20quality%20control%20processes%20bright%20clean%20industrial%20environment%20with%20metallic%20copper%20materials%20and%20advanced%20machinery%20teamwork%20and%20expertise%20in%20metal%20production%20industry&width=600&height=700&seq=team-work-001&orientation=portrait"
                alt="Industrial Excellence"
                className="w-full h-[300px] sm:h-[400px] lg:h-full object-cover rounded-2xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="bg-white py-12 sm:py-16 lg:py-24">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-16">
            <p className="text-xs sm:text-sm uppercase tracking-[2px] text-[#DC2626] font-semibold mb-3 sm:mb-5">What We Produce</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#2C3E50] mb-4" style={{ fontFamily: 'Merriweather, serif' }}>
              Our Core Products
            </h2>
            <p className="text-sm sm:text-base text-[#6C757D] max-w-[700px] mx-auto leading-relaxed">
              From premium copper blister to certified industrial and medical gases, we deliver products that power industries and save lives.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8" data-product-shop>
            {products.map((product, index) => (
              <Link
                key={index}
                to={product.link}
                className="bg-[#F8F9FA] rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group"
              >
                <div className="relative w-full h-[220px] sm:h-[240px] lg:h-[300px] overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <span className="text-xs font-semibold text-[#DC2626]">{product.purity}</span>
                  </div>
                </div>
                <div className="p-6 sm:p-8">
                  <h3 className="text-xl sm:text-2xl font-bold text-[#2C3E50] mb-3">{product.title}</h3>
                  <p className="text-sm text-[#6C757D] leading-relaxed mb-5 line-clamp-3">{product.description}</p>
                  <div className="space-y-2 mb-6">
                    {product.features.map((feature, fIndex) => (
                      <div key={fIndex} className="flex items-center">
                        <i className="ri-check-double-line text-[#DC2626] mr-2 text-sm"></i>
                        <span className="text-xs sm:text-sm text-[#2C3E50]">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center text-[#DC2626] text-sm font-medium group-hover:underline">
                    <span>View Details</span>
                    <i className="ri-arrow-right-line ml-2 group-hover:translate-x-1 transition-transform"></i>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10 sm:mt-14">
            <Link to="/products" className="inline-flex items-center px-8 py-3.5 bg-[#DC2626] text-white rounded-full font-semibold hover:bg-[#B91C1C] transition-all duration-300 cursor-pointer whitespace-nowrap">
              <span>Explore All Products</span>
              <i className="ri-arrow-right-line ml-2"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* HSE Section - Moved below Products */}
      <section className="bg-[#F8F9FA] py-12 sm:py-16 lg:py-24">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center mb-12 sm:mb-16">
            {/* Left — Image */}
            <div className="relative">
              <img
                src="https://readdy.ai/api/search-image?query=professional%20industrial%20safety%20team%20wearing%20bright%20orange%20safety%20vests%20and%20white%20hard%20hats%20inspecting%20modern%20manufacturing%20equipment%20in%20clean%20organized%20facility%20bright%20natural%20lighting%20showing%20teamwork%20and%20safety%20culture%20in%20copper%20production%20plant&width=700&height=550&seq=home-hse-section-001&orientation=landscape"
                alt="HSE Excellence"
                className="w-full h-[300px] sm:h-[400px] lg:h-[480px] object-cover object-top rounded-2xl shadow-lg"
              />
              {/* Floating Stats Card */}
              <div className="absolute -bottom-6 -left-4 sm:bottom-6 sm:left-6 bg-white rounded-2xl p-5 sm:p-6 shadow-xl">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#FEF2F2] rounded-full flex items-center justify-center">
                    <i className="ri-shield-star-line text-xl sm:text-2xl text-[#DC2626]"></i>
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-bold text-[#DC2626]">2M+</div>
                    <p className="text-xs sm:text-sm text-[#6C757D]">Safe Work Hours</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right — Content */}
            <div>
              <p className="text-xs sm:text-sm uppercase tracking-[2px] text-[#DC2626] font-semibold mb-3 sm:mb-5">Health, Safety & Environment</p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#2C3E50] leading-tight mb-5 sm:mb-6" style={{ fontFamily: 'Merriweather, serif' }}>
                Safety First, Always
              </h2>
              <p className="text-sm sm:text-base text-[#6C757D] leading-relaxed mb-6">
                Our unwavering commitment to health, safety, and environmental excellence protects our people, communities, and planet. Every decision we make prioritizes zero harm across all operations.
              </p>

              {/* Key StatsRow */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="text-center bg-white rounded-xl p-4 sm:p-5 shadow-sm">
                  <div className="text-xl sm:text-2xl font-bold text-[#DC2626]">Zero</div>
                  <span className="text-xs text-[#6C757D]">Lost Time Injuries</span>
                </div>
                <div className="text-center bg-white rounded-xl p-4 sm:p-5 shadow-sm">
                  <div className="text-xl sm:text-2xl font-bold text-[#DC2626]">100%</div>
                  <span className="text-xs text-[#6C757D]">Compliance Rate</span>
                </div>
                <div className="text-center bg-white rounded-xl p-4 sm:p-5 shadow-sm">
                  <div className="text-xl sm:text-2xl font-bold text-[#DC2626]">365</div>
                  <span className="text-xs text-[#6C757D]">Days Incident Free</span>
                </div>
              </div>

              {/* Certification Badges */}
              <div className="flex flex-wrap items-center gap-3 mb-8">
                <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-sm">
                  <i className="ri-award-line text-[#DC2626] mr-2"></i>
                  <span className="text-xs font-semibold text-[#2C3E50]">ISO 45001</span>
                </div>
                <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-sm">
                  <i className="ri-leaf-line text-[#DC2626] mr-2"></i>
                  <span className="text-xs font-semibold text-[#2C3E50]">ISO 14001</span>
                </div>
                <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-sm">
                  <i className="ri-shield-check-line text-[#DC2626] mr-2"></i>
                  <span className="text-xs font-semibold text-[#2C3E50]">OHSAS Certified</span>
                </div>
              </div>

              <Link to="/sustainability/hse" className="inline-flex items-center px-8 py-3.5 bg-[#DC2626] text-white rounded-full font-semibold hover:bg-[#B91C1C] transition-all duration-300 cursor-pointer whitespace-nowrap">
                <span>View HSE Policy</span>
                <i className="ri-arrow-right-line ml-2"></i>
              </Link>
            </div>
          </div>

          {/* HSE Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {hseHighlights.map((item, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 sm:p-8 hover:shadow-lg transition-all duration-300 cursor-default">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#FEF2F2] rounded-full flex items-center justify-center mb-5">
                  <i className={`${item.icon} text-2xl sm:text-3xl text-[#DC2626]`}></i>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-[#2C3E50] mb-2">{item.title}</h3>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-2xl sm:text-3xl font-bold text-[#DC2626]">{item.stat}</span>
                  <span className="text-xs sm:text-sm text-[#6C757D]">{item.statLabel}</span>
                </div>
                <p className="text-sm text-[#6C757D] leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Initiatives Section */}
      <section className="bg-white py-12 sm:py-16 lg:py-24">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center mb-12 sm:mb-16">
            {/* Left — Content */}
            <div className="order-2 lg:order-1">
              <p className="text-xs sm:text-sm uppercase tracking-[2px] text-[#DC2626] font-semibold mb-3 sm:mb-5">Social Initiatives</p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#2C3E50] leading-tight mb-5 sm:mb-6" style={{ fontFamily: 'Merriweather, serif' }}>
                Transforming Lives Through Action
              </h2>
              <p className="text-sm sm:text-base text-[#6C757D] leading-relaxed mb-6">
                Our social initiatives create sustainable, long-term positive impact across education, healthcare, women empowerment, and community development—improving lives and fostering inclusive growth in the regions where we operate.
              </p>

              {/* Impact Stats */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-[#F8F9FA] rounded-xl p-4 sm:p-5">
                  <div className="text-2xl sm:text-3xl font-bold text-[#DC2626]">3,500+</div>
                  <span className="text-xs sm:text-sm text-[#6C757D]">Direct Beneficiaries</span>
                </div>
                <div className="bg-[#F8F9FA] rounded-xl p-4 sm:p-5">
                  <div className="text-2xl sm:text-3xl font-bold text-[#DC2626]">15+</div>
                  <span className="text-xs sm:text-sm text-[#6C757D]">Communities Served</span>
                </div>
                <div className="bg-[#F8F9FA] rounded-xl p-4 sm:p-5">
                  <div className="text-2xl sm:text-3xl font-bold text-[#DC2626]">50+</div>
                  <span className="text-xs sm:text-sm text-[#6C757D]">Active Programs</span>
                </div>
                <div className="bg-[#F8F9FA] rounded-xl p-4 sm:p-5">
                  <div className="text-2xl sm:text-3xl font-bold text-[#DC2626]">8</div>
                  <span className="text-xs sm:text-sm text-[#6C757D]">Years of Service</span>
                </div>
              </div>

              <Link to="/csr/social-initiatives" className="inline-flex items-center px-8 py-3.5 bg-[#DC2626] text-white rounded-full font-semibold hover:bg-[#B91C1C] transition-all duration-300 cursor-pointer whitespace-nowrap">
                <span>Explore Initiatives</span>
                <i className="ri-arrow-right-line ml-2"></i>
              </Link>
            </div>

            {/* Right — Image */}
            <div className="order-1 lg:order-2 relative">
              <img
                src="https://readdy.ai/api/search-image?query=community%20volunteers%20and%20company%20employees%20helping%20African%20villagers%20with%20social%20development%20programs%20people%20working%20together%20building%20school%20infrastructure%20education%20support%20bright%20sunny%20day%20positive%20atmosphere%20warm%20tones%20showing%20teamwork%20and%20community%20engagement&width=700&height=550&seq=home-social-init-001&orientation=landscape"
                alt="Social Initiatives"
                className="w-full h-[300px] sm:h-[400px] lg:h-[480px] object-cover object-top rounded-2xl shadow-lg"
              />
              {/* Floating Card */}
              <div className="absolute -bottom-6 -right-4 sm:bottom-6 sm:right-6 bg-white rounded-2xl p-5 sm:p-6 shadow-xl">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#FEF2F2] rounded-full flex items-center justify-center">
                    <i className="ri-hand-heart-line text-xl sm:text-2xl text-[#DC2626]"></i>
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-bold text-[#DC2626]">50+</div>
                    <p className="text-xs sm:text-sm text-[#6C757D]">Active Programs</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Initiative Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
            {socialInitiatives.map((item, index) => (
              <div key={index} className="bg-[#F8F9FA] rounded-2xl p-5 sm:p-6 text-center hover:shadow-lg transition-all duration-300 cursor-default group">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#FEF2F2] rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-[#DC2626] transition-colors duration-300">
                  <i className={`${item.icon} text-xl sm:text-2xl text-[#DC2626] group-hover:text-white transition-colors duration-300`}></i>
                </div>
                <h3 className="text-sm font-bold text-[#2C3E50] mb-1">{item.title}</h3>
                <p className="text-xs text-[#6C757D] leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CSR Section - New */}
      <section className="bg-[#F8F9FA] py-12 sm:py-16 lg:py-24">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center mb-12 sm:mb-16">
            {/* Left — Image */}
            <div className="relative">
              <img
                src="https://readdy.ai/api/search-image?query=corporate%20social%20responsibility%20activities%20showing%20company%20employees%20planting%20trees%20and%20engaging%20in%20environmental%20conservation%20programs%20in%20African%20community%20green%20landscape%20with%20volunteers%20working%20together%20sustainable%20development%20bright%20daylight%20professional%20photography&width=700&height=550&seq=home-csr-section-001&orientation=landscape"
                alt="CSR Activities"
                className="w-full h-[300px] sm:h-[400px] lg:h-[480px] object-cover object-top rounded-2xl shadow-lg"
              />
              {/* Floating Card */}
              <div className="absolute -bottom-6 -left-4 sm:bottom-6 sm:left-6 bg-white rounded-2xl p-5 sm:p-6 shadow-xl">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#FEF2F2] rounded-full flex items-center justify-center">
                    <i className="ri-earth-line text-xl sm:text-2xl text-[#DC2626]"></i>
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-bold text-[#DC2626]">$2M+</div>
                    <p className="text-xs sm:text-sm text-[#6C757D]">CSR Investment</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right — Content */}
            <div>
              <p className="text-xs sm:text-sm uppercase tracking-[2px] text-[#DC2626] font-semibold mb-3 sm:mb-5">Corporate Social Responsibility</p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#2C3E50] leading-tight mb-5 sm:mb-6" style={{ fontFamily: 'Merriweather, serif' }}>
                Responsible Business, Lasting Impact
              </h2>
              <p className="text-sm sm:text-base text-[#6C757D] leading-relaxed mb-6">
                Our CSR philosophy integrates ethical practices, environmental stewardship, and community welfare into every aspect of our operations. We believe that sustainable business success is built on creating shared value for all stakeholders.
              </p>

              {/* CSR Highlights */}
              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-[#FEF2F2] rounded-full flex items-center justify-center shrink-0 mr-4">
                    <i className="ri-check-line text-[#DC2626]"></i>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#2C3E50] mb-1">Sustainable Development Goals</h4>
                    <p className="text-xs text-[#6C757D]">Aligned with UN SDGs for global impact</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-[#FEF2F2] rounded-full flex items-center justify-center shrink-0 mr-4">
                    <i className="ri-check-line text-[#DC2626]"></i>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#2C3E50] mb-1">Stakeholder Engagement</h4>
                    <p className="text-xs text-[#6C757D]">Regular dialogue with communities and partners</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-[#FEF2F2] rounded-full flex items-center justify-center shrink-0 mr-4">
                    <i className="ri-check-line text-[#DC2626]"></i>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#2C3E50] mb-1">Transparent Reporting</h4>
                    <p className="text-xs text-[#6C757D]">Annual sustainability and CSR reports published</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link to="/csr/social-initiatives" className="inline-flex items-center px-8 py-3.5 bg-[#DC2626] text-white rounded-full font-semibold hover:bg-[#B91C1C] transition-all duration-300 cursor-pointer whitespace-nowrap">
                  <span>View CSR Programs</span>
                  <i className="ri-arrow-right-line ml-2"></i>
                </Link>
                <Link to="/csr/dot" className="inline-flex items-center px-8 py-3.5 border-2 border-[#DC2626] text-[#DC2626] rounded-full font-semibold hover:bg-[#DC2626] hover:text-white transition-all duration-300 cursor-pointer whitespace-nowrap">
                  <span>DOT Program</span>
                  <i className="ri-arrow-right-line ml-2"></i>
                </Link>
              </div>
            </div>
          </div>

          {/* CSR Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {csrPillars.map((pillar, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 sm:p-8 hover:shadow-lg transition-all duration-300 cursor-default">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#FEF2F2] rounded-full flex items-center justify-center mb-5">
                  <i className={`${pillar.icon} text-2xl sm:text-3xl text-[#DC2626]`}></i>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-[#2C3E50] mb-2">{pillar.title}</h3>
                <p className="text-sm text-[#6C757D] leading-relaxed mb-4">{pillar.description}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-bold text-[#DC2626]">{pillar.stat}</span>
                  <span className="text-xs sm:text-sm text-[#6C757D]">{pillar.statLabel}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DOT - Community Investment Section */}
      <section className="bg-white py-12 sm:py-16 lg:py-24">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center mb-12 sm:mb-16">
            {/* Left — Content */}
            <div className="order-2 lg:order-1">
              <p className="text-xs sm:text-sm uppercase tracking-[2px] text-[#DC2626] font-semibold mb-3 sm:mb-5">DOT Program</p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#2C3E50] leading-tight mb-5 sm:mb-6" style={{ fontFamily: 'Merriweather, serif' }}>
                Investing in Our Communities
              </h2>
              <p className="text-sm sm:text-base text-[#6C757D] leading-relaxed mb-6">
                Through our DOT (Dotation to Community) program, we allocate <strong>0.3% of annual turnover</strong> directly to community development projects—building schools, health centers, roads, and essential infrastructure in the regions where we operate.
              </p>

              <div className="bg-[#FEF2F2] rounded-2xl p-5 sm:p-6 mb-6 sm:mb-8">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-full flex items-center justify-center shrink-0">
                    <i className="ri-funds-line text-2xl sm:text-3xl text-[#DC2626]"></i>
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-bold text-[#DC2626]">$1.5M+</div>
                    <p className="text-xs sm:text-sm text-[#6C757D]">Total DOT contributions since inception</p>
                  </div>
                </div>
              </div>

              <Link to="/csr/dot" className="inline-flex items-center px-8 py-3.5 bg-[#DC2626] text-white rounded-full font-semibold hover:bg-[#B91C1C] transition-all duration-300 cursor-pointer whitespace-nowrap">
                <span>Learn About DOT</span>
                <i className="ri-arrow-right-line ml-2"></i>
              </Link>
            </div>

            {/* Right — Image */}
            <div className="order-1 lg:order-2">
              <img
                src="https://readdy.ai/api/search-image?query=aerial%20view%20of%20newly%20constructed%20community%20infrastructure%20in%20African%20village%20including%20school%20buildings%20roads%20and%20water%20facilities%20modern%20development%20project%20clean%20organized%20layout%20showing%20community%20progress%20and%20sustainable%20development&width=700&height=550&seq=home-dot-img-001&orientation=landscape"
                alt="DOT Community Projects"
                className="w-full h-[300px] sm:h-[400px] lg:h-[480px] object-cover object-top rounded-2xl shadow-lg"
              />
            </div>
          </div>

          {/* Impact Areas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {dotImpactAreas.map((area, index) => (
              <div key={index} className="bg-[#F8F9FA] rounded-2xl p-5 sm:p-6 text-center hover:shadow-lg transition-all duration-300 cursor-default">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#FEF2F2] rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className={`${area.icon} text-2xl sm:text-3xl text-[#DC2626]`}></i>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-[#DC2626] mb-1">{area.percentage}</div>
                <h3 className="text-sm sm:text-base font-bold text-[#2C3E50] mb-1">{area.title}</h3>
                <p className="text-xs text-[#6C757D]">{area.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Jobs / Careers Section */}
      <section className="bg-[#F8F9FA] py-12 sm:py-16 lg:py-24">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left — Image */}
            <div>
              <img
                src="https://readdy.ai/api/search-image?query=diverse%20professional%20team%20of%20industrial%20workers%20and%20engineers%20in%20modern%20manufacturing%20facility%20wearing%20safety%20gear%20having%20a%20collaborative%20meeting%20smiling%20and%20engaged%20in%20discussion%20bright%20clean%20industrial%20environment%20with%20copper%20tones%20representing%20teamwork%20career%20growth%20and%20professional%20development&width=700&height=550&seq=home-careers-img-001&orientation=landscape"
                alt="Career Opportunities"
                className="w-full h-[300px] sm:h-[400px] lg:h-[480px] object-cover object-top rounded-2xl shadow-lg"
              />
            </div>

            {/* Right — Content */}
            <div>
              <p className="text-xs sm:text-sm uppercase tracking-[2px] text-[#DC2626] font-semibold mb-3 sm:mb-5">Jobs at RUBAMIN</p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#2C3E50] leading-tight mb-5 sm:mb-6" style={{ fontFamily: 'Merriweather, serif' }}>
                Build Your Future With Us
              </h2>
              <p className="text-sm sm:text-base text-[#6C757D] leading-relaxed mb-8">
                Join 300+ skilled professionals driving innovation in copper production and industrial gas solutions. We offer competitive benefits, continuous learning, and a culture that values every individual.
              </p>

              {/* Perks Row */}
              <div className="grid grid-cols-3 gap-4 mb-8 sm:mb-10">
                <div className="text-center bg-white rounded-xl p-4 sm:p-5">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#FEF2F2] rounded-full flex items-center justify-center mx-auto mb-3">
                    <i className="ri-line-chart-line text-lg sm:text-xl text-[#DC2626]"></i>
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-[#2C3E50]">Growth</span>
                </div>
                <div className="text-center bg-white rounded-xl p-4 sm:p-5">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#FEF2F2] rounded-full flex items-center justify-center mx-auto mb-3">
                    <i className="ri-team-line text-lg sm:text-xl text-[#DC2626]"></i>
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-[#2C3E50]">Culture</span>
                </div>
                <div className="text-center bg-white rounded-xl p-4 sm:p-5">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#FEF2F2] rounded-full flex items-center justify-center mx-auto mb-3">
                    <i className="ri-gift-line text-lg sm:text-xl text-[#DC2626]"></i>
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-[#2C3E50]">Benefits</span>
                </div>
              </div>

              <Link to="/jobs#application" className="inline-flex items-center px-8 py-3.5 bg-[#DC2626] text-white rounded-full font-semibold hover:bg-[#B91C1C] transition-all duration-300 cursor-pointer whitespace-nowrap">
                <span>Apply Now</span>
                <i className="ri-arrow-right-line ml-2"></i>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <BackToTop />
    </div>
  );
};

export default HomePage;
