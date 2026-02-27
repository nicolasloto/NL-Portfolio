type Payload = {
  name: string;
  email: string;
  message: string;
};

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function parseBody(body: any): Payload | "bot" | null {
  const name = String(body?.name || "").trim();
  const email = String(body?.email || "").trim();
  const message = String(body?.message || "").trim();
  const botField = String(body?.company || "").trim();

  // Honeypot: silently accept and redirect.
  if (botField) return "bot";

  if (!name || !email || !message) return null;
  if (name.length > 120 || email.length > 200 || message.length > 5000) return null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;

  return { name, email, message };
}

async function sendWithSmtp(payload: Payload): Promise<void> {
  const user = process.env.SMTP_USER;
  const clientId = process.env.GMAIL_CLIENT_ID;
  const clientSecret = process.env.GMAIL_CLIENT_SECRET;
  const refreshToken = process.env.GMAIL_REFRESH_TOKEN;
  const from = process.env.CONTACT_FROM || user;
  const to = process.env.CONTACT_TO || "lotohectornicolas@gmail.com";

  if (!user || !clientId || !clientSecret || !refreshToken || !from) {
    throw new Error("Missing SMTP_USER/GMAIL_CLIENT_ID/GMAIL_CLIENT_SECRET/GMAIL_REFRESH_TOKEN/CONTACT_FROM");
  }

  const nodemailer = await import("nodemailer");
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user,
      clientId,
      clientSecret,
      refreshToken,
    },
  });

  const safeName = escapeHtml(payload.name);
  const safeEmail = escapeHtml(payload.email);
  const safeMessage = escapeHtml(payload.message).replaceAll("\n", "<br/>");
  const sentAt = new Date().toISOString();

  await transporter.sendMail({
    from,
    to,
    replyTo: payload.email,
    subject: `New portfolio message - ${payload.name}`,
    text: `Name: ${payload.name}\nEmail: ${payload.email}\n\n${payload.message}`,
    html: `
      <div style="margin:0;padding:24px;background:#f4f6fb;font-family:Arial,Helvetica,sans-serif;color:#1f2937;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;margin:0 auto;border:1px solid #dbe2f0;border-radius:14px;overflow:hidden;background:#ffffff;">
          <tr>
            <td style="padding:18px 22px;background:linear-gradient(90deg,#0e7490,#312e81,#7e22ce);color:#fff;">
              <h1 style="margin:0;font-size:18px;line-height:1.3;">New Portfolio Contact</h1>
              <p style="margin:6px 0 0;font-size:12px;opacity:.9;">A visitor sent you a new message</p>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 22px;">
              <p style="margin:0 0 10px;font-size:13px;color:#64748b;">Name</p>
              <p style="margin:0 0 16px;font-size:15px;color:#111827;">${safeName}</p>

              <p style="margin:0 0 10px;font-size:13px;color:#64748b;">Email</p>
              <p style="margin:0 0 16px;font-size:15px;">
                <a href="mailto:${safeEmail}" style="color:#2563eb;text-decoration:none;">${safeEmail}</a>
              </p>

              <p style="margin:0 0 10px;font-size:13px;color:#64748b;">Message</p>
              <div style="margin:0;padding:14px;border:1px solid #dbe2f0;border-radius:10px;background:#f8fafc;font-size:14px;line-height:1.6;color:#0f172a;">
                ${safeMessage}
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:14px 22px;border-top:1px solid #e2e8f0;font-size:12px;color:#64748b;">
              Sent at: ${sentAt}
            </td>
          </tr>
        </table>
      </div>
    `,
  });
}

function redirect(res: any, path: string, status = 303): void {
  res.writeHead(status, { Location: path });
  res.end();
}

export default async function handler(req: any, res: any): Promise<void> {
  if (req.method !== "POST") {
    res.statusCode = 405;
    res.end("Method Not Allowed");
    return;
  }

  const payload = parseBody(req.body);

  if (payload === null) {
    redirect(res, "/?contact=invalid#contact");
    return;
  }

  if (payload === "bot") {
    redirect(res, "/thank-you");
    return;
  }

  try {
    await sendWithSmtp(payload);
    redirect(res, "/thank-you");
  } catch (error) {
    console.error("[contact] SMTP send failed:", error);
    redirect(res, "/?contact=error#contact");
  }
}
