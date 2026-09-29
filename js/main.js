/* main.js —— 入口：装配场景、驱动主循环
 * 依赖：全局 THREE（vendor/three.min.js）
 */
import { CHARACTERS } from './data.js';
import { createCore, buildEnvironment, buildStele, CameraRig, radialTex, assetUrl } from './core.js';
import { CRAFTS, createCard, applyCraft, laserBackTexture, effectiveQuat } from './cards.js';
import { LAYOUTS, LAYOUT_ORDER, LayoutManager } from './layouts.js';
import { buildVillainRoom, OrbTrigger, isLowSpec, isTouch, initInput } from './features.js';
import { initUI } from './ui.js';
import { loadTex, loadSplitCard, setProgressHandler } from './loader.js';
import { APP, CRAFT_SCANS } from './state.js';

const HEROES = CHARACTERS.filter(function (c) { return c.kind === 'hero'; });
const VILLAINS = CHARACTERS.filter(function (c) { return c.kind === 'villain'; });

const lowSpec = isLowSpec();
const core = createCore(document.body, { lowSpec });
const { scene, camera, render, resize } = core;

buildEnvironment(scene, lowSpec);
const stele = buildStele(scene);

const rig = new CameraRig(camera);
const state = { nx: 0, ny: 0, dragged: false, pinch: 0 };
var suppressTapUntil = 0;   // 移动端双击翻面后，抑制紧随其后的合成单击（避免重复聚焦）


/* ---------- UI ---------- */
// 随包只提供普卡原图（左右拼接），奖闪 / 冷烫是在普卡上叠加程序化镭射膜，
// 因此默认就以镭射工艺开场。
APP.currentCraft = 'flash_prize';
let currentLayout = 'dualRing';
let inVault = false;
// 鉴赏中的人物挂在共享状态 APP.focusChar 上，features/input 需要读取它
let focusGrp = null;        // 当前鉴赏的卡片组
let focusList = [];         // 鉴赏时可左右切换的卡片序列
let focusDragAccum = 0;     // 鉴赏模式下左右拖动的累计位移

const UI = initUI({
  onClosePanel: function () { exitFocus(); },
  onEnterVault: function () { enterVault(); }
});
setProgressHandler(function (p) { UI.progress(p); });

// 顶部「拖动空白处左右滑动」提示条已移除（交互改为鉴赏时左右切换）

UI.buildLayoutBar(
  LAYOUT_ORDER.map(function (id) { return { id: id, label: LAYOUTS[id].name }; }),
  currentLayout,
  function (id) { switchLayout(id); }
);
UI.buildCraftBar(
  Object.keys(CRAFTS)
    .filter(function (id) { return CRAFT_SCANS ? true : ['standard', 'flash_prize', 'code_perm'].indexOf(id) >= 0; })
    .map(function (id) { return { id: id, label: CRAFTS[id].label, desc: CRAFTS[id].desc }; }),
  APP.currentCraft,
  function (id) { switchCraft(id); }
);
UI.setHint(LAYOUTS[currentLayout].hint);

// 洗牌重组特效按钮（快捷键 R）
(function () {
  var btn = document.getElementById('shuffleBtn');
  if (btn) btn.addEventListener('click', function () { startShuffle(); });
})();

/* ---------- 建卡 ---------- */
const heroCards = [];
const villainCards = [];
const holoMats = [];

HEROES.forEach(function (ch) {
  var grp = createCard(ch, null, APP.currentCraft);
  grp.position.set(0, 0, 0);
  scene.add(grp);
  heroCards.push(grp);
  holoMats.push(grp.userData.holoMat);
  // 单文件版缺失奖闪/冷烫扫描图，所以正面先读必有的普卡原图；背面按工艺决定
  loadSplitCard(assetUrl('assets/standard/' + ch.n + '.webp'), function (pair) {
    if (!pair) return;
    grp.userData.mesh.material[4].map = pair.front;
    if (APP.currentCraft === 'flash_prize' || APP.currentCraft === 'code_perm') {
      grp.userData.mesh.material[5].map = laserBackTexture(APP.currentCraft);
    } else {
      grp.userData.mesh.material[5].map = pair.back;
    }
    grp.userData.mesh.material[4].needsUpdate = true;
    grp.userData.mesh.material[5].needsUpdate = true;
  });
});

