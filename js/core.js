/* core.js —— 渲染核心：场景 / 环境 / 聚义碑 / 相机控制器 / 贴图工具
 * 依赖：全局 THREE（vendor/three.min.js）
 */
export function createCore(container, opts) {
  var lowSpec = !!opts.lowSpec;
  var renderer = new THREE.WebGLRenderer({ antialias: !lowSpec, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, lowSpec ? 1.5 : 2));
  renderer.setSize(innerWidth, innerHeight);
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  container.appendChild(renderer.domElement);

  var scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x060614, 0.0052);

  var camera = new THREE.PerspectiveCamera(55, innerWidth / innerHeight, 0.1, 500);
  camera.position.set(70, 24, 10);

  var composer = null, bloom = null;
  if (!lowSpec && THREE.EffectComposer) {
    composer = new THREE.EffectComposer(renderer);
    composer.addPass(new THREE.RenderPass(scene, camera));
    bloom = new THREE.UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), 0.72, 0.55, 0.78);
    composer.addPass(bloom);
    composer.addPass(new THREE.ShaderPass(THREE.GammaCorrectionShader));
  }

  function resize() {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
    if (composer) composer.setSize(innerWidth, innerHeight);
  }
  function render() {
    if (composer) composer.render(); else renderer.render(scene, camera);
  }
  return { renderer, scene, camera, composer, bloom, resize, render, lowSpec };
}

/* ---------- 资源路径：单文件版由 window.__ASSETS__ 提供内嵌 data URI ---------- */
export function assetUrl(p) {
  if (typeof window !== 'undefined' && window.__ASSETS__ && window.__ASSETS__[p]) return window.__ASSETS__[p];
  return p;
}

/* ---------- 通用贴图工具 ---------- */
export function radialTex(rgb) {
  var c = document.createElement('canvas'); c.width = c.height = 128;
  var g = c.getContext('2d');
  var gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  gr.addColorStop(0, 'rgba(' + rgb + ',.9)');
  gr.addColorStop(.4, 'rgba(' + rgb + ',.28)');
  gr.addColorStop(1, 'rgba(' + rgb + ',0)');
  g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
  var t = new THREE.CanvasTexture(c); t.encoding = THREE.sRGBEncoding; return t;
}

export function canvasTex(w, h, draw) {
  var c = document.createElement('canvas'); c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  var t = new THREE.CanvasTexture(c); t.encoding = THREE.sRGBEncoding; return t;
}

/* 金色画框：盖住原图白边，让卡片像镶了边框。
 * 边框厚度：按短边比例算，但上限压到 12px——太厚会盖住卡背底部那一行小字。 */
export function drawCardFrame(g, w, h) {
  var fw = Math.max(6, Math.min(14, Math.round(Math.min(w, h) * 0.05)));
  g.strokeStyle = '#b8893b'; g.lineWidth = fw;
  g.strokeRect(fw / 2, fw / 2, w - fw, h - fw);
  g.strokeStyle = 'rgba(255,238,180,.95)'; g.lineWidth = Math.max(1.5, fw * 0.16);
  g.strokeRect(fw * 0.92, fw * 0.92, w - fw * 1.84, h - fw * 1.84);
  g.fillStyle = 'rgba(255,230,160,.92)';
  var r = fw * 0.34, m = fw * 0.92;
  [[m, m], [w - m, m], [m, h - m], [w - m, h - m]].forEach(function (p) {
    g.beginPath(); g.arc(p[0], p[1], r, 0, Math.PI * 2); g.fill();
  });
}

/* ---------- 环境：星空 / 地面星盘 ---------- */
export function buildEnvironment(scene, lowSpec) {
  var env = new THREE.Group();

  // 星空
  var N = lowSpec ? 2600 : 6500;
  var pos = new Float32Array(N * 3), col = new Float32Array(N * 3);
  var palette = [[1, 1, 1], [1, .92, .75], [.72, .82, 1], [1, .78, .88]];
  for (var i = 0; i < N; i++) {
    var r = 150 + Math.random() * 130, th = Math.random() * Math.PI * 2;
    var ph = Math.acos(Math.random() * 1.8 - 0.9);
    pos[i * 3] = r * Math.sin(ph) * Math.cos(th);
    pos[i * 3 + 1] = Math.abs(r * Math.cos(ph)) * 0.9 - 12;
    pos[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th);
    var c = palette[(Math.random() * palette.length) | 0], s = .45 + Math.random() * .55;
    col[i * 3] = c[0] * s; col[i * 3 + 1] = c[1] * s; col[i * 3 + 2] = c[2] * s;
  }
  var g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  var stars = new THREE.Points(g, new THREE.PointsMaterial({
    size: 1.15, vertexColors: true, transparent: true, opacity: .9,
    blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true
  }));
  env.add(stars);

  // 地面
  var discTex = canvasTex(1024, 1024, function (g2) {
    var gr = g2.createRadialGradient(512, 512, 0, 512, 512, 512);
    gr.addColorStop(0, '#221a4e'); gr.addColorStop(.45, '#141033'); gr.addColorStop(1, '#05040f');
    g2.fillStyle = gr; g2.fillRect(0, 0, 1024, 1024);
  });
  var disc = new THREE.Mesh(new THREE.CircleGeometry(150, 72), new THREE.MeshBasicMaterial({ map: discTex }));
  disc.rotation.x = -Math.PI / 2; disc.position.y = -0.02; env.add(disc);

  var grid = new THREE.PolarGridHelper(64, 24, 10, 96, 0x8a6a2f, 0x39306a);
  grid.material.transparent = true; grid.material.opacity = 0.20; grid.position.y = 0.01; env.add(grid);
  var grid2 = new THREE.PolarGridHelper(30, 12, 5, 72, 0x6a5426, 0x2c2560);
  grid2.material.transparent = true; grid2.material.opacity = 0.14; grid2.position.y = 0.015; env.add(grid2);

  scene.add(env);
  return { group: env, stars: stars };
}

