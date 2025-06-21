import React from 'react';
import { Check, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Comparison: React.FC = () => {
  const { t } = useLanguage();

  const competitors = [
    { name: 'HarmonyAI', highlight: true },
    { name: 'Suno', highlight: false },
    { name: 'Udio', highlight: false },
    { name: 'MusicFlow', highlight: false },
  ];

  const features = [
    {
      name: t('comparison.credits'),
      values: ['500 credits', '200 credits', '100 credits', '50 credits'],
    },
    {
      name: t('comparison.length'),
      values: ['8 minutes', '4 minutes', '3 minutes', '2 minutes'],
    },
    {
      name: t('comparison.stems'),
      values: [true, false, true, false],
    },
    {
      name: t('comparison.api'),
      values: [true, false, false, true],
    },
    {
      name: t('comparison.license'),
      values: [true, true, false, true],
    },
  ];

  return (
    <section className="py-20 bg-gray-50 dark:bg-dark-800/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            {t('comparison.title').split('HarmonyAI').map((part, index) => (
              <React.Fragment key={index}>
                {part}
                {index === 0 && <span className="bg-gradient-brand bg-clip-text text-transparent">HarmonyAI</span>}
              </React.Fragment>
            ))}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
            {t('comparison.subtitle')}
          </p>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-full bg-white dark:bg-dark-800/50 rounded-3xl backdrop-blur-sm border border-gray-200 dark:border-white/10 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-white/10">
                  <th className="text-left p-6 font-semibold text-gray-900 dark:text-white">{t('comparison.features')}</th>
                  {competitors.map((competitor) => (
                    <th
                      key={competitor.name}
                      className={`text-center p-6 font-semibold ${
                        competitor.highlight
                          ? 'bg-gradient-brand text-white'
                          : 'text-gray-600 dark:text-gray-300'
                      }`}
                    >
                      {competitor.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {features.map((feature, index) => (
                  <tr
                    key={feature.name}
                    className="border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors duration-200"
                  >
                    <td className="p-6 font-medium text-gray-900 dark:text-white">{feature.name}</td>
                    {feature.values.map((value, valueIndex) => (
                      <td
                        key={valueIndex}
                        className={`text-center p-6 ${
                          valueIndex === 0 ? 'bg-gradient-brand/10' : ''
                        }`}
                      >
                        {typeof value === 'boolean' ? (
                          value ? (
                            <Check className="w-6 h-6 text-green-400 mx-auto" />
                          ) : (
                            <X className="w-6 h-6 text-red-400 mx-auto" />
                          )
                        ) : (
                          <span
                            className={
                              valueIndex === 0
                                ? 'font-semibold text-gray-900 dark:text-white'
                                : 'text-gray-600 dark:text-gray-300'
                            }
                          >
                            {value}
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Comparison;