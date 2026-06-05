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

export default function RequestCard({ request }) {
  const applicantName = request.borrower?.profile?.name || "Anonymous Borrower";
  const purpose = PURPOSE_LABELS[request.purpose] || request.purpose;
  const amount = `INR ${request.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
  const rate = `${request.interest_rate.toFixed(2)}%`;
  const date = new Date(request.created_at).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const status = request.status;

  return (
    <div className="bg-white rounded-2xl border border-[rgba(245,166,35,0.12)] shadow-sm p-6 hover:shadow-md transition-all duration-200 flex flex-col justify-between h-full">
      <div>
        <div className="flex justify-between items-start gap-2 mb-3">
          <span className="text-xs font-bold text-[#6B5E45] uppercase tracking-wider">
            {purpose}
          </span>
          <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border ${STATUS_CLASSES[status] || ""}`}>
            {status}
          </span>
        </div>
        
        <h3 className="text-xl font-extrabold text-[#16120A] mb-1">
          {applicantName}
        </h3>
        
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-[#6B5E45] mb-4">
          <div>
            <span className="block font-semibold uppercase text-[9px] tracking-wider">Amount</span>
            <span className="text-sm font-bold text-emerald-700">{amount}</span>
          </div>
          <div>
            <span className="block font-semibold uppercase text-[9px] tracking-wider">Interest Rate</span>
            <span className="text-sm font-bold text-[#C8841A]">{rate}</span>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
        <div className="text-[11px] text-[#6B5E45]">
          <span className="block font-semibold">Applied on:</span>
          <span>{date}</span>
        </div>
        <Link
          href={`/dashboard/requests/${request.id}`}
          className="bg-[#FEF6E4] hover:bg-[#F5A623] hover:text-[#16120A] text-[#C8841A] text-xs font-bold px-4 py-2 rounded-xl transition-all duration-200 no-underline"
        >
          View Request
        </Link>
      </div>
    </div>
  );
}
