import { Resend } from "resend";
import { SALON_TIMEZONE } from "@/lib/timezone";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM = process.env.EMAIL_FROM ?? "Amara Studio <onboarding@resend.dev>";
const SITE_URL = process.env.SITE_URL ?? "http://localhost:3000";

const DATE_FORMATTER = new Intl.DateTimeFormat("de-DE", {
  timeZone: SALON_TIMEZONE,
  weekday: "long",
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const TIME_FORMATTER = new Intl.DateTimeFormat("de-DE", {
  timeZone: SALON_TIMEZONE,
  hour: "2-digit",
  minute: "2-digit",
});

const PRICE_FORMATTER = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
});

interface BookingEmailData {
  customerName: string;
  customerEmail: string;
  serviceName: string;
  staffName: string;
  startTime: Date;
  priceCents: number;
  managementToken: string;
}

function layout(preheader: string, heading: string, bodyHtml: string) {
  return `
<div style="background-color:#f7f4ef;padding:40px 16px;font-family:Georgia,'Times New Roman',serif;color:#1c1210;">
  <div style="display:none;max-height:0;overflow:hidden;">${preheader}</div>
  <div style="max-width:480px;margin:0 auto;background-color:#ffffff;border:1px solid #e7e2da;border-radius:24px;overflow:hidden;">
    <div style="background-color:#1c1210;padding:32px 32px 28px;">
      <p style="margin:0;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#cdbfba;">Amara Studio</p>
      <h1 style="margin:8px 0 0;font-size:24px;line-height:1.3;color:#f7f4ef;font-weight:400;">${heading}</h1>
    </div>
    <div style="padding:32px;">
      ${bodyHtml}
    </div>
    <div style="padding:20px 32px;border-top:1px solid #e7e2da;">
      <p style="margin:0;font-size:12px;color:#6a5f5e;font-family:Arial,sans-serif;">Amara Studio &middot; diese Mail wurde automatisch versendet.</p>
    </div>
  </div>
</div>`;
}

function detailsTable(data: BookingEmailData) {
  const rows: [string, string][] = [
    ["Termin", `${DATE_FORMATTER.format(data.startTime)}, ${TIME_FORMATTER.format(data.startTime)} Uhr`],
    ["Service", data.serviceName],
    ["Bei", data.staffName],
    ["Preis", PRICE_FORMATTER.format(data.priceCents / 100)],
  ];

  return `
<table role="presentation" style="width:100%;border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px;">
  ${rows
    .map(
      ([label, value]) => `
  <tr>
    <td style="padding:8px 0;color:#6a5f5e;width:90px;vertical-align:top;">${label}</td>
    <td style="padding:8px 0;color:#1c1210;">${value}</td>
  </tr>`
    )
    .join("")}
</table>`;
}

function manageLink(token: string) {
  const url = `${SITE_URL}/termin/${token}`;
  return `
<p style="margin:28px 0 0;font-family:Arial,sans-serif;">
  <a href="${url}" style="display:inline-block;background-color:#d96b84;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:999px;font-size:14px;">Termin verwalten</a>
</p>
<p style="margin:12px 0 0;font-family:Arial,sans-serif;font-size:12px;color:#6a5f5e;word-break:break-all;">${url}</p>`;
}

export async function sendBookingConfirmationEmail(data: BookingEmailData) {
  const html = layout(
    `Deine Buchung bei Amara Studio ist bestätigt.`,
    "Dein Termin ist bestätigt",
    `
<p style="margin:0 0 20px;font-family:Arial,sans-serif;font-size:14px;color:#1c1210;">Hallo ${data.customerName}, wir freuen uns auf deinen Besuch:</p>
${detailsTable(data)}
${manageLink(data.managementToken)}`
  );

  await sendMail({
    to: data.customerEmail,
    subject: "Terminbestätigung – Amara Studio",
    html,
  });
}

export async function sendBookingReminderEmail(data: BookingEmailData) {
  const html = layout(
    `Erinnerung: dein Termin bei Amara Studio ist morgen.`,
    "Bis morgen!",
    `
<p style="margin:0 0 20px;font-family:Arial,sans-serif;font-size:14px;color:#1c1210;">Hallo ${data.customerName}, kurze Erinnerung an deinen Termin morgen:</p>
${detailsTable(data)}
${manageLink(data.managementToken)}`
  );

  await sendMail({
    to: data.customerEmail,
    subject: "Erinnerung: dein Termin morgen – Amara Studio",
    html,
  });
}

async function sendMail(options: { to: string; subject: string; html: string }) {
  if (!resend) {
    console.warn(
      `[email] RESEND_API_KEY fehlt – Mail nicht versendet (an ${options.to}, Betreff: "${options.subject}")`
    );
    return;
  }

  const { error } = await resend.emails.send({
    from: FROM,
    to: options.to,
    subject: options.subject,
    html: options.html,
  });

  if (error) {
    console.error("[email] Versand fehlgeschlagen:", error);
  }
}
