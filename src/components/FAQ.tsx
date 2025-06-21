import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { t } = useLanguage();

  const faqs = [
    {
      question: t('faq.q1.question'),
      answer: t('faq.q1.answer'),
    },
    {
      question: t('faq.q2.question'),
      answer: t('faq.q2.answer'),
    },
    {
      question: t('faq.q3.question'),
      answer: t('faq.q3.answer'),
    },
    {
      question: t('faq.q4.question'),
      answer: t('faq.q4.answer'),
    },
    {
      question: t('faq.q5.question'),
      answer: t('faq.q5.answer'),
    },
    {
      question: t('faq.q6.question'),
      answer: t('faq.q6.answer'),
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-white dark:bg-dark-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            {t('faq.title').split('Questions').map((part, index) => (
              <React.Fragment key={index}>
                {part}
                {index === 0 && <span className="bg-gradient-brand bg-clip-text text-transparent">Questions</span>}
              </React.Fragment>
            ))}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            {t('faq.subtitle')}
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-gray-50 dark:bg-dark-800/50 rounded-3xl backdrop-blur-sm border border-gray-200 dark:border-white/10 overflow-hidden animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-100 dark:hover:bg-white/5 transition-colors duration-200"
              >
                <h3 className="text-lg font-semibold pr-4 text-gray-900 dark:text-white">{faq.question}</h3>
                <ChevronDown
                  className={`w-5 h-5 text-gray-500 dark:text-gray-400 transform transition-transform duration-200 flex-shrink-0 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-8 pb-6 text-gray-600 dark:text-gray-300 leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;