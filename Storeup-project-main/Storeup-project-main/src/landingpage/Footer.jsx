import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#004098] text-white py-10">
      <div className="container mx-auto px-6">
        {/* العنوان و الروابط */}
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left space-y-6 md:space-y-0">
          {/* اسم الموقع */}
          <h2 className="text-2xl font-bold">StoreUp</h2>

          {/* روابط التنقل */}
          <ul className="flex space-x-6">
            <li>
              <a href="#" className="hover:text-gray-400 transition">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-400 transition">
                About
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-400 transition">
                Contact
              </a>
            </li>
          </ul>

          {/* أيقونات التواصل الاجتماعي */}
          <div className="flex space-x-4">
            <a href="#" className="hover:text-gray-400 transition">
              <FaFacebookF size={20} />
            </a>
            <a href="#" className="hover:text-gray-400 transition">
              <FaTwitter size={20} />
            </a>
            <a href="#" className="hover:text-gray-400 transition">
              <FaInstagram size={20} />
            </a>
            <a href="#" className="hover:text-gray-400 transition">
              <FaLinkedinIn size={20} />
            </a>
          </div>
        </div>

        {/* حقوق النشر */}
        <div className="text-center mt-6 text-gray-400 text-sm">
          © {new Date().getFullYear()} StoreUp. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
