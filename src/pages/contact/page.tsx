import React, { useState } from 'react';
import { Header } from '../../components/feature/Header';
import { Footer } from '../../components/feature/Footer';
import { Button } from '../../components/base/Button';
import { BackToTop } from '../../components/feature/BackToTop';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'message' && value.length > 500) return;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('https://readdy.ai/api/form/d634i4b0723ekv2it920', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(formData as Record<string, string>).toString(),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          subject: '',
          message: '',
        });
      } else {
        setSubmitStatus('error');
      }
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: 'ri-map-pin-line',
      title: 'Head Office',
      details: ['22, Avenue Ditu, Quartier Lido-Golf,', 'Commune de Lubumbashi,', 'Lubumbashi, Province du Haut-Katanga,', 'Democratic Republic of Congo'],
    },
    {
      icon: 'ri-building-line',
      title: 'Processing Plant',
      details: ['26-27, Route Kambove,', 'Commune de Panda, Likasi,', 'Province du Haut-Katanga,', 'Democratic Republic of Congo'],
    },
    {
      icon: 'ri-phone-line',
      title: 'Contact details',
      details: ['General Enquiries: +243 999 995 300', 'Services: +243 975 007 749'],
    },
    {
      icon: 'ri-mail-line',
      title: 'Email',
      details: ['info@rubamindrc.com', 'services@rubamindrc.com'],
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[300px] sm:h-[350px] lg:h-[400px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://readdy.ai/api/search-image?query=modern%20corporate%20office%20building%20exterior%20with%20glass%20facade%20and%20professional%20business%20environment%20clean%20architectural%20design%20with%20red%20accent%20lighting%20contemporary%20commercial%20building%20representing%20industrial%20company%20headquarters%20urban%20business%20district%20setting&width=1920&height=400&seq=contact-hero-001&orientation=landscape)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50"></div>
        </div>

        <div className="relative h-full max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-10 flex flex-col justify-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
            Contact Us
          </h1>
          <p className="text-white text-base sm:text-lg lg:text-xl font-light" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.3)' }}>
            Get in touch with our team for inquiries, partnerships, or support
          </p>
        </div>
      </section>

      {/* Contact Information Cards */}
      <section className="py-10 sm:py-14 lg:py-20 bg-[#F8F9FA]">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {contactInfo.map((info, index) => (
              <div
                key={index}
                className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-[#FEF2F2] rounded-full flex items-center justify-center mb-3 sm:mb-4">
                  <i className={`${info.icon} text-lg sm:text-xl lg:text-2xl text-[#DC2626]`}></i>
                </div>
                <h3 className="text-sm sm:text-base lg:text-lg font-bold text-[#2C3E50] mb-2 sm:mb-3">{info.title}</h3>
                {info.details.map((detail, idx) => (
                  <p key={idx} className="text-xs sm:text-sm text-[#6C757D] leading-relaxed">
                    {detail}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-12 sm:py-16 lg:py-24 bg-white">
        <div className="max-w-[900px] mx-auto px-4 sm:px-6">
          {/* Contact Form */}
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#2C3E50] mb-3 sm:mb-4 text-center" style={{ fontFamily: 'Merriweather, serif' }}>
              Send Us a Message
            </h2>
            <p className="text-sm sm:text-base text-[#6C757D] mb-6 sm:mb-10 text-center max-w-[600px] mx-auto">
              Fill out the form below and our team will get back to you shortly.
            </p>

            <form
              id="contact-form"
              data-readdy-form
              onSubmit={handleSubmit}
              className="space-y-4 sm:space-y-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-[#2C3E50] mb-1.5 sm:mb-2">
                    Full Name <span className="text-[#DC2626]">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#DC2626] transition-colors text-sm"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-[#2C3E50] mb-1.5 sm:mb-2">
                    Email Address <span className="text-[#DC2626]">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#DC2626] transition-colors text-sm"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-[#2C3E50] mb-1.5 sm:mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#DC2626] transition-colors text-sm"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-[#2C3E50] mb-1.5 sm:mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#DC2626] transition-colors text-sm"
                    placeholder="Your Company"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-[#2C3E50] mb-1.5 sm:mb-2">
                  Subject <span className="text-[#DC2626]">*</span>
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#DC2626] transition-colors text-sm cursor-pointer"
                >
                  <option value="">Select a subject</option>
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Product Information">Product Information</option>
                  <option value="Partnership Opportunity">Partnership Opportunity</option>
                  <option value="Career Inquiry">Career Inquiry</option>
                  <option value="Technical Support">Technical Support</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-[#2C3E50] mb-1.5 sm:mb-2">
                  Message <span className="text-[#DC2626]">*</span>
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  maxLength={500}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#DC2626] transition-colors text-sm resize-none"
                  placeholder="How can we help you?"
                ></textarea>
                <p className="text-xs text-[#9CA3AF] mt-1 text-right">
                  {formData.message.length}/500 characters
                </p>
              </div>

              <Button type="submit" size="lg" className="w-full">
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <i className="ri-loader-4-line animate-spin mr-2"></i>
                    Sending...
                  </span>
                ) : (
                  'Send Message'
                )}
              </Button>

              {submitStatus === 'success' && (
                <div className="p-4 sm:p-6 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start">
                    <div className="w-10 h-10 flex items-center justify-center bg-green-100 rounded-full mr-4 flex-shrink-0">
                      <i className="ri-check-line text-green-600 text-xl"></i>
                    </div>
                    <div>
                      <h4 className="text-green-800 font-semibold text-sm sm:text-base mb-1">Message Sent Successfully!</h4>
                      <p className="text-green-700 text-xs sm:text-sm mb-3">
                        Thank you for reaching out. Our team will get back to you within 24 hours.
                      </p>
                      <div className="bg-green-100/50 rounded-lg p-3">
                        <p className="text-green-800 text-xs sm:text-sm font-medium mb-2">Need immediate assistance? Contact us directly:</p>
                        <div className="space-y-1">
                          <p className="text-green-700 text-xs sm:text-sm flex items-center">
                            <i className="ri-phone-line mr-2"></i>
                            General Enquiries: <a href="tel:+243999995300" className="font-semibold ml-1 hover:underline">+243 999 995 300</a>
                          </p>
                          <p className="text-green-700 text-xs sm:text-sm flex items-center">
                            <i className="ri-customer-service-line mr-2"></i>
                            Services: <a href="tel:+243975007749" className="font-semibold ml-1 hover:underline">+243 975 007 749</a>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-xs sm:text-sm flex items-center">
                    <i className="ri-error-warning-line mr-2"></i>
                    Something went wrong. Please try again later.
                  </p>
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-[#DC2626]">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4" style={{ fontFamily: 'Merriweather, serif' }}>
            Ready to Partner With Us?
          </h2>
          <p className="text-white/90 text-sm sm:text-base lg:text-lg mb-6 sm:mb-8 max-w-[600px] mx-auto">
            Join hundreds of satisfied clients who trust RUBAMIN SARL for their industrial needs.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <a
              href="tel:+15551234567"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-white text-[#DC2626] font-semibold rounded-xl hover:shadow-lg transition-all cursor-pointer whitespace-nowrap text-sm sm:text-base"
            >
              <i className="ri-phone-line mr-2"></i>
              Call Us Now
            </a>
            <a
              href="mailto:info@rubamindrc.com"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-[#DC2626] transition-all cursor-pointer whitespace-nowrap text-sm sm:text-base"
            >
              <i className="ri-mail-line mr-2"></i>
              Email Us
            </a>
          </div>
        </div>
      </section>

      <Footer />
      <BackToTop />
    </div>
  );
};

export default ContactPage;
