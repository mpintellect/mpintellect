import os
import json
import time
import random
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime, timedelta
from pathlib import Path
from dotenv import load_dotenv

# ======================= CONFIG ===========================
MAX_DAILY_EMAILS = 199
EMAILS_PER_BATCH = 20
ACTIVE_HOURS = {"start": 9, "end": 19}  # ✅ CHANGED: 9:00 → 19:00 (7 PM)
EMAIL_DELAY_MIN = 60   # seconds
EMAIL_DELAY_MAX = 120  # seconds
BATCH_DELAY_MIN = 10 * 60  # 10 minutes
BATCH_DELAY_MAX = 30 * 60  # 30 minutes
# ===========================================================

# Load environment variables
load_dotenv()

# File setup
batches_dir = Path(__file__).parent.parent / "email-batches"
sent_log_path = batches_dir / "sent-log.json"

# Helpers
def random_between(min_val, max_val):
    return random.randint(min_val, max_val)

def log(msg):
    print(f"[{datetime.now().strftime('%H:%M:%S')}] {msg}")

def load_sent_batches():
    if sent_log_path.exists():
        with open(sent_log_path, "r", encoding="utf-8") as f:
            return json.load(f)
    return []

def save_sent_batches(batches):
    with open(sent_log_path, "w", encoding="utf-8") as f:
        json.dump(batches, f, indent=2)

def is_within_active_hours():
    hour = datetime.now().hour
    return ACTIVE_HOURS["start"] <= hour < ACTIVE_HOURS["end"]

def seconds_until_next_start():
    now = datetime.now()
    next_start = now.replace(hour=ACTIVE_HOURS["start"], minute=0, second=0, microsecond=0)
    if now.hour >= ACTIVE_HOURS["end"]:
        next_start += timedelta(days=1)
    elif now.hour < ACTIVE_HOURS["start"]:
        pass
    else:
        next_start += timedelta(days=1)
    return (next_start - now).total_seconds()

# Email content
subject = "Clarity in Every Decision"

