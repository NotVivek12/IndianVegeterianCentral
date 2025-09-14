import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPinIcon,
  CameraIcon,
  GlobeAsiaAustraliaIcon,
  BeakerIcon,
} from '@heroicons/react/24/outline';

const features = [
  {
    name: 'Find Veg-Friendly Restaurants Nearby',
    description: 'Discover vegetarian-friendly restaurants in your area with veg scores and safety ratings.',
    icon: MapPinIcon,
    route: '/nearby',
  },
  {
    name: 'Scan & Verify',
    description: 'Quickly scan product labels and menus to verify vegetarian status and ingredients.',
    icon: CameraIcon,
    route: '/scan',
  },
  {
    name: 'Country Guides',
    description: 'Access vegetarian guides for different countries with local dishes and helpful phrases.',
    icon: GlobeAsiaAustraliaIcon,
    route: '/countries',
  },
  {
    name: 'Cook What You Have',
    description: 'Get AI-powered vegetarian recipes based on ingredients you have available.',
    icon: BeakerIcon,
    route: '/cook',
  },
];

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            Indian Vegetarian{' '}
            <span className="text-green-600">Central</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Your trusted companion for finding, verifying, and cooking vegetarian food worldwide.
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-2">
            {features.map((feature) => (
              <div
                key={feature.name}
                className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-green-500 
                         rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer"
                onClick={() => navigate(feature.route)}
              >
                <div>
                  <span className="rounded-lg inline-flex p-3 bg-green-50 text-green-700 ring-4 ring-white">
                    <feature.icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                </div>
                <div className="mt-8">
                  <h3 className="text-lg font-medium">
                    <span className="absolute inset-0" aria-hidden="true" />
                    {feature.name}
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    {feature.description}
                  </p>
                </div>
                <span
                  className="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400"
                  aria-hidden="true"
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
                  </svg>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
