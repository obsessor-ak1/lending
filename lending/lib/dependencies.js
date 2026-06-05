import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { sessionOptions } from "./session";
import { redirect } from "next/navigation";

export async function verifiedUserRequired() {
    const cookieStore = await cookies();
    const session = await getIronSession(cookieStore, sessionOptions);
    const { user_id: userId, verified } = session;
    if (!userId) {
        redirect("/auth?mode=login");
    }
    if (userId && !verified) {
        redirect("/auth/verify");
    }
    return { userId }
}

export async function forwardUser() {
    const cookieStore = await cookies();
    const session = await getIronSession(cookieStore, sessionOptions);
    const { user_id: userId, verified } = session;
    if (userId) {
        if (verified) {
            redirect("/dashboard");
        } else {
            redirect("/auth/verify");
        }
    }
}