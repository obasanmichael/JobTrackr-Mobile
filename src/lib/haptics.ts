import * as Haptics from 'expo-haptics';

/** Short taps on primary actions (forms). Safe no-op when haptics aren’t available. */
export async function hapticLightImpact(): Promise<void> {
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  } catch {
    /* Simulator / unsupported devices */
  }
}
