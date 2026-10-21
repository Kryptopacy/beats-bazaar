Add-Type -AssemblyName System.Drawing

$publicDir = "D:\pacy_labs\beats_bazaar\public"
$masterPlaquePath = "$publicDir\logo-plaque.png"
$plaque = [System.Drawing.Bitmap]::FromFile($masterPlaquePath)

Write-Host "Generating complete suite of brand assets matching logo-plaque.png..."

# 1. logo-mark.png (Exact 1024x1024 copy of logo-plaque.png)
$plaque.Save("$publicDir\logo-mark.png", [System.Drawing.Imaging.ImageFormat]::Png)
Write-Host "Updated: $publicDir\logo-mark.png"

# 2. icon-512.png and icon-192.png (Transparent PWA icons)
function Create-ResizedPng {
    param([System.Drawing.Bitmap]$src, [int]$sz, [string]$outPath)
    $dest = New-Object System.Drawing.Bitmap($sz, $sz, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($dest)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.Clear([System.Drawing.Color]::Transparent)
    $g.DrawImage($src, 0, 0, $sz, $sz)
    $dest.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $dest.Dispose()
    Write-Host "Generated: $outPath ($sz x $sz)"
}

Create-ResizedPng -src $plaque -sz 512 -outPath "$publicDir\icon-512.png"
Create-ResizedPng -src $plaque -sz 192 -outPath "$publicDir\icon-192.png"

# 3. apple-touch-icon.png (180x180 with solid luxury dark background for iOS home screens)
# iOS requires non-transparent icons; transparent icons get filled with flat black
$appleIcon = New-Object System.Drawing.Bitmap(180, 180, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$ag = [System.Drawing.Graphics]::FromImage($appleIcon)
$ag.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$ag.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$ag.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

# Luxury dark titanium background
$darkBg = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 10, 14, 18))
$ag.FillRectangle($darkBg, 0, 0, 180, 180)
$darkBg.Dispose()

# Ambient radial cyber emerald glow behind the plaque
$glowPath = New-Object System.Drawing.Drawing2D.GraphicsPath
$glowPath.AddEllipse(20, 20, 140, 140)
$pgb = New-Object System.Drawing.Drawing2D.PathGradientBrush($glowPath)
$pgb.CenterColor = [System.Drawing.Color]::FromArgb(60, 0, 229, 153)
$pgb.SurroundColors = @([System.Drawing.Color]::FromArgb(0, 0, 229, 153))
$ag.FillEllipse($pgb, 20, 20, 140, 140)
$pgb.Dispose(); $glowPath.Dispose()

# Draw centered plaque slightly inset (164x164)
$ag.DrawImage($plaque, 8, 8, 164, 164)
$appleIcon.Save("$publicDir\apple-touch-icon.png", [System.Drawing.Imaging.ImageFormat]::Png)
$ag.Dispose()
$appleIcon.Dispose()
Write-Host "Generated: $publicDir\apple-touch-icon.png (180x180 iOS squircle)"

