"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import StatusAlert from "../../application/components/StatusAlert";
import ApplicantDetailsPanel from "./components/ApplicantDetailsPanel";
import ApplicationSpecsPanel from "./components/ApplicationSpecsPanel";
import LoanRiskPanel from "./components/LoanRiskPanel";

const STATUS_CLASSES = {
  PENDING: "bg-amber-50 text-amber-800 border-amber-200",
  APPROVED: "bg-green-50 text-green-800 border-green-200",
  REJECTED: "bg-red-50 text-red-800 border-red-200",
};

export default function RequestDetailClient({ application, riskAssessment }) {
  const router = useRouter();
  const [remarks, setRemarks] = useState(application.remarks || "");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ success: false, message: "", error: "" });
  const [currentStatus, setCurrentStatus] = useState(application.status);

  const borrower = application.borrower?.profile || {};

  const handleAction = async (decision) => {
    setSubmitting(true);
    setStatus({ success: false, message: "", error: "" });

    try {
      const res = await fetch(`/api/application?app_id=${application.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: decision,
          remarks: remarks.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to update application.");
      }

      setStatus({ success: true, message: data.message, error: "" });
      setCurrentStatus(decision);

      // Redirect after a short delay so user can read the flash message
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
    <div className="flex flex-col gap-6">
      
      {/* Status Alert Banner */}
      <StatusAlert error={status.error} success={status.success} message={status.message} />

      {/* 1. Applicant Profile details panel */}
      <ApplicantDetailsPanel borrower={borrower} />

      {/* 2. Application specifications panel */}
      <ApplicationSpecsPanel application={application} currentStatus={currentStatus} />

      {currentStatus === "PENDING" ? <LoanRiskPanel riskAssessment={riskAssessment} /> : null}

      {/* 3. Decision form / status display */}
      <div className="bg-white rounded-2xl border border-[rgba(245,166,35,0.12)] shadow-sm p-6">
        <h2 className="text-base font-extrabold text-[#16120A] border-b border-gray-100 pb-3 mb-4 flex items-center gap-2">
          <i className="bi bi-shield-check text-[#C8841A]"></i> Response & Decision
        </h2>

        {currentStatus === "PENDING" ? (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="remarks" className="text-xs font-bold text-[#6B5E45] uppercase tracking-wider">Decision Remarks (Optional)</label>
              <textarea
                id="remarks"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Provide feedback, approval criteria, or reasons for rejection here..."
                rows="3"
                className="w-full border border-gray-200 rounded-lg bg-white px-3.5 py-2.5 text-sm text-gray-800 focus:border-[#F5A623] focus:ring-2 focus:ring-[rgba(245,166,35,0.15)] outline-none transition-all"
                disabled={submitting}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mt-2">
              <button
                type="button"
                onClick={() => handleAction("REJECTED")}
                disabled={submitting}
                className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 font-bold rounded-xl py-3 transition-all disabled:opacity-60 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <i className="bi bi-x-circle"></i> Reject
              </button>

              <button
                type="button"
                onClick={() => handleAction("APPROVED")}
                disabled={submitting}
                className="bg-green-50 hover:bg-green-100 border border-green-200 text-green-700 font-bold rounded-xl py-3 transition-all disabled:opacity-60 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <i className="bi bi-check-circle"></i> Approve
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <div>
              <span className="block text-[10px] font-bold text-[#6B5E45] uppercase tracking-wider">Decision Made</span>
              <span className={`inline-block text-xs font-extrabold px-3 py-1 rounded-full border mt-1 ${STATUS_CLASSES[currentStatus] || ""}`}>
                {currentStatus}
              </span>
            </div>
            {remarks && (
              <div>
                <span className="block text-[10px] font-bold text-[#6B5E45] uppercase tracking-wider">Remarks (Frozen)</span>
                <p className="bg-gray-50 rounded-xl p-3 text-sm text-[#16120A] italic mt-1 border border-gray-100">
                  &ldquo;{remarks}&rdquo;
                </p>
              </div>
            )}
            <div className="text-xs text-[#6B5E45] mt-2">
              This request is finalized and can no longer be modified.
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
