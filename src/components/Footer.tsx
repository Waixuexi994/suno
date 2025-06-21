import React from 'react';
import { Music, Twitter, Facebook, Instagram, Youtube, Mail } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Footer: React.FC = () => {
  const { t } = useLanguage();

  const quickLinks = [
    { name: t('nav.features'), href: '#features' },
    { name: t('nav.pricing'), href: '#pricing' },
    { name: t('nav.demos'), href: '#demos' },
    { name: 'API Docs', href: '#api' },
    { name: 'Blog', href: '#blog' },
    { name: 'Support', href: '#support' },
  ];

  const socialLinks = [
    { name: 'Twitter', icon: Twitter, href: '#' },
    { name: 'Facebook', icon: Facebook, href: '#' },
    { name: 'Instagram', icon: Instagram, href: '#' },
    { name: 'YouTube', icon: Youtube, href: '#' },
  ];

  return (
    <footer className="border-t border-gradient-to-r from-primary-500/20 via-secondary-500/20 to-primary-500/20 bg-white dark:bg-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Brand */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-brand rounded-lg flex items-center justify-center">
                <Music className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">HarmonyAI</span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {t('footer.description')}
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    className="w-10 h-10 bg-gray-100 dark:bg-dark-800/50 rounded-full flex items-center justify-center hover:bg-gradient-brand transition-all duration-200 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:text-white"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">{t('footer.links')}</h3>
            <div className="grid grid-cols-2 gap-4">
              {quickLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">{t('footer.newsletter')}</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {t('footer.newsletter.desc')}
            </p>
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="email"
                  placeholder={t('footer.newsletter.placeholder')}
                  className="w-full px-4 py-3 bg-gray-100 dark:bg-dark-800/50 border border-gray-200 dark:border-white/10 rounded-full text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/50 pr-12"
                />
                <button className="absolute right-1 top-1 bottom-1 px-4 bg-gradient-brand rounded-full hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-200">
                  <Mail className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-white/10 mt-16 pt-8 text-center text-gray-500 dark:text-gray-400">
          <p>{t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;