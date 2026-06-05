"use client";

import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const PURPOSE_COLORS = [
  "#F5A623", // Honey gold
  "#C8841A", // Dark honey
  "#8A5C10", // Bronze
  "#FEF6E4", // Cream
  "#6B5E45", // Muted brown
  "#10B981", // Emerald
  "#3B82F6", // Royal blue
];

const STATUS_COLORS = {
  Approved: "#10B981", // Emerald Green
  Rejected: "#EF4444", // Coral Red
  Pending: "#F5A623",  // Amber Gold
};

function preparePurposeData(applications) {
  const PURPOSE_LABELS = {
    VENTURE: "Business / Venture",
    EDUCATION: "Education",
    MEDICAL: "Medical Expenses",
    PERSONAL: "Personal Loan",
    DEBTCONSOLIDATION: "Debt Consolidation",
    HOMEIMPROVEMENT: "Home Improvement",
    OTHER: "Other Purpose",
  };

  const counts = {};
  applications.forEach((app) => {
    const label = PURPOSE_LABELS[app.purpose] || app.purpose;
    counts[label] = (counts[label] || 0) + 1;
  });

  return Object.keys(counts).map((key) => ({
    name: key,
    value: counts[key],
  }));
}

function prepareStatusData(applications) {
  const STATUS_LABELS = {
    PENDING: "Pending",
    APPROVED: "Approved",
    REJECTED: "Rejected",
  };

  const counts = { Approved: 0, Rejected: 0, Pending: 0 };
  applications.forEach((app) => {
    const label = STATUS_LABELS[app.status] || app.status;
    counts[label] = (counts[label] || 0) + 1;
  });

  return Object.keys(counts)
    .filter((key) => counts[key] > 0)
    .map((key) => ({
      name: key,
      value: counts[key],
    }));
}

export default function ChartsGrid({ applications = [] }) {
  const [mounted, setMounted] = useState(false);

  // SSR safety check to prevent Next.js hydration mismatches
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex flex-col gap-6 w-full">
        <div className="bg-white rounded-2xl border border-[rgba(245,166,35,0.12)] p-6 shadow-sm h-[320px] flex items-center justify-center text-xs text-[#6B5E45] font-semibold animate-pulse">
          Loading dashboard charts...
        </div>
        <div className="bg-white rounded-2xl border border-[rgba(245,166,35,0.12)] p-6 shadow-sm h-[320px] flex items-center justify-center text-xs text-[#6B5E45] font-semibold animate-pulse">
          Loading dashboard charts...
        </div>
      </div>
    );
  }

  const purposeData = preparePurposeData(applications);
  const statusData = prepareStatusData(applications);

  return (
    <div className="grid grid-cols-1 gap-6 w-full" role="region" aria-label="Borrower Analytics Charts">
      {/* Chart 1: Purpose distribution */}
      <div className="bg-white rounded-2xl border border-[rgba(245,166,35,0.12)] p-6 shadow-sm flex flex-col items-center">
        <h3 className="text-xs font-bold text-[#6B5E45] uppercase tracking-wider mb-4 w-full text-left">
          Loans Distribution by Purpose
        </h3>
        <div className="w-full h-[280px]" aria-label="Pie chart showing distribution of loans across purposes">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={purposeData}
                cx="50%"
                cy="45%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {purposeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PURPOSE_COLORS[index % PURPOSE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} Application(s)`, "Count"]} />
              <Legend verticalAlign="bottom" iconSize={10} iconType="circle" wrapperStyle={{ fontSize: "11px", color: "#6B5E45" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Status distribution */}
      <div className="bg-white rounded-2xl border border-[rgba(245,166,35,0.12)] p-6 shadow-sm flex flex-col items-center">
        <h3 className="text-xs font-bold text-[#6B5E45] uppercase tracking-wider mb-4 w-full text-left">
          Application Decisions Distribution
        </h3>
        <div className="w-full h-[280px]" aria-label="Pie chart showing distribution of approved vs rejected applications">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="45%"
                innerRadius={0}
                outerRadius={80}
                paddingAngle={0}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name] || "#CBD5E1"} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} Application(s)`, "Count"]} />
              <Legend verticalAlign="bottom" iconSize={10} iconType="circle" wrapperStyle={{ fontSize: "11px", color: "#6B5E45" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
