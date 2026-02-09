import React, { useState, useEffect, useRef } from 'react';
import { Header } from '../../components/feature/Header';
import { Footer } from '../../components/feature/Footer';
import { BackToTop } from '../../components/feature/BackToTop';

const JobsPage: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    position: '',
    experience: '',
    currentEmployer: '',
    expectedSalary: '',
    noticePeriod: '',
    coverLetter: '',
    captchaInput: '',
  });
  const [documents, setDocuments] = useState<File[]>([]);
  const [captcha, setCaptcha] = useState({ num1: 0, num2: 0, answer: 0 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    setCaptcha({ num1, num2, answer: num1 + num2 });
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setDocuments((prev) => [...prev, ...newFiles]);
    }
  };

  const removeDocument = (index: number) => {
    setDocuments((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.position.trim()) newErrors.position = 'Position is required';
    if (!formData.experience) newErrors.experience = 'Experience is required';
    if (documents.length === 0) newErrors.documents = 'Please upload at least one document';
    if (!formData.captchaInput.trim()) newErrors.captchaInput = 'Please solve the captcha';
    else if (parseInt(formData.captchaInput) !== captcha.answer) newErrors.captchaInput = 'Incorrect captcha answer';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Prepare payload for the main application form
      const payload = new URLSearchParams();
      payload.append('fullName', formData.fullName);
      payload.append('email', formData.email);
      payload.append('phone', formData.phone);
      payload.append('position', formData.position);
      payload.append('experience', formData.experience);
      payload.append('currentEmployer', formData.currentEmployer);
      payload.append('expectedSalary', formData.expectedSalary);
      payload.append('noticePeriod', formData.noticePeriod);
      payload.append('coverLetter', formData.coverLetter);
      payload.append('documents', documents.map((d) => d.name).join(', ') + ' (Uncollectable)');

      const response = await fetch('https://readdy.ai/api/form/d62f4ror3m6fkobkns30', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: payload.toString(),
      });

      // Notification email to HR
      const notify = new URLSearchParams();
      notify.append('email', 'hr@rubamindrc.com');
      notify.append('applicantName', formData.fullName);
      notify.append('applicantEmail', formData.email);
      notify.append('applicantPhone', formData.phone);
      notify.append('positionApplied', formData.position);
      notify.append('experience', formData.experience);
      notify.append('currentEmployer', formData.currentEmployer || 'N/A');
      notify.append('expectedSalary', formData.expectedSalary || 'N/A');
      notify.append('noticePeriod', formData.noticePeriod || 'N/A');
      notify.append(
        'applicationDate',
        new Date().toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
      );
      notify.append('subject', `New Job Application: ${formData.position} - ${formData.fullName}`);

      await fetch('https://readdy.ai/api/form/d63481r0723ekv2it8t0', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: notify.toString(),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          position: '',
          experience: '',
          currentEmployer: '',
          expectedSalary: '',
          noticePeriod: '',
          coverLetter: '',
          captchaInput: '',
        });
        setDocuments([]);
        generateCaptcha();
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const positions = [
    'Senior Metallurgical Engineer',
    'HSE Manager',
    'Production Supervisor',
    'Quality Control Analyst',
    'Maintenance Technician',
    'Environmental Specialist',
    'Supply Chain Coordinator',
    'HR Business Partner',
    'Other',
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
              'url(https://readdy.ai/api/search-image?query=diverse%20team%20of%20professional%20workers%20in%20industrial%20facility%20wearing%20safety%20equipment%20smiling%20and%20working%20together%20modern%20manufacturing%20environment%20representing%20career%20opportunities%20and%20teamwork&width=1920&height=400&seq=jobs-hero-001&orientation=landscape)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50"></div>
        </div>

        <div className="relative h-full max-w-[1320px] mx-auto px-10 flex flex-col justify-center">
          <h1 className="text-5xl font-bold text-white mb-4" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
            Join Our Team
          </h1>
          <p className="text-white text-xl font-light" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.3)' }}>
            Build your career with industry leaders
          </p>
        </div>
      </section>

      {/* Why Work With Us */}
      <section className="py-20 bg-white">
        <div className="max-w-[1000px] mx-auto px-6 text-center">
          <p className="text-sm uppercase tracking-[2px] text-[#DC2626] font-semibold mb-3">JOBS AT RUBAMIN</p>
          <h2 className="text-3xl font-bold text-[#2C3E50] mb-6" style={{ fontFamily: 'Merriweather, serif' }}>
            Why Work With Us
          </h2>
          <p className="text-[#6C757D] leading-relaxed mb-16 max-w-[800px] mx-auto">
            Build your career with a global leader in manufacturing. We offer a dynamic work environment,
            opportunities for professional growth, and the chance to be part of a company that values
            innovation and integrity.
          </p>

          <div className="grid grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-[#F8F9FA] rounded-full flex items-center justify-center mx-auto mb-5">
                <i className="ri-line-chart-line text-3xl text-[#DC2626]"></i>
              </div>
              <h3 className="text-lg font-bold text-[#2C3E50] mb-3">Growth Opportunities</h3>
              <p className="text-sm text-[#6C757D] leading-relaxed">
                Continuous learning and development programs to help you reach your potential.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-[#F8F9FA] rounded-full flex items-center justify-center mx-auto mb-5">
                <i className="ri-team-line text-3xl text-[#DC2626]"></i>
              </div>
              <h3 className="text-lg font-bold text-[#2C3E50] mb-3">Inclusive Culture</h3>
              <p className="text-sm text-[#6C757D] leading-relaxed">
                A diverse and supportive workplace where every voice is heard and valued.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-[#F8F9FA] rounded-full flex items-center justify-center mx-auto mb-5">
                <i className="ri-gift-line text-3xl text-[#DC2626]"></i>
              </div>
              <h3 className="text-lg font-bold text-[#2C3E50] mb-3">Competitive Benefits</h3>
              <p className="text-sm text-[#6C757D] leading-relaxed">
                Comprehensive health coverage, retirement plans, and performance bonuses.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Job Application Form */}
      <section className="py-20 bg-[#F8F9FA]">
        <div className="max-w-[900px] mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-[2px] text-[#DC2626] font-semibold mb-3">APPLY NOW</p>
            <h2 className="text-3xl font-bold text-[#2C3E50]" style={{ fontFamily: 'Merriweather, serif' }}>
              Job Application Form
            </h2>
          </div>

          {submitStatus === 'success' && (
            <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-center">
              <i className="ri-checkbox-circle-line text-2xl mb-2"></i>
              <p className="font-semibold">Application Submitted Successfully!</p>
              <p className="text-sm">We will review your application and get back to you soon.</p>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-center">
              <i className="ri-error-warning-line text-2xl mb-2"></i>
              <p className="font-semibold">Submission Failed</p>
              <p className="text-sm">Please try again later.</p>
            </div>
          )}

          <form
            id="job-application-form"
            data-readdy-form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl p-10 shadow-sm"
          >
            {/* Personal Information */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-[#2C3E50] mb-6 pb-2 border-b border-gray-200">Personal Information</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#2C3E50] mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20 focus:border-[#DC2626] ${
                      errors.fullName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your full name"
                  />
                  {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#2C3E50] mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20 focus:border-[#DC2626] ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your email"
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#2C3E50] mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20 focus:border-[#DC2626] ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your phone number"
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#2C3E50] mb-2">Current Employer</label>
                  <input
                    type="text"
                    name="currentEmployer"
                    value={formData.currentEmployer}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20 focus:border-[#DC2626]"
                    placeholder="Enter current employer (if any)"
                  />
                </div>
              </div>
            </div>

            {/* Position Details */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-[#2C3E50] mb-6 pb-2 border-b border-gray-200">Position Details</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#2C3E50] mb-2">
                    Position Applied For <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20 focus:border-[#DC2626] cursor-pointer ${
                      errors.position ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select a position</option>
                    {positions.map((pos, index) => (
                      <option key={index} value={pos}>
                        {pos}
                      </option>
                    ))}
                  </select>
                  {errors.position && <p className="text-red-500 text-xs mt-1">{errors.position}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#2C3E50] mb-2">
                    Years of Experience <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20 focus:border-[#DC2626] cursor-pointer ${
                      errors.experience ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select experience</option>
                    <option value="0-1 years">0-1 years</option>
                    <option value="1-3 years">1-3 years</option>
                    <option value="3-5 years">3-5 years</option>
                    <option value="5-7 years">5-7 years</option>
                    <option value="7-10 years">7-10 years</option>
                    <option value="10+ years">10+ years</option>
                  </select>
                  {errors.experience && <p className="text-red-500 text-xs mt-1">{errors.experience}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#2C3E50] mb-2">Expected Salary (USD)</label>
                  <input
                    type="text"
                    name="expectedSalary"
                    value={formData.expectedSalary}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20 focus:border-[#DC2626]"
                    placeholder="Enter expected salary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#2C3E50] mb-2">Notice Period</label>
                  <select
                    name="noticePeriod"
                    value={formData.noticePeriod}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20 focus:border-[#DC2626] cursor-pointer"
                  >
                    <option value="">Select notice period</option>
                    <option value="Immediate">Immediate</option>
                    <option value="15 days">15 days</option>
                    <option value="1 month">1 month</option>
                    <option value="2 months">2 months</option>
                    <option value="3 months">3 months</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Cover Letter */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-[#2C3E50] mb-6 pb-2 border-b border-gray-200">Cover Letter</h3>
              <div>
                <label className="block text-sm font-medium text-[#2C3E50] mb-2">
                  Tell us about yourself and why you want to join RUBAMIN
                </label>
                <textarea
                  name="coverLetter"
                  value={formData.coverLetter}
                  onChange={handleInputChange}
                  maxLength={500}
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20 focus:border-[#DC2626] resize-none"
                  placeholder="Write your cover letter here (max 500 characters)"
                />
                <p className="text-xs text-gray-500 mt-1 text-right">{formData.coverLetter.length}/500 characters</p>
              </div>
            </div>

            {/* Document Upload */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-[#2C3E50] mb-6 pb-2 border-b border-gray-200">
                Upload Documents <span className="text-red-500">*</span>
              </h3>
              <p className="text-sm text-[#6C757D] mb-4">
                Please upload your CV/Resume, certificates, and other relevant documents (PDF, DOC, DOCX)
              </p>

              <div
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all hover:border-[#DC2626] hover:bg-red-50/30 ${
                  errors.documents ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <input ref={fileInputRef} type="file" multiple accept=".pdf,.doc,.docx" onChange={handleFileChange} className="hidden" />
                <div className="w-16 h-16 bg-[#FEF2F2] rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-upload-cloud-2-line text-3xl text-[#DC2626]"></i>
                </div>
                <p className="text-sm font-medium text-[#2C3E50] mb-1">Click to upload documents</p>
                <p className="text-xs text-[#6C757D]">PDF, DOC, DOCX (Max 10MB each)</p>
              </div>
              {errors.documents && <p className="text-red-500 text-xs mt-2">{errors.documents}</p>}

              {documents.length > 0 && (
                <div className="mt-4 space-y-2">
                  {documents.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-[#DC2626]/10 rounded flex items-center justify-center">
                          <i className="ri-file-text-line text-[#DC2626]"></i>
                        </div>
                        <span className="text-sm text-[#2C3E50]">{doc.name}</span>
                        <span className="text-xs text-[#6C757D]">({(doc.size / 1024).toFixed(1)} KB)</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeDocument(index)}
                        className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 cursor-pointer"
                      >
                        <i className="ri-close-line text-lg"></i>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Captcha */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-[#2C3E50] mb-6 pb-2 border-b border-gray-200">
                Security Verification <span className="text-red-500">*</span>
              </h3>
              <div className="flex items-center space-x-4">
                <div className="bg-gray-100 rounded-lg px-6 py-4 flex items-center space-x-3">
                  <span className="text-2xl font-bold text-[#2C3E50]">{captcha.num1}</span>
                  <span className="text-2xl font-bold text-[#DC2626]">+</span>
                  <span className="text-2xl font-bold text-[#2C3E50]">{captcha.num2}</span>
                  <span className="text-2xl font-bold text-[#6C757D]">=</span>
                </div>
                <input
                  type="text"
                  name="captchaInput"
                  value={formData.captchaInput}
                  onChange={handleInputChange}
                  className={`w-24 px-4 py-3 border rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20 focus:border-[#DC2626] ${
                    errors.captchaInput ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="?"
                />
                <button
                  type="button"
                  onClick={generateCaptcha}
                  className="w-10 h-10 flex items-center justify-center text-[#6C757D] hover:text-[#DC2626] cursor-pointer"
                  title="Refresh captcha"
                >
                  <i className="ri-refresh-line text-xl"></i>
                </button>
              </div>
              {errors.captchaInput && <p className="text-red-500 text-xs mt-2">{errors.captchaInput}</p>}
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-12 py-4 bg-[#DC2626] text-white font-semibold rounded-lg hover:bg-[#B91C1C] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center space-x-2">
                    <i className="ri-loader-4-line animate-spin"></i>
                    <span>Submitting...</span>
                  </span>
                ) : (
                  'Submit Application'
                )}
              </button>
            </div>
          </form>
        </div>
      </section>

      <Footer />
      <BackToTop />
    </div>
  );
};

export default JobsPage;
