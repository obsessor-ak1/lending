"use client";

import { useState } from "react";
import styles from "./page.module.css";

// ==========================================
// --- SVG Icons ---
// ==========================================
const ShieldCheckIcon = ({ className = "w-5 h-5", ...props }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M10 1.944A11.947 11.947 0 012.06 6.062a1.75 1.75 0 00-.56 1.057 11.606 11.606 0 005.155 9.54 1.75 1.75 0 001.69 0 11.606 11.606 0 005.155-9.54 1.75 1.75 0 00-.56-1.057A11.947 11.947 0 0110 1.944zm0 1.547a10.457 10.457 0 00-6.425 3.327c-.035.035-.05.086-.041.135a10.107 10.107 0 004.49 8.27.25.25 0 00.242 0 10.107 10.107 0 004.49-8.27.125.125 0 00-.041-.135A10.457 10.457 0 0010 3.491zM13.53 7.53a.75.75 0 00-1.06-1.06L9 9.38 7.53 7.91a.75.75 0 00-1.06 1.06l2 2a.75.75 0 001.06 0l4-4z" clipRule="evenodd" />
  </svg>
);

const ShieldCheckFillIcon = ({ className = "w-5 h-5", ...props }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M10.338 1.637a.75.75 0 00-.676 0 12.044 12.044 0 01-7.1 1.916.75.75 0 00-.762.627 12.044 12.044 0 009.689 12.186.75.75 0 00.373 0 12.044 12.044 0 009.689-12.186.75.75 0 00-.762-.627 12.044 12.044 0 01-7.1-1.916zM13.28 8.78a.75.75 0 00-1.06-1.06l-3.22 3.22-1.22-1.22a.75.75 0 00-1.06 1.06l1.75 1.75a.75.75 0 001.06 0l3.75-3.75z" clipRule="evenodd" />
  </svg>
);

const ArrowRightIcon = ({ className = "w-5 h-5", ...props }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.97H3.75A.75.75 0 013 10z" clipRule="evenodd" />
  </svg>
);

const RobotIcon = ({ className = "w-5 h-5", ...props }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M15.75 3v1.5M3 9.75V10.5m18-3v1.2M3 20.25h18M3 13.5h18M6.75 6.75h10.5a1.5 1.5 0 011.5 1.5v9a1.5 1.5 0 01-1.5 1.5H6.75A1.5 1.5 0 015.25 17.25v-9a1.5 1.5 0 011.5-1.5z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 10.5h.008v.008H9.75V10.5zm4.5 0h.008v.008h-.008V10.5z" />
  </svg>
);

const ChevronRightIcon = ({ className = "w-5 h-5", ...props }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
  </svg>
);

const PeopleIcon = ({ className = "w-5 h-5", ...props }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
  </svg>
);

const SendIcon = ({ className = "w-5 h-5", ...props }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086l-1.414 4.926a.75.75 0 00.826.95 28.896 28.896 0 0015.293-7.154.75.75 0 000-1.115A28.897 28.897 0 003.105 2.289z" />
  </svg>
);

const MenuIcon = ({ className = "w-6 h-6", ...props }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
);

