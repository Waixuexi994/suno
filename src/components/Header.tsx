import React, { useState, useEffect } from 'react';
import { Music, Menu, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import LanguageSelector from './LanguageSelector';
import ThemeToggle from './ThemeToggle';
import LoginModal from './LoginModal';
import UserMenu from './UserMenu';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { t } = useLanguage();
  const { isAuthenticated, login } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: t('nav.features'), href: '#features' },
    { name: t('nav.pricing'), href: '#pricing' },
    { name: t('nav.demos'), href: '#demos' },
  ];

  const handleLoginClick = () => {
    if (isAuthenticated) {
      // User is already logged in, do nothing (UserMenu will handle)
      return;
    } else {
      setIsLoginModalOpen(true);
    }
  };

  return (
    <>
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/80 dark:bg-dark-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-white/10' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-brand rounded-lg flex items-center justify-center">
                <Music className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">HarmonyAI</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                >
                  {link.name}
                </a>
              ))}
              <div className="flex items-center space-x-3">
                <ThemeToggle />
                <LanguageSelector />
                {isAuthenticated ? (
                  <UserMenu />
                ) : (
                  <>
                    <button
                      onClick={handleLoginClick}
                      className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                    >
                      {t('nav.login')}
                    </button>
                    <button 
                      onClick={() => setIsLoginModalOpen(true)}
                      className="bg-gradient-brand text-white px-6 py-2 rounded-full font-medium hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-200"
                    >
                      {t('nav.signup')}
                    </button>
                  </>
                )}
              </div>
            </nav>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-3">
              <ThemeToggle />
              <LanguageSelector />
              {isAuthenticated && <UserMenu />}
              <button
                className="text-gray-900 dark:text-white"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 bg-white dark:bg-dark-800 rounded-3xl mt-2 border border-gray-200 dark:border-white/10">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="block px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </a>
                ))}
                {!isAuthenticated && (
                  <>
                    <button
                      onClick={() => {
                        setIsLoginModalOpen(true);
                        setIsMobileMenuOpen(false);
                      }}
                      className="block w-full text-left px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                    >
                      {t('nav.login')}
                    </button>
                    <button 
                      onClick={() => {
                        setIsLoginModalOpen(true);
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full bg-gradient-brand text-white px-6 py-2 rounded-full font-medium mt-4"
                    >
                      {t('nav.signup')}
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Login Modal */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </>
  );
};

export default Header;