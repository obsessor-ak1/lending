import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import styles from "../browse.module.css";

const HOME_OWNERSHIP_MAP = {
  0: "Rent",
  1: "Own",
  2: "Mortgage",
  3: "Other",
};

export default async function LenderDetailPage({ params }) {
  const { id } = await params;
  const userIdNum = parseInt(id, 10);

  if (isNaN(userIdNum)) {
    return notFound();
  }

  const profile = await prisma.profile.findUnique({
    where: { user_id: userIdNum },
    include: { user: true }
  });

  if (!profile) {
    return notFound();
  }

  const name = profile.name || "Anonymous Lender";
  const homeOwnershipLabel = HOME_OWNERSHIP_MAP[profile.home_ownership] || "Other";
  const minRate = profile.min_lender_interest_rate.toFixed(2);
  const maxRate = profile.max_lender_interest_rate.toFixed(2);

  return (
    <div className="flex-1 px-4 py-8 bg-[#F8F5F0]">
      <div className={styles.detailContainer}>
        
        {/* Back Link */}
        <Link href="/dashboard/browse" className={styles.btnBack}>
          <i className="bi bi-arrow-left"></i> Back to browse
        </Link>

        {/* Card */}
        <div className={styles.detailCard}>
          
          {/* Header Title */}
          <div className="mb-6">
            <h1 className="text-2xl font-extrabold text-[#16120A] tracking-tight">
              {name}
            </h1>
            <p className="text-sm text-[#6B5E45]">
              Lender profile credentials and specifications.
            </p>
          </div>

          {/* ── SECTION: BIOGRAPHY ── */}
          <h2 className={styles.sectionTitle}>
            <i className="bi bi-person-lines-fill text-[#C8841A]"></i> About Lender
          </h2>
          <div className={styles.bioBlock}>
            {profile.bio || "No description provided."}
          </div>

          {/* ── SECTION: REPUTATION & CRITERIA ── */}
          <h2 className={styles.sectionTitle}>
            <i className="bi bi-card-checklist text-[#C8841A]"></i> Profile Criteria
          </h2>
          <div className={styles.infoGrid}>
            <div className={styles.infoGroup}>
              <span className={styles.infoLabel}>Age</span>
              <span className={styles.infoValue}>{profile.age} Years</span>
            </div>

            <div className={styles.infoGroup}>
              <span className={styles.infoLabel}>Home Ownership</span>
              <span className={styles.infoValue}>{homeOwnershipLabel}</span>
            </div>

            <div className={styles.infoGroup}>
              <span className={styles.infoLabel}>Employment Duration</span>
              <span className={styles.infoValue}>{profile.employment_duration} Months</span>
            </div>

            <div className={styles.infoGroup}>
              <span className={styles.infoLabel}>Credit History Length</span>
              <span className={styles.infoValue}>{profile.cred_hist_length} Years</span>
            </div>

            <div className={styles.infoGroup}>
              <span className={styles.infoLabel}>Previous Default History</span>
              <span className={styles.infoValue}>
                {profile.prev_default ? "⚠️ Yes (Has Default History)" : "✅ No Defaults"}
              </span>
            </div>

            <div className={styles.infoGroup}>
              <span className={styles.infoLabel}>Annual Income</span>
              <span className={styles.infoValue}>
                INR {profile.income.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* ── SECTION: LENDING OPTIONS ── */}
          <h2 className={styles.sectionTitle}>
            <i className="bi bi-bank text-[#C8841A]"></i> Lending Options
          </h2>
          <div className={styles.infoGrid}>
            <div className={styles.infoGroup}>
              <span className={styles.infoLabel}>Active Lender</span>
              <span className={styles.infoValue}>
                {profile.lender_status ? "🟢 Yes (Offering Loans)" : "🔴 No"}
              </span>
            </div>

            <div className={styles.infoGroup}>
              <span className={styles.infoLabel}>Interest Rate Offerings</span>
              <span className={styles.infoValue}>
                {minRate}% - {maxRate}%
              </span>
            </div>

            <div className={styles.infoGroup}>
              <span className={styles.infoLabel}>Maximum Loan Offer Amount</span>
              <span className={styles.infoValue}>
                {profile.max_amount !== null && profile.max_amount !== undefined
                  ? `INR ${profile.max_amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`
                  : "N/A"}
              </span>
            </div>
          </div>

          {profile.lender_status && (
            <div className="mt-8 flex justify-end">
              <Link
                href={`/dashboard/application?lenderId=${profile.user_id}`}
                className={`${styles.btnHoney} text-base px-6 py-3 rounded-xl`}
              >
                Apply
              </Link>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
