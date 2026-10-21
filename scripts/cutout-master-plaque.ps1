Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\dev.zoro\.gemini\antigravity\brain\c5d55432-4eb6-44f7-8576-2a2a121afe7b\beats_bazaar_master_plaque_icon_1792528816088.jpg"
$publicDir = "D:\pacy_labs\beats_bazaar\public"

$src = [System.Drawing.Bitmap]::FromFile($srcPath)
Write-Output "Master image size: $($src.Width)x$($src.Height)"

# The plaque is centered inside the 1024x1024 canvas.
# Let's create a 512x512 transparent PNG by clipping the squircle plaque with anti-aliasing
$outSize = 512
$dest = New-Object System.Drawing.Bitmap($outSize, $outSize, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($dest)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g.Clear([System.Drawing.Color]::Transparent)

# The plaque occupies roughly 80% of the 1024 canvas centered
# Let's inspect the plaque bounds by checking non-black pixel boundaries
$minX = $src.Width
$maxX = 0
$minY = $src.Height
$maxY = 0

for ($y = 0; $y -lt $src.Height; $y += 8) {
    for ($x = 0; $x -lt $src.Width; $x += 8) {
        $pixel = $src.GetPixel($x, $y)
        # Check if pixel is part of the plaque (brightness > threshold)
        if (($pixel.R + $pixel.G + $pixel.B) -gt 35) {
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}

Write-Output "Detected plaque bounds: ($minX, $minY) to ($maxX, $maxY)"
$plaqueW = $maxX - $minX
$plaqueH = $maxY - $minY
Write-Output "Plaque dimensions: ${plaqueW}x${plaqueH}"

# Create squircle path for clean cutout
$margin = 12
$drawW = $outSize - (2 * $margin)
$radius = [int]($drawW * 0.22)

$path = New-Object System.Drawing.Drawing2D.GraphicsPath
$path.AddArc($margin, $margin, $radius * 2, $radius * 2, 180, 90)
$path.AddArc($margin + $drawW - ($radius * 2), $margin, $radius * 2, $radius * 2, 270, 90)
$path.AddArc($margin + $drawW - ($radius * 2), $margin + $drawW - ($radius * 2), $radius * 2, $radius * 2, 0, 90)
$path.AddArc($margin, $margin + $drawW - ($radius * 2), $radius * 2, $radius * 2, 90, 90)
$path.CloseFigure()

$g.SetClip($path)
$srcRect = New-Object System.Drawing.Rectangle($minX, $minY, $plaqueW, $plaqueH)
$destRect = New-Object System.Drawing.Rectangle($margin, $margin, $drawW, $drawW)
$g.DrawImage($src, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
$g.ResetClip()

# Draw subtle metallic edge highlight
$edgePen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(100, 0, 229, 153), 2.0)
$g.DrawPath($edgePen, $path)

# Save master transparent logo-mark.png and icon-512.png
$dest.Save("$publicDir\logo-mark.png", [System.Drawing.Imaging.ImageFormat]::Png)
$dest.Save("$publicDir\icon-512.png", [System.Drawing.Imaging.ImageFormat]::Png)
Write-Output "Saved $publicDir\logo-mark.png and icon-512.png"

# Downscale to 192, 180, 32
$sizes = @(
    @{ w = 192; file = "icon-192.png" },
    @{ w = 180; file = "apple-touch-icon.png" },
    @{ w = 32;  file = "favicon-32.png" }
)

foreach ($item in $sizes) {
    $sw = $item.w
    $sBmp = New-Object System.Drawing.Bitmap($sw, $sw, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $sg = [System.Drawing.Graphics]::FromImage($sBmp)
    $sg.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $sg.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $sg.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $sg.Clear([System.Drawing.Color]::Transparent)
    $sg.DrawImage($dest, 0, 0, $sw, $sw)
    $sBmp.Save("$publicDir\$($item.file)", [System.Drawing.Imaging.ImageFormat]::Png)
    $sg.Dispose()
    $sBmp.Dispose()
    Write-Output "Saved $publicDir\$($item.file)"
}

# Generate favicon.ico from 32x32
$iconBmp = [System.Drawing.Bitmap]::FromFile("$publicDir\favicon-32.png")
$hIcon = $iconBmp.GetHicon()
$icon = [System.Drawing.Icon]::FromHandle($hIcon)
$fs = New-Object System.IO.FileStream("$publicDir\favicon.ico", [System.IO.FileMode]::Create)
$icon.Save($fs)
$fs.Close()
$iconBmp.Dispose()
Write-Output "Saved $publicDir\favicon.ico"

$g.Dispose()
$dest.Dispose()
$src.Dispose()
