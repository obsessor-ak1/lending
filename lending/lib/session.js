import { getIronSession } from "iron-session";

export const sessionOptions = {
    password: process.env.SESSION_COOKIE_PASSWORD,
    cookieName: "borrowbee_session",
    cookieOptions: {
        secure: process.env.NODE_ENV === "production",
    },
};

export async function getSession(req, res) {
    return await getIronSession(req, res, sessionOptions);
}