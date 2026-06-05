import { notFound } from "next/navigation";
import Link from "next/link";
import { verifiedUserRequired } from "@/lib/dependencies";
import { prisma } from "@/lib/prisma";
import ApplicationDetailClient from "./ApplicationDetailClient";

export default async function BorrowerApplicationDetailPage({ params }) {
  // Ensure the user is logged in and verified
  const { userId } = await verifiedUserRequired();

  const awaitedParams = await params;
  const appIdStr = awaitedParams.app_id;
  const appId = parseInt(appIdStr, 10);

  if (isNaN(appId)) {
    return notFound();
  }

  // Retrieve the application with lender details
  const application = await prisma.application.findUnique({
    where: { id: appId },
    include: {
      lender: {
        include: {
          profile: true,
        },
      },
    },
  });

  // Access protection: borrower check (by field must match userId)
  if (!application || application.by !== userId) {
    return notFound();
  }

  return (
    <div className="flex-1 px-4 py-8 bg-[#F8F5F0] min-h-screen">
      <div className="w-full max-w-3xl mx-auto">
        
        {/* Back Link */}
        <Link
          href="/dashboard/applications"
          className="text-[#6B5E45] hover:text-[#16120A] text-sm font-semibold mb-6 inline-flex items-center gap-2 transition-colors no-underline"
        >
          <i className="bi bi-arrow-left"></i> Back to applications
        </Link>

        {/* Header Title */}
        <div className="mb-6 mt-2">
          <h1 className="text-2xl font-extrabold text-[#16120A] tracking-tight">
            Application Details
          </h1>
          <p className="text-sm text-[#6B5E45]">
            Review full submission specifications, lender details, status, and remarks.
          </p>
        </div>

        <ApplicationDetailClient application={application} />

      </div>
    </div>
  );
}