def html_template(email):
    # Only extract the username if it looks like a name (optional personalization)
    greeting = "Hi Trader,"
    
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>MZPrimer AI Assistant</title>
<!-- Dark Mode Support -->
<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">
<style>
    :root {{
        color-scheme: light dark;
        supported-color-schemes: light dark;
    }}
    .btn:hover {{ background-color: #e0b128 !important; }}
    @media (max-width: 600px) {{
        .container {{ width: 100% !important; border: none !important; }}
        .content {{ padding: 15px !important; }}
    }}
</style>
</head>
<body style="background:#050505; padding:0; margin:0; color:#e9e9ea; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  
  <!-- 🕵️ PREHEADER (Visible in inbox, hidden in email) -->
  <div style="display:none; max-height:0px; overflow:hidden;">
    Don't enter your next trade without checking this first. Instant AI analysis and risk calculation inside.
    &nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
  </div>

  <center style="width: 100%; background-color: #050505; padding: 30px 0;">
    <div class="container" style="max-width:600px; margin:auto; background:#111214; border:1px solid #2a2d31; border-radius:16px; overflow:hidden; text-align:left;">
      
      <!-- 🖼️ HERO IMAGE -->
      <a href="https://mzprimer.com/?utm_source=email&utm_medium=clarity&utm_campaign=ai-hero-click">
        <img src="https://i.postimg.cc/HkWqShmK/1200x1200_2.png" alt="AI Trading Assistant" style="width:100%; height:auto; border:0; display:block;" />
      </a>

      <!-- ✨ CONTENT -->
      <div class="content" style="padding: 30px 30px 40px 30px;">
        
        <h2 style="margin:0 0 15px 0; font-size:24px; font-weight:800; color:#ffffff; letter-spacing:-0.5px; line-height:1.2;">
          Is your next trade <span style="color:#f5c84b;">protected?</span>
        </h2>
        
        <p style="margin:0 0 20px 0; color:#a1a1aa; font-size:16px; line-height:1.6;">
          {greeting}<br><br>
          The market moves fast. Calculating lot sizes, checking volatility, and finding the perfect entry takes time you don't always have.
        </p>

        <!-- 🧠 FEATURE BOX -->
        <div style="background:#18181b; border:1px solid #27272a; border-radius:12px; padding: 20px; margin-bottom: 25px;">
          <p style="margin:0 0 15px 0; color:#ffffff; font-weight:600; font-size:15px;">
            Let MZPrimer AI handle the math in seconds:
          </p>
          <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td style="padding-bottom:10px; width:25px; vertical-align:top;">✅</td>
              <td style="padding-bottom:10px; color:#d4d4d8; font-size:15px;"><strong>Auto-Risk Calc:</strong> Never over-leverage again.</td>
            </tr>
            <tr>
              <td style="padding-bottom:10px; width:25px; vertical-align:top;">📊</td>
              <td style="padding-bottom:10px; color:#d4d4d8; font-size:15px;"><strong>Volatility Checks:</strong> Smart SL/TP based on live data.</td>
            </tr>
            <tr>
              <td style="width:25px; vertical-align:top;">🚀</td>
              <td style="color:#d4d4d8; font-size:15px;"><strong>Instant Bias:</strong> Know if the trend is your friend.</td>
            </tr>
          </table>
        </div>

        <!-- 🚀 CTA BUTTON -->
        <div style="text-align:center; margin-bottom: 25px;">
          <a href="https://mzprimer.com/?utm_source=email&utm_medium=clarity&utm_campaign=ai-simulation" class="btn"
            style="display:block; width:100%; background:#f5c84b; color:#000000; font-size:16px; font-weight:bold; text-decoration:none; padding:16px 0; border-radius:8px; text-align:center; box-shadow: 0 4px 14px 0 rgba(245, 200, 75, 0.39);">
            Run Free Simulation &rarr;
          </a>
        </div>

        <p style="margin:0; text-align:center; color:#52525b; font-size:13px;">
          *No credit card required. Instant access.
        </p>

      </div>

      <!-- 🔻 FOOTER -->
      <div style="background:#0c0c0c; padding:20px; text-align:center; border-top:1px solid #2a2d31;">
        <img src="https://mzprimer.com/logos/mzlogo.webp" alt="MZPrimer" style="height:24px; width:auto; margin-bottom:15px; opacity:0.8;" />
        
        <p style="margin:0 0 10px 0; color:#52525b; font-size:12px; line-height:1.5;">
          You are receiving this because you explored our trading tools.<br>
          MZPrimer LTD • Global Trading Solutions
        </p>
        
        <p style="margin:0; font-size:12px;">
          <a href="https://mzprimer.com/unsubscribe?email={email}" style="color:#71717a; text-decoration:underline;">Unsubscribe</a>
        </p>
      </div>

    </div>
  </center>
</body>
</html>"""
def send_email(to_email, html_content):
    msg = MIMEMultipart()
    msg["From"] = f'"MZPrimer LTD" <{os.getenv("EMAIL_FROM")}>'
    msg["To"] = to_email
    msg["Subject"] = subject
    msg.attach(MIMEText(html_content, "html", "utf-8"))

    smtp_server = os.getenv("EMAIL_SERVER")
    smtp_port = int(os.getenv("EMAIL_PORT", "465"))
    smtp_user = os.getenv("EMAIL_USER")
    smtp_password = os.getenv("EMAIL_PASSWORD")

    with smtplib.SMTP_SSL(smtp_server, smtp_port) as server:
        server.login(smtp_user, smtp_password)
        server.send_message(msg)

# ======================= MAIN LOOP ===========================
def start_mailer():
    log(f"⏰ Email sending active hours: {ACTIVE_HOURS['start']}:00 - {ACTIVE_HOURS['end']}:00")
    
    while True:
        sent_batches = load_sent_batches()
        
        # Case-insensitive file matching for both EMbatch and EMBatch
        all_batches = []
        if batches_dir.exists():
            for file_path in batches_dir.glob("*.json"):
                filename_lower = file_path.name.lower()
                # Match both EMbatch and EMBatch (case insensitive)
                if ("embatch" in filename_lower and 
                    file_path.name not in sent_batches and
                    file_path.name != "sent-log.json"):
                    all_batches.append(file_path.name)
        
        all_batches.sort()
        # ADD THESE 2 LINES:
        target_batch = "email-batch-1.json"  # ⬅️ CHANGE THIS TO YOUR DESIRED FILE
        all_batches = [batch for batch in all_batches if batch == target_batch]

        # Debug logging
        log(f"📁 Found {len(all_batches)} batch files: {all_batches}")
        
        if not all_batches:
            log("❌ No batch files found. Waiting and retrying...")
            time.sleep(300)  # Wait 5 minutes and retry
            continue
            
        emails_sent_today = 0
        log("📬 Starting 24/7 email sender...")

        for batch_file in all_batches:
            if emails_sent_today >= MAX_DAILY_EMAILS:
                log("🛑 Daily limit reached, pausing until tomorrow...")
                sleep_seconds = seconds_until_next_start()
                log(f"⏸️ Sleeping {sleep_seconds/60:.1f} minutes...")
                time.sleep(sleep_seconds)
                emails_sent_today = 0

            if not is_within_active_hours():
                sleep_seconds = seconds_until_next_start()
                log("⏸️ Outside active hours. Sleeping until 09:00...")
                time.sleep(sleep_seconds)

            with open(batches_dir / batch_file, "r", encoding="utf-8") as f:
                contacts = json.load(f)

            log(f"📦 Sending batch: {batch_file} ({len(contacts)} contacts)")

            for contact in contacts[:EMAILS_PER_BATCH]:
                if emails_sent_today >= MAX_DAILY_EMAILS:
                    break
                email_address = contact.get("Email") or contact.get("email")
                if not email_address:
                    log(f"❌ Missing email in contact: {contact}")
                    continue

                try:
                    send_email(email_address, html_template(email_address))
                    emails_sent_today += 1
                    log(f"✅ Sent to {email_address} ({emails_sent_today}/{MAX_DAILY_EMAILS})")
                except Exception as e:
                    log(f"❌ Failed to send to {email_address}: {e}")

                time.sleep(random_between(EMAIL_DELAY_MIN, EMAIL_DELAY_MAX))

            sent_batches.append(batch_file)
            save_sent_batches(sent_batches)
            log(f"✅ Finished batch: {batch_file}")

            if emails_sent_today < MAX_DAILY_EMAILS and batch_file != all_batches[-1]:
                batch_delay = random_between(BATCH_DELAY_MIN, BATCH_DELAY_MAX)
                log(f"🕒 Waiting {batch_delay / 60:.1f} min before next batch...")
                time.sleep(batch_delay)

        log("🎉 All batches sent. Waiting until next active window...")
        time.sleep(seconds_until_next_start())

if __name__ == "__main__":
    try:
        start_mailer()
    except KeyboardInterrupt:
        log("🛑 Script manually stopped.")
    except Exception as e:
        log(f"❌ Unexpected error: {e}")