/* cards.js —— 卡牌构建与四类工艺材质
 * 依赖：全局 THREE（vendor/three.min.js）
 */
import { APP, CRAFT_SCANS } from './state.js';
import { assetUrl, drawCardFrame, radialTex } from './core.js';
import { loadSplitCard, loadCardFace } from './loader.js';

export const CRAFTS = {
  standard: {
    label: '普卡', dir: 'standard',
    strength: 0.0, fresnelPow: 3.0, bandMix: 0.0, stripe: 10, speed: 0.0,
    tint: [1.0, 0.98, 0.92], glow: '235,225,200', glowOpacity: 0.0,
    desc: '无镭射 · 哑光纸感（不闪）'
  },
  flash_prize: {
    label: '奖闪（镭射）', dir: 'flash_prize',
    strength: 1.0, fresnelPow: 2.0, bandMix: 0.35, stripe: 26, speed: 0.95,
    tint: [1.0, 1.0, 1.0], glow: '255,205,115', glowOpacity: 0.55,
    desc: '硬闪镭射 · 视角彩虹流光'
  },
  code_perm: {
    label: '冷烫', dir: 'code_perm',
    strength: 0.78, fresnelPow: 4.5, bandMix: 0.08, stripe: 14, speed: 0.5,
    tint: [0.85, 0.92, 1.0], glow: '175,205,255', glowOpacity: 0.36,
    desc: '烫金烫银 · 冷色金属锐光'
  },
  character_art: {
    label: '立绘', dir: 'character_art',
    strength: 0.26, fresnelPow: 2.5, bandMix: 0.05, stripe: 8, speed: 0.28,
    tint: [1.0, 0.96, 0.9], glow: '255,235,205', glowOpacity: 0.22,
    desc: '无框原画 · 极柔光晕'
  }
};

export const CARD_W = 2.35, CARD_H = 3.5, CARD_T = 0.06;

/* ---------- 卡背（程序生成） ---------- */
export let _backTex = null;
export function backTexture() { return backTextureFor(null); }

/* 卡背：按人物生成（排名 / 星位 / 绰号 / 姓名）。
 * 卡片右键翻转是绕本地 Y 轴转 180°；实测翻开后背面从外侧看就是正向可读，
 * 因此卡背纹理按正常方向绘制即可，不要做预镜像。 */
export function backTextureFor(char) {
  if (!char) {
    if (_backTex) return _backTex;
  }
  var c = document.createElement('canvas'); c.width = 512; c.height = 380;
  var g = c.getContext('2d');
  var grad = g.createLinearGradient(0, 0, 512, 380);
  grad.addColorStop(0, '#241a52'); grad.addColorStop(.5, '#120c30'); grad.addColorStop(1, '#2b1d5e');
  g.fillStyle = grad; g.fillRect(0, 0, 512, 380);
  g.strokeStyle = 'rgba(216,181,106,.85)'; g.lineWidth = 3; g.strokeRect(10, 10, 492, 360);
  g.strokeStyle = 'rgba(216,181,106,.4)'; g.lineWidth = 1; g.strokeRect(20, 20, 472, 340);
  g.textAlign = 'center';
  if (char) {
    g.fillStyle = 'rgba(232,196,118,.92)';
    g.font = '600 22px "Songti SC","STSong","SimSun",serif';
    var rank = char.kind === 'villain' ? ('六大恶人 · ' + (char.displayId || '')) : ('梁山第 ' + String(char.n).padStart(3, '0') + ' 位');
    g.fillText(rank, 256, 54);
    g.font = '600 18px "Songti SC","STSong","SimSun",serif';
    var tier = char.kind === 'villain' ? '奸佞之徒' : (char.n <= 36 ? '三十六天罡' : '七十二地煞');
    g.fillText(tier + ' · ' + char.star, 256, 82);
  }
  g.save(); g.translate(256, 196);
  g.strokeStyle = 'rgba(216,181,106,.55)'; g.lineWidth = 2;
  g.beginPath(); g.arc(0, 0, 86, 0, Math.PI * 2); g.stroke();
  g.beginPath(); g.arc(0, 0, 72, 0, Math.PI * 2); g.stroke();
  g.font = '600 60px "Songti SC","STSong","SimSun",serif';
  g.textBaseline = 'middle';
  g.fillStyle = '#e8c476'; g.shadowColor = 'rgba(255,210,120,.8)'; g.shadowBlur = 14;
  g.fillText('水滸', 0, 4);
  g.restore();
  if (char) {
    g.shadowBlur = 0;
    g.fillStyle = '#f0e8d8'; g.font = '600 40px "Songti SC","STSong","SimSun",serif';
    g.fillText(char.nick || '', 256, 302);
    g.fillStyle = 'rgba(232,196,118,.95)'; g.font = '700 30px "Songti SC","STSong","SimSun",serif';
    g.fillText(char.name, 256, 340);
  } else {
    g.font = '18px serif'; g.fillStyle = 'rgba(232,196,118,.7)'; g.textAlign = 'center';
    g.fillText('一百单八将 · 星穹卡馆', 256, 342);
  }
  drawCardFrame(g, 512, 380);
  var t = new THREE.CanvasTexture(c); t.encoding = THREE.sRGBEncoding;
  if (!char) _backTex = t;
  return t;
}

