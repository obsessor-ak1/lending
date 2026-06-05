import React from "react";

// Helper functions for computing stats
function computeTotalApplications(applications) {
  return applications.length;
}

function computeApprovedAndRejected(applications) {
  const approved = applications.filter((app) => app.status === "APPROVED").length;
  const rejected = applications.filter((app) => app.status === "REJECTED").length;
  return { approved, rejected };
}

function computeTotalApprovedAmount(applications) {
  return applications
    .filter((app) => app.status === "APPROVED")
    .reduce((sum, app) => sum + app.amount, 0);
}

function computeInterestsPaid(applications) {
  return applications
    .filter((app) => app.status === "APPROVED")
    .reduce((sum, app) => sum + (app.amount * app.interest_rate) / 100, 0);
}

export default function StatsGrid({ applications = [] }) {
  const totalApps = computeTotalApplications(applications);
  const { approved, rejected } = computeApprovedAndRejected(applications);
  const totalApprovedAmt = computeTotalApprovedAmount(applications);
  const interestsPaid = computeInterestsPaid(applications);

  const formattedApprovedAmt = `INR ${totalApprovedAmt.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
  const formattedInterestsPaid = `INR ${interestsPaid.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

  return (
    <div className="flex flex-col gap-6" role="region" aria-label="Borrower Analytics Metrics">
      {/* Card 1: Total Applications */}
      <div className="bg-white rounded-2xl border border-[rgba(245,166,35,0.12)] p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-[#6B5E45] uppercase tracking-wider">Total Applications</span>
          <span className="text-lg" role="img" aria-label="Total Applications Icon">📄</span>
        </div>
        <h3 className="text-3xl font-extrabold text-[#16120A] tracking-tight">{totalApps}</h3>
        <p className="text-xs text-[#6B5E45] mt-1">Loan requests submitted so far.</p>
      </div>

      {/* Card 2: Decisions (Approved vs Rejected) */}
      <div className="bg-white rounded-2xl border border-[rgba(245,166,35,0.12)] p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-[#6B5E45] uppercase tracking-wider">Application Decisions</span>
          <span className="text-lg" role="img" aria-label="Decisions Icon">⚖️</span>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-1">
          <div>
            <span className="block text-[10px] font-bold text-green-700 uppercase tracking-wider">Approved</span>
            <span className="text-2xl font-bold text-green-800">{approved}</span>
          </div>
          <div>
            <span className="block text-[10px] font-bold text-red-700 uppercase tracking-wider">Rejected</span>
            <span className="text-2xl font-bold text-red-800">{rejected}</span>
          </div>
        </div>
        <p className="text-xs text-[#6B5E45] mt-3 pt-2 border-t border-gray-100">
          Decisions processed by active lenders.
        </p>
      </div>

      {/* Card 3: Total Approved Loan Amount */}
      <div className="bg-white rounded-2xl border border-[rgba(245,166,35,0.12)] p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-[#6B5E45] uppercase tracking-wider">Total Approved Capital</span>
          <span className="text-lg" role="img" aria-label="Approved Amount Icon">💰</span>
        </div>
        <h3 className="text-2xl font-extrabold text-[#16120A] tracking-tight">{formattedApprovedAmt}</h3>
        <p className="text-xs text-[#6B5E45] mt-1">Active loan capital granted to your account.</p>
      </div>

      {/* Card 4: Interests Paid Thus Far */}
      <div className="bg-white rounded-2xl border border-[rgba(245,166,35,0.12)] p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-[#6B5E45] uppercase tracking-wider">Accrued Interests</span>
          <span className="text-lg" role="img" aria-label="Interest Icon">📈</span>
        </div>
        <h3 className="text-2xl font-extrabold text-[#C8841A] tracking-tight">{formattedInterestsPaid}</h3>
        <p className="text-xs text-[#6B5E45] mt-1">Total interest value calculated from approved rates.</p>
      </div>
    </div>
  );
}
