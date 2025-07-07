import { AnimatePresence } from "framer-motion";
import Navbar from "../landingpage/Navbar";
import HeroSection from "../landingpage/HeroSection";
import AboutSection from "../landingpage/AboutSection";
import ServicesSection from "../landingpage/ServicesSection";
import ContactUsSection from "../landingpage/ContactUsSection";
import Footer from "../landingpage/Footer";



const Home = () => {
  return (
    < >
    <div dir="ltr"
    >
    <Navbar />
      <AnimatePresence mode="wait">
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <ContactUsSection />
        <Footer/>
      </AnimatePresence>
    </div>
     
    </>
  );
};

export default Home;
