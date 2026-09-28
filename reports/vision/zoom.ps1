Add-Type -AssemblyName System.Drawing
$batch = Get-Content -Raw 'C:\Projects\minecraft_economics_with_building\reports\batches\batch-07.json' | ConvertFrom-Json
$items = $batch.items
$outDir = 'C:\Projects\minecraft_economics_with_building\reports\vision\sheets'
$groups = @(
  @{ name = 'z1'; idx = @(1, 3, 5, 9, 11, 13) },
  @{ name = 'z2'; idx = @(16, 19, 21, 22, 31, 40) }
)
$fontLabel = New-Object System.Drawing.Font('Arial', 14, [System.Drawing.FontStyle]::Bold)
$brushLabel = [System.Drawing.Brushes]::Yellow
$cell = 512
$labelH = 24
$cols = 2
foreach ($gdef in $groups) {
  $n = $gdef.idx.Count
  $rows = [math]::Ceiling($n / $cols)
  $bmp = New-Object System.Drawing.Bitmap(($cols * $cell), ($rows * ($cell + $labelH)))
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.Clear([System.Drawing.Color]::Black)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::NearestNeighbor
  $i = 0
  foreach ($n1 in $gdef.idx) {
    $item = $items[$n1 - 1]
    $col = $i % $cols
    $row = [math]::Floor($i / $cols)
    $x0 = $col * $cell
    $y0 = $row * ($cell + $labelH)
    $g.DrawString((($n1).ToString('00') + ' ' + $item.file), $fontLabel, $brushLabel, ($x0 + 4), ($y0 + 4))
    if (Test-Path $item.thumb) {
      $img = [System.Drawing.Image]::FromFile($item.thumb)
      $sc = [math]::Min(($cell - 4) / $img.Width, ($cell - 4) / $img.Height)
      $w = [int]($img.Width * $sc)
      $h = [int]($img.Height * $sc)
      $g.DrawImage($img, ($x0 + 2), ($y0 + $labelH + 2), $w, $h)
      $img.Dispose()
    }
    $i++
  }
  $path = Join-Path $outDir ($gdef.name + '.png')
  $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $g.Dispose()
  $bmp.Dispose()
  Write-Output $path
}
