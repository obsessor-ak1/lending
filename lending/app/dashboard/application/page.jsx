import { notFound, redirect } from "next/navigation";
import { verifiedUserRequired } from "@/lib/dependencies";
import { prisma } from "@/lib/prisma";
import ApplicationClient from "./ApplicationClient";

export default async function ApplicationPage({ searchParams }) {
  // Ensure the user is logged in and verified
  const { userId } = await verifiedUserRequired();

  const awaitedSearchParams = await searchParams;
  const lenderIdStr = awaitedSearchParams.lenderId;
  const lenderId = parseInt(lenderIdStr, 10);

  if (isNaN(lenderId)) {
    return notFound();
  }

  // Prevent applying to oneself
  if (userId === lenderId) {
    redirect("/dashboard/browse");
  }

  // Fetch the lender profile and user (email)
  const lender = await prisma.profile.findUnique({
    where: { user_id: lenderId },
    include: {
      user: {
        select: {
          email: true,
        },
      },
    },
  });

  // If the lender does not exist or is not offering loans
  if (!lender || !lender.lender_status) {
    return notFound();
  }

  return (
    <ApplicationClient lender={lender} />
  );
}
