import LenderDetailsPanel from "./components/LenderDetailsPanel";
import ApplicationDetailsPanel from "./components/ApplicationDetailsPanel";

const STATUS_CLASSES = {
  PENDING: "bg-amber-50 text-amber-800 border-amber-200",
  APPROVED: "bg-green-50 text-green-800 border-green-200",
  REJECTED: "bg-red-50 text-red-800 border-red-200",
};

export default function ApplicationDetailClient({ application }) {
  const lender = application.lender?.profile || {};
  const lenderUser = application.lender || {};
  
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
      
      {/* 1. Lender credentials panel */}
      <LenderDetailsPanel lender={lender} lenderUser={lenderUser} />

      {/* 2. Application specifications panel */}
      <ApplicationDetailsPanel application={application} />

      {/* 3. Decisional status / remarks display */}
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