# 4. favicon-32.png and favicon-16.png (High contrast favicon)
# For favicons, we zoom slightly into the disc (margin 8%) so the details punch through in tiny browser tabs
$fav32 = New-Object System.Drawing.Bitmap(32, 32, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$fg = [System.Drawing.Graphics]::FromImage($fav32)
$fg.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$fg.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$fg.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$fg.Clear([System.Drawing.Color]::Transparent)
# Draw plaque full bleed
$fg.DrawImage($plaque, [System.Drawing.Rectangle]::new(0, 0, 32, 32), [System.Drawing.Rectangle]::new(60, 60, 904, 904), [System.Drawing.GraphicsUnit]::Pixel)
$fav32.Save("$publicDir\favicon-32.png", [System.Drawing.Imaging.ImageFormat]::Png)
$fg.Dispose()
Write-Host "Generated: $publicDir\favicon-32.png"

$fav16 = New-Object System.Drawing.Bitmap(16, 16, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$fg16 = [System.Drawing.Graphics]::FromImage($fav16)
$fg16.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$fg16.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$fg16.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$fg16.Clear([System.Drawing.Color]::Transparent)
$fg16.DrawImage($plaque, [System.Drawing.Rectangle]::new(0, 0, 16, 16), [System.Drawing.Rectangle]::new(60, 60, 904, 904), [System.Drawing.GraphicsUnit]::Pixel)
$fav16.Save("$publicDir\favicon-16.png", [System.Drawing.Imaging.ImageFormat]::Png)
$fg16.Dispose()
$fav16.Dispose()
Write-Host "Generated: $publicDir\favicon-16.png"

# Convert to multi-resolution favicon.ico
$hIcon = $fav32.GetHicon()
$icon = [System.Drawing.Icon]::FromHandle($hIcon)
$fs = New-Object System.IO.FileStream("$publicDir\favicon.ico", [System.IO.FileMode]::Create)
$icon.Save($fs)
$fs.Close()
$fav32.Dispose()
$icon.Dispose()
Write-Host "Generated: $publicDir\favicon.ico"

# 5. icon.svg (Standalone SVG with embedded base64 Data URI)
# This guarantees that ANY browser loading /icon.svg displays the exact master plaque with zero external load failures!
$bytes = [System.IO.File]::ReadAllBytes("$publicDir\icon-512.png")
$b64 = [System.Convert]::ToBase64String($bytes)
$svgContent = @"
<svg viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <!-- Beats Bazaar Official Master Certification Plaque -->
  <image width="512" height="512" preserveAspectRatio="xMidYMid meet" xlink:href="data:image/png;base64,$b64" href="data:image/png;base64,$b64" />
</svg>
"@
[System.IO.File]::WriteAllText("$publicDir\icon.svg", $svgContent)
Write-Host "Generated: $publicDir\icon.svg (self-contained base64 data URI)"

# 6. logo.svg (Full horizontal brand lockup embedding master plaque + typography)
$logoSvgContent = @"
<svg viewBox="0 0 460 90" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="bb-gold-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#00E599" />
      <stop offset="50%" stop-color="#6EE7B7" />
      <stop offset="100%" stop-color="#F59E0B" />
    </linearGradient>
    <filter id="bb-emerald-glow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="0" stdDeviation="6" flood-color="#00E599" flood-opacity="0.45" />
    </filter>
  </defs>

  <!-- Embedded Master Plaque Emblem -->
  <g filter="url(#bb-emerald-glow)">
    <image x="4" y="5" width="80" height="80" xlink:href="data:image/png;base64,$b64" href="data:image/png;base64,$b64" />
  </g>

  <!-- Typography -->
  <g transform="translate(100, 38)">
    <text x="0" y="0" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-weight="900" font-size="28" letter-spacing="-0.03em" fill="#FFFFFF">BEATS <tspan fill="url(#bb-gold-gradient)">BAZAAR</tspan></text>
  </g>

  <!-- Sub-label -->
  <g transform="translate(100, 62)">
    <circle cx="4" cy="-4" r="3" fill="#00E599" />
    <text x="14" y="0" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-weight="800" font-size="11" letter-spacing="0.22em" fill="#9CA3AF">CERTIFIED MASTER RIGHTS</text>
  </g>
</svg>
"@
[System.IO.File]::WriteAllText("$publicDir\logo.svg", $logoSvgContent)
Write-Host "Generated: $publicDir\logo.svg (complete lockup)"

# 7. og-image.png (1200x630 Luxury Cinematic Sound-Tech Studio Banner)
$ogW = 1200
$ogH = 630
$ogBmp = New-Object System.Drawing.Bitmap($ogW, $ogH, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$og = [System.Drawing.Graphics]::FromImage($ogBmp)
$og.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$og.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$og.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$og.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

# Deep obsidian gradient background
$ogBg = New-Object System.Drawing.Drawing2D.LinearGradientBrush([System.Drawing.PointF]::new(0, 0), [System.Drawing.PointF]::new(1200, 630), [System.Drawing.Color]::FromArgb(255, 12, 16, 22), [System.Drawing.Color]::FromArgb(255, 6, 8, 10))
$og.FillRectangle($ogBg, 0, 0, $ogW, $ogH)
$ogBg.Dispose()

# Studio ambient lighting glows:
# Volumetric Cyber Emerald glow behind plaque (left side)
$glowLeftPath = New-Object System.Drawing.Drawing2D.GraphicsPath
$glowLeftPath.AddEllipse(60, 65, 520, 500)
$pgbLeft = New-Object System.Drawing.Drawing2D.PathGradientBrush($glowLeftPath)
$pgbLeft.CenterColor = [System.Drawing.Color]::FromArgb(70, 0, 229, 153)
$pgbLeft.SurroundColors = @([System.Drawing.Color]::FromArgb(0, 0, 229, 153))
$og.FillEllipse($pgbLeft, 60, 65, 520, 500)
$pgbLeft.Dispose(); $glowLeftPath.Dispose()

# Warm Gold rim ambient glow on top right
$glowRightPath = New-Object System.Drawing.Drawing2D.GraphicsPath
$glowRightPath.AddEllipse(800, -80, 500, 400)
$pgbRight = New-Object System.Drawing.Drawing2D.PathGradientBrush($glowRightPath)
$pgbRight.CenterColor = [System.Drawing.Color]::FromArgb(40, 245, 158, 11)
$pgbRight.SurroundColors = @([System.Drawing.Color]::FromArgb(0, 245, 158, 11))
$og.FillEllipse($pgbRight, 800, -80, 500, 400)
$pgbRight.Dispose(); $glowRightPath.Dispose()

# Draw subtle studio audio grid lines in background
$gridPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(25, 255, 255, 255), 1.0)
for ($gx = 600; $gx -lt 1200; $gx += 50) {
    $og.DrawLine($gridPen, $gx, 80, $gx, 550)
}
for ($gy = 80; $gy -lt 550; $gy += 50) {
    $og.DrawLine($gridPen, 600, $gy, 1140, $gy)
}
$gridPen.Dispose()

# Draw Official 3D Master Plaque on Left Side (480x480 at x=80, y=75)
$og.DrawImage($plaque, 80, 75, 480, 480)

# Right Side: Typography & Brand Narrative
# 1. Category Pill
$pillBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 18, 25, 34))
$pillBorder = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(200, 0, 229, 153), 1.5)
$pillRect = New-Object System.Drawing.RectangleF(610, 105, 340, 36)
$pillPath = New-Object System.Drawing.Drawing2D.GraphicsPath
$pillPath.AddArc(610, 105, 36, 36, 90, 180)
$pillPath.AddArc(914, 105, 36, 36, 270, 180)
$pillPath.CloseFigure()
$og.FillPath($pillBrush, $pillPath)
$og.DrawPath($pillBorder, $pillPath)
$pillBrush.Dispose(); $pillBorder.Dispose(); $pillPath.Dispose()

