Add-Type -AssemblyName System.Drawing

$publicDir = "D:\pacy_labs\beats_bazaar\public"
$iconSrc = "C:\Users\dev.zoro\.gemini\antigravity\brain\c5d55432-4eb6-44f7-8576-2a2a121afe7b\beats_bazaar_app_icon_1792514965441.jpg"
$ogSrc   = "C:\Users\dev.zoro\.gemini\antigravity\brain\c5d55432-4eb6-44f7-8576-2a2a121afe7b\beats_bazaar_og_banner_1792515019687.jpg"

function Resize-Image {
    param([string]$inputPath, [int]$w, [int]$h, [string]$outputPath)
    
    $srcImg = [System.Drawing.Image]::FromFile($inputPath)
    $destBmp = New-Object System.Drawing.Bitmap($w, $h)
    $g = [System.Drawing.Graphics]::FromImage($destBmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.Clear([System.Drawing.Color]::FromArgb(255, 10, 13, 18))

    $g.DrawImage($srcImg, 0, 0, $w, $h)
    $destBmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)

    $g.Dispose()
    $destBmp.Dispose()
    $srcImg.Dispose()
    Write-Output "Resized to ${w}x${h}: $outputPath"
}

# 1. Generate App Icons from 3D Master
Resize-Image -inputPath $iconSrc -w 512 -h 512 -outputPath "$publicDir\icon-512.png"
Resize-Image -inputPath $iconSrc -w 192 -h 192 -outputPath "$publicDir\icon-192.png"
Resize-Image -inputPath $iconSrc -w 180 -h 180 -outputPath "$publicDir\apple-touch-icon.png"
Resize-Image -inputPath $iconSrc -w 32  -h 32  -outputPath "$publicDir\favicon-32.png"

# 2. Generate Favicon.ico from 32x32
$iconBmp = [System.Drawing.Bitmap]::FromFile("$publicDir\favicon-32.png")
$hIcon = $iconBmp.GetHicon()
$icon = [System.Drawing.Icon]::FromHandle($hIcon)
$fs = New-Object System.IO.FileStream("$publicDir\favicon.ico", [System.IO.FileMode]::Create)
$icon.Save($fs)
$fs.Close()
$iconBmp.Dispose()
Write-Output "Generated: $publicDir\favicon.ico"

# 3. Generate 1200x630 OpenGraph Banner from Master 16:9
Resize-Image -inputPath $ogSrc -w 1200 -h 630 -outputPath "$publicDir\og-image.png"

Write-Output "All 3D high-fidelity brand assets processed successfully!"
