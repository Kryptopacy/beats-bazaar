Add-Type -AssemblyName System.Drawing

$publicDir = "D:\pacy_labs\beats_bazaar\public"
$out1024 = "$publicDir\icon-512.png"
$v2Path = "C:\Users\dev.zoro\.gemini\antigravity\brain\c5d55432-4eb6-44f7-8576-2a2a121afe7b\beats_bazaar_master_plaque_perfected_v2_1792579219668.jpg"
$userImgPath = "C:\Users\dev.zoro\.gemini\antigravity\brain\c5d55432-4eb6-44f7-8576-2a2a121afe7b\.user_uploaded\media_1792579245291_3e1e09e4.png"

# Choose base image: v2 is 1024x1024 high resolution!
$baseBmp = [System.Drawing.Bitmap]::FromFile($v2Path)
$size = 512

$destBmp = New-Object System.Drawing.Bitmap($size, $size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($destBmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
$g.Clear([System.Drawing.Color]::Transparent)

# 1. Clip the plaque squircle on true transparent background
$pad = [int]($size * 0.04)
$w = $size - (2 * $pad)
$radius = [int]($size * 0.21)

$clipPath = New-Object System.Drawing.Drawing2D.GraphicsPath
$clipPath.AddArc($pad, $pad, $radius * 2, $radius * 2, 180, 90)
$clipPath.AddArc($pad + $w - ($radius * 2), $pad, $radius * 2, $radius * 2, 270, 90)
$clipPath.AddArc($pad + $w - ($radius * 2), $pad + $w - ($radius * 2), $radius * 2, $radius * 2, 0, 90)
$clipPath.AddArc($pad, $pad + $w - ($radius * 2), $radius * 2, $radius * 2, 90, 90)
$clipPath.CloseFigure()

$g.SetClip($clipPath)
# Draw 3D plaque cropped to fill the squircle perfectly
$srcRect = New-Object System.Drawing.Rectangle([int]($baseBmp.Width * 0.12), [int]($baseBmp.Height * 0.115), [int]($baseBmp.Width * 0.76), [int]($baseBmp.Height * 0.76))
$destRect = New-Object System.Drawing.Rectangle($pad, $pad, $w, $w)
$g.DrawImage($baseBmp, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
$g.ResetClip()

# Draw subtle outer bevel border
$borderPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(140, 0, 229, 153), 2.5)
$g.DrawPath($borderPen, $clipPath)

# 2. Disc Center coordinates
$cx = $size / 2.0
$cy = $size / 2.0

# 3. Engraved Crown Text: BEATS BAZAAR prominently at Top Center (12 o'clock)
# We draw the curved text or arched crown plate at top of gold disc
$goldDiscRadius = $size * 0.33
$fontCrown = New-Object System.Drawing.Font("Arial Black", [float]($size * 0.034), [System.Drawing.FontStyle]::Bold)
$fontSub = New-Object System.Drawing.Font("Arial", [float]($size * 0.022), [System.Drawing.FontStyle]::Bold)
$engraveBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(230, 42, 26, 4))
$goldHighlight = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(180, 254, 243, 199))

# Draw Top Center Crown Banner: "BEATS BAZAAR"
$crownText = "BEATS BAZAAR"
$crownSize = $g.MeasureString($crownText, $fontCrown)
$crownX = $cx - ($crownSize.Width / 2.0)
$crownY = $cy - $goldDiscRadius + ($size * 0.02)

# Engraved shadow + fill
$g.DrawString($crownText, $fontCrown, $goldHighlight, [float]($crownX), [float]($crownY + 1.2))
$g.DrawString($crownText, $fontCrown, $engraveBrush, [float]($crownX), [float]($crownY))

# Flanking Subtext: "VERIFIED MASTER" on left, "LEGAL RIGHTS" on right
$leftText = "• VERIFIED MASTER •"
$rightText = "• LEGAL RIGHTS •"
$subSizeL = $g.MeasureString($leftText, $fontSub)
$subSizeR = $g.MeasureString($rightText, $fontSub)

$subBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(200, 70, 46, 11))
$g.DrawString($leftText, $fontSub, $subBrush, [float]($cx - ($size * 0.28)), [float]($cy - ($size * 0.16)))
$g.DrawString($rightText, $fontSub, $subBrush, [float]($cx + ($size * 0.05)), [float]($cy - ($size * 0.16)))

