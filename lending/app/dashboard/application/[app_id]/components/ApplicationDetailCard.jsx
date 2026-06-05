import Link from "next/link";

const PURPOSE_LABELS = {
  VENTURE: "Business / Venture",
  EDUCATION: "Education",
  MEDICAL: "Medical Expenses",
  PERSONAL: "Personal Loan",
  DEBTCONSOLIDATION: "Debt Consolidation",
  HOMEIMPROVEMENT: "Home Improvement",
  OTHER: "Other Purpose",
};

const STATUS_CLASSES = {
  PENDING: "bg-amber-50 text-amber-800 border-amber-200",
  APPROVED: "bg-green-50 text-green-800 border-green-200",
  REJECTED: "bg-red-50 text-red-800 border-red-200",
};

export default function ApplicationDetailCard({ application }) {
  const lender = application.lender?.profile || {};
  const lenderUser = application.lender || {};
  const lenderName = lender.name || "Anonymous Lender";
  const lenderEmail = lenderUser.email || "";
  
  const maxAmount = lender.max_amount !== null && lender.max_amount !== undefined
    ? `INR ${lender.max_amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`
    : "N/A";
  const minRate = lender.min_lender_interest_rate ? lender.min_lender_interest_rate.toFixed(2) : "0.00";
  const maxRate = lender.max_lender_interest_rate ? lender.max_lender_interest_rate.toFixed(2) : "100.00";
  const interestRateRange = `${minRate}% - ${maxRate}%`;

  const purpose = PURPOSE_LABELS[application.purpose] || application.purpose;
  const amount = `INR ${application.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
  const rate = `${application.interest_rate.toFixed(2)}%`;
  const date = new Date(application.created_at).toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  
  const updatedDate = application.updated_at
    ? new Date(application.updated_at).toLocaleDateString("en-IN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <div className="flex flex-col gap-6">
      
      {/* Lender Details Section (Read-only Panel) */}
      <div className="bg-white rounded-2xl border border-[rgba(245,166,35,0.12)] shadow-sm p-6">
        <h2 className="text-base font-extrabold text-[#16120A] border-b border-gray-100 pb-3 mb-4 flex items-center gap-2">
          <i className="bi bi-bank text-[#C8841A]"></i> Lender Credentials
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="block text-[10px] font-bold text-[#6B5E45] uppercase tracking-wider">Lender Name</span>
            <span className="block text-sm font-semibold text-[#16120A]">{lenderName}</span>
            <Link
              href={`/dashboard/browse/${lender.user_id}`}
              className="inline-flex items-center gap-1 text-[11px] text-[#C8841A] underline font-semibold mt-1"
              target="_blank"
            >
              View Lender Profile
            </Link>
          </div>

          <div>
            <span className="block text-[10px] font-bold text-[#6B5E45] uppercase tracking-wider mb-1">Lender Email</span>
            <input
              type="email"
              value={lenderEmail}
              disabled
              className="w-full border border-gray-200 rounded-lg bg-gray-50 px-3 py-1.5 text-xs text-gray-500 cursor-not-allowed outline-none"
              aria-label="Lender email"
            />
          </div>

          <div>
            <span className="block text-[10px] font-bold text-[#6B5E45] uppercase tracking-wider">Lender Limit</span>
            <span className="block text-sm font-semibold text-emerald-700">{maxAmount}</span>
          </div>

          <div>
            <span className="block text-[10px] font-bold text-[#6B5E45] uppercase tracking-wider">Interest Rate Offerings</span>
            <span className="block text-sm font-semibold text-[#C8841A]">{interestRateRange}</span>
          </div>
        </div>
      </div>

      {/* Application Specifications Section */}
      <div className="bg-white rounded-2xl border border-[rgba(245,166,35,0.12)] shadow-sm p-6">
        <h2 className="text-base font-extrabold text-[#16120A] border-b border-gray-100 pb-3 mb-4 flex items-center gap-2">
          <i className="bi bi-file-earmark-text text-[#C8841A]"></i> Application Specifications
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <span className="block text-[10px] font-bold text-[#6B5E45] uppercase tracking-wider">Loan Purpose</span>
            <span className="block text-sm font-semibold text-[#16120A]">{purpose}</span>
          </div>

          <div>
            <span className="block text-[10px] font-bold text-[#6B5E45] uppercase tracking-wider">Application Date</span>
            <span className="block text-sm font-semibold text-[#16120A]">{date}</span>
          </div>

          <div>
            <span className="block text-[10px] font-bold text-[#6B5E45] uppercase tracking-wider">Requested Amount</span>
            <span className="block text-lg font-bold text-[#16120A]">{amount}</span>
          </div>

          <div>
            <span className="block text-[10px] font-bold text-[#6B5E45] uppercase tracking-wider">Interest Rate Offer</span>
            <span className="block text-lg font-bold text-[#C8841A]">{rate}</span>
          </div>

          <div className="md:col-span-2">
            <span className="block text-[10px] font-bold text-[#6B5E45] uppercase tracking-wider mb-1">Proposal / Description</span>
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm text-[#16120A] whitespace-pre-wrap leading-relaxed">
              {application.description}
            </div>
          </div>
        </div>
      </div>

      {/* Status & Remarks Section */}
      <div className="bg-white rounded-2xl border border-[rgba(245,166,35,0.12)] shadow-sm p-6 flex flex-col gap-4">
        <div className="flex justify-between items-center gap-4 flex-wrap border-b border-gray-100 pb-3">
          <h2 className="text-base font-extrabold text-[#16120A] flex items-center gap-2">
            <i className="bi bi-info-circle text-[#C8841A]"></i> Decisional Status
          </h2>
          <span className={`text-xs font-extrabold px-3 py-1.5 rounded-full border ${STATUS_CLASSES[application.status] || ""}`}>
            {application.status}
          </span>
        </div>

        {application.remarks && (
          <div>
            <span className="block text-[10px] font-bold text-[#6B5E45] uppercase tracking-wider mb-1">Lender Remarks</span>
            <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-4 text-sm text-amber-900 italic">
              &ldquo;{application.remarks}&rdquo;
            </div>
          </div>
        )}

        <div className="text-xs text-[#6B5E45] flex flex-col gap-1 mt-2">
          {updatedDate ? (
            <div>
              <span className="font-semibold">Last Updated:</span> {updatedDate}
            </div>
          ) : (
            <div>
              <span className="font-semibold">Last Updated:</span> No updates
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
