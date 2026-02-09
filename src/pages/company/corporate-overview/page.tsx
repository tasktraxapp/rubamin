import React from 'react';
import { Header } from '../../../components/feature/Header';
import { Footer } from '../../../components/feature/Footer';
import { Link, useLocation } from 'react-router-dom';

const CorporateOverviewPage: React.FC = () => {
  const location = useLocation();

  const companySubNav = [
    { name: 'Corporate Overview', path: '/company/corporate-overview' },
    { name: 'Vision & Mission', path: '/company/vision-mission' },
    { name: 'Shareholders & Beneficial Owners', path: '/company/shareholders' },
    { name: 'Core Team', path: '/company/core-team' },
    { name: 'Corporate Governance', path: '/company/corporate-governance' },
  ];

  const milestones = [
    {
      year: '2010',
      title: 'Company Founded',
      description:
        'RUBAMIN SARL established with vision to lead industrial excellence',
    },
    {
      year: '2013',
      title: 'First Production',
      description: 'Commenced copper blister production operations',
    },
    {
      year: '2016',
      title: 'Gas Division Launch',
      description: 'Expanded into industrial and medical gas solutions',
    },
    {
      year: '2019',
      title: 'ISO Certification',
      description: 'Achieved international quality management certifications',
    },
    {
      year: '2022',
      title: 'Sustainability Goals',
      description: 'Launched comprehensive environmental initiatives',
    },
    {
      year: '2024',
      title: 'Regional Leader',
      description: 'Recognized as leading industrial solutions provider',
    },
  ];

  const stats = [
    { value: '15+', label: 'Years of Excellence' },
    { value: '500+', label: 'Skilled Employees' },
    { value: '50+', label: 'Countries Served' },
    { value: '99.8%', label: 'Quality Rating' },
  ];

  const coreValues = [
    {
      icon: 'ri-shield-check-line',
      title: 'Integrity',
      description:
        'Operating with transparency, honesty, and ethical standards in all business practices',
    },
    {
      icon: 'ri-star-line',
      title: 'Excellence',
      description:
        'Pursuing the highest quality standards and continuous improvement in everything we do',
    },
    {
      icon: 'ri-team-line',
      title: 'Collaboration',
      description:
        'Working together with stakeholders to achieve shared success and mutual growth',
    },
    {
      icon: 'ri-lightbulb-line',
      title: 'Innovation',
      description:
        'Embracing new technologies and creative solutions to drive industry advancement',
    },
    {
      icon: 'ri-leaf-line',
      title: 'Sustainability',
      description:
        'Protecting the environment and ensuring responsible resource management',
    },
    {
      icon: 'ri-customer-service-line',
      title: 'Customer Focus',
      description:
        'Delivering exceptional value and service that exceeds customer expectations',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[400px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url(https://readdy.ai/api/search-image?query=modern%20corporate%20headquarters%20building%20with%20glass%20facade%20and%20professional%20architecture%20representing%20industrial%20excellence%20contemporary%20business%20center%20with%20clean%20lines%20and%20sophisticated%20design%20blue%20sky%20background%20corporate%20campus%20environment&width=1920&height=400&seq=corp-overview-hero-001&orientation=landscape)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50"></div>
        </div>

        <div className="relative h-full max-w-[1320px] mx-auto px-10 flex flex-col justify-center">
          <h1
            className="text-5xl font-bold text-white mb-4"
            style={{ textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}
          >
            Corporate Overview
          </h1>
          <p
            className="text-white text-xl font-light"
            style={{ textShadow: '0 2px 6px rgba(0,0,0,0.3)' }}
          >
            Building the future of industrial excellence
          </p>
        </div>
      </section>

      {/* Sub Navigation */}
      <section className="bg-white py-6 border-b border-gray-200">
        <div className="max-w-[1320px] mx-auto px-6">
          <div className="flex items-center justify-center gap-3 flex-wrap">
            {companySubNav.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap cursor-pointer ${
                  location.pathname === item.path
                    ? 'bg-[#DC2626] text-white'
                    : 'bg-[#F8F9FA] text-[#6C757D] hover:bg-[#E9ECEF]'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Company Introduction */}
      <section className="bg-white py-20">
        <div className="max-w-[1320px] mx-auto px-6">
          <div className="grid grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-sm uppercase tracking-[2px] text-[#DC2626] font-semibold mb-5">
                About RUBAMIN SARL
              </p>
              <h2
                className="text-4xl font-bold text-[#2C3E50] mb-6"
                style={{ fontFamily: 'Merriweather, serif' }}
              >
                Leading Industrial Solutions Provider
              </h2>
              <p className="text-lg text-[#6C757D] leading-relaxed mb-6">
                RUBAMIN SARL stands as a beacon of industrial excellence,
                specializing in copper blister production and comprehensive
                industrial and medical gas solutions. Since our establishment,
                we have been committed to delivering superior quality products
                that power industries and healthcare facilities worldwide.
              </p>
              <p className="text-lg text-[#6C757D] leading-relaxed mb-6">
                Our state-of-the-art facilities combine cutting-edge technology
                with decades of expertise, ensuring every product meets the
                highest international standards. We pride ourselves on our
                unwavering commitment to quality, safety, and environmental
                sustainability.
              </p>
              <p className="text-lg text-[#6C757D] leading-relaxed">
                With a dedicated team of over 500 skilled professionals and
                operations spanning 50+ countries, RUBAMIN SARL continues to set
                new benchmarks in industrial manufacturing and service
                excellence.
              </p>
            </div>
            <div>
              <img
                src="https://readdy.ai/api/search-image?query=professional%20industrial%20facility%20interior%20with%20modern%20copper%20processing%20equipment%20and%20clean%20manufacturing%20environment%20bright%20lighting%20showing%20advanced%20machinery%20and%20quality%20control%20systems%20representing%20excellence%20in%20metal%20production%20industrial%20workspace%20with%20safety%20standards&width=700&height=600&seq=corp-facility-001&orientation=portrait"
                alt="RUBAMIN SARL Facility"
                className="w-full h-full object-cover rounded-2xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="bg-[#F8F9FA] py-20">
        <div className="max-w-[1320px] mx-auto px-6">
          <div className="grid grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl font-bold text-[#DC2626] mb-3">
                  {stat.value}
                </div>
                <div className="text-lg text-[#6C757D]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company History Timeline */}
      <section className="bg-white py-24">
        <div className="max-w-[1320px] mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-[2px] text-[#DC2626] font-semibold mb-5">
              Our Journey
            </p>
            <h2
              className="text-4xl font-bold text-[#2C3E50]"
              style={{ fontFamily: 'Merriweather, serif' }}
            >
              Milestones of Excellence
            </h2>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-[#FEE2E2]"></div>

            {/* Timeline Items */}
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className={`flex items-center ${
                    index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                  }`}
                >
                  <div
                    className={`w-1/2 ${
                      index % 2 === 0 ? 'pr-12 text-right' : 'pl-12 text-left'
                    }`}
                  >
                    <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300">
                      <div className="text-3xl font-bold text-[#DC2626] mb-3">
                        {milestone.year}
                      </div>
                      <h3 className="text-xl font-bold text-[#2C3E50] mb-2">
                        {milestone.title}
                      </h3>
                      <p className="text-[#6C757D]">{milestone.description}</p>
                    </div>
                  </div>
                  <div className="relative z-10">
                    <div className="w-6 h-6 bg-[#DC2626] rounded-full border-4 border-white shadow-lg"></div>
                  </div>
                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="bg-[#F8F9FA] py-24">
        <div className="max-w-[1320px] mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-[2px] text-[#DC2626] font-semibold mb-5">
              What Drives Us
            </p>
            <h2
              className="text-4xl font-bold text-[#2C3E50]"
              style={{ fontFamily: 'Merriweather, serif' }}
            >
              Our Core Values
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-8">
            {coreValues.map((value, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-10 hover:shadow-xl transition-all duration-300"
              >
                <div className="w-16 h-16 bg-[#FEF2F2] rounded-full flex items-center justify-center mb-6">
                  <i className={`${value.icon} text-3xl text-[#DC2626]`}></i>
                </div>
                <h3 className="text-xl font-bold text-[#2C3E50] mb-4">
                  {value.title}
                </h3>
                <p className="text-[#6C757D] leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CorporateOverviewPage;
