"use server";

import crypto from "crypto";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { sessionOptions } from "./session";
import { prisma } from "./prisma";
import { transporter } from "./email";

function generateVerificationCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[crypto.randomInt(0, chars.length)];
  }
  return code;
}

function getVerificationEmailHtml(code, expiryString) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>BorrowBee — Verify Your Account</title>
</head>
<body style="margin:0;padding:0;background:#FEF6E4;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">

  <!-- Outer wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FEF6E4;padding:40px 16px;">
    <tr>
      <td align="center">

        <!-- Card -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0"
               style="max-width:480px;background:#ffffff;border-radius:16px;border:1px solid rgba(245,166,35,0.2);overflow:hidden;">

          <!-- Header -->
          <tr>
            <td align="center" style="padding:32px 40px 28px;border-bottom:1px solid #FEF0D0;">
              <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="background:#F5A623;border-radius:10px;width:36px;height:36px;text-align:center;vertical-align:middle;font-size:18px;line-height:36px;">
                    🐝
                  </td>
                  <td style="padding-left:10px;font-size:20px;font-weight:800;color:#16120A;vertical-align:middle;letter-spacing:-0.3px;">
                    Borrow<span style="color:#C8841A;">Bee</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 40px 32px;">

              <p style="margin:0 0 6px;font-size:20px;font-weight:800;color:#16120A;letter-spacing:-0.4px;">
                Verify your account
              </p>
              <p style="margin:0 0 28px;font-size:14px;color:#6B5E45;line-height:1.7;">
                Use the code below to complete your sign-up. It expires in <strong style="color:#16120A;">10 minutes</strong>.
              </p>

              <!-- OTP block -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;">
                <tr>
                  <td align="center"
                      style="background:#FEF6E4;border:1.5px dashed #F5A623;border-radius:12px;padding:22px 16px;">
                    <p style="margin:0 0 6px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#C8841A;">
                      Your verification code
                    </p>
                    <p style="margin:0;font-size:38px;font-weight:800;letter-spacing:14px;color:#16120A;font-family:'Courier New',Courier,monospace;">
                      ${code}
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Expiry notice -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;">
                <tr>
                  <td style="background:#FFF8EC;border-left:3px solid #F5A623;border-radius:0 8px 8px 0;padding:12px 16px;">
                    <p style="margin:0;font-size:13px;color:#6B5E45;line-height:1.6;">
                      ⏱ This code expires on
                      <strong style="color:#16120A;">${expiryString}</strong>.
                      Do not share it with anyone.
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin:0;font-size:13px;color:#6B5E45;line-height:1.7;">
                If you didn't request this, you can safely ignore this email. Your account will not be created unless this code is entered.
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px;border-top:1px solid #FEF0D0;background:#FFFBF5;">
              <p style="margin:0;font-size:12px;color:#bbb;text-align:center;line-height:1.7;">
                © 2025 BorrowBee &nbsp;·&nbsp;
                <a href="#" style="color:#C8841A;text-decoration:none;">Privacy Policy</a>
                &nbsp;·&nbsp;
                <a href="#" style="color:#C8841A;text-decoration:none;">Unsubscribe</a>
              </p>
            </td>
          </tr>

        </table>
        <!-- /Card -->

      </td>
    </tr>
  </table>

</body>
</html>`;
}

export async function sendVerificationEmail(user_id, email) {
  const code = generateVerificationCode();
  const expiryTime = new Date(Date.now() + 10 * 60 * 1000);

  await prisma.verificationCode.create({
    data: {
      user_id: user_id,
      code: code,
      expires_at: expiryTime
    }
  });

  const expiryString = expiryTime.toLocaleString("en-IN", { dateStyle: "full", timeStyle: "short" });
  const htmlContent = getVerificationEmailHtml(code, expiryString);
  await transporter.sendMail({
    from: '"BorrowBee 🐝" <no-reply@borrowbee.com>',
    to: email,
    subject: "Verify your account",
    html: htmlContent
  });
  return { code, expiryTime: expiryTime.getTime(), htmlContent };
}


export async function verifyCode(email, code) {
  const cookieStore = await cookies()
  const session = await getIronSession(cookieStore, sessionOptions);
  const record = await prisma.verificationCode.findFirst({
    where: {
      user_id: session.user_id,
      used: false, // Make sure it hasn't been used yet
    },
    orderBy: {
      created_at: "desc", // Newest code sitting on top
    },
  });
  if (!record) {
    throw new Error("Invalid or expired verification code.");
  }
  // Check if code is expired
  if (new Date() > record.expires_at) {
    throw new Error("Verification code has expired.");
  }

  // Mark code as used
  await prisma.verificationCode.update({
    where: { id: record.id },
    data: { used: true }
  });

  // Mark user as verified
  await prisma.user.update({
    where: { id: record.user_id },
    data: { verified: true }
  });

  session.verified = true;
  await session.save();

  return { verified: true };
}
