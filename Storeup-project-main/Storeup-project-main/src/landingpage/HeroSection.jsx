import Lottie from "lottie-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Header from "../assets/animations/Header.json";

const HeroSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false }); // once: false عشان يتكرر مع كل Scroll

  return (
    <div id="hero" ref={ref} className="flex flex-col md:flex-row items-center justify-between px-10 py-20">
     
      {/* النصوص */}
      <motion.div 
        initial={{ x: 100, opacity: 0 }} 
        animate={isInView ? { x: 0, opacity: 1 } : { x: 100, opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-lg"
      >
        <h2 className="text-6xl font-bold text-[#004098]">Build Your Online Store in One Click</h2>
        <p className="text-gray-500 mt-4">
          Create your e-commerce website effortlessly with our powerful website builder. No coding skills required—simply input your business details, choose a template, and launch your online store in just one click.
        </p>
        <motion.button 
          whileHover={{ scale: 1.1 }} 
          whileTap={{ scale: 1.2 }}
          className="mt-6 bg-[#004098] text-white font-bold px-6 py-3 rounded-md shadow-md"
        >
          Get Started
        </motion.button>
      </motion.div>

      {/* الأنيميشن */}
      <motion.div 
        initial={{ x: -100, opacity: 0 }} 
        animate={isInView ? { x: 0, opacity: 1 } : { x: -100, opacity: 0 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
        className="w-1/2"
      >
        <Lottie className="w-3/4 ml-24" animationData={Header} loop={true} />
      </motion.div>
    </div>
  );
};

export default HeroSection;
