import { motion } from 'framer-motion';
import { FiCode, FiCpu, FiZap, FiChevronDown } from 'react-icons/fi';

/* ---------- Particles ---------- */
const particles = Array.from({ length: 15 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  duration: `${8 + Math.random() * 17}s`,      // 8-25s
  delay: `${Math.random() * 10}s`,              // 0-10s
}));

/* ---------- Framer helpers ---------- */
const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

const fadeRight = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

/* ---------- Program cards data ---------- */
const programs = [
  {
    title: 'Full Stack with AI',
    Icon: FiCode,
    animClass: 'float-animation',
    style: { top: '8%', right: '5%' } as React.CSSProperties,
    delay: 0,
  },
  {
    title: 'IoT & Smart Automation',
    Icon: FiCpu,
    animClass: 'float-slow-animation',
    style: { top: '40%', right: '18%' } as React.CSSProperties,
    delay: 1,
  },
  {
    title: 'Generative AI',
    Icon: FiZap,
    animClass: 'float-animation',
    style: { bottom: '18%', right: '8%' } as React.CSSProperties,
    delay: 2,
  },
];

/* ======================================== */
/*               Hero Component             */
/* ======================================== */
const Hero = () => {
  const handleScroll = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden hero-gradient">
      {/* Tech grid overlay */}
      <div className="absolute inset-0 tech-grid pointer-events-none" />

      {/* Particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: p.left,
            bottom: '-10px',
            animationDuration: p.duration,
            animationDelay: p.delay,
          }}
        />
      ))}

      {/* Content wrapper */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-28 md:py-32 lg:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center min-h-screen lg:min-h-0 lg:h-auto">
          {/* ---- LEFT COLUMN: Text ---- */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-6 text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div variants={fadeUp} className="flex justify-center lg:justify-start">
              <span className="glass-card inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-white/90">
                <span className="text-base">🚀</span>
                Admissions Open 2026
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              variants={fadeUp}
              className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight"
            >
              Launch Your Tech Career with{' '}
              <span className="relative">
                Industry-Focused
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 300 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 8C60 2 180 2 298 8"
                    stroke="#4CAF50"
                    strokeWidth="3"
                    strokeLinecap="round"
                    className="opacity-60"
                  />
                </svg>
              </span>{' '}
              Internships
            </motion.h1>

            {/* Subheading */}
            <motion.p
              variants={fadeUp}
              className="font-display text-2xl md:text-3xl font-semibold bg-gradient-to-r from-accent-300 to-accent-400 bg-clip-text text-transparent"
            >
              Learn. Build. Get Hired.
            </motion.p>

            {/* Description */}
            <motion.p
              variants={fadeUp}
              className="text-base md:text-lg text-white/80 max-w-xl mx-auto lg:mx-0 leading-relaxed"
            >
              Join TechKnots' hands-on internship programs designed in
              collaboration with industry experts. Gain real-world project
              experience, mentorship from professionals, and a direct pathway to
              top tech companies.
            </motion.p>

            {/* Buttons */}
            <motion.div
              variants={fadeUp}
              className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start pt-2"
            >
              <button
                onClick={() => handleScroll('#register')}
                className="btn-shine w-full sm:w-auto px-8 py-4 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-primary-500 via-accent-500 to-accent-400 shadow-xl shadow-accent-500/20 hover:shadow-2xl hover:shadow-accent-500/30 hover:-translate-y-0.5 transition-all duration-300"
              >
                Apply Now
              </button>
              <button
                onClick={() => handleScroll('#programs')}
                className="glass-card w-full sm:w-auto px-8 py-4 rounded-xl text-base font-semibold text-white border border-white/20 hover:bg-white/15 transition-all duration-300"
              >
                View Programs
              </button>
            </motion.div>
          </motion.div>

          {/* ---- RIGHT COLUMN: Floating Cards ---- */}
          {/* Desktop version */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="hidden lg:block relative h-[520px]"
          >
            {/* Decorative blobs */}
            <div className="blob absolute w-72 h-72 bg-accent-400/20 blur-3xl top-10 right-0 pointer-events-none" />
            <div className="blob absolute w-56 h-56 bg-primary-300/15 blur-2xl bottom-20 right-24 pointer-events-none" style={{ animationDelay: '4s' }} />

            {/* Program cards */}
            {programs.map((prog) => (
              <motion.div
                key={prog.title}
                variants={fadeRight}
                className={`absolute glass-card rounded-2xl p-4 flex items-center gap-3 cursor-default select-none ${prog.animClass}`}
                style={{
                  ...prog.style,
                  animationDelay: `${prog.delay}s`,
                }}
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-accent-400/20 flex items-center justify-center">
                  <prog.Icon className="w-6 h-6 text-accent-300" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm whitespace-nowrap">
                    {prog.title}
                  </p>
                  <p className="text-white/50 text-xs mt-0.5">Internship Program</p>
                </div>
              </motion.div>
            ))}

            {/* Extra decorative elements */}
            <div className="absolute top-[62%] right-[52%] w-3 h-3 rounded-full bg-accent-400/40 float-animation" style={{ animationDelay: '3s' }} />
            <div className="absolute top-[25%] right-[45%] w-2 h-2 rounded-full bg-accent-300/50 float-slow-animation" style={{ animationDelay: '1s' }} />
            <div className="absolute bottom-[30%] right-[55%] w-4 h-4 rounded-full bg-primary-300/30 float-animation" style={{ animationDelay: '5s' }} />
          </motion.div>

          {/* Mobile simplified version */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="lg:hidden flex flex-col gap-3"
          >
            {programs.map((prog) => (
              <div
                key={prog.title}
                className="glass-card rounded-2xl p-4 flex items-center gap-3"
              >
                <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-accent-400/20 flex items-center justify-center">
                  <prog.Icon className="w-5 h-5 text-accent-300" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">
                    {prog.title}
                  </p>
                  <p className="text-white/50 text-xs mt-0.5">Internship Program</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll-down indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1"
      >
        <span className="text-white/50 text-xs font-medium tracking-widest uppercase">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
        >
          <FiChevronDown className="w-5 h-5 text-white/50" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
