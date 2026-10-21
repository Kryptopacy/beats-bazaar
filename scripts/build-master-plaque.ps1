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

# 6. Render the EXACT Mirrored Double "BB" Geometry from the First Image, made BOLD & PROMINENT
# Scale factor from 192 to 1024 is ~5.33x
# Center is (512, 512). The emblem spans width ~170px, height ~160px.
$bbPenGlow = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(160, 0, 229, 153), 14.0)
$bbPenGlow.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
$bbPenGlow.EndCap = [System.Drawing.Drawing2D.LineCap]::Round

$bbPenMain = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 0, 229, 153), 8.5)
$bbPenMain.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
$bbPenMain.EndCap = [System.Drawing.Drawing2D.LineCap]::Round

$bbPenCore = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 110, 231, 183), 4.0)
$bbPenCore.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
$bbPenCore.EndCap = [System.Drawing.Drawing2D.LineCap]::Round

# Central Vertical Audio Frequency Divider Stem
$stemX = 512.0
$stemTop = 440.0
$stemBottom = 584.0

# Function to draw a path with glow, main, and core pens
function Draw-BBPath {
    param([System.Drawing.Drawing2D.GraphicsPath]$p)
    $g.DrawPath($bbPenGlow, $p)
    $g.DrawPath($bbPenMain, $p)
    $g.DrawPath($bbPenCore, $p)
}

# Stem
$stemPath = New-Object System.Drawing.Drawing2D.GraphicsPath
$stemPath.AddLine([float]$stemX, [float]$stemTop, [float]$stemX, [float]$stemBottom)
Draw-BBPath -p $stemPath
$stemPath.Dispose()

# Right 'B' Upper Resonator Loop
$rTop = New-Object System.Drawing.Drawing2D.GraphicsPath
$rTop.AddBezier(512.0, 442.0, 565.0, 442.0, 588.0, 465.0, 588.0, 488.0)
$rTop.AddBezier(588.0, 505.0, 565.0, 512.0, 512.0, 512.0, 512.0, 512.0)
Draw-BBPath -p $rTop
$rTop.Dispose()

# Right 'B' Lower Resonator Loop
$rBot = New-Object System.Drawing.Drawing2D.GraphicsPath
$rBot.AddBezier(512.0, 512.0, 570.0, 512.0, 594.0, 524.0, 594.0, 548.0)
$rBot.AddBezier(594.0, 570.0, 565.0, 584.0, 512.0, 584.0, 512.0, 584.0)
Draw-BBPath -p $rBot
$rBot.Dispose()

# Left Mirrored 'B' Upper Resonator Loop
$lTop = New-Object System.Drawing.Drawing2D.GraphicsPath
$lTop.AddBezier(512.0, 442.0, 459.0, 442.0, 436.0, 465.0, 436.0, 488.0)
$lTop.AddBezier(436.0, 505.0, 459.0, 512.0, 512.0, 512.0, 512.0, 512.0)
Draw-BBPath -p $lTop
$lTop.Dispose()

# Left Mirrored 'B' Lower Resonator Loop
$lBot = New-Object System.Drawing.Drawing2D.GraphicsPath
$lBot.AddBezier(512.0, 512.0, 454.0, 512.0, 430.0, 524.0, 430.0, 548.0)
$lBot.AddBezier(430.0, 570.0, 459.0, 584.0, 512.0, 584.0, 512.0, 584.0)
Draw-BBPath -p $lBot
$lBot.Dispose()

# Acoustic Rib Lines inside each lobe (as seen in the original image ASCII scan)
$ribPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(220, 253, 230, 138), 3.0)
# Right ribs
$g.DrawLine($ribPen, 542.0, 464.0, 558.0, 464.0)
$g.DrawLine($ribPen, 542.0, 488.0, 564.0, 488.0)
$g.DrawLine($ribPen, 542.0, 536.0, 566.0, 536.0)
$g.DrawLine($ribPen, 542.0, 560.0, 560.0, 560.0)

# Left ribs
$g.DrawLine($ribPen, 482.0, 464.0, 466.0, 464.0)
$g.DrawLine($ribPen, 482.0, 488.0, 460.0, 488.0)
$g.DrawLine($ribPen, 482.0, 536.0, 458.0, 536.0)
$g.DrawLine($ribPen, 482.0, 560.0, 464.0, 560.0)
$ribPen.Dispose()

# Center Playhead Diamond
$diamondBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 255, 255, 255))
$diamondPts = @(
    (New-Object System.Drawing.PointF(512.0, 502.0)),
    (New-Object System.Drawing.PointF(520.0, 512.0)),
    (New-Object System.Drawing.PointF(512.0, 522.0)),
    (New-Object System.Drawing.PointF(504.0, 512.0))
)
$g.FillPolygon($diamondBrush, $diamondPts)
$diamondBrush.Dispose()

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
