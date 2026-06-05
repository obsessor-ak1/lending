import Link from "next/link";

export default function LenderInfoPanel({ lender }) {
  const name = lender.name || "Anonymous Lender";
  const email = lender.user?.email || "";
  const maxAmount = lender.max_amount !== null && lender.max_amount !== undefined
    ? `INR ${lender.max_amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`
    : "N/A";
  const minRate = lender.min_lender_interest_rate ? lender.min_lender_interest_rate.toFixed(2) : "0.00";
  const maxRate = lender.max_lender_interest_rate ? lender.max_lender_interest_rate.toFixed(2) : "100.00";
  const interestRateRange = `${minRate}% - ${maxRate}%`;

  return (
    <div className="bg-white rounded-2xl border border-[rgba(245,166,35,0.15)] shadow-md p-6 mb-6">
      <h2 className="text-lg font-extrabold text-[#16120A] border-b-2 border-[#FEF6E4] pb-2 mb-4 flex items-center gap-2">
        <i className="bi bi-bank text-[#C8841A]"></i> Lender Information
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <span className="block text-xs font-bold text-[#6B5E45] uppercase tracking-wider mb-1">Lender Name</span>
          <span className="block text-sm font-bold text-[#16120A]">{name}</span>
          <Link
            href={`/dashboard/browse/${lender.user_id}`}
            className="inline-flex items-center gap-1 text-xs text-[#C8841A] hover:text-[#C8841A] underline font-semibold mt-1 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            View Full Profile <i className="bi bi-box-arrow-up-right"></i>
          </Link>
        </div>

        <div>
          <span className="block text-xs font-bold text-[#6B5E45] uppercase tracking-wider mb-1">Lender Email</span>
          <input
            type="email"
            value={email}
            disabled
            className="w-full border border-gray-200 rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-500 cursor-not-allowed outline-none"
            aria-label="Lender email"
          />
        </div>

        <div>
          <span className="block text-xs font-bold text-[#6B5E45] uppercase tracking-wider mb-1">Maximum Loan Offer</span>
          <span className="block text-sm font-bold text-emerald-700">{maxAmount}</span>
        </div>

        <div>
          <span className="block text-xs font-bold text-[#6B5E45] uppercase tracking-wider mb-1">Interest Rate Bounds</span>
          <span className="block text-sm font-bold text-[#C8841A]">{interestRateRange}</span>
        </div>
      </div>
    </div>
  );
}
