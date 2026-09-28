import json, os
from PIL import Image, ImageChops

BASE = r"C:\Projects\minecraft_economics_with_building"
items = json.load(open(os.path.join(BASE, "reports", "batches", "batch-11.json"), encoding="utf-8"))["items"]

CELL, PAD, TXT, COLS, ROWS, HDR = 340, 8, 92, 4, 2, 44
PER = COLS * ROWS

def on_white(im):
    im = im.convert("RGBA")
    bg = Image.new("RGB", im.size, (255, 255, 255))
    bg.paste(im, (0, 0), im)
    return bg

def ref_cell(thumb_path):
    c = Image.new("RGB", (CELL, CELL), (255, 255, 255))
    im = on_white(Image.open(thumb_path))
    im.thumbnail((CELL, CELL))
    c.paste(im, ((CELL - im.width) // 2, (CELL - im.height) // 2))
    return c

def mad(a, b):
    a = a.resize((64, 64))
    b = b.resize((64, 64))
    d = ImageChops.difference(a, b)
    px = list(d.getdata())
    n = len(px)
    return round(sum(sum(p) for p in px) / (n * 3), 2)

refs = [ref_cell(it["thumb"]) for it in items]
bad = 0
for s in range(0, len(items), PER):
    k = s // PER + 1
    sh = Image.open(os.path.join(BASE, "reports", "vision", "b11sheets", "b11sheet-%d.png" % k)).convert("RGB")
    print("sheet %d" % k, sh.size)
    for i in range(min(PER, len(items) - s)):
        idx = s + i
        c, r = i % COLS, i // COLS
        x = PAD + c * (CELL + PAD)
        y = HDR + PAD + r * (CELL + PAD + TXT)
        cell = sh.crop((x, y, x + CELL, y + CELL))
        scores = sorted((mad(cell, refs[j]), j) for j in range(len(items)))
        best = scores[0][1]
        ok = (best == idx)
        if not ok:
            bad += 1
        print("  cell#%02d -> best #%02d mad=%s (self mad=%s) %s" % (
            idx + 1, best + 1, scores[0][0],
            mad(cell, refs[idx]), "OK" if ok else "MISMATCH"))
print("total mismatches:", bad)
