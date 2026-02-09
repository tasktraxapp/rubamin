import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1F2937] text-white">
      {/* Main Footer */}
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 py-10 sm:py-12">
        {/* Responsive Layout */}
        <div className="flex flex-col lg:flex-row lg:items-start gap-8 lg:gap-0">
          {/* Logo and Slogan */}
          <div className="flex items-center space-x-3 shrink-0 lg:mr-16">
            <img
              src="https://static.readdy.ai/image/1b404af276821d98dfecb0eec592fbd4/2beca25c2dca50fd1a3109512ef52e33.png"
              alt="Rubamin Logo"
              className="h-12 sm:h-14 w-auto"
              style={{ filter: 'brightness(0) saturate(100%) invert(24%) sepia(95%) saturate(2679%) hue-rotate(346deg) brightness(91%) contrast(93%)' }}
            />
            <div className="text-center">
              <span className="text-lg sm:text-xl font-bold text-white block">RUBAMIN SARL</span>
              <p className="text-xs sm:text-sm text-[#B0B8C1]">Un Partenaire Fiable</p>
            </div>
          </div>

          {/* Contact Information Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 flex-1">
            {/* Head Office */}
            <div>
              <h3 className="text-sm uppercase tracking-wider mb-3 text-white">HEAD OFFICE</h3>
              <div className="flex items-start space-x-2">
                <div className="w-5 h-5 flex items-center justify-center shrink-0">
                  <i className="ri-map-pin-line text-base text-[#DC2626]"></i>
                </div>
                <p className="text-sm text-[#B0B8C1] leading-relaxed">
                  22, Avenue Ditu, Quartier Lido-Golf,<br />
                  Commune de Lubumbashi,<br />
                  Lubumbashi, Province du Haut-Katanga,<br />
                  Democratic Republic of Congo
                </p>
              </div>
            </div>

            {/* Processing Plant */}
            <div>
              <h3 className="text-sm uppercase tracking-wider mb-3 text-white">PROCESSING PLANT</h3>
              <div className="flex items-start space-x-2">
                <div className="w-5 h-5 flex items-center justify-center shrink-0">
                  <i className="ri-map-pin-line text-base text-[#DC2626]"></i>
                </div>
                <p className="text-sm text-[#B0B8C1] leading-relaxed">
                  26-27, Route Kambove,<br />
                  Commune de Panda, Likasi,<br />
                  Province du Haut-Katanga,<br />
                  Democratic Republic of Congo
                </p>
              </div>
            </div>

            {/* Contact Details */}
            <div className="sm:col-span-2 lg:col-span-1">
              <h3 className="text-sm uppercase tracking-wider mb-3 text-white">CONTACT DETAILS</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <div className="w-5 h-5 flex items-center justify-center shrink-0">
                    <i className="ri-phone-line text-base text-[#DC2626]"></i>
                  </div>
                  <div className="text-sm text-[#B0B8C1]">
                    <p>General Enquiries: +243 999 995 300</p>
                    <p>Services: +243 975 007 749</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-5 h-5 flex items-center justify-center shrink-0">
                    <i className="ri-mail-line text-base text-[#DC2626]"></i>
                  </div>
                  <div className="text-sm text-[#B0B8C1]">
                    <p>Email: info@rubamindrc.com</p>
                    <p>Email: services@rubamindrc.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Company Registration Bar */}
      <div className="bg-[#1a2332] border-t border-[#374151]">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 lg:gap-8 text-xs sm:text-sm text-[#B0B8C1] text-center">
            <span className="uppercase tracking-wider font-medium">Company Registration:</span>
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4">
              <span>RCCM: CD/LSH/RCCM/14-B-01657</span>
              <span className="hidden sm:inline text-[#4B5563]">|</span>
              <span>ID NAT.: 05-B0500-N47170F</span>
              <span className="hidden sm:inline text-[#4B5563]">|</span>
              <span>NIF: A0814806D</span>
              <span className="hidden sm:inline text-[#4B5563]">|</span>
              <span>Share Capital: USD 25,000,000</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="bg-[#111827] border-t border-[#374151]">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Left Side - Copyright & Legal Links */}
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-xs text-[#9CA3AF] text-center sm:text-left">
              <span>© 2025 RUBAMIN SARL. All rights reserved.</span>
              <div className="flex items-center gap-2 sm:gap-4">
                <Link to="/disclaimer" className="hover:text-[#DC2626] transition-colors cursor-pointer">
                  Disclaimer
                </Link>
                <span className="text-[#4B5563]">|</span>
                <Link to="/privacy" className="hover:text-[#DC2626] transition-colors cursor-pointer">
                  Privacy Policy
                </Link>
                <span className="text-[#4B5563]">|</span>
                <Link to="/terms" className="hover:text-[#DC2626] transition-colors cursor-pointer">
                  Terms of Use
                </Link>
              </div>
            </div>

            {/* Right Side - Utility Links */}
            <div className="flex items-center gap-3 sm:gap-4">
              <a
                href="https://readdy.ai/?ref=logo"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#9CA3AF] hover:text-[#DC2626] transition-colors cursor-pointer"
              >
                Designed by RUBAMIN SARL
              </a>
              <Link
                to="/user/dashboard"
                className="flex items-center space-x-2 px-3 sm:px-4 py-2 border border-[#4B5563] rounded-md hover:border-[#DC2626] transition-colors cursor-pointer whitespace-nowrap"
              >
                <i className="ri-user-line text-sm"></i>
                <span className="text-xs">User</span>
              </Link>
              <a
                href="/admin"
                className="flex items-center space-x-2 px-3 sm:px-4 py-2 border border-[#4B5563] rounded-md hover:border-[#DC2626] transition-colors cursor-pointer whitespace-nowrap"
              >
                <i className="ri-lock-line text-sm"></i>
                <span className="text-xs">Admin</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