VILLAINS.forEach(function (ch) {
  var grp = createCard(ch, null, APP.currentCraft);
  holoMats.push(grp.userData.holoMat);
  villainCards.push(grp);
  // 恶人卡原图同样是「人物面 + 卡背面」左右拼接，必须中分：左半人物面、右半卡背
  loadSplitCard(assetUrl('assets/villains/' + ch.n + '.webp'), function (pair) {
    if (!pair) return;
    grp.userData.mesh.material[4].map = pair.front;
    if (APP.currentCraft === 'flash_prize' || APP.currentCraft === 'code_perm') {
      grp.userData.mesh.material[5].map = laserBackTexture(APP.currentCraft);
    } else {
      grp.userData.mesh.material[5].map = pair.back;
    }
    grp.userData.mesh.material[4].needsUpdate = true;
    grp.userData.mesh.material[5].needsUpdate = true;
  });
});

const vault = buildVillainRoom(scene, villainCards);

/* ---------- 布局 ---------- */
const layoutManager = new LayoutManager(scene, heroCards, rig, function (g) { return false; }, stele);

/* 翻转辅助：翻转时把发光调暗（避免冲淡背面文字），复位时恢复工艺发光 */
function setCardFlipped(grp, v) {
  grp.userData.flipped = v;
  grp.userData.glow.material.opacity = v ? 0.05 : (grp.userData.craftGlow != null ? grp.userData.craftGlow : 0.28);
}
function resetAllFlips() {
  heroCards.concat(villainCards).forEach(function (g) { setCardFlipped(g, false); });
}

/* ======================== 洗牌重组特效 ======================== */
/* 「星穹洗牌」：卡片爆散飞舞 → 悬停自旋 → 回落归位。
 * 基于每张卡的 targetPos，因此三种展厅（双星环 / 悬浮岛屿 / 悬浮长廊）与恶人密室通用。 */
var SHUF_T_SCATTER = 0.85;   // 爆散
var SHUF_T_HOVER = 0.55;     // 悬停自旋
var SHUF_T_RETURN = 1.25;    // 回落归位
var SHUF_STAGGER = 0.30;     // 逐张错峰总时长
const SHUF = { active: false, t0: 0, items: [], burst: null, set: null };

function easeOutCubic(x) { return 1 - Math.pow(1 - x, 3); }
function easeInOutCubic(x) { return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; }
function clamp01(x) { return x < 0 ? 0 : (x > 1 ? 1 : x); }

function ensureBurst() {
  if (SHUF.burst) return SHUF.burst;
  var s = new THREE.Sprite(new THREE.SpriteMaterial({
    map: radialTex('255,214,140'), transparent: true, opacity: 0,
    blending: THREE.AdditiveBlending, depthWrite: false
  }));
  s.visible = false; scene.add(s); SHUF.burst = s;
  return s;
}

