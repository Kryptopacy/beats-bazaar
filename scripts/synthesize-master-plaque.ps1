Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\dev.zoro\.gemini\antigravity\brain\c5d55432-4eb6-44f7-8576-2a2a121afe7b\beats_bazaar_master_plaque_icon_1792528816088.jpg"
$destPath = "D:\pacy_labs\beats_bazaar\public\icon-512.png"
$publicDir = "D:\pacy_labs\beats_bazaar\public"

$src = [System.Drawing.Bitmap]::FromFile($srcPath)
$size = 1024

# Create high-precision 32-bit ARGB canvas
$master = New-Object System.Drawing.Bitmap($size, $size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($master)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
$g.Clear([System.Drawing.Color]::Transparent)

# 1. Precise Squircle Mask for Plaque on Transparency
# Plaque box: x=40, y=40, w=944, h=944, radius=210
$pad = 38
$w = $size - (2 * $pad)
$radius = 215

$path = New-Object System.Drawing.Drawing2D.GraphicsPath
$path.AddArc($pad, $pad, $radius * 2, $radius * 2, 180, 90)
$path.AddArc($pad + $w - ($radius * 2), $pad, $radius * 2, $radius * 2, 270, 90)
$path.AddArc($pad + $w - ($radius * 2), $pad + $w - ($radius * 2), $radius * 2, $radius * 2, 0, 90)
$path.AddArc($pad, $pad + $w - ($radius * 2), $radius * 2, $radius * 2, 90, 90)
$path.CloseFigure()

$g.SetClip($path)
# Draw original 3D render inside the squircle
$g.DrawImage($src, 0, 0, $size, $size)
$g.ResetClip()

# 2. Disc Geometry & Coordinates
$cx = 512.0
$cy = 518.0
$discRadius = 345.0

# 3. Clean up the misplaced side text from original image by blending gold texture arc
$cleanPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(210, 180, 150, 95), 26)
$g.DrawArc($cleanPen, [float]($cx - 338), [float]($cy - 338), [float]676, [float]676, 15, 65)
$cleanPen.Dispose()

# Sample ring brush for golden sheen
$ringPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(140, 225, 195, 125), 1.5)
$g.DrawEllipse($ringPen, [float]($cx - 332), [float]($cy - 332), [float]664, [float]664)
$g.DrawEllipse($ringPen, [float]($cx - 344), [float]($cy - 344), [float]688, [float]688)
$ringPen.Dispose()

# 4. Circular Text Function
function Draw-CurvedText {
    param(
        [System.Drawing.Graphics]$graphics,
        [string]$text,
        [float]$centerX,
        [float]$centerY,
        [float]$radius,
        [float]$centerAngleDeg,
        [System.Drawing.Font]$font,
        [System.Drawing.Brush]$brush,
        [System.Drawing.Brush]$shadowBrush,
        [bool]$clockwise = $true,
        [float]$letterSpacing = 1.0
    )

    $chars = $text.ToCharArray()
    # Measure total angular span
    $charWidths = @()
    $totalWidth = 0.0
    foreach ($ch in $chars) {
        $sz = $graphics.MeasureString($ch.ToString(), $font)
        $w = $sz.Width * $letterSpacing
        $charWidths += $w
        $totalWidth += $w
    }

    $circumference = 2.0 * [math]::PI * $radius
    $totalAngleDeg = ($totalWidth / $circumference) * 360.0

    $startAngleDeg = $centerAngleDeg - ($totalAngleDeg / 2.0)
    $currAngleDeg = $startAngleDeg

    for ($i = 0; $i -lt $chars.Length; $i++) {
        $ch = $chars[$i].ToString()
        $w = $charWidths[$i]
        $charAngleSpan = ($w / $circumference) * 360.0
        $midAngleDeg = $currAngleDeg + ($charAngleSpan / 2.0)
        $currAngleDeg += $charAngleSpan

        # Position on circle
        $angleRad = ($midAngleDeg - 90.0) * [math]::PI / 180.0
        $px = $centerX + ($radius * [math]::Cos($angleRad))
        $py = $centerY + ($radius * [math]::Sin($angleRad))

        $state = $graphics.Save()
        $graphics.TranslateTransform($px, $py)
        $graphics.RotateTransform($midAngleDeg)

        $sz = $graphics.MeasureString($ch, $font)
        $drawX = -$sz.Width / 2.0
        $drawY = -$sz.Height / 2.0

        # Engraved deboss shadow
        if ($shadowBrush -ne $null) {
            $graphics.DrawString($ch, $font, $shadowBrush, [float]($drawX + 1.2), [float]($drawY + 1.5))
        }
        # Main text
        $graphics.DrawString($ch, $font, $brush, [float]$drawX, [float]$drawY)

        $graphics.Restore($state)
    }
}

