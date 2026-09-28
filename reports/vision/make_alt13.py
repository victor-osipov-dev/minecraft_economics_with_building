import json, os, textwrap
from PIL import Image, ImageDraw, ImageFont

BASE = r"C:\Projects\minecraft_economics_with_building"
items = json.load(open(os.path.join(BASE, "reports", "batches", "batch-13.json"), encoding="utf-8"))["items"]
OUT = os.path.join(BASE, "reports", "vision", "b13probe")

try:
    font = ImageFont.truetype("consola.ttf", 16)
except Exception:
    font = ImageFont.load_default()
try:
    hfont = ImageFont.truetype("arialbd.ttf", 26)
except Exception:
    hfont = font


def build(start, cols, rows, cell, txt, name):
    part = items[start:start + cols * rows]
    PAD, HDR = 8, 44
    W = cols * (cell + PAD) + PAD
    H = HDR + rows * (cell + PAD + txt) + PAD
    sheet = Image.new("RGB", (W, H), (255, 255, 255))
    d = ImageDraw.Draw(sheet)
    d.rectangle([0, 0, W, HDR - 6], fill=(180, 0, 90))
    d.text((10, 8), "BATCH13 ALT %s  ITEMS %02d-%02d" % (name, start + 1, start + len(part)),
           fill=(255, 255, 255), font=hfont)
    for i, it in enumerate(part):
        idx = start + i
        c, r = i % cols, i // cols
        x = PAD + c * (cell + PAD)
        y = HDR + PAD + r * (cell + PAD + txt)
        try:
            im = Image.open(it["thumb"])
            bg = Image.new("RGB", im.size, (255, 255, 255))
            bg.paste(im, (0, 0), im)
            im = bg
            im.thumbnail((cell, cell))
            sheet.paste(im, (x + (cell - im.width) // 2, y + (cell - im.height) // 2))
        except Exception:
            d.rectangle([x, y, x + cell, y + cell], fill=(200, 0, 0))
        d.rectangle([x, y, x + cell, y + cell], outline=(0, 0, 0), width=2)
        d.text((x + 2, y + cell + 3), "#%02d" % (idx + 1), fill=(200, 0, 0), font=font)
        for j, line in enumerate(textwrap.wrap(it["file"], 22)[:3]):
            d.text((x + 50, y + cell + 3 + j * 18), line, fill=(0, 0, 0), font=font)
    p = os.path.join(OUT, name + ".png")
    sheet.save(p)
    print(p, sheet.size, "aspect", round(W / H, 3), os.path.getsize(p))


build(16, 8, 1, 300, 70, "alt_s3_wide")    # items 17-24
build(24, 2, 4, 330, 96, "alt_s4_tall")    # items 25-32
build(32, 3, 3, 300, 96, "alt_s5_grid")    # items 33-40 (9th cell empty)
