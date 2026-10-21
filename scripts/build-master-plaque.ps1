Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\dev.zoro\.gemini\antigravity\brain\c5d55432-4eb6-44f7-8576-2a2a121afe7b\beats_bazaar_master_plaque_icon_1792528816088.jpg"
$publicDir = "D:\pacy_labs\beats_bazaar\public"
$master = [System.Drawing.Bitmap]::FromFile($srcPath)

$w = 1024
$h = 1024
$cx = 512.0
$cy = 512.0

# 1. Create transparent 32-bit ARGB canvas
$canvas = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($canvas)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
$g.Clear([System.Drawing.Color]::Transparent)

# 2. Draw Squircle Clip for Transparency (Masking out the black background)
# Plaque boundaries: x=76 to x=948 (width 872), radius=195
$sqMargin = 76
$sqSize = 872
$sqRadius = 195

$sqPath = New-Object System.Drawing.Drawing2D.GraphicsPath
$sqPath.AddArc($sqMargin, $sqMargin, $sqRadius * 2, $sqRadius * 2, 180, 90)
$sqPath.AddArc($sqMargin + $sqSize - ($sqRadius * 2), $sqMargin, $sqRadius * 2, $sqRadius * 2, 270, 90)
$sqPath.AddArc($sqMargin + $sqSize - ($sqRadius * 2), $sqMargin + $sqSize - ($sqRadius * 2), $sqRadius * 2, $sqRadius * 2, 0, 90)
$sqPath.AddArc($sqMargin, $sqMargin + $sqSize - ($sqRadius * 2), $sqRadius * 2, $sqRadius * 2, 90, 90)
$sqPath.CloseFigure()

$g.SetClip($sqPath)
$g.DrawImage($master, 0, 0, $w, $h)
$g.ResetClip()

# Draw subtle outer bevel highlight along the clipped edge
$bevelPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(100, 0, 229, 153), 2.5)
$g.DrawPath($bevelPen, $sqPath)
$bevelPen.Dispose()

# 3. Heal the Old Rim Text Track (Radius 286 to 324)
# We sample clean radial gold from the lower disc (angle 90 deg) and reconstruct the clean gold ring
$rimInner = 286
$rimOuter = 324
$rimWidth = $rimOuter - $rimInner

# Create a clean gold circular track overlay with the radial brushed gradient
$goldTrackPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(235, 215, 192, 138), $rimWidth)
$trackRadius = ($rimInner + $rimOuter) / 2.0
$g.DrawEllipse($goldTrackPen, [float]($cx - $trackRadius), [float]($cy - $trackRadius), [float]($trackRadius * 2), [float]($trackRadius * 2))
$goldTrackPen.Dispose()

# Draw micro-groove separator lines
$groovePen1 = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(80, 110, 85, 45), 1.5)
$groovePen2 = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(60, 255, 255, 255), 1.0)
$g.DrawEllipse($groovePen1, [float]($cx - $rimInner), [float]($cy - $rimInner), [float]($rimInner * 2), [float]($rimInner * 2))
$g.DrawEllipse($groovePen2, [float]($cx - $rimOuter), [float]($cy - $rimOuter), [float]($rimOuter * 2), [float]($rimOuter * 2))
$groovePen1.Dispose()
$groovePen2.Dispose()