/* ---------- 聚义碑 ---------- */
export function buildStele(scene) {
  var stele = new THREE.Group();
  var textTex = canvasTex(256, 1024, function (g, w, h) {
    g.clearRect(0, 0, w, h);
    g.font = '600 170px "Songti SC","STSong","SimSun",serif';
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.shadowColor = 'rgba(255,210,120,.95)'; g.shadowBlur = 26;
    g.fillStyle = '#ffe9b0';
    ['替', '天', '行', '道'].forEach(function (ch, i) { g.fillText(ch, 128, 148 + i * 236); });
  });

  var pillar = new THREE.Mesh(new THREE.CylinderGeometry(2.1, 2.5, 15, 8, 1, true),
    new THREE.MeshBasicMaterial({ color: 0x0d0a24, side: THREE.DoubleSide }));
  pillar.position.y = 7.5; stele.add(pillar);

  for (var k = 0; k < 4; k++) {
    var a = k * Math.PI / 2;
    // 文字面板放在柱面外侧，避免被圆柱遮挡/"劈开"
    var p = new THREE.Mesh(new THREE.PlaneGeometry(3.1, 11.6),
      new THREE.MeshBasicMaterial({ map: textTex, transparent: true, side: THREE.DoubleSide }));
    p.position.set(Math.sin(a) * 2.75, 7.5, Math.cos(a) * 2.75);
    p.rotation.y = a; stele.add(p);
  }
  var cap = new THREE.Mesh(new THREE.ConeGeometry(2.2, 1.6, 8), new THREE.MeshBasicMaterial({ color: 0x2a2154 }));
  cap.position.y = 15.8; stele.add(cap);

  // 顶部光球（触发恶人密室的机关）
  var orb = new THREE.Mesh(new THREE.SphereGeometry(0.55, 20, 20), new THREE.MeshBasicMaterial({ color: 0xffdf9e }));
  orb.position.y = 17.3; orb.userData.isOrb = true; stele.add(orb);
  var glow = new THREE.Sprite(new THREE.SpriteMaterial({
    map: radialTex('255,214,130'), transparent: true, opacity: .65,
    blending: THREE.AdditiveBlending, depthWrite: false
  }));
  glow.scale.set(9, 9, 1); glow.position.y = 17.3; stele.add(glow);

  var base = new THREE.Mesh(new THREE.RingGeometry(3.2, 5.6, 48),
    new THREE.MeshBasicMaterial({ color: 0x8a6a2f, transparent: true, opacity: .35, side: THREE.DoubleSide }));
  base.rotation.x = -Math.PI / 2; base.position.y = 0.03; stele.add(base);

  scene.add(stele);
  return { group: stele, orb: orb, glow: glow };
}

/* ---------- 相机控制器 ---------- */
export class CameraRig {
  constructor(camera) {
    this.camera = camera;
    this.curve = null;
    this.u = 0;
    this.period = 130;
    this.mode = 'cruise';           // cruise | focus
    this.curPos = camera.position.clone();
    this.curLook = new THREE.Vector3(0, 8, 0);
    this.focusPos = new THREE.Vector3();
    this.focusLook = new THREE.Vector3();
    this.center = new THREE.Vector3(0, 8.5, 0);
    this.enabled = true;
    this.lastScrub = -1e9;        // 最近一次手动滑动的时间戳（用于暂停自动巡航）
    this._a = new THREE.Vector3(); this._b = new THREE.Vector3();
  }
  setCurve(curve) { this.curve = curve; }
  focus(pos, look) {
    this.mode = 'focus';
    this.focusPos.copy(pos); this.focusLook.copy(look);
  }
  release() { this.mode = 'cruise'; }
  update(dt, nx, ny) {
    if (!this.enabled) return;
    if (this.mode === 'focus') {
      var kF = 1 - Math.exp(-dt * 2.6);
      this.curPos.lerp(this.focusPos, kF);
      this._b.copy(this.focusLook);
      this._b.x += nx * 1.2; this._b.y += -ny * 0.8;
      this.curLook.lerp(this._b, kF);
    } else if (this.curve) {
      if (performance.now() - this.lastScrub > 1400) {
        this.u = (this.u + dt / this.period) % 1;   // 滑动后 1.4s 内不自动前进
      }
      this.curve.getPointAt(this.u, this._a);
      this.curve.getPointAt((this.u + 0.012) % 1, this._b);
      this._b.multiplyScalar(0.72).addScaledVector(this.center, 0.28);
      this._b.x += nx * 5; this._b.y += -ny * 2.5;
      var kC = 1 - Math.exp(-dt * 2.2);
      this.curPos.lerp(this._a, kC);
      this.curLook.lerp(this._b, kC);
    }
    this.camera.position.copy(this.curPos);
    this.camera.lookAt(this.curLook);
  }
}

