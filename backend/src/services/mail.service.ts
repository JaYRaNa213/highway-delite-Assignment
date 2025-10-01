import { TransactionalEmailsApi, TransactionalEmailsApiApiKeys } from "@getbrevo/brevo";

const brevoClient = new TransactionalEmailsApi();

// ✅ ensure API key exists
const brevoApiKey = process.env.BREVO_API_KEY || "";
if (!brevoApiKey) {
  console.error("❌ Missing BREVO_API_KEY in .env");
}
brevoClient.setApiKey(TransactionalEmailsApiApiKeys.apiKey, brevoApiKey);

interface SendEmailOptions {
  toEmail: string;
  toName?: string;
  subject: string;
  htmlContent: string;
  textContent?: string;
  sender?: { email: string; name?: string };
}

// ✅ helper to send an email
export async function sendTransactionalEmail({
  toEmail,
  toName = "",
  subject,
  htmlContent,
  textContent,
  sender,
}: SendEmailOptions): Promise<{ success: boolean; data?: any; error?: any }> {
  try {
    console.log("📨 Attempting to send email...");

    const defaultSenderEmail =
      process.env.EMAIL_FROM?.match(/<(.+)>/)?.[1] || process.env.EMAIL_FROM || "jayrana0909@gmail.com";
    const defaultSenderName =
      process.env.EMAIL_FROM?.split("<")[0]?.trim() || "Highway Delite";

    const payload = {
  to: [{ email: toEmail, ...(toName ? { name: toName } : {}) }], // only add name if not empty
  subject,
  htmlContent,
  textContent,
  sender: sender || { email: defaultSenderEmail, name: defaultSenderName },
};


    const res = await brevoClient.sendTransacEmail(payload);

    console.log(`✅ Email sent successfully to ${toEmail}`);
    return { success: true, data: (res as any).body || res };
  } catch (err: any) {
    console.error("❌ Brevo send error:", err?.body || err);
    return { success: false, error: err?.body || err };
  }
}