# Typography setup
$fontFamily = New-Object System.Drawing.FontFamily("Arial Black")
$crownFont = New-Object System.Drawing.Font($fontFamily, 26, [System.Drawing.FontStyle]::Bold)
$secFont   = New-Object System.Drawing.Font("Arial", 16, [System.Drawing.FontStyle]::Bold)

$textBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 38, 26, 8))
$shadowBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(180, 255, 235, 175))

# Top-Center Crown: "BEATS BAZAAR" at 12 o'clock (0 deg)
Draw-CurvedText -graphics $g -text "BEATS BAZAAR" -centerX $cx -centerY $cy -radius ($discRadius - 12) -centerAngleDeg 0.0 -font $crownFont -brush $textBrush -shadowBrush $shadowBrush -letterSpacing 1.05

# Left curve: "VERIFIED MASTER" curving towards 12 o'clock
Draw-CurvedText -graphics $g -text "VERIFIED MASTER" -centerX $cx -centerY $cy -radius ($discRadius - 12) -centerAngleDeg -44.0 -font $secFont -brush $textBrush -shadowBrush $shadowBrush -letterSpacing 1.02

# Right curve: "LEGAL RIGHTS" curving towards 12 o'clock
Draw-CurvedText -graphics $g -text "LEGAL RIGHTS" -centerX $cx -centerY $cy -radius ($discRadius - 12) -centerAngleDeg 44.0 -font $secFont -brush $textBrush -shadowBrush $shadowBrush -letterSpacing 1.02

# 5. Bold, High-Contrast Center "BB" Monogram
# Central Sound Chamber Well (Deep obsidian circle with glowing cyber emerald rim)
$centerR = 142.0

# Outer Neon Halo
$haloPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(90, 0, 229, 153), 16)
$g.DrawEllipse($haloPen, [float]($cx - $centerR), [float]($cy - $centerR), [float]($centerR * 2), [float]($centerR * 2))
$haloPen.Dispose()

# Deep Obsidian Chamber Fill
$wellPath = New-Object System.Drawing.Drawing2D.GraphicsPath
$wellPath.AddEllipse([float]($cx - $centerR), [float]($cy - $centerR), [float]($centerR * 2), [float]($centerR * 2))
$wellBrush = New-Object System.Drawing.Drawing2D.PathGradientBrush($wellPath)
$wellBrush.CenterColor = [System.Drawing.Color]::FromArgb(255, 15, 22, 30)
$wellBrush.SurroundColors = @([System.Drawing.Color]::FromArgb(255, 6, 9, 13))
$g.FillPath($wellBrush, $wellPath)
$wellPath.Dispose()
$wellBrush.Dispose()

# Chamber Emerald Rim
$rimPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 0, 229, 153), 7)
$g.DrawEllipse($rimPen, [float]($cx - $centerR), [float]($cy - $centerR), [float]($centerR * 2), [float]($centerR * 2))
$rimPen.Dispose()

# Inner Gold Bezel Ring
$innerGoldPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(220, 245, 158, 11), 3)
$g.DrawEllipse($innerGoldPen, [float]($cx - ($centerR - 6)), [float]($cy - ($centerR - 6)), [float](($centerR - 6) * 2), [float](($centerR - 6) * 2))
$innerGoldPen.Dispose()

# BOLD Sculptural "BB" Monogram inside the Chamber
# Left Frequency Stem (Thick & Solid)
$stemW = 24.0
$stemH = 156.0
$stemX = $cx - 24.0
$stemY = $cy - ($stemH / 2.0)

