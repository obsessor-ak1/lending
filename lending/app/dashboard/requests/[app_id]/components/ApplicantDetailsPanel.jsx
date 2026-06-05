const HOME_OWNERSHIP_MAP = {
  0: "Rent",
  1: "Own",
  2: "Mortgage",
  3: "Other",
};

export default function ApplicantDetailsPanel({ borrower }) {
  const borrowerName = borrower.name || "Anonymous Borrower";
  const homeOwnershipLabel = HOME_OWNERSHIP_MAP[borrower.home_ownership] || "Other";

  return (
    <div className="bg-white rounded-2xl border border-[rgba(245,166,35,0.12)] shadow-sm p-6">
      <h2 className="text-base font-extrabold text-[#16120A] border-b border-gray-100 pb-3 mb-4 flex items-center gap-2">
        <i className="bi bi-person-badge text-[#C8841A]"></i> Applicant Profile Details
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <span className="block text-[10px] font-bold text-[#6B5E45] uppercase tracking-wider">Applicant Name</span>
          <span className="block text-sm font-semibold text-[#16120A]">{borrowerName}</span>
        </div>

        <div className="md:col-span-2">
          <span className="block text-[10px] font-bold text-[#6B5E45] uppercase tracking-wider mb-1">Bio / Profile Description</span>
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 text-sm text-[#16120A] leading-relaxed">
            {borrower.bio || "No description provided."}
          </div>
        </div>

        <div>
          <span className="block text-[10px] font-bold text-[#6B5E45] uppercase tracking-wider">Age</span>
          <span className="block text-sm font-semibold text-[#16120A]">{borrower.age} Years</span>
        </div>

        <div>
          <span className="block text-[10px] font-bold text-[#6B5E45] uppercase tracking-wider">Home Ownership</span>
          <span className="block text-sm font-semibold text-[#16120A]">{homeOwnershipLabel}</span>
        </div>

        <div>
          <span className="block text-[10px] font-bold text-[#6B5E45] uppercase tracking-wider">Employment Duration</span>
          <span className="block text-sm font-semibold text-[#16120A]">{borrower.employment_duration} Months</span>
        </div>

        <div>
          <span className="block text-[10px] font-bold text-[#6B5E45] uppercase tracking-wider">Credit History Length</span>
          <span className="block text-sm font-semibold text-[#16120A]">{borrower.cred_hist_length} Years</span>
        </div>

        <div>
          <span className="block text-[10px] font-bold text-[#6B5E45] uppercase tracking-wider">Previous Defaults</span>
          <span className="block text-sm font-semibold text-[#16120A]">
            {borrower.prev_default ? "⚠️ Yes (Has Default History)" : "✅ No Defaults"}
          </span>
        </div>

        <div>
          <span className="block text-[10px] font-bold text-[#6B5E45] uppercase tracking-wider">Annual Income</span>
          <span className="block text-sm font-semibold text-emerald-700">
            INR {borrower.income?.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>
    </div>
  );
}
