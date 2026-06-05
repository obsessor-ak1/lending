import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { sessionOptions } from "../../../../lib/session";
import { redirect } from "next/navigation";
import Link from "next/link";
import styles from "./success.module.css";

export const metadata = {
  title: "BorrowBee — Account Verified",
};

export default async function SuccessPage() {
  const cookieStore = await cookies();
  const session = await getIronSession(cookieStore, sessionOptions);

  // If not logged in, redirect to login page
  if (!session.user_id) {
    redirect("/auth?mode=login");
  }

  return (
    <div className={styles.successBody}>
      {/* HEADER TOP BAR */}
      <header className={styles.topBar} role="banner">
        <Link href="/" className={styles.brand} aria-label="BorrowBee Home Page">
          <div className={styles.brandBee} role="img" aria-label="Bee Logo">🐝</div>
          <span className={styles.brandName}>
            Borrow<span>Bee</span>
          </span>
        </Link>
      </header>

      {/* CARD WRAPPER */}
      <main className={styles.successWrapper}>
        <div className={styles.successCard}>
          {/* Checkmark */}
          <div className={styles.checkmark} aria-hidden="true">
            ✅
          </div>

          {/* Heading */}
          <h1 className={styles.successHeading}>Account verified!</h1>
          <p className={styles.successSub}>
            Your BorrowBee account has been successfully verified. You're all set to start borrowing and lending.
          </p>

          {/* CTA */}
          <Link href="/dashboard" className={styles.btnCta} aria-label="Go to your dashboard account page">
            Go to my account &rarr;
          </Link>
        </div>
      </main>

      {/* FOOTER */}
      <footer style={{ padding: "24px 0", marginTop: "auto" }}>
        <p className={styles.footerText}>
          &copy; 2025 BorrowBee &nbsp;&middot;&nbsp;
          <a href="#" aria-label="Privacy Policy">Privacy Policy</a>
          &nbsp;&middot;&nbsp;
          <a href="#" aria-label="Unsubscribe">Unsubscribe</a>
        </p>
      </footer>
    </div>
  );
}
