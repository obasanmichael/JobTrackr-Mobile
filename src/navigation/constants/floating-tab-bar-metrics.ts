/** Height of tap row inside floating tab pill */
export const FLOATING_TAB_BAR_INNER_HEIGHT = 52;
/** Space between floating bar and device bottom inset */
export const FLOATING_TAB_BAR_BOTTOM_MARGIN = 12;

/** Total bottom reserve for scrollable tab scenes (floating bar + margin + fudge). */
export function floatingTabVerticalReserve(bottomSafeInset: number): number {
  return bottomSafeInset + FLOATING_TAB_BAR_BOTTOM_MARGIN + FLOATING_TAB_BAR_INNER_HEIGHT + 8;
}
