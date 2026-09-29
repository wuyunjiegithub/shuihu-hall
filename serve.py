# -*- coding: utf-8 -*-
"""本地静态服务器：python serve.py → http://localhost:8000

ES 模块与外置卡图无法从 file:// 直接加载，开发/预览都用这个脚本起服务。
"""
import os
import socketserver
import subprocess
import sys
import webbrowser
from functools import partial
from http.server import SimpleHTTPRequestHandler

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
ROOT = os.path.dirname(os.path.abspath(__file__))


class Handler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache')
        super().end_headers()

    def log_message(self, fmt, *args):
        if '404' in (fmt % args):
            super().log_message(fmt, *args)


def open_fullscreen(url):
    """优先用 Chrome / Edge 以 F11 全屏方式打开；找不到就退回默认浏览器。"""
    cands = [
        os.path.expandvars(r'%ProgramFiles%\Google\Chrome\Application\chrome.exe'),
        os.path.expandvars(r'%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe'),
        os.path.expandvars(r'%LocalAppData%\Google\Chrome\Application\chrome.exe'),
        os.path.expandvars(r'%ProgramFiles%\Microsoft\Edge\Application\msedge.exe'),
        os.path.expandvars(r'%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe'),
    ]
    for exe in cands:
        if exe and os.path.exists(exe):
            try:
                subprocess.Popen([exe, '--start-fullscreen', '--new-window', url])
                return os.path.basename(exe)
            except Exception:
                continue
    try:
        webbrowser.open(url)
        return None
    except Exception:
        return None


def try_bind(port, handler, tries=30):
    """从 port 起依次尝试绑定，跳过被占用 / 被系统保留的端口。

    Windows 上端口被别的进程占着时，绑定往往抛 PermissionError(10013)
    而不是 Address already in use，所以这里统一按 OSError 捕获后换端口。
    """
    last = None
    for p in range(port, port + tries):
        try:
            return socketserver.ThreadingTCPServer(('127.0.0.1', p), handler), p
        except OSError as e:
            last = e
    raise SystemExit(
        '端口 %d ~ %d 都无法使用（最后一个错误：%s）。\n'
        '换一个端口试试：python serve.py 9000' % (port, port + tries - 1, last))


def main():
    handler = partial(Handler, directory=ROOT)
    socketserver.TCPServer.allow_reuse_address = True
    httpd, port = try_bind(PORT, handler)
    if port != PORT:
        print('提示：端口 %d 已被占用或受系统保护，已改用 %d' % (PORT, port))
    with httpd:
        url = 'http://localhost:%d/' % port
        print('水滸卡馆 → %s  (Ctrl+C 结束)' % url)
        if '--no-browser' not in sys.argv:
            who = open_fullscreen(url)
            print(('已在 %s 中全屏打开（按 F11 退出全屏）' % who) if who
                  else '未找到 Chrome / Edge，已用默认浏览器打开（可手动按 F11 全屏）')
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print('\nbye')


if __name__ == '__main__':
    main()
