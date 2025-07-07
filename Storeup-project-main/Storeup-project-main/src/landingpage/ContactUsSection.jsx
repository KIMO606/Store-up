import { useState } from "react";
import { motion } from "framer-motion";

const ContactUsSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let errors = {};
    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Invalid email format";
    }
    if (!formData.message.trim()) errors.message = "Message is required";
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});
      setSubmitted(true);
      console.log("Form Submitted:", formData);
      setTimeout(() => setSubmitted(false), 3000); // إخفاء رسالة النجاح بعد 3 ثواني
    }
  };

  return (
    <motion.div
      id="contact"
      className="py-20 px-10 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-5xl font-bold text-[#004098] mb-10">Contact Us</h2>

      <motion.form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto bg-white p-8 shadow-lg rounded-lg space-y-6"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {/* Name & Email Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-gray-700 text-left font-semibold">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
              className={`w-full px-4 py-3 mt-1 border rounded-lg bg-white ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              autoComplete="name"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>
          <div>
            <label htmlFor="email" className="block text-gray-700 text-left font-semibold">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className={`w-full px-4 py-3 mt-1 border rounded-lg  bg-white ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              autoComplete="email"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
        </div>

        {/* Message Field */}
        <div> 
          <label htmlFor="message" className="block text-gray-700 text-left font-semibold">Message</label>
          <textarea 
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Your message..."
            className={`w-full px-4 py-3 mt-1 border rounded-lg h-32 resize-none bg-white  ${
              errors.message ? "border-red-500" : "border-gray-300"
            }`}
            autoComplete="off"
          />
          {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-1/2 bg-[#004098] text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-all"
        >
          Send Message
        </button>

        {/* Success Message */}
        {submitted && (
          <motion.p
            className="text-green-600 font-semibold mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            ✅ Your message has been sent successfully!
          </motion.p>
        )}
      </motion.form>
    </motion.div>
  );
};

export default ContactUsSection;
