import Link from "next/link";
import { verifiedUserRequired } from "@/lib/dependencies";
import { prisma } from "@/lib/prisma";
import ApplicationCard from "./components/ApplicationCard";

export default async function BorrowerApplicationsPage() {
  // Ensure the user is logged in and verified
  const { userId } = await verifiedUserRequired();

  // Retrieve applications where the user is the borrower
  const applications = await prisma.application.findMany({
    where: { by: userId },
    include: {
      lender: {
        include: {
          profile: true,
        },
      },
    },
    orderBy: { created_at: "desc" },
  });

  return (
    <div className="flex-1 px-4 py-8 bg-[#F8F5F0]">
      <div className="w-full max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="mb-8 flex justify-between items-center gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-extrabold text-[#16120A] tracking-tight">
              My Applications
            </h1>
            <p className="text-sm text-[#6B5E45]">
              Track the status of your current borrowing requests and details.
            </p>
          </div>
          <Link
            href="/dashboard/browse"
            className="bg-[#F5A623] hover:bg-[#C8841A] text-[#16120A] hover:text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md no-underline flex items-center gap-1.5"
          >
            <i className="bi bi-search text-xs"></i> Browse Lenders
          </Link>
        </div>

        {/* List Content */}
        {applications.length === 0 ? (
          <div className="text-center py-20 bg-white border border-[rgba(245,166,35,0.15)] rounded-2xl p-6 shadow-sm">
            <div className="text-4xl mb-3">📄</div>
            <h3 className="font-bold text-gray-800 text-lg">No applications submitted</h3>
            <p className="text-sm text-gray-500 mt-1 max-w-[320px] mx-auto mb-6">
              You haven't requested any loans yet. Browse our active lenders list to find matching offers.
            </p>
            <Link
              href="/dashboard/browse"
              className="inline-flex bg-[#FEF6E4] hover:bg-[#F5A623] hover:text-[#16120A] text-[#C8841A] text-xs font-bold px-5 py-3 rounded-xl transition-all no-underline"
            >
              Browse Active Lenders
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {applications.map((app) => (
              <ApplicationCard key={app.id} application={app} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
