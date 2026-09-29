/* state.js —— 跨模块共享的运行时状态
 * cards / features 需要读取入口层的状态（当前工艺、鉴赏中的人物、滑动波动量），
 * 单独抽出来避免反向依赖 main.js。
 */

export const APP = {
  currentCraft: 'standard',   // 当前工艺
  focusChar: null,            // 鉴赏中的人物（null 表示自动导览）
  gWave: 0                    // 左右滑动带来的整体波动量
};

// 是否随包提供各工艺的独立扫描图（assets/flash_prize、assets/code_perm …）。
// 目前只有 standard（普卡原图，左右拼接）/ villains / full 三套，
// 奖闪与冷烫是在普卡上叠加程序化镭射膜，因此这里为 false。
export const CRAFT_SCANS = false;
