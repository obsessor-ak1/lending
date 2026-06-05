const PURPOSE_LABELS = {
  VENTURE: "Business / Venture",
  EDUCATION: "Education",
  MEDICAL: "Medical Expenses",
  PERSONAL: "Personal Loan",
  DEBTCONSOLIDATION: "Debt Consolidation",
  HOMEIMPROVEMENT: "Home Improvement",
  OTHER: "Other Purpose",
};

export default function ApplicationDetailsPanel({ application }) {
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

  return (
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
  );
}
