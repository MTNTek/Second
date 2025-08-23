'use client';

import React, { useState } from 'react';
import { Menu, X, User, LogOut, LayoutDashboard } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { AuthModal } from './AuthModal';

interface HeaderProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const Header: React.FC<HeaderProps> = ({ activeSection, setActiveSection }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalView, setAuthModalView] = useState<'login' | 'register'>('login');
  const { user, logout, isAuthenticated } = useAuth();

  const menuItems = [
    { id: 'home', label: 'Home' },
    { id: 'travel', label: 'Travel Services' },
    { id: 'visa', label: 'Visa Services' },
    { id: 'work-permits', label: 'Work Permits' },
    { id: 'uae-jobs', label: 'UAE Jobs' },
    { id: 'documents', label: 'Document Services' },
    { id: 'payments', label: 'Payments' },
    { id: 'about', label: 'About Us' },
    { id: 'contact', label: 'Contact' }
  ];

  const handleNavClick = (sectionId: string) => {
    setActiveSection(sectionId);
    setIsMenuOpen(false);
  };

  const handleAuthClick = (view: 'login' | 'register') => {
    setAuthModalView(view);
    setIsAuthModalOpen(true);
  };

  const handleLogout = () => {
    logout();
    setActiveSection('home');
  };

  return (
    <>
      <header className="bg-white shadow-lg sticky top-0 z-50 w-full">
        <nav className="w-full px-4 lg:px-8 py-4">
          <div className="flex justify-between items-center w-full">
            {/* Company Logo and Name */}
            <div className="flex items-center flex-shrink-0">
              <Image 
                src="/company_logo_transparent.png" 
                alt="Perry Eden Group Logo" 
                width={73}
                height={73}
                className="object-contain mr-1"
              />
              <div>
                <h1 className="text-2xl font-bold text-navy-900 leading-tight">Perry Eden Group</h1>
                <p className="text-sm text-gray-600 font-medium">Global Services Partner</p>
              </div>
            </div>

            {/* Desktop menu */}
            <div className="hidden lg:flex items-center space-x-4 xl:space-x-6 flex-1 justify-center">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`text-sm font-medium transition-colors duration-200 whitespace-nowrap px-2 py-1 ${
                    activeSection === item.id
                      ? 'text-yellow-600 border-b-2 border-yellow-600 pb-1'
                      : 'text-gray-700 hover:text-yellow-600'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
              
            {/* Authentication buttons - Right side */}
            <div className="hidden lg:flex items-center space-x-4 flex-shrink-0">
              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <User size={20} className="text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
                      Welcome, {user?.name?.split(' ')[0]}
                    </span>
                  </div>
                  <Link
                    href="/dashboard"
                    className="flex items-center space-x-1 text-sm font-medium text-gray-600 hover:text-yellow-600 transition-colors"
                  >
                    <LayoutDashboard size={16} />
                    <span>Dashboard</span>
                  </Link>
                  {user?.role === 'admin' && (
                    <Link
                      href="/admin"
                      className="flex items-center space-x-1 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors bg-blue-50 px-2 py-1 rounded"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>Admin</span>
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 text-sm font-medium text-gray-600 hover:text-red-600 transition-colors"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleAuthClick('login')}
                    className="text-sm font-medium text-gray-700 hover:text-yellow-600 transition-colors"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => handleAuthClick('register')}
                    className="bg-yellow-500 text-navy-900 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-yellow-400 transition-colors"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile menu */}
          {isMenuOpen && (
            <div className="lg:hidden mt-4 pb-4 border-t pt-4">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`block w-full text-left py-2 font-medium transition-colors duration-200 ${
                    activeSection === item.id
                      ? 'text-yellow-600'
                      : 'text-gray-700 hover:text-yellow-600'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              
              {/* Mobile authentication */}
              <div className="border-t pt-4 mt-4">
                {isAuthenticated ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 py-2">
                      <User size={20} className="text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">
                        Welcome, {user?.name?.split(' ')[0]}
                      </span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 w-full text-left py-2 text-sm font-medium text-red-600 hover:text-red-700"
                    >
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <button
                      onClick={() => handleAuthClick('login')}
                      className="block w-full text-left py-2 text-sm font-medium text-gray-700 hover:text-yellow-600"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => handleAuthClick('register')}
                      className="block w-full text-left py-2 text-sm font-medium text-yellow-600 hover:text-yellow-700"
                    >
                      Sign Up
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultView={authModalView}
      />
    </>
  );
};

export default Header;