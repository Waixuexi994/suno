import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Pricing: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const { t } = useLanguage();

  const plans = [
    {
      name: t('pricing.free.name'),
      price: { monthly: 0, annual: 0 },
      description: t('pricing.free.desc'),
      features: [
        '500 free credits',
        'Up to 2-minute tracks',
        'Basic audio quality',
        'Personal use only',
        'Community support',
      ],
      cta: t('pricing.free.cta'),
      popular: false,
    },
    {
      name: t('pricing.creator.name'),
      price: { monthly: 19, annual: 15 },
      description: t('pricing.creator.desc'),
      features: [
        '5,000 credits/month',
        'Up to 8-minute tracks',
        'High-quality audio',
        'Stems export (WAV/FLAC)',
        'Commercial license',
        'Priority support',
        'API access',
      ],
      cta: t('pricing.creator.cta'),
      popular: true,
    },
    {
      name: t('pricing.studio.name'),
      price: { monthly: 59, annual: 47 },
      description: t('pricing.studio.desc'),
      features: [
        'Unlimited credits',
        'Unlimited track length',
        'Studio-quality audio',
        'Advanced stems control',
        'Team workspace (5 seats)',
        'Dedicated support',
        'Custom integrations',
        'Early access features',
      ],
      cta: t('pricing.studio.cta'),
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="py-20 bg-gray-50 dark:bg-dark-800/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            {t('pricing.title').split('Pricing').map((part, index) => (
              <React.Fragment key={index}>
                {part}
                {index === 0 && <span className="bg-gradient-brand bg-clip-text text-transparent">Pricing</span>}
              </React.Fragment>
            ))}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto mb-8">
            {t('pricing.subtitle')}
          </p>

          {/* Toggle */}
          <div className="flex items-center justify-center space-x-4">
            <span className={`${!isAnnual ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>{t('pricing.monthly')}</span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative inline-flex w-16 h-8 bg-gray-200 dark:bg-dark-700 rounded-full transition-colors duration-200 focus:outline-none"
            >
              <span
                className={`inline-block w-6 h-6 bg-gradient-brand rounded-full transform transition-transform duration-200 ${
                  isAnnual ? 'translate-x-9' : 'translate-x-1'
                } mt-1`}
              />
            </button>
            <span className={`${isAnnual ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
              {t('pricing.annual')}
              <span className="ml-2 text-xs bg-gradient-brand px-2 py-1 rounded-full text-white">{t('pricing.save')}</span>
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`relative bg-white dark:bg-dark-800/50 rounded-3xl p-8 backdrop-blur-sm border transition-all duration-300 hover:scale-105 animate-fade-up ${
                plan.popular
                  ? 'border-primary-500/50 shadow-lg shadow-primary-500/20'
                  : 'border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20'
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-brand px-4 py-2 rounded-full text-sm font-medium text-white">
                    {t('pricing.popular')}
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">
                    ${isAnnual ? plan.price.annual : plan.price.monthly}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 ml-2">/month</span>
                </div>
                <p className="text-gray-600 dark:text-gray-300">{plan.description}</p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-4 rounded-full font-semibold transition-all duration-300 ${
                  plan.popular
                    ? 'bg-gradient-brand text-white hover:shadow-lg hover:shadow-primary-500/25'
                    : 'border border-gray-300 dark:border-white/20 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-white/5'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;