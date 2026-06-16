import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiShield } from 'react-icons/fi';

const navLinks = [
  { label: 'Programs', href: '#programs' },
  { label: 'Benefits', href: '#benefits' },
  { label: 'Why TechKnots', href: '#why-techknots' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Register', href: '#register' },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check admin status from URL param or localStorage
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === 'true') {
      localStorage.setItem('techknots_admin', 'true');
      setIsAdmin(true);
    } else if (params.get('admin') === 'false') {
      localStorage.removeItem('techknots_admin');
      setIsAdmin(false);
    } else {
      setIsAdmin(localStorage.getItem('techknots_admin') === 'true');
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 nav-blur transition-all duration-300 ${
          scrolled
            ? 'bg-white/80 shadow-lg shadow-primary-900/5 border-b border-white/40'
            : 'bg-white/0'
        }`}
        style={scrolled ? { backdropFilter: 'blur(24px) saturate(180%)', WebkitBackdropFilter: 'blur(24px) saturate(180%)' } : {}}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <a
              href="#"
              className="flex items-center gap-1 group"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <span className="font-display text-2xl md:text-[1.65rem] font-bold tracking-tight">
                <span
                  className={`transition-colors duration-300 ${
                    scrolled ? 'text-dark-900' : 'text-white'
                  }`}
                >
                  Tech
                </span>
                <span className="text-accent-400">Knots</span>
              </span>
              <span className="w-2 h-2 rounded-full bg-accent-400 mb-3 group-hover:scale-125 transition-transform" />
            </a>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-primary-500/10 ${
                    scrolled
                      ? 'text-dark-700 hover:text-primary-700'
                      : 'text-white/85 hover:text-white'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-3">
              {isAdmin && (
                <a
                  href="http://localhost:3001/admin"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2.5 rounded-xl transition-all duration-200 ${
                    scrolled
                      ? 'text-primary-500 hover:bg-primary-50'
                      : 'text-white/80 hover:bg-white/10'
                  }`}
                  title="Admin Panel"
                >
                  <FiShield size={20} />
                </a>
              )}
              <a
                href="#register"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('#register');
                }}
                className="btn-shine px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-primary-500 via-accent-500 to-accent-400 hover:shadow-lg hover:shadow-accent-500/25 hover:-translate-y-0.5 transition-all duration-300"
              >
                Apply Now
              </a>
            </div>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`lg:hidden p-2 rounded-xl transition-colors duration-200 ${
                scrolled
                  ? 'text-dark-900 hover:bg-primary-50'
                  : 'text-white hover:bg-white/10'
              }`}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-dark-900/60 backdrop-blur-sm lg:hidden"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-[85vw] max-w-sm bg-white shadow-2xl lg:hidden"
            >
              <div className="flex flex-col h-full">
                {/* Drawer Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                  <span className="font-display text-xl font-bold tracking-tight">
                    <span className="text-dark-900">Tech</span>
                    <span className="text-accent-400">Knots</span>
                  </span>
                  <button
                    onClick={() => setMobileOpen(false)}
                    className="p-2 rounded-xl text-dark-700 hover:bg-gray-100 transition-colors"
                    aria-label="Close menu"
                  >
                    <FiX size={22} />
                  </button>
                </div>

                {/* Drawer Links */}
                <div className="flex-1 overflow-y-auto px-4 py-6">
                  <div className="flex flex-col gap-1">
                    {navLinks.map((link, index) => (
                      <motion.button
                        key={link.href}
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 + index * 0.06, duration: 0.3 }}
                        onClick={() => handleNavClick(link.href)}
                        className="w-full text-left px-4 py-3.5 rounded-xl text-base font-medium text-dark-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                      >
                        {link.label}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Drawer Footer CTA */}
                <div className="p-6 border-t border-gray-100 space-y-3">
                  {isAdmin && (
                    <a
                      href="http://localhost:3001/admin"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-xl text-sm font-medium text-primary-700 bg-primary-50 hover:bg-primary-100 transition-colors"
                    >
                      <FiShield size={16} />
                      Admin Panel
                    </a>
                  )}
                  <motion.a
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35, duration: 0.3 }}
                    href="#register"
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick('#register');
                    }}
                    className="btn-shine flex items-center justify-center w-full px-6 py-3.5 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-primary-500 via-accent-500 to-accent-400 shadow-lg shadow-accent-500/20"
                  >
                    Apply Now
                  </motion.a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
