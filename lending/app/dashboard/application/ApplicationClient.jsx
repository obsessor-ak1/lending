"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LenderInfoPanel from "./components/LenderInfoPanel";
import ApplicationForm from "./components/ApplicationForm";
import StatusAlert from "./components/StatusAlert";

export default function ApplicationClient({ lender }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ success: false, message: "", error: "" });

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    setStatus({ success: false, message: "", error: "" });

    try {
      const res = await fetch("/api/application", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lenderId: lender.user_id,
          ...formData,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to submit application.");
      }

      setStatus({ success: true, message: data.message, error: "" });
      
      // Delay redirection slightly so user can read the success notification
      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 1500);

    } catch (err) {
      setStatus({ success: false, message: "", error: err.message });
      setSubmitting(false);
    }
  };

  return (
    <div className="flex-1 px-4 py-8 bg-[#F8F5F0] min-h-screen">
      <div className="w-full max-w-3xl mx-auto">
        
        {/* Back Link */}
        <Link 
          href={`/dashboard/browse/${lender.user_id}`} 
          className="text-[#6B5E45] hover:text-[#16120A] text-sm font-semibold mb-6 inline-flex items-center gap-2 transition-colors no-underline"
        >
          <i className="bi bi-arrow-left"></i> Back to profile
        </Link>

        {/* Header Title */}
        <div className="mb-8 mt-2">
          <h1 className="text-2xl font-extrabold text-[#16120A] tracking-tight">
            Apply for a Loan
          </h1>
          <p className="text-sm text-[#6B5E45]">
            Configure and submit your borrowing request matching the lender's interest rate and amount limits.
          </p>
        </div>

        {/* Status Alerts */}
        <StatusAlert error={status.error} success={status.success} message={status.message} />

        {/* Modular Panels */}
        <LenderInfoPanel lender={lender} />
        
        <ApplicationForm lender={lender} onSubmit={handleSubmit} submitting={submitting} />

      </div>
    </div>
  );
}
