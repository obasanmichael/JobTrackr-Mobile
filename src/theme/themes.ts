import type { Theme } from './types';

const radii = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  pill: 999,
  full: 9999,
} as const;

const space = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

function buildTypography(colors: Theme['colors']): Theme['typography'] {
  return {
    variants: {
      hero: { fontSize: 28, fontWeight: '700', letterSpacing: -0.4, color: colors.textPrimary },
      title: { fontSize: 22, fontWeight: '700', letterSpacing: -0.35, color: colors.textPrimary },
      subtitle: { fontSize: 17, fontWeight: '600', letterSpacing: -0.25, color: colors.textSecondary },
      body: { fontSize: 16, fontWeight: '400', lineHeight: 24, letterSpacing: -0.1, color: colors.textPrimary },
      bodySmall: { fontSize: 15, fontWeight: '400', lineHeight: 22, color: colors.textSecondary },
      caption: { fontSize: 13, fontWeight: '500', lineHeight: 18, color: colors.textMuted },
      label: {
        fontSize: 11,
        fontWeight: '600',
        letterSpacing: 0.6,
        textTransform: 'uppercase',
        color: colors.textMuted,
      },
    },
  };
}

/**
 * Aligned with job-trackr-frontend/globals.css (--primary ~ indigo/violet hsl(243deg), surfaces, borders).
 * Mobile uses hex equivalents for React Native compatibility.
 */
const lightColors: Theme['colors'] = {
  background: '#FFFFFF',
  surface: '#FFFFFF',
  surfaceElevated: '#F8FAFC',
  border: '#E2E8F0',
  borderMuted: '#F1F5F9',
  textPrimary: '#020617',
  textSecondary: '#475569',
  textMuted: '#64748B',
  accent: '#6366F1',
  accentMuted: '#EEF2FF',
  onAccent: '#FFFFFF',
  success: '#16A34A',
  warning: '#D97706',
  danger: '#DC2626',
  overlay: 'rgba(2, 6, 23, 0.45)',
};

const darkColors: Theme['colors'] = {
  background: '#020617',
  surface: '#0F172A',
  surfaceElevated: '#1E293B',
  border: '#273449',
  borderMuted: '#1E293B',
  textPrimary: '#F8FAFC',
  textSecondary: '#CBD5F5',
  textMuted: '#94A3B8',
  accent: '#818CF8',
  accentMuted: 'rgba(99, 102, 241, 0.22)',
  onAccent: '#FFFFFF',
  success: '#4ADE80',
  warning: '#FBBF24',
  danger: '#F87171',
  overlay: 'rgba(2, 6, 23, 0.72)',
};

export const lightTheme: Theme = {
  mode: 'light',
  colors: lightColors,
  shadows: {
    tabBar: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.09,
      shadowRadius: 20,
      elevation: 12,
    },
    card: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 10,
      elevation: 2,
    },
  },
  radii,
  space,
  typography: buildTypography(lightColors),
};

export const darkTheme: Theme = {
  mode: 'dark',
  colors: darkColors,
  shadows: {
    tabBar: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.45,
      shadowRadius: 24,
      elevation: 16,
    },
    card: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 12,
      elevation: 4,
    },
  },
  radii,
  space,
  typography: buildTypography(darkColors),
};

export function themeFor(mode: Theme['mode']): Theme {
  return mode === 'dark' ? darkTheme : lightTheme;
}