$stemPath = New-Object System.Drawing.Drawing2D.GraphicsPath
$sR = $stemW / 2.0
$stemPath.AddArc([float]$stemX, [float]$stemY, [float]$stemW, [float]$stemW, 180, 180)
$stemPath.AddArc([float]$stemX, [float]($stemY + $stemH - $stemW), [float]$stemW, [float]$stemW, 0, 180)
$stemPath.CloseFigure()

$emeraldBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 0, 229, 153))
$g.FillPath($emeraldBrush, $stemPath)
$stemPath.Dispose()

# Upper and Lower Resonator 'B' Loops (Bold 22px Stroke)
$bbPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 0, 229, 153), 22)
$bbPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
$bbPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round

# Upper Loop
$g.DrawArc($bbPen, [float]($cx - 16), [float]($cy - 68), [float]110, [float]70, -70, 155)
# Lower Loop
$g.DrawArc($bbPen, [float]($cx - 16), [float]($cy - 4), [float]118, [float]74, -75, 160)

# Interlocking Mirrored Reverse 'B' Soundwave Echo (Warm Gold, 15px Stroke)
$goldBBPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 251, 191, 36), 15)
$goldBBPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
$goldBBPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round

# Upper Mirrored Loop
$g.DrawArc($goldBBPen, [float]($cx - 100), [float]($cy - 62), [float]90, [float]60, 95, 150)
# Lower Mirrored Loop
$g.DrawArc($goldBBPen, [float]($cx - 106), [float]($cy - 2), [float]96, [float]64, 95, 155)

# Center Titanium Core Playhead Diamond
$coreBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 255, 255, 255))
$pt1 = New-Object System.Drawing.PointF([float]($cx + 12), [float]($cy - 16))
$pt2 = New-Object System.Drawing.PointF([float]($cx + 36), [float]$cy)
$pt3 = New-Object System.Drawing.PointF([float]($cx + 12), [float]($cy + 16))
$g.FillPolygon($coreBrush, [System.Drawing.PointF[]]@($pt1, $pt2, $pt3))
$coreBrush.Dispose()

# Save Master 512x512
$bmp512 = New-Object System.Drawing.Bitmap(512, 512, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g512 = [System.Drawing.Graphics]::FromImage($bmp512)
$g512.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g512.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g512.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g512.Clear([System.Drawing.Color]::Transparent)
$g512.DrawImage($master, 0, 0, 512, 512)
$bmp512.Save("$publicDir\icon-512.png", [System.Drawing.Imaging.ImageFormat]::Png)

# Generate other icon sizes
$sizes = @(
    @{ w = 192; file = "icon-192.png" },
    @{ w = 180; file = "apple-touch-icon.png" },
    @{ w = 32;  file = "favicon-32.png" }
)

foreach ($item in $sizes) {
    $sw = $item.w
    $sBmp = New-Object System.Drawing.Bitmap($sw, $sw, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $sg = [System.Drawing.Graphics]::FromImage($sBmp)
    $sg.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $sg.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $sg.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $sg.Clear([System.Drawing.Color]::Transparent)
    $sg.DrawImage($bmp512, 0, 0, $sw, $sw)
    $sBmp.Save("$publicDir\$($item.file)", [System.Drawing.Imaging.ImageFormat]::Png)
    $sg.Dispose()
    $sBmp.Dispose()
}

# Generate favicon.ico from 32x32
$iconBmp = [System.Drawing.Bitmap]::FromFile("$publicDir\favicon-32.png")
$hIcon = $iconBmp.GetHicon()
$icon = [System.Drawing.Icon]::FromHandle($hIcon)
$fs = New-Object System.IO.FileStream("$publicDir\favicon.ico", [System.IO.FileMode]::Create)
$icon.Save($fs)
$fs.Close()
$iconBmp.Dispose()

# Cleanup
$g.Dispose()
$master.Dispose()
$src.Dispose()
$g512.Dispose()
$bmp512.Dispose()

Write-Output "Master-grade 3D Certification Plaque assets synthesized successfully!"