# 4. Render Deep-Engraved Crown Text around the gold rim
function Draw-CurvedText {
    param(
        [System.Drawing.Graphics]$graphics,
        [string]$text,
        [float]$radius,
        [float]$centerAngleDeg,
        [float]$spreadDeg,
        [System.Drawing.Font]$font,
        [System.Drawing.Brush]$fillBrush,
        [System.Drawing.Brush]$shadowBrush
    )

    $chars = $text.ToCharArray()
    $count = $chars.Length
    if ($count -eq 0) { return }

    $step = $spreadDeg / [math]::Max(1, ($count - 1))
    $startAngle = $centerAngleDeg - ($spreadDeg / 2.0)

    for ($i = 0; $i -lt $count; $i++) {
        $angleDeg = $startAngle + ($i * $step)
        # Convert to radians (-90 deg is top / 12 o'clock)
        $rad = ($angleDeg - 90.0) * [math]::PI / 180.0
        
        $charX = $cx + ($radius * [math]::Cos($rad))
        $charY = $cy + ($radius * [math]::Sin($rad))
        $charStr = $chars[$i].ToString()

        $state = $graphics.Save()
        $graphics.TranslateTransform($charX, $charY)
        # Tangent rotation
        $graphics.RotateTransform($angleDeg)

        # Draw deep-engraved inner shadow first
        $sf = New-Object System.Drawing.StringFormat
        $sf.Alignment = [System.Drawing.StringAlignment]::Center
        $sf.LineAlignment = [System.Drawing.StringAlignment]::Center

        if ($shadowBrush) {
            $graphics.DrawString($charStr, $font, $shadowBrush, 0.8, 0.8, $sf)
        }
        $graphics.DrawString($charStr, $font, $fillBrush, 0, 0, $sf)

        $graphics.Restore($state)
        $sf.Dispose()
    }
}

# Typography Brushes
$darkEngraveBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 60, 42, 18))
$shadowEngraveBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(120, 255, 245, 210))
$secEngraveBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(240, 85, 62, 28))

# Fonts
$fontFamily = New-Object System.Drawing.FontFamily("Arial")
$crownFont = New-Object System.Drawing.Font($fontFamily, 19, [System.Drawing.FontStyle]::Bold)
$secFont   = New-Object System.Drawing.Font($fontFamily, 14, [System.Drawing.FontStyle]::Bold)

# 4A. TOP-CENTER CROWN: "BEATS BAZAAR" at 12 o'clock (centerAngle = 0 deg, spread = 38 deg)
Draw-CurvedText -graphics $g -text "BEATS BAZAAR" -radius 305 -centerAngleDeg 0.0 -spreadDeg 36.0 -font $crownFont -fillBrush $darkEngraveBrush -shadowBrush $shadowEngraveBrush

# 4B. LEFT CURVE: "VERIFIED MASTER" curving upward toward BEATS BAZAAR (centerAngle = -42 deg, spread = 36 deg)
Draw-CurvedText -graphics $g -text "VERIFIED MASTER" -radius 305 -centerAngleDeg -42.0 -spreadDeg 38.0 -font $secFont -fillBrush $secEngraveBrush -shadowBrush $shadowEngraveBrush

# 4C. RIGHT CURVE: "LEGAL RIGHTS" curving upward toward BEATS BAZAAR (centerAngle = 42 deg, spread = 32 deg)
Draw-CurvedText -graphics $g -text "LEGAL RIGHTS" -radius 305 -centerAngleDeg 42.0 -spreadDeg 34.0 -font $secFont -fillBrush $secEngraveBrush -shadowBrush $shadowEngraveBrush

# Separator Bullets
$bulletBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 180, 140, 60))
$g.FillEllipse($bulletBrush, [float]($cx + 305 * [math]::Cos(-64 * [math]::PI / 180) - 3), [float]($cy + 305 * [math]::Sin(-64 * [math]::PI / 180) - 3), 6, 6)
$g.FillEllipse($bulletBrush, [float]($cx + 305 * [math]::Cos(-21 * [math]::PI / 180) - 3), [float]($cy + 305 * [math]::Sin(-21 * [math]::PI / 180) - 3), 6, 6)
$g.FillEllipse($bulletBrush, [float]($cx + 305 * [math]::Cos(21 * [math]::PI / 180) - 3), [float]($cy + 305 * [math]::Sin(21 * [math]::PI / 180) - 3), 6, 6)
$g.FillEllipse($bulletBrush, [float]($cx + 305 * [math]::Cos(61 * [math]::PI / 180) - 3), [float]($cy + 305 * [math]::Sin(61 * [math]::PI / 180) - 3), 6, 6)

