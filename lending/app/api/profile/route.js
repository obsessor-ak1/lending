import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { sessionOptions } from "@/lib/session";
import { prisma } from "@/lib/prisma";

async function getAuthenticatedUser() {
  const cookieStore = await cookies();
  const session = await getIronSession(cookieStore, sessionOptions);
  return session.user_id || null;
}

async function parseAndValidateProfile(request) {
  let data = {};
  const contentType = request.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    data = await request.json();
  } else {
    const formData = await request.formData();
    data = Object.fromEntries(formData.entries());
  }

  const name = data.name || null;
  const bio = data.bio || "";
  const age = parseInt(data.age, 10);
  const income = parseFloat(data.income);
  const homeOwnership = parseInt(data.home_ownership, 10);
  const employmentDuration = parseInt(data.employment_duration, 10);
  const prevDefault = data.prev_default === "true" || data.prev_default === true;
  const credHistLength = parseInt(data.cred_hist_length, 10);
  const lenderStatus = data.lender_status === "true" || data.lender_status === true;
  
  let maxAmount = null;
  let minLenderInterestRate = null;
  let maxLenderInterestRate = null;

  if (lenderStatus) {
    maxAmount = parseFloat(data.max_amount);
    minLenderInterestRate = parseFloat(data.min_lender_interest_rate);
    maxLenderInterestRate = parseFloat(data.max_lender_interest_rate);

    if (isNaN(maxAmount) || maxAmount <= 0) {
      throw new Error("Maximum loan amount offer must be a positive number.");
    }
    if (isNaN(minLenderInterestRate) || minLenderInterestRate < 0 || minLenderInterestRate > 100) {
      throw new Error("Minimum interest rate must be between 0% and 100%.");
    }
    if (isNaN(maxLenderInterestRate) || maxLenderInterestRate < 0 || maxLenderInterestRate > 100) {
      throw new Error("Maximum interest rate must be between 0% and 100%.");
    }
    if (minLenderInterestRate > maxLenderInterestRate) {
      throw new Error("Minimum interest rate cannot exceed maximum interest rate.");
    }
  }

  if (
    isNaN(age) ||
    isNaN(income) ||
    isNaN(homeOwnership) ||
    isNaN(employmentDuration) ||
    isNaN(credHistLength)
  ) {
    throw new Error("Invalid numeric or selection fields.");
  }

  return {
    name,
    bio,
    age,
    income,
    home_ownership: homeOwnership,
    employment_duration: employmentDuration,
    prev_default: prevDefault,
    cred_hist_length: credHistLength,
    lender_status: lenderStatus,
    max_amount: maxAmount,
    min_lender_interest_rate: minLenderInterestRate,
    max_lender_interest_rate: maxLenderInterestRate,
  };
}

export async function GET(request) {
  try {
    const userId = await getAuthenticatedUser();
    if (!userId) {
      return Response.json({ message: "Unauthorized." }, { status: 401 });
    }

    const profile = await prisma.profile.findUnique({
      where: { user_id: userId },
    });

    return Response.json({ success: true, profile }, { status: 200 });
  } catch (error) {
    console.error("GET Profile error:", error);
    return Response.json({ message: "Internal server error." }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const userId = await getAuthenticatedUser();
    if (!userId) {
      return Response.json({ message: "Unauthorized." }, { status: 401 });
    }

    let profileData;
    try {
      profileData = await parseAndValidateProfile(request);
    } catch (err) {
      return Response.json({ message: err.message }, { status: 400 });
    }

    const profile = await prisma.profile.create({
      data: {
        user_id: userId,
        ...profileData,
      },
    });

    return Response.json({
      success: true,
      profile,
      message: "Profile created successfully.",
    }, { status: 200 });

  } catch (error) {
    console.error("POST Profile error:", error);
    return Response.json({ message: "Internal server error." }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const userId = await getAuthenticatedUser();
    if (!userId) {
      return Response.json({ message: "Unauthorized." }, { status: 401 });
    }

    let profileData;
    try {
      profileData = await parseAndValidateProfile(request);
    } catch (err) {
      return Response.json({ message: err.message }, { status: 400 });
    }

    // Exclude prev_default from updates to make it non-editable (immutable)
    delete profileData.prev_default;

    const profile = await prisma.profile.update({
      where: { user_id: userId },
      data: profileData,
    });

    return Response.json({
      success: true,
      profile,
      message: "Profile updated successfully.",
    }, { status: 200 });

  } catch (error) {
    console.error("PUT Profile error:", error);
    return Response.json({ message: "Internal server error." }, { status: 500 });
  }
}
