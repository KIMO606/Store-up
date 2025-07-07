import { useState } from "react";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import paymentAnimation from "../assets/animations/paymentIntegration.json";
import businessControlAnimation from "../assets/animations/payment.json";
import visaLogo from "../assets/images/visa.png";
import stripeLogo from "../assets/images/stripe-logo.png";
import applePayLogo from "../assets/images/applepay.png";
import paypalLogo from "../assets/images/paybal.png";

const faqData = [
  {
    question: "How does the website builder work?",
    answer: "Simply enter your business details, choose a template, and launch your e-commerce store instantly. No coding required.",
  },
  {
    question: "Do I need technical skills to use the platform?",
    answer: "No! Our platform is designed for everyone, even if you have no technical background.",
  },
  {
    question: "What payment methods are supported?",
    answer: "We support Visa, MasterCard, PayPal, Stripe, Apple Pay, Google Pay, and more.",
  },
];

const ServicesSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div id="services" className="py-20 px-10 text-center">
      <h2 className="text-5xl font-bold text-[#004098] mb-12">Our Services</h2>

      {/* Services Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="flex justify-center">
          <Lottie animationData={businessControlAnimation} className="w-60 md:w-80" />
        </div>
        <div className="bg-white p-6 shadow-lg rounded-xl h-1/2 text-left">
          <h3 className="text-2xl font-bold text-[#004098]">Control Your Business</h3>
          <p className="text-gray-600 mt-2">
            Take full control of your business with our all-in-one e-commerce platform.
          </p>
        </div>

        <div className="bg-white p-6 shadow-lg rounded-xl h-1/2 text-left">
          <h3 className="text-2xl font-bold text-[#004098]">Secure Payment Integration</h3>
          <p className="text-gray-600 mt-2">
            Accept payments with ease using our secure and reliable payment solutions.
          </p>
        </div>
        <div className="flex justify-center">
          <Lottie animationData={paymentAnimation} className="w-60 md:w-80" />
        </div>
      </div>

      {/* Payment Methods */}
      <div className="mt-20">
        <h2 className="text-4xl font-bold text-[#004098] mb-6">Payment Method 💳</h2>
        <div className="flex justify-center space-x-6">
          <img src={visaLogo} alt="Visa" className="h-10" />
          <img src={stripeLogo} alt="Stripe" className="h-10" />
          <img src={applePayLogo} alt="Apple Pay" className="h-10" />
          <img src={paypalLogo} alt="PayPal" className="h-10" />
        </div>
      </div>

      {/* Pricing Plans */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8" >
        {["Personal", "Professional", "Business"].map((plan, index) => (
          <div key={index} className="bg-white p-8 shadow-lg rounded-xl text-center">
            <h3 className="text-4xl font-bold text-[#004098]">{plan}</h3>
            <p className="text-2xl font-bold mt-2">
              ${plan === "Personal" ? "5" : plan === "Professional" ? "10" : "50"}
              <span className="text-lg">/month</span>
            </p>
            <ul className="text-gray-600 mt-4 space-y-2">
              <li>✔ {plan === "Business" ? "Unlimited" : index + 1} Projects</li>
              <li>✔ Analytics</li>
              <li>✔ Insights Panel</li>
              <li>✔ Share Features</li>
            </ul>
          </div>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="mt-20">
        <h2 className="text-5xl font-bold text-[#004098] mb-12">FAQ</h2>
        <div className="max-w-3xl mx-auto space-y-4">
          {faqData.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-gray-100 p-5 rounded-lg shadow-md cursor-pointer"
              onClick={() => toggleFAQ(index)}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-[#b81778]">{faq.question}</h3>
                <span className="text-gray-600">{openIndex === index ? "✖" : "➕"}</span>
              </div>
              {openIndex === index && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.3 }}
                  className="mt-3 text-gray-600"
                >
                  {faq.answer}
                </motion.p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServicesSection;
