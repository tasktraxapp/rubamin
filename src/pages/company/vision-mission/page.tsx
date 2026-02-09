import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../../../components/feature/Header';
import { Footer } from '../../../components/feature/Footer';

const VisionMissionPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('vision');

  const subMenuItems = [
    { label: 'Corporate Overview', path: '/company/corporate-overview' },
    { label: 'Vision & Mission', path: '/company/vision-mission' },
    { label: 'Shareholders & Beneficial Owners', path: '/company/shareholders' },
    { label: 'Core Team', path: '/company/core-team' },
    { label: 'Corporate Governance', path: '/company/corporate-governance' },
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
              'url(https://readdy.ai/api/search-image?query=inspiring%20corporate%20vision%20concept%20with%20modern%20architecture%20and%20forward-thinking%20design%20representing%20future%20goals%20and%20mission%20professional%20business%20environment%20with%20aspirational%20atmosphere%20clean%20contemporary%20style%20with%20strategic%20planning%20elements&width=1920&height=400&seq=vision-hero-001&orientation=landscape)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50"></div>
        </div>

        <div className="relative h-full max-w-[1320px] mx-auto px-10 flex flex-col justify-end pb-16">
          <h1
            className="text-5xl font-bold text-white mb-4"
            style={{ textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}
          >
            Vision &amp; Mission
          </h1>
          <p
            className="text-white text-xl font-light"
            style={{ textShadow: '0 2px 6px rgba(0,0,0,0.3)' }}
          >
            Guiding our path to excellence
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
                  item.path === '/company/vision-mission'
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

      {/* Vision & Mission Content */}
      <section className="py-24 bg-white">
        <div className="max-w-[1320px] mx-auto px-6">
          <div className="grid grid-cols-2 gap-12">
            {/* Vision Card */}
            <div className="bg-[#F8F9FA] rounded-3xl p-12 shadow-lg hover:shadow-xl transition-all">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-8">
                <i className="ri-eye-line text-4xl text-[#DC2626]"></i>
              </div>
              <h2 className="text-4xl font-bold text-[#2C3E50] mb-6" style={{ fontFamily: 'Merriweather, serif' }}>
                Our Vision
              </h2>
              <p className="text-lg text-[#6C757D] leading-relaxed mb-6">
                To be the global leader in sustainable industrial manufacturing, setting new standards for quality, innovation, and environmental responsibility. We envision a future where our products and practices contribute to a cleaner, more efficient industrial landscape worldwide.
              </p>
              <p className="text-lg text-[#6C757D] leading-relaxed">
                We aspire to be recognized as the most trusted partner for copper products and industrial gas solutions, known for our unwavering commitment to excellence, safety, and sustainability across all operations.
              </p>
            </div>

            {/* Mission Card */}
            <div className="bg-[#F8F9FA] rounded-3xl p-12 shadow-lg hover:shadow-xl transition-all">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-8">
                <i className="ri-compass-line text-4xl text-[#DC2626]"></i>
              </div>
              <h2 className="text-4xl font-bold text-[#2C3E50] mb-6" style={{ fontFamily: 'Merriweather, serif' }}>
                Our Mission
              </h2>
              <p className="text-lg text-[#6C757D] leading-relaxed mb-6">
                To deliver exceptional copper products and industrial gas solutions through continuous innovation, operational excellence, and unwavering commitment to safety and sustainability. We strive to exceed customer expectations while maintaining the highest ethical standards.
              </p>
              <p className="text-lg text-[#6C757D] leading-relaxed">
                We are dedicated to contributing positively to the communities we serve, fostering a culture of continuous improvement, and empowering our employees to achieve their full potential.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Strategic Objectives */}
      <section className="py-24 bg-[#F8F9FA]">
        <div className="max-w-[1320px] mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-[2px] text-[#DC2626] font-semibold mb-5">
              Strategic Direction
            </p>
            <h2
              className="text-4xl font-bold text-[#2C3E50]"
              style={{ fontFamily: 'Merriweather, serif' }}
            >
              Our Strategic Objectives
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 hover:shadow-lg transition-all">
              <div className="w-16 h-16 bg-[#FEF2F2] rounded-full flex items-center justify-center mb-6">
                <i className="ri-line-chart-line text-3xl text-[#DC2626]"></i>
              </div>
              <h3 className="text-xl font-bold text-[#2C3E50] mb-4">Sustainable Growth</h3>
              <p className="text-[#6C757D] leading-relaxed">
                Achieve consistent and sustainable business growth while maintaining our commitment to environmental stewardship and social responsibility.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 hover:shadow-lg transition-all">
              <div className="w-16 h-16 bg-[#FEF2F2] rounded-full flex items-center justify-center mb-6">
                <i className="ri-lightbulb-line text-3xl text-[#DC2626]"></i>
              </div>
              <h3 className="text-xl font-bold text-[#2C3E50] mb-4">Innovation Excellence</h3>
              <p className="text-[#6C757D] leading-relaxed">
                Continuously invest in research and development to deliver cutting-edge solutions that meet evolving industry needs and challenges.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 hover:shadow-lg transition-all">
              <div className="w-16 h-16 bg-[#FEF2F2] rounded-full flex items-center justify-center mb-6">
                <i className="ri-customer-service-line text-3xl text-[#DC2626]"></i>
              </div>
              <h3 className="text-xl font-bold text-[#2C3E50] mb-4">Customer Satisfaction</h3>
              <p className="text-[#6C757D] leading-relaxed">
                Build lasting partnerships by consistently delivering superior products and services that exceed customer expectations.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 hover:shadow-lg transition-all">
              <div className="w-16 h-16 bg-[#FEF2F2] rounded-full flex items-center justify-center mb-6">
                <i className="ri-team-line text-3xl text-[#DC2626]"></i>
              </div>
              <h3 className="text-xl font-bold text-[#2C3E50] mb-4">Employee Development</h3>
              <p className="text-[#6C757D] leading-relaxed">
                Foster a culture of learning and growth, providing our team with opportunities to develop skills and advance their careers.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 hover:shadow-lg transition-all">
              <div className="w-16 h-16 bg-[#FEF2F2] rounded-full flex items-center justify-center mb-6">
                <i className="ri-global-line text-3xl text-[#DC2626]"></i>
              </div>
              <h3 className="text-xl font-bold text-[#2C3E50] mb-4">Global Expansion</h3>
              <p className="text-[#6C757D] leading-relaxed">
                Expand our market presence strategically while maintaining operational excellence and quality standards across all regions.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 hover:shadow-lg transition-all">
              <div className="w-16 h-16 bg-[#FEF2F2] rounded-full flex items-center justify-center mb-6">
                <i className="ri-leaf-line text-3xl text-[#DC2626]"></i>
              </div>
              <h3 className="text-xl font-bold text-[#2C3E50] mb-4">Environmental Leadership</h3>
              <p className="text-[#6C757D] leading-relaxed">
                Lead by example in environmental protection, implementing sustainable practices that minimize our ecological footprint.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 bg-white">
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

          <div className="grid grid-cols-2 gap-8">
            <div className="flex items-start gap-6 bg-[#F8F9FA] rounded-2xl p-8">
              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                <i className="ri-shield-check-line text-2xl text-[#DC2626]"></i>
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#2C3E50] mb-3">Integrity</h3>
                <p className="text-[#6C757D] leading-relaxed">
                  Operating with transparency, honesty, and ethical standards in all business practices, building trust with stakeholders.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6 bg-[#F8F9FA] rounded-2xl p-8">
              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                <i className="ri-star-line text-2xl text-[#DC2626]"></i>
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#2C3E50] mb-3">Excellence</h3>
                <p className="text-[#6C757D] leading-relaxed">
                  Pursuing the highest quality standards and continuous improvement in everything we do, never settling for mediocrity.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6 bg-[#F8F9FA] rounded-2xl p-8">
              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                <i className="ri-team-line text-2xl text-[#DC2626]"></i>
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#2C3E50] mb-3">Collaboration</h3>
                <p className="text-[#6C757D] leading-relaxed">
                  Working together with stakeholders to achieve shared success and mutual growth through effective partnerships.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6 bg-[#F8F9FA] rounded-2xl p-8">
              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                <i className="ri-lightbulb-line text-2xl text-[#DC2626]"></i>
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#2C3E50] mb-3">Innovation</h3>
                <p className="text-[#6C757D] leading-relaxed">
                  Embracing new technologies and creative solutions to drive industry advancement and stay ahead of market demands.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default VisionMissionPage;
