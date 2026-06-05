import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { sessionOptions } from "@/lib/session";

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const session = await getIronSession(cookieStore, sessionOptions);
    session.destroy();

    return Response.json({ success: true, message: "Logged out successfully." }, { status: 200 });
  } catch (error) {
    console.error("Logout API error:", error);
    return Response.json({ message: "Internal server error." }, { status: 500 });
  }
}
