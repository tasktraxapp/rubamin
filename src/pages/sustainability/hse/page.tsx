import React from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../../../components/feature/Header';
import { Footer } from '../../../components/feature/Footer';

const HSEPage: React.FC = () => {
  const subMenuItems = [
    { label: 'HSE', path: '/sustainability/hse' },
    { label: 'ESIA & EMP', path: '/sustainability/esia-emp' },
  ];

  const hseCards = [
    {
      icon: 'ri-shield-check-line',
      title: 'Safety First',
      description: 'Comprehensive safety protocols and training programs ensuring zero-harm workplace culture with continuous monitoring and improvement.',
    },
    {
      icon: 'ri-heart-pulse-line',
      title: 'Health & Wellbeing',
      description: 'Employee health programs, regular medical checkups, and wellness initiatives promoting physical and mental health.',
    },
    {
      icon: 'ri-leaf-line',
      title: 'Environmental Protection',
      description: 'Advanced emission control systems, waste management, and resource conservation practices minimizing environmental impact.',
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
            backgroundImage: 'url(https://readdy.ai/api/search-image?query=industrial%20workers%20in%20safety%20equipment%20and%20protective%20gear%20conducting%20safety%20inspection%20in%20modern%20manufacturing%20facility%20professional%20workplace%20safety%20culture%20with%20helmets%20and%20safety%20protocols%20clean%20organized%20industrial%20environment%20representing%20health%20safety%20and%20environmental%20protection&width=1920&height=400&seq=hse-hero-001&orientation=landscape)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50"></div>
        </div>

        <div className="relative h-full max-w-[1320px] mx-auto px-10 flex flex-col justify-end pb-16">
          <h1 className="text-5xl font-bold text-white mb-4" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
            Health, Safety &amp; Environment
          </h1>
          <p className="text-white text-xl font-light" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.3)' }}>
            Committed to zero-harm workplace culture
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
                  item.path === '/sustainability/hse'
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

      {/* HSE Content */}
      <section className="py-24 bg-white">
        <div className="max-w-[1320px] mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-[2px] text-[#DC2626] font-semibold mb-5">Health, Safety & Environment</p>
            <h2 className="text-5xl font-bold text-[#2C3E50]" style={{ fontFamily: 'Merriweather, serif' }}>
              Our HSE Commitment
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-8 mb-16">
            {hseCards.map((card, index) => (
              <div key={index} className="bg-[#F8F9FA] rounded-3xl p-10 hover:shadow-xl transition-all">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6">
                  <i className={`${card.icon} text-3xl text-[#DC2626]`}></i>
                </div>
                <h3 className="text-2xl font-bold text-[#2C3E50] mb-4">{card.title}</h3>
                <p className="text-base text-[#6C757D] leading-relaxed">{card.description}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-16 items-center">
            <div>
              <img
                src="https://readdy.ai/api/search-image?query=industrial%20workers%20in%20safety%20equipment%20and%20protective%20gear%20conducting%20safety%20inspection%20in%20modern%20manufacturing%20facility%20professional%20workplace%20safety%20culture%20with%20helmets%20and%20safety%20protocols%20clean%20organized%20industrial%20environment&width=700&height=600&seq=hse-safety-002&orientation=landscape"
                alt="HSE Safety"
                className="w-full h-full object-cover rounded-2xl shadow-lg"
              />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-[#2C3E50] mb-6">Zero-Harm Culture</h3>
              <p className="text-lg text-[#6C757D] leading-relaxed mb-6">
                At RUBAMIN SARL, safety is not just a priority—it's a core value. We maintain a zero-harm culture through comprehensive training programs, regular safety audits, and continuous improvement initiatives.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <i className="ri-check-line text-[#DC2626] text-xl mr-3 mt-1"></i>
                  <span className="text-[#2C3E50]"><strong>ISO 45001</strong> certified occupational health and safety management</span>
                </li>
                <li className="flex items-start">
                  <i className="ri-check-line text-[#DC2626] text-xl mr-3 mt-1"></i>
                  <span className="text-[#2C3E50]"><strong>Regular Training:</strong> Mandatory safety training for all employees</span>
                </li>
                <li className="flex items-start">
                  <i className="ri-check-line text-[#DC2626] text-xl mr-3 mt-1"></i>
                  <span className="text-[#2C3E50]"><strong>Emergency Response:</strong> 24/7 emergency response teams and protocols</span>
                </li>
                <li className="flex items-start">
                  <i className="ri-check-line text-[#DC2626] text-xl mr-3 mt-1"></i>
                  <span className="text-[#2C3E50]"><strong>Incident Prevention:</strong> Proactive hazard identification and risk mitigation</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Sustainability Goals */}
      <section className="py-24 bg-[#F8F9FA]">
        <div className="max-w-[1320px] mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-[2px] text-[#DC2626] font-semibold mb-5">Our Targets</p>
            <h2 className="text-5xl font-bold text-[#2C3E50]" style={{ fontFamily: 'Merriweather, serif' }}>
              2030 Sustainability Goals
            </h2>
          </div>

          <div className="grid grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-[#DC2626]">50%</div>
                  <div className="text-xs text-[#DC2626] font-medium">Reduction</div>
                </div>
              </div>
              <h4 className="font-bold text-[#2C3E50] mb-2">Carbon Emissions</h4>
              <p className="text-sm text-[#6C757D]">Reduce CO₂ emissions by 50% from 2020 baseline</p>
            </div>
            <div className="text-center">
              <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-[#DC2626]">80%</div>
                  <div className="text-xs text-[#DC2626] font-medium">Target</div>
                </div>
              </div>
              <h4 className="font-bold text-[#2C3E50] mb-2">Waste Recycling</h4>
              <p className="text-sm text-[#6C757D]">Achieve 80% waste recycling and circular economy</p>
            </div>
            <div className="text-center">
              <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-[#DC2626]">100%</div>
                  <div className="text-xs text-[#DC2626] font-medium">Goal</div>
                </div>
              </div>
              <h4 className="font-bold text-[#2C3E50] mb-2">Renewable Energy</h4>
              <p className="text-sm text-[#6C757D]">Transition to 100% renewable energy sources</p>
            </div>
            <div className="text-center">
              <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-[#DC2626]">Zero</div>
                  <div className="text-xs text-[#DC2626] font-medium">Target</div>
                </div>
              </div>
              <h4 className="font-bold text-[#2C3E50] mb-2">Workplace Incidents</h4>
              <p className="text-sm text-[#6C757D]">Maintain zero workplace accidents and injuries</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HSEPage;
