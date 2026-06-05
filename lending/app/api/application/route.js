import { verifiedUserRequired } from "@/lib/dependencies";
import { prisma } from "@/lib/prisma";
import { isRedirectError } from "next/dist/client/components/redirect-error";

const VALID_PURPOSES = [
  "VENTURE",
  "EDUCATION",
  "MEDICAL",
  "PERSONAL",
  "DEBTCONSOLIDATION",
  "HOMEIMPROVEMENT",
  "OTHER"
];

// Helper validation function
export function validateApplication(data, lenderProfile) {
  if (!lenderProfile) {
    throw new Error("Lender profile not found.");
  }
  if (!lenderProfile.lender_status) {
    throw new Error("This user is not active as a lender.");
  }

  const amount = parseFloat(data.amount);
  if (isNaN(amount) || amount <= 0) {
    throw new Error("Requested amount must be a positive number.");
  }

  const maxAmount = lenderProfile.max_amount;
  if (maxAmount !== null && amount > maxAmount) {
    throw new Error(`Requested amount exceeds the maximum amount the lender can offer (INR ${maxAmount.toLocaleString()}).`);
  }

  const interestRate = parseFloat(data.interest_rate);
  if (isNaN(interestRate) || interestRate < 0 || interestRate > 100) {
    throw new Error("Requested interest rate must be between 0% and 100%.");
  }

  const minRate = lenderProfile.min_lender_interest_rate;
  const maxRate = lenderProfile.max_lender_interest_rate;

  if (minRate !== null && interestRate < minRate) {
    throw new Error(`Requested interest rate is below the lender's minimum rate of ${minRate}%.`);
  }

  if (maxRate !== null && interestRate > maxRate) {
    throw new Error(`Requested interest rate exceeds the lender's maximum rate of ${maxRate}%.`);
  }

  if (!data.purpose) {
    throw new Error("Loan purpose is required.");
  }

  if (!VALID_PURPOSES.includes(data.purpose)) {
    throw new Error("Invalid loan purpose category.");
  }

  if (!data.description || data.description.trim() === "") {
    throw new Error("Description is required.");
  }
}

export async function POST(request) {
  try {
    // 1. Authenticate user
    const { userId } = await verifiedUserRequired();

    // 2. Parse request body
    let data = {};
    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      data = await request.json();
    } else {
      const formData = await request.formData();
      data = Object.fromEntries(formData.entries());
    }

    const lenderId = parseInt(data.lenderId, 10);
    if (isNaN(lenderId)) {
      return Response.json({ message: "Invalid lender ID." }, { status: 400 });
    }

    if (userId === lenderId) {
      return Response.json({ message: "You cannot apply for a loan from yourself." }, { status: 400 });
    }

    // 3. Retrieve lender profile
    const lenderProfile = await prisma.profile.findUnique({
      where: { user_id: lenderId },
    });

    // 4. Validate application data
    try {
      validateApplication(data, lenderProfile);
    } catch (valError) {
      return Response.json({ message: valError.message }, { status: 400 });
    }

    // 5. Create application
    const application = await prisma.application.create({
      data: {
        by: userId,
        to: lenderId,
        purpose: data.purpose,
        description: data.description.trim(),
        amount: parseFloat(data.amount),
        interest_rate: parseFloat(data.interest_rate),
        status: "PENDING",
      },
    });

    return Response.json({
      success: true,
      application,
      message: "Application submitted successfully.",
    }, { status: 200 });

  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    console.error("POST Application error:", error);
    return Response.json({ message: "Internal server error." }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    // 1. Authenticate user
    const { userId } = await verifiedUserRequired();

    // 2. Parse request query params (app_id or appId)
    const { searchParams } = new URL(request.url);
    const appIdStr = searchParams.get("app_id") || searchParams.get("appId");
    const appId = parseInt(appIdStr, 10);

    if (isNaN(appId)) {
      return Response.json({ message: "Invalid application ID." }, { status: 400 });
    }

    // 3. Parse request body
    let data = {};
    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      data = await request.json();
    } else {
      const formData = await request.formData();
      data = Object.fromEntries(formData.entries());
    }

    const { status, remarks } = data;

    if (!status || (status !== "APPROVED" && status !== "REJECTED")) {
      return Response.json({ message: "Invalid or missing status. Must be APPROVED or REJECTED." }, { status: 400 });
    }

    // 4. Retrieve application
    const application = await prisma.application.findUnique({
      where: { id: appId },
    });

    if (!application) {
      return Response.json({ message: "Application not found." }, { status: 404 });
    }

    // 5. Verify security: only the lender (the user in the "to" field) can modify the request
    if (application.to !== userId) {
      return Response.json({ message: "Forbidden. You are not authorized to decide on this application." }, { status: 403 });
    }

    // 6. Verify status: can only decide on pending requests
    if (application.status !== "PENDING") {
      return Response.json({ message: "This application has already been processed and cannot be modified." }, { status: 400 });
    }

    // 6. Update status and remarks
    const updatedApp = await prisma.application.update({
      where: { id: appId },
      data: {
        status: status,
        remarks: remarks || null,
        updated_at: new Date(),
      },
    });

    return Response.json({
      success: true,
      application: updatedApp,
      message: `Application has been successfully ${status.toLowerCase()}.`,
    }, { status: 200 });

  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    console.error("PUT Application error:", error);
    return Response.json({ message: "Internal server error." }, { status: 500 });
  }
}
