import React from 'react';
import { Header } from '../../../components/feature/Header';
import { Footer } from '../../../components/feature/Footer';
import { Link, useLocation } from 'react-router-dom';

const CorporateGovernancePage: React.FC = () => {
  const location = useLocation();

  const companySubNav = [
    { name: 'Corporate Overview', path: '/company/corporate-overview' },
    { name: 'Vision & Mission', path: '/company/vision-mission' },
    { name: 'Shareholders & Beneficial Owners', path: '/company/shareholders' },
    { name: 'Core Team', path: '/company/core-team' },
    { name: 'Corporate Governance', path: '/company/corporate-governance' },
  ];

  const principles = [
    {
      icon: 'ri-shield-check-line',
      title: 'Accountability',
      description:
        'Clear lines of responsibility and accountability at all levels of the organization, ensuring decisions are made transparently and ethically.',
    },
    {
      icon: 'ri-eye-line',
      title: 'Transparency',
      description:
        'Open communication with stakeholders through timely disclosure of material information and financial performance.',
    },
    {
      icon: 'ri-scales-line',
      title: 'Fairness',
      description:
        'Equal treatment of all shareholders and stakeholders, protecting minority rights and ensuring equitable practices.',
    },
    {
      icon: 'ri-user-heart-line',
      title: 'Responsibility',
      description:
        'Commitment to ethical conduct, compliance with laws, and consideration of stakeholder interests in decision-making.',
    },
  ];

  const boardCommittees = [
    {
      name: 'Audit Committee',
      purpose: 'Oversees financial reporting, internal controls, and external audit processes',
      responsibilities: [
        'Review financial statements and accounting policies',
        'Monitor internal audit function and risk management',
        'Ensure compliance with financial regulations',
        'Oversee external auditor independence and performance',
      ],
    },
    {
      name: 'Nomination & Remuneration Committee',
      purpose: 'Manages board composition, succession planning, and executive compensation',
      responsibilities: [
        'Identify and recommend board member candidates',
        'Develop succession plans for key positions',
        'Design executive compensation packages',
        'Evaluate board and management performance',
      ],
    },
    {
      name: 'Risk Management Committee',
      purpose: 'Identifies, assesses, and mitigates enterprise-wide risks',
      responsibilities: [
        'Establish risk management framework and policies',
        'Monitor key risk indicators and mitigation strategies',
        'Oversee business continuity planning',
        'Review insurance coverage and risk transfer mechanisms',
      ],
    },
    {
      name: 'Sustainability Committee',
      purpose: 'Guides environmental, social, and governance (ESG) initiatives',
      responsibilities: [
        'Set sustainability goals and monitor progress',
        'Oversee environmental compliance and initiatives',
        'Guide CSR programs and community engagement',
        'Review ESG reporting and stakeholder communication',
      ],
    },
  ];

  const policies = [
    { name: 'Code of Business Conduct', icon: 'ri-file-text-line' },
    { name: 'Anti-Corruption Policy', icon: 'ri-shield-cross-line' },
    { name: 'Whistleblower Protection', icon: 'ri-alarm-warning-line' },
    { name: 'Conflict of Interest Policy', icon: 'ri-alert-line' },
    { name: 'Related Party Transactions', icon: 'ri-exchange-line' },
    { name: 'Insider Trading Policy', icon: 'ri-lock-line' },
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
              'url(https://readdy.ai/api/search-image?query=professional%20corporate%20governance%20concept%20with%20gavel%20and%20legal%20documents%20on%20executive%20desk%20representing%20justice%20and%20business%20ethics%20formal%20boardroom%20setting%20with%20elegant%20furniture%20symbolizing%20authority%20and%20responsibility&width=1920&height=400&seq=governance-hero-001&orientation=landscape)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50"></div>
        </div>

        <div className="relative h-full max-w-[1320px] mx-auto px-10 flex flex-col justify-center">
          <h1
            className="text-5xl font-bold text-white mb-4"
            style={{ textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}
          >
            Corporate Governance
          </h1>
          <p
            className="text-white text-xl font-light"
            style={{ textShadow: '0 2px 6px rgba(0,0,0,0.3)' }}
          >
            Upholding the highest standards of integrity and accountability
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
              Our Commitment
            </p>
            <h2
              className="text-4xl font-bold text-[#2C3E50] mb-6"
              style={{ fontFamily: 'Merriweather, serif' }}
            >
              Excellence in Corporate Governance
            </h2>
            <p className="text-lg text-[#6C757D] leading-relaxed">
              RUBAMIN SARL is committed to maintaining the highest standards of
              corporate governance. Our governance framework ensures
              accountability, transparency, and ethical conduct in all business
              operations, protecting stakeholder interests and building long-term
              sustainable value.
            </p>
          </div>
        </div>
      </section>

      {/* Governance Principles */}
      <section className="bg-[#F8F9FA] py-24">
        <div className="max-w-[1320px] mx-auto px-6">
          <div className="text-center mb-16">
            <h2
              className="text-4xl font-bold text-[#2C3E50] mb-4"
              style={{ fontFamily: 'Merriweather, serif' }}
            >
              Core Governance Principles
            </h2>
            <p className="text-lg text-[#6C757D]">
              Four pillars guiding our governance framework
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8">
            {principles.map((principle, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-10 hover:shadow-xl transition-all duration-300"
              >
                <div className="w-16 h-16 bg-[#FEF2F2] rounded-full flex items-center justify-center mb-6">
                  <i className={`${principle.icon} text-3xl text-[#DC2626]`}></i>
                </div>
                <h3 className="text-2xl font-bold text-[#2C3E50] mb-4">
                  {principle.title}
                </h3>
                <p className="text-[#6C757D] leading-relaxed text-lg">
                  {principle.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Board Structure */}
      <section className="bg-white py-24">
        <div className="max-w-[1320px] mx-auto px-6">
          <div className="text-center mb-16">
            <h2
              className="text-4xl font-bold text-[#2C3E50] mb-4"
              style={{ fontFamily: 'Merriweather, serif' }}
            >
              Board of Directors Structure
            </h2>
            <p className="text-lg text-[#6C757D]">
              Experienced leadership providing strategic oversight
            </p>
          </div>

          <div className="grid grid-cols-3 gap-8 mb-12">
            {[
              { label: 'Board Members', value: '9', icon: 'ri-team-line' },
              {
                label: 'Independent Directors',
                value: '4',
                icon: 'ri-user-star-line',
              },
              { label: 'Board Meetings/Year', value: '12', icon: 'ri-calendar-line' },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-[#F8F9FA] rounded-2xl p-10 text-center"
              >
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 mx-auto shadow-md">
                  <i className={`${stat.icon} text-3xl text-[#DC2626]`}></i>
                </div>
                <div className="text-5xl font-bold text-[#DC2626] mb-3">
                  {stat.value}
                </div>
                <div className="text-lg text-[#6C757D]">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="bg-[#F8F9FA] rounded-2xl p-10">
            <h3 className="text-2xl font-bold text-[#2C3E50] mb-6">
              Board Composition
            </h3>
            <p className="text-lg text-[#6C757D] leading-relaxed mb-6">
              Our Board of Directors comprises nine members, including four
              independent directors, ensuring diverse perspectives and
              objective oversight. The board meets regularly to review strategy,
              monitor performance, and ensure compliance with governance
              standards.
            </p>
            <div className="grid grid-cols-2 gap-6">
              {[
                'Diverse expertise across industries and functions',
                'Regular evaluation of board effectiveness',
                'Clear separation of Chairman and CEO roles',
                'Mandatory director training and development',
              ].map((item, index) => (
                <div key={index} className="flex items-start">
                  <i className="ri-check-line text-[#DC2626] text-xl mr-3 mt-1"></i>
                  <span className="text-[#2C3E50]">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Board Committees */}
      <section className="bg-[#F8F9FA] py-24">
        <div className="max-w-[1320px] mx-auto px-6">
          <div className="text-center mb-16">
            <h2
              className="text-4xl font-bold text-[#2C3E50] mb-4"
              style={{ fontFamily: 'Merriweather, serif' }}
            >
              Board Committees
            </h2>
            <p className="text-lg text-[#6C757D]">
              Specialized committees ensuring focused oversight
            </p>
          </div>

          <div className="space-y-6">
            {boardCommittees.map((committee, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-10 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start gap-6 mb-6">
                  <div className="w-14 h-14 bg-[#DC2626] rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="ri-folder-line text-2xl text-white"></i>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-[#2C3E50] mb-2">
                      {committee.name}
                    </h3>
                    <p className="text-lg text-[#6C757D]">{committee.purpose}</p>
                  </div>
                </div>
                <div className="pl-20">
                  <h4 className="text-lg font-bold text-[#2C3E50] mb-4">
                    Key Responsibilities:
                  </h4>
                  <ul className="space-y-3">
                    {committee.responsibilities.map((resp, idx) => (
                      <li key={idx} className="flex items-start">
                        <i className="ri-arrow-right-s-line text-[#DC2626] text-xl mr-2 mt-0.5"></i>
                        <span className="text-[#6C757D]">{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Policies & Codes */}
      <section className="bg-white py-24">
        <div className="max-w-[1320px] mx-auto px-6">
          <div className="text-center mb-16">
            <h2
              className="text-4xl font-bold text-[#2C3E50] mb-4"
              style={{ fontFamily: 'Merriweather, serif' }}
            >
              Governance Policies &amp; Codes
            </h2>
            <p className="text-lg text-[#6C757D]">
              Comprehensive policies guiding ethical conduct
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {policies.map((policy, index) => (
              <div
                key={index}
                className="bg-[#F8F9FA] rounded-2xl p-8 hover:shadow-lg transition-all duration-300 cursor-pointer group"
              >
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mb-5 mx-auto shadow-md group-hover:bg-[#DC2626] transition-colors duration-300">
                  <i
                    className={`${policy.icon} text-2xl text-[#DC2626] group-hover:text-white transition-colors duration-300`}
                  ></i>
                </div>
                <h3 className="text-lg font-bold text-[#2C3E50] text-center">
                  {policy.name}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stakeholder Engagement */}
      <section className="bg-[#DC2626] py-20">
        <div className="max-w-[1320px] mx-auto px-6 text-center">
          <h2
            className="text-4xl font-bold text-white mb-6"
            style={{ fontFamily: 'Merriweather, serif' }}
          >
            Stakeholder Engagement
          </h2>
          <p className="text-white text-xl font-light max-w-[900px] mx-auto leading-relaxed">
            We maintain open channels of communication with all stakeholders,
            including shareholders, employees, customers, suppliers, regulators,
            and communities. Regular engagement ensures we understand and
            address stakeholder concerns while building trust and long-term
            relationships.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CorporateGovernancePage;
