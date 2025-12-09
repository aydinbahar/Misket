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

