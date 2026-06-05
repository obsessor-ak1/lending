import { cookies } from "next/headers";
import { sessionOptions } from "@/lib/session";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getIronSession } from "iron-session";

export async function POST(request) {
    const cookieStore = await cookies();
    const session = await getIronSession(cookieStore, sessionOptions);

    // If already logged in, send back the target path as JSON
    if (session.is_logged_in) {
        const redirectTo = session.verified ? '/dashboard' : '/auth/verify';
        return Response.json({ success: true, redirectTo }, { status: 200 });
    }

    try {
        const formData = await request.formData();
        const data = Object.fromEntries(formData.entries());

        if (!data.email || !data.password) {
            return Response.json({ message: "Missing required fields" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email: data.email }
        });

        if (!user) {
            return Response.json({ message: "Invalid credentials" }, { status: 401 }); // Generic safety string
        }

        const match = await bcrypt.compare(data.password, user.password);
        if (!match) {
            return Response.json({ message: "Invalid credentials" }, { status: 401 });
        }

        // Save Session Data
        session.user_id = user.id;
        session.email = user.email;
        session.is_logged_in = true;
        session.verified = user.verified;
        await session.save();

        // Return JSON containing the routing target
        const redirectTo = user.verified ? '/dashboard' : '/auth/verify';
        return Response.json({ success: true, redirectTo }, { status: 200 });

    } catch (error) {
        console.error("Login error:", error);
        return Response.json({ message: "Internal server error." }, { status: 500 });
    }
}