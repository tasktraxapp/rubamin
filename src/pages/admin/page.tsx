import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/base/Button';

// Dummy credentials for demo
const DUMMY_CREDENTIALS = {
  email: 'admin@rubamindrc.com',
  password: 'Admin@123'
};

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      
      if (email === DUMMY_CREDENTIALS.email && password === DUMMY_CREDENTIALS.password) {
        // Store login state
        sessionStorage.setItem('adminLoggedIn', 'true');
        sessionStorage.setItem('adminUser', JSON.stringify({
          name: 'Admin',
          email: email
        }));
        navigate('/admin/dashboard');
      } else {
        setError('Invalid email or password. Please try again.');
      }
    }, 1500);
  };

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://readdy.ai/api/search-image?query=Modern%20corporate%20office%20building%20interior%20with%20sleek%20glass%20walls%20and%20professional%20workspace%20environment%20featuring%20clean%20minimalist%20design%20with%20warm%20lighting%20and%20executive%20atmosphere%20showing%20technology%20and%20business%20elements&width=1200&height=1600&seq=admin-bg-1&orientation=portrait')`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#2C3E50]/90 via-[#2C3E50]/80 to-[#DC2626]/50" />
        
        <div className="relative z-10 flex flex-col justify-between p-8 text-white w-full">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="https://static.readdy.ai/image/1b404af276821d98dfecb0eec592fbd4/2beca25c2dca50fd1a3109512ef52e33.png"
              alt="RUBAMIN SARL Logo"
              className="h-10 w-auto"
            />
            <span className="text-lg font-bold text-white tracking-wide">RUBAMIN SARL</span>
          </Link>
          
          <div className="space-y-4">
            <div>
              <p className="text-xs uppercase tracking-[2px] text-[#DC2626] font-semibold mb-2">Admin Portal</p>
              <h1 className="text-4xl font-bold mb-3 leading-tight" style={{ fontFamily: 'Merriweather, serif' }}>
                Admin Control<br />Panel
              </h1>
              <p className="text-base text-white/80 leading-relaxed max-w-md">
                Secure access to manage website content, users, and system settings.
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-3 bg-white/10 backdrop-blur-sm rounded-2xl">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <i className="ri-dashboard-3-line text-lg" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Dashboard Analytics</h3>
                  <p className="text-xs text-white/70">Monitor performance and metrics</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-white/10 backdrop-blur-sm rounded-2xl">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <i className="ri-file-edit-line text-lg" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Content Management</h3>
                  <p className="text-xs text-white/70">Update pages and media</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-white/10 backdrop-blur-sm rounded-2xl">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <i className="ri-user-settings-line text-lg" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">User Management</h3>
                  <p className="text-xs text-white/70">Manage users and permissions</p>
                </div>
              </div>
            </div>
          </div>
          
          <p className="text-xs text-white/60">
            © {new Date().getFullYear()} RUBAMIN SARL. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-[#F8F9FA] overflow-y-auto">
        <div className="w-full max-w-[420px]">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-6 text-center">
            <Link to="/" className="inline-flex items-center gap-3">
              <img
                src="https://static.readdy.ai/image/1b404af276821d98dfecb0eec592fbd4/2beca25c2dca50fd1a3109512ef52e33.png"
                alt="RUBAMIN SARL Logo"
                className="h-10 w-auto"
              />
              <span className="text-lg font-bold text-[#2C3E50] tracking-wide">RUBAMIN SARL</span>
            </Link>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-3xl p-8 shadow-lg">
            {/* Form Header */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-[#FEF2F2] rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-admin-line text-3xl text-[#DC2626]"></i>
              </div>
              <h2 className="text-2xl font-bold text-[#2C3E50] mb-2" style={{ fontFamily: 'Merriweather, serif' }}>
                Admin Login
              </h2>
              <p className="text-[#6C757D] text-sm">
                Enter your credentials to access the panel
              </p>
            </div>

            {/* Demo Credentials Info */}
            <div className="mb-4 p-3 bg-[#F0FDF4] border border-green-200 rounded-xl">
              <p className="text-xs font-medium text-green-800 mb-1 flex items-center gap-1">
                <i className="ri-key-line" />
                Demo Credentials:
              </p>
              <p className="text-xs text-green-700">Email: <span className="font-mono font-medium">admin@rubamindrc.com</span></p>
              <p className="text-xs text-green-700">Password: <span className="font-mono font-medium">Admin@123</span></p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-[#FEF2F2] border border-[#DC2626]/20 rounded-xl flex items-start gap-2">
                <i className="ri-error-warning-line text-[#DC2626] text-lg mt-0.5" />
                <p className="text-sm text-[#DC2626]">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#2C3E50] mb-1.5">
                  Admin Email
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center">
                    <i className="ri-user-line text-[#6C757D] text-base"></i>
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@rubamindrc.com"
                    className="w-full pl-10 pr-3 py-3 bg-[#F8F9FA] border border-gray-200 rounded-xl text-[#2C3E50] text-sm placeholder-[#9CA3AF] focus:outline-none focus:border-[#DC2626] focus:ring-2 focus:ring-[#DC2626]/20 focus:bg-white transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2C3E50] mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center">
                    <i className="ri-lock-line text-[#6C757D] text-base"></i>
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-10 py-3 bg-[#F8F9FA] border border-gray-200 rounded-xl text-[#2C3E50] text-sm placeholder-[#9CA3AF] focus:outline-none focus:border-[#DC2626] focus:ring-2 focus:ring-[#DC2626]/20 focus:bg-white transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center cursor-pointer"
                  >
                    <i className={`${showPassword ? 'ri-eye-off-line' : 'ri-eye-line'} text-[#6C757D] text-base hover:text-[#2C3E50] transition-colors`}></i>
                  </button>
                </div>
              </div>

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
                <a href="#" className="text-sm text-[#DC2626] hover:text-[#B91C1C] font-medium cursor-pointer whitespace-nowrap">
                  Forgot password?
                </a>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2 whitespace-nowrap">
                    <i className="ri-loader-4-line animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2 whitespace-nowrap">
                    <i className="ri-login-box-line" />
                    Sign In to Admin Panel
                  </span>
                )}
              </Button>
            </form>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-center gap-2 text-sm text-[#6C757D]">
                <i className="ri-shield-check-line text-green-500"></i>
                <span>Secured with 256-bit SSL encryption</span>
              </div>
            </div>
          </div>

          {/* Help Section */}
          <div className="mt-4 bg-white rounded-3xl p-4 shadow-sm">
            <h3 className="text-sm font-bold text-[#2C3E50] mb-2 flex items-center gap-2">
              <i className="ri-question-line text-[#DC2626]"></i>
              Need Help?
            </h3>
            <div className="flex items-center gap-2 text-sm text-[#6C757D]">
              <i className="ri-mail-line text-[#DC2626]"></i>
              <a href="mailto:it.rubamin@rubamindrc.com" className="hover:text-[#DC2626] transition-colors">
                it.rubamin@rubamindrc.com
              </a>
            </div>
          </div>

          {/* Back to Website */}
          <div className="mt-4 text-center">
            <Link 
              to="/" 
              className="text-sm text-[#6C757D] hover:text-[#DC2626] transition-colors inline-flex items-center gap-2 font-medium whitespace-nowrap"
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

export default AdminLoginPage;
