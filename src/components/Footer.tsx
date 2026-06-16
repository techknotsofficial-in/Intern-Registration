import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { FiPhone, FiMail, FiGlobe } from "react-icons/fi";
import { SiInstagram, SiYoutube } from "react-icons/si";
import { FaLinkedinIn } from "react-icons/fa";

const footerLinks = {
  programs: [
    { label: "Full Stack with AI", href: "#programs" },
    { label: "IoT & Smart Automation", href: "#programs" },
    { label: "Generative AI", href: "#programs" },
  ],
  quickLinks: [
    { label: "About Us", href: "#about" },
    { label: "Benefits", href: "#benefits" },
    { label: "Testimonials", href: "#testimonials" },
    { label: "FAQ", href: "#faq" },
    { label: "Register", href: "#register" },
  ],
};

const socialLinks = [
  { icon: FaLinkedinIn, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: SiInstagram, href: "https://instagram.com", label: "Instagram" },
  { icon: SiYoutube, href: "https://youtube.com", label: "YouTube" },
];

const contactInfo = [
  { icon: FiPhone, text: "+91 91767 47268", href: "tel:+919176747268" },
  {
    icon: FiMail,
    text: "techknotsofficial@gmail.com",
    href: "mailto:techknotsofficial@gmail.com",
  },
  { icon: FiGlobe, text: "www.techknots.in", href: "https://www.techknots.in" },
];

const columnVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
};

const bottomBarVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { delay: 0.7, duration: 0.5 },
  },
};

export default function Footer() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <footer id="footer" ref={ref} className="bg-primary-900 relative overflow-hidden">
      {/* Subtle background texture */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(46,139,87,0.08),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(31,122,61,0.06),transparent_60%)]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        {/* Top Section - 4 Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Column 1 - Company */}
          <motion.div
            custom={0}
            variants={columnVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="sm:col-span-2 lg:col-span-1"
          >
            <a href="#" className="inline-block">
              <span className="font-display text-2xl font-bold text-white">
                Tech<span className="text-accent-400">Knots</span>
              </span>
            </a>
            <p className="text-white/50 italic mt-1 text-sm">
              One knot at a time
            </p>
            <p className="text-white/60 mt-4 text-sm leading-relaxed max-w-xs">
              Empowering the next generation of tech professionals through
              industry-focused internship programs.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3 mt-6">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-accent-400 transition duration-300"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Column 2 - Programs */}
          <motion.div
            custom={1}
            variants={columnVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
          >
            <h4 className="text-white font-semibold mb-4">Programs</h4>
            <ul className="space-y-0">
              {footerLinks.programs.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-white/60 hover:text-accent-400 transition duration-300 block mb-2 text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 3 - Quick Links */}
          <motion.div
            custom={2}
            variants={columnVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
          >
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-0">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-white/60 hover:text-accent-400 transition duration-300 block mb-2 text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 4 - Contact */}
          <motion.div
            custom={3}
            variants={columnVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
          >
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-0">
              {contactInfo.map((item) => (
                <li key={item.text}>
                  <a
                    href={item.href}
                    className="flex items-center gap-3 text-white/60 mb-3 hover:text-accent-400 transition duration-300 text-sm group"
                  >
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-accent-400/20 transition duration-300">
                      <item.icon className="w-4 h-4" />
                    </span>
                    <span className="break-all sm:break-normal">
                      {item.text}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          variants={bottomBarVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="border-t border-white/10 mt-12"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between py-6 gap-4">
            <p className="text-white/40 text-sm text-center sm:text-left">
              © 2026 TechKnots. All rights reserved.
            </p>
            <div className="flex items-center gap-1 text-white/40 text-sm">
              <a
                href="#"
                className="hover:text-white/70 transition duration-300"
              >
                Privacy Policy
              </a>
              <span className="mx-1">|</span>
              <a
                href="#"
                className="hover:text-white/70 transition duration-300"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
