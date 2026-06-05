import Link from "next/link";
import { verifiedUserRequired } from "@/lib/dependencies";
import { prisma } from "@/lib/prisma";
import RequestCard from "./components/RequestCard";

export default async function LenderRequestsPage() {
  // Ensure the user is logged in and verified
  const { userId } = await verifiedUserRequired();

  // Retrieve applications where the user is the lender
  const requests = await prisma.application.findMany({
    where: { to: userId },
    include: {
      borrower: {
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
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-[#16120A] tracking-tight">
            Received Loan Requests
          </h1>
          <p className="text-sm text-[#6B5E45]">
            Manage and respond to borrowing requests submitted by other users.
          </p>
        </div>

        {/* Requests Content */}
        {requests.length === 0 ? (
          <div className="text-center py-20 bg-white border border-[rgba(245,166,35,0.15)] rounded-2xl p-6 shadow-sm">
            <div className="text-4xl mb-3">📥</div>
            <h3 className="font-bold text-gray-800 text-lg">No incoming requests</h3>
            <p className="text-sm text-gray-500 mt-1 max-w-[320px] mx-auto">
              You haven't received any loan requests yet. Make sure your profile has Lender Status enabled and active!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {requests.map((req) => (
              <RequestCard key={req.id} request={req} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
