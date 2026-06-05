"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "./DashboardLayoutClient";
import styles from "./dashboard.module.css";

import StatsGrid from "./components/StatsGrid";
import ChartsGrid from "./components/ChartsGrid";

export default function DashboardPage() {
  const session = useSession();
  const userId = session?.userId || null;
  const [hasProfile, setHasProfile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [appsLoading, setAppsLoading] = useState(true);

  useEffect(() => {
    async function checkProfileAndFetchApps() {
      if (!userId) {
        setLoading(false);
        return;
      }
      try {
        const profileRes = await fetch("/api/profile");
        const profileData = await profileRes.json();
        if (profileRes.ok && profileData.profile) {
          setHasProfile(true);

          // Profile exists, fetch applications
          const appsRes = await fetch("/api/applications");
          const appsData = await appsRes.json();
          if (appsRes.ok && appsData.applications) {
            setApplications(appsData.applications);
          }
        }
      } catch (err) {
        console.error("Failed to check profile or fetch applications:", err);
      } finally {
        setLoading(false);
        setAppsLoading(false);
      }
    }
    checkProfileAndFetchApps();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 bg-[#F8F5F0]">
        <div className="text-center text-[#6B5E45] font-semibold animate-pulse">
          Loading Dashboard...
        </div>
      </div>
    );
  }

  // If profile is present, show analytics dashboard
  if (hasProfile) {
    return (
      <div className="flex-1 px-4 py-8 bg-[#F8F5F0]">
        <div className="w-full max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-6 flex justify-between items-center gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl font-extrabold text-[#16120A] tracking-tight">
                My Dashboard
              </h1>
              <p className="text-sm text-[#6B5E45]">
                Real-time loan application metrics and distribution analysis.
              </p>
            </div>
            <Link
              href="/dashboard/browse"
              className="bg-[#F5A623] hover:bg-[#C8841A] text-[#16120A] hover:text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md no-underline"
            >
              Browse Lenders
            </Link>
          </div>

          {/* Apps Loading */}
          {appsLoading ? (
            <div className="text-center py-12 text-slate-500 animate-pulse">
              Retrieving analytics data...
            </div>
          ) : applications.length === 0 ? (
            /* Profile exists but no applications submitted */
            <div className="text-center py-20 bg-white border border-[rgba(245,166,35,0.15)] rounded-2xl p-6 shadow-sm">
              <div className="text-4xl mb-3">🐝</div>
              <h3 className="font-bold text-gray-800 text-lg">No active loan applications</h3>
              <p className="text-sm text-gray-500 mt-1 max-w-[320px] mx-auto mb-6">
                You haven&apos;t requested any loans yet. Browse our active lenders to start borrowing.
              </p>
              <Link
                href="/dashboard/browse"
                className="inline-flex bg-[#FEF6E4] hover:bg-[#F5A623] hover:text-[#16120A] text-[#C8841A] text-xs font-bold px-5 py-3 rounded-xl transition-all no-underline"
              >
                Browse Active Lenders
              </Link>
            </div>
          ) : (
            /* Dashboard Grid */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
              {/* Column 1: Stats Grid (span 5) */}
              <div className="lg:col-span-5">
                <StatsGrid applications={applications} />
              </div>

              {/* Column 2: Charts Grid (span 7) */}
              <div className="lg:col-span-7">
                <ChartsGrid applications={applications} />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-16 bg-[#F8F5F0]">
      <div className="flex flex-col items-center text-center">

        {/* Icon */}
        <div className={styles.emptyIcon}>🐝</div>

        {/* Heading */}
        <h2 className="text-[#16120A] font-extrabold text-xl tracking-tight mb-2">
          No profile yet
        </h2>

        {/* Sub-text */}
        <p className="text-sm text-[#6B5E45] leading-relaxed mb-6 max-w-[260px]">
          Create your profile to start borrowing or lending on BorrowBee.
        </p>

        {/* CTA */}
        <Link href="/dashboard/profile" className={`${styles.btnHoney} no-underline`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16" height="16"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2z" />
          </svg>
          Create profile
        </Link>

      </div>
    </div>
  );
}