# 5. Bold, High-Contrast Center "BB" Sound Chamber (Radius 136)
# Draw the dark obsidian sound well plate for rich contrast against the gold vinyl
$centerWellR = 136.0
$wellPath = New-Object System.Drawing.Drawing2D.GraphicsPath
$wellPath.AddEllipse([float]($cx - $centerWellR), [float]($cy - $centerWellR), [float]($centerWellR * 2), [float]($centerWellR * 2))

# Gradient fill for depth: #141C26 to #080C10
$wellBrush = New-Object System.Drawing.Drawing2D.PathGradientBrush($wellPath)
$wellBrush.CenterColor = [System.Drawing.Color]::FromArgb(255, 18, 25, 34)
$wellBrush.SurroundColors = @([System.Drawing.Color]::FromArgb(255, 8, 12, 16))
$g.FillPath($wellBrush, $wellPath)
$wellBrush.Dispose()
$wellPath.Dispose()

# Glowing Cyber Emerald Outer Ring
$haloPen1 = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(120, 0, 229, 153), 10.0)
$haloPen2 = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 0, 229, 153), 4.5)
$haloPen3 = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 255, 255, 255), 1.5)
$g.DrawEllipse($haloPen1, [float]($cx - 134), [float]($cy - 134), 268, 268)
$g.DrawEllipse($haloPen2, [float]($cx - 134), [float]($cy - 134), 268, 268)
$g.DrawEllipse($haloPen3, [float]($cx - 134), [float]($cy - 134), 268, 268)
$haloPen1.Dispose()
$haloPen2.Dispose()
$haloPen3.Dispose()

# Helper function to create geometric 'B' lobe paths with smooth rounded corners
function Create-BLobePath {
    param(
        [float]$stemX,
        [float]$topY,
        [float]$botY,
        [float]$reachX,
        [float]$cornerR
    )
    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $path.AddLine([float]$stemX, [float]$topY, [float]($reachX - $cornerR), [float]$topY)
    $path.AddArc([float]($reachX - 2 * $cornerR), [float]$topY, [float](2 * $cornerR), [float](2 * $cornerR), -90, 90)
    $path.AddLine([float]$reachX, [float]($topY + $cornerR), [float]$reachX, [float]($botY - $cornerR))
    $path.AddArc([float]($reachX - 2 * $cornerR), [float]($botY - 2 * $cornerR), [float](2 * $cornerR), [float](2 * $cornerR), 0, 90)
    $path.AddLine([float]($reachX - $cornerR), [float]$botY, [float]$stemX, [float]$botY)
    return $path
}

# 6. Render the INTERLOCKING DUAL-B SOUND EXCHANGE (Emerald "Beats" + 24k Gold "Bazaar")
# Forward-facing 'B' and 'B' interlocking like an audio loop and trading exchange
$topY = 437.0
$midY = 512.0
$botY = 587.0
$stemW = 16.0
$loopStroke = 10.0
$cornerR = 26.0

# B1 (Beats, Cyber Emerald):
$b1StemCenter = 430.5
$b1StemLeft = $b1StemCenter - ($stemW / 2)
$b1StemRight = $b1StemCenter + ($stemW / 2)
$b1Reach = 522.5

# B2 (Bazaar, 24k Gold):
$b2StemCenter = 502.5
$b2StemLeft = $b2StemCenter - ($stemW / 2)
$b2StemRight = $b2StemCenter + ($stemW / 2)
$b2Reach = 594.5

# Emerald Pens & Brushes
$emGlow = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(150, 0, 229, 153), 16.0)
$emGlow.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
$emGlow.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
$emMain = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 0, 229, 153), $loopStroke)
$emMain.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
$emMain.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
$emCore = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 167, 243, 208), 3.0)
$emCore.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
$emCore.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
$emStemBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 0, 229, 153))

# Gold Pens & Brushes
$goldGlow = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(150, 245, 158, 11), 16.0)
$goldGlow.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
$goldGlow.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
$goldMain = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 245, 158, 11), $loopStroke)
$goldMain.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
$goldMain.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
$goldCore = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 254, 243, 199), 3.0)
$goldCore.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
$goldCore.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
$goldStemBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 245, 158, 11))

