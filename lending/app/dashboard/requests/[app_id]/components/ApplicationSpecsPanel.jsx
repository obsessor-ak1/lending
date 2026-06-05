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

export default function ApplicationSpecsPanel({ application, currentStatus }) {
  const status = currentStatus || application.status;

  return (
    <div className="bg-white rounded-2xl border border-[rgba(245,166,35,0.12)] shadow-sm p-6">
      <h2 className="text-base font-extrabold text-[#16120A] border-b border-gray-100 pb-3 mb-4 flex items-center gap-2">
        <i className="bi bi-file-earmark-text text-[#C8841A]"></i> Application Specifications
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <span className="block text-[10px] font-bold text-[#6B5E45] uppercase tracking-wider">Loan Purpose</span>
          <span className="block text-sm font-semibold text-[#16120A]">
            {PURPOSE_LABELS[application.purpose] || application.purpose}
          </span>
        </div>

        <div>
          <span className="block text-[10px] font-bold text-[#6B5E45] uppercase tracking-wider">Requested Amount</span>
          <span className="block text-sm font-semibold text-emerald-700">
            INR {application.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </span>
        </div>

        <div>
          <span className="block text-[10px] font-bold text-[#6B5E45] uppercase tracking-wider">Interest Rate Offer</span>
          <span className="block text-sm font-semibold text-[#C8841A]">{application.interest_rate.toFixed(2)}%</span>
        </div>

        <div>
          <span className="block text-[10px] font-bold text-[#6B5E45] uppercase tracking-wider">Current Status</span>
          <span className={`inline-block text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border mt-1 ${STATUS_CLASSES[status] || ""}`}>
            {status}
          </span>
        </div>

        <div className="md:col-span-2">
          <span className="block text-[10px] font-bold text-[#6B5E45] uppercase tracking-wider mb-1">Proposal / Description</span>
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 text-sm text-[#16120A] whitespace-pre-wrap leading-relaxed">
            {application.description}
          </div>
        </div>
      </div>
    </div>
  );
}
