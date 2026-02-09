import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const DUMMY_USERS = [
  {
    email: 'john.doe@rubamindrc.com',
    password: 'User@123',
    name: 'John Doe',
    role: 'Operations Manager',
    department: 'Operations',
  },
  {
    email: 'sarah.m@rubamindrc.com',
    password: 'User@123',
    name: 'Sarah Mukendi',
    role: 'HSE Officer',
    department: 'Health & Safety',
  },
  {
    email: 'david.k@rubamindrc.com',
    password: 'User@123',
    name: 'David Kabongo',
    role: 'Plant Supervisor',
    department: 'Production',
  },
];

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      
      const matchedUser = DUMMY_USERS.find(
        (u) => u.email === email && u.password === password
      );

      if (matchedUser) {
        sessionStorage.setItem('userLoggedIn', 'true');
        sessionStorage.setItem('userData', JSON.stringify({
          name: matchedUser.name,
          email: matchedUser.email,
          role: matchedUser.role,
          department: matchedUser.department,
        }));
        setShowSuccess(true);
        setTimeout(() => {
          window.REACT_APP_NAVIGATE('/user/dashboard');
        }, 1500);
      } else {
        setError('Invalid email or password. Please check the demo credentials and try again.');
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Visual */}
      <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://readdy.ai/api/search-image?query=Industrial%20copper%20smelting%20plant%20with%20molten%20metal%20and%20modern%20processing%20equipment%20in%20a%20large%20factory%20setting%20with%20warm%20orange%20glow%20from%20furnaces%20and%20professional%20industrial%20environment%20with%20steel%20structures%20and%20safety%20equipment%20visible&width=1200&height=1600&seq=auth-login-bg-1&orientation=portrait')`,
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
                Employee Portal
              </p>
              <h1
                className="text-4xl font-bold leading-tight mb-4"
                style={{ fontFamily: 'Merriweather, serif' }}
              >
                Welcome Back
              </h1>
              <p className="text-base text-white/75 leading-relaxed max-w-md">
                Access your personalized dashboard, manage tasks, and stay
                connected with your team across all departments.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-3">
                  <i className="ri-bar-chart-box-line text-lg" />
                </div>
                <h3 className="font-bold text-sm mb-1">My Dashboard</h3>
                <p className="text-xs text-white/60">Track your KPIs and tasks</p>
              </div>
              <div className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-3">
                  <i className="ri-team-line text-lg" />
                </div>
                <h3 className="font-bold text-sm mb-1">Team Hub</h3>
                <p className="text-xs text-white/60">Collaborate with colleagues</p>
              </div>
              <div className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-3">
                  <i className="ri-file-list-3-line text-lg" />
                </div>
                <h3 className="font-bold text-sm mb-1">Reports</h3>
                <p className="text-xs text-white/60">View and submit reports</p>
              </div>
              <div className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-3">
                  <i className="ri-notification-3-line text-lg" />
                </div>
                <h3 className="font-bold text-sm mb-1">Notifications</h3>
                <p className="text-xs text-white/60">Stay updated in real-time</p>
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

          {/* Success Toast */}
          {showSuccess && (
            <div className="mb-6 p-4 bg-[#F0FDF4] border border-green-200 rounded-2xl flex items-center gap-3 animate-fade-in">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <i className="ri-check-line text-xl text-green-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-green-800">
                  Login Successful!
                </p>
                <p className="text-xs text-green-600">
                  Redirecting to your dashboard...
                </p>
              </div>
            </div>
          )}

          {/* Form Card */}
          <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100/80">
            <div className="text-center mb-7">
              <div className="w-16 h-16 bg-[#FEF2F2] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <i className="ri-user-3-line text-3xl text-[#DC2626]" />
              </div>
              <h2
                className="text-2xl font-bold text-[#2C3E50] mb-1.5"
                style={{ fontFamily: 'Merriweather, serif' }}
              >
                Sign In
              </h2>
              <p className="text-sm text-[#6C757D]">Access your employee portal</p>
            </div>

            {/* Demo Credentials */}
            <div className="mb-5 p-3.5 bg-[#FFFBEB] border border-amber-200 rounded-xl">
              <p className="text-xs font-semibold text-amber-800 mb-1.5 flex items-center gap-1.5">
                <i className="ri-key-2-line" />
                Demo Credentials
              </p>
              <p className="text-xs text-amber-700">
                Email:{' '}
                <span className="font-mono font-medium">
                  john.doe@rubamindrc.com
                </span>
              </p>
              <p className="text-xs text-amber-700">
                Password:{' '}
                <span className="font-mono font-medium">User@123</span>
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-5 p-3.5 bg-[#FEF2F2] border border-red-200 rounded-xl flex items-start gap-2.5">
                <i className="ri-error-warning-line text-[#DC2626] text-lg mt-0.5 flex-shrink-0" />
                <p className="text-sm text-[#DC2626]">{error}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-[#2C3E50] mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center">
                    <i className="ri-mail-line text-[#9CA3AF] text-base" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@rubamindrc.com"
                    className="w-full pl-11 pr-4 py-3 bg-[#F8F9FA] border border-gray-200 rounded-xl text-[#2C3E50] text-sm placeholder-[#9CA3AF] focus:outline-none focus:border-[#DC2626] focus:ring-2 focus:ring-[#DC2626]/15 focus:bg-white transition-all"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-[#2C3E50] mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center">
                    <i className="ri-lock-password-line text-[#9CA3AF] text-base" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
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
              </div>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-[#DC2626] focus:ring-[#DC2626]/20 cursor-pointer"
                  />
                  <span className="text-sm text-[#6C757D]">Remember me</span>
                </label>
                <a
                  href="#"
                  className="text-sm text-[#DC2626] hover:text-[#B91C1C] font-medium cursor-pointer whitespace-nowrap"
                >
                  Forgot password?
                </a>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-[#DC2626] hover:bg-[#B91C1C] text-white text-sm font-semibold rounded-xl transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap shadow-lg shadow-[#DC2626]/20"
              >
                {isLoading ? (
                  <>
                    <i className="ri-loader-4-line animate-spin text-base" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <i className="ri-login-box-line text-base" />
                    Sign In
                  </>
                )}
              </button>
            </form>

            {/* Register Link */}
            <p className="mt-6 text-center text-sm text-[#6C757D]">
              Don&apos;t have an account?{' '}
              <Link
                to="/auth/register"
                className="text-[#DC2626] hover:text-[#B91C1C] font-semibold cursor-pointer"
              >
                Create Account
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

export default LoginPage;
