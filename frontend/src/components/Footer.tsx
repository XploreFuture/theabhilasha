import { Link } from "react-router-dom";
import { Instagram, Facebook, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
  return (
<footer className="bg-gradient-to-br from-one from-40% via-three via-100%  text-white mt-10 bottom-0 left-0 w-full">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* About */}
        <div>
          <h2 className="text-xl font-bold mb-4">About The Abhilasha</h2>
          <p className="text-gray-300 text-sm">
           Celebrating voices, culture, and tradition through open-mic and community programs.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-xl font-bold mb-4">Quick Links</h2>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li><Link to="/" className="hover:text-white transition">Home</Link></li>
            <li><Link to="/events" className="hover:text-white transition">Events</Link></li>
            <li><Link to="/about" className="hover:text-white transition">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-white transition">Contact</Link></li>
             <li><Link to="/privacy-policy" className="hover:text-white transition">Privacy Policy</Link></li>
            <li><Link to="/our-team" className="hover:text-white transition">Our Team</Link></li>

          </ul>
        </div>

        {/* Contact */}
        <div>
          <h2 className="text-xl font-bold mb-4">Contact</h2>
          <p className="text-gray-300 text-sm">
            Email: <a href="mailto:info@xplorefuture.com" className="hover:text-white">abhilashaopenmic@gmail.com</a>
          </p>
          <p className="text-gray-300 text-sm mt-1">
            Phone: <a href="tel:+911234567890" className="hover:text-white">+91 7978398598</a>
          </p>
          <p className="text-gray-300 text-sm mt-1">
            Address: MadanMohan Colony , Kamanpur , Soro , Balasore , Odisha , India
          </p>
        </div>

        {/* Social Media */}
        <div>
          <h2 className="text-xl font-bold mb-4">Follow Us</h2>
          <div className="flex space-x-4">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500 transition">
              <Instagram size={24} />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition">
              <Facebook size={24} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition">
              <Twitter size={24} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-700 transition">
              <Linkedin size={24} />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-700 text-gray-400 text-sm py-4 text-center">
        &copy; {new Date().getFullYear()} TheAbhilasha. All rights reserved.
      </div>
    </footer>
  );
};

