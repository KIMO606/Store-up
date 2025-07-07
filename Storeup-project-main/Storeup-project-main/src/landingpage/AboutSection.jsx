import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Lottie from "lottie-react";
import mobilephoto from "../assets/images/mobilePhoto.png"
import websiteAnimation from "../assets/animations/website.json"; 
import dashboardAnimation from "../assets/animations/dashboard.json";

const AboutSection = () => {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.3 } // السيكشن لازم يكون ظاهر بنسبة 30% عشان يشتغل
    );

    if (ref.current) observer.observe(ref.current);

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  return (
    <div id="about" ref={ref} className="text-center py-20 px-10 overflow-hidden">
      <motion.h2 
        initial={{ opacity: 0 }} 
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1 }}
        className="text-8xl font-bold text-[#004098]"
      >
        Control Your Business
      </motion.h2>

      <motion.p 
        initial={{ opacity: 0 }} 
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1.5 }}
        className="text-gray-600 mt-4 max-w-2xl mx-auto"
      >
        Without any coding experience. Whether you're a small business owner or a growing brand, we make online selling simple, efficient, and hassle-free.
      </motion.p>

      <motion.button 
        initial={{ scale: 0.8, opacity: 0 }} 
        animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mt-6 bg-[#004098] text-white px-8 py-3 rounded-md shadow-md hover:bg-blue-700 transition-all"
      >
        Get Started
      </motion.button>

      <motion.div 
        initial={{ y: 50, opacity: 0 }} 
        animate={isInView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="flex justify-center"
      >
        <img src={mobilephoto} alt="Mockup" className="w-1/2" />
      </motion.div>

      {/* المميزات (Features) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-16 items-center bg-[#F7F7F7] w-full p-10 rounded-xl">
        {/* الكارت الأول */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }} 
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="bg-white shadow-xl px-6 h-1/2 rounded-xl mt-8 ml-4"
        >
          <h3 className="text-2xl mt-6 font-bold text-[#004098]">
            Instant Website Creation
          </h3>
          <p className="text-gray-600 mt-2">
            Build your online store in seconds.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: -50 }} 
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
          transition={{ duration: 0.8 }}
          className="flex justify-center"
        >
          <Lottie animationData={websiteAnimation} className="w-60 md:w-80" />
        </motion.div>

        {/* الكارت الثاني */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }} 
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
          transition={{ duration: 0.8 }}
          className="flex justify-center"
        >
          <Lottie animationData={dashboardAnimation} className="w-60 md:w-80" />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 50 }} 
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="bg-white shadow-xl p-6 h-1/2 rounded-xl"
        >
          <h3 className="text-2xl font-bold text-[#004098]">
            User-Friendly Dashboard
          </h3>
          <p className="text-gray-600 mt-2">
            Easily manage products, orders, and customers.
          </p>
        </motion.div>
        
      </div>
    </div>
  );
};

export default AboutSection;