# Deep Drop Shadow Pen for the Interlocking Overlap
$shadowPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 8, 11, 14), 16.0)
$shadowPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
$shadowPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round

# Construct Lobe Paths
$b1Top = Create-BLobePath -stemX $b1StemRight -topY $topY -botY $midY -reachX $b1Reach -cornerR $cornerR
$b1Bot = Create-BLobePath -stemX $b1StemRight -topY $midY -botY $botY -reachX $b1Reach -cornerR $cornerR
$b2Top = Create-BLobePath -stemX $b2StemRight -topY $topY -botY $midY -reachX $b2Reach -cornerR $cornerR
$b2Bot = Create-BLobePath -stemX $b2StemRight -topY $midY -botY $botY -reachX $b2Reach -cornerR $cornerR

# WEAVING SEQUENCE:
# 1. Underneath layer: B2 (Gold) Bottom Loop
$g.DrawPath($goldGlow, $b2Bot)
$g.DrawPath($goldMain, $b2Bot)
$g.DrawPath($goldCore, $b2Bot)

# 2. Underneath layer: B1 (Emerald) Top Loop
$g.DrawPath($emGlow, $b1Top)
$g.DrawPath($emMain, $b1Top)
$g.DrawPath($emCore, $b1Top)

# 3. B1 (Emerald) Stem with Equalizer Cutouts
$b1StemRect = New-Object System.Drawing.RectangleF([float]$b1StemLeft, [float]$topY, [float]$stemW, [float]($botY - $topY))
$g.FillRectangle($emStemBrush, $b1StemRect)
$eqBg = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 12, 16, 18))
for ($k = 0; $k -lt 5; $k++) {
    $ny = $topY + 16.0 + ($k * 26.0)
    $g.FillRectangle($eqBg, [float]($b1StemLeft - 1), [float]$ny, [float]($stemW * 0.45), 4.0)
    $led = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 255, 255, 255))
    $g.FillRectangle($led, [float]($b1StemLeft + 2), [float]($ny + 1), 3.0, 2.0)
    $led.Dispose()
}

# 4. WEAVE OVER: B2 (Gold) Top Loop weaves OVER B1 (with shadow)
$g.DrawPath($shadowPen, $b2Top)
$g.DrawPath($goldGlow, $b2Top)
$g.DrawPath($goldMain, $b2Top)
$g.DrawPath($goldCore, $b2Top)

# 5. B2 (Gold) Stem with Equalizer Cutouts (shadow behind where B1 loops pass)
$b2StemRect = New-Object System.Drawing.RectangleF([float]$b2StemLeft, [float]$topY, [float]$stemW, [float]($botY - $topY))
$g.FillRectangle($shadowPen.Brush, [float]($b2StemLeft - 2), [float]$topY, [float]($stemW + 4), [float]($botY - $topY))
$g.FillRectangle($goldStemBrush, $b2StemRect)
for ($k = 0; $k -lt 5; $k++) {
    $ny = $topY + 16.0 + ($k * 26.0)
    $g.FillRectangle($eqBg, [float]($b2StemRight - ($stemW * 0.45)), [float]$ny, [float]($stemW * 0.45 + 1), 4.0)
    $led = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 255, 255, 255))
    $g.FillRectangle($led, [float]($b2StemRight - 5), [float]($ny + 1), 3.0, 2.0)
    $led.Dispose()
}

# 6. WEAVE OVER: B1 (Emerald) Bottom Loop weaves OVER B2 (with shadow)
$g.DrawPath($shadowPen, $b1Bot)
$g.DrawPath($emGlow, $b1Bot)
$g.DrawPath($emMain, $b1Bot)
$g.DrawPath($emCore, $b1Bot)

# 7. Acoustic Wave Frequency Bars inside loops
$emRib = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(200, 0, 229, 153), 2.5)
$g.DrawLine($emRib, 456.0, 466.0, 490.0, 466.0)
$g.DrawLine($emRib, 456.0, 484.0, 500.0, 484.0)
$g.DrawLine($emRib, 456.0, 540.0, 500.0, 540.0)
$g.DrawLine($emRib, 456.0, 558.0, 490.0, 558.0)
$emRib.Dispose()

