import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';
import {
  EXPANDED_TABLET_SHORTEST_SIDE,
  TABLET_SHORTEST_SIDE,
  WIDE_TABLET_SHORTEST_SIDE,
} from './breakpoints';

export type LayoutBreakpoint = 'compact' | 'regular' | 'expanded';

export type ResponsiveLayout = {
  width: number;
  height: number;
  /** System font scaling (Dynamic Type). */
  fontScale: number;
  isLandscape: boolean;
  isTablet: boolean;
  isWideTablet: boolean;
  isExpandedTablet: boolean;
  breakpoint: LayoutBreakpoint;
  shortestSide: number;
  longestSide: number;
  /**
   * When set, inner content uses this max width (centered) so forms and cards stay readable on tablet / landscape hubs.
   * Phones omit this (`null`).
   */
  contentColumnMaxWidth: number | null;
  /** Phone in landscape, slightly tighter vertical rhythm, wider horizontal comfort */
  phoneLandscapeComfort: boolean;
};

/**
 * Reactive layout snapshot (updates on rotate, resize, split-screen).
 */
export function useResponsive(): ResponsiveLayout {
  const { width, height, fontScale } = useWindowDimensions();

  return useMemo(() => {
    const isLandscape = width > height;
    const shortestSide = Math.min(width, height);
    const longestSide = Math.max(width, height);

    const isTablet = shortestSide >= TABLET_SHORTEST_SIDE;
    const isWideTablet = shortestSide >= WIDE_TABLET_SHORTEST_SIDE;
    const isExpandedTablet = shortestSide >= EXPANDED_TABLET_SHORTEST_SIDE;

    /** Phones: narrower vs typical. Tablets: larger canvas layouts. */
    const breakpoint: LayoutBreakpoint = !isTablet
      ? shortestSide <= 376
        ? 'compact'
        : 'regular'
      : 'expanded';

    const phoneLandscapeComfort = isLandscape && !isTablet;

    let contentColumnMaxWidth: number | null = null;
    if (isTablet) {
      const target = isWideTablet ? 620 : 520;
      const maxByViewport = longestSide - 48 * 2;
      contentColumnMaxWidth = Math.min(target, Math.max(400, maxByViewport));
      if (isExpandedTablet) {
        contentColumnMaxWidth = Math.min(680, contentColumnMaxWidth + 40);
      }
    }

    return {
      width,
      height,
      fontScale,
      isLandscape,
      isTablet,
      isWideTablet,
      isExpandedTablet,
      breakpoint,
      shortestSide,
      longestSide,
      contentColumnMaxWidth,
      phoneLandscapeComfort,
    };
  }, [fontScale, height, width]);
}
