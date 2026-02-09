
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function WebmailPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Open webmail in a new window
    window.open('https://rubamindrc.com:2096/', '_blank');
    
    // Redirect back to home after a short delay
    const timer = setTimeout(() => {
      navigate('/');
    }, 1000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-6 text-center">
        <div className="bg-white rounded-2xl shadow-xl p-12">
          {/* Icon */}
          <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="ri-mail-line text-4xl text-teal-600"></i>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-slate-900 mb-4">
            Opening Webmail
          </h1>

          {/* Description */}
          <p className="text-lg text-slate-600 mb-8">
            Your corporate webmail is opening in a new window. If it doesn't open automatically, please click the button below.
          </p>

          {/* Manual Link Button */}
          <a
            href="https://rubamindrc.com:2096/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors shadow-lg hover:shadow-xl whitespace-nowrap"
          >
            <i className="ri-external-link-line text-xl"></i>
            Open Webmail Login
          </a>

          {/* Back Button */}
          <button
            onClick={() => navigate('/')}
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 text-slate-600 hover:text-slate-900 font-medium transition-colors whitespace-nowrap"
          >
            <i className="ri-arrow-left-line"></i>
            Back to Home
          </button>

          {/* Help Text */}
          <div className="mt-8 pt-8 border-t border-slate-200">
            <p className="text-sm text-slate-500 mb-2">
              Need help accessing your email?
            </p>
            <a
              href="mailto:it@rubamindrc.com"
              className="text-sm text-teal-600 hover:text-teal-700 font-medium"
            >
              Contact IT Support
            </a>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-sm text-slate-600">
          <p>
            <i className="ri-information-line mr-1"></i>
            Please allow pop-ups for this site if the window doesn't open
          </p>
        </div>
      </div>
    </div>
  );
}
