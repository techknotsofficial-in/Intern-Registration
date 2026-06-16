import { useState, useEffect, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FiUser, FiMail, FiPhone, FiBook, FiLayers, FiCalendar, FiMonitor, FiMessageSquare, FiCheck, FiChevronDown, FiCreditCard, FiAward } from 'react-icons/fi';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  college: string;
  department: string;
  year: string;
  program: string;
  mode: string;
  message: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  college?: string;
  department?: string;
  year?: string;
  program?: string;
  mode?: string;
}

interface PaymentSuccess {
  registrationNumber: string;
  program: string;
  mode: string;
  amount: number;
  paymentId: string;
}

const feeMap: Record<string, number> = {
  Online: 1500,
  Hybrid: 2000,
  Offline: 2500,
};

const programOptions = [
  'Full Stack with AI',
  'IoT & Smart Automation',
  'Generative AI',
];

const modeOptions = ['Online', 'Hybrid', 'Offline'];

const yearOptions = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Passed Out'];

const RegistrationForm = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    college: '',
    department: '',
    year: '',
    program: '',
    mode: '',
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [paymentSuccess, setPaymentSuccess] = useState<PaymentSuccess | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Load Razorpay script dynamically
  useEffect(() => {
    const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const regex = /^\d{10}$/;
    return regex.test(phone);
  };

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Phone number must be 10 digits';
    }
    if (!formData.college.trim()) newErrors.college = 'College name is required';
    if (!formData.department.trim()) newErrors.department = 'Department is required';
    if (!formData.year) newErrors.year = 'Please select your year';
    if (!formData.program) newErrors.program = 'Please select an internship program';
    if (!formData.mode) newErrors.mode = 'Please select a mode';

    return newErrors;
  };

  const isFormValid = (): boolean => {
    const validationErrors = validateForm();
    return Object.keys(validationErrors).length === 0;
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      const newErrors = { ...errors };
      // Re-validate the changed field
      if (field === 'fullName' && !value.trim()) newErrors.fullName = 'Full name is required';
      else if (field === 'fullName') delete newErrors.fullName;

      if (field === 'email' && !value.trim()) newErrors.email = 'Email is required';
      else if (field === 'email' && !validateEmail(value)) newErrors.email = 'Please enter a valid email address';
      else if (field === 'email') delete newErrors.email;

      if (field === 'phone' && !value.trim()) newErrors.phone = 'Phone number is required';
      else if (field === 'phone' && !validatePhone(value)) newErrors.phone = 'Phone number must be 10 digits';
      else if (field === 'phone') delete newErrors.phone;

      if (field === 'college' && !value.trim()) newErrors.college = 'College name is required';
      else if (field === 'college') delete newErrors.college;

      if (field === 'department' && !value.trim()) newErrors.department = 'Department is required';
      else if (field === 'department') delete newErrors.department;

      if (field === 'year' && !value) newErrors.year = 'Please select your year';
      else if (field === 'year') delete newErrors.year;

      if (field === 'program' && !value) newErrors.program = 'Please select an internship program';
      else if (field === 'program') delete newErrors.program;

      if (field === 'mode' && !value) newErrors.mode = 'Please select a mode';
      else if (field === 'mode') delete newErrors.mode;

      setErrors(newErrors);
    }
  };

  const handleBlur = (field: keyof FormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const validationErrors = validateForm();
    if (validationErrors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: validationErrors[field as keyof FormErrors] }));
    } else {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field as keyof FormErrors];
        return next;
      });
    }
  };

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

  const saveRegistration = async (paymentId: string, orderId: string, status: string) => {
    try {
      const res = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amountPaid: feeMap[formData.mode],
          razorpayPaymentId: paymentId,
          razorpayOrderId: orderId,
          razorpay_signature: status, // status is now passed as the signature
          studentData: {
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            college: formData.college,
            department: formData.department,
            year: formData.year,
            program: formData.program,
            mode: formData.mode,
            message: formData.message,
            amountPaid: feeMap[formData.mode] * 1.18 // Save total with GST
          }
        }),
      });
      const data = await res.json();
      if (data.success) {
        return data.registration;
      }
      return null;
    } catch (err) {
      console.error('Failed to save registration:', err);
      return null;
    }
  };

  const handlePayment = async (e: FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm();
    // Mark all as touched
    const allTouched: Record<string, boolean> = {};
    Object.keys(formData).forEach((key) => {
      allTouched[key] = true;
    });
    setTouched(allTouched);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsProcessing(true);

    const baseFee = feeMap[formData.mode];
    const gstAmount = Math.round(baseFee * 0.18);
    const totalAmount = baseFee + gstAmount;
    const amount = totalAmount * 100; // Convert to paise (total with GST)

    // Check if Razorpay is loaded
    if (typeof window.Razorpay !== 'undefined') {
      try {
        // 1. Create order on backend
        const orderRes = await fetch(`${API_URL}/create-order`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount }),
        });
        const orderData = await orderRes.json();

        if (!orderData.success) {
          throw new Error('Failed to create order');
        }

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
          amount: orderData.order.amount,
          currency: orderData.order.currency,
          name: 'TechKnots',
          description: `${formData.program} Internship - ${formData.mode} Mode`,
          order_id: orderData.order.id, // Secure order ID from backend
          prefill: {
            name: formData.fullName,
            email: formData.email,
            contact: formData.phone,
          },
          theme: {
            color: '#1F7A3D',
          },
          handler: async function (response: any) {
            // Save to backend after successful payment and verify signature
            const saved = await saveRegistration(
              response.razorpay_payment_id,
              response.razorpay_order_id,
              response.razorpay_signature
            );

            if (saved) {
              setPaymentSuccess({
                registrationNumber: saved.registrationNumber,
                program: formData.program,
                mode: formData.mode,
                amount: totalAmount,
                paymentId: response.razorpay_payment_id,
              });
            } else {
              alert('Payment verification failed or duplicate registration detected.');
            }
            setIsProcessing(false);
          },
          modal: {
            ondismiss: function () {
              setIsProcessing(false);
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } catch (err) {
        setIsProcessing(false);
        alert('Failed to initialize payment. Please try again.');
        console.error(err);
      }
    } else {
      // Razorpay not loaded — save as pending registration (for testing)
      const saved = await saveRegistration('', '', 'pending');
      if (saved) {
        const pendingBase = feeMap[formData.mode];
        const pendingGst = Math.round(pendingBase * 0.18);
        setPaymentSuccess({
          registrationNumber: saved.registrationNumber,
          program: formData.program,
          mode: formData.mode,
          amount: pendingBase + pendingGst,
          paymentId: 'PENDING — Razorpay not configured',
        });
      } else {
        alert('Failed to save registration. Please ensure the server is running.');
      }
      setIsProcessing(false);
    }
  };

  const handleCloseSuccess = () => {
    setPaymentSuccess(null);
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      college: '',
      department: '',
      year: '',
      program: '',
      mode: '',
      message: '',
    });
    setTouched({});
    setErrors({});
  };

  const fee = formData.mode ? feeMap[formData.mode] : null;
  const gst = fee !== null ? Math.round(fee * 0.18) : null;
  const totalFee = fee !== null && gst !== null ? fee + gst : null;

  const inputBaseClass =
    'w-full px-4 py-3 rounded-xl border border-dark-300/50 bg-white text-dark-900 transition-all duration-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 placeholder:text-dark-500/60';
  const inputErrorClass = 'border-red-500 focus:border-red-500 focus:ring-red-500/20';

  const renderInput = (
    field: keyof FormData,
    label: string,
    type: string,
    placeholder: string,
    icon: React.ReactNode,
    required = true
  ) => (
    <div className="mb-5">
      <label className="text-sm font-medium text-dark-700 mb-1.5 block">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-500/60 pointer-events-none">
          {icon}
        </div>
        <input
          type={type}
          value={formData[field]}
          onChange={(e) => handleChange(field, e.target.value)}
          onBlur={() => handleBlur(field)}
          placeholder={placeholder}
          className={`${inputBaseClass} pl-11 ${errors[field as keyof FormErrors] && touched[field] ? inputErrorClass : ''}`}
        />
      </div>
      {errors[field as keyof FormErrors] && touched[field] && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 text-xs mt-1.5 ml-1"
        >
          {errors[field as keyof FormErrors]}
        </motion.p>
      )}
    </div>
  );

  const renderSelect = (
    field: keyof FormData,
    label: string,
    options: string[],
    placeholder: string,
    icon: React.ReactNode
  ) => (
    <div className="mb-5">
      <label className="text-sm font-medium text-dark-700 mb-1.5 block">
        {label} <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-500/60 pointer-events-none">
          {icon}
        </div>
        <select
          value={formData[field]}
          onChange={(e) => handleChange(field, e.target.value)}
          onBlur={() => handleBlur(field)}
          className={`${inputBaseClass} pl-11 pr-10 appearance-none cursor-pointer ${
            !formData[field] ? 'text-dark-500/60' : ''
          } ${errors[field as keyof FormErrors] && touched[field] ? inputErrorClass : ''}`}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-500/60 pointer-events-none">
          <FiChevronDown size={18} />
        </div>
      </div>
      {errors[field as keyof FormErrors] && touched[field] && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 text-xs mt-1.5 ml-1"
        >
          {errors[field as keyof FormErrors]}
        </motion.p>
      )}
    </div>
  );

  return (
    <section id="register" className="relative bg-white py-20 md:py-28 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary-50 rounded-full opacity-40 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-accent-300/10 rounded-full opacity-40 blur-3xl" />
      </div>

      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="text-4xl md:text-5xl font-bold font-display gradient-text mb-4">
            Register Now
          </h2>
          <p className="text-lg text-dark-500 max-w-2xl mx-auto">
            Take the first step towards your tech career
          </p>
        </motion.div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start">
          {/* Form - Left Column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-3"
          >
            <form onSubmit={handlePayment} noValidate>
              <div className="glass-card-light rounded-2xl p-6 sm:p-8">
                <h3 className="text-xl font-semibold font-display text-dark-900 mb-6 flex items-center gap-2">
                  <FiUser className="text-primary-500" />
                  Personal Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5">
                  <div className="sm:col-span-2">
                    {renderInput('fullName', 'Full Name', 'text', 'Enter your full name', <FiUser size={18} />)}
                  </div>
                  {renderInput('email', 'Email', 'email', 'your@email.com', <FiMail size={18} />)}
                  {renderInput('phone', 'Phone Number', 'tel', '10-digit phone number', <FiPhone size={18} />)}
                  {renderInput('college', 'College', 'text', 'Your college name', <FiBook size={18} />)}
                  {renderInput('department', 'Department', 'text', 'e.g. Computer Science', <FiLayers size={18} />)}
                </div>

                <div className="w-full h-px bg-dark-300/30 my-6" />

                <h3 className="text-xl font-semibold font-display text-dark-900 mb-6 flex items-center gap-2">
                  <FiMonitor className="text-primary-500" />
                  Program Selection
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5">
                  {renderSelect('year', 'Year', yearOptions, 'Select your year', <FiCalendar size={18} />)}
                  {renderSelect('program', 'Internship Program', programOptions, 'Select a program', <FiLayers size={18} />)}
                  <div className="sm:col-span-2">
                    {renderSelect('mode', 'Mode', modeOptions, 'Select a mode', <FiMonitor size={18} />)}
                  </div>
                </div>

                <div className="mb-5">
                  <label className="text-sm font-medium text-dark-700 mb-1.5 block">
                    Message <span className="text-dark-500/60 text-xs">(Optional)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-4 text-dark-500/60 pointer-events-none">
                      <FiMessageSquare size={18} />
                    </div>
                    <textarea
                      value={formData.message}
                      onChange={(e) => handleChange('message', e.target.value)}
                      placeholder="Any additional message or queries..."
                      rows={4}
                      className={`${inputBaseClass} pl-11 resize-none`}
                    />
                  </div>
                </div>

                {/* Mobile-only submit button */}
                <div className="lg:hidden mt-6">
                  <button
                    type="submit"
                    disabled={!isFormValid() || isProcessing}
                    className={`razorpay-btn btn-shine w-full py-4 rounded-xl text-white font-semibold text-lg flex items-center justify-center gap-2 ${
                      !isFormValid() || isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <FiCreditCard size={20} />
                    {isProcessing ? 'Processing...' : 'Proceed to Payment'}
                  </button>
                </div>
              </div>
            </form>
          </motion.div>

          {/* Fee Breakdown Card - Right Column */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-2"
          >
            <div className="sticky top-24">
              <div className="glass-card-light rounded-2xl p-8">
                <h3 className="text-xl font-semibold font-display text-dark-900 mb-6 flex items-center gap-2">
                  <FiCreditCard className="text-primary-500" />
                  Fee Breakdown
                </h3>

                {/* Selected Program */}
                <div className="mb-4">
                  <p className="text-sm text-dark-500 mb-1">Selected Program</p>
                  <p className="text-dark-900 font-medium">
                    {formData.program || (
                      <span className="text-dark-500/60 italic">Select a program</span>
                    )}
                  </p>
                </div>

                {/* Selected Mode */}
                <div className="mb-6">
                  <p className="text-sm text-dark-500 mb-1">Selected Mode</p>
                  <p className="text-dark-900 font-medium">
                    {formData.mode || (
                      <span className="text-dark-500/60 italic">Select a mode</span>
                    )}
                  </p>
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-dark-300/30 mb-6" />

                {/* Registration Fee */}
                <div className="mb-8">
                  <p className="text-sm text-dark-500 mb-2">Registration Fee</p>
                  {fee !== null && gst !== null && totalFee !== null ? (
                    <motion.div
                      key={totalFee}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <span className="text-4xl font-bold font-display gradient-text">
                        ₹{fee.toLocaleString('en-IN')}
                      </span>

                      <div className="mt-3 space-y-1.5 text-sm">
                        <div className="flex justify-between text-dark-500">
                          <span>Base Fee</span>
                          <span>₹{fee.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between text-dark-500">
                          <span>GST (18%)</span>
                          <span>₹{gst.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="w-full h-px bg-dark-300/30 my-1" />
                        <div className="flex justify-between font-semibold text-dark-900">
                          <span>Total Payable</span>
                          <span className="text-primary-500 font-bold">₹{totalFee.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <p className="text-dark-500/60 italic text-sm">Select mode to see fee</p>
                  )}
                </div>

                {/* Fee tiers info */}
                <div className="bg-primary-50/50 rounded-xl p-4 mb-6">
                  <p className="text-xs font-medium text-dark-700 mb-2">Fee by Mode:</p>
                  <div className="space-y-1.5">
                    {Object.entries(feeMap).map(([mode, price]) => (
                      <div
                        key={mode}
                        className={`flex justify-between text-sm ${
                          formData.mode === mode ? 'text-primary-500 font-semibold' : 'text-dark-500'
                        }`}
                      >
                        <span>{mode}</span>
                        <span>₹{price.toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment Button - Desktop */}
                <button
                  type="button"
                  onClick={handlePayment}
                  disabled={!isFormValid() || isProcessing}
                  className={`razorpay-btn btn-shine w-full py-4 rounded-xl text-white font-semibold text-lg items-center justify-center gap-2 hidden lg:flex ${
                    !isFormValid() || isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <FiCreditCard size={20} />
                  {isProcessing ? 'Processing...' : 'Proceed to Payment'}
                </button>

                {/* Security note */}
                <p className="text-xs text-dark-500/60 text-center mt-4 flex items-center justify-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Secured by Razorpay
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {paymentSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={handleCloseSuccess}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white rounded-3xl p-8 sm:p-10 max-w-md w-full shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Success checkmark */}
              <div className="flex justify-center mb-6">
                <div className="success-check w-20 h-20 rounded-full bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/30">
                  <FiCheck className="text-white" size={40} strokeWidth={3} />
                </div>
              </div>

              <h3 className="text-2xl font-bold font-display text-center text-dark-900 mb-2">
                Registration Successful!
              </h3>
              <p className="text-dark-500 text-center mb-8 text-sm">
                Your registration has been confirmed. Here are your details:
              </p>

              {/* Details */}
              <div className="space-y-3 mb-8">
                <div className="flex justify-between items-center py-3 px-4 bg-primary-50/60 rounded-xl">
                  <span className="text-sm text-dark-500">Registration No.</span>
                  <span className="font-semibold font-display text-primary-700">
                    {paymentSuccess.registrationNumber}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 px-4 bg-gray-50 rounded-xl">
                  <span className="text-sm text-dark-500">Internship Program</span>
                  <span className="font-medium text-dark-900 text-sm text-right max-w-[180px]">
                    {paymentSuccess.program}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 px-4 bg-gray-50 rounded-xl">
                  <span className="text-sm text-dark-500">Mode</span>
                  <span className="font-medium text-dark-900">{paymentSuccess.mode}</span>
                </div>
                <div className="flex justify-between items-center py-3 px-4 bg-gray-50 rounded-xl">
                  <span className="text-sm text-dark-500">Amount Paid</span>
                  <span className="font-semibold text-dark-900">
                    ₹{paymentSuccess.amount.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 px-4 bg-gray-50 rounded-xl">
                  <span className="text-sm text-dark-500">Payment ID</span>
                  <span className="font-mono text-xs text-dark-700">
                    {paymentSuccess.paymentId}
                  </span>
                </div>
              </div>

              {/* Confirmation icon */}
              <div className="flex items-center gap-2 text-sm text-primary-600 bg-primary-50/60 rounded-xl py-3 px-4 mb-6">
                <FiAward size={18} />
                <span>A confirmation email has been sent to your inbox.</span>
              </div>

              {/* Done button */}
              <button
                onClick={handleCloseSuccess}
                className="razorpay-btn btn-shine w-full py-4 rounded-xl text-white font-semibold text-lg"
              >
                Done
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default RegistrationForm;
