import React from "react";
import Banner from "../components/home/Banner";
import Navbar from "../components/home/Navbar";
import HeroSection from "../components/home/HeroSection";
import Features from "../components/home/Features";
import About from "../components/home/About";
import Footer from "../components/home/Footer";
import Testimonials from "../components/home/Testimonials";

const Home = () => {
  return (
    <div>
      <Banner />
      <Navbar />
      <HeroSection />
      <Features />
      <About />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Home;
