/*
 * Tema yardımcıları — TEK palet (indigo / slate).
 *
 * Eski 6 renk paleti kaldırıldı: artık tek nötr accent kullanılıyor.
 * Geriye dönük uyumluluk için fonksiyonlar duruyor; hepsi aynı Tailwind
 * sınıf string'lerini döndürür. Yeni komponentler doğrudan CSS değişkenleri
 * (`var(--accent)`, `bg-app`, vs.) kullanmalı.
 */

const GRADIENT       = 'from-indigo-600 to-indigo-500';
const PANEL_BG       = 'from-indigo-50 to-white dark:from-slate-800 dark:to-slate-900';
const PANEL_BORDER   = 'border-slate-200 dark:border-slate-700';
const PANEL_SHADOW   = 'shadow-slate-200/40 dark:shadow-black/40';
const PANEL_ICON     = 'text-indigo-600 dark:text-indigo-400';
const INNER_CARD     = 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700';
const BADGE_BG       = 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300';
const DIVIDER        = 'border-slate-200 dark:border-slate-700';
const PANEL_TEXT     = {
  primary:   'text-slate-900 dark:text-slate-100',
  secondary: 'text-slate-700 dark:text-slate-300',
  muted:     'text-slate-500 dark:text-slate-400',
};

export const THEME_COLORS = { brand: GRADIENT };

export const getThemeGradient      = () => GRADIENT;
export const getThemeClasses       = () => ({ gradient: GRADIENT });
export const getThemePanelBg       = () => PANEL_BG;
export const getThemePanelBorder   = () => PANEL_BORDER;
export const getThemePanelShadow   = () => PANEL_SHADOW;
export const getThemePanelText     = () => PANEL_TEXT;
export const getThemePanelIcon     = () => PANEL_ICON;
export const getThemeInnerCardBg   = () => INNER_CARD;
export const getThemeBadgeBg       = () => BADGE_BG;
export const getThemeDividerBorder = () => DIVIDER;
