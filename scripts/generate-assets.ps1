Add-Type -AssemblyName System.Drawing

$publicDir = "D:\pacy_labs\beats_bazaar\public"
if (!(Test-Path $publicDir)) {
    New-Item -ItemType Directory -Path $publicDir -Force
}

function Create-AppIcon {
    param([int]$size, [string]$outputPath)

    $bmp = New-Object System.Drawing.Bitmap($size, $size)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.Clear([System.Drawing.Color]::Transparent)

    # Base Squircle
    $pad = [int]($size * 0.05)
    $w = $size - (2 * $pad)
    $h = $size - (2 * $pad)
    $radius = [int]($size * 0.22)

    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $path.AddArc($pad, $pad, $radius * 2, $radius * 2, 180, 90)
    $path.AddArc($pad + $w - ($radius * 2), $pad, $radius * 2, $radius * 2, 270, 90)
    $path.AddArc($pad + $w - ($radius * 2), $pad + $h - ($radius * 2), $radius * 2, $radius * 2, 0, 90)
    $path.AddArc($pad, $pad + $h - ($radius * 2), $radius * 2, $radius * 2, 90, 90)
    $path.CloseFigure()

    # Plate Gradient: #16202B to #0A0E13
    $cTop = [System.Drawing.Color]::FromArgb(255, 22, 32, 43)
    $cBottom = [System.Drawing.Color]::FromArgb(255, 10, 14, 19)
    $rect = New-Object System.Drawing.Rectangle($pad, $pad, $w, $h)
    $bgBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, $cTop, $cBottom, 90.0)
    $g.FillPath($bgBrush, $path)

    # Emerald Border: #00E599
    $borderPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(200, 0, 229, 153), [math]::Max(2, [int]($size * 0.025)))
    $g.DrawPath($borderPen, $path)

    # Center Vinyl Rings
    $cx = $size / 2.0
    $cy = $size / 2.0
    $ringPen1 = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(25, 255, 255, 255), [math]::Max(1, [int]($size * 0.008)))
    $ringR1 = $size * 0.35
    $g.DrawEllipse($ringPen1, [float]($cx - $ringR1), [float]($cy - $ringR1), [float]($ringR1 * 2), [float]($ringR1 * 2))

    $ringPen2 = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(15, 255, 255, 255), [math]::Max(1, [int]($size * 0.006)))
    $ringR2 = $size * 0.25
    $g.DrawEllipse($ringPen2, [float]($cx - $ringR2), [float]($cy - $ringR2), [float]($ringR2 * 2), [float]($ringR2 * 2))

    # Soundwave B-Spine (Vertical bar)
    $stemX = $size * 0.27
    $stemY = $size * 0.24
    $stemW = $size * 0.08
    $stemH = $size * 0.52
    $stemBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 0, 229, 153))
    
    # Rounded stem
    $stemPath = New-Object System.Drawing.Drawing2D.GraphicsPath
    $sR = $stemW / 2.0
    $stemPath.AddArc([float]$stemX, [float]$stemY, [float]$stemW, [float]$stemW, 180, 180)
    $stemPath.AddArc([float]$stemX, [float]($stemY + $stemH - $stemW), [float]$stemW, [float]$stemW, 0, 180)
    $stemPath.CloseFigure()
    $g.FillPath($stemBrush, $stemPath)

    # Top & Bottom B Wave Arcs
    $wavePen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 0, 229, 153), [float]($size * 0.075))
    $wavePen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $wavePen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round

    # Upper Wave
    $g.DrawArc($wavePen, [float]($size * 0.15), [float]($size * 0.26), [float]($size * 0.52), [float]($size * 0.27), -70, 160)
    # Lower Wave
    $g.DrawArc($wavePen, [float]($size * 0.13), [float]($size * 0.47), [float]($size * 0.58), [float]($size * 0.29), -75, 170)

    # Cyber Gold Playhead Triangle
    $goldBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 245, 158, 11))
    $pt1 = New-Object System.Drawing.PointF([float]($size * 0.46), [float]($size * 0.44))
    $pt2 = New-Object System.Drawing.PointF([float]($size * 0.58), [float]($size * 0.50))
    $pt3 = New-Object System.Drawing.PointF([float]($size * 0.46), [float]($size * 0.56))
    $g.FillPolygon($goldBrush, [System.Drawing.PointF[]]@($pt1, $pt2, $pt3))

    # Studio accent dots
    $dotBrush1 = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 0, 229, 153))
    $dotBrush2 = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 251, 191, 36))
    $g.FillEllipse($dotBrush1, [float]($size * 0.76), [float]($size * 0.30), [float]($size * 0.05), [float]($size * 0.05))
    $g.FillEllipse($dotBrush2, [float]($size * 0.80), [float]($size * 0.40), [float]($size * 0.04), [float]($size * 0.04))

    $bmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $bmp.Dispose()
    Write-Output "Generated: $outputPath"
}

