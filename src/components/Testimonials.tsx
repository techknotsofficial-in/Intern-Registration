import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiMessageCircle } from 'react-icons/fi';
import { HiStar } from 'react-icons/hi2';
import { useInView } from 'react-intersection-observer';

interface Testimonial {
  name: string;
  role: string;
  quote: string;
  rating: number;
  color: string;
}

const testimonials: Testimonial[] = [
  {
    name: 'Arun Kumar',
    role: 'Full Stack Intern',
    quote:
      'TechKnots gave me the perfect launchpad for my career. The hands-on projects and mentorship were invaluable.',
    rating: 5,
    color: 'bg-primary-500',
  },
  {
    name: 'Priya Sharma',
    role: 'IoT Intern',
    quote:
      'Working with real hardware and smart automation systems was an incredible learning experience.',
    rating: 5,
    color: 'bg-accent-500',
  },
  {
    name: 'Rahul Verma',
    role: 'Gen AI Intern',
    quote:
      'The Generative AI internship opened my eyes to the possibilities of LLMs and prompt engineering.',
    rating: 5,
    color: 'bg-primary-700',
  },
  {
    name: 'Sneha Patel',
    role: 'Full Stack Intern',
    quote:
      'I landed my dream job thanks to the portfolio I built during the TechKnots internship.',
    rating: 5,
    color: 'bg-accent-400',
  },
  {
    name: 'Vikram Singh',
    role: 'IoT Intern',
    quote:
      'The industry mentors at TechKnots are amazing. They guided me through every step.',
    rating: 5,
    color: 'bg-primary-900',
  },
];

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const { ref: sectionRef, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const totalSlides = testimonials.length;

  const goToNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const goToPrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const goToSlide = useCallback(
    (index: number) => {
      setDirection(index > currentIndex ? 1 : -1);
      setCurrentIndex(index);
    },
    [currentIndex]
  );

  // Auto-rotate every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      goToNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [goToNext]);

  // Get visible testimonials for desktop (show 3 at a time)
  const getVisibleTestimonials = (): Testimonial[] => {
    const visible: Testimonial[] = [];
    for (let i = 0; i < 3; i++) {
      visible.push(testimonials[(currentIndex + i) % totalSlides]);
    }
    return visible;
  };

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -300 : 300,
      opacity: 0,
    }),
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' as const },
    },
  };

  return (
    <section id="testimonials" className="relative bg-white py-20 md:py-28 overflow-hidden">
      {/* Subtle decorative elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-primary-50 rounded-full blur-3xl opacity-40 -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-50 rounded-full blur-3xl opacity-30 translate-x-1/3 translate-y-1/3" />

      <div ref={sectionRef} className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary-50 text-primary-500 text-sm font-semibold tracking-wide uppercase mb-4">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold gradient-text mb-4">
            What Our Students Say
          </h2>
          <p className="text-dark-500 text-lg max-w-2xl mx-auto">
            Hear from our past interns about their transformative experiences at TechKnots.
          </p>
        </motion.div>

        {/* Mobile Slider (1 card at a time) */}
        <div className="block lg:hidden">
          <div className="relative min-h-[380px]">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                className="absolute inset-0 px-2"
              >
                <TestimonialCard testimonial={testimonials[currentIndex]} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Desktop Slider (3 cards at a time) */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="hidden lg:block"
        >
          <div className="relative">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.45, ease: 'easeInOut' }}
                className="grid grid-cols-3 gap-6"
              >
                {getVisibleTestimonials().map((testimonial, idx) => (
                  <motion.div key={`${testimonial.name}-${idx}`} variants={itemVariants}>
                    <TestimonialCard testimonial={testimonial} />
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-6 mt-10">
          {/* Left Arrow */}
          <button
            onClick={goToPrev}
            aria-label="Previous testimonial"
            className="w-11 h-11 rounded-full bg-white border border-dark-300/50 flex items-center justify-center text-dark-700 hover:bg-primary-50 hover:border-primary-300 hover:text-primary-500 transition-all duration-300 shadow-sm"
          >
            <FiChevronLeft className="w-5 h-5" />
          </button>

          {/* Dot Indicators */}
          <div className="flex items-center gap-2.5">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                aria-label={`Go to testimonial ${index + 1}`}
                className={`rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'w-8 h-3 bg-primary-500'
                    : 'w-3 h-3 bg-dark-300 hover:bg-primary-300'
                }`}
              />
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={goToNext}
            aria-label="Next testimonial"
            className="w-11 h-11 rounded-full bg-white border border-dark-300/50 flex items-center justify-center text-dark-700 hover:bg-primary-50 hover:border-primary-300 hover:text-primary-500 transition-all duration-300 shadow-sm"
          >
            <FiChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

/* Individual Testimonial Card */
const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => {
  return (
    <div className="glass-card-light rounded-2xl p-8 h-full flex flex-col justify-between transition-all duration-300 hover:shadow-lg">
      {/* Quote Icon */}
      <div className="mb-5">
        <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
          <FiMessageCircle className="w-5 h-5 text-primary-300" />
        </div>
      </div>

      {/* Quote Text */}
      <p className="text-dark-700 italic text-lg leading-relaxed mb-6 flex-1">
        &ldquo;{testimonial.quote}&rdquo;
      </p>

      {/* Star Rating */}
      <div className="flex items-center gap-1 mb-4">
        {Array.from({ length: testimonial.rating }).map((_, i) => (
          <HiStar key={i} className="w-5 h-5 text-accent-400" />
        ))}
      </div>

      {/* Author Info */}
      <div className="flex items-center gap-3">
        {/* Avatar with Initials */}
        <div
          className={`w-11 h-11 ${testimonial.color} rounded-full flex items-center justify-center text-white font-display font-semibold text-sm shadow-sm`}
        >
          {getInitials(testimonial.name)}
        </div>
        <div>
          <p className="font-display font-semibold text-dark-900">{testimonial.name}</p>
          <p className="text-primary-500 text-sm">{testimonial.role}</p>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