/* 镭射/冷烫卡背面：独立的全息箔背（不再使用原图右半）。
 * 程序化生成彩虹斜条 + 扫描线 + 水滸印 + 工艺标识。 */
export let _laserBackTex = {};
export function laserBackTexture(craftId) {
  if (_laserBackTex[craftId]) return _laserBackTex[craftId];
  var craft = CRAFTS[craftId] || CRAFTS.flash_prize;
  var w = 512, h = 380;
  var c = document.createElement('canvas'); c.width = w; c.height = h;
  var g = c.getContext('2d');
  // 深色全息底
  var grad = g.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, '#0b0920'); grad.addColorStop(0.5, '#151030'); grad.addColorStop(1, '#0b0920');
  g.fillStyle = grad; g.fillRect(0, 0, w, h);
  // 对角彩虹条
  g.save(); g.rotate(-Math.PI / 6);
  for (var i = -8; i < 18; i++) {
    var hue = (i * 32 + 200) % 360;
    g.fillStyle = 'hsla(' + hue + ', 78%, 58%, 0.10)';
    g.fillRect(i * 42 - 180, -400, 16, 1200);
  }
  g.restore();
  // 细密扫描线
  g.fillStyle = 'rgba(255,255,255,0.025)';
  for (var y = 0; y < h; y += 3) g.fillRect(0, y, w, 1);
  // 外框
  g.strokeStyle = 'rgba(216,181,106,.82)'; g.lineWidth = 3; g.strokeRect(10, 10, 492, 360);
  g.strokeStyle = 'rgba(216,181,106,.32)'; g.lineWidth = 1; g.strokeRect(20, 20, 472, 340);
  // 中央水滸印
  g.save(); g.translate(w / 2, h / 2 - 10);
  g.strokeStyle = 'rgba(255,255,255,.22)'; g.lineWidth = 2;
  g.beginPath(); g.arc(0, 0, 86, 0, Math.PI * 2); g.stroke();
  g.beginPath(); g.arc(0, 0, 72, 0, Math.PI * 2); g.stroke();
  g.font = '600 64px "Songti SC","STSong","SimSun",serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillStyle = '#e8c476'; g.shadowColor = 'rgba(255,210,120,.8)'; g.shadowBlur = 16;
  g.fillText('水滸', 0, 0);
  g.restore();
  // 工艺名
  g.shadowBlur = 0;
  g.font = 'bold 36px "Songti SC","STSong",serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillStyle = 'rgba(255,255,255,.92)';
  g.fillText(craft.label.replace('（镭射）', ''), w / 2, h - 58);
  g.font = '18px serif'; g.fillStyle = 'rgba(200,200,220,.6)';
  g.fillText('星穹卡馆 · HOLO FOIL', w / 2, h - 26);
  drawCardFrame(g, w, h);
  var t = new THREE.CanvasTexture(c); t.encoding = THREE.sRGBEncoding;
  _laserBackTex[craftId] = t;
  return t;
}

/* 翻转 / 微摆动：返回卡片应朝向的有效四元数（含 180° 翻转与轻微漂浮波动） */
export var _UP = new THREE.Vector3(0, 1, 0), _ZAX = new THREE.Vector3(0, 0, 1);
export var _flipQ = new THREE.Quaternion(), _wobQ = new THREE.Quaternion(), _effQ = new THREE.Quaternion();
export function effectiveQuat(d, t) {
  _effQ.copy(d.targetQuat);
  if (d.flipped) { _flipQ.setFromAxisAngle(_UP, Math.PI); _effQ.multiply(_flipQ); }
  var wob = Math.sin(t * 0.5 + d.phase) * 0.028 + APP.gWave * 0.14 * Math.sin(d.phase * 2.0 + t * 3.0);
  _wobQ.setFromAxisAngle(_ZAX, wob); _effQ.multiply(_wobQ);
  return _effQ;
}