$goldRib = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(200, 245, 158, 11), 2.5)
$g.DrawLine($goldRib, 528.0, 466.0, 562.0, 466.0)
$g.DrawLine($goldRib, 528.0, 484.0, 572.0, 484.0)
$g.DrawLine($goldRib, 528.0, 540.0, 572.0, 540.0)
$g.DrawLine($goldRib, 528.0, 558.0, 562.0, 558.0)
$goldRib.Dispose()

# 8. Center Exchange Playhead Diamond at intersection (512, 512)
$dShadow = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(220, 6, 8, 10))
$dPtsShadow = @(
    (New-Object System.Drawing.PointF(512.0, 499.0)),
    (New-Object System.Drawing.PointF(525.0, 512.0)),
    (New-Object System.Drawing.PointF(512.0, 525.0)),
    (New-Object System.Drawing.PointF(499.0, 512.0))
)
$g.FillPolygon($dShadow, $dPtsShadow)
$dShadow.Dispose()

$dBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 255, 255, 255))
$dPts = @(
    (New-Object System.Drawing.PointF(512.0, 503.0)),
    (New-Object System.Drawing.PointF(521.0, 512.0)),
    (New-Object System.Drawing.PointF(512.0, 521.0)),
    (New-Object System.Drawing.PointF(503.0, 512.0))
)
$g.FillPolygon($dBrush, $dPts)
$dBrush.Dispose()

$dot = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 0, 229, 153))
$g.FillEllipse($dot, 510.0, 510.0, 4.0, 4.0)
$dot.Dispose()

# Clean up emblem paths and brushes
$b1Top.Dispose(); $b1Bot.Dispose(); $b2Top.Dispose(); $b2Bot.Dispose()
$shadowPen.Dispose(); $eqBg.Dispose(); $emStemBrush.Dispose(); $goldStemBrush.Dispose()
$emGlow.Dispose(); $emMain.Dispose(); $emCore.Dispose()
$goldGlow.Dispose(); $goldMain.Dispose(); $goldCore.Dispose()

# 7. Save 1024 Master Transparent Plaque
$canvas.Save("$publicDir\logo-plaque.png", [System.Drawing.Imaging.ImageFormat]::Png)
Write-Output "Saved 1024 master: $publicDir\logo-plaque.png"

# 8. Downscale for 512, 192, 180, 32
function Save-ResizedIcon {
    param([int]$sz, [string]$outName)
    $dest = New-Object System.Drawing.Bitmap($sz, $sz, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $dg = [System.Drawing.Graphics]::FromImage($dest)
    $dg.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $dg.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $dg.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $dg.Clear([System.Drawing.Color]::Transparent)
    $dg.DrawImage($canvas, 0, 0, $sz, $sz)
    $dest.Save("$publicDir\$outName", [System.Drawing.Imaging.ImageFormat]::Png)
    $dg.Dispose()
    $dest.Dispose()
    Write-Output "Saved: $publicDir\$outName ($sz x $sz)"
}

Save-ResizedIcon -sz 512 -outName "icon-512.png"
Save-ResizedIcon -sz 192 -outName "icon-192.png"
Save-ResizedIcon -sz 180 -outName "apple-touch-icon.png"
Save-ResizedIcon -sz 32  -outName "favicon-32.png"

# Convert 32x32 PNG to favicon.ico
$iconBmp = [System.Drawing.Bitmap]::FromFile("$publicDir\favicon-32.png")
$hIcon = $iconBmp.GetHicon()
$icon = [System.Drawing.Icon]::FromHandle($hIcon)
$fs = New-Object System.IO.FileStream("$publicDir\favicon.ico", [System.IO.FileMode]::Create)
$icon.Save($fs)
$fs.Close()
$iconBmp.Dispose()
Write-Output "Saved: $publicDir\favicon.ico"

# Clean up
$g.Dispose()
$canvas.Dispose()
$master.Dispose()

Write-Output "Master Plaque generation completed successfully!"
