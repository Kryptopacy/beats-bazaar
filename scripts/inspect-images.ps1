Add-Type -AssemblyName System.Drawing

$img1 = [System.Drawing.Bitmap]::FromFile("C:\Users\dev.zoro\.gemini\antigravity\brain\c5d55432-4eb6-44f7-8576-2a2a121afe7b\.user_uploaded\media_1792579245291_3e1e09e4.png")
Write-Output "User Image: $($img1.Width)x$($img1.Height), format: $($img1.PixelFormat)"
$img1.Dispose()

$img2 = [System.Drawing.Bitmap]::FromFile("C:\Users\dev.zoro\.gemini\antigravity\brain\c5d55432-4eb6-44f7-8576-2a2a121afe7b\beats_bazaar_master_plaque_perfected_1792579143255.jpg")
Write-Output "Perfected v1: $($img2.Width)x$($img2.Height), format: $($img2.PixelFormat)"
$img2.Dispose()

$img3 = [System.Drawing.Bitmap]::FromFile("C:\Users\dev.zoro\.gemini\antigravity\brain\c5d55432-4eb6-44f7-8576-2a2a121afe7b\beats_bazaar_master_plaque_perfected_v2_1792579219668.jpg")
Write-Output "Perfected v2: $($img3.Width)x$($img3.Height), format: $($img3.PixelFormat)"
$img3.Dispose()