/* ---------- 流光 shader（参数化） ---------- */
export function holoMaterial(craft, phase) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 }, uPhase: { value: phase },
      uStrength: { value: craft.strength },
      uFresnelPow: { value: craft.fresnelPow },
      uBandMix: { value: craft.bandMix },
      uStripe: { value: craft.stripe },
      uSpeed: { value: craft.speed },
      uTint: { value: new THREE.Vector3(craft.tint[0], craft.tint[1], craft.tint[2]) }
    },
    vertexShader:
      'varying vec3 vN; varying vec3 vV; varying vec2 vUv;\n' +
      'void main(){ vUv = uv;\n' +
      '  vec4 wp = modelMatrix * vec4(position, 1.0);\n' +
      '  vN = normalize(mat3(modelMatrix) * normal);\n' +
      '  vV = cameraPosition - wp.xyz;\n' +
      '  gl_Position = projectionMatrix * viewMatrix * wp; }',
    fragmentShader:
      'uniform float uTime, uPhase, uStrength, uFresnelPow, uBandMix, uStripe, uSpeed;\n' +
      'uniform vec3 uTint;\n' +
      'varying vec3 vN; varying vec3 vV; varying vec2 vUv;\n' +
      'void main(){\n' +
      '  vec3 N = normalize(vN); vec3 V = normalize(vV);\n' +
      '  float fres = pow(1.0 - abs(dot(N, V)), uFresnelPow);\n' +
      '  float band = sin(vUv.y * uStripe + uTime * uSpeed + fres * 12.0 + uPhase);\n' +
      '  float band2 = sin((vUv.x + vUv.y) * uStripe * 0.6 - uTime * uSpeed * 0.7 + uPhase * 1.7);\n' +
      '  vec3 rainbow = 0.5 + 0.5 * cos(6.2832 * (fres * 1.6 + band * uBandMix + band2 * 0.15) + vec3(0.0, 2.1, 4.2));\n' +
      '  float scan = 0.5 + 0.5 * sin(vUv.y * 150.0 - uTime * 2.2);\n' +
      '  float glit = step(0.93, fract(sin(dot(floor(vUv * 90.0), vec2(12.99, 78.23)) + uTime * 0.35) * 43758.5453));\n' +
      '  float a = (fres * 0.5 + max(band, 0.0) * uBandMix * 0.3 + max(band2, 0.0) * 0.04 + scan * 0.05 + glit * 0.6) * uStrength;\n' +
      '  vec3 col = rainbow * uTint + glit * vec3(1.0) * 0.6;\n' +
      '  gl_FragColor = vec4(col, a * 0.7); }',
    transparent: true, blending: THREE.AdditiveBlending, depthWrite: false
  });
}

/* ---------- 名牌 sprite ---------- */
export function nameSprite(char, isTG, isVillain) {
  var c = document.createElement('canvas'); c.width = 360; c.height = 84;
  var g = c.getContext('2d');
  g.font = '600 34px "Songti SC","STSong","SimSun",serif';
  g.textAlign = 'center'; g.textBaseline = 'middle';
  g.shadowColor = 'rgba(0,0,0,.9)'; g.shadowBlur = 7;
  g.fillStyle = isVillain ? '#ffb3b3' : (isTG ? '#ffe4ac' : '#d7e2ff');
  var label = char.kind === 'villain'
    ? (char.displayId + ' ' + char.name)
    : (String(char.n).padStart(3, '0') + ' ' + char.nick + '·' + char.name);
  g.fillText(label, 180, 42);
  var s = new THREE.Sprite(new THREE.SpriteMaterial({
    map: new THREE.CanvasTexture(c), transparent: true, depthWrite: false
  }));
  s.scale.set(2.6, 0.6, 1); s.position.y = 2.05;
  return s;
}

