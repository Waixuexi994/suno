import React from 'react';
import { Zap, Sliders, Shield, Users } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Features: React.FC = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: Zap,
      title: t('features.lightning.title'),
      description: t('features.lightning.desc'),
      image: 'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=600',
      reverse: false,
    },
    {
      icon: Sliders,
      title: t('features.remix.title'),
      description: t('features.remix.desc'),
      image: 'https://images.pexels.com/photos/164938/pexels-photo-164938.jpeg?auto=compress&cs=tinysrgb&w=600',
      reverse: true,
    },
    {
      icon: Shield,
      title: t('features.rights.title'),
      description: t('features.rights.desc'),
      image: 'https://images.pexels.com/photos/1376985/pexels-photo-1376985.jpeg?auto=compress&cs=tinysrgb&w=600',
      reverse: false,
    },
    {
      icon: Users,
      title: t('features.team.title'),
      description: t('features.team.desc'),
      image: 'https://images.pexels.com/photos/3184416/pexels-photo-3184416.jpeg?auto=compress&cs=tinysrgb&w=600',
      reverse: true,
    },
  ];

  return (
    <section id="features" className="py-20 bg-white dark:bg-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            {t('features.title').split('Features').map((part, index) => (
              <React.Fragment key={index}>
                {part}
                {index === 0 && <span className="bg-gradient-brand bg-clip-text text-transparent">Features</span>}
              </React.Fragment>
            ))}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
            {t('features.subtitle')}
          </p>
        </div>

        <div className="space-y-32">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className={`grid lg:grid-cols-2 gap-12 lg:gap-20 items-center ${
                  feature.reverse ? 'lg:grid-flow-col-dense' : ''
                }`}
              >
                {/* Content */}
                <div className={`space-y-8 animate-fade-up ${feature.reverse ? 'lg:col-start-2' : ''}`}>
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-brand rounded-full flex items-center justify-center">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{feature.title}</h3>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Image */}
                <div className={`animate-fade-up ${feature.reverse ? 'lg:col-start-1' : ''}`}>
                  <div className="relative">
                    <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:bg-gradient-card rounded-3xl overflow-hidden backdrop-blur-sm border border-gray-200 dark:border-white/10">
                      <img
                        src={feature.image}
                        alt={feature.title}
                        className="w-full h-full object-cover opacity-80"
                      />
                      <div className="absolute inset-0 bg-gradient-brand/10"></div>
                    </div>
                    <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-brand rounded-full opacity-10 blur-xl"></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;