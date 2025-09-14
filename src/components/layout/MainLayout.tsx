import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, MapIcon, CameraIcon, BookOpenIcon, BeakerIcon } from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Home', href: '/', icon: HomeIcon },
  { name: 'Nearby', href: '/nearby', icon: MapIcon },
  { name: 'Scan', href: '/scan', icon: CameraIcon },
  { name: 'Countries', href: '/countries', icon: BookOpenIcon },
  { name: 'Cook', href: '/cook', icon: BeakerIcon },
];

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold text-green-600">IVC</span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`${
                        isActive
                          ? 'border-green-500 text-gray-900'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                    >
                      <item.icon className="h-5 w-5 mr-1" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          {children}
        </div>
      </main>

      {/* Mobile navigation */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="grid grid-cols-5">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`${
                  isActive ? 'text-green-600' : 'text-gray-500'
                } flex flex-col items-center pt-2 pb-2`}
              >
                <item.icon className="h-6 w-6" />
                <span className="text-xs mt-1">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
