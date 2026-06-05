"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import styles from "./auth.module.css";

// ==========================================
// --- SVG Icons ---
// ==========================================
const ArrowRightIcon = ({ className = "w-4 h-4", ...props }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.97H3.75A.75.75 0 013 10z" clipRule="evenodd" />
  </svg>
);

const PersonIcon = ({ className = "inputIcon", ...props }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
  </svg>
);

const LockIcon = ({ className = "inputIcon", ...props }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
  </svg>
);

const LockFillIcon = ({ className = "inputIcon", ...props }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm1 9.5a1 1 0 10-2 0v3a1 1 0 102 0v-3z" clipRule="evenodd" />
  </svg>
);

const EnvelopeIcon = ({ className = "inputIcon", ...props }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
    <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
  </svg>
);

const PhoneIcon = ({ className = "inputIcon", ...props }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M2 3.5A1.5 1.5 0 013.5 2h1.148a1.5 1.5 0 011.465 1.175l.716 3.223a1.5 1.5 0 01-1.052 1.767l-.933.267c-.41.117-.643.555-.48 1.014.507 1.425 1.394 2.68 2.575 3.686.417.356.964.246 1.31-.102l.7-.7a1.5 1.5 0 012.112 0l2.25 2.25a1.5 1.5 0 010 2.112l-.7.7a1.5 1.5 0 01-1.12.448c-1.16-.017-2.316-.277-3.4-.766a13.987 13.987 0 01-4.707-4.103c-.878-1.25-1.408-2.67-1.56-4.148a1.5 1.5 0 01.448-1.12l.7-.7A1.5 1.5 0 012 3.5z" clipRule="evenodd" />
  </svg>
);

// ==========================================
// --- Login Panel Component ---
// ==========================================
function LoginPanel({ successMsg }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [status, setStatus] = useState({ submitting: false, error: "" });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setStatus({ submitting: true, error: "" });

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          email: form.email,
          password: form.password,
        }),
      });

      let data = {};
      const contentType = res.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        data = await res.json();
      }

      if (!res.ok) {
        throw new Error(data.message || "Invalid credentials.");
      }

      if (data.redirectTo) {
        window.location.href = data.redirectTo;
      }
    } catch (err) {
      setStatus({ submitting: false, error: err.message });
    }
  };

  return (
    <div>
      <div className={styles.authHeading}>Welcome back 🐝</div>
      <div className={styles.authSub}>Enter your credentials to access your account.</div>

      {successMsg && (
        <div role="status" aria-live="polite" className="p-3 text-xs font-semibold text-green-800 bg-green-50 border border-green-200 rounded-lg mb-4">
          🎉 {successMsg}
        </div>
      )}

      <form onSubmit={handleLoginSubmit} className="space-y-4" aria-label="BorrowBee Login Form">
        <div className={styles.fieldGroup}>
          <label htmlFor="login-identifier" className={styles.formLabel}>Email address</label>
          <div className={styles.inputWrap}>
            <PersonIcon className={styles.inputIcon} aria-hidden="true" />
            <input
              id="login-identifier"
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleInputChange}
              className={styles.formControl}
              placeholder="email@example.com"
              aria-required="true"
            />
          </div>
        </div>

        <div className={styles.fieldGroup}>
          <label htmlFor="login-pw-field" className={styles.formLabel}>Password</label>
          <div className={styles.inputWrap}>
            <LockIcon className={styles.inputIcon} aria-hidden="true" />
            <input
              id="login-pw-field"
              type="password"
              name="password"
              required
              value={form.password}
              onChange={handleInputChange}
              className={styles.formControl}
              placeholder="Enter your password"
              aria-required="true"
            />
          </div>
        </div>

        <div className="flex justify-end mb-2">
          <a href="#" className="text-xs font-semibold text-[#C8841A] hover:underline" aria-label="Forgot password link">
            Forgot password?
          </a>
        </div>

        {status.error && (
          <div role="alert" aria-live="assertive" className="p-3 text-xs font-semibold text-red-800 bg-red-50 border border-red-200 rounded-lg">
            ⚠️ {status.error}
          </div>
        )}

        <button
          type="submit"
          disabled={status.submitting}
          className={styles.btnSubmit}
        >
          {status.submitting ? "Logging in..." : <>Log in <ArrowRightIcon aria-hidden="true" /></>}
        </button>
      </form>
    </div>
  );
}

