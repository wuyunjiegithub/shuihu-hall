// 演示视频录制：kiosk Chrome + CDP 驱动交互 + Page.screencast 取帧 → ffmpeg 合成
// 用法：node tools/record_demo.mjs   （输出 shuihu-hall-demo.mp4，约 1 分钟）
import { spawn } from 'node:child_process';
import { rmSync, mkdirSync, writeFileSync } from 'node:fs';

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const FFMPEG = 'D:/devSoft/nodejs/ffmpeg.exe';
const PY = 'C:/Users/user/.workbuddy/binaries/python/versions/3.13.12/python.exe';
const ROOT = 'D:/code/hermes_code/shuihu-hall';
const OUT = ROOT + '/shuihu-hall-demo.mp4';
const SERVE_PORT = 8177, DBG = 9223;
const BASE = 'http://localhost:' + SERVE_PORT + '/';
const sleep = ms => new Promise(r => setTimeout(r, ms));

/* ---------- 1. 本地服务 ---------- */
const serve = spawn(PY, ['serve.py', String(SERVE_PORT), '--no-browser'], { cwd: ROOT, stdio: 'ignore' });
let served = false;
for (let i = 0; i < 30 && !served; i++) { await sleep(400); try { served = (await fetch(BASE)).ok; } catch (e) { } }
if (!served) { console.error('服务未就绪'); process.exit(1); }
console.log('serve ok');

/* ---------- 2. kiosk Chrome ---------- */
const profile = ROOT + '/.chrome-demo-' + Date.now();
const chrome = spawn(CHROME, ['--kiosk', '--user-data-dir=' + profile, '--remote-debugging-port=' + DBG,
  '--no-first-run', '--no-default-browser-check', BASE], { stdio: 'ignore' });

let wsUrl = null;
for (let i = 0; i < 40 && !wsUrl; i++) {
  await sleep(500);
  try {
    const l = await (await fetch('http://127.0.0.1:' + DBG + '/json/list')).json();
    const t = l.find(x => x.type === 'page' && x.url.includes(SERVE_PORT));
    if (t) wsUrl = t.webSocketDebuggerUrl;
  } catch (e) { }
}
if (!wsUrl) { console.error('NO CDP'); process.exit(1); }

const ws = new WebSocket(wsUrl);
await new Promise(r => ws.addEventListener('open', r, { once: true }));
let seq = 0; const pend = new Map();
const errs = [];
ws.addEventListener('message', e => {
  const m = JSON.parse(e.data);
  if (m.id && pend.has(m.id)) { pend.get(m.id).res(m.result); pend.delete(m.id); }
  if (m.method === 'Runtime.exceptionThrown') errs.push(m.params.exceptionDetails?.exception?.description || 'err');
});
function send(m, p = {}) {
  return new Promise((res, rej) => {
    const id = ++seq; pend.set(id, { res, rej });
    try { ws.send(JSON.stringify({ id, method: m, params: p })); } catch (e) { rej(e); }
    setTimeout(() => { if (pend.has(id)) { pend.delete(id); rej(new Error('timeout ' + m)); } }, 8000);
  });
}
async function safe(fn) { try { return await fn(); } catch (e) { console.log('  (skip:', e.message.slice(0, 40) + ')'); return null; } }
async function ev(expr) {
  const r = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
  if (r.exceptionDetails) throw new Error('page: ' + (r.exceptionDetails.exception?.description || r.exceptionDetails.text));
  return r.result.value;
}
await send('Page.enable'); await send('Runtime.enable');

for (let i = 0; i < 60; i++) { if (await ev('!!window.__HALL').catch(() => false)) break; await sleep(500); }
await sleep(2500);   // 等贴图铺满

