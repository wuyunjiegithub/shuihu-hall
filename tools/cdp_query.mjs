// CDP 小工具：在页面里求值，用于录制脚本查询状态（面板是否打开、按钮坐标等）
// 用法：node tools/cdp_query.mjs <port> "<expression>"
const port = process.argv[2] || '9222';
const expr = process.argv[3] || '1+1';

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function main() {
  let list;
  for (let i = 0; i < 40; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/list`);
      list = await res.json();
      const page = list.find(t => t.type === 'page' && t.url && !t.url.startsWith('devtools://'));
      if (page) break;
    } catch (e) { /* retry */ }
    await sleep(400);
  }
  const page = (list || []).find(t => t.type === 'page' && t.url && !t.url.startsWith('devtools://'));
  if (!page) { console.log('null'); process.exit(1); }
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
  let done = false;
  ws.onmessage = (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.id === 1) {
      done = true;
      if (msg.result && msg.result.exceptionDetails) console.log('ERR');
      else console.log(JSON.stringify(msg.result && msg.result.result ? msg.result.result.value : null));
      ws.close();
      process.exit(0);
    }
  };
  ws.send(JSON.stringify({ id: 1, method: 'Runtime.evaluate', params: { expression: expr, returnByValue: true, awaitPromise: true } }));
  setTimeout(() => { if (!done) { console.log('null'); process.exit(1); } }, 15000);
}

main();
