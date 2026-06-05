import { verifiedUserRequired } from "@/lib/dependencies";
import { prisma } from "@/lib/prisma";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export async function GET(request) {
  try {
    // 1. Authenticate user
    const { userId } = await verifiedUserRequired();

    // 2. Query user's applications (where they are the borrower)
    const applications = await prisma.application.findMany({
      where: { by: userId },
      orderBy: { created_at: "desc" },
    });

    return Response.json({
      success: true,
      applications,
    }, { status: 200 });

  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    console.error("GET Applications error:", error);
    return Response.json({ message: "Internal server error." }, { status: 500 });
  }
}
