import json, os, textwrap
from PIL import Image, ImageDraw, ImageFont

BASE = r"C:\Projects\minecraft_economics_with_building"
batch = json.load(open(os.path.join(BASE, "reports", "batches", "batch-13.json"), encoding="utf-8"))
items = batch["items"]
OUT = os.path.join(BASE, "reports", "vision", "b13sheets")
os.makedirs(OUT, exist_ok=True)

try:
    font = ImageFont.truetype("consola.ttf", 17)
except Exception:
    font = ImageFont.load_default()

CELL = 340
PAD = 8
TXT = 92
HDR = 44
COLS, ROWS = 4, 2
PER = COLS * ROWS

try:
    hfont = ImageFont.truetype("arialbd.ttf", 28)
except Exception:
    hfont = ImageFont.truetype("consola.ttf", 26)

for s in range(0, len(items), PER):
    part = items[s:s + PER]
    k = s // PER + 1
    total = (len(items) + PER - 1) // PER
    W = COLS * (CELL + PAD) + PAD
    H = HDR + ROWS * (CELL + PAD + TXT) + PAD
    sheet = Image.new("RGB", (W, H), (255, 255, 255))
    d = ImageDraw.Draw(sheet)
    hdr = "BATCH13 SHEET %d/%d  ITEMS %02d-%02d" % (k, total, s + 1, s + len(part))
    d.rectangle([0, 0, W, HDR - 6], fill=(180, 0, 90))
    d.text((10, 6), hdr, fill=(255, 255, 255), font=hfont)
    for i, it in enumerate(part):
        idx = s + i
        c, r = i % COLS, i // COLS
        x = PAD + c * (CELL + PAD)
        y = HDR + PAD + r * (CELL + PAD + TXT)
        p = it["thumb"]
        try:
            im = Image.open(p)
            bg = Image.new("RGB", im.size, (255, 255, 255))
            bg.paste(im, (0, 0), im)
            im = bg
            im.thumbnail((CELL, CELL))
            sheet.paste(im, (x + (CELL - im.width) // 2, y + (CELL - im.height) // 2))
        except Exception:
            d.rectangle([x, y, x + CELL, y + CELL], fill=(200, 0, 0))
        d.rectangle([x, y, x + CELL, y + CELL], outline=(0, 0, 0), width=2)
        d.text((x + 2, y + CELL + 3), "#%02d" % (idx + 1), fill=(200, 0, 0), font=font)
        for j, line in enumerate(textwrap.wrap(it["file"], 24)[:4]):
            d.text((x + 56, y + CELL + 3 + j * 20), line, fill=(0, 0, 0), font=font)
    out = os.path.join(OUT, "b13sheet-%d.png" % k)
    sheet.save(out)
    print(out, sheet.size)
