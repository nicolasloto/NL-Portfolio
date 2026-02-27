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
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || "587");
  const secure = String(process.env.SMTP_SECURE || "false") === "true";
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.CONTACT_FROM || user;
  const to = process.env.CONTACT_TO || "lotohectornicolas@gmail.com";

  if (!host || !port || !user || !pass || !from) {
    throw new Error("Missing SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS/CONTACT_FROM");
  }

  const nodemailer = await import("nodemailer");
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });

  const safeName = escapeHtml(payload.name);
  const safeEmail = escapeHtml(payload.email);
  const safeMessage = escapeHtml(payload.message).replaceAll("\n", "<br/>");

  await transporter.sendMail({
    from,
    to,
    replyTo: payload.email,
    subject: `New portfolio message - ${payload.name}`,
    text: `Name: ${payload.name}\nEmail: ${payload.email}\n\n${payload.message}`,
    html: `<p><strong>Name:</strong> ${safeName}</p><p><strong>Email:</strong> ${safeEmail}</p><p><strong>Message:</strong><br/>${safeMessage}</p>`,
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