# 4. BOLD, HIGH-CONTRAST CENTER "BB" MONOGRAM SOUND CHAMBER
# Draw dedicated dark obsidian central sound well
$chamberR = [float]($size * 0.165)
$chamberBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(250, 10, 14, 20))
$g.FillEllipse($chamberBrush, [float]($cx - $chamberR), [float]($cy - $chamberR), [float]($chamberR * 2), [float]($chamberR * 2))

# Glowing cyber emerald neon rim (#00E599)
$neonRimPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 0, 229, 153), [float]($size * 0.018))
$g.DrawEllipse($neonRimPen, [float]($cx - $chamberR), [float]($cy - $chamberR), [float]($chamberR * 2), [float]($chamberR * 2))

# Inner subtle glow
$innerGlowPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(100, 52, 211, 153), [float]($size * 0.008))
$g.DrawEllipse($innerGlowPen, [float]($cx - $chamberR + 3), [float]($cy - $chamberR + 3), [float](($chamberR - 3) * 2), [float](($chamberR - 3) * 2))

# 5. Bold, Thick Sculpted "BB" Monogram
$stemW = [float]($size * 0.036)
$stemH = [float]($size * 0.20)
$stemX = [float]($cx - ($size * 0.09))
$stemY = [float]($cy - ($stemH / 2.0))

# Solid Frequency Stem (Emerald Neon)
$emeraldBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 0, 229, 153))
$stemPath = New-Object System.Drawing.Drawing2D.GraphicsPath
$sR = $stemW / 2.0
$stemPath.AddArc($stemX, $stemY, $stemW, $stemW, 180, 180)
$stemPath.AddArc($stemX, [float]($stemY + $stemH - $stemW), $stemW, $stemW, 0, 180)
$stemPath.CloseFigure()
$g.FillPath($emeraldBrush, $stemPath)

# Thick Resonant "B" Wave Loops (Stroke width: 3.4px equivalent, scaled to size)
$wavePen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 0, 229, 153), [float]($size * 0.034))
$wavePen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
$wavePen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round

# Upper B Loop
$g.DrawArc($wavePen, [float]($cx - ($size * 0.075)), [float]($cy - ($size * 0.095)), [float]($size * 0.17), [float]($size * 0.105), -80, 175)
# Lower B Loop
$g.DrawArc($wavePen, [float]($cx - ($size * 0.075)), [float]($cy - ($size * 0.005)), [float]($size * 0.18), [float]($size * 0.11), -85, 180)

# Interlocking Mirrored Gold Soundwave Echo (Left Side)
$goldWavePen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 251, 191, 36), [float]($size * 0.022))
$goldWavePen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
$goldWavePen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
$g.DrawArc($goldWavePen, [float]($cx - ($size * 0.16)), [float]($cy - ($size * 0.075)), [float]($size * 0.10), [float]($size * 0.08), 85, 180)
$g.DrawArc($goldWavePen, [float]($cx - ($size * 0.17)), [float]($cy + ($size * 0.005)), [float]($size * 0.11), [float]($size * 0.085), 85, 180)

# Cyber Playhead Diamond in Center
$diamondBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 255, 255, 255))
$dPt1 = New-Object System.Drawing.PointF([float]($cx - ($size * 0.02)), [float]($cy - ($size * 0.025)))
$dPt2 = New-Object System.Drawing.PointF([float]($cx + ($size * 0.02)), [float]($cy))
$dPt3 = New-Object System.Drawing.PointF([float]($cx - ($size * 0.02)), [float]($cy + ($size * 0.025)))
$g.FillPolygon($diamondBrush, [System.Drawing.PointF[]]@($dPt1, $dPt2, $dPt3))

# Save 512 master PNG
$destBmp.Save($out1024, [System.Drawing.Imaging.ImageFormat]::Png)

# Resample to 192, 180, 32
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
    $sg.DrawImage($destBmp, 0, 0, $sw, $sw)
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

$g.Dispose()
$destBmp.Dispose()
$baseBmp.Dispose()

Write-Output "Master Certification Plaque composited and saved successfully with transparent background!"
