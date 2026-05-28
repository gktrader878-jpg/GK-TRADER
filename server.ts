import express from "express";
import path from "path";
import fs from "fs";
import cors from "cors";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import https from "https";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || "3000", 10);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Helper inside server to get standard IST formatted date string
function getISTDateString(): string {
  const date = new Date();
  const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
  const istTime = new Date(utc + (3600000 * 5.5)); // IST is UTC+5.5
  
  const pad = (n: number) => n.toString().padStart(2, '0');
  const yyyy = istTime.getFullYear();
  const mm = pad(istTime.getMonth() + 1);
  const dd = pad(istTime.getDate());
  const hh = pad(istTime.getHours());
  const min = pad(istTime.getMinutes());
  const ss = pad(istTime.getSeconds());
  
  return `${yyyy}-${mm}-${dd}T${hh}:${min}:${ss}+05:30`;
}

// Nodemailer Transporter builder
function getMailerTransporter() {
  const host = process.env.EMAIL_HOST || "smtp.gmail.com";
  const port = parseInt(process.env.EMAIL_PORT || "587", 10);
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass || pass === "your_gmail_app_password" || (user === "sampatskumbhar@gmail.com" && pass.startsWith("your_"))) {
    console.log("[Nodemailer] WARNING: Real SMTP Credentials not configured in .env, fallback logging mock transporter activated.");
    return {
      sendMail: async (options: any) => {
        console.log("\n================ [DRY-RUN SMTP DISPATCHED EMAIL] ================");
        console.log(`From: ${options.from}`);
        console.log(`To: ${options.to}`);
        console.log(`Subject: ${options.subject}`);
        console.log("-----------------------------------------");
        console.log(options.html);
        console.log("=================================================================\n");
        return { messageId: "SSE-MOCK-SMTP-" + Date.now() };
      }
    };
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });
}

