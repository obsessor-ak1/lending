import Link from "next/link";

export default function LenderDetailsPanel({ lender, lenderUser }) {
  const lenderName = lender.name || "Anonymous Lender";
  const lenderEmail = lenderUser.email || "";

  const maxAmount = lender.max_amount !== null && lender.max_amount !== undefined
    ? `INR ${lender.max_amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`
    : "N/A";
  const minRate = lender.min_lender_interest_rate ? lender.min_lender_interest_rate.toFixed(2) : "0.00";
  const maxRate = lender.max_lender_interest_rate ? lender.max_lender_interest_rate.toFixed(2) : "100.00";
  const interestRateRange = `${minRate}% - ${maxRate}%`;

  return (
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
  );
}
