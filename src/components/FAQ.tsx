import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiMinus } from 'react-icons/fi';
import { useInView } from 'react-intersection-observer';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: 'What is the duration of the internship?',
    answer:
      'Our internships run for 2-4 weeks, depending on the program and your learning pace.',
  },
  {
    question: 'Will I receive a certificate?',
    answer:
      'Yes, all participants receive a Certificate of Completion upon successfully finishing the internship.',
  },
  {
    question: 'Is the internship available online?',
    answer:
      'Yes, we offer Online, Offline, and Hybrid modes. You can choose the one that suits you best.',
  },
  {
    question: 'Are real projects included?',
    answer:
      'Absolutely! You will work on real industry projects that you can add to your portfolio.',
  },
  {
    question: 'Do you provide placement support?',
    answer:
      'Yes, we provide placement guidance, resume building assistance, and connect you with our industry partners.',
  },
  {
    question: 'What are the prerequisites?',
    answer:
      'Basic programming knowledge is helpful but not mandatory. We provide foundational training as part of the program.',
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { ref: sectionRef, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const toggleFAQ = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' as const },
    },
  };

  return (
    <section id="faq" className="relative section-gradient py-20 md:py-28 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 right-0 w-64 h-64 bg-primary-100 rounded-full blur-3xl opacity-20" />
      <div className="absolute bottom-20 left-0 w-80 h-80 bg-accent-300 rounded-full blur-3xl opacity-10" />

      <div ref={sectionRef} className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary-50 text-primary-500 text-sm font-semibold tracking-wide uppercase mb-4">
            FAQ
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold gradient-text mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-dark-500 text-lg max-w-xl mx-auto">
            Got questions? We&rsquo;ve got answers. Find everything you need to know about our internship programs.
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="space-y-4"
        >
          {faqData.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <motion.div
                key={index}
                variants={itemVariants}
                layout
                className={`bg-white rounded-xl overflow-hidden transition-shadow duration-300 ${
                  isOpen
                    ? 'shadow-lg shadow-primary-500/10 ring-1 ring-primary-200'
                    : 'shadow-sm hover:shadow-md'
                }`}
              >
                {/* Question */}
                <button
                  onClick={() => toggleFAQ(index)}
                  className={`w-full p-6 flex justify-between items-center cursor-pointer text-left transition-colors duration-200 ${
                    isOpen ? 'bg-primary-50/50' : 'hover:bg-gray-50'
                  }`}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                >
                  <span
                    className={`font-display font-semibold text-base sm:text-lg pr-4 transition-colors duration-200 ${
                      isOpen ? 'text-primary-700' : 'text-dark-900'
                    }`}
                  >
                    {faq.question}
                  </span>

                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-200 ${
                      isOpen
                        ? 'bg-primary-500 text-white'
                        : 'bg-primary-50 text-primary-500'
                    }`}
                  >
                    {isOpen ? (
                      <FiMinus className="w-4 h-4" />
                    ) : (
                      <FiPlus className="w-4 h-4" />
                    )}
                  </motion.span>
                </button>

                {/* Answer */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-answer-${index}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-0">
                        <p className="text-dark-500 leading-relaxed">{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="text-center mt-12"
        >
          <p className="text-dark-500">
            Still have questions?{' '}
            <a
              href="#footer"
              className="text-primary-500 font-semibold hover:text-primary-700 transition-colors duration-200 underline underline-offset-4 decoration-primary-300"
            >
              Get in touch
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