function startShuffle() {
  if (SHUF.active) return false;
  var list = inVault ? villainCards : heroCards;
  if (!list.length) return false;
  if (APP.focusChar) exitFocus();
  resetAllFlips();
  for (var ci = 0; ci < list.length; ci++) list[ci].userData.moving = false;

  /* 爆散中心：密室里的恶人卡是「密室组」的子对象，position 是局部坐标，
   * 不能直接拿主展厅的 rig.center（世界坐标）来算，否则会把卡片甩到主展厅去。
   * 这里统一在卡片所在的父级空间里取分布中心。 */
  var center = rig.center.clone();
  if (inVault) {
    center.set(0, 0, 0);
    list.forEach(function (g) { center.add(g.position); });
    center.divideScalar(list.length);
  }
  var burstWorld = center.clone().add(list[0].parent.position);
  var items = list.map(function (grp, i) {
    var d = grp.userData;
    var p0 = grp.position.clone();
    // 以展厅中心为原点向外爆散：径向 + 切向 + 垂直随机
    var out = p0.clone().sub(center); out.y = 0;
    if (out.lengthSq() < 1e-4) out.set(1, 0, 0);
    out.normalize();
    var tan = new THREE.Vector3(-out.z, 0, out.x).normalize();
    var pMid = p0.clone()
      .addScaledVector(out, 9 + Math.random() * 15)
      .addScaledVector(tan, (Math.random() * 2 - 1) * 15);
    pMid.y += (Math.random() * 2 - 1) * 9;
    // 限幅：位移不超过 26，且不低于原位 4 / 不高于原位 12，避免飞出视野或沉入岛体
    var disp = pMid.clone().sub(p0);
    if (disp.length() > 26) { disp.setLength(26); pMid.copy(p0).add(disp); }
    pMid.y = Math.max(p0.y - 1.2, Math.min(p0.y + 12, pMid.y));
    var axis = new THREE.Vector3(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1).normalize();
    var it = {
      grp: grp, d: d, p0: p0, pMid: pMid,
      q0: grp.quaternion.clone(), axis: axis,
      spin: (Math.random() < 0.5 ? -1 : 1) * (4 + Math.random() * 5),
      delay: (i / list.length) * SHUF_STAGGER,
      glowBase: d.craftGlow != null ? d.craftGlow : 0.28,
      holoBase: d.holoMat.uniforms.uStrength.value
    };
    // 洗牌期间：提亮光晕与流光（普卡 strength 为 0，保持哑光不闪）
    d.glow.material.opacity = Math.min(0.9, it.glowBase + 0.5);
    if (it.holoBase > 0) d.holoMat.uniforms.uStrength.value = Math.min(1.4, it.holoBase * 2.2);
    return it;
  });

  SHUF.items = items;
  SHUF.set = list;
  SHUF.active = true;
  SHUF.t0 = performance.now() / 1000;
  UI.setMode('星穹洗牌 · 重组中…');

  var b = ensureBurst();
  b.position.copy(burstWorld); b.visible = true; b.material.opacity = 0;
  return true;
}

var _shufQ = new THREE.Quaternion();
var _shufQ2 = new THREE.Quaternion();

function updateShuffle(t) {
  var now = performance.now() / 1000;
  var el = now - SHUF.t0;
  var total = SHUF_T_SCATTER + SHUF_T_HOVER + SHUF_T_RETURN + SHUF_STAGGER;
  var allDone = el >= total;

  SHUF.items.forEach(function (it) {
    var grp = it.grp, d = it.d, e = el - it.delay;
    var p1 = d.targetPos;

    if (e <= 0) {
      grp.position.copy(it.p0); grp.quaternion.copy(it.q0);
      return;
    }
    if (e < SHUF_T_SCATTER) {                       // ① 爆散
      var pe = easeOutCubic(e / SHUF_T_SCATTER);
      grp.position.lerpVectors(it.p0, it.pMid, pe);
      _shufQ.setFromAxisAngle(it.axis, it.spin * pe);
      grp.quaternion.copy(it.q0).multiply(_shufQ);
    } else if (e < SHUF_T_SCATTER + SHUF_T_HOVER) { // ② 悬停自旋
      var eh = e - SHUF_T_SCATTER;
      grp.position.copy(it.pMid);
      grp.position.y += Math.sin(eh * 4.0 + d.phase) * 0.3;
      _shufQ.setFromAxisAngle(it.axis, it.spin + eh * 1.6);
      grp.quaternion.copy(it.q0).multiply(_shufQ);
    } else if (e < SHUF_T_SCATTER + SHUF_T_HOVER + SHUF_T_RETURN) { // ③ 回落归位
      var er = e - SHUF_T_SCATTER - SHUF_T_HOVER;
      var pr = easeInOutCubic(clamp01(er / SHUF_T_RETURN));
      grp.position.lerpVectors(it.pMid, p1, pr);
      _shufQ.setFromAxisAngle(it.axis, it.spin + SHUF_T_HOVER * 1.6);
      _shufQ2.copy(it.q0).multiply(_shufQ);
      grp.quaternion.copy(_shufQ2).slerp(effectiveQuat(d, t), pr);
    } else {                                        // ④ 到位
      grp.position.copy(p1);
      grp.quaternion.slerp(effectiveQuat(d, t), 0.25);
    }
  });

  // 能量冲击波：先外扩炸开，再内缩回收
  var b = SHUF.burst;
  if (b && b.visible) {
    if (el < 1.0) {
      var q1 = clamp01(el / 1.0);
      b.scale.setScalar(8 + q1 * 122);
      b.material.opacity = 0.8 * (1 - q1);
    } else if (el < SHUF_T_SCATTER + SHUF_T_HOVER) {
      b.material.opacity = 0;
    } else if (el < total) {
      var q2 = clamp01((el - SHUF_T_SCATTER - SHUF_T_HOVER) / SHUF_T_RETURN);
      b.scale.setScalar(130 - q2 * 118);
      b.material.opacity = 0.45 * (1 - q2);
    } else {
      b.material.opacity = 0; b.visible = false;
    }
  }

  if (allDone) endShuffle();
}