// WhatsApp alert sender using Free CallMeBot API or logging fallback if credentials missing
function sendWhatsAppNotification(name: string, company: string, phone: string, service: string, quantity: string, timeline: string) {
  const botPhone = process.env.CALLMEBOT_PHONE;
  const botApiKey = process.env.CALLMEBOT_API_KEY;

  const msg = `📋 New RFQ from ${company}
👤 ${name} | 📞 ${phone}
🔧 Service: ${service}
📦 Qty: ${quantity || "Not specified"}
⏱ Timeline: ${timeline || "Not specified"}
Reply or call: ${phone}`;

  console.log("\n================ [WHATSAPP DISPATCH LOG] ================");
  console.log(msg);
  console.log("=========================================================\n");

  if (!botPhone || !botApiKey) {
    console.log("[WhatsApp] No CallMeBot credentials in env, skipped API fetch.");
    return;
  }

  const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(botPhone)}&text=${encodeURIComponent(msg)}&apikey=${encodeURIComponent(botApiKey)}`;

  https.get(url, (res) => {
    let rawData = "";
    res.on("data", (chunk) => { rawData += chunk; });
    res.on("end", () => {
      console.log(`[WhatsApp] CallMeBot Response Status: ${res.statusCode}, Body: ${rawData}`);
    });
  }).on("error", (err) => {
    console.error("[WhatsApp] CallMeBot Network error:", err.message);
  });
}

// B2B RFQ Post Endpoint
app.post("/api/rfq", async (req, res) => {
  try {
    const { name, company, phone, email, service, quantity, timeline, description } = req.body;

    // STEP 1 — VALIDATE INPUT
    if (!name || !company || !phone || !email || !service || !description) {
      return res.status(400).json({ success: false, error: "Validation incomplete: Missing required parameters" });
    }

    if (description.trim().length < 10) {
      return res.status(400).json({ success: false, error: "Validation incomplete: Project description must be at least 10 characters long" });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, error: "Validation incomplete: Invalid email address format" });
    }

    // Phone validation: phone numeric and min 10 digits
    const digitsOnly = phone.replace(/[^\d]/g, "");
    if (digitsOnly.length < 10) {
      return res.status(400).json({ success: false, error: "Validation incomplete: Phone number must contain at least 10 numeric digits" });
    }

    // STEP 4 — SAVE TO JSON LOG FILE
    const LOG_FILE = path.join(process.cwd(), "rfq_log.json");
    let logs: any[] = [];
    if (fs.existsSync(LOG_FILE)) {
      try {
        const raw = fs.readFileSync(LOG_FILE, "utf-8");
        logs = JSON.parse(raw || "[]");
      } catch (e) {
        console.error("Error reading rfq_log.json, resetting array", e);
      }
    }

    // Find next numeric ID e.g. RFQ-001, RFQ-002
    const ids = logs.map((log: any) => {
      const match = log.id ? log.id.match(/RFQ-(\d+)/) : null;
      return match ? parseInt(match[1], 10) : 0;
    });
    const maxNumber = Math.max(...ids, 0);
    const nextNumber = maxNumber + 1;
    const newId = `RFQ-${String(nextNumber).padStart(3, '0')}`;

    const submitted_at = getISTDateString();

    const newRfqEntry = {
      id: newId,
      submitted_at,
      name,
      company,
      phone,
      email,
      service,
      quantity: quantity || "Not specified",
      timeline: timeline || "Not specified",
      description,
      status: "new"
    };

    logs.push(newRfqEntry);
    fs.writeFileSync(LOG_FILE, JSON.stringify(logs, null, 2), "utf-8");

    // Initialize SMTP Mailer
    const transporter = getMailerTransporter();
    const ownerEmail = process.env.COMPANY_EMAIL || "sampatskumbhar@gmail.com";
    const senderEmail = process.env.EMAIL_USER || "sampatskumbhar@gmail.com";

    // STEP 2 — SEND FORMATED HTML EMAIL TO OWNER Mr. Sampat
    const ownerHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1e293b; margin: 0; padding: 20px; background-color: #f8fafc; }
          .card { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; }
          .header { background-color: #0b1329; color: #ffffff; padding: 25px 20px; text-align: center; border-bottom: 4px solid #d90429; }
          .header h2 { margin: 0; font-size: 20px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase; }
          .header p { margin: 6px 0 0; font-size: 13px; opacity: 0.8; }
          .body { padding: 30px 20px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 25px; margin-top: 10px; }
          th { background-color: #f1f5f9; color: #475569; font-weight: 700; padding: 12px 14px; text-align: left; font-size: 11px; text-transform: uppercase; border-bottom: 1px solid #e2e8f0; width: 33%; }
          td { padding: 12px 14px; text-align: left; border-bottom: 1px solid #e2e8f0; font-size: 13.5px; color: #0f172a; }
          tr:nth-child(even) td { background-color: #fafbfd; }
          .p-desc { white-space: pre-wrap; font-style: italic; background-color: #f8fafc; padding: 12px; border: 1px dashed #cbd5e1; border-radius: 4px; }
          .btn-box { text-align: center; margin-top: 25px; }
          .btn-red { background-color: #d90429; color: #ffffff !important; padding: 12px 35px; text-decoration: none; border-radius: 4px; font-weight: 800; display: inline-block; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; }
          .footer { text-align: center; color: #64748b; font-size: 11px; padding: 15px; border-top: 1px solid #e2e8f0; background-color: #f8fafc; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <h2>New RFQ Received — Shree Sai Enterprises</h2>
            <p>B1B Administration Sourcing Alert - ID: ${newId}</p>
          </div>
          <div class="body">
            <table>
              <tr>
                <th>Submitted On (IST)</th>
                <td style="font-weight: bold; color: #000000;">${submitted_at.replace('T', ' ')}</td>
              </tr>
              <tr>
                <th>Contact Name</th>
                <td>${name}</td>
              </tr>
              <tr>
                <th>B2B Company</th>
                <td style="font-weight: 700; color: #d90429;">${company}</td>
              </tr>
              <tr>
                <th>Phone Number</th>
                <td><a href="tel:${digitsOnly}" style="color: #d90429; font-weight: bold; text-decoration: none;">${phone}</a></td>
              </tr>
              <tr>
                <th>Email Address</th>
                <td><a href="mailto:${email}" style="color: #0b1329; font-weight: bold; text-decoration: none;">${email}</a></td>
              </tr>
              <tr>
                <th>Service Required</th>
                <td style="font-weight: bold; color: #0b1329; background-color: #fffbfa;">${service}</td>
              </tr>
              <tr>
                <th>Quantity</th>
                <td>${quantity || "Not specified"}</td>
              </tr>
              <tr>
                <th>Timeline</th>
                <td>${timeline || "Not specified"}</td>
              </tr>
              <tr>
                <th>Description</th>
                <td><div class="p-desc">${description}</div></td>
              </tr>
            </table>
            
            <div class="btn-box">
              <a href="tel:+917507126049" class="btn-red">Call Now</a>
            </div>
          </div>
          <div class="footer">
            This inquiry was submitted via your website
          </div>
        </div>
      </body>
      </html>
    `;

    // STEP 3 — SEND AUTO-REPLY TO CUSTOMER
    const firstName = name.split(" ")[0] || name;
    const customerHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1e293b; margin: 0; padding: 20px; background-color: #f8fafc; }
          .card { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; }
          .header { background-color: #0b1329; color: #ffffff; padding: 25px 20px; text-align: center; border-bottom: 4px solid #d90429; }
          .header h2 { margin: 0; font-size: 18px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; }
          .body { padding: 30px 20px; }
          .contacts-box { background-color: #f8fafc; border-left: 4px solid #d90429; padding: 15px; margin: 20px 0; border: 1px solid #e1e8f0; border-left-width: 4px; }
          .wa-container { text-align: center; margin: 20px 0; }
          .wa-btn { background-color: #25d366; color: #ffffff !important; padding: 12px 25px; text-decoration: none; border-radius: 4px; font-weight: 700; display: inline-block; font-size: 13px; text-transform: uppercase; }
          .footer { text-align: center; color: #64748b; font-size: 11px; padding: 15px; border-top: 1px solid #e2e8f0; background-color: #f8fafc; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <h2>Shree Sai Enterprises — Inquiry Registered</h2>
          </div>
          <div class="body">
            <p>Dear <strong>${firstName}</strong>,</p>
            <p>Thank you for reaching out to Shree Sai Enterprises! This email serves as confirmation that we have successfully registered your corporate inquiry for <strong>${service}</strong>.</p>
            <p>Our proprietor, <strong>Mr. Sampat S. Kumbhar</strong>, and our expert technical committee are reviewing your manufacturing details. A formal commercial quotation was initiated under reference code <strong>${newId}</strong> and will be routed to you within 24 hours.</p>
            
            <p>For urgent scheduling, immediate mold design checks, or direct estimates, feel free to contact us or run an instant chat escalation on WhatsApp:</p>

            <div class="wa-container">
              <a href="https://wa.me/917507126049" class="wa-btn">💬 Chat on WhatsApp</a>
            </div>

            <div class="contacts-box">
              <h4 style="margin: 0 0 10px 0; color: #0b1329; text-transform: uppercase; font-size: 12px; letter-spacing: 0.5px;">Corporate Office Bhosari Pune:</h4>
              <p style="margin: 0 0 6px 0; font-size: 13px;"><strong>Phone support:</strong> +91 75071 26049</p>
              <p style="margin: 0 0 6px 0; font-size: 13px;"><strong>Technical Mail:</strong> sampatskumbhar@gmail.com</p>
              <p style="margin: 0; font-size: 13px;"><strong>Address:</strong> Sr. No. 71/1, Shiv Ganesh Nagar, Sopan Dhawade Marg, Dhawade Wasti, Bhosari, Pune – 411 039</p>
            </div>

            <p style="margin-top: 25px; margin-bottom: 5px;">Best regards,</p>
            <p style="margin: 0; font-weight: bold; color: #0b1329;">Sampat S. Kumbhar</p>
            <p style="margin: 0; font-size: 12px; color: #64748b;">Proprietor, Shree Sai Enterprises</p>
          </div>
          <div class="footer">
            &copy; 2026 Shree Sai Enterprises Bhosari Pune. All Rights Reserved.
          </div>
        </div>
      </body>
      </html>
    `;

    // Dispatch SMTP outputs in background
    Promise.all([
      transporter.sendMail({
        from: `"${company} Form" <${senderEmail}>`,
        to: ownerEmail,
        replyTo: email,
        subject: `New RFQ Received – ${company} – ${service}`,
        html: ownerHtml
      }),
      transporter.sendMail({
        from: `"Shree Sai Enterprises" <${senderEmail}>`,
        to: email,
        subject: `We received your inquiry – Shree Sai Enterprises`,
        html: customerHtml
      })
    ]).then(([res1, res2]) => {
      console.log(`[SMTP] Dispatched. Owner mail ID: ${res1.messageId}. Customer mail ID: ${res2.messageId}`);
    }).catch(err => {
      console.error("[SMTP] One or more emails failed to dispatch:", err.message);
    });

    // Option-based WhatsApp Escalations
    sendWhatsAppNotification(name, company, phone, service, quantity, timeline);

    // STEP 5 — RETURN RESPONSE TO FRONTEND
    return res.json({ success: true, message: "RFQ submitted", rfq: newRfqEntry });

  } catch (error: any) {
    console.error("General error handling RFQ:", error);
    return res.status(500).json({ success: false, error: error.message || "Server Error" });
  }
});

// STEP 5 — ADMIN LOG VIEWER
app.get("/admin/rfqs", (req, res) => {
  const pin = req.query.pin || "";
  const error = req.query.error || "";

  if (pin !== "4714") {
    // Render security PIN dialog page
    return res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>SSE Security Login Gate</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
          body { font-family: 'Inter', sans-serif; background-color: #040814; background-image: radial-gradient(circle at top right, rgba(217, 4, 41, 0.05), transparent 60%); }
        </style>
      </head>
      <body class="min-h-screen flex items-center justify-center p-4">
        <div class="w-full max-w-sm bg-[#050b1a] border border-slate-800 rounded shadow-2xl p-8 relative overflow-hidden">
          <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-[#cca43b] to-red-600"></div>
          
          <div class="text-center mb-6">
            <span class="inline-flex py-1.5 px-3 bg-red-950/40 border border-red-500/40 text-red-500 text-xs font-bold rounded mb-3 font-mono">SSE SECURE GATE</span>
            <h1 class="text-xl font-bold text-white tracking-tight uppercase">Admin Verification</h1>
            <p class="text-xs text-slate-400 mt-1">Authorized proprietor access portal</p>
          </div>

          ${error === "invalid" ? `
            <div class="mb-4 bg-red-950/40 border border-red-800 text-red-400 p-2 text-xs rounded text-center font-bold">
              ⚠️ CARDINAL REJECTION: PIN WAS INVALID
            </div>
          ` : ''}

          <form method="GET" action="/admin/rfqs" class="space-y-4">
            <div class="space-y-1.5">
              <label class="block text-[10px] uppercase font-bold tracking-widest text-[#cca43b]">ENTER SECRET HARDCODED PIN</label>
              <input 
                type="password" 
                name="pin" 
                maxlength="4"
                placeholder="4714" 
                required
                autofocus
                class="w-full bg-[#040814] border border-slate-800 focus:border-[#cca43b] rounded text-center text-2xl font-mono text-white focus:outline-none focus:ring-1 focus:ring-[#cca43b] tracking-widest py-2"
              />
            </div>
            
            <button 
              type="submit"
              class="w-full bg-red-600 hover:bg-red-700 active:scale-[0.98] text-white font-bold tracking-widest text-xs uppercase py-2.5 rounded transition-all cursor-pointer border border-[#cca43b]/40"
            >
              Verify Ledger
            </button>
          </form>

          <div class="mt-6 text-center">
            <a href="/" class="text-xs text-slate-500 hover:text-slate-300 underline font-semibold">
              ← Return to Main Application Screen
            </a>
          </div>
        </div>
      </body>
      </html>
    `);
  }

  // Pin is correct, read rfq_log.json database and render HTML table
  const LOG_FILE = path.join(process.cwd(), "rfq_log.json");
  let logs: any[] = [];
  if (fs.existsSync(LOG_FILE)) {
    try {
      const raw = fs.readFileSync(LOG_FILE, "utf-8");
      logs = JSON.parse(raw || "[]");
    } catch (err) {
      console.error("Failed to parse logs for panel view", err);
    }
  }

  const sortedLogs = [...logs].reverse();

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>SSE B2B RFQ Control Room</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;700&family=JetBrains+Mono:wght@400;500;700&display=swap');
        body { font-family: 'Inter', sans-serif; background-color: #040814; }
        .font-display { font-family: 'Space Grotesk', sans-serif; }
        .font-mono { font-family: 'JetBrains Mono', sans-serif; }
      </style>
    </head>
    <body class="min-h-screen text-slate-100 flex flex-col">
      <header class="bg-[#0a1128] border-b border-slate-800 py-4 px-6 sticky top-0 z-50 shadow-md">
        <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="flex items-center space-x-3">
            <div class="w-9 h-9 bg-red-600 border border-[#cca43b] text-white font-bold flex items-center justify-center rounded font-display text-md">
              SSE
            </div>
            <div>
              <h1 class="text-md font-bold font-display uppercase tracking-wider text-white">B2B RFQ Ledger Panel</h1>
              <p class="text-[10px] uppercase tracking-widest font-bold text-[#cca43b]">Authorized Controller Screen</p>
            </div>
          </div>
          <div>
            <a href="/admin/rfqs?pin=logout" class="bg-[#050b1a] hover:bg-slate-900 text-[10px] font-bold text-slate-400 hover:text-white px-3.5 py-2 border border-slate-800 rounded uppercase tracking-wider">
              Secure Signout
            </a>
          </div>
        </div>
      </header>

      <main class="flex-grow p-4 sm:p-8 max-w-7xl mx-auto w-full">
        <div class="mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 class="text-xl font-bold font-display text-white tracking-tight uppercase border-b border-red-600 pb-1 inline-block">Active RFQ Ledgers</h2>
            <p class="text-xs text-slate-400 mt-2">All client inputs log directly to <code class="font-mono bg-[#050b1a] px-1.5 py-0.5 rounded border border-slate-800 text-[#cca43b]">rfq_log.json</code> with 24-hr callbacks.</p>
          </div>
          <div class="bg-[#0a1128] border border-slate-800 rounded px-4 py-2 flex items-center gap-4 text-xs font-mono">
            <div>
              <span class="block text-[9px] text-slate-500 uppercase font-semibold">Total submissions</span>
              <span class="text-sm font-extrabold text-[#cca43b]">${logs.length}</span>
            </div>
            <div class="w-px h-6 bg-slate-800"></div>
            <div>
              <span class="block text-[9px] text-slate-500 uppercase font-semibold">Uncontacted</span>
              <span class="text-sm font-extrabold text-red-500">${logs.filter(l => l.status === "new").length}</span>
            </div>
          </div>
        </div>

        <!-- Desktop Ledger Desk Table -->
        <div class="bg-[#0a1128] border border-slate-800 rounded shadow-xl overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-[#050b1a] border-b border-slate-800 uppercase text-[10px] tracking-wider text-slate-400 font-bold">
                <tr>
                  <th class="py-3 px-4">ID</th>
                  <th class="py-3 px-4">Submitted (IST)</th>
                  <th class="py-3 px-4">Name & Submitter</th>
                  <th class="py-3 px-4">B2B Company</th>
                  <th class="py-3 px-4">Phone</th>
                  <th class="py-3 px-4">Requested Service</th>
                  <th class="py-3 px-4">Qty & Timeline</th>
                  <th class="py-3 px-4">Status</th>
                  <th class="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-800">
                ${sortedLogs.length === 0 ? `
                  <tr>
                    <td colspan="9" class="py-12 text-center text-slate-500 text-sm font-semibold">
                      📭 Ledger is empty! No RFQs submitted yet.
                    </td>
                  </tr>
                ` : sortedLogs.map(rfq => `
                  <tr class="hover:bg-[#0c142c]/35 transition-colors ${rfq.status === 'new' ? 'font-medium' : 'text-slate-400'}">
                    <td class="py-4 px-4 font-mono text-white font-bold">${rfq.id}</td>
                    <td class="py-4 px-4 text-slate-400">${rfq.submitted_at ? rfq.submitted_at.replace('T', ' ').substring(0, 16) : 'N/A'}</td>
                    <td class="py-4 px-4">
                      <div class="text-white font-semibold">${rfq.name}</div>
                      <div class="text-[10px] text-slate-500 font-mono">${rfq.email}</div>
                    </td>
                    <td class="py-4 px-4 font-bold uppercase text-slate-300 text-[11px]">${rfq.company}</td>
                    <td class="py-4 px-4">
                      <a href="tel:${rfq.phone}" class="hover:underline font-mono text-[#cca43b] hover:text-white font-semibold">${rfq.phone}</a>
                    </td>
                    <td class="py-4 px-4">
                      <span class="px-2 py-0.5 rounded text-[10px] bg-slate-900 border border-slate-850 text-white font-semibold font-display">${rfq.service}</span>
                    </td>
                    <td class="py-4 px-4">
                      <div class="text-slate-300 font-mono">${rfq.quantity || 'Not Specified'}</div>
                      <div class="text-[10px] text-red-400 font-bold uppercase tracking-wide">${rfq.timeline || 'Not Specified'}</div>
                    </td>
                    <td class="py-4 px-4">
                      ${rfq.status === "new" ? `
                        <span class="inline-flex items-center px-2 py-0.5 rounded bg-red-950/60 border border-red-800 text-red-400 text-[9px] uppercase tracking-wider font-extrabold">
                          New RFQ
                        </span>
                      ` : `
                        <span class="inline-flex items-center px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800 text-emerald-400 text-[9px] uppercase tracking-wider font-extrabold">
                          Contacted
                        </span>
                      `}
                    </td>
                    <td class="py-4 px-4 text-right">
                      ${rfq.status === "new" ? `
                        <form method="POST" action="/admin/rfqs/contacted" class="inline">
                          <input type="hidden" name="id" value="${rfq.id}" />
                          <input type="hidden" name="pin" value="${pin}" />
                          <button type="submit" class="bg-red-600 hover:bg-red-700 active:scale-95 text-white text-[10px] uppercase font-bold px-2.5 py-1 rounded-sm transition-all border border-[#cca43b]/40 cursor-pointer">
                            Mark Contacted
                          </button>
                        </form>
                      ` : `
                        <span class="text-[11px] text-slate-500 font-mono font-semibold">Done ✓</span>
                      `}
                    </td>
                  </tr>
                  <!-- Sub-row for Description text -->
                  <tr class="bg-slate-950/40">
                    <td colspan="9" class="py-2 px-4 border-t-0">
                      <div class="text-xs text-slate-400 flex items-start gap-1 max-w-5xl">
                        <span class="font-mono text-[9px] text-slate-500 uppercase mt-0.5 shrink-0">Specs briefed:</span>
                        <p class="italic text-slate-300 text-left">
                          &ldquo;${rfq.description}&rdquo;
                        </p>
                      </div>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <div class="mt-8 text-center">
          <a href="/" class="text-xs text-slate-500 hover:text-slate-300 font-bold underline">
            ← Return to Main Application Sourcing Screen
          </a>
        </div>
      </main>

      <footer class="bg-slate-950 border-t border-slate-900 py-4 text-center text-[10px] text-slate-600">
        Shree Sai Enterprises Security Panel • Copyright &copy; 2026 • Verified Bhosari Pune Zone II
      </footer>
    </body>
    </html>
  `);
});

// Post action to mark as contacted
app.post("/admin/rfqs/contacted", (req, res) => {
  const pin = req.body.pin || req.query.pin;
  const id = req.body.id;

  if (pin !== "4714") {
    return res.redirect("/admin/rfqs?error=invalid");
  }

  if (!id) {
    return res.redirect(`/admin/rfqs?pin=${pin}`);
  }

  const LOG_FILE = path.join(process.cwd(), "rfq_log.json");
  if (fs.existsSync(LOG_FILE)) {
    try {
      const raw = fs.readFileSync(LOG_FILE, "utf-8");
      const logs = JSON.parse(raw || "[]");
      const updatedLogs = logs.map((log: any) => {
        if (log.id === id) {
          return { ...log, status: "contacted" };
        }
        return log;
      });
      fs.writeFileSync(LOG_FILE, JSON.stringify(updatedLogs, null, 2), "utf-8");
    } catch (err) {
      console.error("Error setting status to contacted for id", id, err);
    }
  }

  res.redirect(`/admin/rfqs?pin=${pin}`);
});

// START WRAPPING ASYNC STARTING OF DEV OR PRODUCTION BUILDS
async function startServer() {
  // Vite Integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    // Add Vite middleware for handling assets / HMR fallback 
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[SSE B2B SERVER] Standby running perfectly on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Critical failure booting up Shree Sai Enterprises full stack container:", err);
});
