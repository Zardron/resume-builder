import React, { useState, useEffect } from "react";
import Banner from "../components/home/Banner";
import Navbar from "../components/Navbar";
import HeroSection from "../components/home/HeroSection";
import Features from "../components/home/Features";
import About from "../components/home/About";
import Footer from "../components/Footer";
import Testimonials from "../components/home/Testimonials";
import { ChevronsUp } from "lucide-react";

const Home = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  const [isScrolled, setIsScrolled] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 250;
      setIsScrolled(scrolled);
      if (scrolled) {
        setHasScrolled(true);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <div>
      <Banner />
      <Navbar />
      <HeroSection />
      <Features />
      <About />
      <Testimonials />
      <Footer />

      {hasScrolled && (
        <div
          className={`fixed bottom-8 right-6 animate__animated ${
            isScrolled ? "animate__fadeInUp" : "animate__fadeOutDown"
          } animate__faster`}
        >
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 p-2 border-[var(--primary-color)] border z-10 bg-white/90 hover:bg-white text-gray-900 rounded-md shadow-md font-medium cursor-pointer"
          >
            <ChevronsUp size={20} className="text-[var(--primary-color)]" />
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;