/* ---------- 3. 假光标（金色圆点，观众能看清操作轨迹） ---------- */
await ev(`(function(){
  var c=document.createElement('div');c.id='demoCursor';
  c.style.cssText='position:fixed;left:50%;top:50%;width:26px;height:26px;border:2.5px solid #ffd88a;'+
    'border-radius:50%;box-shadow:0 0 14px rgba(255,216,138,.95),inset 0 0 8px rgba(255,216,138,.5);'+
    'pointer-events:none;z-index:9999;transform:translate(-50%,-50%);transition:left .14s ease-out,top .14s ease-out;'+
    'background:radial-gradient(circle,rgba(255,216,138,.55),rgba(255,216,138,.08))';
  document.body.appendChild(c);
  addEventListener('pointermove', function (e) { c.style.left = e.clientX + 'px'; c.style.top = e.clientY + 'px'; }, true);
  window.__pulse = function () {c.animate([{opacity:.4,boxShadow:'0 0 26px rgba(255,216,138,1)'} ,{opacity:1,boxShadow:'0 0 14px rgba(255,216,138,.95)'}],{duration:260});};
  return 'ok';
})()`);

/* ---------- 4. 输入驱动（带结果校验与重试） ---------- */
const CW = await ev(`document.querySelector('canvas').clientWidth`);
const CH = await ev(`document.querySelector('canvas').clientHeight`);
async function move(x, y) { await safe(() => send('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y })); await sleep(30); }
async function down(x, y, btn) { await safe(() => send('Input.dispatchMouseEvent', { type: 'mousePressed', x, y, button: btn || 'left', clickCount: 1 })); }
async function up(x, y, btn) { await safe(() => send('Input.dispatchMouseEvent', { type: 'mouseReleased', x, y, button: btn || 'left', clickCount: 1 })); }
async function click(x, y, btn) {
  await move(x, y); await sleep(120);
  await down(x, y, btn); await sleep(80); await up(x, y, btn);
  await safe(() => ev('window.__pulse()')); await sleep(90);
}
async function drag(x1, y1, x2, y2, ms) {
  await move(x1, y1); await down(x1, y1);
  const steps = 16, dt = ms / steps;
  for (let i = 1; i <= steps; i++) {
    await safe(() => send('Input.dispatchMouseEvent', {
      type: 'mouseMoved', buttons: 1,
      x: x1 + (x2 - x1) * i / steps, y: y1 + (y2 - y1) * i / steps
    }));
    await sleep(dt);
  }
  await up(x2, y2);
}
const VK = { '1': 49, '2': 50, '3': 51, 'r': 82, 'Escape': 27, ArrowRight: 39, ArrowLeft: 37 };
async function key(k) {
  await safe(() => send('Input.dispatchKeyEvent', { type: 'rawKeyDown', key: k, windowsVirtualKeyCode: VK[k] }));
  await safe(() => send('Input.dispatchKeyEvent', { type: 'keyUp', key: k, windowsVirtualKeyCode: VK[k] }));
}
// 投影：最接近屏幕中心的那张卡
async function cardAt(kind, spread) {
  return await safe(() => ev(`(function(){
    var el=document.querySelector('canvas'),cards=window.__HALL.${kind}Cards,sp=${spread || 0.55};
    var best=null,bd=1e9,v=new THREE.Vector3();
    for(var i=0;i<cards.length;i++){
      cards[i].getWorldPosition(v); v.project(window.__HALL.camera);
      if(v.z>1||v.z<-1)continue;
      var d=Math.abs(v.x)+Math.abs(v.y);
      if(Math.abs(v.x)<sp&&Math.abs(v.y)<sp&&d<bd){bd=d;best={i:i,x:+((v.x*.5+.5)*el.clientWidth).toFixed(0),y:+((-v.y*.5+.5)*el.clientHeight).toFixed(0)};}
    }
    return JSON.stringify(best);
  })()`)).then(r => r ? JSON.parse(r) : null);
}
async function chip(bar, idx) {
  return await safe(() => ev(`(function(){var b=document.querySelectorAll('#${bar} .chip')[${idx}];if(!b)return null;var r=b.getBoundingClientRect();return JSON.stringify({x:Math.round(r.x+r.width/2),y:Math.round(r.y+r.height/2)});})()`)).then(r => r ? JSON.parse(r) : null);
}
async function center(elId) {
  return await safe(() => ev(`(function(){var b=document.getElementById('${elId}');if(!b||getComputedStyle(b).display==='none')return null;var r=b.getBoundingClientRect();return JSON.stringify({x:Math.round(r.x+r.width/2),y:Math.round(r.y+r.height/2)});})()`)).then(r => r ? JSON.parse(r) : null);
}
const panelOpen = () => ev(`document.getElementById('panel').classList.contains('open')`).catch(() => false);
const modeText = () => ev(`document.getElementById('mode').textContent`).catch(() => '?');

// 点卡进鉴赏：取坐标→立刻点→校验面板，最多重试 4 次；最后 JS 兜底
async function focusCard(kind) {
  for (let t = 0; t < 4; t++) {
    const c = await cardAt(kind);
    if (!c) { await sleep(700); continue; }
    await move(c.x, c.y); await sleep(60);
    await down(c.x, c.y); await sleep(60); await up(c.x, c.y);
    await safe(() => ev('window.__pulse()'));
    await sleep(900);
    if (await panelOpen()) { await sleep(1600); return c; }
  }
  // 兜底：直接调用页面接口（视觉上等效）
  const ok = await safe(() => ev(`(function(){
    var cards=window.__HALL.${kind}Cards,v=new THREE.Vector3(),best=null,bd=1e9;
    for(var i=0;i<cards.length;i++){cards[i].getWorldPosition(v);var d=Math.abs(v.x)+Math.abs(v.y);if(d<bd){bd=d;best=cards[i];}}
    if(best){var ch=best.userData.char;for(var j=0;j<best.children.length&&!ch;j++)if(best.children[j].userData.char)ch=best.children[j].userData.char;if(ch){window.__HALL.openFocus(best,ch);return 'ok';}}return 'no';
  })()`));
  await sleep(1800);
  console.log('  (fallback openFocus:', ok + ')');
  return await cardAt(kind);
}
// 右键翻面：聚焦后相机静止，坐标是准的；校验 flipped
async function flipFocused(kind) {
  for (let t = 0; t < 3; t++) {
    const c = await cardAt(kind, 0.4);
    if (!c) { await sleep(600); continue; }
    await click(c.x, c.y, 'right');
    await sleep(1600);
    const flipped = await ev(`(function(){var cs=window.__HALL.${kind}Cards;for(var i=0;i<cs.length;i++)if(cs[i].userData.flipped)return true;return false;})()`).catch(() => false);
    if (flipped) return true;
  }
  return false;
}

/* ---------- 5. 画面捕获（CDP screencast：窗口被盖住也照录） ---------- */
const FRAMES = ROOT + '/.frames';
try { rmSync(FRAMES, { recursive: true, force: true }); } catch (e) { }
mkdirSync(FRAMES, { recursive: true });

let frameN = 0, lastT = null;
const durations = [];
const t0 = Date.now();
ws.addEventListener('message', e => {
  const m = JSON.parse(e.data);
  if (m.method !== 'Page.screencastFrame') return;
  const now = (Date.now() - t0) / 1000;
  const name = 'f_' + String(frameN++).padStart(5, '0') + '.jpg';
  try { writeFileSync(FRAMES + '/' + name, Buffer.from(m.params.data, 'base64')); } catch (err) { }
  durations.push(lastT == null ? 0 : Math.max(0.001, now - lastT));
  lastT = now;
  safe(() => send('Page.screencastFrameAck', { sessionId: m.params.sessionId }));
});
await send('Page.startScreencast', { format: 'jpeg', quality: 82, maxWidth: 1920, maxHeight: 1080, everyNthFrame: 1 });
await sleep(1200);
const log = (s) => console.log('[' + new Date().toISOString().slice(14, 19) + ']', s);
try {
  /* 开场巡航 */
  log('开场巡航'); await sleep(3500);

  /* 左右拖动 → 波动 */
  log('拖动波动'); await drag(CW * 0.42, CH * 0.55, CW * 0.72, CH * 0.55, 1400); await drag(CW * 0.72, CH * 0.55, CW * 0.38, CH * 0.55, 1200); await sleep(700);

  /* 点击英雄卡鉴赏（带重试） */
  log('点击英雄卡');
  await focusCard('hero');
  log('panel=' + await panelOpen() + ' mode=' + await modeText());

  /* 走马灯 */
  log('左右切换'); await key('ArrowRight'); await sleep(1500); await key('ArrowRight'); await sleep(1500);

  /* 右键翻面 / 翻回 */
  log('右键翻面');
  const flipped = await flipFocused('hero');
  if (flipped) { await sleep(600); const c2 = await cardAt('hero', 0.4); if (c2) await click(c2.x, c2.y, 'right'); await sleep(1000); }
  log('flipped=' + flipped);
  await key('Escape'); await sleep(1300);

  /* 工艺：普卡 → 奖闪 → 冷烫 */
  log('工艺切换');
  for (const idx of [0, 1, 2]) {
    const p = await chip('craftBar', idx);
    if (p) await click(p.x, p.y);
    await sleep(idx === 0 ? 2200 : 3800);
  }
  await key('Escape'); await sleep(1200);

  /* 三种展厅（切换自带星穹洗牌） */
  log('悬浮岛屿'); await key('2'); await sleep(4500);
  log('悬浮长廊'); await key('3'); await sleep(4500);
  log('双星环'); await key('1'); await sleep(4200);

  /* 恶人密室：先真实点光球，失败则解锁兜底 → 点入口按钮 */
  log('解锁密室');
  // 光球要连点 3 次才算解锁，所以固定点满 3 次，再按入口按钮是否出现判断是否成功
  for (let i = 0; i < 3; i++) {
    const orb = await safe(() => ev(`(function(){var v=new THREE.Vector3();window.__HALL.stele.orb.getWorldPosition(v);v.project(window.__HALL.camera);var el=document.querySelector('canvas');if(v.z>1)return null;var x=Math.round((v.x*.5+.5)*el.clientWidth),y=Math.round((-v.y*.5+.5)*el.clientHeight);if(x<60||x>el.clientWidth-60||y<60||y>el.clientHeight-60)return null;return JSON.stringify({x:x,y:y});})()`)).then(r => r ? JSON.parse(r) : null);
    if (!orb) break;
    await click(orb.x, orb.y);
    await sleep(400);
  }
  // 兜底：入口按钮没出现就直接解锁（避免光球被镜头甩出画面）
  const btnVisible = await ev(`document.getElementById('entryBtn').style.display !== 'none'`).catch(() => false);
  if (!btnVisible) { await safe(() => ev(`window.__HALL.unlockVault()`)); await sleep(700); }
  const entry = await center('entryBtn');
  if (entry) { log('进入密室'); await click(entry.x, entry.y); await sleep(3200); }
  log('vault=' + await ev(`window.__HALL.vault`).catch(() => '?'));

  /* 密室内鉴赏恶人卡（带重试，仅在确认进入密室后才做） */
  log('鉴赏恶人卡');
  if (await ev(`window.__HALL.vault`).catch(() => false)) await focusCard('villain');
  else console.log('  (skip: 未进入密室)');
  log('panel=' + await panelOpen() + ' mode=' + await modeText());
  await sleep(1200);

  /* 结尾：退鉴赏 → 出密室 → 洗牌收场 */
  log('收场'); await key('Escape'); await sleep(1200);
  await key('Escape'); await sleep(1400);
  await key('r'); await sleep(4500);
} catch (e) {
  console.error('TIMELINE ERR:', e.message);
}
console.log('console errors:', errs.slice(0, 5));

/* ---------- 6. 停止捕获 → concat 合成 ---------- */
await safe(() => send('Page.stopScreencast'));
if (durations.length) durations[durations.length - 1] = Math.max(durations[durations.length - 1], lastT + 0.8 - lastT);
let list = 'ffconcat version 1.0\n';
for (let i = 0; i < frameN; i++) {
  list += `file 'f_${String(i).padStart(5, '0')}.jpg'\nduration ${durations[i].toFixed(3)}\n`;
}
list += `file 'f_${String(frameN - 1).padStart(5, '0')}.jpg'\n`;
writeFileSync(FRAMES + '/list.txt', list);
console.log('frames:', frameN, 'span:', lastT?.toFixed(1) + 's');

ws.close();
log('合成中…');
const ff = spawn(FFMPEG, ['-y', '-f', 'concat', '-safe', '0', '-i', FRAMES + '/list.txt',
  '-vf', 'fps=24,format=yuv420p', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '21', OUT],
  { stdio: 'ignore' });   // 必须忽略输出：管道无人消费会把 ffmpeg 卡死
await new Promise(r => { ff.on('exit', r); ff.on('error', r); });
log('合成结束');
try { chrome.kill(); } catch (e) { }
serve.kill();
console.log('DONE ->', OUT);
process.exit(0);
