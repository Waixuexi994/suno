import React, { useState } from 'react';
import { User, Settings, LogOut, ChevronDown, Music, CreditCard, HelpCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

const UserMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const { t } = useLanguage();

  if (!user) return null;

  const menuItems = [
    { icon: User, label: t('user.profile'), href: '#profile' },
    { icon: Music, label: t('user.my_music'), href: '#music' },
    { icon: CreditCard, label: t('user.billing'), href: '#billing' },
    { icon: Settings, label: t('user.settings'), href: '#settings' },
    { icon: HelpCircle, label: t('user.help'), href: '#help' },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 px-3 py-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors duration-200 border border-white/10"
      >
        <img
          src={user.picture}
          alt={user.name}
          className="w-8 h-8 rounded-full object-cover"
        />
        <span className="text-sm font-medium text-gray-900 dark:text-white hidden sm:block">
          {user.name}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-dark-800 rounded-2xl shadow-lg border border-gray-200 dark:border-white/10 overflow-hidden z-50">
          {/* User Info */}
          <div className="p-4 border-b border-gray-200 dark:border-white/10">
            <div className="flex items-center space-x-3">
              <img
                src={user.picture}
                alt={user.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <div className="font-semibold text-gray-900 dark:text-white">{user.name}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  className="flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </a>
              );
            })}
          </div>

          {/* Logout */}
          <div className="border-t border-gray-200 dark:border-white/10 py-2">
            <button
              onClick={() => {
                logout();
                setIsOpen(false);
              }}
              className="flex items-center space-x-3 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors duration-200 w-full text-left"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm font-medium">{t('user.logout')}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;