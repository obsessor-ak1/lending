"use client";

import { useState, useRef, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { sendVerificationEmail, verifyCode } from "@/lib/verification";

import styles from "./verify.module.css";

// ==========================================
// --- SVG Icons ---
// ==========================================
const ArrowLeftIcon = ({ className = "w-4 h-4", ...props }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
  </svg>
);

const ArrowRightIcon = ({ className = "w-4 h-4", ...props }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.97H3.75A.75.75 0 013 10z" clipRule="evenodd" />
  </svg>
);

// ==========================================
// --- Top Bar Component ---
// ==========================================
function TopBar() {
  return (
    <header className={styles.topBar} role="banner">
      <Link href="/" className={styles.brand} aria-label="BorrowBee Home Page">
        <div className={styles.brandBee} role="img" aria-label="Bee Logo">🐝</div>
        <span className={styles.brandName}>
          Borrow<span>Bee</span>
        </span>
      </Link>
      <Link href="/auth?mode=login" className={styles.backLink} aria-label="Go back to login page">
        <ArrowLeftIcon aria-hidden="true" /> Back to login
      </Link>
    </header>
  );
}

// ==========================================
// --- Main Client Component ---
// ==========================================
export default function VerifyClient({ userId, initialEmail }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Dynamic email fetching and masking
  const rawEmail = initialEmail || searchParams.get("email") || "a***@example.com";
  const maskedEmail = (() => {
    if (!rawEmail.includes("@")) return rawEmail;
    const [local, domain] = rawEmail.split("@");
    if (local.length <= 2) return `***@${domain}`;
    return `${local[0]}***${local[local.length - 1]}@${domain}`;
  })();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [status, setStatus] = useState({ submitting: false, success: false, error: "" });
  const inputRefs = useRef([]);

  // Countdown timer settings (120 seconds = 2:00)
  const WAIT_TIME = 120;
  const [remainingTime, setRemainingTime] = useState(WAIT_TIME);
  const isResendActive = remainingTime <= 0;

  // Dynamically set Document Title
  useEffect(() => {
    document.title = "BorrowBee — Verify Your Account";
  }, []);

  // Send verification code once on render
  const hasSentRef = useRef(false);
  useEffect(() => {
    if (hasSentRef.current) return;
    hasSentRef.current = true;

    const sendCode = async () => {
      try {
        await sendVerificationEmail(userId, rawEmail);
      } catch (err) {
        console.error("Error sending initial verification email:", err);
        setStatus({ submitting: false, success: false, error: err.message || "Failed to send verification email." });
      }
    };
    if (rawEmail) {
      sendCode();
    }
  }, [rawEmail, userId]);

  // Timer countdown hook
  useEffect(() => {
    if (remainingTime <= 0) {
      return;
    }
    const intervalId = setInterval(() => {
      setRemainingTime((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [remainingTime]);

  const handleInputChange = (value, index) => {
    const cleanValue = value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
    const newOtp = [...otp];
    newOtp[index] = cleanValue.substring(cleanValue.length - 1);
    setOtp(newOtp);

    // Auto-focus the next input field if filled
    if (cleanValue && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      } else {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 6);
    const newOtp = [...otp];

    for (let i = 0; i < 6; i++) {
      newOtp[i] = pastedData[i] || "";
    }
    setOtp(newOtp);

    // Set focus on last filled input or fallback to index 5
    const nextFocusIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextFocusIndex]?.focus();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = String(seconds % 60).padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const handleResend = async (e) => {
    e.preventDefault();
    if (!isResendActive) return;

    setStatus({ submitting: false, success: false, error: "" });
    setRemainingTime(WAIT_TIME);
    setOtp(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();

    try {
      await sendVerificationEmail(userId, rawEmail);
      setStatus({ submitting: false, success: true, error: "" });
    } catch (err) {
      console.error(err);
      setStatus({ submitting: false, success: false, error: err.message || "Resend verification code failed." });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join("");

    if (otpCode.length < 6) {
      setStatus({ submitting: false, success: false, error: "Please enter the full 6-digit code." });
      return;
    }

    setStatus({ submitting: true, success: false, error: "" });

    try {
      let status = await verifyCode(rawEmail, otpCode);
      if (status.verified) {
        setStatus({ submitting: false, success: true, error: "" });

        setTimeout(() => {
          router.push("/auth/verify/success");
        }, 1500);
      }
    } catch (err) {
      setStatus({ submitting: false, success: false, error: err.message || "Something went wrong." });
    }
  };

  return (
    <div className={styles.verifyBody}>
      {/* HEADER TOP BAR */}
      <TopBar />

      {/* CARD WRAPPER */}
      <main className={styles.verifyWrapper}>
        <div className={styles.verifyCard}>
          {/* Icon */}
          <div
            className="rounded-full flex items-center justify-center mx-auto mb-6 text-3xl"
            style={{
              width: "64px",
              height: "64px",
              background: "var(--honey-light)",
              border: "1px solid rgba(245, 166, 35, 0.25)",
            }}
            aria-hidden="true"
          >
            📬
          </div>

          {/* Heading */}
          <h1 className={styles.authHeading}>Check your inbox</h1>
          <p className={styles.authSub}>
            We've sent a 6-digit verification code to
            <br />
            <strong style={{ color: "var(--dark)" }}>{maskedEmail}</strong>.
            <br />
            Enter it below to verify your account.
          </p>

          {/* OTP Form */}
          <form onSubmit={handleSubmit} aria-label="Verify OTP Form">
            {/* OTP inputs */}
            <div className="flex justify-center gap-2 mb-6" onPaste={handlePaste}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  className={`${styles.otpInput} ${digit ? styles.otpInputFilled : ""}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleInputChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  aria-label={`OTP Digit ${index + 1}`}
                  aria-required="true"
                  required
                />
              ))}
            </div>

            {/* Error message */}
            {status.error && (
              <div
                role="alert"
                aria-live="assertive"
                className="p-3 text-xs font-semibold text-red-800 bg-red-50 border border-red-200 rounded-lg mb-4 text-left"
              >
                ⚠️ {status.error}
              </div>
            )}

            {/* Success message */}
            {status.success && (
              <div
                role="status"
                aria-live="polite"
                className="p-3 text-xs font-semibold text-green-800 bg-green-50 border border-green-200 rounded-lg mb-4 text-left"
              >
                🎉 Verification successful! Taking you to dashboard...
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={status.submitting}
              aria-busy={status.submitting}
              className={styles.btnHoney}
            >
              {status.submitting ? (
                "Verifying..."
              ) : (
                <>
                  Verify account <ArrowRightIcon aria-hidden="true" />
                </>
              )}
            </button>
          </form>

          {/* Resend */}
          <div className="text-sm mt-4" style={{ color: "var(--muted)" }}>
            Didn't receive a code?{" "}
            <a
              href="#"
              className={`${styles.resendLink} ${isResendActive ? styles.resendLinkActive : ""}`}
              onClick={handleResend}
              aria-disabled={!isResendActive}
            >
              Resend code
            </a>
            {!isResendActive && (
              <span className="block mt-1 text-slate-500 text-xs" aria-live="polite">
                You can resend in <strong>{formatTime(remainingTime)}</strong>
              </span>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
