import json, os
from PIL import Image

BASE = r"C:\Projects\minecraft_economics_with_building"
items = json.load(open(os.path.join(BASE, "reports", "batches", "batch-10.json"), encoding="utf-8"))["items"]

def mean(im):
    im = im.convert("RGB").resize((16, 16))
    px = list(im.getdata())
    n = len(px)
    return tuple(round(sum(p[i] for p in px) / n) for i in range(3))

def dist(a, b):
    return round(sum((a[i] - b[i]) ** 2 for i in range(3)) ** 0.5, 1)

CELL, PAD, TXT, COLS = 200, 8, 66, 5

thumb_means = [mean(Image.open(it["thumb"])) for it in items]

for si, sheet_name in enumerate(["sheetA-1.png", "sheetA-2.png", "sheetA-3.png", "sheetA-4.png"]):
    sh = Image.open(os.path.join(BASE, "reports", "vision", sheet_name))
    print(sheet_name, sh.size)
    for i in range(10):
        idx = si * 10 + i
        c, r = i % COLS, i // COLS
        x = PAD + c * (CELL + PAD)
        y = PAD + r * (CELL + PAD + TXT)
        cell = sh.crop((x, y, x + CELL, y + CELL))
        m = mean(cell)
        best = sorted(range(40), key=lambda j: dist(m, thumb_means[j]))[:2]
        print("  cell#%02d -> best thumb #%02d (d=%s) 2nd #%02d (d=%s)  expected #%02d d=%s" % (
            idx + 1, best[0] + 1, dist(m, thumb_means[best[0]]),
            best[1] + 1, dist(m, thumb_means[best[1]]),
            idx + 1, dist(m, thumb_means[idx])))
