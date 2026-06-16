import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FiCode, FiCpu, FiZap } from 'react-icons/fi';
import type { IconType } from 'react-icons';

interface ProgramCard {
  icon: IconType;
  title: string;
  description: string;
  duration: string;
  gradient: string;
}

const programs: ProgramCard[] = [
  {
    icon: FiCode,
    title: 'Full Stack With AI Internship',
    description:
      'Build end-to-end web applications integrated with AI to solve real-world problems.',
    duration: '2-4 Weeks',
    gradient: 'from-primary-500 to-accent-400',
  },
  {
    icon: FiCpu,
    title: 'IoT & Smart Automation Internship',
    description:
      'Work on smart devices, automation systems, and real-world hardware solutions.',
    duration: '2-4 Weeks',
    gradient: 'from-accent-500 to-primary-300',
  },
  {
    icon: FiZap,
    title: 'Generative AI Internship',
    description:
      'Explore LLMs, Prompt Engineering and AI-powered applications.',
    duration: '2-4 Weeks',
    gradient: 'from-primary-700 to-accent-500',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' as const },
  },
};

export default function Programs() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.15,
  });

  return (
    <section id="programs" className="section-gradient py-20 md:py-28">
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
            Our Internship Programs
          </h2>
          <p className="mt-4 text-lg text-dark-500">
            Choose your path and build the future with us
          </p>
        </motion.div>

        {/* Cards grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 gap-8 md:grid-cols-3"
        >
          {programs.map((program) => {
            const Icon = program.icon;

            return (
              <motion.div
                key={program.title}
                variants={cardVariants}
                className="card-tilt flex flex-col rounded-2xl bg-white p-8 shadow-lg"
              >
                {/* Gradient icon circle */}
                <div
                  className={`mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${program.gradient}`}
                >
                  <Icon className="h-7 w-7 text-white" />
                </div>

                {/* Title */}
                <h3 className="font-display text-xl font-bold text-dark-900">
                  {program.title}
                </h3>

                {/* Description */}
                <p className="mt-3 flex-1 leading-relaxed text-dark-700">
                  {program.description}
                </p>

                {/* Duration badge */}
                <div className="mt-5">
                  <span className="inline-block rounded-full bg-primary-50 px-4 py-1.5 text-sm font-medium text-primary-500">
                    {program.duration}
                  </span>
                </div>

                {/* Learn More link */}
                <a
                  href="#register"
                  className="mt-6 inline-flex items-center text-sm font-semibold text-primary-500 transition-colors hover:text-primary-700"
                >
                  Learn More&nbsp;&rarr;
                </a>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
