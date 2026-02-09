import React from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../../../components/feature/Header';
import { Footer } from '../../../components/feature/Footer';

const ESIAEMPPage: React.FC = () => {
  const subMenuItems = [
    { label: 'HSE', path: '/sustainability/hse' },
    { label: 'ESIA & EMP', path: '/sustainability/esia-emp' },
  ];

  const esiaPrinciples = [
    { title: 'Environmental Assessment', description: 'Comprehensive evaluation of environmental impacts before project implementation' },
    { title: 'Social Impact Analysis', description: 'Assessment of community and stakeholder impacts with mitigation strategies' },
    { title: 'Biodiversity Conservation', description: 'Protection of local ecosystems and wildlife habitats' },
    { title: 'Water Resource Management', description: 'Sustainable water usage and wastewater treatment systems' },
    { title: 'Air Quality Control', description: 'Emission monitoring and reduction technologies' },
    { title: 'Waste Management', description: 'Circular economy approach to waste reduction and recycling' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[400px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://readdy.ai/api/search-image?query=environmental%20monitoring%20equipment%20and%20green%20technology%20systems%20in%20industrial%20facility%20with%20water%20treatment%20plants%20and%20emission%20control%20systems%20representing%20environmental%20management%20and%20sustainability%20practices%20clean%20technology%20infrastructure%20with%20nature%20integration&width=1920&height=400&seq=esia-hero-001&orientation=landscape)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50"></div>
        </div>

        <div className="relative h-full max-w-[1320px] mx-auto px-10 flex flex-col justify-end pb-16">
          <h1 className="text-5xl font-bold text-white mb-4" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
            ESIA &amp; Environmental Management Plan
          </h1>
          <p className="text-white text-xl font-light" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.3)' }}>
            Comprehensive environmental and social impact management
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
                  item.path === '/sustainability/esia-emp'
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

      {/* ESIA & EMP Content */}
      <section className="py-24 bg-white">
        <div className="max-w-[1320px] mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-[2px] text-[#DC2626] font-semibold mb-5">Environmental Management</p>
            <h2 className="text-5xl font-bold text-[#2C3E50]" style={{ fontFamily: 'Merriweather, serif' }}>
              ESIA &amp; Environmental Management Plan
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-16 items-center mb-16">
            <div>
              <h3 className="text-3xl font-bold text-[#2C3E50] mb-6">Environmental & Social Impact Assessment</h3>
              <p className="text-lg text-[#6C757D] leading-relaxed mb-6">
                Our Environmental and Social Impact Assessment (ESIA) process ensures that all operations are conducted with minimal environmental footprint and positive social outcomes. We conduct thorough assessments before any project implementation.
              </p>
              <p className="text-lg text-[#6C757D] leading-relaxed mb-8">
                The Environmental Management Plan (EMP) outlines specific actions, responsibilities, and monitoring procedures to mitigate identified impacts and ensure compliance with environmental regulations.
              </p>
              <div className="bg-[#F8F9FA] rounded-2xl p-6">
                <h4 className="font-bold text-[#2C3E50] mb-4">Key Certifications</h4>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <i className="ri-checkbox-circle-fill text-[#DC2626] mr-3"></i>
                    <span className="text-[#6C757D]">ISO 14001 Environmental Management</span>
                  </li>
                  <li className="flex items-center">
                    <i className="ri-checkbox-circle-fill text-[#DC2626] mr-3"></i>
                    <span className="text-[#6C757D]">ISO 50001 Energy Management</span>
                  </li>
                  <li className="flex items-center">
                    <i className="ri-checkbox-circle-fill text-[#DC2626] mr-3"></i>
                    <span className="text-[#6C757D]">ESIA Compliance Certification</span>
                  </li>
                </ul>
              </div>
            </div>
            <div>
              <img
                src="https://readdy.ai/api/search-image?query=environmental%20monitoring%20equipment%20and%20green%20technology%20systems%20in%20industrial%20facility%20with%20water%20treatment%20plants%20and%20emission%20control%20systems%20representing%20environmental%20management%20and%20sustainability%20practices%20clean%20technology%20infrastructure&width=700&height=600&seq=esia-env-002&orientation=landscape"
                alt="Environmental Management"
                className="w-full h-full object-cover rounded-2xl shadow-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {esiaPrinciples.map((principle, index) => (
              <div key={index} className="bg-[#F8F9FA] rounded-2xl p-6 hover:shadow-lg transition-all">
                <h4 className="text-lg font-bold text-[#2C3E50] mb-3">{principle.title}</h4>
                <p className="text-sm text-[#6C757D] leading-relaxed">{principle.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Environmental Monitoring */}
      <section className="py-24 bg-[#F8F9FA]">
        <div className="max-w-[1320px] mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-[2px] text-[#DC2626] font-semibold mb-5">Continuous Monitoring</p>
            <h2 className="text-5xl font-bold text-[#2C3E50]" style={{ fontFamily: 'Merriweather, serif' }}>
              Environmental Monitoring Systems
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-16 items-center">
            <div>
              <img
                src="https://readdy.ai/api/search-image?query=advanced%20environmental%20monitoring%20control%20room%20with%20digital%20screens%20displaying%20real-time%20data%20analytics%20for%20air%20quality%20water%20quality%20and%20emissions%20monitoring%20modern%20technology%20systems%20for%20environmental%20protection%20and%20compliance%20tracking&width=700&height=600&seq=esia-monitoring-001&orientation=landscape"
                alt="Environmental Monitoring"
                className="w-full h-full object-cover rounded-2xl shadow-lg"
              />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-[#2C3E50] mb-6">Real-Time Environmental Tracking</h3>
              <p className="text-lg text-[#6C757D] leading-relaxed mb-6">
                Our state-of-the-art monitoring systems provide real-time data on environmental parameters, ensuring immediate response to any deviations and maintaining compliance with all environmental standards.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <i className="ri-check-line text-[#DC2626] text-xl mr-3 mt-1"></i>
                  <span className="text-[#2C3E50]"><strong>Air Quality Monitoring:</strong> Continuous tracking of emissions and air pollutants</span>
                </li>
                <li className="flex items-start">
                  <i className="ri-check-line text-[#DC2626] text-xl mr-3 mt-1"></i>
                  <span className="text-[#2C3E50]"><strong>Water Quality Testing:</strong> Regular analysis of water discharge and consumption</span>
                </li>
                <li className="flex items-start">
                  <i className="ri-check-line text-[#DC2626] text-xl mr-3 mt-1"></i>
                  <span className="text-[#2C3E50]"><strong>Noise Level Control:</strong> Monitoring and mitigation of noise pollution</span>
                </li>
                <li className="flex items-start">
                  <i className="ri-check-line text-[#DC2626] text-xl mr-3 mt-1"></i>
                  <span className="text-[#2C3E50]"><strong>Biodiversity Surveys:</strong> Regular assessment of local flora and fauna</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ESIAEMPPage;
