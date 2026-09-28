Add-Type -AssemblyName System.Drawing
Get-ChildItem 'C:\Projects\minecraft_economics_with_building\reports\vision\sheets\*.png' | ForEach-Object {
  $img = [System.Drawing.Image]::FromFile($_.FullName)
  Write-Output ($_.Name + ' ' + $img.Width + 'x' + $img.Height + ' ' + $_.Length + ' bytes')
  $img.Dispose()
}