function endShuffle() {
  SHUF.items.forEach(function (it) {
    var d = it.d;
    d.moving = true;                                  // 交回常规过渡逻辑
    d.glow.material.opacity = d.flipped ? 0.05 : it.glowBase;
    d.holoMat.uniforms.uStrength.value = it.holoBase;
  });
  if (SHUF.burst) { SHUF.burst.visible = false; SHUF.burst.material.opacity = 0; }
  SHUF.active = false; SHUF.items = []; SHUF.set = null;
  UI.setMode(inVault ? '恶人密室' : '自动导览中');
}

function switchLayout(id, fx) {
  if (inVault) return;          // 恶人密室是独立场景，不接受展厅切换
  currentLayout = id;
  layoutManager.apply(id);
  UI.setHint(LAYOUTS[id].hint);
  resetAllFlips();          // 切换展厅/全景即把所有卡片翻回正面
  if (APP.focusChar) exitFocus();
  // 换展厅时自动来一次「星穹洗牌」，让每种模式都有重组特效（首次布展除外）
  if (fx !== false) setTimeout(function () { startShuffle(); }, 60);
}
switchLayout(currentLayout, false);

/* ---------- 工艺切换 ---------- */
function switchCraft(id) {
  if (id === APP.currentCraft) return;
  APP.currentCraft = id;
  UI.setMode('切换工艺中…');
  applyCraft(heroCards.concat(villainCards), id, loadTex);
  setTimeout(function () { UI.setMode(APP.focusChar ? '鉴赏 · ' + APP.focusChar.name : '自动导览中'); }, 600);
}

/* ---------- 交互 ---------- */
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const clickTargets = [];
heroCards.forEach(function (g) { clickTargets.push(g.userData.hit, g.userData.mesh); });
villainCards.forEach(function (g) { clickTargets.push(g.userData.hit, g.userData.mesh); });
clickTargets.push(stele.orb);

const orbTrigger = new OrbTrigger(function () {
  UI.setMode('密室已开启 · 点击右下角进入');
  UI.showEntryBtn(true);
});

