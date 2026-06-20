// 家謎サイトのセクション用ピクトグラム（映画上映前の注意アイコン調・フラット・インク単色・透過PNG）。
// 生成は Codex（image_gen）。配置先＝ public/ienazo/icons/。様式は ienazo_site_icons_workplan.md §2。
// 未配置の間は SectionIcon が onError でフォールバックするため、ここを参照するだけでよい。

export const ICONS = {
  aboutImmersive: "/ienazo/icons/ic_about_immersive.png", // 没入型の謎解き体験
  aboutHome: "/ienazo/icons/ic_about_home.png", // おうちで完結
  aboutTime: "/ienazo/icons/ic_about_time.png", // 選べる体験時間
  stepSelect: "/ienazo/icons/ic_step_select.png", // STEP01 作品を選ぶ
  stepPlay: "/ienazo/icons/ic_step_play.png", // STEP02 ブラウザで遊ぶ
  stepSave: "/ienazo/icons/ic_step_save.png", // STEP03 保存して再開
} as const;
