/* layouts.js —— 三种展厅布局与切换调度
 * 依赖：全局 THREE（vendor/three.min.js）
 */
import { canvasTex, radialTex } from './core.js';
import { effectiveQuat } from './cards.js';

export function faceQuat(pos, target) {
  var t = new THREE.Object3D();
  t.position.copy(pos); t.lookAt(target);
  return t.quaternion.clone();
}
export var V = function (x, y, z) { return new THREE.Vector3(x, y, z); };

/* ============ ① 天罡地煞双星环 ============ */
export const dualRing = {
  id: 'dualRing',
  name: '天罡地煞双星环',
  hint: '天罡悬于天 · 地煞铺于地',
  center: [0, 8.5, 0],
  hideStele: false,
  place(cards) {
    cards.forEach(function (grp) {
      var c = grp.userData.char;
      var isTG = c.n <= 36;
      var R = isTG ? 26 : 52, Y = isTG ? 13 : 4.5;
      var idx = isTG ? c.n - 1 : c.n - 37;
      var total = isTG ? 36 : 72;
      var a = (idx / total) * Math.PI * 2;
      var px = Math.sin(a) * R, pz = Math.cos(a) * R;
      grp.userData.targetPos.set(px, Y, pz);
      grp.userData.baseY = Y;
      grp.userData.targetQuat.copy(faceQuat(V(px, Y, pz), V(px * 2, Y, pz * 2)));
    });
  },
  cruise() {
    return new THREE.CatmullRomCurve3([
      V(74, 26, 6), V(60, 11, 28), V(46, 7, 46), V(14, 7.5, 60), V(-32, 7, 52),
      V(-58, 11, 16), V(-46, 16, -18), V(-22, 16, -27), V(0, 17.5, -36), V(22, 16, -27),
      V(34, 13.5, -8), V(28, 12, 18), V(6, 10, 34), V(28, 14, 40), V(58, 22, 24)
    ], true, 'catmullrom', 0.5);
  },
  decor() { return null; }
};

/* ============ ② 悬浮岛屿 ============ */
export const ISLAND_COUNT = 6, PER_ISLAND = 18;
export const islands = {
  id: 'islands',
  name: '悬浮岛屿',
  hint: '水泊梁山 · 六岛聚义',
  center: [0, 10, 0],
  hideStele: false,
  place(cards) {
    cards.forEach(function (grp, i) {
      var isle = Math.floor(i / PER_ISLAND);
      var k = i % PER_ISLAND;
      var ringR = 42 + (isle % 2) * 8;
      var ang = (isle / ISLAND_COUNT) * Math.PI * 2;
      var cx = Math.sin(ang) * ringR, cz = Math.cos(ang) * ringR;
      var cy = 7 + ((isle * 3) % 5);
      var a = (k / PER_ISLAND) * Math.PI * 2;
      var px = cx + Math.sin(a) * 12;
      var pz = cz + Math.cos(a) * 12;
      var py = cy + 3.6 + Math.sin(k * 0.9) * 0.5;   // 抬高：保证浮动到最低点时也不沉入岛盘（盘顶 cy+0.4）
      grp.userData.targetPos.set(px, py, pz);
      grp.userData.baseY = py;
      grp.userData.targetQuat.copy(faceQuat(V(px, py, pz), V(cx + (px - cx) * 3, py, cz + (pz - cz) * 3)));
    });
  },
  cruise() {
    var pts = [];
    for (var i = 0; i < ISLAND_COUNT; i++) {
      var ang = (i / ISLAND_COUNT) * Math.PI * 2 + 0.35;
      var R = 42 + (i % 2) * 8;
      pts.push(V(Math.sin(ang) * (R + 18), 11 + (i % 3) * 3, Math.cos(ang) * (R + 18)));
    }
    pts.push(V(0, 30, 0));
    return new THREE.CatmullRomCurve3(pts, true, 'catmullrom', 0.5);
  },
  decor(scene) {
    var g = new THREE.Group();
    for (var i = 0; i < ISLAND_COUNT; i++) {
      var ang = (i / ISLAND_COUNT) * Math.PI * 2;
      var R = 42 + (i % 2) * 8;
      var x = Math.sin(ang) * R, z = Math.cos(ang) * R, y = 7 + ((i * 3) % 5);
      var top = new THREE.Mesh(new THREE.CylinderGeometry(14, 13, 0.8, 28),
        new THREE.MeshBasicMaterial({ color: 0x150f34 }));
      top.position.set(x, y, z); g.add(top);
      var rim = new THREE.Mesh(new THREE.RingGeometry(13, 14.4, 56),
        new THREE.MeshBasicMaterial({ color: 0x8a6a2f, transparent: true, opacity: .5, side: THREE.DoubleSide }));
      rim.rotation.x = -Math.PI / 2; rim.position.set(x, y + 0.4, z); g.add(rim);
      var rock = new THREE.Mesh(new THREE.ConeGeometry(11, 9, 20),
        new THREE.MeshBasicMaterial({ color: 0x090718 }));
      rock.position.set(x, y - 4.2, z); rock.rotation.x = Math.PI; g.add(rock);
      var halo = new THREE.Sprite(new THREE.SpriteMaterial({
        map: radialTex('150,130,255'), transparent: true, opacity: .3,
        blending: THREE.AdditiveBlending, depthWrite: false
      }));
      halo.scale.set(30, 18, 1); halo.position.set(x, y - 3, z); g.add(halo);
    }
    scene.add(g);
    return g;
  }
};

