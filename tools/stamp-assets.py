#!/usr/bin/env python3
"""Проставляет версию в адреса общих CSS и JS во всех HTML-страницах.

Зачем. GitHub Pages отдаёт всё с cache-control: max-age=600 и настроить это
нельзя. Поэтому браузер может десять минут держать старый style.css, уже
получив новый index.html. В такой смеси свежая разметка попадает под старые
правила — например, фоновое видео теряет position: absolute и рисуется
обычным блоком, а текст уезжает под него.

Версия считается от содержимого файла, поэтому адрес меняется тогда и только
тогда, когда меняется сам файл. Запускать перед коммитом, если правился
style.css или main.js:  python3 tools/stamp-assets.py
"""

from __future__ import annotations

import hashlib
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
ASSETS = ("css/style.css", "js/main.js", "assets/fonts/fonts.css")


def digest(path: pathlib.Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()[:8]


def main() -> int:
    versions = {}
    for rel in ASSETS:
        f = ROOT / rel
        if not f.exists():
            print(f"нет файла: {rel}", file=sys.stderr)
            return 1
        versions[rel] = digest(f)

    changed = 0
    for page in sorted(ROOT.glob("*.html")):
        text = original = page.read_text(encoding="utf-8")
        for rel, ver in versions.items():
            # ловим и адрес без версии, и с уже проставленной
            text = re.sub(
                rf'({re.escape(rel)})(\?v=[0-9a-f]+)?(["\'])',
                rf"\g<1>?v={ver}\g<3>",
                text,
            )
        if text != original:
            page.write_text(text, encoding="utf-8")
            changed += 1
        print(f"{page.name:16} ok")

    print("\nверсии:")
    for rel, ver in versions.items():
        print(f"  {rel:24} v={ver}")
    print(f"страниц изменено: {changed}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
