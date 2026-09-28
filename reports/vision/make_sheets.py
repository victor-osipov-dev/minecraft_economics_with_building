import json, os, textwrap
from PIL import Image, ImageDraw, ImageFont

BASE = r"C:\Projects\minecraft_economics_with_building"
batch = json.load(open(os.path.join(BASE, "reports", "batches", "batch-10.json"), encoding="utf-8"))
items = batch["items"]

try:
    font = ImageFont.truetype("consola.ttf", 15)
except Exception:
    font = ImageFont.load_default()

CELL = 220
PAD = 8
TXT = 70
HDR = 40
COLS, ROWS = 5, 2
PER = COLS * ROWS

try:
    hfont = ImageFont.truetype("arialbd.ttf", 26)
except Exception:
    hfont = ImageFont.truetype("consola.ttf", 24)

for s in range(0, len(items), PER):
    part = items[s:s + PER]
    k = s // PER + 1
    W = COLS * (CELL + PAD) + PAD
    H = HDR + ROWS * (CELL + PAD + TXT) + PAD
    sheet = Image.new("RGB", (W, H), (255, 255, 255))
    d = ImageDraw.Draw(sheet)
    hdr = "BATCH10 SHEET %d/4  ITEMS %02d-%02d" % (k, s + 1, s + len(part))
    d.rectangle([0, 0, W, HDR - 6], fill=(180, 0, 90))
    d.text((10, 4), hdr, fill=(255, 255, 255), font=hfont)
    for i, it in enumerate(part):
        idx = s + i
        c, r = i % COLS, i // COLS
        x = PAD + c * (CELL + PAD)
        y = HDR + PAD + r * (CELL + PAD + TXT)
        p = it["thumb"]
        try:
            im = Image.open(p).convert("RGB")
            im.thumbnail((CELL, CELL))
            sheet.paste(im, (x + (CELL - im.width) // 2, y + (CELL - im.height) // 2))
        except Exception as e:
            d.rectangle([x, y, x + CELL, y + CELL], fill=(200, 0, 0))
        d.rectangle([x, y, x + CELL, y + CELL], outline=(0, 0, 0))
        d.text((x + 2, y + CELL + 2), "#%02d" % (idx + 1), fill=(200, 0, 0), font=font)
        for j, line in enumerate(textwrap.wrap(it["file"], 26)[:3]):
            d.text((x + 44 + (0 if j == 0 else 0), y + CELL + 2 + j * 17), line, fill=(0, 0, 0), font=font)
    out = os.path.join(BASE, "reports", "vision", "b10sheets", "b10sheet-%d.png" % (s // PER + 1))
    os.makedirs(os.path.dirname(out), exist_ok=True)
    sheet.save(out)
    print(out, sheet.size)
