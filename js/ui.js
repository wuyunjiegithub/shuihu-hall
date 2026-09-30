/* ui.js —— HUD 与鉴赏面板
 * 依赖：全局 THREE（vendor/three.min.js）
 */
import { assetUrl } from './core.js';

/* 详情面板直接展示完整原图：原图本身就是「正面 + 背面」左右拼接的，
 * 一张图就能同时看到正反面，因此这里不做裁剪。 */

export function initUI(cb) {
  var els = {
    layoutBar: document.getElementById('layoutBar'),
    craftBar: document.getElementById('craftBar'),
    layoutHint: document.getElementById('layoutHint'),
    mode: document.getElementById('mode'),
    panel: document.getElementById('panel'),
    pClose: document.getElementById('pClose'),
    pImg: document.getElementById('pImg'),
    pStar: document.getElementById('pStar'),
    pRank: document.getElementById('pRank'),
    pNick: document.getElementById('pNick'),
    pName: document.getElementById('pName'),
    pBio: document.getElementById('pBio'),
    pBack: document.getElementById('pBack'),
    entryBtn: document.getElementById('entryBtn'),
    loader: document.getElementById('loader'),
    barFill: document.getElementById('barFill'),
    pct: document.getElementById('pct')
  };

  function buildBar(bar, items, activeId, onPick) {
    bar.innerHTML = '';
    items.forEach(function (it) {
      var b = document.createElement('button');
      b.className = 'chip' + (it.id === activeId ? ' on' : '');
      b.textContent = it.label;
      b.dataset.id = it.id;
      b.addEventListener('click', function () {
        Array.prototype.forEach.call(bar.children, function (c) { c.classList.remove('on'); });
        b.classList.add('on');
        onPick(it.id);
      });
      bar.appendChild(b);
    });
  }

  els.pClose.addEventListener('click', function () { cb.onClosePanel && cb.onClosePanel(); });
  els.entryBtn && els.entryBtn.addEventListener('click', function () { cb.onEnterVault && cb.onEnterVault(); });

  // 窄屏折叠菜单
  var controls = document.getElementById('controls');
  var ctrlToggle = document.getElementById('ctrlToggle');
  if (ctrlToggle) {
    ctrlToggle.addEventListener('click', function () {
      controls.classList.toggle('open');
      ctrlToggle.textContent = controls.classList.contains('open') ? '展厅 / 工艺 ▴' : '展厅 / 工艺 ▾';
    });
  }

  return {
    els: els,
    buildLayoutBar(items, active, pick) { buildBar(els.layoutBar, items, active, pick); },
    buildCraftBar(items, active, pick) {
      buildBar(els.craftBar, items, active, pick);
      var cur = items.filter(function (i) { return i.id === active; })[0];
      els.layoutHint.textContent = cur ? cur.desc : '';
    },
    setHint(text) { els.layoutHint.textContent = text; },
    /* 恶人密室是独立场景，只有一种陈列，进去后锁掉展厅切换 */
    lockLayoutBar(locked) {
      var row = els.layoutBar.parentElement;
      if (row) row.classList.toggle('locked', !!locked);
      Array.prototype.forEach.call(els.layoutBar.children, function (c) {
        c.classList.toggle('locked', !!locked);
        c.disabled = !!locked;
        c.title = locked ? '恶人密室为独立场景，返回主馆后可切换展厅' : '';
      });
    },
    setMode(text) { els.mode.textContent = text; },
    progress(p) {
      els.barFill.style.width = p + '%';
      els.pct.textContent = p + '%';
      if (p >= 100) setTimeout(function () { els.loader.classList.add('hide'); }, 350);
    },
    openPanel(char) {
      els.pStar.textContent = char.star;
      els.pStar.className = char.kind === 'villain' ? 'vg'
        : (char.n <= 36 ? 'tg' : '');
      els.pRank.textContent = char.kind === 'villain'
        ? '六大恶人 · ' + char.displayId
        : '梁山第 ' + String(char.n).padStart(3, '0') + ' 位 · ' + (char.n <= 36 ? '三十六天罡' : '七十二地煞');
      els.pNick.textContent = char.kind === 'villain' ? (char.nick || '奸佞') : char.nick;
      els.pName.textContent = char.name.split('').join(' ');
      els.pBio.textContent = char.bio || '';
      els.pBack.textContent = char.kind === 'villain'
        ? '—— 六大恶人 · 水浒英雄谱 ——'
        : '—— 水浒英雄谱 · 统一小浣熊 1999 ——';
      // 展示完整原图：左半是正面人物，右半是背面信息，一张图看全正反面
      els.pImg.src = assetUrl(
        (char.kind === 'villain' ? 'assets/villains/' : 'assets/standard/') + char.n + '.webp'
      );
      els.panel.classList.add('open');
      els.mode.textContent = '鉴赏 · ' + char.name;
    },
    closePanel(modeText) {
      els.panel.classList.remove('open');
      els.mode.textContent = modeText || '自动导览中';
    },
    showEntryBtn(show) {
      if (els.entryBtn) els.entryBtn.style.display = show ? '' : 'none';
    }
  };
}

