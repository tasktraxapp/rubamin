import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Header } from '../../../components/feature/Header';
import { Footer } from '../../../components/feature/Footer';

const MedicalGasPage: React.FC = () => {
  const location = useLocation();

  const productLinks = [
    { label: 'Copper Blister', path: '/products/copper-blister' },
    { label: 'Industrial Gas', path: '/products/industrial-gas' },
    { label: 'Medical Gas', path: '/products/medical-gas' },
  ];

  const medicalGases = [
    {
      name: 'Medical Oxygen (O₂)',
      purity: '99.5% USP Grade',
      image: 'https://readdy.ai/api/search-image?query=medical%20oxygen%20cylinder%20in%20hospital%20setting%20with%20white%20and%20green%20color%20coding%20clean%20healthcare%20environment%20with%20medical%20equipment%20professional%20medical%20gas%20storage&width=500&height=600&seq=medical-oxygen-001&orientation=portrait',
      description: 'Life-saving oxygen for respiratory support and emergency care',
      applications: [
        'Respiratory therapy and ventilation',
        'Anesthesia delivery systems',
        'Emergency medical services',
        'Intensive care units',
        'Surgical procedures',
      ],
      certifications: ['USP (United States Pharmacopeia)', 'WHO Standards Compliant', 'GMP Certified Production'],
    },
    {
      name: 'Medical Air',
      purity: 'Oil-Free, USP Grade',
      image: 'https://readdy.ai/api/search-image?query=medical%20air%20cylinder%20in%20hospital%20with%20yellow%20color%20coding%20clean%20healthcare%20facility%20with%20medical%20equipment%20professional%20medical%20gas%20storage%20area&width=500&height=600&seq=medical-air-001&orientation=portrait',
      description: 'Clean, oil-free compressed air for medical applications',
      applications: [
        'Respiratory therapy equipment',
        'Surgical power tools',
        'Ventilators and CPAP devices',
        'Dental procedures',
        'Laboratory applications',
      ],
      certifications: ['USP Grade Certified', 'Oil-Free Guarantee', 'ISO 13485 Compliant'],
    },
    {
      name: 'Nitrous Oxide (N₂O)',
      purity: '99% USP Grade',
      image: 'https://readdy.ai/api/search-image?query=medical%20nitrous%20oxide%20cylinder%20in%20hospital%20with%20blue%20color%20coding%20clean%20healthcare%20setting%20with%20medical%20equipment%20professional%20medical%20gas%20storage&width=500&height=600&seq=nitrous-oxide-001&orientation=portrait',
      description: 'Anesthetic gas for pain management and sedation',
      applications: [
        'Anesthesia and sedation',
        'Pain management during labor',
        'Dental procedures',
        'Minor surgical procedures',
        'Emergency pain relief',
      ],
      certifications: ['USP Pharmacopeia Grade', 'Medical Device Directive Compliant', 'Pharmaceutical Quality'],
    },
  ];

  const safetyFeatures = [
    {
      icon: 'ri-shield-check-line',
      title: 'Pharmaceutical Grade',
      description: 'All medical gases meet USP and international pharmaceutical standards',
    },
    {
      icon: 'ri-test-tube-line',
      title: 'Rigorous Testing',
      description: 'Every batch tested for purity, moisture content, and contaminants',
    },
    {
      icon: 'ri-file-list-3-line',
      title: 'Full Traceability',
      description: 'Complete documentation and certificates of analysis with each delivery',
    },
    {
      icon: 'ri-truck-line',
      title: 'Secure Delivery',
      description: 'Dedicated medical gas delivery vehicles and trained personnel',
    },
  ];

  const complianceStandards = [
    'United States Pharmacopeia (USP)',
    'European Pharmacopoeia (Ph. Eur.)',
    'World Health Organization (WHO) Guidelines',
    'Good Manufacturing Practice (GMP)',
    'ISO 13485 Medical Devices',
    'FDA Regulations Compliant',
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[400px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://readdy.ai/api/search-image?query=modern%20hospital%20medical%20gas%20system%20with%20multiple%20cylinders%20in%20clean%20healthcare%20facility%20professional%20medical%20environment%20with%20doctors%20and%20nurses%20representing%20life%20saving%20medical%20gases&width=1920&height=400&seq=medical-gas-hero-001&orientation=landscape)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50"></div>
        </div>

        <div className="relative h-full max-w-[1320px] mx-auto px-10 flex flex-col justify-end pb-16">
          <h1 className="text-5xl font-bold text-white mb-4" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
            Medical Gas
          </h1>
          <p className="text-white text-xl font-light" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.3)' }}>
            Life-saving gases for healthcare excellence
          </p>
        </div>
      </section>

      {/* Sub Navigation */}
      <section className="bg-white py-8 border-b border-gray-200">
        <div className="max-w-[1320px] mx-auto px-6">
          <div className="flex justify-center gap-4">
            {productLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
                  location.pathname === link.path
                    ? 'bg-[#DC2626] text-white'
                    : 'bg-gray-100 text-[#2C3E50] hover:bg-gray-200'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="bg-white py-24">
        <div className="max-w-[1320px] mx-auto px-6">
          <div className="max-w-[900px] mx-auto text-center">
            <p className="text-sm uppercase tracking-[2px] text-[#DC2626] font-semibold mb-5">Healthcare Solutions</p>
            <h2 className="text-4xl font-bold text-[#2C3E50] mb-6" style={{ fontFamily: 'Merriweather, serif' }}>
              Pharmaceutical Grade Medical Gases
            </h2>
            <p className="text-lg text-[#6C757D] leading-relaxed mb-6">
              RUBAMIN SARL supplies pharmaceutical-grade medical gases that meet the strictest international standards for healthcare applications. Our medical gases are essential for patient care, surgical procedures, and emergency medical services.
            </p>
            <p className="text-lg text-[#6C757D] leading-relaxed">
              We understand that medical gases are critical to saving lives. That's why we maintain the highest quality standards, ensure reliable supply, and provide comprehensive technical support to healthcare facilities.
            </p>
          </div>
        </div>
      </section>

      {/* Medical Gas Products */}
      <section className="bg-[#F8F9FA] py-24">
        <div className="max-w-[1320px] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#2C3E50] mb-4" style={{ fontFamily: 'Merriweather, serif' }}>
              Our Medical Gas Range
            </h2>
            <p className="text-lg text-[#6C757D]">USP grade gases for critical healthcare applications</p>
          </div>

          <div className="space-y-12">
            {medicalGases.map((gas, index) => (
              <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
                <div className={`grid grid-cols-2 gap-10 ${index % 2 === 0 ? '' : 'grid-flow-dense'}`}>
                  <div className={`${index % 2 === 0 ? 'order-1' : 'order-2'}`}>
                    <div className="h-full w-full">
                      <img
                        src={gas.image}
                        alt={gas.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className={`p-10 flex flex-col justify-center ${index % 2 === 0 ? 'order-2' : 'order-1'}`}>
                    <h3 className="text-3xl font-bold text-[#2C3E50] mb-3">{gas.name}</h3>
                    <p className="text-xl text-[#DC2626] font-semibold mb-4">Purity: {gas.purity}</p>
                    <p className="text-lg text-[#6C757D] mb-6">{gas.description}</p>
                    
                    <div className="mb-6">
                      <h4 className="text-lg font-bold text-[#2C3E50] mb-4">Medical Applications:</h4>
                      <ul className="space-y-2">
                        {gas.applications.map((app, idx) => (
                          <li key={idx} className="flex items-start">
                            <i className="ri-check-line text-[#DC2626] text-lg mr-3 mt-1"></i>
                            <span className="text-[#6C757D]">{app}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-[#F8F9FA] rounded-xl p-6">
                      <h4 className="text-lg font-bold text-[#2C3E50] mb-3">Certifications:</h4>
                      <div className="space-y-2">
                        {gas.certifications.map((cert, idx) => (
                          <div key={idx} className="flex items-center">
                            <i className="ri-medal-line text-[#DC2626] text-lg mr-3"></i>
                            <span className="text-[#6C757D] text-sm">{cert}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety Features */}
      <section className="bg-white py-24">
        <div className="max-w-[1320px] mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-[2px] text-[#DC2626] font-semibold mb-5">Quality Assurance</p>
            <h2 className="text-4xl font-bold text-[#2C3E50] mb-4" style={{ fontFamily: 'Merriweather, serif' }}>
              Uncompromising Safety Standards
            </h2>
            <p className="text-lg text-[#6C757D] max-w-[800px] mx-auto">
              Patient safety is our top priority. Every aspect of our medical gas production and delivery is designed to ensure the highest quality and reliability.
            </p>
          </div>

          <div className="grid grid-cols-4 gap-8">
            {safetyFeatures.map((feature, index) => (
              <div key={index} className="bg-[#F8F9FA] rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-300">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 mx-auto shadow-md">
                  <i className={`${feature.icon} text-3xl text-[#DC2626]`}></i>
                </div>
                <h3 className="text-lg font-bold text-[#2C3E50] mb-3">{feature.title}</h3>
                <p className="text-sm text-[#6C757D] leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance Standards */}
      <section className="bg-[#F8F9FA] py-24">
        <div className="max-w-[1320px] mx-auto px-6">
          <div className="grid grid-cols-2 gap-20 items-center">
            <div>
              <p className="text-sm uppercase tracking-[2px] text-[#DC2626] font-semibold mb-5">Regulatory Compliance</p>
              <h2 className="text-4xl font-bold text-[#2C3E50] mb-8" style={{ fontFamily: 'Merriweather, serif' }}>
                Meeting Global Healthcare Standards
              </h2>
              <p className="text-lg text-[#6C757D] leading-relaxed mb-8">
                Our medical gas production facilities are certified and regularly audited to ensure compliance with international pharmaceutical and medical device regulations. We maintain comprehensive quality management systems and documentation.
              </p>
              <div className="space-y-4">
                {complianceStandards.map((standard, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-8 h-8 bg-[#DC2626] rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                      <i className="ri-check-line text-white"></i>
                    </div>
                    <span className="text-[#2C3E50] text-lg">{standard}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <img
                src="https://readdy.ai/api/search-image?query=medical%20quality%20control%20laboratory%20with%20pharmaceutical%20testing%20equipment%20and%20certification%20documents%20professional%20healthcare%20quality%20assurance%20facility%20with%20scientists%20in%20lab%20coats&width=700&height=700&seq=medical-compliance-001&orientation=squarish"
                alt="Quality Compliance"
                className="w-full h-full object-cover rounded-2xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Healthcare Facilities Served */}
      <section className="bg-white py-24">
        <div className="max-w-[1320px] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#2C3E50] mb-4" style={{ fontFamily: 'Merriweather, serif' }}>
              Healthcare Facilities We Serve
            </h2>
          </div>

          <div className="grid grid-cols-4 gap-8">
            {[
              { icon: 'ri-hospital-line', name: 'Hospitals', count: '200+' },
              { icon: 'ri-nurse-line', name: 'Clinics', count: '500+' },
              { icon: 'ri-stethoscope-line', name: 'Medical Centers', count: '150+' },
              { icon: 'ri-ambulance-line', name: 'Emergency Services', count: '100+' },
            ].map((facility, index) => (
              <div key={index} className="bg-[#F8F9FA] rounded-2xl p-10 text-center hover:shadow-lg transition-all duration-300">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 mx-auto shadow-md">
                  <i className={`${facility.icon} text-3xl text-[#DC2626]`}></i>
                </div>
                <div className="text-4xl font-bold text-[#DC2626] mb-3">{facility.count}</div>
                <h3 className="text-lg font-semibold text-[#2C3E50]">{facility.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Support */}
      <section className="bg-[#F8F9FA] py-20">
        <div className="max-w-[1320px] mx-auto px-6">
          <div className="bg-white rounded-2xl p-12 shadow-md">
            <div className="flex items-start gap-8">
              <div className="w-16 h-16 bg-[#DC2626] rounded-full flex items-center justify-center flex-shrink-0">
                <i className="ri-24-hours-line text-3xl text-white"></i>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-[#2C3E50] mb-4">24/7 Emergency Medical Gas Support</h3>
                <p className="text-lg text-[#6C757D] leading-relaxed mb-4">
                  We understand that medical gas supply is critical to patient care. Our dedicated emergency response team is available around the clock to handle urgent requests, equipment issues, or supply emergencies.
                </p>
                <p className="text-lg text-[#6C757D] leading-relaxed">
                  Contact our emergency hotline anytime for immediate assistance with medical gas supply or technical support.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#DC2626] py-20">
        <div className="max-w-[1320px] mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6" style={{ fontFamily: 'Merriweather, serif' }}>
            Partner With Us for Medical Gas Supply
          </h2>
          <p className="text-white text-xl font-light max-w-[800px] mx-auto mb-10 leading-relaxed">
            Contact our medical gas specialists to discuss your healthcare facility's requirements and ensure reliable, pharmaceutical-grade gas supply.
          </p>
          <a href="/contact" className="inline-block bg-white text-[#DC2626] px-10 py-4 rounded-full font-semibold hover:bg-[#F8F9FA] transition-colors duration-300 cursor-pointer whitespace-nowrap">
            Contact Medical Gas Team
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default MedicalGasPage;