// ==========================================
// --- Signup Panel Component ---
// ==========================================
function SignupPanel() {
  const [form, setForm] = useState({
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [status, setStatus] = useState({ submitting: false, error: "" });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setStatus({ submitting: true, error: "" });

    // Client-side validations
    if (!form.email || !form.phone || !form.password || !form.confirmPassword) {
      setStatus({ submitting: false, error: "Missing required fields." });
      return;
    }

    if (form.password.length < 8) {
      setStatus({ submitting: false, error: "Password must be at least 8 characters long." });
      return;
    }

    if (form.password !== form.confirmPassword) {
      setStatus({ submitting: false, error: "Passwords do not match." });
      return;
    }

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          email: form.email,
          phone: form.phone,
          password: form.password,
        }),
      });

      let data = {};
      const contentType = res.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        data = await res.json();
      }

      if (!res.ok) {
        throw new Error(data.message || "Failed to create account.");
      }
      // Successful signup: redirect to redirectUrl or fallback
      window.location.href = `/auth?model=login&success=${encodeURIComponent(data.message)}`;
    } catch (err) {
      setStatus({ submitting: false, error: err.message });
    }
  };

  return (
    <div>
      <div className={styles.authHeading}>Create your account</div>
      <div className={styles.authSub}>Join BorrowBee — it only takes a minute.</div>

      <form onSubmit={handleSignupSubmit} className="space-y-4" aria-label="BorrowBee Registration Form">
        <div className={styles.fieldGroup}>
          <label htmlFor="signup-email" className={styles.formLabel}>Email address</label>
          <div className={styles.inputWrap}>
            <EnvelopeIcon className={styles.inputIcon} aria-hidden="true" />
            <input
              id="signup-email"
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleInputChange}
              className={styles.formControl}
              placeholder="email@example.com"
              aria-required="true"
            />
          </div>
        </div>

        <div className={styles.fieldGroup}>
          <label htmlFor="signup-phone" className={styles.formLabel}>Phone number</label>
          <div className={styles.inputWrap}>
            <PhoneIcon className={styles.inputIcon} aria-hidden="true" />
            <input
              id="signup-phone"
              type="tel"
              name="phone"
              required
              value={form.phone}
              onChange={handleInputChange}
              className={styles.formControl}
              placeholder="+91 98765 43210"
              aria-required="true"
            />
          </div>
        </div>

        <div className={styles.fieldGroup}>
          <label htmlFor="signup-pw-field" className={styles.formLabel}>Password</label>
          <div className={styles.inputWrap}>
            <LockIcon className={styles.inputIcon} aria-hidden="true" />
            <input
              id="signup-pw-field"
              type="password"
              name="password"
              required
              value={form.password}
              onChange={handleInputChange}
              className={styles.formControl}
              placeholder="Create a strong password"
              aria-required="true"
            />
          </div>
        </div>

        <div className={styles.fieldGroup}>
          <label htmlFor="signup-confirm-pw-field" className={styles.formLabel}>Confirm password</label>
          <div className={styles.inputWrap}>
            <LockFillIcon className={styles.inputIcon} aria-hidden="true" />
            <input
              id="signup-confirm-pw-field"
              type="password"
              name="confirmPassword"
              required
              value={form.confirmPassword}
              onChange={handleInputChange}
              className={styles.formControl}
              placeholder="Repeat your password"
              aria-required="true"
            />
          </div>
        </div>

        {status.error && (
          <div role="alert" aria-live="assertive" className="p-3 text-xs font-semibold text-red-800 bg-red-50 border border-red-200 rounded-lg">
            ⚠️ {status.error}
          </div>
        )}

        <button
          type="submit"
          disabled={status.submitting}
          className={styles.btnSubmit}
        >
          {status.submitting ? "Creating account..." : <>Create account <ArrowRightIcon aria-hidden="true" /></>}
        </button>
      </form>
    </div>
  );
}

// ==========================================
// --- Main Client Component ---
// ==========================================
export default function AuthClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const successMsg = searchParams.get("success") || "";

  // The active mode is determined by the query parameter "mode", defaulting to "login"
  const mode = searchParams.get("mode") === "signup" ? "signup" : "login";

  const handleModeChange = (newMode) => {
    router.push(`/auth?mode=${newMode}`);
  };

  return (
    <div className={styles.authCard}>
      {/* MODE SWITCHER */}
      <div className={styles.modeSwitcher} role="tablist" aria-label="Authentication Options">
        <button
          id="tab-login"
          role="tab"
          aria-selected={mode === "login"}
          aria-controls="panel-login"
          onClick={() => handleModeChange("login")}
          className={`${styles.modeBtn} ${mode === "login" ? styles.modeBtnActive : ""}`}
        >
          Log in
        </button>
        <button
          id="tab-signup"
          role="tab"
          aria-selected={mode === "signup"}
          aria-controls="panel-signup"
          onClick={() => handleModeChange("signup")}
          className={`${styles.modeBtn} ${mode === "signup" ? styles.modeBtnActive : ""}`}
        >
          Sign up
        </button>
      </div>

      {/* Conditionally Render Panels */}
      {mode === "login" ? (
        <div id="panel-login" role="tabpanel" aria-labelledby="tab-login">
          <LoginPanel successMsg={successMsg} />
        </div>
      ) : (
        <div id="panel-signup" role="tabpanel" aria-labelledby="tab-signup">
          <SignupPanel />
        </div>
      )}
    </div>
  );
}
