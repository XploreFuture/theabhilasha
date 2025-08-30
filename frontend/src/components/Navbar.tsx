import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { isAuthenticated, decodeAccessToken, logout } from "../utils/auth";

interface DecodedUser {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
}

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isHome, setIsHome] = useState(location.pathname === "/");
  const [loggedInUser, setLoggedInUser] = useState<DecodedUser | null>(null);

  useEffect(() => {
    setIsHome(location.pathname === "/");
  }, [location.pathname]);

  const checkAuthStatus = () => {
    if (isAuthenticated()) {
      const decoded = decodeAccessToken();
      if (decoded && typeof decoded.id === 'string' && typeof decoded.role === 'string') {
        setLoggedInUser(decoded as DecodedUser);
      } else {
        localStorage.removeItem('accessToken');
        setLoggedInUser(null);
      }
    } else {
      setLoggedInUser(null);
    }
  };

  useEffect(() => {
    checkAuthStatus();
    window.addEventListener('authStatusChange', checkAuthStatus);
    window.addEventListener('storage', checkAuthStatus);

    return () => {
      window.removeEventListener('authStatusChange', checkAuthStatus);
      window.removeEventListener('storage', checkAuthStatus);
    };
  }, []);

  const handleLogout = async () => {
    const loggedOut = await logout();
    if (loggedOut) {
      setIsOpen(false);
      navigate("/");
    }
  };

  const navLinkClass = (path: string) =>
    `block px-3 py-2 rounded-md text-base font-medium transition-colors ${
      location.pathname === path ? "text-blue-600 font-semibold" : "text-gray-700 hover:text-blue-600"
    }`;

  const desktopLinkClass = (path: string) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      location.pathname === path ? "text-blue-600 font-semibold" : "text-gray-700 hover:text-blue-600"
    }`;

  return (
    <nav
      className={`${
        isHome ? "absolute" : "sticky top-0"
      } left-0 w-full ${isHome ? "bg-transparent" : "bg-gradient-to-r from-one from-40% via-three via-100% shadow-md"} z-50 transition`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <img
              src="/Abhilashaa.png"
              alt="The Abhilasha Logo"
              className="h-16 w-16 object-contain drop-shadow-[0_0_8px_black]"
            />
            <span className={`text-xl font-bold select-none transition-colors duration-300 ${isHome ? "text-white" : "text-white"}`}>
              The Abhilasha
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className={desktopLinkClass("/")}>Home</Link>
            <Link to="/events" className={desktopLinkClass("/events")}>Events</Link>
            <Link to="/our-team" className={desktopLinkClass("/our-team")}>Our Team</Link>
            <Link to="/contact" className={desktopLinkClass("/contact")}>Contact Us</Link>

            {loggedInUser ? (
              <>
                <Link to="/profile" className={desktopLinkClass("/profile")}>Profile</Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md transition"
              >
                Login/Register
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden text-2xl ${isHome ? "text-white bg-transparent" : "text-white bg-transparent"}`}
            aria-label="Toggle menu"
          >
            {isOpen ? "×" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden bg-white overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96 opacity-100 py-4" : "max-h-0 opacity-0"
        }`}
      >
        <Link to="/" onClick={() => setIsOpen(false)} className={navLinkClass("/")}>Home</Link>
        <Link to="/events" onClick={() => setIsOpen(false)} className={navLinkClass("/events")}>Events</Link>
        <Link to="/our-team" onClick={() => setIsOpen(false)} className={navLinkClass("/our-team")}>Our Team</Link>
        <Link to="/contact" onClick={() => setIsOpen(false)} className={navLinkClass("/contact")}>Contact Us</Link>

        {loggedInUser ? (
          <>
            <Link to="/profile" onClick={() => setIsOpen(false)} className={navLinkClass("/profile")}>Profile</Link>
            <button
              onClick={handleLogout}
              className="w-full text-left bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md transition"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/login"
            onClick={() => setIsOpen(false)}
            className="block bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md transition"
          >
            Login/Register
          </Link>
        )}
      </div>
    </nav>
  );
}
