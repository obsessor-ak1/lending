import { notFound } from "next/navigation";
import Link from "next/link";
import { verifiedUserRequired } from "@/lib/dependencies";
import { prisma } from "@/lib/prisma";
import RequestDetailClient from "./RequestDetailClient";
import {
  buildDefaultPredictionPayload,
  normalizeDefaultProbability,
  getLoanQualityAssessment,
} from "@/lib/defaultPrediction";

async function getDefaultRiskAssessment(application) {
  if (application.status !== "PENDING") {
    return null;
  }

  const apiUrl = process.env.DEFAULT_PREDICTION_API_URL;
  const apiKey = process.env.DEFAULT_PREDICTION_API_KEY;
  const apiHeader = process.env.DEFAULT_PREDICTION_API_HEADER || "X-API-Key";

  if (!apiUrl || !apiKey) {
    return null;
  }

  const payload = buildDefaultPredictionPayload(application);
  if (!payload) {
    return null;
  }

  try {
    const response = await fetch(`${apiUrl.replace(/\/$/, "")}/default_pred/default`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        [apiHeader]: apiKey,
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const defaultProbability = normalizeDefaultProbability(data?.default_probability);

    if (defaultProbability === null) {
      return null;
    }

    return {
      defaultProbability,
      quality: getLoanQualityAssessment(defaultProbability),
      payload,
    };
  } catch (error) {
    console.error("Failed to fetch default risk assessment:", error);
    return null;
  }
}

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

  const riskAssessment = await getDefaultRiskAssessment(application);

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

        <RequestDetailClient application={application} riskAssessment={riskAssessment} />

      </div>
    </div>
  );
}