/* ---------- 单张卡 ---------- */
export function createCard(char, frontTex, craftId) {
  var craft = CRAFTS[craftId] || CRAFTS.standard;
  var isTG = char.kind === 'hero' && char.n <= 36;
  var isVillain = char.kind === 'villain';
  var isLaser = craftId === 'flash_prize' || craftId === 'code_perm';

  var grp = new THREE.Group();
  var edge = new THREE.MeshLambertMaterial({ color: 0x0a0818 });
  var backTex = isLaser ? laserBackTexture(craftId) : backTextureFor(char);
  var box = new THREE.Mesh(new THREE.BoxGeometry(CARD_W, CARD_H, CARD_T), [
    edge, edge, edge, edge,
    new THREE.MeshBasicMaterial({ map: frontTex }),
    new THREE.MeshBasicMaterial({ map: backTex })
  ]);
  box.userData.char = char; grp.add(box);

  // 隐形热区（大于卡面 35%，提升点击容错）
  var hit = new THREE.Mesh(new THREE.PlaneGeometry(CARD_W * 1.35, CARD_H * 1.35),
    new THREE.MeshBasicMaterial({ visible: false }));
  hit.position.z = 0.05; hit.userData.char = char; grp.add(hit);

  var holoMat = holoMaterial(craft, Math.random() * 6.28);
  var holo = new THREE.Mesh(new THREE.PlaneGeometry(CARD_W, CARD_H), holoMat);
  holo.position.z = CARD_T / 2 + 0.015; grp.add(holo);

  var glow = new THREE.Sprite(new THREE.SpriteMaterial({
    map: radialTex(isVillain ? '255,120,120' : (isTG ? '255,205,115' : '135,170,255')),
    transparent: true, opacity: craft.glowOpacity,
    blending: THREE.AdditiveBlending, depthWrite: false
  }));
  glow.scale.set(5.5, 7.5, 1); glow.position.z = -0.8; grp.add(glow);

  grp.add(nameSprite(char, isTG, isVillain));

  grp.userData = {
    char: char, mesh: box, hit: hit, holoMat: holoMat, glow: glow,
    phase: Math.random() * 6.28,
    targetPos: new THREE.Vector3(), targetQuat: new THREE.Quaternion(),
    baseY: 0, moving: false, flipped: false, craftGlow: craft.glowOpacity
  };
  return grp;
}

/* ---------- 切换工艺：重绑纹理 + 过渡 shader 参数 ---------- */
export function applyCraft(cards, craftId, loadTexture) {
  var craft = CRAFTS[craftId] || CRAFTS.standard;
  var isLaser = craftId === 'flash_prize' || craftId === 'code_perm';
  cards.forEach(function (grp) {
    var d = grp.userData;
    var isVillain = d.char.kind === 'villain';
    // 英雄卡与恶人卡的原图都是「人物面 + 卡背面」左右拼接的双联图
    var src = isVillain
      ? assetUrl('assets/villains/' + d.char.n + '.webp')
      : assetUrl('assets/standard/' + d.char.n + '.webp');
    /* 正面：必须中分裁剪只取左半人物面，整图直贴会把两个面挤在一张卡上。
     * 只有随包提供该工艺的独立扫描图时才走整图加载。 */
    if (CRAFT_SCANS && craftId !== 'standard' && !isVillain) {
      loadCardFace(assetUrl('assets/' + craft.dir + '/' + d.char.n + '.webp'), function (tex) {
        if (!tex) return;
        d.mesh.material[4].map = tex;
        d.mesh.material[4].needsUpdate = true;
      });
    } else {
      loadSplitCard(src, function (pair) {
        if (!pair) return;
        d.mesh.material[4].map = pair.front;
        d.mesh.material[4].needsUpdate = true;
      });
    }
    // 背面：镭射/冷烫使用独立全息箔背；普卡/立绘恢复原图右半（该卡自身的卡背）
    if (isLaser) {
      d.mesh.material[5].map = laserBackTexture(craftId);
      d.mesh.material[5].needsUpdate = true;
    } else {
      loadSplitCard(src, function (pair) {
        if (!pair || APP.currentCraft !== craftId) return;   // 工艺已再次切换，丢弃过期回调
        d.mesh.material[5].map = pair.back;
        d.mesh.material[5].needsUpdate = true;
      });
    }
    d.holoMat.uniforms.uStrength.value = craft.strength;
    d.holoMat.uniforms.uFresnelPow.value = craft.fresnelPow;
    d.holoMat.uniforms.uBandMix.value = craft.bandMix;
    d.holoMat.uniforms.uStripe.value = craft.stripe;
    d.holoMat.uniforms.uSpeed.value = craft.speed;
    d.holoMat.uniforms.uTint.value.set(craft.tint[0], craft.tint[1], craft.tint[2]);
    d.craftGlow = craft.glowOpacity;
    if (!d.flipped) d.glow.material.opacity = craft.glowOpacity;
  });
}

