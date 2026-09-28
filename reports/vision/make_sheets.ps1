Add-Type -AssemblyName System.Drawing
$batch = Get-Content -Raw 'C:\Projects\minecraft_economics_with_building\reports\batches\batch-07.json' | ConvertFrom-Json
$items = $batch.items
$outDir = 'C:\Projects\minecraft_economics_with_building\reports\vision\sheets'
New-Item -ItemType Directory -Force -Path $outDir | Out-Null

$cols = 4
$rows = 4
$cellW = 256
$labelH = 26
$cellH = 256 + $labelH
$sheetW = $cols * $cellW
$sheetH = $rows * $cellH

$fontIdx = New-Object System.Drawing.Font('Arial', 22, [System.Drawing.FontStyle]::Bold)
$fontName = New-Object System.Drawing.Font('Arial', 9)
$brushIdx = [System.Drawing.Brushes]::Red
$brushName = [System.Drawing.Brushes]::White
$brushBg = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255,20,20,20))

$perSheet = $cols * $rows
$numSheets = [math]::Ceiling($items.Count / $perSheet)
for ($s = 0; $s -lt $numSheets; $s++) {
    $bmp = New-Object System.Drawing.Bitmap($sheetW, $sheetH)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.Clear([System.Drawing.Color]::Black)
    $start = $s * $perSheet
    $end = [math]::Min($start + $perSheet, $items.Count) - 1
    for ($i = $start; $i -le $end; $i++) {
        $pos = $i - $start
        $item = $items[$i]
        $col = $pos % $cols
        $row = [math]::Floor($pos / $cols)
        $x0 = $col * $cellW
        $y0 = $row * $cellH
        $g.FillRectangle($brushBg, $x0, $y0, $cellW, $cellH)
        $num = ($i + 1).ToString('00')
        $g.DrawString(($num + ' ' + $item.file), $fontName, $brushName, ($x0 + 4), ($y0 + 4))
        if (Test-Path $item.thumb) {
            $img = [System.Drawing.Image]::FromFile($item.thumb)
            $scale = [math]::Min(($cellW - 8) / $img.Width, ($cellH - $labelH - 8) / $img.Height)
            $w = [int]($img.Width * $scale)
            $h = [int]($img.Height * $scale)
            $dx = $x0 + [int](($cellW - $w) / 2)
            $dy = $y0 + $labelH + [int](($cellH - $labelH - $h) / 2)
            $g.DrawImage($img, $dx, $dy, $w, $h)
            $img.Dispose()
        } else {
            $g.DrawString('MISSING', $fontIdx, $brushIdx, ($x0 + 8), ($y0 + 70))
        }
        $g.DrawString($num, $fontIdx, $brushIdx, ($x0 + 4), ($y0 + 24))
    }
    $path = Join-Path $outDir ('sheet-' + ($s + 1) + '.png')
    $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $bmp.Dispose()
    Write-Output $path
}
Write-Output ('items=' + $items.Count)
