/**
 * Central Theme Tokens for Light/Dark Mode
 * 
 * This file defines all color tokens used throughout the application.
 * All components should use these tokens instead of hard-coded colors.
 */

export const themeTokens = {
  light: {
    // Backgrounds
    bg: {
      body: 'bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50',
      surface: 'bg-white',
      surfaceSubtle: 'bg-gray-50',
      card: 'bg-white',
      cardHover: 'bg-white',
      nav: 'bg-white/90',
      input: 'bg-white',
      disabled: 'bg-gray-100',
    },
    // Text colors
    text: {
      primary: 'text-gray-900',      // Main text - very dark for high contrast
      secondary: 'text-gray-700',     // Secondary text - dark gray
      muted: 'text-gray-600',         // Muted text - medium gray
      inverted: 'text-white',         // Text on colored backgrounds
      link: 'text-blue-600',
      linkHover: 'text-blue-700',
    },
    // Borders
    border: {
      default: 'border-gray-200',
      hover: 'border-gray-300',
      focus: 'border-purple-500',
      card: 'border-gray-200',
    },
    // Buttons
    button: {
      primary: {
        bg: 'bg-gradient-to-r from-purple-500 to-pink-500',
        text: 'text-white',
        hover: 'hover:from-purple-600 hover:to-pink-600',
      },
      secondary: {
        bg: 'bg-white',
        text: 'text-gray-800',
        border: 'border-gray-300',
        hover: 'hover:bg-gray-50 hover:border-purple-400',
      },
    },
    // Status colors
    status: {
      success: {
        bg: 'bg-green-50',
        text: 'text-green-800',
        border: 'border-green-200',
      },
      error: {
        bg: 'bg-red-50',
        text: 'text-red-800',
        border: 'border-red-200',
      },
      warning: {
        bg: 'bg-yellow-50',
        text: 'text-yellow-800',
        border: 'border-yellow-200',
      },
      info: {
        bg: 'bg-blue-50',
        text: 'text-blue-800',
        border: 'border-blue-200',
      },
    },
  },
  dark: {
    // Backgrounds
    bg: {
      body: 'bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950',
      surface: 'bg-gray-900',
      surfaceSubtle: 'bg-gray-800',
      card: 'bg-gray-900/90',
      cardHover: 'bg-gray-800/90',
      nav: 'bg-gray-900/90',
      input: 'bg-gray-800',
      disabled: 'bg-gray-800',
    },
    // Text colors
    text: {
      primary: 'text-gray-50',        // Main text - very light for high contrast
      secondary: 'text-gray-300',    // Secondary text - light gray
      muted: 'text-gray-400',        // Muted text - medium gray
      inverted: 'text-gray-900',     // Text on light backgrounds
      link: 'text-blue-400',
      linkHover: 'text-blue-300',
    },
    // Borders
    border: {
      default: 'border-gray-700',
      hover: 'border-gray-600',
      focus: 'border-purple-400',
      card: 'border-gray-800',
    },
    // Buttons
    button: {
      primary: {
        bg: 'bg-gradient-to-r from-purple-500 to-pink-500',
        text: 'text-white',
        hover: 'hover:from-purple-600 hover:to-pink-600',
      },
      secondary: {
        bg: 'bg-gray-800',
        text: 'text-gray-200',
        border: 'border-gray-700',
        hover: 'hover:bg-gray-700 hover:border-purple-400',
      },
    },
    // Status colors
    status: {
      success: {
        bg: 'bg-green-900/30',
        text: 'text-green-300',
        border: 'border-green-700',
      },
      error: {
        bg: 'bg-red-900/30',
        text: 'text-red-300',
        border: 'border-red-700',
      },
      warning: {
        bg: 'bg-yellow-900/30',
        text: 'text-yellow-300',
        border: 'border-yellow-700',
      },
      info: {
        bg: 'bg-blue-900/30',
        text: 'text-blue-300',
        border: 'border-blue-700',
      },
    },
  },
};

/**
 * Helper function to get theme-aware classes
 * Usage: className={`${getThemeClass('text.primary')} ...`}
 */
export const getThemeClass = (path, isDark = false) => {
  const theme = isDark ? themeTokens.dark : themeTokens.light;
  const keys = path.split('.');
  let value = theme;
  
  for (const key of keys) {
    value = value?.[key];
    if (!value) return '';
  }
  
  return typeof value === 'string' ? value : '';
};

/**
 * Check if dark mode is active
 */
export const isDarkMode = () => {
  return document.documentElement.classList.contains('dark') || 
         document.body.classList.contains('dark-mode');
};