core.renderer.domElement.addEventListener('pointerdown', function (e) {
  state.downX = e.clientX; state.downY = e.clientY; state.dragged = false;
  state.isDown = true; state.downBtn = e.button; state.lastX = e.clientX;
  focusDragAccum = 0;   // 每次按下重新累计，避免两次拖动手势叠加误触发
});
core.renderer.domElement.addEventListener('pointermove', function (e) {
  if (state.downX != null && Math.hypot(e.clientX - state.downX, e.clientY - state.downY) > 6) state.dragged = true;
  if (!isTouchEnv()) {
    state.nx = (e.clientX / innerWidth) * 2 - 1;
    state.ny = (e.clientY / innerHeight) * 2 - 1;
  }
  // 触摸手势统一交给 initTouchExtras / initInput，避免与鼠标拖动逻辑重复触发
  if (e.pointerType === 'touch') return;
  var dx = e.clientX - state.lastX; state.lastX = e.clientX;
  // 鉴赏模式：按住左键左右拖动 → 走马灯式切换上一张 / 下一张
  if (state.isDown && state.downBtn === 0 && APP.focusChar) {
    focusDragAccum += dx;
    if (focusDragAccum >= 70) { focusDragAccum = 0; stepFocus(1); }
    else if (focusDragAccum <= -70) { focusDragAccum = 0; stepFocus(-1); }
    return;
  }
  // 巡航模式：左键按住并左右拖动 → 滑动浏览画廊（scrub 巡航），并累积"波动"幅度
  if (state.isDown && state.downBtn === 0 && rig.mode === 'cruise') {
    rig.u = (rig.u - dx * 0.0011 + 1) % 1;
    rig.lastScrub = performance.now();
    APP.gWave = Math.max(-1, Math.min(1, APP.gWave + dx * 0.02));
  }
});
core.renderer.domElement.addEventListener('pointerup', function (e) {
  state.isDown = false;
  if (e.button !== 0) return;          // 仅左键触发鉴赏，右键交给 contextmenu
  if (state.dragged) return;
  if (SHUF.active) return;             // 洗牌特效进行中不响应拾取
  if (performance.now() < suppressTapUntil) return;   // 双击已处理本次点击
  pointer.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
  raycaster.setFromCamera(pointer, camera);
  var hits = raycaster.intersectObjects(clickTargets, false);
  for (var i = 0; i < hits.length; i++) {
    var o = hits[i].object;
    if (o.userData.isOrb) {
      var c = orbTrigger.tap(performance.now() / 1000);
      if (c > 0 && c < 3) UI.setMode('机关启动 ' + c + '/3 …');
      return;
    }
    if (o.userData.char) {
      // 密室里只响应恶人卡（主展厅的卡虽在头顶，但不属于当前场景）
      if (inVault && o.userData.char.kind !== 'villain') continue;
      if (o.userData.char.kind === 'villain' && !vault.group.visible) continue;
      openFocus(o.parent, o.userData.char);
      return;
    }
  }
  if (APP.focusChar) exitFocus();
});
// 右键：翻转卡片查看背面信息
core.renderer.domElement.addEventListener('contextmenu', function (e) {
  e.preventDefault();
  pointer.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
  raycaster.setFromCamera(pointer, camera);
  var hits = raycaster.intersectObjects(clickTargets, false);
  for (var i = 0; i < hits.length; i++) {
    var o = hits[i].object;
    if (o.userData.char) {
      if (inVault && o.userData.char.kind !== 'villain') continue;
      if (o.userData.char.kind === 'villain' && !vault.group.visible) continue;
      var grp = o.parent;
      setCardFlipped(grp, !grp.userData.flipped);
      UI.setMode(grp.userData.flipped ? '翻转 · 查看背面（再右键翻回）'
        : (APP.focusChar ? '鉴赏 · ' + APP.focusChar.name : (inVault ? '恶人密室' : '自动导览中')));
      return;
    }
  }
});
// 滚轮：上下滚动也可滑动浏览
core.renderer.domElement.addEventListener('wheel', function (e) {
  if (rig.mode === 'cruise') {
    rig.u = (rig.u + (e.deltaY > 0 ? 0.012 : -0.012) + 1) % 1;
    rig.lastScrub = performance.now();
  }
}, { passive: true });

function isTouchEnv() {
  return ('ontouchstart' in window) || (navigator.maxTouchPoints || 0) > 0;
}
initInput(core.renderer.domElement, state);

/* ---------- 移动端增强 ---------- */
/* ① 双击卡片 = 翻面（手机无右键，替代电脑端的右键翻转）
 * ② 鉴赏模式下手指左右滑动 = 电脑端 ←/→ 走马灯切换上一张 / 下一张 */
