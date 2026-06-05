import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { sessionOptions } from "../../lib/session";
import { redirect } from "next/navigation";
import Link from "next/link";
import AuthClient from "./AuthClient";
import { Suspense } from "react";
import styles from "./auth.module.css";

export const metadata = {
  title: "BorrowBee — Authenticate",
};

// ==========================================
// --- SVG Icons ---
// ==========================================
const ArrowLeftIcon = ({ className = "w-4 h-4", ...props }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
  </svg>
);

// ==========================================
// --- Top Bar Component ---
// ==========================================
function TopBar() {
  return (
    <div className={styles.topBar} role="banner">
      <Link href="/" className={styles.brand} aria-label="BorrowBee Home Page">
        <div className={styles.brandBee} role="img" aria-label="Bee Logo">🐝</div>
        <span className={styles.brandName}>
          Borrow<span>Bee</span>
        </span>
      </Link>
      <Link href="/" className={styles.backLink} aria-label="Go back to the homepage">
        <ArrowLeftIcon aria-hidden="true" /> Back to home
      </Link>
    </div>
  );
}

// ==========================================
// --- Main Server Page ---
// ==========================================
export default async function AuthPage() {
  const cookieStore = await cookies();
  const session = await getIronSession(cookieStore, sessionOptions);

  // Redirect based on login/verified status
  if (session.user_id) {
    if (session.verified) {
      redirect("/dashboard");
    } else {
      redirect("/auth/verify");
    }
  }

  return (
    <div className={styles.authBody}>
      {/* HEADER TOP BAR */}
      <TopBar />

      {/* CARD WRAPPER */}
      <main className={styles.authWrapper}>
        <Suspense fallback={<div className="text-center text-[#6B5E45]">Loading forms...</div>}>
          <AuthClient />
        </Suspense>
      </main>
    </div>
  );
}
