# -*- coding: utf-8 -*-
"""一次性脚本：把 legacy/_app3.js（单文件版的应用段）拆成 js/ 下的 ES 模块。

已完成拆分后本脚本不再需要；保留仅用于追溯拆分来源。
"""
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'legacy', '_app3.js')
OUT = os.path.join(ROOT, 'js')

HEADERS = {
    'data.js': '水滸人物数据（108 将 + 六大恶人）',
    'core.js': '渲染核心：场景 / 环境 / 聚义碑 / 相机控制器 / 贴图工具',
    'cards.js': '卡牌构建与四类工艺材质',
    'layouts.js': '三种展厅布局与切换调度',
    'features.js': '恶人密室 / 设备能力 / 输入手势',
    'ui.js': 'HUD 与鉴赏面板',
    'main.js': '入口：装配场景、驱动主循环',
}


def load():
    src = open(SRC, 'r', encoding='utf-8').read()
    src = re.sub(r'^\s*\(function\(\)\{\s*', '', src)
    src = re.sub(r'\}\)\(\);\s*$', '', src)
    src = src.replace('"use strict";\n', '', 1)
    return src


def split_sections(src):
    marks = list(re.finditer(r'/\* =+ ([a-z]+\.js) =+ \*/', src))
    secs = {}
    for i, m in enumerate(marks):
        end = marks[i + 1].start() if i + 1 < len(marks) else len(src)
        secs[m.group(1)] = src[m.start():end]
    return secs


def top_decls(text):
    return set(re.findall(r'^(?:const|let|var|function|class)\s+([A-Za-z_$][\w$]*)', text, re.M))


def add_export(text):
    return re.sub(r'^(const|let|var|function|class)\s+([A-Za-z_$])',
                  lambda m: 'export %s %s' % (m.group(1), m.group(2)), text, flags=re.M)