const CloseIcon = ({ className = "w-6 h-6", ...props }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

// ==========================================
// --- Navbar Component ---
// ==========================================
function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className={`${styles.navbar} fixed top-0 left-0 right-0 z-50`} aria-label="Main Navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <a className={styles.navbarBrand} href="#home" aria-label="BorrowBee Home Page">
            <div className={styles.brandBee} role="img" aria-label="Bee Logo">🐝</div>
            <span className={styles.brandName}>
              Borrow<span>Bee</span>
            </span>
          </a>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMobileMenuOpen ? <CloseIcon aria-hidden="true" /> : <MenuIcon aria-hidden="true" />}
          </button>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center mx-auto gap-1" role="navigation" aria-label="Desktop Navigation Links">
            <a className={styles.navLink} href="#how-it-works">How it works</a>
            <a className={styles.navLink} href="#features">Features</a>
            <a className={styles.navLink} href="#about">About us</a>
            <a className={styles.navLink} href="#contact">Contact</a>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex items-center gap-2">
            <a href="/auth?mode=login" className={styles.btnLogin} aria-label="Log into your BorrowBee account">Log in</a>
            <a href="/auth?mode=signup" className={styles.btnSignup} aria-label="Sign up for a BorrowBee account">Sign up</a>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div
          id="mobile-menu"
          role="navigation"
          aria-label="Mobile Dropdown Menu"
          className="lg:hidden px-4 pt-2 pb-4 bg-white border-t border-gray-100 flex flex-col gap-3 shadow-md"
        >
          <a
            className={`${styles.navLink} block py-2`}
            href="#how-it-works"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            How it works
          </a>
          <a
            className={`${styles.navLink} block py-2`}
            href="#features"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Features
          </a>
          <a
            className={`${styles.navLink} block py-2`}
            href="#about"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            About us
          </a>
          <a
            className={`${styles.navLink} block py-2`}
            href="#contact"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Contact
          </a>
          <hr className="border-gray-100" aria-hidden="true" />
          <div className="flex flex-col gap-2 pt-2">
            <a href="/auth?mode=login" className={`${styles.btnLogin} text-center py-2 block`} aria-label="Log in">Log in</a>
            <a href="/auth?mode=signup" className={`${styles.btnSignup} text-center py-2 block`} aria-label="Sign up">Sign up</a>
          </div>
        </div>
      )}
    </nav>
  );
}