(function initTouchExtras(canvas) {
  var TAP_GAP = 340;      // 双击判定时间窗（ms）
  var TAP_SLOP = 28;      // 双击两次落点允许偏移（px）
  var SWIPE_STEP = 55;    // 滑动多少 px 切换一张
  var lastTapT = 0, lastTapX = 0, lastTapY = 0;
  var startX = 0, startY = 0, moved = false, tracking = false;

  function pickCard(cx, cy) {
    pointer.set((cx / innerWidth) * 2 - 1, -(cy / innerHeight) * 2 + 1);
    raycaster.setFromCamera(pointer, camera);
    var hits = raycaster.intersectObjects(clickTargets, false);
    for (var i = 0; i < hits.length; i++) {
      var o = hits[i].object;
      if (!o.userData.char) continue;
      if (o.userData.char.kind === 'villain' && !vault.group.visible) continue;
      return o.parent;
    }
    return null;
  }

  canvas.addEventListener('touchstart', function (e) {
    if (e.touches.length !== 1) { tracking = false; return; }
    startX = e.touches[0].clientX; startY = e.touches[0].clientY;
    moved = false; tracking = true;
  }, { passive: true });

  canvas.addEventListener('touchmove', function (e) {
    if (!tracking || e.touches.length !== 1) return;
    var t = e.touches[0];
    var dx = t.clientX - startX, dy = t.clientY - startY;
    if (Math.abs(dx) > 8 || Math.abs(dy) > 8) moved = true;
    // 鉴赏模式：手指左右滑动 → 切换下一张 / 上一张（左滑看下一张）
    if (APP.focusChar && Math.abs(dx) >= SWIPE_STEP) {
      stepFocus(dx < 0 ? 1 : -1);
      startX = t.clientX; startY = t.clientY;   // 重置基准，支持连续滑
    }
  }, { passive: true });

  canvas.addEventListener('touchend', function (e) {
    tracking = false;
    if (moved || e.changedTouches.length !== 1) return;
    var t = e.changedTouches[0], now = performance.now();
    if (now - lastTapT < TAP_GAP &&
        Math.hypot(t.clientX - lastTapX, t.clientY - lastTapY) < TAP_SLOP) {
      var grp = pickCard(t.clientX, t.clientY);
      if (grp) {
        setCardFlipped(grp, !grp.userData.flipped);
        UI.setMode(grp.userData.flipped
          ? '翻转 · 查看背面（再双击翻回）'
          : (APP.focusChar ? '鉴赏 · ' + APP.focusChar.name : '自动导览中'));
        suppressTapUntil = now + 420;    // 抑制随后合成的单击，避免重复聚焦
      }
      lastTapT = 0;
      return;
    }
    lastTapT = now; lastTapX = t.clientX; lastTapY = t.clientY;
  }, { passive: true });
})(core.renderer.domElement);

addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    // 先退出鉴赏，再退出密室（原来在密室里按 ESC 会连密室一起退出）
    if (APP.focusChar) exitFocus();
    else if (inVault) exitVault();
  }
  // 恶人密室里屏蔽展厅切换（密室只有一种陈列）
  if (!inVault) {
    if (e.key === '1') switchLayout('dualRing');
    if (e.key === '2') switchLayout('islands');
    if (e.key === '3') switchLayout('corridor');
  }
  // R 键：星穹洗牌（打乱 → 重组）
  if (e.key === 'r' || e.key === 'R') startShuffle();
  // 鉴赏模式：左右方向键切换上一张 / 下一张
  if (APP.focusChar && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) {
    e.preventDefault();
    stepFocus(e.key === 'ArrowRight' ? 1 : -1);
  }
});

