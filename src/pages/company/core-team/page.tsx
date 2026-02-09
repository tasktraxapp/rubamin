import React from 'react';
import { Header } from '../../../components/feature/Header';
import { Footer } from '../../../components/feature/Footer';
import { Link, useLocation } from 'react-router-dom';

const CoreTeamPage: React.FC = () => {
  const location = useLocation();

  const companySubNav = [
    { name: 'Corporate Overview', path: '/company/corporate-overview' },
    { name: 'Vision & Mission', path: '/company/vision-mission' },
    { name: 'Shareholders & Beneficial Owners', path: '/company/shareholders' },
    { name: 'Core Team', path: '/company/core-team' },
    { name: 'Corporate Governance', path: '/company/corporate-governance' },
  ];

  const executiveTeam = [
    {
      name: 'Mr. Rajesh Kumar',
      position: 'Chairman & Chief Executive Officer',
      image:
        'https://readdy.ai/api/search-image?query=professional%20indian%20business%20executive%20man%20in%20formal%20suit%20confident%20leadership%20portrait%20corporate%20headshot%20with%20neutral%20background%20mature%20businessman%20with%20experience&width=400&height=500&seq=exec-001&orientation=portrait',
      bio: 'With over 30 years of experience in industrial manufacturing, Mr. Kumar leads RUBAMIN SARL with vision and strategic excellence. His expertise in metals trading and sustainable business practices has positioned the company as an industry leader.',
      email: 'rajesh.kumar@rubamin.com',
      linkedin: '#',
    },
    {
      name: 'Dr. Sarah Mitchell',
      position: 'Chief Operating Officer',
      image:
        'https://readdy.ai/api/search-image?query=professional%20caucasian%20business%20woman%20executive%20in%20formal%20attire%20confident%20female%20leader%20corporate%20headshot%20with%20neutral%20background%20experienced%20businesswoman%20portrait&width=400&height=500&seq=exec-002&orientation=portrait',
      bio: 'Dr. Mitchell brings 25 years of operational excellence in industrial gas production. She oversees all manufacturing operations, ensuring quality standards and operational efficiency across all facilities.',
      email: 'sarah.mitchell@rubamin.com',
      linkedin: '#',
    },
    {
      name: 'Mr. David Chen',
      position: 'Chief Financial Officer',
      image:
        'https://readdy.ai/api/search-image?query=professional%20asian%20business%20executive%20man%20in%20formal%20suit%20corporate%20finance%20leader%20headshot%20with%20neutral%20background%20mature%20businessman%20confident%20portrait&width=400&height=500&seq=exec-003&orientation=portrait',
      bio: 'A seasoned financial strategist with 20 years in corporate finance, Mr. Chen manages financial planning, risk management, and investor relations, driving sustainable growth and profitability.',
      email: 'david.chen@rubamin.com',
      linkedin: '#',
    },
    {
      name: 'Ms. Fatima Al-Rashid',
      position: 'Chief Technology Officer',
      image:
        'https://readdy.ai/api/search-image?query=professional%20middle%20eastern%20business%20woman%20executive%20in%20formal%20attire%20technology%20leader%20corporate%20headshot%20with%20neutral%20background%20confident%20female%20executive%20portrait&width=400&height=500&seq=exec-004&orientation=portrait',
      bio: 'Leading innovation and digital transformation, Ms. Al-Rashid has 18 years of experience in industrial technology. She drives R&D initiatives and implements cutting‑edge manufacturing solutions.',
      email: 'fatima.alrashid@rubamin.com',
      linkedin: '#',
    },
  ];

  const seniorManagement = [
    {
      name: 'Mr. James Anderson',
      position: 'VP of Sales & Marketing',
      department: 'Commercial',
    },
    {
      name: 'Ms. Priya Sharma',
      position: 'VP of Human Resources',
      department: 'People & Culture',
    },
    {
      name: 'Mr. Ahmed Hassan',
      position: 'VP of Supply Chain',
      department: 'Operations',
    },
    {
      name: 'Dr. Maria Rodriguez',
      position: 'VP of Quality Assurance',
      department: 'Quality',
    },
    {
      name: 'Mr. Thomas Wright',
      position: 'VP of HSE',
      department: 'Safety',
    },
    {
      name: 'Ms. Lisa Wang',
      position: 'VP of Legal & Compliance',
      department: 'Legal',
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
              'url(https://readdy.ai/api/search-image?query=diverse%20professional%20business%20team%20standing%20together%20in%20modern%20corporate%20office%20confident%20executives%20in%20formal%20attire%20group%20portrait%20with%20natural%20lighting%20representing%20leadership%20and%20teamwork%20multicultural%20business%20leaders&width=1920&height=400&seq=team-hero-001&orientation=landscape)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50"></div>
        </div>

        <div className="relative h-full max-w-[1320px] mx-auto px-10 flex flex-col justify-center">
          <h1
            className="text-5xl font-bold text-white mb-4"
            style={{ textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}
          >
            Core Team
          </h1>
          <p
            className="text-white text-xl font-light"
            style={{ textShadow: '0 2px 6px rgba(0,0,0,0.3)' }}
          >
            Leadership driving excellence and innovation
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
              Our Leadership
            </p>
            <h2
              className="text-4xl font-bold text-[#2C3E50] mb-6"
              style={{ fontFamily: 'Merriweather, serif' }}
            >
              Experienced Leaders Shaping Our Future
            </h2>
            <p className="text-lg text-[#6C757D] leading-relaxed">
              Our core team comprises seasoned professionals with decades of
              combined experience in industrial manufacturing, technology,
              finance, and operations. Together, they guide RUBAMIN SARL toward
              continued growth and excellence.
            </p>
          </div>
        </div>
      </section>

      {/* Executive Team */}
      <section className="bg-[#F8F9FA] py-24">
        <div className="max-w-[1320px] mx-auto px-6">
          <div className="text-center mb-16">
            <h2
              className="text-4xl font-bold text-[#2C3E50] mb-4"
              style={{ fontFamily: 'Merriweather, serif' }}
            >
              Executive Leadership Team
            </h2>
            <p className="text-lg text-[#6C757D]">
              Meet the executives steering our strategic direction
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10">
            {executiveTeam.map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
              >
                <div className="h-[400px] overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover object-top"
                    onError={(e) => {
                      // Fallback to a placeholder image if the URL fails
                      (e.currentTarget as HTMLImageElement).src =
                        'https://via.placeholder.com/400x500?text=Image+Not+Found';
                    }}
                  />
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-[#2C3E50] mb-2">
                    {member.name}
                  </h3>
                  <p className="text-[#DC2626] font-semibold mb-4">
                    {member.position}
                  </p>
                  <p className="text-[#6C757D] leading-relaxed mb-6">
                    {member.bio}
                  </p>
                  <div className="flex items-center gap-4">
                    <a
                      href={`mailto:${member.email}`}
                      className="text-[#6C757D] hover:text-[#DC2626] transition-colors cursor-pointer"
                    >
                      <i className="ri-mail-line text-xl"></i>
                    </a>
                    <a
                      href={member.linkedin}
                      className="text-[#6C757D] hover:text-[#DC2626] transition-colors cursor-pointer"
                    >
                      <i className="ri-linkedin-box-line text-xl"></i>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Senior Management */}
      <section className="bg-white py-24">
        <div className="max-w-[1320px] mx-auto px-6">
          <div className="text-center mb-16">
            <h2
              className="text-4xl font-bold text-[#2C3E50] mb-4"
              style={{ fontFamily: 'Merriweather, serif' }}
            >
              Senior Management Team
            </h2>
            <p className="text-lg text-[#6C757D]">
              Experienced professionals leading key business functions
            </p>
          </div>

          <div className="grid grid-cols-3 gap-8">
            {seniorManagement.map((member, index) => (
              <div
                key={index}
                className="bg-[#F8F9FA] rounded-2xl p-8 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-20 h-20 bg-[#DC2626] rounded-full flex items-center justify-center mb-6 mx-auto">
                  <i className="ri-user-line text-3xl text-white"></i>
                </div>
                <h3 className="text-xl font-bold text-[#2C3E50] mb-2 text-center">
                  {member.name}
                </h3>
                <p className="text-[#DC2626] font-semibold mb-2 text-center">
                  {member.position}
                </p>
                <p className="text-[#6C757D] text-sm text-center">
                  {member.department}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Values */}
      <section className="bg-[#F8F9FA] py-24">
        <div className="max-w-[1320px] mx-auto px-6">
          <div className="text-center mb-16">
            <h2
              className="text-4xl font-bold text-[#2C3E50] mb-4"
              style={{ fontFamily: 'Merriweather, serif' }}
            >
              What Makes Our Team Exceptional
            </h2>
          </div>

          <div className="grid grid-cols-4 gap-8">
            {[
              {
                icon: 'ri-lightbulb-line',
                title: 'Visionary Leadership',
                description: 'Forward-thinking strategies that drive innovation',
              },
              {
                icon: 'ri-team-line',
                title: 'Collaborative Spirit',
                description: 'Working together toward shared goals',
              },
              {
                icon: 'ri-medal-line',
                title: 'Proven Expertise',
                description: 'Decades of industry experience',
              },
              {
                icon: 'ri-heart-line',
                title: 'Passionate Commitment',
                description: 'Dedicated to excellence in everything we do',
              },
            ].map((value, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-300"
              >
                <div className="w-16 h-16 bg-[#FEF2F2] rounded-full flex items-center justify-center mb-6 mx-auto">
                  <i className={`${value.icon} text-3xl text-[#DC2626]`}></i>
                </div>
                <h3 className="text-lg font-bold text-[#2C3E50] mb-3">
                  {value.title}
                </h3>
                <p className="text-sm text-[#6C757D] leading-relaxed">
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

export default CoreTeamPage;