# Generate 192, 512, apple-touch-icon, and 32x32 for favicon
Create-AppIcon -size 512 -outputPath "$publicDir\icon-512.png"
Create-AppIcon -size 192 -outputPath "$publicDir\icon-192.png"
Create-AppIcon -size 180 -outputPath "$publicDir\apple-touch-icon.png"
Create-AppIcon -size 32  -outputPath "$publicDir\favicon-32.png"

# Convert 32x32 PNG to favicon.ico
$iconBmp = [System.Drawing.Bitmap]::FromFile("$publicDir\favicon-32.png")
$hIcon = $iconBmp.GetHicon()
$icon = [System.Drawing.Icon]::FromHandle($hIcon)
$fs = New-Object System.IO.FileStream("$publicDir\favicon.ico", [System.IO.FileMode]::Create)
$icon.Save($fs)
$fs.Close()
$iconBmp.Dispose()
Write-Output "Generated: $publicDir\favicon.ico"

# Generate High-Resolution 1200x630 OpenGraph Image
function Create-OGImage {
    param([string]$outputPath)

    $w = 1200
    $h = 630
    $bmp = New-Object System.Drawing.Bitmap($w, $h)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

    # Dark studio background #0A0D12 with subtle gradient
    $bgRect = New-Object System.Drawing.Rectangle(0, 0, $w, $h)
    $bgBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($bgRect, [System.Drawing.Color]::FromArgb(255, 18, 25, 34), [System.Drawing.Color]::FromArgb(255, 8, 11, 15), 45.0)
    $g.FillRectangle($bgBrush, $bgRect)

    # Ambient Glow Circles
    $glowBrush1 = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(35, 0, 229, 153))
    $g.FillEllipse($glowBrush1, 800, -100, 500, 500)
    $glowBrush2 = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(25, 245, 158, 11))
    $g.FillEllipse($glowBrush2, -150, 250, 450, 450)

    # Soundwave Graphic Bar Visualizer across the bottom
    $waveBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(40, 0, 229, 153))
    $barW = 14
    $spacing = 8
    $heights = @(35, 60, 95, 140, 80, 110, 175, 130, 90, 160, 210, 120, 85, 150, 190, 110, 70, 130, 95, 60, 40, 85, 140, 170, 115, 80, 50, 30, 75, 120, 160, 90, 60, 110, 150, 180, 130, 80, 45, 25)
    for ($i = 0; $i -lt $heights.Length; $i++) {
        $bx = 100 + ($i * ($barW + $spacing))
        $bh = $heights[$i]
        $by = 560 - $bh
        $g.FillRectangle($waveBrush, [float]$bx, [float]$by, [float]$barW, [float]$bh)
    }

    # Draw Brand Logo Icon at left
    $logoBmp = [System.Drawing.Bitmap]::FromFile("$publicDir\icon-512.png")
    $g.DrawImage($logoBmp, 100, 130, 160, 160)
    $logoBmp.Dispose()

    # Brand Title: "BEATS BAZAAR"
    $fontFamily = New-Object System.Drawing.FontFamily("Arial Black")
    $titleFont = New-Object System.Drawing.Font($fontFamily, 54, [System.Drawing.FontStyle]::Bold)
    $g.DrawString("BEATS ", $titleFont, [System.Drawing.Brushes]::White, 280, 140)
    
    $greenBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 0, 229, 153))
    $g.DrawString("BAZAAR", $titleFont, $greenBrush, 550, 140)

    # Subtitle / Category pill
    $pillFont = New-Object System.Drawing.Font("Arial", 16, [System.Drawing.FontStyle]::Bold)
    $goldBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 251, 191, 36))
    $g.DrawString("GLOBAL BEAT MARKETPLACE  •  24/7 FREESTYLE CYPHER ROOM", $pillFont, $goldBrush, 285, 225)

    # Core Value Proposition Body
    $bodyFont = New-Object System.Drawing.Font("Arial", 22, [System.Drawing.FontStyle]::Regular)
    $grayBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 209, 213, 219))
    $g.DrawString("Direct legal licensing with untagged master WAV delivery,", $bodyFont, $grayBrush, 100, 330)
    $g.DrawString("non-stop live cypher crossfading, and native AI DJ Bazza.", $bodyFont, $grayBrush, 100, 370)

    # Tech Badges at bottom right
    $badgeFont = New-Object System.Drawing.Font("Arial", 14, [System.Drawing.FontStyle]::Bold)
    $badgeBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 156, 163, 175))
    $g.DrawString("GEMINI 3.8 FLASH  •  DIGITAL LEGAL CERTS  •  BACHS FIAT & CRYPTO CHECKOUT", $badgeFont, $badgeBrush, 100, 440)

    # Subtle Outer Border
    $borderPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(60, 255, 255, 255), 3)
    $g.DrawRectangle($borderPen, 1, 1, $w - 2, $h - 2)

    $bmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $bmp.Dispose()
    Write-Output "Generated: $outputPath"
}

Create-OGImage -outputPath "$publicDir\og-image.png"
Write-Output "Asset generation complete!"
