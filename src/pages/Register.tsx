import { SignUp } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';

const Register = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Join Us Today! 🌿
          </h1>
          <p className="text-lg text-gray-600">
            Start your vegetarian food discovery adventure
          </p>
        </div>

        {/* Clerk Sign Up Component */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <SignUp 
            appearance={{
              elements: {
                formButtonPrimary: 
                  'bg-green-600 hover:bg-green-700 text-sm normal-case',
                card: 'shadow-none',
                headerTitle: 'hidden',
                headerSubtitle: 'hidden',
                socialButtonsBlockButton: 
                  'border-gray-300 hover:bg-gray-50',
                formFieldInput: 
                  'border-gray-300 focus:border-green-500 focus:ring-green-500',
                footerActionLink: 
                  'text-green-600 hover:text-green-700',
              },
            }}
            signInUrl="/login"
            forceRedirectUrl="/"
            fallbackRedirectUrl="/"
          />
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link 
              to="/login" 
              className="text-green-600 hover:text-green-700 font-medium"
            >
              Sign in instead
            </Link>
          </p>
        </div>

        {/* Benefits */}
        <div className="mt-8 bg-white rounded-xl p-6 border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4 text-center">
            What you'll get:
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-sm">✓</span>
              </div>
              <p className="text-sm text-gray-600">
                AI-powered ingredient scanning and analysis
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-sm">✓</span>
              </div>
              <p className="text-sm text-gray-600">
                Personalized recipe recommendations
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-sm">✓</span>
              </div>
              <p className="text-sm text-gray-600">
                Global vegetarian cuisine explorer
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-sm">✓</span>
              </div>
              <p className="text-sm text-gray-600">
                Find nearby vegetarian restaurants
              </p>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            🔒 Your data is secure and private • 100% Free to use
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
