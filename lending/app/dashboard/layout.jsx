import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { sessionOptions } from "@/lib/session";
import DashboardLayoutClient from "./DashboardLayoutClient";

export default async function DashboardLayout({ children }) {
  const cookieStore = await cookies();
  const session = await getIronSession(cookieStore, sessionOptions);
  const userId = session.user_id;

  return (
    <DashboardLayoutClient userId={userId}>
      {children}
    </DashboardLayoutClient>
  );
}