/* ---------- 鉴赏 / 密室 ---------- */
function openFocus(grp, char) {
  APP.focusChar = char;
  focusGrp = grp;
  focusList = (char.kind === 'villain') ? villainCards : heroCards;
  focusDragAccum = 0;
  UI.openPanel(char);
  // 用卡片基准朝向（不受翻转影响）定位相机，避免翻转后相机穿到卡内。
  // 注意恶人卡的 position 是「相对密室组」的局部坐标（密室整体在 y = VAULT_Y），
  // 必须取世界坐标，否则鉴赏时相机会飞回主展厅高度。
  var wp = new THREE.Vector3();
  grp.getWorldPosition(wp);
  var normal = new THREE.Vector3(0, 0, 1).applyQuaternion(grp.userData.targetQuat);
  var pos = wp.clone().addScaledVector(normal, 9.5);
  pos.y += 0.6;
  rig.focus(pos, wp.clone());
}
/* 鉴赏模式：走马灯式切换上一张 / 下一张（dir = 1 下一张，-1 上一张），首尾循环 */
function stepFocus(dir) {
  if (!focusGrp || !focusList.length) return;
  var i = focusList.indexOf(focusGrp);
  if (i < 0) return;
  setCardFlipped(focusGrp, false);   // 切走前把当前卡翻回正面
  var next = focusList[(i + dir + focusList.length) % focusList.length];
  openFocus(next, next.userData.char);
}
function exitFocus() {
  APP.focusChar = null;
  focusGrp = null;
  focusList = [];
  focusDragAccum = 0;
  UI.closePanel(inVault ? '恶人密室' : '自动导览中');
  resetAllFlips();          // 退出鉴赏回到全景，卡片翻回正面
  // 密室里退出鉴赏要回到密室观察位：rig.release() 会直接跳回主展厅的巡航曲线，
  // 那样画面回到主展厅、而密室场景还开着，就成了「正义展厅 + 密室样式」。
  if (inVault) rig.focus(vault.enterPos, vault.enterLook);
  else rig.release();
}
function enterVault() {
  inVault = true;
  vault.open();
  scene.fog.color.setHex(0x2a0a10);      // 密室：暗红雾
  scene.fog.density = 0.010;
  rig.focus(vault.enterPos, vault.enterLook);
  UI.setMode('恶人密室');
  UI.showEntryBtn(false);
  UI.lockLayoutBar(true);                                   // 密室只有一种陈列
  UI.setHint('恶人密室 · 独立场景，返回主馆后可切换展厅');
  document.getElementById('exitVaultBtn').style.display = '';
}
function exitVault() {
  inVault = false;
  vault.close();
  scene.fog.color.setHex(0x060614);      // 主馆：深空蓝雾
  scene.fog.density = 0.0052;
  exitFocus();
  rig.release();
  UI.setMode('自动导览中');
  UI.lockLayoutBar(false);
  UI.setHint(LAYOUTS[currentLayout].hint);
  document.getElementById('exitVaultBtn').style.display = 'none';
}
document.getElementById('exitVaultBtn').addEventListener('click', exitVault);

/* ---------- 主循环 ---------- */
const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  var rawDt = clock.getDelta();          // 真实帧间隔（布局过渡用，低帧率下更快到位）
  var dt = Math.min(rawDt, 0.05);        // 相机与动画用（避免跳变）
  var t = clock.elapsedTime;

  if (state.pinch) {
    camera.fov = Math.max(40, Math.min(70, camera.fov - state.pinch));
    camera.updateProjectionMatrix();
    state.pinch = 0;
  }

  rig.update(dt, state.nx, state.ny);
  if (SHUF.active) {
    updateShuffle(t);                 // 洗牌期间由特效全权接管卡片位姿
  } else {
    layoutManager.update(rawDt, t);

    var kc = 1 - Math.exp(-dt * 1.8);
    villainCards.forEach(function (grp) {
      var d = grp.userData;
      grp.position.y = d.baseY + Math.sin(t * 0.7 + d.phase) * 0.22;
      grp.quaternion.slerp(effectiveQuat(d, t), kc);
    });
  }

  for (var i = 0; i < holoMats.length; i++) holoMats[i].uniforms.uTime.value = t;
  stele.group.rotation.y = t * 0.12;
  stele.glow.material.opacity = 0.55 + Math.sin(t * 1.6) * 0.12;
  APP.gWave *= 0.92;                          // 滑动波动幅度逐帧衰减

  render();
}
animate();

addEventListener('resize', resize);

/* 调试钩子（无副作用） */
window.__HALL = {
  get layout() { return currentLayout; },
  get craft() { return APP.currentCraft; },
  get vault() { return inVault; },
  switchLayout: switchLayout,
  switchCraft: switchCraft,
  heroCards: heroCards,
  villainCards: villainCards,
  camera: camera,
  stele: stele,
  openFocus: openFocus,
  exitFocus: exitFocus,
  cardPos: function (n) { return heroCards[n - 1].position.toArray().map(function (v) { return v.toFixed(1); }).join(','); },
  targetPos: function (n) { return heroCards[n - 1].userData.targetPos.toArray().map(function (v) { return v.toFixed(1); }).join(','); },
  movingCount: function () { return heroCards.filter(function (g) { return g.userData.moving; }).length; },
  unlockVault: function () { orbTrigger.unlocked = true; UI.setMode('密室已开启 · 点击右下角进入'); UI.showEntryBtn(true); return 'unlocked'; },
  shuffle: startShuffle,
  shuffling: function () { return SHUF.active; },
  enterVault: enterVault,
  exitVault: exitVault
};
