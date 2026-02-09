import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Header } from '../../../components/feature/Header';
import { Footer } from '../../../components/feature/Footer';

const IndustrialGasPage: React.FC = () => {
  const location = useLocation();

  const productLinks = [
    { label: 'Copper Blister', path: '/products/copper-blister' },
    { label: 'Industrial Gas', path: '/products/industrial-gas' },
    { label: 'Medical Gas', path: '/products/medical-gas' },
  ];

  const gases = [
    {
      name: 'Oxygen (O₂)',
      purity: 'Up to 99.999%',
      image: 'https://readdy.ai/api/search-image?query=industrial%20oxygen%20gas%20cylinder%20in%20modern%20manufacturing%20facility%20with%20blue%20color%20coding%20and%20safety%20labels%20professional%20industrial%20gas%20storage%20area%20with%20clean%20environment&width=500&height=600&seq=oxygen-gas-001&orientation=portrait',
      applications: ['Metal cutting and welding', 'Chemical processing', 'Water treatment', 'Glass manufacturing', 'Pulp and paper production'],
      specifications: ['Available in cylinders, liquid bulk, and on-site generation', 'Pressure: 150-200 bar', 'Complies with ISO 9001 standards'],
    },
    {
      name: 'Nitrogen (N₂)',
      purity: 'Up to 99.9999%',
      image: 'https://readdy.ai/api/search-image?query=industrial%20nitrogen%20gas%20cylinder%20with%20black%20color%20coding%20in%20professional%20storage%20facility%20clean%20industrial%20environment%20with%20safety%20equipment%20and%20proper%20labeling&width=500&height=600&seq=nitrogen-gas-001&orientation=portrait',
      applications: ['Inerting and blanketing', 'Food packaging and preservation', 'Electronics manufacturing', 'Chemical synthesis', 'Metal heat treatment'],
      specifications: ['Liquid and gaseous forms available', 'Pressure: 150-300 bar', 'Food grade and industrial grade options'],
    },
    {
      name: 'Argon (Ar)',
      purity: 'Up to 99.999%',
      image: 'https://readdy.ai/api/search-image?query=industrial%20argon%20gas%20cylinder%20with%20green%20color%20coding%20in%20modern%20facility%20professional%20gas%20storage%20with%20safety%20equipment%20clean%20industrial%20setting&width=500&height=600&seq=argon-gas-001&orientation=portrait',
      applications: ['TIG and MIG welding', 'Metal production', 'Electronics manufacturing', 'Lighting applications', 'Laboratory research'],
      specifications: ['High purity grades available', 'Pressure: 150-200 bar', 'Certified for welding applications'],
    },
    {
      name: 'Carbon Dioxide (CO₂)',
      purity: 'Up to 99.99%',
      image: 'https://readdy.ai/api/search-image?query=industrial%20carbon%20dioxide%20gas%20cylinder%20with%20gray%20color%20coding%20in%20professional%20facility%20clean%20storage%20area%20with%20proper%20safety%20equipment%20and%20labeling&width=500&height=600&seq=co2-gas-001&orientation=portrait',
      applications: ['Beverage carbonation', 'Food freezing and chilling', 'Welding shielding gas', 'pH control', 'Fire suppression systems'],
      specifications: ['Liquid and gaseous supply', 'Food grade certified', 'Beverage grade available'],
    },
  ];

  const deliveryOptions = [
    {
      icon: 'ri-gas-station-line',
      title: 'Cylinder Supply',
      description: 'Various cylinder sizes from 10L to 50L for flexible usage',
    },
    {
      icon: 'ri-truck-line',
      title: 'Bulk Liquid Delivery',
      description: 'Tanker deliveries for high-volume requirements',
    },
    {
      icon: 'ri-building-2-line',
      title: 'On-Site Generation',
      description: 'Custom gas generation systems for continuous supply',
    },
    {
      icon: 'ri-customer-service-2-line',
      title: '24/7 Support',
      description: 'Round-the-clock technical support and emergency service',
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
            backgroundImage: 'url(https://readdy.ai/api/search-image?query=modern%20industrial%20gas%20facility%20with%20multiple%20gas%20cylinders%20and%20storage%20tanks%20professional%20manufacturing%20environment%20with%20safety%20equipment%20clean%20industrial%20setting%20representing%20gas%20production&width=1920&height=400&seq=industrial-gas-hero-001&orientation=landscape)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50"></div>
        </div>

        <div className="relative h-full max-w-[1320px] mx-auto px-10 flex flex-col justify-end pb-16">
          <h1 className="text-5xl font-bold text-white mb-4" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
            Industrial Gas
          </h1>
          <p className="text-white text-xl font-light" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.3)' }}>
            Powering industries with reliable gas solutions
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
            <p className="text-sm uppercase tracking-[2px] text-[#DC2626] font-semibold mb-5">Comprehensive Gas Solutions</p>
            <h2 className="text-4xl font-bold text-[#2C3E50] mb-6" style={{ fontFamily: 'Merriweather, serif' }}>
              Industrial Gases for Every Application
            </h2>
            <p className="text-lg text-[#6C757D] leading-relaxed">
              RUBAMIN SARL provides a complete range of industrial gases to support manufacturing, processing, and production operations across diverse industries. Our gases meet the highest purity standards and are delivered with reliability and technical expertise.
            </p>
          </div>
        </div>
      </section>

      {/* Gas Products */}
      <section className="bg-[#F8F9FA] py-24">
        <div className="max-w-[1320px] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#2C3E50] mb-4" style={{ fontFamily: 'Merriweather, serif' }}>
              Our Industrial Gas Portfolio
            </h2>
            <p className="text-lg text-[#6C757D]">High-purity gases for industrial excellence</p>
          </div>

          <div className="space-y-12">
            {gases.map((gas, index) => (
              <div key={index} className={`bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 ${index % 2 === 0 ? '' : ''}`}>
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
                    <p className="text-xl text-[#DC2626] font-semibold mb-6">Purity: {gas.purity}</p>
                    
                    <div className="mb-6">
                      <h4 className="text-lg font-bold text-[#2C3E50] mb-4">Applications:</h4>
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
                      <h4 className="text-lg font-bold text-[#2C3E50] mb-3">Specifications:</h4>
                      <ul className="space-y-2">
                        {gas.specifications.map((spec, idx) => (
                          <li key={idx} className="flex items-start">
                            <i className="ri-arrow-right-s-line text-[#DC2626] text-lg mr-2"></i>
                            <span className="text-[#6C757D] text-sm">{spec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Delivery Options */}
      <section className="bg-white py-24">
        <div className="max-w-[1320px] mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-[2px] text-[#DC2626] font-semibold mb-5">Flexible Supply Solutions</p>
            <h2 className="text-4xl font-bold text-[#2C3E50] mb-4" style={{ fontFamily: 'Merriweather, serif' }}>
              Delivery Options to Suit Your Needs
            </h2>
            <p className="text-lg text-[#6C757D] max-w-[800px] mx-auto">
              We offer multiple supply methods to ensure you receive the right quantity of gas, when and where you need it
            </p>
          </div>

          <div className="grid grid-cols-4 gap-8">
            {deliveryOptions.map((option, index) => (
              <div key={index} className="bg-[#F8F9FA] rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-300">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 mx-auto shadow-md">
                  <i className={`${option.icon} text-3xl text-[#DC2626]`}></i>
                </div>
                <h3 className="text-lg font-bold text-[#2C3E50] mb-3">{option.title}</h3>
                <p className="text-sm text-[#6C757D] leading-relaxed">{option.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety & Quality */}
      <section className="bg-[#F8F9FA] py-24">
        <div className="max-w-[1320px] mx-auto px-6">
          <div className="grid grid-cols-2 gap-20 items-center">
            <div>
              <img
                src="https://readdy.ai/api/search-image?query=industrial%20safety%20equipment%20and%20gas%20handling%20procedures%20with%20workers%20in%20protective%20gear%20professional%20safety%20training%20in%20gas%20facility%20with%20proper%20equipment%20and%20protocols&width=700&height=600&seq=gas-safety-001&orientation=portrait"
                alt="Safety Standards"
                className="w-full h-full object-cover rounded-2xl shadow-lg"
              />
            </div>
            <div>
              <p className="text-sm uppercase tracking-[2px] text-[#DC2626] font-semibold mb-5">Our Commitment</p>
              <h2 className="text-4xl font-bold text-[#2C3E50] mb-8" style={{ fontFamily: 'Merriweather, serif' }}>
                Safety and Quality First
              </h2>
              <p className="text-lg text-[#6C757D] leading-relaxed mb-8">
                Safety is paramount in everything we do. Our industrial gases are produced, stored, and delivered following strict safety protocols and international standards. We provide comprehensive safety training and technical support to ensure safe handling and usage.
              </p>
              <div className="space-y-4">
                {[
                  'ISO 9001:2015 Quality Management Certified',
                  'Regular cylinder testing and maintenance',
                  'Comprehensive safety data sheets (SDS) provided',
                  'Emergency response support available 24/7',
                  'Trained technical specialists for consultation',
                  'Compliance with all regulatory requirements',
                ].map((item, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-8 h-8 bg-[#DC2626] rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                      <i className="ri-check-line text-white"></i>
                    </div>
                    <span className="text-[#2C3E50] text-lg">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Industries Served */}
      <section className="bg-white py-24">
        <div className="max-w-[1320px] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#2C3E50] mb-4" style={{ fontFamily: 'Merriweather, serif' }}>
              Industries We Serve
            </h2>
          </div>

          <div className="grid grid-cols-4 gap-6">
            {[
              { icon: 'ri-tools-line', name: 'Manufacturing' },
              { icon: 'ri-building-line', name: 'Construction' },
              { icon: 'ri-restaurant-line', name: 'Food & Beverage' },
              { icon: 'ri-flask-line', name: 'Chemical' },
              { icon: 'ri-car-line', name: 'Automotive' },
              { icon: 'ri-cpu-line', name: 'Electronics' },
              { icon: 'ri-test-tube-line', name: 'Pharmaceuticals' },
              { icon: 'ri-ship-line', name: 'Marine' },
            ].map((industry, index) => (
              <div key={index} className="bg-[#F8F9FA] rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-300 cursor-pointer">
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mb-4 mx-auto shadow-md">
                  <i className={`${industry.icon} text-2xl text-[#DC2626]`}></i>
                </div>
                <h3 className="text-[#2C3E50] font-semibold">{industry.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#DC2626] py-20">
        <div className="max-w-[1320px] mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6" style={{ fontFamily: 'Merriweather, serif' }}>
            Need Industrial Gas Solutions?
          </h2>
          <p className="text-white text-xl font-light max-w-[800px] mx-auto mb-10 leading-relaxed">
            Contact our technical team to discuss your industrial gas requirements and discover customized solutions for your operations.
          </p>
          <a href="/contact" className="inline-block bg-white text-[#DC2626] px-10 py-4 rounded-full font-semibold hover:bg-[#F8F9FA] transition-colors duration-300 cursor-pointer whitespace-nowrap">
            Get in Touch
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default IndustrialGasPage;
