import { useState } from "react";

const PURPOSE_OPTIONS = [
  { value: "VENTURE", label: "Business / Venture" },
  { value: "EDUCATION", label: "Education" },
  { value: "MEDICAL", label: "Medical Expenses" },
  { value: "PERSONAL", label: "Personal Loan" },
  { value: "DEBTCONSOLIDATION", label: "Debt Consolidation" },
  { value: "HOMEIMPROVEMENT", label: "Home Improvement" },
  { value: "OTHER", label: "Other Purpose" },
];

export default function ApplicationForm({ lender, onSubmit, submitting }) {
  const [form, setForm] = useState({
    purpose: "PERSONAL",
    description: "",
    amount: "",
    interest_rate: "",
  });

  const [validationError, setValidationError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setValidationError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Client-side validations
    const amt = parseFloat(form.amount);
    const rate = parseFloat(form.interest_rate);

    if (isNaN(amt) || amt <= 0) {
      setValidationError("Requested amount must be a positive number.");
      return;
    }

    if (lender.max_amount !== null && amt > lender.max_amount) {
      setValidationError(`Requested amount cannot exceed the lender's maximum limit of INR ${lender.max_amount.toLocaleString()}.`);
      return;
    }

    if (isNaN(rate) || rate < 0 || rate > 100) {
      setValidationError("Interest rate must be between 0% and 100%.");
      return;
    }

    if (lender.min_lender_interest_rate !== null && rate < lender.min_lender_interest_rate) {
      setValidationError(`Requested interest rate cannot be lower than the lender's minimum rate of ${lender.min_lender_interest_rate}%.`);
      return;
    }

    if (lender.max_lender_interest_rate !== null && rate > lender.max_lender_interest_rate) {
      setValidationError(`Requested interest rate cannot exceed the lender's maximum rate of ${lender.max_lender_interest_rate}%.`);
      return;
    }

    if (!form.description.trim()) {
      setValidationError("Please provide a description of the loan request.");
      return;
    }

    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[rgba(245,166,35,0.15)] shadow-md p-6">
      <h2 className="text-lg font-extrabold text-[#16120A] border-b-2 border-[#FEF6E4] pb-2 mb-6 flex items-center gap-2">
        <i className="bi bi-file-earmark-text text-[#C8841A]"></i> Application Form
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Read-only Lender Email */}
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label htmlFor="lender_email_form" className="text-xs font-bold text-[#6B5E45] uppercase tracking-wider">Lender Email</label>
          <input
            id="lender_email_form"
            type="email"
            value={lender.user?.email || ""}
            disabled
            className="w-full border border-gray-200 rounded-lg bg-gray-50 px-3.5 py-2.5 text-sm text-gray-500 cursor-not-allowed outline-none"
          />
        </div>

        {/* Loan Purpose */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="purpose" className="text-xs font-bold text-[#6B5E45] uppercase tracking-wider">Loan Purpose</label>
          <select
            id="purpose"
            name="purpose"
            value={form.purpose}
            onChange={handleChange}
            className="w-full border border-gray-200 rounded-lg bg-white px-3.5 py-2.5 text-sm text-gray-800 focus:border-[#F5A623] focus:ring-2 focus:ring-[rgba(245,166,35,0.15)] outline-none transition-all"
            required
          >
            {PURPOSE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Amount Requested */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="amount" className="text-xs font-bold text-[#6B5E45] uppercase tracking-wider">Amount Requested (INR)</label>
          <input
            id="amount"
            type="number"
            name="amount"
            min="1"
            step="any"
            value={form.amount}
            onChange={handleChange}
            placeholder={`Max limit: ${lender.max_amount ? lender.max_amount.toLocaleString("en-IN") : "N/A"}`}
            className="w-full border border-gray-200 rounded-lg bg-white px-3.5 py-2.5 text-sm text-gray-800 focus:border-[#F5A623] focus:ring-2 focus:ring-[rgba(245,166,35,0.15)] outline-none transition-all"
            required
          />
        </div>

        {/* Interest Rate */}
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label htmlFor="interest_rate" className="text-xs font-bold text-[#6B5E45] uppercase tracking-wider">Interest Rate (%)</label>
          <input
            id="interest_rate"
            type="number"
            name="interest_rate"
            min="0"
            max="100"
            step="0.01"
            value={form.interest_rate}
            onChange={handleChange}
            placeholder={`Allowed: ${lender.min_lender_interest_rate}% - ${lender.max_lender_interest_rate}%`}
            className="w-full border border-gray-200 rounded-lg bg-white px-3.5 py-2.5 text-sm text-gray-800 focus:border-[#F5A623] focus:ring-2 focus:ring-[rgba(245,166,35,0.15)] outline-none transition-all"
            required
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label htmlFor="description" className="text-xs font-bold text-[#6B5E45] uppercase tracking-wider">Description / Proposal</label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Outline your reasoning for request, terms of payback, or other particulars..."
            rows="4"
            className="w-full border border-gray-200 rounded-lg bg-white px-3.5 py-2.5 text-sm text-gray-800 focus:border-[#F5A623] focus:ring-2 focus:ring-[rgba(245,166,35,0.15)] outline-none transition-all"
            required
          />
        </div>

      </div>

      {validationError && (
        <div className="mt-4 p-3 text-xs font-semibold text-red-800 bg-red-50 border border-red-200 rounded-lg">
          ⚠️ {validationError}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-[#F5A623] hover:bg-[#C8841A] hover:text-white text-[#16120A] font-bold rounded-xl py-3 mt-6 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {submitting ? "Submitting Application..." : "Submit Application"}
      </button>
    </form>
  );
}
