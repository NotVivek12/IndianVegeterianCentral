import { SignIn } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';

const Login = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome Back! 🌱
          </h1>
          <p className="text-lg text-gray-600">
            Sign in to continue your vegetarian journey
          </p>
        </div>

        {/* Clerk Sign In Component */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <SignIn 
            appearance={{
              elements: {
                formButtonPrimary: 
                  'bg-green-600 hover:bg-green-700 text-sm normal-case',
                card: 'shadow-none',
                // headerTitle: 'hidden',
                // headerSubtitle: 'hidden',
                socialButtonsBlockButton: 
                  'border-gray-300 hover:bg-gray-50',
                formFieldInput: 
                  'border-gray-300 focus:border-green-500 focus:ring-green-500',
                footerActionLink: 
                  'text-green-600 hover:text-green-700',
              },
            }}
            signUpUrl="/register"
            forceRedirectUrl="/"
            fallbackRedirectUrl="/"
            redirectUrl="/"
          />
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link 
              to="/register" 
              className="text-green-600 hover:text-green-700 font-medium"
            >
              Create one now
            </Link>
          </p>
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-white rounded-lg border border-gray-100">
            <div className="text-2xl mb-2">🔍</div>
            <p className="text-sm text-gray-600">Scan Products</p>
          </div>
          <div className="text-center p-4 bg-white rounded-lg border border-gray-100">
            <div className="text-2xl mb-2">👨‍🍳</div>
            <p className="text-sm text-gray-600">Get Recipes</p>
          </div>
          <div className="text-center p-4 bg-white rounded-lg border border-gray-100">
            <div className="text-2xl mb-2">🌍</div>
            <p className="text-sm text-gray-600">Explore Cuisines</p>
          </div>
          <div className="text-center p-4 bg-white rounded-lg border border-gray-100">
            <div className="text-2xl mb-2">📍</div>
            <p className="text-sm text-gray-600">Find Restaurants</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
