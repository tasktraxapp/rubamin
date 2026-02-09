import React from 'react';
import { Header } from '../../../components/feature/Header';
import { Footer } from '../../../components/feature/Footer';
import { Link, useLocation } from 'react-router-dom';

const ShareholdersPage: React.FC = () => {
  const location = useLocation();

  const companySubNav = [
    { name: 'Corporate Overview', path: '/company/corporate-overview' },
    { name: 'Vision & Mission', path: '/company/vision-mission' },
    { name: 'Shareholders & Beneficial Owners', path: '/company/shareholders' },
    { name: 'Core Team', path: '/company/core-team' },
    { name: 'Corporate Governance', path: '/company/corporate-governance' },
  ];

  const shareholders = [
    {
      name: 'Rubamin Group Holdings',
      percentage: 65,
      type: 'Majority Shareholder',
      description:
        'Leading industrial conglomerate with diversified interests in mining, metals, and manufacturing sectors across multiple continents.',
    },
    {
      name: 'International Investment Partners',
      percentage: 20,
      type: 'Strategic Investor',
      description:
        'Global investment firm specializing in sustainable industrial ventures and emerging market opportunities.',
    },
    {
      name: 'Regional Development Fund',
      percentage: 10,
      type: 'Institutional Investor',
      description:
        'Government-backed development fund focused on supporting industrial growth and economic development.',
    },
    {
      name: 'Management & Employees',
      percentage: 5,
      type: 'Internal Stakeholders',
      description:
        'Company management team and employee stock ownership program ensuring aligned interests.',
    },
  ];

  const beneficialOwners = [
    {
      name: 'Mr. Rajesh Kumar',
      role: 'Principal Beneficial Owner',
      ownership: '45%',
      background:
        'Founder and Chairman of Rubamin Group with over 30 years of experience in industrial manufacturing and metals trading.',
    },
    {
      name: 'Mrs. Priya Sharma',
      role: 'Co-Beneficial Owner',
      ownership: '20%',
      background:
        'Strategic investor and board member with extensive background in international business development and corporate governance.',
    },
    {
      name: 'Mr. David Chen',
      role: 'Beneficial Owner',
      ownership: '15%',
      background:
        'Managing Partner at International Investment Partners, specializing in industrial sector investments across emerging markets.',
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
              'url(https://readdy.ai/api/search-image?query=professional%20corporate%20boardroom%20with%20modern%20furniture%20and%20large%20windows%20representing%20shareholder%20meetings%20executive%20conference%20room%20with%20elegant%20design%20and%20business%20atmosphere%20sophisticated%20interior%20with%20natural%20lighting&width=1920&height=400&seq=shareholders-hero-001&orientation=landscape)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50"></div>
        </div>

        <div className="relative h-full max-w-[1320px] mx-auto px-10 flex flex-col justify-center">
          <h1
            className="text-5xl font-bold text-white mb-4"
            style={{ textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}
          >
            Shareholders &amp; Beneficial Owners
          </h1>
          <p
            className="text-white text-xl font-light"
            style={{ textShadow: '0 2px 6px rgba(0,0,0,0.3)' }}
          >
            Transparency in ownership and governance
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

      {/* Introduction */}
      <section className="bg-white py-20">
        <div className="max-w-[1320px] mx-auto px-6">
          <div className="max-w-[900px] mx-auto text-center">
            <p className="text-sm uppercase tracking-[2px] text-[#DC2626] font-semibold mb-5">
              Ownership Structure
            </p>
            <h2
              className="text-4xl font-bold text-[#2C3E50] mb-6"
              style={{ fontFamily: 'Merriweather, serif' }}
            >
              Committed to Transparency and Accountability
            </h2>
            <p className="text-lg text-[#6C757D] leading-relaxed">
              RUBAMIN SARL maintains the highest standards of corporate governance
              and transparency. We are committed to providing clear information
              about our ownership structure, ensuring accountability to all
              stakeholders and compliance with international regulatory
              requirements.
            </p>
          </div>
        </div>
      </section>

      {/* Shareholder Distribution */}
      <section className="bg-[#F8F9FA] py-24">
        <div className="max-w-[1320px] mx-auto px-6">
          <div className="text-center mb-16">
            <h2
              className="text-4xl font-bold text-[#2C3E50] mb-4"
              style={{ fontFamily: 'Merriweather, serif' }}
            >
              Shareholder Distribution
            </h2>
            <p className="text-lg text-[#6C757D]">
              Current ownership breakdown as of 2024
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-16">
            {shareholders.map((shareholder, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-10 shadow-md hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-[#2C3E50] mb-2">
                      {shareholder.name}
                    </h3>
                    <p className="text-sm text-[#DC2626] font-semibold uppercase tracking-wider">
                      {shareholder.type}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold text-[#DC2626]">
                      {shareholder.percentage}%
                    </div>
                  </div>
                </div>
                <p className="text-[#6C757D] leading-relaxed">
                  {shareholder.description}
                </p>

                {/* Progress Bar */}
                <div className="mt-6 bg-[#F8F9FA] rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-[#DC2626] h-full rounded-full transition-all duration-1000"
                    style={{ width: `${shareholder.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* Visual Chart */}
          <div className="bg-white rounded-2xl p-12 shadow-md">
            <h3 className="text-2xl font-bold text-[#2C3E50] mb-8 text-center">
              Ownership Distribution Chart
            </h3>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              {shareholders.map((shareholder, index) => (
                <div key={index} className="text-center">
                  <div
                    className="rounded-2xl bg-[#DC2626] flex items-center justify-center text-white font-bold text-2xl mb-4 mx-auto transition-all duration-300 hover:scale-105"
                    style={{
                      width: `${shareholder.percentage * 3}px`,
                      height: `${shareholder.percentage * 3}px`,
                      opacity: 1 - index * 0.15,
                    }}
                  >
                    {shareholder.percentage}%
                  </div>
                  <p className="text-sm text-[#6C757D] max-w-[150px]">
                    {shareholder.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Beneficial Owners */}
      <section className="bg-white py-24">
        <div className="max-w-[1320px] mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-[2px] text-[#DC2626] font-semibold mb-5">
              Ultimate Ownership
            </p>
            <h2
              className="text-4xl font-bold text-[#2C3E50] mb-4"
              style={{ fontFamily: 'Merriweather, serif' }}
            >
              Beneficial Owners
            </h2>
            <p className="text-lg text-[#6C757D] max-w-[800px] mx-auto">
              In compliance with international transparency standards, we
              disclose the ultimate beneficial owners who exercise significant
              control or ownership in RUBAMIN SARL.
            </p>
          </div>

          <div className="space-y-6">
            {beneficialOwners.map((owner, index) => (
              <div
                key={index}
                className="bg-[#F8F9FA] rounded-2xl p-10 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start gap-8">
                  <div className="w-24 h-24 bg-[#DC2626] rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="ri-user-line text-4xl text-white"></i>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-[#2C3E50] mb-2">
                          {owner.name}
                        </h3>
                        <p className="text-[#DC2626] font-semibold">
                          {owner.role}
                        </p>
                      </div>
                      <div className="bg-white px-6 py-3 rounded-full">
                        <span className="text-2xl font-bold text-[#DC2626]">
                          {owner.ownership}
                        </span>
                      </div>
                    </div>
                    <p className="text-lg text-[#6C757D] leading-relaxed">
                      {owner.background}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance Statement */}
      <section className="bg-[#F8F9FA] py-20">
        <div className="max-w-[1320px] mx-auto px-6">
          <div className="bg-white rounded-2xl p-12 shadow-md">
            <div className="flex items-start gap-8">
              <div className="w-16 h-16 bg-[#FEF2F2] rounded-full flex items-center justify-center flex-shrink-0">
                <i className="ri-shield-check-line text-3xl text-[#DC2626]"></i>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-[#2C3E50] mb-4">
                  Regulatory Compliance &amp; Transparency
                </h3>
                <p className="text-lg text-[#6C757D] leading-relaxed mb-4">
                  RUBAMIN SARL is fully compliant with all applicable laws and
                  regulations regarding beneficial ownership disclosure,
                  anti-money laundering (AML), and counter-terrorism financing
                  (CTF) requirements. We maintain accurate and up-to-date records
                  of our ownership structure and make this information available
                  to relevant authorities as required.
                </p>
                <p className="text-lg text-[#6C757D] leading-relaxed">
                  Our commitment to transparency extends beyond legal
                  requirements. We believe that clear communication about our
                  ownership structure builds trust with stakeholders and
                  demonstrates our dedication to ethical business practices and
                  good corporate governance.
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

export default ShareholdersPage;