$pillFont = New-Object System.Drawing.Font("Arial", 11, [System.Drawing.FontStyle]::Bold)
$pillTextBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 0, 229, 153))
$og.DrawString("OFFICIAL MASTER RECORDING SUITE", $pillFont, $pillTextBrush, 626, 114)
$pillFont.Dispose(); $pillTextBrush.Dispose()

# 2. Main Title: "BEATS BAZAAR"
$titleFont = New-Object System.Drawing.Font("Arial", 46, [System.Drawing.FontStyle]::Bold)
$whiteBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 255, 255, 255))
$og.DrawString("BEATS", $titleFont, $whiteBrush, 608, 160)

# Gradient BAZAAR
$gradTextBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush([System.Drawing.PointF]::new(780, 160), [System.Drawing.PointF]::new(1050, 160), [System.Drawing.Color]::FromArgb(255, 0, 229, 153), [System.Drawing.Color]::FromArgb(255, 245, 158, 11))
$og.DrawString("BAZAAR", $titleFont, $gradTextBrush, 786, 160)
$titleFont.Dispose(); $whiteBrush.Dispose(); $gradTextBrush.Dispose()

# 3. Subtitle / Value Proposition
$taglineFont = New-Object System.Drawing.Font("Arial", 18, [System.Drawing.FontStyle]::Bold)
$taglineBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 220, 228, 235))
$og.DrawString("The Global Beat Marketplace & 24/7 Cypher Room", $taglineFont, $taglineBrush, 610, 236)
$taglineFont.Dispose(); $taglineBrush.Dispose()

# 4. Feature Bullets / Value Props
$featFont = New-Object System.Drawing.Font("Arial", 13, [System.Drawing.FontStyle]::Regular)
$featBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 160, 175, 190))
$bulletPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 0, 229, 153), 2.5)

$features = @(
    "Direct Legal Licensing with Instant Untagged Master WAVs",
    "24/7 Freestyle Cypher Room with Live Audio Crossfading",
    "Autonomous Native AI DJ Bazza for Curation & Live Scoring",
    "Digital Proof-of-Work Bachs Blockchain Checkout"
)

$fy = 285
foreach ($feat in $features) {
    # Checkmark / dot
    $og.DrawEllipse($bulletPen, 612, [float]($fy + 4), 6, 6)
    $og.DrawString($feat, $featFont, $featBrush, 630, [float]$fy)
    $fy += 32
}
$featFont.Dispose(); $featBrush.Dispose(); $bulletPen.Dispose()

# 5. Bottom Verified Badges Row
$badgeBg = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(180, 15, 22, 30))
$badgeBorder = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(80, 255, 255, 255), 1.0)
$og.FillRectangle($badgeBg, 610, 440, 520, 60)
$og.DrawRectangle($badgeBorder, 610, 440, 520, 60)
$badgeBg.Dispose(); $badgeBorder.Dispose()

$badgeFont = New-Object System.Drawing.Font("Arial", 11, [System.Drawing.FontStyle]::Bold)
$goldBadgeBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 245, 158, 11))
$emBadgeBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 0, 229, 153))

$og.DrawString("VERIFIED MASTER", $badgeFont, $goldBadgeBrush, 626, 462)
$og.DrawString("•", $badgeFont, $emBadgeBrush, 755, 462)
$og.DrawString("LEGAL RIGHTS CERTIFIED", $badgeFont, $goldBadgeBrush, 775, 462)
$og.DrawString("•", $badgeFont, $emBadgeBrush, 965, 462)
$og.DrawString("PACY LABS", $badgeFont, $emBadgeBrush, 985, 462)
$badgeFont.Dispose(); $goldBadgeBrush.Dispose(); $emBadgeBrush.Dispose()

# Save OG image
$ogBmp.Save("$publicDir\og-image.png", [System.Drawing.Imaging.ImageFormat]::Png)
$og.Dispose()
$ogBmp.Dispose()
Write-Host "Generated: $publicDir\og-image.png (1200x630)"

$plaque.Dispose()
Write-Host "All brand assets generated successfully matching logo-plaque.png!"
