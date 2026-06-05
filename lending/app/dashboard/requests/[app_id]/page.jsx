import { notFound } from "next/navigation";
import Link from "next/link";
import { verifiedUserRequired } from "@/lib/dependencies";
import { prisma } from "@/lib/prisma";
import RequestDetailClient from "./RequestDetailClient";

export default async function LenderRequestDetailPage({ params }) {
  // Ensure the user is logged in and verified
  const { userId } = await verifiedUserRequired();

  const awaitedParams = await params;
  const appIdStr = awaitedParams.app_id;
  const appId = parseInt(appIdStr, 10);

  if (isNaN(appId)) {
    return notFound();
  }

  // Retrieve the application with borrower details
  const application = await prisma.application.findUnique({
    where: { id: appId },
    include: {
      borrower: {
        include: {
          profile: true,
        },
      },
    },
  });

  // Access protection: lender check (to field must match userId)
  if (!application || application.to !== userId) {
    return notFound();
  }

  return (
    <div className="flex-1 px-4 py-8 bg-[#F8F5F0] min-h-screen">
      <div className="w-full max-w-3xl mx-auto">
        
        {/* Back Link */}
        <Link
          href="/dashboard/requests"
          className="text-[#6B5E45] hover:text-[#16120A] text-sm font-semibold mb-6 inline-flex items-center gap-2 transition-colors no-underline"
        >
          <i className="bi bi-arrow-left"></i> Back to requests
        </Link>

        {/* Header Title */}
        <div className="mb-6 mt-2">
          <h1 className="text-2xl font-extrabold text-[#16120A] tracking-tight">
            Review Loan Request
          </h1>
          <p className="text-sm text-[#6B5E45]">
            Inspect the applicant's credit credentials and decide on this loan application.
          </p>
        </div>

        <RequestDetailClient application={application} />

      </div>
    </div>
  );
}
