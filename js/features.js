/* features.js —— 恶人密室 / 设备能力 / 输入手势
 * 依赖：全局 THREE（vendor/three.min.js）
 */
import { APP } from './state.js';
import { radialTex } from './core.js';

export const VAULT_Y = -26;

export function buildVillainRoom(scene, villainCards) {
  var group = new THREE.Group();
  group.position.y = VAULT_Y;

  // 地面与穹顶
  var floor = new THREE.Mesh(new THREE.CircleGeometry(20, 48),
    new THREE.MeshBasicMaterial({ color: 0x1a0810 }));
  floor.rotation.x = -Math.PI / 2; floor.position.y = 0.02; group.add(floor);
  var ring = new THREE.Mesh(new THREE.RingGeometry(16, 19, 48),
    new THREE.MeshBasicMaterial({ color: 0x8a2020, transparent: true, opacity: .4, side: THREE.DoubleSide }));
  ring.rotation.x = -Math.PI / 2; ring.position.y = 0.05; group.add(ring);
  var dome = new THREE.Mesh(new THREE.SphereGeometry(22, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2),
    new THREE.MeshBasicMaterial({ color: 0x140610, side: THREE.BackSide }));
  group.add(dome);

  // 中央血色光柱
  var beam = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 1.6, 14, 16, 1, true),
    new THREE.MeshBasicMaterial({ color: 0xff3344, transparent: true, opacity: .22, side: THREE.DoubleSide }));
  beam.position.y = 7; group.add(beam);
  var core = new THREE.Mesh(new THREE.SphereGeometry(0.7, 16, 16),
    new THREE.MeshBasicMaterial({ color: 0xff5566 }));
  core.position.y = 0.9; group.add(core);
  var halo = new THREE.Sprite(new THREE.SpriteMaterial({
    map: radialTex('255,70,80'), transparent: true, opacity: .75,
    blending: THREE.AdditiveBlending, depthWrite: false
  }));
  halo.scale.set(16, 16, 1); halo.position.y = 0.9; group.add(halo);

  // 6 张恶人卡排成扇形展墙，全部面向入口（相对密室组坐标）
  villainCards.forEach(function (grp, i) {
    var R = 9;
    var a = (i - (villainCards.length - 1) / 2) * 0.36;   // 扇形张角约 ±52°
    var px = Math.sin(a) * R, pz = Math.cos(a) * R, py = 3;
    grp.position.set(px, py, pz);
    var t = new THREE.Object3D();
    t.position.set(px, py, pz);
    t.lookAt(0, py, 42);            // 朝向入口方向
    grp.quaternion.copy(t.quaternion);
    grp.userData.targetPos.set(px, py, pz);
    grp.userData.targetQuat.copy(t.quaternion);
    grp.userData.baseY = py;
    group.add(grp);
  });

  group.visible = false;
  scene.add(group);

  return {
    group: group,
    open: function () { group.visible = true; },
    close: function () { group.visible = false; },
    enterPos: new THREE.Vector3(0, VAULT_Y + 5.5, 21),
    enterLook: new THREE.Vector3(0, VAULT_Y + 3.2, 6)
  };
}

/* 机关：碑顶光球连点 3 次 */
export class OrbTrigger {
  constructor(onUnlock) { this.count = 0; this.onUnlock = onUnlock; this.cool = 0; this.unlocked = false; }
  tap(now) {
    if (this.unlocked) return 0;
    if (now - this.cool > 2.2) this.count = 0;   // 超过 2.2 秒视为新的一次尝试
    this.cool = now; this.count++;
    if (this.count >= 3) { this.unlocked = true; this.onUnlock(); return 3; }
    return this.count;
  }
}

/* ============ 移动端 / 设备能力 ============ */
export function isLowSpec() {
  var ua = navigator.userAgent || '';
  var mobile = /Android|iPhone|iPad|iPod|Mobile|Windows Phone/i.test(ua);
  var cores = navigator.hardwareConcurrency || 4;
  return mobile || innerWidth < 820 || cores <= 4;
}
export function isTouch() {
  return ('ontouchstart' in window) || (navigator.maxTouchPoints || 0) > 0;
}

/* 触控与陀螺仪：把输入归一化为 nx / ny（-1..1）与 pinch 缩放 */
export function initInput(canvas, state) {
  var startX = 0, startY = 0, lastX = 0, lastY = 0, pinchDist = 0;

  canvas.addEventListener('touchstart', function (e) {
    if (e.touches.length === 1) {
      startX = lastX = e.touches[0].clientX; startY = lastY = e.touches[0].clientY;
      state.dragged = false;
    } else if (e.touches.length === 2) {
      pinchDist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
    }
  }, { passive: true });

  canvas.addEventListener('touchmove', function (e) {
    if (e.touches.length === 1) {
      var dx = e.touches[0].clientX - lastX, dy = e.touches[0].clientY - lastY;
      lastX = e.touches[0].clientX; lastY = e.touches[0].clientY;
      if (Math.hypot(lastX - startX, lastY - startY) > 6) state.dragged = true;
      // 鉴赏模式下手指拖动用于切换卡片（走马灯），不再驱动环视，避免两种手势打架
      if (APP.focusChar) return;
      state.nx = Math.max(-1, Math.min(1, state.nx + dx / innerWidth * 3));
      state.ny = Math.max(-1, Math.min(1, state.ny + dy / innerHeight * 3));
    } else if (e.touches.length === 2) {
      var d = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
      state.pinch = (d - pinchDist) * 0.02; pinchDist = d;
    }
  }, { passive: true });

  // 陀螺仪（iOS 需手势授权，未授权时静默失败）
  window.addEventListener('deviceorientation', function (e) {
    if (e.gamma == null || e.beta == null) return;
    state.nx = Math.max(-1, Math.min(1, e.gamma / 35));
    state.ny = Math.max(-1, Math.min(1, (e.beta - 45) / 45));
  });
}

