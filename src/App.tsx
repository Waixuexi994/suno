import React, { useEffect } from 'react';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import Hero from './components/Hero';
import DemoStrip from './components/DemoStrip';
import MusicVideoStudio from './components/MusicVideoStudio';
import Features from './components/Features';
import Comparison from './components/Comparison';
import Testimonials from './components/Testimonials';
import Pricing from './components/Pricing';
import FAQ from './components/FAQ';
import Footer from './components/Footer';

function App() {
  useEffect(() => {
    // Smooth scrolling for anchor links
    const handleClick = (e: Event) => {
      const target = e.target as HTMLAnchorElement;
      if (target.href && target.href.includes('#')) {
        e.preventDefault();
        const id = target.href.split('#')[1];
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <div className="bg-white dark:bg-dark-900 text-gray-900 dark:text-white font-inter overflow-x-hidden transition-colors duration-300">
            <Header />
            <main>
              <Hero />
              <DemoStrip />
              <MusicVideoStudio />
              <Features />
              <Comparison />
              <Testimonials />
              <Pricing />
              <FAQ />
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;