import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Header } from '../../../components/feature/Header';
import { Footer } from '../../../components/feature/Footer';

const CopperBlisterPage: React.FC = () => {
  const location = useLocation();

  const productLinks = [
    { label: 'Copper Blister', path: '/products/copper-blister' },
    { label: 'Industrial Gas', path: '/products/industrial-gas' },
    { label: 'Medical Gas', path: '/products/medical-gas' },
  ];

  const specifications = [
    { property: 'Copper Content', value: '98.5% - 99.5%', icon: 'ri-copper-coin-line' },
    { property: 'Sulfur Content', value: '< 0.5%', icon: 'ri-flask-line' },
    { property: 'Lead Content', value: '< 0.05%', icon: 'ri-test-tube-line' },
    { property: 'Iron Content', value: '< 0.3%', icon: 'ri-contrast-drop-line' },
    { property: 'Oxygen Content', value: '< 0.8%', icon: 'ri-bubble-chart-line' },
    { property: 'Form', value: 'Blister Ingots', icon: 'ri-shape-line' },
  ];

  const applications = [
    {
      icon: 'ri-building-line',
      title: 'Construction',
      description: 'Used in electrical wiring, plumbing systems, and architectural applications',
    },
    {
      icon: 'ri-flashlight-line',
      title: 'Electronics',
      description: 'Essential for circuit boards, semiconductors, and electronic components',
    },
    {
      icon: 'ri-car-line',
      title: 'Automotive',
      description: 'Critical for vehicle wiring, radiators, and electrical systems',
    },
    {
      icon: 'ri-tools-line',
      title: 'Manufacturing',
      description: 'Raw material for producing copper alloys, tubes, and sheets',
    },
    {
      icon: 'ri-lightbulb-line',
      title: 'Energy',
      description: 'Power generation, transmission lines, and renewable energy systems',
    },
    {
      icon: 'ri-ship-line',
      title: 'Marine',
      description: 'Ship components, marine hardware, and corrosion-resistant applications',
    },
  ];

  const qualityFeatures = [
    'ISO 9001:2015 Certified Production',
    'Advanced Smelting Technology',
    'Rigorous Quality Control Testing',
    'Consistent Chemical Composition',
    'Environmentally Responsible Processing',
    'Global Export Standards Compliance',
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[400px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://readdy.ai/api/search-image?query=industrial%20copper%20blister%20ingots%20stacked%20in%20modern%20manufacturing%20facility%20with%20metallic%20sheen%20and%20professional%20lighting%20representing%20high%20quality%20metal%20production%20clean%20industrial%20environment%20with%20copper%20products&width=1920&height=400&seq=copper-blister-hero-001&orientation=landscape)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50"></div>
        </div>

        <div className="relative h-full max-w-[1320px] mx-auto px-10 flex flex-col justify-end pb-16">
          <h1 className="text-5xl font-bold text-white mb-4" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
            Copper Blister
          </h1>
          <p className="text-white text-xl font-light" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.3)' }}>
            Premium quality copper for global industries
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

      {/* Product Overview */}
      <section className="bg-white py-24">
        <div className="max-w-[1320px] mx-auto px-6">
          <div className="grid grid-cols-2 gap-20 items-center">
            <div>
              <p className="text-sm uppercase tracking-[2px] text-[#DC2626] font-semibold mb-5">Our Flagship Product</p>
              <h2 className="text-4xl font-bold text-[#2C3E50] mb-8" style={{ fontFamily: 'Merriweather, serif' }}>
                High-Purity Copper Blister
              </h2>
              <p className="text-lg text-[#6C757D] leading-relaxed mb-6">
                RUBAMIN SARL produces premium copper blister, an intermediate product in the copper refining process with purity levels ranging from 98.5% to 99.5%. Our copper blister serves as essential raw material for further refining into high-grade copper cathodes.
              </p>
              <p className="text-lg text-[#6C757D] leading-relaxed mb-6">
                Manufactured using state-of-the-art smelting technology and rigorous quality control processes, our copper blister meets international standards and specifications. We ensure consistent quality, reliable supply, and competitive pricing for our global customer base.
              </p>
              <p className="text-lg text-[#6C757D] leading-relaxed">
                With decades of expertise in copper production, we have established ourselves as a trusted supplier to refineries, manufacturers, and industrial consumers worldwide.
              </p>
            </div>
            <div>
              <img
                src="https://readdy.ai/api/search-image?query=close%20up%20of%20copper%20blister%20ingots%20with%20characteristic%20metallic%20surface%20texture%20and%20reddish%20brown%20color%20showing%20high%20quality%20metal%20production%20industrial%20copper%20product%20with%20professional%20lighting&width=700&height=600&seq=copper-product-001&orientation=portrait"
                alt="Copper Blister Product"
                className="w-full h-full object-cover rounded-2xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Technical Specifications */}
      <section className="bg-[#F8F9FA] py-24">
        <div className="max-w-[1320px] mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-[2px] text-[#DC2626] font-semibold mb-5">Product Details</p>
            <h2 className="text-4xl font-bold text-[#2C3E50] mb-4" style={{ fontFamily: 'Merriweather, serif' }}>
              Technical Specifications
            </h2>
            <p className="text-lg text-[#6C757D]">Precise composition meeting international standards</p>
          </div>

          <div className="grid grid-cols-3 gap-8">
            {specifications.map((spec, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 hover:shadow-xl transition-all duration-300">
                <div className="w-14 h-14 bg-[#FEF2F2] rounded-full flex items-center justify-center mb-6">
                  <i className={`${spec.icon} text-2xl text-[#DC2626]`}></i>
                </div>
                <h3 className="text-lg font-bold text-[#2C3E50] mb-3">{spec.property}</h3>
                <p className="text-2xl font-bold text-[#DC2626]">{spec.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-white rounded-2xl p-10 shadow-md">
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 bg-[#DC2626] rounded-full flex items-center justify-center flex-shrink-0">
                <i className="ri-information-line text-2xl text-white"></i>
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#2C3E50] mb-3">Quality Assurance</h3>
                <p className="text-[#6C757D] leading-relaxed">
                  Every batch of copper blister undergoes comprehensive testing in our certified laboratory. We provide detailed certificates of analysis (COA) with each shipment, ensuring complete traceability and compliance with customer specifications.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Applications */}
      <section className="bg-white py-24">
        <div className="max-w-[1320px] mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-[2px] text-[#DC2626] font-semibold mb-5">Industry Applications</p>
            <h2 className="text-4xl font-bold text-[#2C3E50] mb-4" style={{ fontFamily: 'Merriweather, serif' }}>
              Powering Multiple Industries
            </h2>
            <p className="text-lg text-[#6C757D] max-w-[800px] mx-auto">
              Our copper blister serves as essential raw material across diverse industrial sectors
            </p>
          </div>

          <div className="grid grid-cols-3 gap-8">
            {applications.map((app, index) => (
              <div key={index} className="bg-[#F8F9FA] rounded-2xl p-10 hover:shadow-lg transition-all duration-300">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 shadow-md">
                  <i className={`${app.icon} text-3xl text-[#DC2626]`}></i>
                </div>
                <h3 className="text-xl font-bold text-[#2C3E50] mb-4">{app.title}</h3>
                <p className="text-[#6C757D] leading-relaxed">{app.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quality Features */}
      <section className="bg-[#F8F9FA] py-24">
        <div className="max-w-[1320px] mx-auto px-6">
          <div className="grid grid-cols-2 gap-20 items-center">
            <div>
              <img
                src="https://readdy.ai/api/search-image?query=modern%20industrial%20quality%20control%20laboratory%20with%20scientist%20testing%20copper%20samples%20using%20advanced%20equipment%20professional%20testing%20facility%20with%20microscopes%20and%20analytical%20instruments%20representing%20quality%20assurance&width=700&height=600&seq=quality-lab-001&orientation=portrait"
                alt="Quality Control"
                className="w-full h-full object-cover rounded-2xl shadow-lg"
              />
            </div>
            <div>
              <p className="text-sm uppercase tracking-[2px] text-[#DC2626] font-semibold mb-5">Excellence in Production</p>
              <h2 className="text-4xl font-bold text-[#2C3E50] mb-8" style={{ fontFamily: 'Merriweather, serif' }}>
                Uncompromising Quality Standards
              </h2>
              <p className="text-lg text-[#6C757D] leading-relaxed mb-8">
                Our commitment to quality begins with raw material selection and continues through every stage of production. We employ advanced smelting technology and maintain strict environmental controls to ensure consistent, high-quality output.
              </p>
              <div className="space-y-4">
                {qualityFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-8 h-8 bg-[#DC2626] rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                      <i className="ri-check-line text-white"></i>
                    </div>
                    <span className="text-[#2C3E50] text-lg">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Production Capacity */}
      <section className="bg-white py-24">
        <div className="max-w-[1320px] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#2C3E50] mb-4" style={{ fontFamily: 'Merriweather, serif' }}>
              Production Capabilities
            </h2>
          </div>

          <div className="grid grid-cols-4 gap-8">
            {[
              { value: '50,000', label: 'Tons Annual Capacity', icon: 'ri-scales-3-line' },
              { value: '99.5%', label: 'Maximum Purity', icon: 'ri-star-line' },
              { value: '24/7', label: 'Continuous Operations', icon: 'ri-time-line' },
              { value: '50+', label: 'Countries Served', icon: 'ri-global-line' },
            ].map((stat, index) => (
              <div key={index} className="bg-[#F8F9FA] rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-300">
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mb-5 mx-auto shadow-md">
                  <i className={`${stat.icon} text-2xl text-[#DC2626]`}></i>
                </div>
                <div className="text-4xl font-bold text-[#DC2626] mb-3">{stat.value}</div>
                <div className="text-[#6C757D]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#DC2626] py-20">
        <div className="max-w-[1320px] mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6" style={{ fontFamily: 'Merriweather, serif' }}>
            Partner With Us for Premium Copper Blister
          </h2>
          <p className="text-white text-xl font-light max-w-[800px] mx-auto mb-10 leading-relaxed">
            Contact our sales team to discuss your copper blister requirements and discover how RUBAMIN SARL can support your business with reliable supply and exceptional quality.
          </p>
          <a href="/contact" className="inline-block bg-white text-[#DC2626] px-10 py-4 rounded-full font-semibold hover:bg-[#F8F9FA] transition-colors duration-300 cursor-pointer whitespace-nowrap">
            Request a Quote
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CopperBlisterPage;
