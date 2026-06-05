import { formatProbabilityPercent, getLoanQualityAssessment } from "@/lib/defaultPrediction";

const TONE_CLASSES = {
  emerald: "bg-emerald-50 text-emerald-800 border-emerald-200",
  green: "bg-green-50 text-green-800 border-green-200",
  amber: "bg-amber-50 text-amber-800 border-amber-200",
  orange: "bg-orange-50 text-orange-800 border-orange-200",
  rose: "bg-rose-50 text-rose-800 border-rose-200",
};

export default function LoanRiskPanel({ riskAssessment }) {
  if (!riskAssessment) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm" aria-labelledby="loan-risk-heading">
        <h2 id="loan-risk-heading" className="text-base font-extrabold text-slate-900 flex items-center gap-2">
          <span aria-hidden="true">📊</span>
          Default Risk Assessment
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          The automated risk assessment is unavailable for this request.
        </p>
      </section>
    );
  }

  const probabilityText = formatProbabilityPercent(riskAssessment.defaultProbability);
  const quality = getLoanQualityAssessment(riskAssessment.defaultProbability);
  const qualityClasses = TONE_CLASSES[quality?.tone] || TONE_CLASSES.amber;
  const percentage = Math.max(0, Math.min(100, riskAssessment.defaultProbability * 100));

  return (
    <section
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      aria-labelledby="loan-risk-heading"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 id="loan-risk-heading" className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <span aria-hidden="true">📊</span>
            Default Risk Assessment
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Estimated from the borrower profile and loan request details.
          </p>
        </div>
        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
          Pending only
        </span>
      </div>

      <dl className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Probability of Default
          </dt>
          <dd className="mt-2 text-3xl font-black text-slate-900" aria-live="polite">
            {probabilityText || "Unavailable"}
          </dd>
          <p className="mt-1 text-xs text-slate-500">
            Chance that this loan will default.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Loan Quality
          </dt>
          <dd className="mt-2">
            <span className={`inline-flex rounded-full border px-3 py-1 text-sm font-bold ${qualityClasses}`}>
              {quality?.label || "Unavailable"}
            </span>
          </dd>
          <p className="mt-2 text-xs text-slate-500">
            {quality?.description || "No rating could be derived from the prediction output."}
          </p>
        </div>
      </dl>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between text-xs font-semibold text-slate-500">
          <span>Risk level</span>
          <span>{probabilityText || "0.0%"}</span>
        </div>
        <div
          className="h-2 w-full rounded-full bg-slate-100"
          role="progressbar"
          aria-label="Probability of default"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(percentage)}
        >
          <div
            className="h-2 rounded-full bg-linear-to-r from-emerald-500 via-amber-400 to-rose-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </section>
  );
}