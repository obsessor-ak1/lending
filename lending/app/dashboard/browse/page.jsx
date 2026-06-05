import Link from "next/link";
import { prisma } from "@/lib/prisma";
import styles from "./browse.module.css";

// Helper to format initials
function getInitials(name) {
  if (!name) return "L";
  const parts = name.split(" ").filter(Boolean);
  if (parts.length === 0) return "L";
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export default async function BrowseLendersPage() {
  const lenders = await prisma.profile.findMany({
    where: { lender_status: true },
    orderBy: { name: "asc" }
  });

  return (
    <div className="flex-1 px-4 py-8 bg-[#F8F5F0]">
      <div className={styles.browseContainer}>
        
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-[#16120A] tracking-tight">
            Browse Lenders
          </h1>
          <p className="text-sm text-[#6B5E45]">
            Discover other users who are open for lending and explore their interest rate offers.
          </p>
        </div>

        {lenders.length === 0 ? (
          <div className="text-center py-16 bg-white border border-[rgba(245,166,35,0.15)] rounded-2xl p-6">
            <div className="text-4xl mb-3">🐝</div>
            <h3 className="font-bold text-gray-800 text-lg">No active lenders</h3>
            <p className="text-sm text-gray-500 mt-1 max-w-[280px] mx-auto">
              There are no users registered as lenders right now. Check back later!
            </p>
          </div>
        ) : (
          <div className={styles.browseGrid}>
            {lenders.map((lender) => {
              const name = lender.name || "Anonymous Lender";
              const initials = getInitials(lender.name);
              const minRate = lender.min_lender_interest_rate.toFixed(2);
              const maxRate = lender.max_lender_interest_rate.toFixed(2);
              const maxAmountFormatted = lender.max_amount !== null && lender.max_amount !== undefined
                ? `INR ${lender.max_amount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`
                : "N/A";

              return (
                <div key={lender.user_id} className={styles.lenderCard}>
                  <div>
                    {/* Header */}
                    <div className={styles.cardHeader}>
                      <div className={styles.avatarInitials}>{initials}</div>
                      <div className={styles.lenderName}>{name}</div>
                    </div>
                    {/* Bio */}
                    <p className={styles.lenderBio}>
                      {lender.bio || "No description provided."}
                    </p>
                  </div>

                  {/* Footer */}
                  <div className={styles.cardFooter}>
                    <div className="flex flex-col gap-1.5">
                      <div>
                        <div className={styles.rateLabel}>Max Offer</div>
                        <div className="text-sm font-extrabold text-[#16120A]">{maxAmountFormatted}</div>
                      </div>
                      <div>
                        <div className={styles.rateLabel}>Interest Rate</div>
                        <div className={styles.rateValue}>{minRate}% - {maxRate}%</div>
                      </div>
                    </div>
                    <Link
                      href={`/dashboard/browse/${lender.user_id}`}
                      className={styles.btnHoney}
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
