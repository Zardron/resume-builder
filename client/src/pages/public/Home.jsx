import { useState, useEffect } from 'react';
import { ChevronsUp } from 'lucide-react';
import Banner from '../../components/home/Banner';
import Navbar from '../../components/layout/Navbar';
import HeroSection from '../../components/home/HeroSection';
import Features from '../../components/home/Features';
import About from '../../components/home/About';
import Testimonials from '../../components/home/Testimonials';
import Footer from '../../components/layout/Footer';
import TemplateShowcase from '../../components/home/TemplateShowcase';
import Pricing from '../../components/home/Pricing';
import TestimonialForm from '../../components/home/TestimonialForm';
import { TestimonialsProvider } from '../../components/home/testimonials/TestimonialsContext';
import BackgroundEffects from '../../components/common/BackgroundEffects';
import SkipToContent from '../../components/common/SkipToContent';

const SCROLL_THRESHOLD = 250;

const Home = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > SCROLL_THRESHOLD;
      setIsScrolled(scrolled);
      if (scrolled && !hasScrolled) setHasScrolled(true);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasScrolled]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <SkipToContent />
      <BackgroundEffects />
      <Banner />
      <Navbar />
      <main id="main-content" tabIndex={-1}>
      <HeroSection />
      <Features />
      <TemplateShowcase />
      <About />
      <Pricing />
      <TestimonialsProvider>
        <Testimonials />
        <TestimonialForm />
      </TestimonialsProvider>
      </main>
      <Footer />

      {hasScrolled && (
        <button
          onClick={scrollToTop}
          className={`fixed bottom-8 right-6 p-2 border border-[var(--primary-color)] bg-white/90 hover:bg-white text-gray-900 rounded-md shadow-md transition-all duration-300 cursor-pointer ${
            isScrolled ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          aria-label="Scroll to top"
        >
          <ChevronsUp size={20} className="text-[var(--primary-color)]" />
        </button>
      )}
    </>
  );
};

export default Home;