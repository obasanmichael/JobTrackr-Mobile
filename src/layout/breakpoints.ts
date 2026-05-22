/**
 * Short edge >= ~600 logical px → treat as tablet (Material “sw600dp”; covers iPads in portrait).
 */
export const TABLET_SHORTEST_SIDE = 600;

/** Larger tablets / roomy split-view, widen readable column slightly */
export const WIDE_TABLET_SHORTEST_SIDE = 720;

/** Very wide shortest edge (large iPad Pro, some foldables unfolded), cap content + gutters */
export const EXPANDED_TABLET_SHORTEST_SIDE = 900;
