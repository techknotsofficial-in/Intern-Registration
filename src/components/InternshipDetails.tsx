import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { FiClock, FiMonitor, FiUsers, FiAward, FiFolder } from "react-icons/fi";
import type { IconType } from "react-icons";

interface Detail {
  icon: IconType;
  label: string;
  value: string;
}

const details: Detail[] = [
  { icon: FiClock, label: "Duration", value: "2–4 Weeks" },
  { icon: FiMonitor, label: "Mode", value: "Online / Offline / Hybrid" },
  { icon: FiUsers, label: "Mentorship", value: "Industry Experts" },
  { icon: FiAward, label: "Certificate", value: "Yes" },
  { icon: FiFolder, label: "Projects", value: "Real Industry Projects" },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.12,
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  }),
};

export default function InternshipDetails() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 });

  return (
    <section id="details" className="section-gradient py-20 md:py-28 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold gradient-text mb-4">
            Internship Details
          </h2>
          <p className="text-dark-700 text-lg max-w-2xl mx-auto">
            Everything you need to know about our internship program at a glance.
          </p>
        </motion.div>

        {/* Details Grid */}
        <div
          ref={ref}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 md:gap-6"
        >
          {details.map((detail, i) => {
            const Icon = detail.icon;
            return (
              <motion.div
                key={detail.label}
                className="card-tilt bg-white rounded-2xl p-6 shadow-md text-center flex flex-col items-center"
                variants={cardVariants}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                custom={i}
              >
                {/* Gradient Icon Circle */}
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-accent-400 text-white flex items-center justify-center mx-auto mb-4">
                  <Icon className="text-2xl" />
                </div>

                {/* Label */}
                <span className="text-dark-500 text-sm font-medium uppercase tracking-wider mb-1">
                  {detail.label}
                </span>

                {/* Value */}
                <span className="text-dark-900 font-display font-bold text-xl leading-tight">
                  {detail.value}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
