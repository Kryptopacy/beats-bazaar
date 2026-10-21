Add-Type -AssemblyName System.Drawing

function Get-PlaqueBounds {
    param([string]$path)
    $bmp = [System.Drawing.Bitmap]::FromFile($path)
    $minX = $bmp.Width; $maxX = 0; $minY = $bmp.Height; $maxY = 0

    for ($y = 0; $y -lt $bmp.Height; $y += 4) {
        for ($x = 0; $x -lt $bmp.Width; $x += 4) {
            $c = $bmp.GetPixel($x, $y)
            # if brightness > threshold (not black background)
            if ($c.R -gt 15 -or $c.G -gt 15 -or $c.B -gt 15) {
                if ($x -lt $minX) { $minX = $x }
                if ($x -gt $maxX) { $maxX = $x }
                if ($y -lt $minY) { $minY = $y }
                if ($y -gt $maxY) { $maxY = $y }
            }
        }
    }
    $bmp.Dispose()
    Write-Output "File: $path -> Bounds: X: $minX to $maxX, Y: $minY to $maxY, W: $($maxX - $minX), H: $($maxY - $minY)"
}

Get-PlaqueBounds "C:\Users\dev.zoro\.gemini\antigravity\brain\c5d55432-4eb6-44f7-8576-2a2a121afe7b\beats_bazaar_master_plaque_perfected_v2_1792579219668.jpg"
Get-PlaqueBounds "C:\Users\dev.zoro\.gemini\antigravity\brain\c5d55432-4eb6-44f7-8576-2a2a121afe7b\.user_uploaded\media_1792579245291_3e1e09e4.png"
