/* loader.js —— 卡图加载与缓存
 * 依赖：全局 THREE（vendor/three.min.js）
 */
import { drawCardFrame } from './core.js';

let progressHandler = null;
export function setProgressHandler(fn) { progressHandler = fn; }
function emitProgress(p) { if (progressHandler) progressHandler(p); }

export const texCache = new Map();
const manager = new THREE.LoadingManager();
manager.onProgress = function (url, loaded, total) {
  emitProgress(Math.round(loaded / total * 100));
};
manager.onLoad = function () { emitProgress(100); };
// 卡图全部改走 Image()（中分裁剪需要原始位图），不经过 LoadingManager；
// 若没有任何 texLoader 任务在队，延迟直接报 100% 收起加载屏（幂等）
setTimeout(function () { emitProgress(100); }, 300);
const texLoader = new THREE.TextureLoader(manager);

export function loadTex(url, cb) {
  if (texCache.has(url)) { cb(texCache.get(url)); return; }
  texLoader.load(url, function (tex) {
    tex.encoding = THREE.sRGBEncoding;
    texCache.set(url, tex); cb(tex);
  }, undefined, function () { /* 缺失时保持原纹理 */ });
}

/* 单面原图（只有随包提供的工艺扫描件是单面整图）：整图 + 金框，带缓存。
 * 注意：英雄卡 / 恶人卡的原始卡图都是左右双联的，必须走 loadSplitCard，不能用这个。 */
export function loadCardFace(url, cb) {
  var key = url + '::face';
  if (texCache.has(key)) { cb(texCache.get(key)); return; }
  var img = new Image();
  img.onload = function () {
    var w = img.width, h = img.height;
    var c = document.createElement('canvas'); c.width = w; c.height = h;
    var g = c.getContext('2d');
    g.drawImage(img, 0, 0);
    drawCardFrame(g, w, h);
    var t = new THREE.CanvasTexture(c); t.encoding = THREE.sRGBEncoding;
    texCache.set(key, t); cb(t);
  };
  img.onerror = function () { cb(null); };
  img.src = url;
}

/* 水浒卡原图为左右拼接：左半是正面（人物），右半是背面（信息）。
 * 加载后中分裁剪，正/背面都按正常方向绘制，翻开后即为正向可读。 */
export function loadSplitCard(url, cb) {
  var key = url + '::split';
  if (texCache.has(key)) { cb(texCache.get(key)); return; }
  var img = new Image();
  img.onload = function () {
    var w = img.width / 2, h = img.height;
    // 正面 = 左半；背面 = 右半，均不做镜像
    var cf = document.createElement('canvas'); cf.width = w; cf.height = h;
    var gf = cf.getContext('2d');
    gf.drawImage(img, 0, 0, w, h, 0, 0, w, h);
    drawCardFrame(gf, w, h);
    var tf = new THREE.CanvasTexture(cf); tf.encoding = THREE.sRGBEncoding;
    var cb_ = document.createElement('canvas'); cb_.width = w; cb_.height = h;
    var gb = cb_.getContext('2d');
    gb.drawImage(img, w, 0, w, h, 0, 0, w, h);
    drawCardFrame(gb, w, h);
    var tb = new THREE.CanvasTexture(cb_); tb.encoding = THREE.sRGBEncoding;
    var pair = { front: tf, back: tb };
    texCache.set(key, pair); cb(pair);
  };
  img.onerror = function () { cb(null); };
  img.src = url;
}
