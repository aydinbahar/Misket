// Theme color mappings
export const THEME_COLORS = {
  purple: {
    gradient: 'from-purple-500 to-pink-500',
    primary: 'purple-500',
    secondary: 'pink-500',
    text: 'purple-600',
    bg: 'purple-50',
    border: 'purple-200'
  },
  blue: {
    gradient: 'from-blue-500 to-cyan-500',
    primary: 'blue-500',
    secondary: 'cyan-500',
    text: 'blue-600',
    bg: 'blue-50',
    border: 'blue-200'
  },
  green: {
    gradient: 'from-green-500 to-emerald-500',
    primary: 'green-500',
    secondary: 'emerald-500',
    text: 'green-600',
    bg: 'green-50',
    border: 'green-200'
  },
  orange: {
    gradient: 'from-orange-500 to-red-500',
    primary: 'orange-500',
    secondary: 'red-500',
    text: 'orange-600',
    bg: 'orange-50',
    border: 'orange-200'
  },
  pink: {
    gradient: 'from-pink-500 to-rose-500',
    primary: 'pink-500',
    secondary: 'rose-500',
    text: 'pink-600',
    bg: 'pink-50',
    border: 'pink-200'
  },
  indigo: {
    gradient: 'from-indigo-500 to-purple-500',
    primary: 'indigo-500',
    secondary: 'purple-500',
    text: 'indigo-600',
    bg: 'indigo-50',
    border: 'indigo-200'
  }
};

export const getThemeGradient = (theme = 'purple') => {
  return THEME_COLORS[theme]?.gradient || THEME_COLORS.purple.gradient;
};

export const getThemeClasses = (theme = 'purple') => {
  return THEME_COLORS[theme] || THEME_COLORS.purple;
};

// Dark mode panel background gradients
export const getThemePanelBg = (theme = 'purple') => {
  const panelBgs = {
    purple: 'from-purple-950/60 via-pink-950/50 to-purple-950/60',
    blue: 'from-blue-950/60 via-cyan-950/50 to-blue-950/60',
    green: 'from-green-950/60 via-emerald-950/50 to-green-950/60',
    orange: 'from-orange-950/60 via-red-950/50 to-orange-950/60',
    pink: 'from-pink-950/60 via-rose-950/50 to-pink-950/60',
    indigo: 'from-indigo-950/60 via-purple-950/50 to-indigo-950/60'
  };
  return panelBgs[theme] || panelBgs.purple;
};

// Dark mode panel borders
export const getThemePanelBorder = (theme = 'purple') => {
  const panelBorders = {
    purple: 'border-purple-600/40',
    blue: 'border-blue-600/40',
    green: 'border-green-600/40',
    orange: 'border-orange-600/40',
    pink: 'border-pink-600/40',
    indigo: 'border-indigo-600/40'
  };
  return panelBorders[theme] || panelBorders.purple;
};

// Dark mode divider borders (lighter for internal dividers)
export const getThemeDividerBorder = (theme = 'purple') => {
  const dividerBorders = {
    purple: 'border-purple-700/30',
    blue: 'border-blue-700/30',
    green: 'border-green-700/30',
    orange: 'border-orange-700/30',
    pink: 'border-pink-700/30',
    indigo: 'border-indigo-700/30'
  };
  return dividerBorders[theme] || dividerBorders.purple;
};

// Dark mode panel shadows
export const getThemePanelShadow = (theme = 'purple') => {
  const panelShadows = {
    purple: 'shadow-purple-900/20',
    blue: 'shadow-blue-900/20',
    green: 'shadow-green-900/20',
    orange: 'shadow-orange-900/20',
    pink: 'shadow-pink-900/20',
    indigo: 'shadow-indigo-900/20'
  };
  return panelShadows[theme] || panelShadows.purple;
};

// Dark mode text colors for panels
export const getThemePanelText = (theme = 'purple') => {
  const panelTexts = {
    purple: { primary: 'text-purple-200', secondary: 'text-purple-300', muted: 'text-purple-400' },
    blue: { primary: 'text-blue-200', secondary: 'text-blue-300', muted: 'text-blue-400' },
    green: { primary: 'text-green-200', secondary: 'text-green-300', muted: 'text-green-400' },
    orange: { primary: 'text-orange-200', secondary: 'text-orange-300', muted: 'text-orange-400' },
    pink: { primary: 'text-pink-200', secondary: 'text-pink-300', muted: 'text-pink-400' },
    indigo: { primary: 'text-indigo-200', secondary: 'text-indigo-300', muted: 'text-indigo-400' }
  };
  return panelTexts[theme] || panelTexts.purple;
};

// Dark mode icon colors for panels
export const getThemePanelIcon = (theme = 'purple') => {
  const panelIcons = {
    purple: 'text-purple-400',
    blue: 'text-blue-400',
    green: 'text-green-400',
    orange: 'text-orange-400',
    pink: 'text-pink-400',
    indigo: 'text-indigo-400'
  };
  return panelIcons[theme] || panelIcons.purple;
};

// Dark mode inner card backgrounds
export const getThemeInnerCardBg = (theme = 'purple') => {
  const innerCardBgs = {
    purple: 'bg-purple-900/30 border-purple-700/50',
    blue: 'bg-blue-900/30 border-blue-700/50',
    green: 'bg-green-900/30 border-green-700/50',
    orange: 'bg-orange-900/30 border-orange-700/50',
    pink: 'bg-pink-900/30 border-pink-700/50',
    indigo: 'bg-indigo-900/30 border-indigo-700/50'
  };
  return innerCardBgs[theme] || innerCardBgs.purple;
};

// Dark mode badge backgrounds
export const getThemeBadgeBg = (theme = 'purple') => {
  const badgeBgs = {
    purple: 'bg-purple-900/40',
    blue: 'bg-blue-900/40',
    green: 'bg-green-900/40',
    orange: 'bg-orange-900/40',
    pink: 'bg-pink-900/40',
    indigo: 'bg-indigo-900/40'
  };
  return badgeBgs[theme] || badgeBgs.purple;
};

