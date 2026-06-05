import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { sessionOptions } from "../../../lib/session";
import { redirect } from "next/navigation";
import VerifyClient from "./VerifyClient";
import { Suspense } from "react";

export default async function VerifyPage() {
  const cookieStore = await cookies();
  const session = await getIronSession(cookieStore, sessionOptions);

  // If not logged in, redirect to login page
  if (!session.user_id) {
    redirect("/auth?mode=login");
  }

  // If logged in and already verified, redirect to /dashboard
  if (session.verified) {
    redirect("/dashboard");
  }

  return (
    <Suspense
      fallback={
        <div
          className="min-h-screen flex items-center justify-center bg-[#FEF6E4] text-[#6B5E45] font-semibold"
          role="status"
          aria-live="polite"
        >
          Loading Verification...
        </div>
      }
    >
      <VerifyClient userId={session.user_id} initialEmail={session.email || ""} />
    </Suspense>
  );
}
