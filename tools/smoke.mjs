// 冒烟测试：通过 CDP 驱动无头 Chrome，验证拆分后的交互路径。
// 用法：node tools/_smoke.mjs  （需先启动 serve.py 8123）
import { spawn } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const URL = 'http://localhost:8123/';
const PORT = 9333;

const sleep = (ms) => new Promise(r => setTimeout(r, ms));
let seq = 0;
const pending = new Map();

function send(ws, method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = ++seq;
    pending.set(id, { resolve, reject });
    ws.send(JSON.stringify({ id, method, params }));
    setTimeout(() => reject(new Error('timeout ' + method)), 20000);
  });
}

async function evalIn(ws, expression) {
  const r = await send(ws, 'Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (r.exceptionDetails) throw new Error('page error: ' + JSON.stringify(r.exceptionDetails.exception && r.exceptionDetails.exception.description || r.exceptionDetails.text));
  return r.result.value;
}

const key = (k) => `(function(){window.dispatchEvent(new KeyboardEvent('keydown',{key:'${k}',bubbles:true,cancelable:true}));return 'ok';})()`;

// 截图到临时目录
import { writeFileSync } from 'node:fs';
async function snap(ws, name) {
  const r = await send(ws, 'Page.captureScreenshot', { format: 'png' });
  writeFileSync(join(tmpdir(), name), Buffer.from(r.data, 'base64'));
  console.log('shot ->', join(tmpdir(), name));
}

async function main() {
  const profile = mkdtempSync(join(tmpdir(), 'chrome-smoke-'));
  const chrome = spawn(CHROME, [
    '--headless=new', '--disable-gpu', '--enable-unsafe-swiftshader',
    '--remote-debugging-port=' + PORT, '--window-size=1440,900',
    '--user-data-dir=' + profile, 'about:blank'
  ], { stdio: 'ignore' });

  let list = null;
  for (let i = 0; i < 30; i++) {
    await sleep(500);
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/list`);
      list = await res.json();
      if (list && list.length) break;
    } catch (e) { /* retry */ }
  }
  if (!list || !list.length) throw new Error('chrome devtools not reachable');
  const target = list.find(t => t.type === 'page');
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
  ws.onmessage = (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.id && pending.has(msg.id)) { pending.get(msg.id).resolve(msg.result); pending.delete(msg.id); }
    if (msg.method === 'Runtime.exceptionThrown') console.log('PAGE EXCEPTION:', JSON.stringify(msg.params.exceptionDetails).slice(0, 400));
    if (msg.method === 'Log.entryAdded' && msg.params.entry.level === 'error') console.log('LOG ERROR:', msg.params.entry.text.slice(0, 200));
  };
  await send(ws, 'Runtime.enable');
  await send(ws, 'Page.enable');
  await send(ws, 'Page.navigate', { url: URL });
  await sleep(9000); // 等纹理加载 + 布局展开

  console.log('layout:', await evalIn(ws, `__HALL.layout ? __HALL.layout : 'n/a'`));
  console.log('initial moving:', await evalIn(ws, `__HALL.movingCount()`));
  await snap(ws, 'smoke-1-dualring.png');

  // 切换到悬浮岛屿
  await evalIn(ws, key('2'));
  await sleep(6000);
  console.log('islands moving:', await evalIn(ws, `__HALL.movingCount()`));
  await snap(ws, 'smoke-2-islands.png');

  // 洗牌
  await evalIn(ws, key('r'));
  await sleep(700);
  console.log('shuffling:', await evalIn(ws, `__HALL.shuffling()`));
  await snap(ws, 'smoke-3-shuffle.png');
  await sleep(3500);
  console.log('after shuffle moving:', await evalIn(ws, `__HALL.movingCount()`));

  // 长廊
  await evalIn(ws, key('3'));
  await sleep(6000);
  console.log('corridor moving:', await evalIn(ws, `__HALL.movingCount()`));
  await snap(ws, 'smoke-4-corridor.png');

  // 恶人密室
  console.log('vault unlock:', await evalIn(ws, `__HALL.unlockVault()`));
  await evalIn(ws, `document.getElementById('entryBtn').click()`);
  await sleep(2500);
  await snap(ws, 'smoke-5-vault.png');
  await evalIn(ws, `document.getElementById('exitVaultBtn').click()`);
  await sleep(1500);
  console.log('back moving:', await evalIn(ws, `__HALL.movingCount()`));

  await evalIn(ws, key('1'));
  await sleep(4000);
  console.log('final moving:', await evalIn(ws, `__HALL.movingCount()`));

  ws.close();
  chrome.kill();
  console.log('SMOKE OK');
  process.exit(0);
}

main().catch(e => { console.error('SMOKE FAIL:', e.message); process.exit(1); });
