
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const DEPARTMENTS = [
  'Operations',
  'Production',
  'Health & Safety',
  'Finance & Accounting',
  'Human Resources',
  'IT & Systems',
  'Logistics & Supply Chain',
  'Quality Assurance',
  'Environmental Management',
  'Administration',
];

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    employeeId: '',
    department: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [step, setStep] = useState(1);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const getPasswordStrength = () => {
    const p = formData.password;
    if (!p) return { score: 0, label: '', color: '' };
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[a-z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;

    if (score <= 2) return { score: 1, label: 'Weak', color: '#DC2626' };
    if (score <= 3) return { score: 2, label: 'Fair', color: '#F59E0B' };
    if (score <= 4) return { score: 3, label: 'Good', color: '#10B981' };
    return { score: 4, label: 'Strong', color: '#059669' };
  };

  const strength = getPasswordStrength();

  const validateStep1 = () => {
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setError('Please enter your full name.');
      return false;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setError('Please enter a valid email address.');
      return false;
    }
    if (!formData.employeeId.trim()) {
      setError('Please enter your Employee ID.');
      return false;
    }
    if (!formData.department) {
      setError('Please select your department.');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep1()) {
      setError('');
      setStep(2);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Please try again.');
      return;
    }
    if (!agreeTerms) {
      setError('You must agree to the Terms of Service and Privacy Policy.');
      return;
    }

    setIsLoading(true);
    // Simulate async request – replace with real API call
    setTimeout(() => {
      setIsLoading(false);
      setShowSuccess(true);
      setTimeout(() => navigate('/auth/login'), 2500);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Visual */}
      <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://readdy.ai/api/search-image?query=Modern%20industrial%20facility%20with%20workers%20wearing%20safety%20helmets%20and%20high%20visibility%20vests%20collaborating%20in%20a%20clean%20professional%20environment%20with%20copper%20processing%20equipment%20and%20advanced%20technology%20systems%20in%20background%20warm%20lighting&width=1200&height=1600&seq=auth-register-bg-1&orientation=portrait')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#2C3E50]/90 via-[#2C3E50]/75 to-[#DC2626]/40" />

        <div className="relative z-10 flex flex-col justify-between p-10 text-white w-full">
          <Link to="/" className="flex items-center gap-3 cursor-pointer">
            <img
              src="https://static.readdy.ai/image/1b404af276821d98dfecb0eec592fbd4/2beca25c2dca50fd1a3109512ef52e33.png"
              alt="RUBAMIN SARL Logo"
              className="h-11 w-auto"
            />
            <span className="text-lg font-bold tracking-wide">RUBAMIN SARL</span>
          </Link>

          <div className="space-y-6">
            <div>
              <p className="text-xs uppercase tracking-[3px] text-[#DC2626] font-semibold mb-3">
                Join Our Team
              </p>
              <h1
                className="text-4xl font-bold leading-tight mb-4"
                style={{ fontFamily: 'Merriweather, serif' }}
              >
                Create Your<br />Account
              </h1>
              <p className="text-base text-white/75 leading-relaxed max-w-md">
                Register to access your personalized employee portal with tools
                designed to enhance your productivity and collaboration.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-2xl">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <i className="ri-user-add-line text-xl" />
                </div>
                <div>
                  <h3 className="font-bold text-sm mb-0.5">Quick Registration</h3>
                  <p className="text-xs text-white/60">
                    Set up your account in under 2 minutes
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-2xl">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <i className="ri-shield-keyhole-line text-xl" />
                </div>
                <div>
                  <h3 className="font-bold text-sm mb-0.5">Secure Access</h3>
                  <p className="text-xs text-white/60">
                    Enterprise-grade security for your data
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-2xl">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <i className="ri-apps-2-line text-xl" />
                </div>
                <div>
                  <h3 className="font-bold text-sm mb-0.5">Full Access</h3>
                  <p className="text-xs text-white/60">
                    All tools and resources at your fingertips
                  </p>
                </div>
              </div>
            </div>
          </div>

          <p className="text-xs text-white/50">
            &copy; {new Date().getFullYear()} RUBAMIN SARL. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-[48%] flex items-center justify-center p-6 sm:p-8 bg-[#FAFAFA] overflow-y-auto">
        <div className="w-full max-w-[440px]">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 text-center">
            <Link to="/" className="inline-flex items-center gap-3 cursor-pointer">
              <img
                src="https://static.readdy.ai/image/1b404af276821d98dfecb0eec592fbd4/2beca25c2dca50fd1a3109512ef52e33.png"
                alt="RUBAMIN SARL Logo"
                className="h-10 w-auto"
              />
              <span className="text-lg font-bold text-[#2C3E50] tracking-wide">
                RUBAMIN SARL
              </span>
            </Link>
          </div>

          {/* Success Message */}
          {showSuccess && (
            <div className="mb-6 p-5 bg-[#F0FDF4] border border-green-200 rounded-2xl text-center">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <i className="ri-check-double-line text-2xl text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-green-800 mb-1">
                Account Created!
              </h3>
              <p className="text-sm text-green-600">
                Redirecting you to the login page...
              </p>
            </div>
          )}

          {/* Form Card */}
          <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100/80">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-[#FEF2F2] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <i className="ri-user-add-line text-3xl text-[#DC2626]" />
              </div>
              <h2
                className="text-2xl font-bold text-[#2C3E50] mb-1.5"
                style={{ fontFamily: 'Merriweather, serif' }}
              >
                Create Account
              </h2>
              <p className="text-sm text-[#6C757D]">Register for your employee portal</p>
            </div>

            {/* Step Indicator */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    step >= 1 ? 'bg-[#DC2626] text-white' : 'bg-gray-200 text-[#6C757D]'
                  }`}
                >
                  {step > 1 ? <i className="ri-check-line text-sm" /> : '1'}
                </div>
                <span
                  className={`text-xs font-medium ${
                    step >= 1 ? 'text-[#2C3E50]' : 'text-[#9CA3AF]'
                  }`}
                >
                  Personal Info
                </span>
              </div>
              <div
                className={`flex-shrink-0 w-8 h-0.5 ${
                  step >= 2 ? 'bg-[#DC2626]' : 'bg-gray-200'
                }`}
              />
              <div className="flex-1 flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    step >= 2 ? 'bg-[#DC2626] text-white' : 'bg-gray-200 text-[#6C757D]'
                  }`}
                >
                  2
                </div>
                <span
                  className={`text-xs font-medium ${
                    step >= 2 ? 'text-[#2C3E50]' : 'text-[#9CA3AF]'
                  }`}
                >
                  Security
                </span>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-5 p-3.5 bg-[#FEF2F2] border border-red-200 rounded-xl flex items-start gap-2.5">
                <i className="ri-error-warning-line text-[#DC2626] text-lg mt-0.5 flex-shrink-0" />
                <p className="text-sm text-[#DC2626]">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Step 1: Personal Info */}
              {step === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-[#2C3E50] mb-1.5">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="John"
                        className="w-full px-4 py-3 bg-[#F8F9FA] border border-gray-200 rounded-xl text-[#2C3E50] text-sm placeholder-[#9CA3AF] focus:outline-none focus:border-[#DC2626] focus:ring-2 focus:ring-[#DC2626]/15 focus:bg-white transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#2C3E50] mb-1.5">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Doe"
                        className="w-full px-4 py-3 bg-[#F8F9FA] border border-gray-200 rounded-xl text-[#2C3E50] text-sm placeholder-[#9CA3AF] focus:outline-none focus:border-[#DC2626] focus:ring-2 focus:ring-[#DC2626]/15 focus:bg-white transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#2C3E50] mb-1.5">
                      Work Email
                    </label>
                    <div className="relative">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center">
                        <i className="ri-mail-line text-[#9CA3AF] text-base" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@rubamindrc.com"
                        className="w-full pl-11 pr-4 py-3 bg-[#F8F9FA] border border-gray-200 rounded-xl text-[#2C3E50] text-sm placeholder-[#9CA3AF] focus:outline-none focus:border-[#DC2626] focus:ring-2 focus:ring-[#DC2626]/15 focus:bg-white transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#2C3E50] mb-1.5">
                      Employee ID
                    </label>
                    <div className="relative">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center">
                        <i className="ri-hashtag text-[#9CA3AF] text-base" />
                      </div>
                      <input
                        type="text"
                        name="employeeId"
                        value={formData.employeeId}
                        onChange={handleChange}
                        placeholder="e.g. RUB-2024-001"
                        className="w-full pl-11 pr-4 py-3 bg-[#F8F9FA] border border-gray-200 rounded-xl text-[#2C3E50] text-sm placeholder-[#9CA3AF] focus:outline-none focus:border-[#DC2626] focus:ring-2 focus:ring-[#DC2626]/15 focus:bg-white transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#2C3E50] mb-1.5">
                      Department
                    </label>
                    <div className="relative">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center">
                        <i className="ri-building-2-line text-[#9CA3AF] text-base" />
                      </div>
                      <select
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        className="w-full pl-11 pr-10 py-3 bg-[#F8F9FA] border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#DC2626] focus:ring-2 focus:ring-[#DC2626]/15 focus:bg-white transition-all appearance-none cursor-pointer"
                        style={{
                          color: formData.department ? '#2C3E50' : '#9CA3AF',
                        }}
                        required
                      >
                        <option value="" disabled>
                          Select your department
                        </option>
                        {DEPARTMENTS.map((dept) => (
                          <option key={dept} value={dept} className="text-[#2C3E50]">
                            {dept}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center pointer-events-none">
                        <i className="ri-arrow-down-s-line text-[#9CA3AF] text-base" />
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleNext}
                    className="w-full py-3.5 bg-[#DC2626] hover:bg-[#B91C1C] text-white text-sm font-semibold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap shadow-lg shadow-[#DC2626]/20"
                  >
                    Continue
                    <i className="ri-arrow-right-line text-base" />
                  </button>
                </div>
              )}

              {/* Step 2: Security */}
              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#2C3E50] mb-1.5">
                      Create Password
                    </label>
                    <div className="relative">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center">
                        <i className="ri-lock-password-line text-[#9CA3AF] text-base" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Min. 8 characters"
                        className="w-full pl-11 pr-11 py-3 bg-[#F8F9FA] border border-gray-200 rounded-xl text-[#2C3E50] text-sm placeholder-[#9CA3AF] focus:outline-none focus:border-[#DC2626] focus:ring-2 focus:ring-[#DC2626]/15 focus:bg-white transition-all"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center cursor-pointer"
                      >
                        <i
                          className={`${
                            showPassword ? 'ri-eye-off-line' : 'ri-eye-line'
                          } text-[#9CA3AF] text-base hover:text-[#2C3E50] transition-colors`}
                        />
                      </button>
                    </div>

                    {/* Password Strength */}
                    {formData.password && (
                      <div className="mt-2">
                        <div className="flex gap-1.5 mb-1">
                          {[1, 2, 3, 4].map((i) => (
                            <div
                              key={i}
                              className="flex-1 h-1.5 rounded-full transition-all"
                              style={{
                                backgroundColor:
                                  i <= strength.score ? strength.color : '#E5E7EB',
                              }}
                            />
                          ))}
                        </div>
                        <p className="text-xs font-medium" style={{ color: strength.color }}>
                          {strength.label}
                        </p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#2C3E50] mb-1.5">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center">
                        <i className="ri-lock-line text-[#9CA3AF] text-base" />
                      </div>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Re-enter your password"
                        className="w-full pl-11 pr-11 py-3 bg-[#F8F9FA] border border-gray-200 rounded-xl text-[#2C3E50] text-sm placeholder-[#9CA3AF] focus:outline-none focus:border-[#DC2626] focus:ring-2 focus:ring-[#DC2626]/15 focus:bg-white transition-all"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center cursor-pointer"
                      >
                        <i
                          className={`${
                            showConfirmPassword ? 'ri-eye-off-line' : 'ri-eye-line'
                          } text-[#9CA3AF] text-base hover:text-[#2C3E50] transition-colors`}
                        />
                      </button>
                    </div>
                    {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                      <p className="mt-1.5 text-xs text-[#DC2626] flex items-center gap-1">
                        <i className="ri-close-circle-line" />
                        Passwords do not match
                      </p>
                    )}
                    {formData.confirmPassword && formData.password === formData.confirmPassword && (
                      <p className="mt-1.5 text-xs text-green-600 flex items-center gap-1">
                        <i className="ri-check-line" />
                        Passwords match
                      </p>
                    )}
                  </div>

                  {/* Password Requirements */}
                  <div className="p-3.5 bg-[#F8F9FA] rounded-xl">
                    <p className="text-xs font-semibold text-[#2C3E50] mb-2">
                      Password Requirements:
                    </p>
                    <div className="grid grid-cols-2 gap-1.5">
                      {[
                        {
                          check: formData.password.length >= 8,
                          text: 'At least 8 characters',
                        },
                        { check: /[A-Z]/.test(formData.password), text: 'One uppercase letter' },
                        { check: /[a-z]/.test(formData.password), text: 'One lowercase letter' },
                        { check: /[0-9]/.test(formData.password), text: 'One number' },
                      ].map((req, i) => (
                        <div key={i} className="flex items-center gap-1.5">
                          <i
                            className={`${
                              req.check ? 'ri-check-line text-green-500' : 'ri-close-line text-[#9CA3AF]'
                            } text-xs`}
                          />
                          <span
                            className={`text-xs ${req.check ? 'text-green-700' : 'text-[#9CA3AF]'}`}
                          >
                            {req.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Terms */}
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-[#DC2626] focus:ring-[#DC2626]/20 cursor-pointer mt-0.5"
                    />
                    <span className="text-xs text-[#6C757D] leading-relaxed">
                      I agree to the{' '}
                      <a href="#" className="text-[#DC2626] hover:underline cursor-pointer font-medium">
                        Terms of Service
                      </a>{' '}
                      and{' '}
                      <a href="#" className="text-[#DC2626] hover:underline cursor-pointer font-medium">
                        Privacy Policy
                      </a>
                    </span>
                  </label>

                  {/* Buttons */}
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setStep(1);
                        setError('');
                      }}
                      className="px-5 py-3.5 border border-gray-200 text-[#2C3E50] text-sm font-semibold rounded-xl hover:bg-gray-50 transition-all cursor-pointer whitespace-nowrap"
                    >
                      <i className="ri-arrow-left-line" />
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 py-3.5 bg-[#DC2626] hover:bg-[#B91C1C] text-white text-sm font-semibold rounded-xl transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap shadow-lg shadow-[#DC2626]/20"
                    >
                      {isLoading ? (
                        <>
                          <i className="ri-loader-4-line animate-spin text-base" />
                          Creating Account...
                        </>
                      ) : (
                        <>
                          <i className="ri-user-add-line text-base" />
                          Create Account
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>

            {/* Login Link */}
            <p className="mt-6 text-center text-sm text-[#6C757D]">
              Already have an account?{' '}
              <Link
                to="/auth/login"
                className="text-[#DC2626] hover:text-[#B91C1C] font-semibold cursor-pointer"
              >
                Sign In
              </Link>
            </p>
          </div>

          {/* Security Badge */}
          <div className="mt-5 flex items-center justify-center gap-2 text-xs text-[#9CA3AF]">
            <i className="ri-shield-check-line text-green-500 text-sm" />
            <span>Protected by 256-bit SSL encryption</span>
          </div>

          {/* Back to Website */}
          <div className="mt-4 text-center">
            <Link
              to="/"
              className="text-sm text-[#6C757D] hover:text-[#DC2626] transition-colors inline-flex items-center gap-2 font-medium cursor-pointer whitespace-nowrap"
            >
              <i className="ri-arrow-left-line" />
              Back to Main Website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
