import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { FiUsers, FiFolder, FiHeart, FiStar } from "react-icons/fi";
import type { IconType } from "react-icons";

/* ------------------------------------------------------------------ */
/*  Animated Counter Hook                                              */
/* ------------------------------------------------------------------ */

function useCountUp(target: number, duration: number = 2000, start: boolean = false) {
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!start || hasAnimated.current) return;
    hasAnimated.current = true;

    const startTime = performance.now();

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out quad
      const eased = 1 - (1 - progress) * (1 - progress);
      setCount(Math.round(eased * target));

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    }

    requestAnimationFrame(tick);
  }, [start, target, duration]);

  return count;
}

/* ------------------------------------------------------------------ */
/*  Stat Card Component                                                */
/* ------------------------------------------------------------------ */

interface StatCardProps {
  icon: IconType;
  target: number;
  suffix: string;
  label: string;
  started: boolean;
}

function StatCard({ icon: Icon, target, suffix, label, started }: StatCardProps) {
  const count = useCountUp(target, 2000, started);

  return (
    <div className="glass-card rounded-2xl p-8 text-center">
      <Icon className="text-white text-3xl mb-4 mx-auto" />
      <p className="counter-number text-4xl md:text-5xl text-white font-bold">
        {count}
        {suffix}
      </p>
      <p className="text-white/70 text-sm mt-2">{label}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Stats Data                                                         */
/* ------------------------------------------------------------------ */

interface Stat {
  icon: IconType;
  target: number;
  suffix: string;
  label: string;
}

const stats: Stat[] = [
  { icon: FiUsers, target: 500, suffix: "+", label: "Students Trained" },
  { icon: FiFolder, target: 50, suffix: "+", label: "Projects Completed" },
  { icon: FiHeart, target: 95, suffix: "%", label: "Student Satisfaction" },
  { icon: FiStar, target: 20, suffix: "+", label: "Industry Mentors" },
];

/* ------------------------------------------------------------------ */
/*  Container Variants                                                 */
/* ------------------------------------------------------------------ */

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
};

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export default function Stats() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section id="why-techknots" className="hero-gradient py-20 md:py-28 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Why TechKnots?
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Numbers that speak louder than words — our track record of excellence.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          ref={ref}
          className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {stats.map((stat) => (
            <motion.div key={stat.label} variants={itemVariants}>
              <StatCard
                icon={stat.icon}
                target={stat.target}
                suffix={stat.suffix}
                label={stat.label}
                started={inView}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
