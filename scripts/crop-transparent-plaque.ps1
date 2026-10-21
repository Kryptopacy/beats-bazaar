Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\dev.zoro\.gemini\antigravity\brain\c5d55432-4eb6-44f7-8576-2a2a121afe7b\beats_bazaar_master_cert_icon_1792577038537.jpg"
$destPath = "D:\pacy_labs\beats_bazaar\public\icon-512.png"
$publicDir = "D:\pacy_labs\beats_bazaar\public"

$src = [System.Drawing.Bitmap]::FromFile($srcPath)
$size = 512

$dest = New-Object System.Drawing.Bitmap($size, $size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($dest)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g.Clear([System.Drawing.Color]::Transparent)

# Squircle clipping path
$margin = [int]($size * 0.04)
$w = $size - (2 * $margin)
$radius = [int]($size * 0.22)

$path = New-Object System.Drawing.Drawing2D.GraphicsPath
$path.AddArc($margin, $margin, $radius * 2, $radius * 2, 180, 90)
$path.AddArc($margin + $w - ($radius * 2), $margin, $radius * 2, $radius * 2, 270, 90)
$path.AddArc($margin + $w - ($radius * 2), $margin + $w - ($radius * 2), $radius * 2, $radius * 2, 0, 90)
$path.AddArc($margin, $margin + $w - ($radius * 2), $radius * 2, $radius * 2, 90, 90)
$path.CloseFigure()

$g.SetClip($path)
# Draw the image cropped slightly to eliminate any checkerboard or border
$srcRect = New-Object System.Drawing.Rectangle([int]($src.Width * 0.08), [int]($src.Height * 0.08), [int]($src.Width * 0.84), [int]($src.Height * 0.84))
$destRect = New-Object System.Drawing.Rectangle($margin, $margin, $w, $w)
$g.DrawImage($src, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
$g.ResetClip()

# Draw subtle outer bevel border
$borderPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(120, 0, 229, 153), 2.5)
$g.DrawPath($borderPen, $path)

$dest.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)

# Also create 192, 180, 32
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
    $sg.DrawImage($dest, 0, 0, $sw, $sw)
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
$dest.Dispose()
$src.Dispose()
Write-Output "Transparent Master Plaque assets generated successfully!"
