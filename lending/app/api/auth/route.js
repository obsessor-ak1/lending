import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function GET(request) {
    const redirectUrl = new URL('/auth?mode=signup', request.url);
    return Response.redirect(redirectUrl, 302);
}

export async function POST(request) {
    try {
        let data = {};
        const contentType = request.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
            data = await request.json();
        } else {
            const formData = await request.formData();
            data = Object.fromEntries(formData.entries());
        }

        if (!data.email || !data.phone || !data.password) {
            return Response.json({ message: "Missing required fields." }, { status: 400 });
        }

        // Clean phone number to integer
        const phoneNo = parseInt(data.phone.replace(/\D/g, ""), 10);
        if (isNaN(phoneNo)) {
            return Response.json({ message: "Invalid phone number." }, { status: 400 });
        }
        const phoneNoStr = phoneNo.toString();
        // Check if user already exists

        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: data.email },
                    { phone_no: phoneNoStr }
                ]
            }
        });

        if (existingUser) {
            return Response.json({ message: "User already exists." }, { status: 400 });
        }

        // Create the new user
        const salts = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(data.password, salts);
        const [user] = await prisma.user.createManyAndReturn({
            data: [{
                email: data.email,
                phone_no: phoneNoStr,
                password: hashedPassword
            }]
        });
        return Response.json({ message: "User created successfully." }, { status: 200 });

    } catch (error) {
        console.error("Signup error:", error);
        return Response.json({ message: "Internal server error." }, { status: 500 });
    }
}