# -*- coding: utf-8 -*-
"""从历史单文件版 `legacy/shuihu-hall-single.html` 重建本项目的静态资源。

用途：
  1. 把内嵌在 `window.__ASSETS__` 里的 base64 卡图还原为 assets/ 下的真实文件
  2. 把内嵌的 three.js 还原为 vendor/three.min.js
  3. 把内嵌样式还原为 css/main.css

日常开发不需要运行本脚本，assets/ 已经是独立的静态文件。
用法：python tools/split_single_file.py
"""
import base64
import json
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SINGLE = os.path.join(ROOT, 'legacy', 'shuihu-hall-single.html')


def read_single():
    data = open(SINGLE, 'r', encoding='utf-8').read()
    parts = re.split(r'(<script[^>]*>.*?</script>)', data, flags=re.S)
    return parts


def dump_assets(assets_js):
    start = assets_js.index('window.__ASSETS__')
    start = assets_js.index('{', start)
    end = assets_js.rindex('}') + 1
    obj = json.loads(assets_js[start:end])
    total = 0
    for key, uri in obj.items():
        head, b64 = uri.split(',', 1)
        ext = 'webp' if 'webp' in head else ('png' if 'png' in head else 'jpg')
        path = os.path.join(ROOT, *key.split('/'))
        if not path.lower().endswith(ext):
            path = path + '.' + ext
        os.makedirs(os.path.dirname(path), exist_ok=True)
        raw = base64.b64decode(b64)
        with open(path, 'wb') as f:
            f.write(raw)
        total += len(raw)
    print('assets: %d files, %.1f MB' % (len(obj), total / 1048576.0))
    return obj


def dump_vendor(three_js):
    body = re.sub(r'^<script[^>]*>|</script>$', '', three_js, flags=re.S)
    path = os.path.join(ROOT, 'vendor', 'three.min.js')
    os.makedirs(os.path.dirname(path), exist_ok=True)
    open(path, 'w', encoding='utf-8').write(body)
    print('vendor/three.min.js: %.1f KB' % (len(body) / 1024.0))


def dump_css(html_head):
    m = re.search(r'<style>(.*?)</style>', html_head, re.S)
    css = m.group(1).strip()
    path = os.path.join(ROOT, 'css', 'main.css')
    os.makedirs(os.path.dirname(path), exist_ok=True)
    open(path, 'w', encoding='utf-8').write(css + '\n')
    print('css/main.css: %.1f KB' % (len(css) / 1024.0))


def main():
    if not os.path.exists(SINGLE):
        print('legacy single-file build not found, nothing to do.')
        return
    parts = read_single()
    dump_assets(parts[1])
    dump_vendor(parts[3])
    dump_css(parts[0])


if __name__ == '__main__':
    main()
