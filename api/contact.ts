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

async function sendWithResend(payload: Payload): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM;
  const to = "lotohectornicolas@gmail.com";

  if (!apiKey || !from) {
    throw new Error("Missing RESEND_API_KEY or CONTACT_FROM");
  }

  const safeName = escapeHtml(payload.name);
  const safeEmail = escapeHtml(payload.email);
  const safeMessage = escapeHtml(payload.message).replaceAll("\n", "<br/>");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: payload.email,
      subject: `Nuevo mensaje de portfolio - ${payload.name}`,
      text: `Name: ${payload.name}\nEmail: ${payload.email}\n\n${payload.message}`,
      html: `<p><strong>Name:</strong> ${safeName}</p><p><strong>Email:</strong> ${safeEmail}</p><p><strong>Message:</strong><br/>${safeMessage}</p>`,
    }),
  });

  if (!response.ok) {
    const reason = await response.text();
    throw new Error(`Resend failed: ${reason}`);
  }
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
    await sendWithResend(payload);
    redirect(res, "/thank-you");
  } catch {
    redirect(res, "/?contact=error#contact");
  }
}
