import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  FiTarget,
  FiLayers,
  FiUsers,
  FiAward,
  FiFileText,
  FiBriefcase,
} from 'react-icons/fi';
import type { IconType } from 'react-icons';

interface Benefit {
  icon: IconType;
  title: string;
  description: string;
}

const benefits: Benefit[] = [
  {
    icon: FiTarget,
    title: 'Practical Exposure',
    description: 'Hands-on experience with cutting-edge technologies',
  },
  {
    icon: FiLayers,
    title: 'Real World Projects',
    description: 'Work on actual industry projects, not just theory',
  },
  {
    icon: FiUsers,
    title: 'Expert Mentorship',
    description: 'Learn from experienced industry professionals',
  },
  {
    icon: FiAward,
    title: 'Certificate of Completion',
    description: 'Get certified and showcase your skills',
  },
  {
    icon: FiFileText,
    title: 'Resume Building',
    description: 'Build a portfolio that stands out',
  },
  {
    icon: FiBriefcase,
    title: 'Placement Guidance',
    description: 'Get career guidance and placement support',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' as const },
  },
};

export default function Benefits() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.15,
  });

  return (
    <section id="benefits" className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
          ref={ref}
        >
          <h2 className="gradient-text font-display text-3xl font-bold md:text-4xl lg:text-5xl">
            What You Will Gain
          </h2>
        </motion.div>

        {/* Benefit cards grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:gap-8"
        >
          {benefits.map((benefit) => {
            const Icon = benefit.icon;

            return (
              <motion.div
                key={benefit.title}
                variants={cardVariants}
                whileHover={{ scale: 1.05, boxShadow: '0 20px 50px rgba(0,0,0,0.12)' }}
                className="glass-card-light flex flex-col items-center rounded-2xl p-6 text-center transition-shadow"
              >
                {/* Icon circle */}
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary-50">
                  <Icon className="h-6 w-6 text-primary-500" />
                </div>

                {/* Title */}
                <h3 className="font-semibold text-lg text-dark-900">
                  {benefit.title}
                </h3>

                {/* Description */}
                <p className="mt-2 text-sm leading-relaxed text-dark-500">
                  {benefit.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