// ==========================================
// --- Hero Component ---
// ==========================================
function Hero() {
  return (
    <section className={`${styles.hero} pt-28 lg:pt-36 pb-20`} id="home" aria-label="Hero Section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Content */}
          <div className="lg:col-span-7 text-left">
            <div className={styles.heroTag} role="status">
              <ShieldCheckFillIcon className="w-4 h-4 text-[#C8841A]" aria-hidden="true" />
              Trusted P2P Finance Platform
            </div>
            <h1>
              A trusted marketplace for <span className={styles.accent}>lending & borrowing</span>
            </h1>
            <p className={`${styles.lead} mb-8`}>
              BorrowBee connects borrowers and lenders directly — with AI-powered application analysis,
              transparent processes, and real-time status tracking.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="/auth?mode=signup" className={styles.btnPrimaryBee} aria-label="Get started with BorrowBee">
                Get started <ArrowRightIcon className="w-4 h-4" aria-hidden="true" />
              </a>
              <a href="#how-it-works" className={styles.btnOutlineBee} aria-label="See how BorrowBee works">
                See how it works
              </a>
            </div>
          </div>

          {/* Right Stat Widget */}
          <div className="hidden lg:block lg:col-span-5 text-center">
            <div
              className="bg-white rounded-3xl p-6 text-left inline-block w-80 shadow-lg border border-[#F5A623]/20"
              style={{ minWidth: "320px" }}
              aria-label="Platform Statistics Dashboard"
              role="region"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" aria-hidden="true"></div>
                <span className="text-[10px] font-bold tracking-wider text-[#6B5E45] uppercase">
                  PLATFORM ACTIVITY
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="rounded-xl p-3 bg-[#FEF6E4]">
                  <div className="text-2xl font-extrabold text-[#16120A]" aria-label="Over 18 thousand active users">18K+</div>
                  <div className="text-[11px] text-[#6B5E45] font-semibold" aria-hidden="true">Active Users</div>
                </div>
                <div className="rounded-xl p-3 bg-[#FEF6E4]">
                  <div className="text-2xl font-extrabold text-[#16120A]" aria-label="Average platform rating of 4.8 stars">4.8★</div>
                  <div className="text-[11px] text-[#6B5E45] font-semibold" aria-hidden="true">Avg. Rating</div>
                </div>
              </div>

              <div className="rounded-xl p-3 bg-green-50 border border-green-200">
                <div className="flex items-center gap-2.5">
                  <RobotIcon className="w-5 h-5 text-green-600" aria-hidden="true" />
                  <div>
                    <div className="text-xs font-bold text-green-800">AI Analysis Active</div>
                    <div className="text-[10px] text-green-600 font-medium">
                      Processing loan applications
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ==========================================
// --- How It Works Component ---
// ==========================================
function HowItWorks() {
  return (
    <section className="py-20 bg-white" id="how-it-works" aria-label="How it works walkthrough">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className={styles.sectionLabel}>How it works</div>
          <h2 className={styles.sectionTitle}>From sign-up to funding in four steps</h2>
          <p className={styles.sectionSub}>
            BorrowBee makes borrowing simple and transparent. Here's how the process works from start to finish.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Step 1 */}
          <div className="relative">
            <div className={styles.stepCard}>
              <div className={styles.stepNum} aria-label="Step 1">1</div>
              <span className={`${styles.stepIconWrap} text-2xl mb-3 block`} role="img" aria-hidden="true">🔗</span>
              <h5>Connect to the platform</h5>
              <p>Create your BorrowBee account and securely verify your identity to get started on the marketplace.</p>
            </div>
            <div className={styles.connector}>
              <ChevronRightIcon className="w-5 h-5" aria-hidden="true" />
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative">
            <div className={styles.stepCard}>
              <div className={styles.stepNum} aria-label="Step 2">2</div>
              <span className={`${styles.stepIconWrap} text-2xl mb-3 block`} role="img" aria-hidden="true">👤</span>
              <h5>Build your profile</h5>
              <p>Fill in your financial profile. This helps lenders understand your needs and helps us match you accurately.</p>
            </div>
            <div className={styles.connector}>
              <ChevronRightIcon className="w-5 h-5" aria-hidden="true" />
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative">
            <div className={styles.stepCard}>
              <div className={styles.stepNum} aria-label="Step 3">3</div>
              <span className={`${styles.stepIconWrap} text-2xl mb-3 block`} role="img" aria-hidden="true">🤝</span>
              <h5>Choose a lender</h5>
              <p>Browse verified lenders on the marketplace and select one whose terms best match your borrowing needs.</p>
            </div>
            <div className={styles.connector}>
              <ChevronRightIcon className="w-5 h-5" aria-hidden="true" />
            </div>
          </div>

          {/* Step 4 */}
          <div>
            <div className={styles.stepCard}>
              <div className={styles.stepNum} aria-label="Step 4">4</div>
              <span className={`${styles.stepIconWrap} text-2xl mb-3 block`} role="img" aria-hidden="true">📬</span>
              <h5>Apply & await approval</h5>
              <p>Submit your loan application and track its status in real time while our AI assists in the review process.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ==========================================
// --- Features Component ---
// ==========================================
function Features() {
  return (
    <section className={`${styles.featuresSection} py-20`} id="features" aria-label="Platform Features Section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className={styles.sectionLabel}>Platform features</div>
          <h2 className={styles.sectionTitle}>Built to give you full visibility and control</h2>
          <p className={styles.sectionSub}>
            Every tool you need to borrow or lend with confidence — all in one place.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Feature 1 */}
          <div className={styles.featureCard}>
            <div className={styles.featureIcon} role="img" aria-hidden="true">👤</div>
            <h5>Credit Profile Management</h5>
            <p>Maintain a dynamic financial profile that grows with every interaction, helping lenders assess your credibility.</p>
          </div>

          {/* Feature 2 */}
          <div className={styles.featureCard}>
            <div className={styles.featureIcon} role="img" aria-hidden="true">🤖</div>
            <h5>AI-Powered Application Analysis</h5>
            <p>Our AI reviews your loan application and provides intelligent suggestions to improve your approval chances.</p>
          </div>

          {/* Feature 3 */}
          <div className={styles.featureCard}>
            <div className={styles.featureIcon} role="img" aria-hidden="true">📊</div>
            <h5>Application Status Tracking</h5>
            <p>Monitor your loan application at every stage — from submission through review to final decision — in real time.</p>
          </div>

          {/* Feature 4 */}
          <div className={styles.featureCard}>
            <div className={styles.featureIcon} role="img" aria-hidden="true">🔔</div>
            <h5>Repayment Deadline Reminders</h5>
            <p>Stay on top of your repayment schedule with timely notifications so you never miss a due date.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ==========================================
// --- About Component ---
// ==========================================
function About() {
  return (
    <section className={`${styles.aboutSection} py-20`} id="about" aria-label="About Us Section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Header */}
          <div className="lg:col-span-5 text-left">
            <div className={styles.sectionLabel}>About us</div>
            <h2 className={styles.sectionTitle}>We believe credit should be a conversation, not a barrier</h2>
          </div>

          {/* Right Copy */}
          <div className="lg:col-span-7">
            <p className="text-base text-[#6B5E45] leading-relaxed mb-6">
              BorrowBee was founded on a simple belief: that people should be able to borrow and lend money
              with trust, transparency, and fair terms — without the red tape of traditional banking. We built
              a marketplace where borrowers and lenders meet directly, and where technology does the heavy lifting.
            </p>
            <p className="text-base text-[#6B5E45] leading-relaxed mb-8">
              Our platform uses AI to guide applicants, maintain honest credit profiles, and keep every party
              informed throughout the loan lifecycle. We're a team of fintech builders, credit analysts, and
              product designers committed to making peer-to-peer lending simple, safe, and accessible for everyone.
            </p>
            <div className="flex flex-wrap gap-3">
              <span className={styles.aboutPill}>
                <ShieldCheckIcon className="w-4 h-4 mr-1 inline-block text-[#C8841A]" aria-hidden="true" /> Secure & Verified
              </span>
              <span className={styles.aboutPill}>
                <PeopleIcon className="w-4 h-4 mr-1 inline-block text-[#C8841A]" aria-hidden="true" /> People-First Platform
              </span>
              <span className={styles.aboutPill}>
                <RobotIcon className="w-4 h-4 mr-1 inline-block text-[#C8841A]" aria-hidden="true" /> AI-Assisted Reviews
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ==========================================
// --- Contact Component ---
// ==========================================
function Contact() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  });

  const [formStatus, setFormStatus] = useState({
    submitting: false,
    success: false,
    error: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFormStatus({ submitting: true, success: false, error: "" });

    // Client-side validations
    if (!form.firstName.trim()) {
      setFormStatus({ submitting: false, success: false, error: "First name is required." });
      return;
    }
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) {
      setFormStatus({ submitting: false, success: false, error: "Please enter a valid email address." });
      return;
    }
    if (!form.subject) {
      setFormStatus({ submitting: false, success: false, error: "Please select a topic." });
      return;
    }
    if (form.message.trim().length < 10) {
      setFormStatus({ submitting: false, success: false, error: "Message should be at least 10 characters long." });
      return;
    }

    // Simulate sending message
    setTimeout(() => {
      setFormStatus({ submitting: false, success: true, error: "" });
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        subject: "",
        message: "",
      });
    }, 1200);
  };

  return (
    <section className="py-20 bg-white" id="contact" aria-label="Contact Section">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <div className={styles.sectionLabel}>Contact</div>
          <h2 className={styles.sectionTitle}>Get in touch</h2>
          <p className={styles.sectionSub}>
            Have a question or need help? Send us a message and we'll get back to you shortly.
          </p>
        </div>

        <div className={styles.contactCard}>
          <form onSubmit={handleFormSubmit} className="space-y-4" aria-label="BorrowBee Contact Form">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label htmlFor="firstName" className={styles.formLabel}>First name</label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  value={form.firstName}
                  onChange={handleInputChange}
                  className={`${styles.formControl} w-full`}
                  placeholder="Arjun"
                  aria-required="true"
                  aria-invalid={formStatus.error && !form.firstName.trim() ? "true" : "false"}
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="lastName" className={styles.formLabel}>Last name</label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={form.lastName}
                  onChange={handleInputChange}
                  className={`${styles.formControl} w-full`}
                  placeholder="Sharma"
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label htmlFor="email" className={styles.formLabel}>Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleInputChange}
                className={`${styles.formControl} w-full`}
                placeholder="arjun@email.com"
                aria-required="true"
                aria-invalid={formStatus.error && (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) ? "true" : "false"}
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="subject" className={styles.formLabel}>Subject</label>
              <select
                id="subject"
                name="subject"
                required
                value={form.subject}
                onChange={handleInputChange}
                className={`${styles.formSelect} w-full`}
                aria-required="true"
                aria-invalid={formStatus.error && !form.subject ? "true" : "false"}
              >
                <option value="" disabled>Select a topic</option>
                <option value="Loan Application Help">Loan Application Help</option>
                <option value="Account & Profile">Account & Profile</option>
                <option value="Technical Issue">Technical Issue</option>
                <option value="Partnerships">Partnerships</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label htmlFor="message" className={styles.formLabel}>Message</label>
              <textarea
                id="message"
                name="message"
                rows="4"
                required
                value={form.message}
                onChange={handleInputChange}
                className={`${styles.formControl} w-full`}
                placeholder="Write your message here..."
                aria-required="true"
                aria-invalid={formStatus.error && form.message.trim().length < 10 ? "true" : "false"}
              ></textarea>
            </div>

            {formStatus.error && (
              <div role="alert" aria-live="assertive" className="p-3 text-sm font-semibold text-red-800 bg-red-50 border border-red-200 rounded-lg">
                ⚠️ {formStatus.error}
              </div>
            )}

            {formStatus.success && (
              <div role="status" aria-live="polite" className="p-3 text-sm font-semibold text-green-800 bg-green-50 border border-green-200 rounded-lg">
                🎉 Thank you! Your message has been sent successfully. We will get back to you shortly.
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={formStatus.submitting}
                aria-busy={formStatus.submitting}
                className={`${styles.btnPrimaryBee} w-full justify-center py-3 font-semibold rounded-xl cursor-pointer disabled:opacity-50`}
              >
                {formStatus.submitting ? (
                  "Sending message..."
                ) : (
                  <>
                    Send message <SendIcon className="w-4 h-4 ml-1 inline-block" aria-hidden="true" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

// ==========================================
// --- Footer Component ---
// ==========================================
function Footer() {
  return (
    <footer className={styles.footer} aria-label="Site Footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className={styles.brandBee} style={{ width: "28px", height: "28px", fontSize: "14px", borderRadius: "7px" }} role="img" aria-label="Bee Logo">
              🐝
            </div>
            <span className="text-white font-bold text-sm">BorrowBee</span>
            <span className="text-xs text-gray-400">— A trusted marketplace for lending & borrowing</span>
          </div>
          <div className="flex gap-4" role="navigation" aria-label="Footer Quick Links">
            <a href="#how-it-works" className="hover:text-amber-500 transition-colors">How it works</a>
            <a href="#features" className="hover:text-amber-500 transition-colors">Features</a>
            <a href="#about" className="hover:text-amber-500 transition-colors">About</a>
            <a href="#contact" className="hover:text-amber-500 transition-colors">Contact</a>
          </div>
        </div>
        <hr className="border-gray-800 my-4" aria-hidden="true" />
        <div className="text-center text-[11px] text-gray-500">
          &copy; {new Date().getFullYear()} BorrowBee. All rights reserved.
          <span className="ml-1 text-[10px] text-gray-600 block sm:inline-block">Designed with Premium Aesthetics</span>
        </div>
      </div>
    </footer>
  );
}

// ==========================================
// --- Main Default Home Export ---
// ==========================================
export default function Home() {
  return (
    <div className={`${styles.honeyTheme} ${styles.bodyOverride} bg-white min-h-screen`}>
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <Features />
        <About />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