/* ============ ③ 悬浮长廊（螺旋） ============ */
export const TURNS = 3, TOP_Y = 42;
export const corridor = {
  id: 'corridor',
  name: '悬浮长廊',
  hint: '螺旋上行 · 步步登堂',
  center: [0, 20, 0],
  hideStele: true,
  place(cards) {
    var n = cards.length;
    cards.forEach(function (grp, i) {
      var t = i / n;
      var a = t * Math.PI * 2 * TURNS;
      var R = 22 + t * 8;
      var px = Math.sin(a) * R, pz = Math.cos(a) * R, py = 3.8 + t * TOP_Y;
      grp.userData.targetPos.set(px, py, pz);
      grp.userData.baseY = py;
      // 朝向中轴
      grp.userData.targetQuat.copy(faceQuat(V(px, py, pz), V(0, py, 0)));
    });
  },
  cruise() {
    var pts = [], n = 14;
    for (var i = 0; i < n; i++) {
      var t = i / n;
      var a = t * Math.PI * 2 * TURNS;
      var R = 22 + t * 8;
      pts.push(V(Math.sin(a) * R, 4.2 + t * TOP_Y, Math.cos(a) * R));
    }
    return new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.5);
  },
  decor(scene) {
    var g = new THREE.Group();
    // 中轴光柱
    var axis = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, TOP_Y + 6, 12),
      new THREE.MeshBasicMaterial({ color: 0x2a2154 }));
    axis.position.y = (TOP_Y + 6) / 2; g.add(axis);
    var core = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, TOP_Y + 6, 8),
      new THREE.MeshBasicMaterial({ color: 0xffdf9e }));
    core.position.y = (TOP_Y + 6) / 2; g.add(core);
    // 螺旋导引线
    var pts = [];
    for (var i = 0; i <= 120; i++) {
      var t = i / 120;
      var a = t * Math.PI * 2 * TURNS, R = 22 + t * 8;
      pts.push(V(Math.sin(a) * R, 2.2 + t * TOP_Y, Math.cos(a) * R));
    }
    var line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),
      new THREE.LineBasicMaterial({ color: 0x8a6a2f, transparent: true, opacity: .45 }));
    g.add(line);
    // 中轴光柱顶部标注（纯装饰光轴，便于理解）
    var labelTex = canvasTex(320, 64, function (g2, w, h) {
      g2.clearRect(0, 0, w, h);
      g2.font = '600 30px "Songti SC","STSong","SimSun",serif';
      g2.textAlign = 'center'; g2.textBaseline = 'middle';
      g2.fillStyle = 'rgba(216,181,106,.92)';
      g2.shadowColor = 'rgba(255,210,120,.85)'; g2.shadowBlur = 12;
      g2.fillText('中轴光柱（装饰光轴）', w / 2, h / 2);
    });
    var label = new THREE.Sprite(new THREE.SpriteMaterial({ map: labelTex, transparent: true, depthWrite: false }));
    label.scale.set(12, 2.4, 1); label.position.set(0, TOP_Y + 5, 0); g.add(label);
    scene.add(g);
    return g;
  }
};

export const LAYOUTS = { dualRing, islands, corridor };
export const LAYOUT_ORDER = ['dualRing', 'islands', 'corridor'];

/* ---------- 布局切换调度 ---------- */
export class LayoutManager {
  constructor(scene, cards, rig, isVillainCard, stele) {
    this.scene = scene; this.cards = cards; this.rig = rig;
    this.current = null; this.decorGroup = null;
    this.stele = stele || null;
    this.isVillainCard = isVillainCard || function () { return false; };
  }
  apply(id) {
    var L = LAYOUTS[id]; if (!L) return;
    if (this.decorGroup) { this.scene.remove(this.decorGroup); this.decorGroup = null; }
    var heroCards = this.cards.filter(function (g) { return !this.isVillainCard(g); }, this);
    L.place(heroCards);
    this.decorGroup = L.decor(this.scene);
    this.rig.setCurve(L.cruise());
    this.rig.u = 0;
    if (L.center) this.rig.center.set(L.center[0], L.center[1], L.center[2]);
    if (this.stele) this.stele.group.visible = !L.hideStele;
    this.current = id;
    // 错峰过渡：用绝对时间戳，与帧率无关
    var now = performance.now();
    this.cards.forEach(function (g, i) {
      g.userData.moving = true;
      g.userData.moveStartAt = now + i * 12;
    });
    return L;
  }
  update(dt, t) {
    var k = 1 - Math.exp(-dt * 1.8);
    var now = performance.now();
    this.cards.forEach(function (grp) {
      var d = grp.userData;
      if (d.moveStartAt && now < d.moveStartAt) return;
      var eff = effectiveQuat(d, t);
      if (d.moving) {
        grp.position.lerp(d.targetPos, k);
        grp.quaternion.slerp(eff, k);
        if (grp.position.distanceTo(d.targetPos) < 0.03) d.moving = false;
      } else {
        grp.position.y = d.targetPos.y + Math.sin(t * 0.7 + d.phase) * 0.22;
        grp.quaternion.slerp(eff, k);
      }
    });
  }
}