def main():
    src = load()
    secs = split_sections(src)
    order = ['data.js', 'core.js', 'cards.js', 'layouts.js', 'features.js', 'ui.js', 'main.js']
    decl = {k: top_decls(v) for k, v in secs.items()}

    files = {}

    # ---------- data.js ----------
    t = secs['data.js']
    t = add_export(t)
    files['data.js'] = t

    # ---------- core.js ----------
    t = add_export(secs['core.js'])
    files['core.js'] = t

    # ---------- cards.js ----------
    t = secs['cards.js']
    t = t.replace('var gWave = 0;\n', '')
    t = re.sub(r'\bgWave\b', 'APP.gWave', t)
    t = re.sub(r'\bSINGLE\b', 'CRAFT_SCANS', t)
    t = re.sub(r'\bcurrentCraft\b', 'APP.currentCraft', t)
    t = add_export(t)
    files['cards.js'] = t

    # ---------- layouts.js ----------
    t = add_export(secs['layouts.js'])
    files['layouts.js'] = t

    # ---------- features.js ----------
    t = secs['features.js']
    t = re.sub(r'\bfocusChar\b', 'APP.focusChar', t)
    t = add_export(t)
    files['features.js'] = t

    # ---------- ui.js ----------
    t = add_export(secs['ui.js'])
    files['ui.js'] = t

    # ---------- main.js ----------
    t = secs['main.js']
    # 抽出纹理加载段 → loader.js
    a = t.index('/* ---------- 纹理加载与缓存 ---------- */')
    b = t.index("  img.src = url;\n}\n") + len("  img.src = url;\n}\n")
    loader_body = t[a:b]
    t = t[:a] + t[b:]
    t = re.sub(r'^[ \t]*const SINGLE = .*\n', '', t, flags=re.M)
    # 注意顺序：先做通用改名，再修掉因此产生的非法声明
    t = re.sub(r'\bSINGLE\b', 'CRAFT_SCANS', t)
    t = re.sub(r'\bcurrentCraft\b', 'APP.currentCraft', t)
    t = re.sub(r'\bfocusChar\b', 'APP.focusChar', t)
    t = re.sub(r'\bgWave\b', 'APP.gWave', t)
    t = t.replace("let APP.currentCraft = CRAFT_SCANS ? 'flash_prize' : 'standard';",
                  "APP.currentCraft = 'flash_prize';   // 默认以镭射工艺开场")
    t = t.replace("let APP.focusChar = null;",
                  "// 鉴赏中的人物挂在共享状态 APP.focusChar 上，features/input 需要读取它")
    files['main.js'] = t
    files['_loader_body'] = loader_body

    # ---------- 自动推导 import ----------
    mod_of = {}
    for k in ['data.js', 'core.js', 'cards.js', 'layouts.js', 'features.js', 'ui.js']:
        for n in decl.get(k, ()):
            mod_of[n] = k

    def imports_for(name, text, extra=None, skip=None):
        skip = skip or set()
        need = {}
        for n, mod in mod_of.items():
            if mod == name or n in skip:
                continue
            if re.search(r'\b' + re.escape(n) + r'\b', text):
                need.setdefault(mod, []).append(n)
        for mod, names in (extra or {}).items():
            need.setdefault(mod, [])
            for n in names:
                if n not in need[mod]:
                    need[mod].append(n)
        lines = []
        for mod in ['state.js', 'core.js', 'data.js', 'cards.js', 'layouts.js', 'features.js',
                    'ui.js', 'loader.js']:
            if mod in need and mod != name:
                lines.append("import { %s } from './%s';" % (', '.join(sorted(need[mod])), mod))
        return '\n'.join(lines)

    for name in ['data.js', 'core.js', 'cards.js', 'layouts.js', 'features.js', 'ui.js']:
        text = files[name]
        extra = {}
        if name == 'cards.js':
            extra = {'state.js': ['APP', 'CRAFT_SCANS'], 'loader.js': ['loadSplitCard']}
        if name == 'features.js':
            extra = {'state.js': ['APP']}
        skip = {'V'} if name == 'cards.js' else set()
        imp = imports_for(name, text, extra, skip)
        head = '/* %s —— %s\n * 依赖：全局 THREE（vendor/three.min.js）\n */\n' % (name, HEADERS[name])
        body = text.split('\n')
        # 丢弃原分节标题行与其后的旧模块注释，换成统一 header
        while body and (body[0].strip() == '' or body[0].startswith('/*')):
            line = body.pop(0)
            if line.startswith('/*') and '*/' not in line:
                while body and '*/' not in body[0]:
                    body.pop(0)
                if body:
                    body.pop(0)
        files[name] = head + (imp + '\n\n' if imp else '') + '\n'.join(body)

    # loader.js
    lb = files.pop('_loader_body')
    lb = lb.replace("manager.onProgress = function (url, loaded, total) {\n  UI.progress(Math.round(loaded / total * 100));\n};",
                    "manager.onProgress = function (url, loaded, total) {\n  emitProgress(Math.round(loaded / total * 100));\n};")
    lb = lb.replace("manager.onLoad = function () { UI.progress(100); };",
                    "manager.onLoad = function () { emitProgress(100); };")
    lb = lb.replace('const texCache', 'export const texCache')
    lb = lb.replace('function loadTex', 'export function loadTex')
    lb = lb.replace('function loadSplitCard', 'export function loadSplitCard')
    lb = re.sub(r'^/\* -+ 纹理加载与缓存 -+ \*/', '', lb, flags=re.M)
    files['loader.js'] = (
        "/* loader.js —— 卡图加载与缓存\n"
        " * 依赖：全局 THREE（vendor/three.min.js）\n"
        " */\n"
        "import { drawCardFrame } from './core.js';\n\n"
        "let progressHandler = null;\n"
        "export function setProgressHandler(fn) { progressHandler = fn; }\n"
        "function emitProgress(p) { if (progressHandler) progressHandler(p); }\n\n"
        + lb.strip() + '\n'
    )

    # main.js 头部
    main_imp = (
        "import { CHARACTERS } from './data.js';\n"
        "import { createCore, buildEnvironment, buildStele, CameraRig, radialTex, drawCardFrame, assetUrl } from './core.js';\n"
        "import { CRAFTS, createCard, applyCraft, laserBackTexture } from './cards.js';\n"
        "import { LAYOUTS, LAYOUT_ORDER, LayoutManager } from './layouts.js';\n"
        "import { buildVillainRoom, OrbTrigger, isLowSpec, isTouch, initInput } from './features.js';\n"
        "import { initUI } from './ui.js';\n"
        "import { loadTex, loadSplitCard, setProgressHandler } from './loader.js';\n"
        "import { APP, CRAFT_SCANS } from './state.js';\n"
    )
    t = files['main.js']
    body = t.split('\n')
    while body and (body[0].strip() == '' or body[0].startswith('/* ==') or body[0].startswith('/* main.js')):
        body.pop(0)
    head = ('/* main.js —— 入口：装配场景、驱动主循环\n'
            ' * 依赖：全局 THREE（vendor/three.min.js）\n'
            ' */\n')
    files['main.js'] = head + main_imp + '\n' + '\n'.join(body)
    # 加载进度回调注入（UI 就绪后再挂，避免 TDZ）
    files['main.js'] = files['main.js'].replace(
        "  onEnterVault: function () { enterVault(); }\n});",
        "  onEnterVault: function () { enterVault(); }\n});\nsetProgressHandler(function (p) { UI.progress(p); });")

    # state.js
    files['state.js'] = (
        "/* state.js —— 跨模块共享的运行时状态\n"
        " * cards / features 需要读取入口层的状态（当前工艺、鉴赏中的人物、滑动波动量），\n"
        " * 单独抽出来避免反向依赖 main.js。\n"
        " */\n\n"
        "export const APP = {\n"
        "  currentCraft: 'standard',   // 当前工艺\n"
        "  focusChar: null,            // 鉴赏中的人物（null 表示自动导览）\n"
        "  gWave: 0                    // 左右滑动带来的整体波动量\n"
        "};\n\n"
        "// 是否随包提供各工艺的独立扫描图（assets/flash_prize、assets/code_perm …）。\n"
        "// 目前只有 standard（普卡原图，左右拼接）/ villains / full 三套，\n"
        "// 奖闪与冷烫是在普卡上叠加程序化镭射膜，因此这里为 false。\n"
        "export const CRAFT_SCANS = false;\n"
    )

    os.makedirs(OUT, exist_ok=True)
    for name, text in files.items():
        p = os.path.join(OUT, name)
        open(p, 'w', encoding='utf-8', newline='\n').write(text)
        print('%-12s %6d B' % (name, len(text)))


if __name__ == '__main__':
    main()
