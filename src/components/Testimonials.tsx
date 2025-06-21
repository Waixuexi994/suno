import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Testimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { t } = useLanguage();

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Music Producer',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
      quote: 'HarmonyAI has revolutionized my workflow. I can create complex compositions in minutes that would take hours traditionally.',
      rating: 5,
    },
    {
      name: 'Marcus Johnson',
      role: 'Content Creator',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
      quote: 'The quality is incredible and the commercial licensing makes it perfect for my YouTube channel. Game changer!',
      rating: 5,
    },
    {
      name: 'Emma Rodriguez',
      role: 'Film Composer',
      avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150',
      quote: 'I use HarmonyAI for rapid prototyping of film scores. The stems export feature is exactly what I needed.',
      rating: 5,
    },
  ];

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    const interval = setInterval(nextTestimonial, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 bg-white dark:bg-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            {t('testimonials.title').split('Creators').map((part, index) => (
              <React.Fragment key={index}>
                {part}
                {index === 0 && <span className="bg-gradient-brand bg-clip-text text-transparent">Creators</span>}
              </React.Fragment>
            ))}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
            {t('testimonials.subtitle')}
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="w-full flex-shrink-0 px-4">
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:bg-gradient-card rounded-3xl p-8 sm:p-12 backdrop-blur-sm border border-gray-200 dark:border-white/10 text-center">
                    <div className="flex justify-center mb-6">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <blockquote className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                      "{testimonial.quote}"
                    </blockquote>
                    <div className="flex items-center justify-center space-x-4">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 dark:border-white/20"
                      />
                      <div className="text-left">
                        <div className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</div>
                        <div className="text-gray-500 dark:text-gray-400">{testimonial.role}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <button
            onClick={prevTestimonial}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 w-12 h-12 bg-white dark:bg-dark-800/80 rounded-full flex items-center justify-center hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors duration-200 backdrop-blur-sm border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextTestimonial}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 w-12 h-12 bg-white dark:bg-dark-800/80 rounded-full flex items-center justify-center hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors duration-200 backdrop-blur-sm border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Dots */}
          <div className="flex justify-center space-x-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                  index === currentIndex ? 'bg-gradient-brand' : 'bg-gray-300 dark:bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;