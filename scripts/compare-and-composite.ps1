Add-Type -AssemblyName System.Drawing

$userImg = [System.Drawing.Bitmap]::FromFile("C:\Users\dev.zoro\.gemini\antigravity\brain\c5d55432-4eb6-44f7-8576-2a2a121afe7b\.user_uploaded\media_1792579245291_3e1e09e4.png")
$v2Img = [System.Drawing.Bitmap]::FromFile("C:\Users\dev.zoro\.gemini\antigravity\brain\c5d55432-4eb6-44f7-8576-2a2a121afe7b\beats_bazaar_master_plaque_perfected_v2_1792579219668.jpg")

Write-Output "User Image Size: $($userImg.Width)x$($userImg.Height)"
Write-Output "v2 Image Size: $($v2Img.Width)x$($v2Img.Height)"

$userImg.Dispose()
$v2Img.Dispose()
