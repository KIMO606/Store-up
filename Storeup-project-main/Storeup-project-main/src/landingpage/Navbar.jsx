import { Link } from "react-scroll"; // رجّع react-scroll
import { useNavigate } from "react-router-dom"; // عشان زرار اللوجين يشتغل
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import logo from "../assets/animations/logo.json";

const Navbar = () => {
  const navigate = useNavigate(); // عشان نستخدمه في زرار اللوجين

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }} 
      animate={{ y: 0, opacity: 1 }} 
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex justify-between items-center p-4 shadow-md bg-white"
    >
      {/* اللوجو */}
      <h1 className="text-2xl font-bold text-[#004098] flex">
        <Lottie animationData={logo} className="w-10"/>
        StoreUP
      </h1>

      {/* اللينكات الداخلية */}
      <ul className="flex space-x-10">
  <li><Link to="hero" smooth={true} duration={500} className="text-xl font-bold text-[#004098] hover:text-blue-600 transition cursor-pointer">Home</Link></li>
  <li><Link to="about" smooth={true} duration={500} className="text-xl font-bold text-[#004098] hover:text-blue-600 transition cursor-pointer">About</Link></li>
  <li><Link to="services" smooth={true} duration={500} className="text-xl font-bold text-[#004098] hover:text-blue-600 transition cursor-pointer">Services</Link></li>
  <li><Link to="contact" smooth={true} duration={500} className="text-xl font-bold text-[#004098] hover:text-blue-600 transition cursor-pointer">Contact</Link></li>
</ul>


      {/* زرار تسجيل الدخول باستخدام react-router-dom */}
      <button 
        onClick={() => navigate("/login")} // استخدام useNavigate
        className="bg-[#004098] text-white font-bold px-6 py-3 rounded-md hover:bg-blue-700 transition duration-300"
      >
        Log IN
      </button>
    </motion.nav>
  );
};

export default Navbar;
