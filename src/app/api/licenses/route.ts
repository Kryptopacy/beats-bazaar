import { NextRequest, NextResponse } from 'next/server';
import { LicenseCertificate } from '@/types';
import fs from 'fs';
import path from 'path';

// Server-side persistent storage file path
const DATA_DIR = path.join(process.cwd(), 'data');
const LICENSES_FILE = path.join(DATA_DIR, 'issued_licenses.json');

// Helper to ensure data storage exists
function getStoredLicenses(): LicenseCertificate[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(LICENSES_FILE)) {
      fs.writeFileSync(LICENSES_FILE, JSON.stringify([], null, 2), 'utf-8');
      return [];
    }
    const data = fs.readFileSync(LICENSES_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading licenses file:', err);
    return [];
  }
}

function saveLicense(cert: LicenseCertificate): boolean {
  try {
    const list = getStoredLicenses();
    // Prevent duplicate entries
    const existingIndex = list.findIndex(item => item.certificateId === cert.certificateId);
    if (existingIndex >= 0) {
      list[existingIndex] = cert;
    } else {
      list.unshift(cert);
    }
    fs.writeFileSync(LICENSES_FILE, JSON.stringify(list, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing license to disk:', err);
    return false;
  }
}

// POST /api/licenses - Persist an issued certificate server-side
export async function POST(req: NextRequest) {
  try {
    const cert: LicenseCertificate = await req.json();

    if (!cert.certificateId || !cert.beatTitle || !cert.licensor || !cert.licensee) {
      return NextResponse.json({ error: 'Invalid certificate payload' }, { status: 400 });
    }

    const saved = saveLicense(cert);

    return NextResponse.json({
      success: saved,
      certificateId: cert.certificateId,
      verified: true,
      timestamp: cert.issuedAt
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}

// GET /api/licenses?id=BB-LIC-... - Verify or retrieve a certificate
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const format = searchParams.get('format');

  const list = getStoredLicenses();

  if (!id) {
    // Return all certificates summary (safe metadata)
    return NextResponse.json({
      totalIssued: list.length,
      licenses: list.map(l => ({
        certificateId: l.certificateId,
        beatTitle: l.beatTitle,
        licensor: l.licensor,
        tier: l.tier,
        issuedAt: l.issuedAt
      }))
    });
  }

  const found = list.find(l => l.certificateId === id || l.transactionRef === id);

  if (!found) {
    return NextResponse.json({ error: 'Certificate not found or unverified' }, { status: 404 });
  }

  // If download format requested, return a standalone printable HTML document
  if (format === 'html' || format === 'download') {
    const htmlContent = generatePrintableCertificateHtml(found);
    return new NextResponse(htmlContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Disposition': `attachment; filename="BeatsBazaar_License_${found.certificateId}.html"`
      }
    });
  }

  return NextResponse.json({
    verified: true,
    certificate: found
  });
}

function generatePrintableCertificateHtml(cert: LicenseCertificate): string {
  const termsList = cert.terms.map(t => `<li style="margin-bottom: 8px;">✓ ${t}</li>`).join('');
  const formattedDate = new Date(cert.issuedAt).toUTCString();

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Beats Bazaar - Official License Certificate ${cert.certificateId}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&display=swap');
    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      background: #0B0F12;
      color: #E2E8F0;
      margin: 0;
      padding: 40px 20px;
      display: flex;
      justify-content: center;
    }
    .cert-card {
      max-width: 800px;
      width: 100%;
      background: linear-gradient(180deg, #151D28 0%, #0E141C 100%);
      border: 2px solid #F59E0B;
      border-radius: 28px;
      padding: 48px;
      box-shadow: 0 25px 60px rgba(0,0,0,0.8);
      position: relative;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid rgba(255,255,255,0.12);
      padding-bottom: 24px;
      margin-bottom: 32px;
    }
    .logo-text {
      font-size: 24px;
      font-weight: 900;
      letter-spacing: -0.5px;
      color: #FFFFFF;
    }
    .badge {
      background: rgba(245, 158, 11, 0.15);
      color: #F59E0B;
      border: 1px solid rgba(245, 158, 11, 0.4);
      padding: 6px 14px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .cert-title {
      font-size: 28px;
      font-weight: 900;
      margin: 0 0 8px 0;
      color: #FFFFFF;
    }
    .cert-subtitle {
      color: #94A3B8;
      font-size: 13px;
      margin-bottom: 28px;
    }
    .meta-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.08);
      padding: 20px;
      border-radius: 16px;
      margin-bottom: 28px;
    }
    .meta-label {
      font-size: 10px;
      font-weight: 800;
      color: #64748B;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 4px;
    }
    .meta-val {
      font-size: 14px;
      font-weight: 800;
      color: #FFFFFF;
      font-family: monospace;
    }
    .parties-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 28px;
    }
    .party-card {
      background: rgba(255,255,255,0.02);
      border: 1px solid rgba(255,255,255,0.08);
      padding: 16px;
      border-radius: 16px;
    }
    .beat-card {
      background: rgba(0, 229, 153, 0.05);
      border: 1px solid rgba(0, 229, 153, 0.25);
      padding: 20px;
      border-radius: 18px;
      margin-bottom: 28px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .terms {
      margin-bottom: 32px;
    }
    .terms h4 {
      font-size: 12px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #94A3B8;
      margin-bottom: 12px;
    }
    .terms ul {
      margin: 0;
      padding-left: 0;
      list-style: none;
      font-size: 13px;
      color: #CBD5E1;
      line-height: 1.6;
    }
    .footer {
      border-top: 1px solid rgba(255,255,255,0.08);
      padding-top: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 11px;
      color: #64748B;
    }
    .print-btn {
      background: #00E599;
      color: #000;
      font-weight: 800;
      padding: 10px 20px;
      border-radius: 999px;
      border: none;
      cursor: pointer;
      margin-top: 20px;
      display: inline-block;
    }
    @media print {
      body {
        background: #fff;
        color: #000;
        padding: 0;
      }
      .cert-card {
        border: 2px solid #000;
        box-shadow: none;
        background: #fff;
        color: #000;
      }
      .print-btn { display: none; }
      .meta-val, .cert-title, .logo-text { color: #000 !important; }
      .meta-grid, .party-card, .beat-card { background: #f8f8f8 !important; border-color: #ddd !important; }
    }
  </style>
</head>
<body>
  <div class="cert-card">
    <div class="header">
      <div class="logo-text">BEATS BAZAAR</div>
      <div class="badge">Official Legal Clearance</div>
    </div>

    <h1 class="cert-title">Digital Synchronization Master License</h1>
    <p class="cert-subtitle">Legally notarized commercial synchronization and master recording rights clearance certificate.</p>

    <div class="meta-grid">
      <div>
        <div class="meta-label">Certificate ID</div>
        <div class="meta-val" style="color: #00E599;">${cert.certificateId}</div>
      </div>
      <div>
        <div class="meta-label">Transaction Ref</div>
        <div class="meta-val">${cert.transactionRef}</div>
      </div>
      <div>
        <div class="meta-label">Date Notarized</div>
        <div class="meta-val">${formattedDate}</div>
      </div>
    </div>

    <div class="parties-grid">
      <div class="party-card">
        <div class="meta-label">Licensor (Producer)</div>
        <div style="font-size: 16px; font-weight: 800; color: #FFF; margin-top: 4px;">${cert.licensor}</div>
        <div style="font-size: 12px; color: #94A3B8; margin-top: 2px;">Beats Bazaar Verified Producer</div>
      </div>
      <div class="party-card">
        <div class="meta-label">Licensee (Artist / Buyer)</div>
        <div style="font-size: 16px; font-weight: 800; color: #00E599; margin-top: 4px;">${cert.licensee}</div>
        <div style="font-size: 12px; color: #94A3B8; margin-top: 2px;">Authorized Commercial Rights Holder</div>
      </div>
    </div>

    <div class="beat-card">
      <div>
        <div class="meta-label" style="color: #F59E0B;">Licensed Master Recording</div>
        <div style="font-size: 20px; font-weight: 900; color: #FFF; margin-top: 4px;">${cert.beatTitle}</div>
      </div>
      <div style="text-align: right;">
        <div class="meta-label">Commercial Tier</div>
        <div style="font-size: 15px; font-weight: 900; color: #F59E0B;">${cert.tier} ($${cert.price})</div>
      </div>
    </div>

    <div class="terms">
      <h4>Grant of Commercial Rights & Terms</h4>
      <ul>${termsList}</ul>
    </div>

    <div class="footer">
      <div>Verified by Beats Bazaar Autonomous Rights Engine • Notarized Proof-of-Work</div>
      <button class="print-btn" onclick="window.print()">Print / Export PDF</button>
    </div>
  </div>
</body>
</html>`;
}
